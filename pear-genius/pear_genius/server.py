"""FastAPI server for Pear Genius with SSE streaming."""

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
from pydantic import BaseModel
from sse_starlette.sse import EventSourceResponse

# Suppress spurious "Session termination failed: 202" warning from MCP client
from .main import MCPSessionTerminationFilter

logging.getLogger("mcp.client.streamable_http").addFilter(MCPSessionTerminationFilter())

from .agents.supervisor import create_agent_graph, get_last_ai_response
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
_graph_lock = asyncio.Lock()
_sessions: dict[str, "SessionData"] = {}


class SessionData:
    def __init__(self, state: AgentState, welcome_message: str):
        self.state = state
        self.welcome_message = welcome_message
        self.lock = asyncio.Lock()


async def get_shared_graph():
    """Get or create the shared compiled graph (MCP tools loaded once)."""
    global _shared_graph
    if _shared_graph is None:
        async with _graph_lock:
            if _shared_graph is None:
                _shared_graph = await create_agent_graph()
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


# --- Endpoints ---


@app.get("/api/health")
async def health_check():
    return {"status": "ok", "service": "pear-genius"}


@app.post("/api/chat/sessions", response_model=SessionResponse)
async def create_session():
    """Create a new chat session with a test customer."""
    graph = await get_shared_graph()

    customer = create_test_customer_context(
        customer_id="cust-001",
        email="john.smith@email.com",
        name="John Smith",
        tier=CustomerTier.PLUS,
    )
    customer.recent_orders = [
        {"id": "ORD-2024-001", "date": "2024-01-15", "status": "delivered"},
        {"id": "ORD-2024-003", "date": "2024-01-20", "status": "shipped"},
    ]
    customer.registered_devices = [
        {"id": "DEV-001", "name": "John's PearPhone 16 Pro", "serial": "PEAR-PPH16-2024-001234"},
        {"id": "DEV-002", "name": "John's PearPods Pro 2", "serial": "PEAR-PPP2-2024-005678"},
    ]

    session_id = str(uuid.uuid4())
    state = AgentState(
        session_id=session_id,
        customer=customer,
        is_authenticated=True,
    )

    welcome_message = (
        f"Hello {customer.name}! I'm Pear Genius, your personal support assistant. "
        f"I can help you with orders, returns, warranty questions, troubleshooting, "
        f"and more. How can I assist you today?"
    )

    _sessions[session_id] = SessionData(state=state, welcome_message=welcome_message)
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

    return SessionInfoResponse(
        session_id=session_id,
        turn_count=session.state.turn_count,
        is_escalated=session.state.needs_escalation,
        message_count=len(session.state.messages),
    )


@app.post("/api/chat/sessions/{session_id}/messages")
async def send_message(session_id: str, request: SendMessageRequest):
    """Send a message and stream the response via SSE."""
    session = _sessions.get(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    graph = await get_shared_graph()

    async def event_generator():
        async with session.lock:
            # Add user message to state
            session.state.messages.append(HumanMessage(content=request.message))

            accumulated_text = ""
            final_output = None

            # --- Tracking ---
            turn_start = time.monotonic()
            tool_calls: list[dict] = []  # {name, start, end, duration_ms}
            llm_invocations = 0
            _active_tools: dict[str, float] = {}  # run_id -> start time

            logger.info(
                "Turn started",
                session_id=session_id,
                turn=session.state.turn_count + 1,
                user_message=request.message[:120],
            )

            try:
                async for event in graph.astream_events(
                    session.state, version="v2"
                ):
                    kind = event.get("event", "")

                    # Capture the final graph output state from the root chain
                    if kind == "on_chain_end" and event.get("name") == "LangGraph":
                        final_output = event.get("data", {}).get("output")

                    elif kind == "on_chat_model_start":
                        llm_invocations += 1

                    elif kind == "on_chat_model_stream":
                        chunk = event.get("data", {}).get("chunk")
                        if chunk and isinstance(chunk, AIMessage):
                            content = chunk.content
                            # Handle string content (actual text tokens)
                            if isinstance(content, str) and content:
                                accumulated_text += content
                                yield {
                                    "data": json.dumps(
                                        {"type": "token", "content": content}
                                    )
                                }
                            # Handle list content (may contain text blocks)
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

                # Stream completed — update state from captured output
                if final_output:
                    session.state = (
                        AgentState(**final_output)
                        if isinstance(final_output, dict)
                        else final_output
                    )

            except BaseException as e:
                if final_output:
                    # Graph completed and we captured the final state — this is
                    # just an MCP transport cleanup error (e.g. session teardown).
                    # Update state and continue normally.
                    session.state = (
                        AgentState(**final_output)
                        if isinstance(final_output, dict)
                        else final_output
                    )
                    logger.debug(
                        "Suppressed stream cleanup error (graph completed successfully)",
                        error=str(e),
                        session_id=session_id,
                    )
                elif accumulated_text:
                    # Got a response but no final state — append manually so
                    # conversation history is preserved for the next turn.
                    session.state.messages.append(AIMessage(content=accumulated_text))
                    logger.warning(
                        "Stream error after partial response, state reconstructed from accumulated text",
                        error=str(e),
                        session_id=session_id,
                    )
                else:
                    # Stream failed before producing any response — fall back
                    # to non-streaming invoke.
                    logger.warning(
                        "Stream failed, falling back to invoke",
                        error=str(e),
                        session_id=session_id,
                    )
                    try:
                        result = await graph.ainvoke(session.state)
                        session.state = (
                            AgentState(**result)
                            if isinstance(result, dict)
                            else result
                        )
                        response = get_last_ai_response(session.state)
                        if response:
                            yield {
                                "data": json.dumps(
                                    {"type": "token", "content": response}
                                )
                            }
                    except BaseException as fallback_err:
                        logger.error(
                            "Fallback invoke also failed",
                            error=str(fallback_err),
                            session_id=session_id,
                        )
                        yield {
                            "data": json.dumps(
                                {"type": "error", "content": "An error occurred processing your request."}
                            )
                        }

            # --- Turn summary log ---
            turn_duration_ms = round((time.monotonic() - turn_start) * 1000)
            logger.info(
                "Turn completed",
                session_id=session_id,
                turn=session.state.turn_count,
                duration_ms=turn_duration_ms,
                llm_invocations=llm_invocations,
                tool_calls_count=len(tool_calls),
                tool_calls=[
                    {"tool": tc["name"], "ms": tc["duration_ms"]}
                    for tc in tool_calls
                ],
                response_length=len(accumulated_text),
                escalated=session.state.needs_escalation,
            )

            # Check if escalation occurred
            if session.state.needs_escalation:
                reason = (
                    session.state.escalation_reason.value
                    if session.state.escalation_reason
                    else "unknown"
                )
                yield {
                    "data": json.dumps(
                        {
                            "type": "escalation",
                            "reason": reason,
                        }
                    )
                }

            yield {"data": json.dumps({"type": "done"})}

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
