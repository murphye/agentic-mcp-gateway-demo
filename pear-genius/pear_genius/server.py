"""FastAPI server for Pear Genius with SSE streaming and human-in-the-loop approval."""

import asyncio
import json
import logging
import time
import uuid

import structlog
import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from langchain_core.messages import AIMessage, HumanMessage
from langgraph.types import Command
from pydantic import BaseModel
from sse_starlette.sse import EventSourceResponse

# Suppress spurious "Session termination failed: 202" warning from MCP client
from .main import MCPSessionTerminationFilter

logging.getLogger("mcp.client.streamable_http").addFilter(MCPSessionTerminationFilter())

from .agents.agent import create_agent_graph
from .auth.keycloak import create_test_customer_context
from .config import settings
from .state.conversation import AgentState, CustomerTier

logger = structlog.get_logger()

# --- FastAPI App ---

app = FastAPI(title="Pear Genius API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Session Manager ---

_shared_graph = None
_shared_checkpointer = None
_graph_lock = asyncio.Lock()
_sessions: dict[str, "SessionData"] = {}


class SessionData:
    """Lightweight session metadata. Graph state lives in the checkpointer."""

    def __init__(self, welcome_message: str, customer_id: str, customer=None):
        self.welcome_message = welcome_message
        self.customer_id = customer_id
        self.customer = customer
        self.lock = asyncio.Lock()
        self.is_first_message = True


async def get_shared_graph():
    """Get or create the shared compiled graph (MCP tools loaded once)."""
    global _shared_graph, _shared_checkpointer
    if _shared_graph is None:
        async with _graph_lock:
            if _shared_graph is None:
                _shared_graph, _shared_checkpointer = await create_agent_graph()
                logger.info("Shared agent graph created with MCP tools")
    return _shared_graph


# --- Request / Response Models ---


class SendMessageRequest(BaseModel):
    message: str


class SessionResponse(BaseModel):
    session_id: str
    welcome_message: str


class SessionInfoResponse(BaseModel):
    session_id: str
    turn_count: int
    is_escalated: bool
    message_count: int


# --- Shared SSE stream helper ---


async def _stream_graph_events(graph, input_data, config, session_id: str):
    """
    Shared SSE generator for /messages, /approve, and /reject.

    Streams token/tool events, then checks for interrupts (approval_required).
    """
    accumulated_text = ""

    # --- Tracking ---
    turn_start = time.monotonic()
    tool_calls: list[dict] = []
    llm_invocations = 0
    _active_tools: dict[str, float] = {}

    logger.info(
        "Stream started",
        session_id=session_id,
    )

    try:
        async for event in graph.astream_events(
            input_data, config=config, version="v2"
        ):
            kind = event.get("event", "")

            if kind == "on_chat_model_start":
                llm_invocations += 1

            elif kind == "on_chat_model_stream":
                chunk = event.get("data", {}).get("chunk")
                if chunk and isinstance(chunk, AIMessage):
                    content = chunk.content
                    if isinstance(content, str) and content:
                        accumulated_text += content
                        yield {
                            "data": json.dumps(
                                {"type": "token", "content": content}
                            )
                        }
                    elif isinstance(content, list):
                        for item in content:
                            if isinstance(item, dict) and item.get("type") == "text":
                                text = item.get("text", "")
                                if text:
                                    accumulated_text += text
                                    yield {
                                        "data": json.dumps(
                                            {"type": "token", "content": text}
                                        )
                                    }

            elif kind == "on_tool_start":
                tool_name = event.get("name", "unknown")
                run_id = event.get("run_id", "")
                _active_tools[run_id] = time.monotonic()
                display_name = (
                    tool_name.split("_", 1)[-1]
                    if "_" in tool_name
                    else tool_name
                )
                logger.info(
                    "Tool call started",
                    tool=tool_name,
                    session_id=session_id,
                )
                yield {
                    "data": json.dumps(
                        {"type": "tool_start", "tool": display_name}
                    )
                }

            elif kind == "on_tool_end":
                tool_name = event.get("name", "unknown")
                run_id = event.get("run_id", "")
                tool_start = _active_tools.pop(run_id, None)
                duration_ms = (
                    round((time.monotonic() - tool_start) * 1000)
                    if tool_start
                    else None
                )
                tool_calls.append(
                    {"name": tool_name, "duration_ms": duration_ms}
                )
                display_name = (
                    tool_name.split("_", 1)[-1]
                    if "_" in tool_name
                    else tool_name
                )
                logger.info(
                    "Tool call completed",
                    tool=tool_name,
                    duration_ms=duration_ms,
                    session_id=session_id,
                )
                yield {
                    "data": json.dumps(
                        {"type": "tool_end", "tool": display_name}
                    )
                }

    except BaseException as e:
        if accumulated_text:
            logger.warning(
                "Stream error after partial response",
                error=str(e),
                session_id=session_id,
            )
        else:
            logger.error(
                "Stream failed",
                error=str(e),
                session_id=session_id,
            )
            yield {
                "data": json.dumps(
                    {"type": "error", "content": "An error occurred processing your request."}
                )
            }

    # --- Check for interrupts (approval required) ---
    try:
        graph_state = await graph.aget_state(config)
        if graph_state and graph_state.tasks:
            for task in graph_state.tasks:
                if hasattr(task, "interrupts") and task.interrupts:
                    for intr in task.interrupts:
                        interrupt_value = intr.value
                        if isinstance(interrupt_value, dict) and interrupt_value.get("action") == "approve_tool_calls":
                            logger.info(
                                "Approval required event sent",
                                session_id=session_id,
                                actions=[a["tool_name"] for a in interrupt_value.get("actions", [])],
                            )
                            yield {
                                "data": json.dumps({
                                    "type": "approval_required",
                                    "actions": interrupt_value.get("actions", []),
                                })
                            }
    except Exception as e:
        logger.warning("Failed to check graph state for interrupts", error=str(e))

    # --- Turn summary log ---
    turn_duration_ms = round((time.monotonic() - turn_start) * 1000)
    logger.info(
        "Stream completed",
        session_id=session_id,
        duration_ms=turn_duration_ms,
        llm_invocations=llm_invocations,
        tool_calls_count=len(tool_calls),
        tool_calls=[
            {"tool": tc["name"], "ms": tc["duration_ms"]}
            for tc in tool_calls
        ],
        response_length=len(accumulated_text),
    )

    yield {"data": json.dumps({"type": "done"})}


# --- Endpoints ---


@app.get("/api/health")
async def health_check():
    return {"status": "ok", "service": "pear-genius"}


@app.post("/api/chat/sessions", response_model=SessionResponse)
async def create_session():
    """Create a new chat session with a test customer."""
    await get_shared_graph()

    customer = create_test_customer_context(
        customer_id="cust-010",
        email="jennifer.martinez@email.com",
        name="Jennifer Martinez",
        tier=CustomerTier.PLUS,
    )

    session_id = str(uuid.uuid4())

    welcome_message = (
        f"Hello {customer.name}! I'm Pear Genius, your personal support assistant. "
        f"I can help you with orders, returns, warranty questions, troubleshooting, "
        f"and more. How can I assist you today?"
    )

    _sessions[session_id] = SessionData(
        welcome_message=welcome_message,
        customer_id=customer.customer_id,
        customer=customer,
    )

    logger.info(
        "Session created",
        session_id=session_id,
        customer_id=customer.customer_id,
        customer_name=customer.name,
        customer_tier=customer.tier.value,
    )

    return SessionResponse(session_id=session_id, welcome_message=welcome_message)


@app.get("/api/chat/sessions/{session_id}", response_model=SessionInfoResponse)
async def get_session(session_id: str):
    """Get session info."""
    session = _sessions.get(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    graph = await get_shared_graph()
    config = {"configurable": {"thread_id": session_id}}

    # Get state from checkpointer
    try:
        graph_state = await graph.aget_state(config)
        state_values = graph_state.values if graph_state else {}
        turn_count = state_values.get("turn_count", 0)
        needs_escalation = state_values.get("needs_escalation", False)
        messages = state_values.get("messages", [])
    except Exception:
        turn_count = 0
        needs_escalation = False
        messages = []

    return SessionInfoResponse(
        session_id=session_id,
        turn_count=turn_count,
        is_escalated=needs_escalation,
        message_count=len(messages),
    )


@app.post("/api/chat/sessions/{session_id}/messages")
async def send_message(session_id: str, request: SendMessageRequest):
    """Send a message and stream the response via SSE."""
    session = _sessions.get(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    graph = await get_shared_graph()
    config = {"configurable": {"thread_id": session_id}}

    async def event_generator():
        async with session.lock:
            if session.is_first_message:
                # First message: seed the checkpointer with full AgentState
                customer = session.customer
                input_data = AgentState(
                    session_id=session_id,
                    customer=customer,
                    is_authenticated=customer is not None,
                    messages=[HumanMessage(content=request.message)],
                )
                session.is_first_message = False
            else:
                # Subsequent messages: pass only new message
                input_data = {"messages": [HumanMessage(content=request.message)]}

            logger.info(
                "Turn started",
                session_id=session_id,
                user_message=request.message[:120],
                is_first=not session.is_first_message,
            )

            async for sse_event in _stream_graph_events(graph, input_data, config, session_id):
                yield sse_event

    return EventSourceResponse(event_generator())


@app.post("/api/chat/sessions/{session_id}/approve")
async def approve_action(session_id: str):
    """Approve pending tool calls and resume the graph."""
    session = _sessions.get(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    graph = await get_shared_graph()
    config = {"configurable": {"thread_id": session_id}}

    async def event_generator():
        async with session.lock:
            logger.info("User approved action", session_id=session_id)
            input_data = Command(resume={"approved": True})

            async for sse_event in _stream_graph_events(graph, input_data, config, session_id):
                yield sse_event

    return EventSourceResponse(event_generator())


@app.post("/api/chat/sessions/{session_id}/reject")
async def reject_action(session_id: str):
    """Reject pending tool calls and resume the graph."""
    session = _sessions.get(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    graph = await get_shared_graph()
    config = {"configurable": {"thread_id": session_id}}

    async def event_generator():
        async with session.lock:
            logger.info("User rejected action", session_id=session_id)
            input_data = Command(resume={"approved": False})

            async for sse_event in _stream_graph_events(graph, input_data, config, session_id):
                yield sse_event

    return EventSourceResponse(event_generator())


# --- Server Entry Point ---
# Run with: uv run python -m pear_genius.server


if __name__ == "__main__":
    if not settings.anthropic_api_key:
        print("Error: ANTHROPIC_API_KEY environment variable is required")
        print("Please set it in your .env file or environment")
    else:
        print(f"Starting Pear Genius API on {settings.server_host}:{settings.server_port}")
        uvicorn.run(
            "pear_genius.server:app",
            host=settings.server_host,
            port=settings.server_port,
            reload=settings.debug,
        )
