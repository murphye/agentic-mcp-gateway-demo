# Pear Genius: Building a Customer Support Agent with LangGraph and MCP

A deep dive into the design, technology, and implementation of an agentic AI customer support system that orchestrates backend microservices through the Model Context Protocol (MCP), with human-in-the-loop approval for state-changing actions.

---

## Table of Contents

1. [Overview](#overview)
2. [System Architecture](#system-architecture)
3. [LangGraph Primer](#langgraph-primer)
4. [Agent Graph Design](#agent-graph-design)
5. [Conversation State](#conversation-state)
6. [MCP Tools and the LangChain Integration](#mcp-tools-and-the-langchain-integration)
7. [Human-in-the-Loop Approval](#human-in-the-loop-approval)
8. [SSE Streaming and the Server](#sse-streaming-and-the-server)
9. [Backend Services](#backend-services)
10. [Escalation Logic](#escalation-logic)
11. [Frontend Integration](#frontend-integration)
12. [Example Flows](#example-flows)
13. [Running the Project](#running-the-project)

---

## Overview

**Pear Genius** is a conversational AI agent that provides customer support for "Pear Computer" (a fictional company). When a customer asks about their orders, requests a return, or needs warranty help, the agent autonomously calls backend microservices to look up data and take action — while requiring human approval before executing destructive operations like canceling an order.

The agent is built with three key technologies:

| Technology | Role |
|---|---|
| **LangGraph** | Orchestrates the agent as a stateful graph with looping, branching, and interrupt/resume |
| **MCP (Model Context Protocol)** | Connects the LLM to 28 backend service operations via a standardized tool protocol |
| **AgentGateway** | A Rust proxy that reads OpenAPI specs from microservices and exposes them as MCP tools |

The result is an architecture where the LLM never talks directly to REST APIs. Instead, it calls MCP tools (like `order-management_getOrder`), and AgentGateway translates those into the actual HTTP requests. This decouples the agent from backend implementation details.

---

## System Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│  Frontend (pear-store)                                                 │
│  Next.js + Zustand + SSE streaming                      Port 3001     │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │  HTTP + SSE
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│  Agent Server (pear-genius)                                            │
│  FastAPI + LangGraph + Claude LLM                       Port 8000     │
│                                                                        │
│  ┌──────────────────────────────────────────────────────────────┐      │
│  │  LangGraph State Machine                                     │      │
│  │                                                               │      │
│  │  agent ──→ should_continue ──→ approval_gate ──→ tools ──→ agent    │
│  │    │                              │                                 │
│  │    └──→ END                       └──→ interrupt() ──→ resume       │
│  └──────────────────────────────────────────────────────────────┘      │
│                              │                                         │
│                              │ MCP (streamable-HTTP)                   │
│                              ▼                                         │
└────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│  AgentGateway (Rust proxy)                              Port 3000     │
│  Reads OpenAPI specs → Exposes as MCP tools                            │
│  POST /mcp (streamable-HTTP transport)                                 │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │  REST API calls
                                    ▼
┌──────────┬──────────┬──────────┬──────────┬──────────┬──────────┐
│  order-  │ product- │customer- │shipping  │product-  │physical- │
│  mgmt    │ support  │ accounts │          │ catalog  │ stores   │
│  :8081   │  :8083   │  :8084   │  :8082   │  :8085   │  :8087   │
└──────────┴──────────┴──────────┴──────────┴──────────┴──────────┘
        Express/Node.js microservices (OpenAPI-first)
```

**Data flow for a single user message:**

1. User types "Cancel my order" in the Next.js chat UI
2. Frontend POSTs to `/api/chat/sessions/{id}/messages`
3. FastAPI server invokes the LangGraph state machine
4. The `agent` node calls Claude with conversation history + MCP tools
5. Claude decides to call `order-management_cancelOrder` (a high-risk tool)
6. The `approval_gate` node calls `interrupt()` — the graph pauses
7. Server streams an `approval_required` SSE event to the frontend
8. Frontend shows an inline approval card with action details
9. User clicks "Approve" → frontend POSTs to `/api/chat/sessions/{id}/approve`
10. Server resumes the graph with `Command(resume={"approved": True})`
11. The `tools` node executes the cancellation via MCP → AgentGateway → order-management
12. The `agent` node runs again, Claude generates a confirmation message
13. Response streams back as SSE `token` events

---

## LangGraph Primer

If you're new to LangGraph, here are the core concepts this project uses:

### What is LangGraph?

LangGraph is a framework for building stateful, multi-step AI applications as **directed graphs**. Unlike a simple "call the LLM once and return" pattern, LangGraph lets you:

- **Loop**: The agent can call tools, see results, and decide to call more tools
- **Branch**: Different paths based on conditions (e.g., escalate vs. continue)
- **Persist state**: A checkpointer saves conversation state between HTTP requests
- **Interrupt and resume**: Pause execution to wait for human input, then continue

### Key Concepts

| Concept | What it means |
|---|---|
| **StateGraph** | The graph definition — you add nodes and edges to it |
| **Node** | A function that receives state and returns state updates |
| **Edge** | A connection between nodes (can be conditional) |
| **State** | A Pydantic model that flows through the graph, accumulating data |
| **Checkpointer** | Persists state between invocations (we use `MemorySaver`) |
| **`interrupt()`** | Pauses the graph mid-execution, waiting for external input |
| **`Command(resume=...)`** | Resumes a paused graph with data from the outside world |
| **`add_messages` reducer** | Tells LangGraph to *append* new messages instead of replacing |

### Minimal Example

```python
from langgraph.graph import StateGraph, END
from langgraph.checkpoint.memory import MemorySaver

# 1. Define state
class MyState(BaseModel):
    messages: Annotated[list, add_messages] = []

# 2. Define nodes (functions that take state, return updates)
async def my_agent(state: MyState) -> dict:
    response = await llm.ainvoke(state.messages)
    return {"messages": [response]}

# 3. Build the graph
graph = StateGraph(MyState)
graph.add_node("agent", my_agent)
graph.set_entry_point("agent")
graph.add_edge("agent", END)

# 4. Compile with a checkpointer
app = graph.compile(checkpointer=MemorySaver())

# 5. Invoke (state persists across calls via thread_id)
result = await app.ainvoke(
    {"messages": [HumanMessage("Hello")]},
    config={"configurable": {"thread_id": "session-1"}}
)
```

Pear Genius builds on this foundation with tool calling, conditional routing, and interrupt-based approval.

---

## Agent Graph Design

The Pear Genius graph has three nodes and uses conditional edges to route between them:

```
                         ┌─────────┐
                         │  START  │
                         └────┬────┘
                              │
                              ▼
                        ┌───────────┐
                   ┌───→│   agent   │◄────────────────────────────────┐
                   │    └─────┬─────┘                                 │
                   │          │                                       │
                   │          ▼                                       │
                   │   should_continue()                              │
                   │      │         │                                 │
                   │      │ tool    │ no tool                         │
                   │      │ calls   │ calls                           │
                   │      ▼         ▼                                 │
                   │ ┌──────────┐ ┌─────┐                             │
                   │ │ approval │ │ END │                             │
                   │ │  _gate   │ └─────┘                             │
                   │ └─────┬────┘                                     │
                   │       │                                          │
                   │       ▼                                          │
                   │ route_after_approval()                           │
                   │    │           │                                  │
                   │    │approved   │rejected                          │
                   │    ▼           └──────────────────────────────────┘
                   │ ┌─────────┐
                   │ │  tools  │
                   │ └────┬────┘
                   │      │
                   └──────┘
```

Here is the actual graph construction code:

```python
async def create_agent_graph():
    tools = await get_all_tools()              # Load MCP tools from AgentGateway
    agent = PearGeniusAgent(tools=tools)        # LLM with tools bound
    tool_node = ToolNode(tools)                 # LangGraph's built-in tool executor
    checkpointer = MemorySaver()                # In-memory state persistence

    graph = StateGraph(AgentState)
    graph.add_node("agent", agent.process)      # LLM invocation
    graph.add_node("approval_gate", approval_gate)  # Human-in-the-loop check
    graph.add_node("tools", tool_node)          # Tool execution

    graph.set_entry_point("agent")
    graph.add_conditional_edges(
        "agent",
        should_continue,                         # Route based on LLM output
        {"approval_gate": "approval_gate", "end": END},
    )
    graph.add_conditional_edges(
        "approval_gate",
        route_after_approval,                    # Route based on approval decision
        {"tools": "tools", "agent": "agent"},
    )
    graph.add_edge("tools", "agent")             # After tools → back to agent

    compiled = graph.compile(checkpointer=checkpointer)
    return compiled
```

### How the `agent` node works

The `agent` node is a method on `PearGeniusAgent`. It builds a system message with customer context, prepends it to the conversation history, and calls Claude:

```python
class PearGeniusAgent:
    def __init__(self, tools):
        self.llm = ChatAnthropic(
            model="claude-sonnet-4-20250514",
            max_tokens=4096,
            temperature=0.1,
        )
        self.llm_with_tools = self.llm.bind_tools(tools)

    async def process(self, state: AgentState) -> dict:
        system_msg = self._build_system_message(state)
        messages = [system_msg] + state.messages

        response = await self.llm_with_tools.ainvoke(messages)

        return {
            "messages": [response],          # Appended via add_messages reducer
            "turn_count": state.turn_count + 1,
        }
```

The LLM can respond in two ways:
- **Text response**: The agent has something to say to the user → `should_continue` routes to END
- **Tool calls**: The LLM wants to call one or more MCP tools → `should_continue` routes to `approval_gate`

### The `should_continue` router

```python
def should_continue(state: AgentState) -> Literal["approval_gate", "end"]:
    if state.needs_escalation:
        return "end"

    last_message = state.messages[-1]
    if isinstance(last_message, AIMessage) and last_message.tool_calls:
        return "approval_gate"

    return "end"
```

This is a **conditional edge** — LangGraph calls it after the `agent` node to decide where to go next. If the LLM's response contains tool calls, we route to the approval gate. If it's just text (or the conversation needs escalation), we end.

---

## Conversation State

LangGraph requires a typed state object that flows between nodes. Pear Genius uses a Pydantic model:

```python
class AgentState(BaseModel):
    # Conversation messages (LangGraph's add_messages reducer appends, not replaces)
    messages: Annotated[list[BaseMessage], add_messages] = []

    # Customer context from authentication
    customer: CustomerContext | None = None

    # Escalation
    needs_escalation: bool = False
    escalation_reason: EscalationReason | None = None

    # Tracking
    session_id: str = ""
    turn_count: int = 0
    tool_results: dict[str, Any] = {}

    # Flags
    is_authenticated: bool = False
    approval_rejected: bool = False
```

**The `add_messages` reducer** is crucial. When a node returns `{"messages": [new_msg]}`, LangGraph doesn't replace the messages list — it *appends* `new_msg` to the existing list. This is how conversation history accumulates across the agent/tools loop.

**`CustomerContext`** carries the authenticated customer's profile:

```python
class CustomerContext(BaseModel):
    customer_id: str           # e.g., "cust-010"
    email: str
    name: str                  # e.g., "Jennifer Martinez"
    tier: CustomerTier         # STANDARD, PLUS, or PREMIER
    recent_orders: list[dict]  # Populated from backend
    registered_devices: list[dict]
```

The customer context is injected into the LLM system message so it knows who it's talking to. On the first turn, full details are included. On subsequent turns, a compact reminder is used to reduce token usage (the full context is already in the message history from turn 1).

---

## MCP Tools and the LangChain Integration

### What is MCP?

The **Model Context Protocol (MCP)** is an open standard for connecting LLMs to external tools and data sources. Instead of writing custom tool definitions for each API endpoint, MCP provides a standardized interface:

```
LLM ──→ MCP Client ──→ MCP Server ──→ Backend API
```

In this project:
- The **MCP Client** is `langchain-mcp-adapters` (a LangChain integration)
- The **MCP Server** is AgentGateway (a Rust proxy)
- AgentGateway reads OpenAPI specs from backend microservices and automatically generates MCP tools

### How tools are loaded

At startup, the agent loads all available tools from AgentGateway:

```python
from langchain_mcp_adapters.client import MultiServerMCPClient

def create_mcp_client() -> MultiServerMCPClient:
    return MultiServerMCPClient({
        "agentgateway": {
            "transport": "streamable_http",
            "url": "http://localhost:3000/mcp",
        }
    })

async def load_mcp_tools() -> list[BaseTool]:
    client = create_mcp_client()
    all_tools = await client.get_tools()   # Returns LangChain BaseTool objects

    # Filter to essential tools (28 of 50+) to reduce token usage
    tools = [t for t in all_tools if t.name in ESSENTIAL_TOOLS]

    # Wrap for resilience (see below)
    tools = _make_resilient_tools(tools)
    return tools
```

Each tool is a standard LangChain `BaseTool` with a name, description, and JSON schema. When Claude calls a tool, LangGraph's `ToolNode` executes it via MCP → AgentGateway → REST API.

### Tool naming convention

AgentGateway names tools as `{service}_{operation}`:

```
order-management_getOrder          → GET /orders/{orderId}
order-management_createReturn      → POST /returns
product-support_checkWarranty      → GET /warranty/coverage/{serialNumber}
shipping_trackShipment             → GET /tracking/{trackingNumber}
```

### Essential tools whitelist

To keep context window usage reasonable, only 28 tools are loaded:

```python
ESSENTIAL_TOOLS = [
    # Order management
    "order-management_getOrder",
    "order-management_listOrders",
    "order-management_getOrderTracking",
    "order-management_checkReturnEligibility",
    "order-management_createReturn",
    "order-management_cancelOrder",
    # Shipping
    "shipping_getShipment",
    "shipping_trackShipment",
    # Product support
    "product-support_checkWarranty",
    "product-support_searchArticles",
    "product-support_runDiagnostics",
    "product-support_scheduleRepair",
    # Customer accounts
    "customer-accounts_getProfile",
    "customer-accounts_listDevices",
    # ... and more
]
```

### Path and query parameter handling

AgentGateway translates OpenAPI path/query parameters into nested JSON. The LLM must use the correct nesting:

```json
// To call GET /orders/{orderId}:
{"path": {"orderId": "ORD-2024-011"}}

// To call GET /orders/customer/{customerId}:
{"path": {"customerId": "cust-010"}}
```

This is enforced via instructions in the system prompt.

### Workaround: ExceptionGroup resilience

The MCP streamable-HTTP transport uses Python's `asyncio.TaskGroup` internally. During tool invocation, transport errors raise `BaseExceptionGroup` — a `BaseException` subclass that **bypasses** normal `except Exception` handling and kills the LangGraph stream.

The fix wraps each tool's coroutine to catch and convert the exception:

```python
def _make_resilient_tools(tools: list[BaseTool]) -> list[BaseTool]:
    for tool in tools:
        if tool.coroutine is None:
            continue
        original = tool.coroutine

        async def _resilient(*args, _orig=original, _name=tool.name, **kwargs):
            try:
                return await _orig(*args, **kwargs)
            except BaseExceptionGroup as eg:
                return (
                    f"Error: the call to {_name} was interrupted by a "
                    f"connection error. Please retry the tool call.",
                    None,
                )

        tool.coroutine = _resilient
    return tools
```

Now the agent sees the error message and can retry or explain the failure to the customer.

### Workaround: structuredContent patch

AgentGateway returns tool results in `structuredContent` (a field the `langchain-mcp-adapters` library ignores by default). A monkey-patch intercepts the conversion function:

```python
def _patched_convert_call_tool_result(result):
    structured = getattr(result, 'structuredContent', None)
    content = getattr(result, 'content', None)

    if (not content or content == []) and structured:
        content_str = json.dumps(structured, indent=2)
        return (content_str, structured)

    # ... fall back to normal content handling
```

### Tool caching

Tools are loaded once and cached in memory with async-safe double-checked locking:

```python
_tools_cache: list[BaseTool] | None = None
_tools_lock = asyncio.Lock()

async def get_all_tools(force_refresh=False) -> list[BaseTool]:
    global _tools_cache
    if _tools_cache is None or force_refresh:
        async with _tools_lock:
            if _tools_cache is None or force_refresh:
                _tools_cache = await load_mcp_tools()
    return _tools_cache
```

---

## Human-in-the-Loop Approval

This is the key differentiator from a simple LLM-with-tools loop. Certain actions are too risky to execute automatically:

```python
HIGH_RISK_TOOLS = {
    "order-management_cancelOrder",
    "order-management_createReturn",
    "product-support_scheduleRepair",
}
```

### The approval_gate node

When the LLM requests a high-risk tool call, the `approval_gate` node pauses the graph using LangGraph's `interrupt()`:

```python
def approval_gate(state: AgentState):
    last_message = state.messages[-1]
    if not isinstance(last_message, AIMessage) or not last_message.tool_calls:
        return state  # Pass through

    high_risk_calls = [
        tc for tc in last_message.tool_calls if tc["name"] in HIGH_RISK_TOOLS
    ]
    if not high_risk_calls:
        return state  # No high-risk tools, pass through

    # Build human-readable action descriptions
    actions = []
    for tc in high_risk_calls:
        actions.append({
            "tool_call_id": tc["id"],
            "tool_name": tc["name"],
            "title": _format_tool_title(tc["name"]),   # "Create Return"
            "description": _build_action_description(tc, state.messages),
        })

    # PAUSE the graph — this is where interrupt() is called
    decision = interrupt({
        "action": "approve_tool_calls",
        "actions": actions,
    })

    # Graph resumes here when the user responds
    if decision.get("approved"):
        return state  # Pass through to tools node
    else:
        # Inject rejection ToolMessages
        rejection_messages = []
        high_risk_ids = {tc["id"] for tc in high_risk_calls}
        for tc in last_message.tool_calls:
            if tc["id"] in high_risk_ids:
                rejection_messages.append(ToolMessage(
                    content="Action was rejected by the customer.",
                    tool_call_id=tc["id"],
                ))
            else:
                rejection_messages.append(ToolMessage(
                    content="This action was skipped. You may retry it.",
                    tool_call_id=tc["id"],
                ))
        return Command(update={
            "messages": rejection_messages,
            "approval_rejected": True,
        })
```

**Key insight**: `interrupt()` is not a normal function call. When it executes, the graph *stops* and control returns to the server. The interrupt value (the action details) is stored in the graph's checkpoint. Later, when the user approves or rejects, the server resumes the graph with `Command(resume={"approved": True/False})`, and execution continues from the line after `interrupt()`.

### Action description builders

The approval card shows human-readable details, not raw JSON. Description builders look up order data from the conversation history:

```python
def _describe_create_return(args, messages):
    order = _find_order_in_history(args["orderId"], messages)
    # Returns lines like:
    # "PearPhone 16 Pro — $1,199.99"
    # "Reason: other"
    # "Refund of $1,199.99 to Visa ending in 4821"
```

### Routing after approval

```python
def route_after_approval(state: AgentState) -> Literal["tools", "agent"]:
    if state.approval_rejected:
        return "agent"    # Agent acknowledges rejection
    return "tools"        # Proceed to execute the tools
```

---

## SSE Streaming and the Server

The FastAPI server streams responses token-by-token using Server-Sent Events (SSE).

### Endpoints

| Method | Path | Purpose |
|---|---|---|
| `POST` | `/api/chat/sessions` | Create a new session |
| `GET` | `/api/chat/sessions/{id}` | Get session info |
| `POST` | `/api/chat/sessions/{id}/messages` | Send message (returns SSE stream) |
| `POST` | `/api/chat/sessions/{id}/approve` | Approve pending action (returns SSE stream) |
| `POST` | `/api/chat/sessions/{id}/reject` | Reject pending action (returns SSE stream) |

### SSE event types

The server streams these event types to the frontend:

```
data: {"type": "token", "content": "I'll "}
data: {"type": "token", "content": "look up "}
data: {"type": "token", "content": "your order."}
data: {"type": "tool_start", "tool": "getOrder"}
data: {"type": "tool_end", "tool": "getOrder"}
data: {"type": "token", "content": "Your order "}
data: {"type": "token", "content": "is on its way!"}
data: {"type": "done"}
```

For approval flows, an additional event is sent:

```
data: {"type": "approval_required", "actions": [{"title": "Create Return", ...}]}
data: {"type": "done"}
```

### The streaming implementation

A shared helper processes all three SSE endpoints (`/messages`, `/approve`, `/reject`):

```python
async def _stream_graph_events(graph, input_data, config, session_id):
    async for event in graph.astream_events(input_data, config=config, version="v2"):
        kind = event.get("event", "")

        if kind == "on_chat_model_stream":
            chunk = event["data"]["chunk"]
            if isinstance(chunk, AIMessage) and isinstance(chunk.content, str):
                yield {"data": json.dumps({"type": "token", "content": chunk.content})}

        elif kind == "on_tool_start":
            yield {"data": json.dumps({"type": "tool_start", "tool": event["name"]})}

        elif kind == "on_tool_end":
            yield {"data": json.dumps({"type": "tool_end", "tool": event["name"]})}

    # After streaming, check for interrupts (approval needed)
    graph_state = await graph.aget_state(config)
    if graph_state and graph_state.tasks:
        for task in graph_state.tasks:
            if hasattr(task, "interrupts") and task.interrupts:
                for intr in task.interrupts:
                    if intr.value.get("action") == "approve_tool_calls":
                        yield {"data": json.dumps({
                            "type": "approval_required",
                            "actions": intr.value["actions"],
                        })}

    yield {"data": json.dumps({"type": "done"})}
```

### Session management

Sessions use an `OrderedDict` with LRU eviction:

```python
MAX_SESSIONS = 100
_sessions: OrderedDict[str, SessionData] = OrderedDict()

class SessionData:
    def __init__(self, welcome_message, customer_id, customer=None):
        self.welcome_message = welcome_message
        self.customer = customer
        self.lock = asyncio.Lock()         # Serializes concurrent requests
        self.is_first_message = True       # Seed checkpointer on first message
```

Graph state (messages, turn count, escalation flags) lives in the `MemorySaver` checkpointer, keyed by `thread_id = session_id`. Session metadata is lightweight.

---

## Backend Services

AgentGateway proxies these Express/Node.js microservices, each with an OpenAPI 3.0.3 spec:

| Service | Port | Key Operations | Description |
|---|---|---|---|
| **order-management** | 8081 | `getOrder`, `cancelOrder`, `createReturn`, `checkReturnEligibility`, `getOrdersByCustomer` | Order lifecycle, returns, refunds |
| **shipping** | 8082 | `getShipment`, `trackShipment`, `listShipments` | Package tracking and logistics |
| **product-support** | 8083 | `checkWarranty`, `scheduleRepair`, `runDiagnostics`, `searchArticles`, `listFAQs` | Warranty, repairs, knowledge base |
| **customer-accounts** | 8084 | `getProfile`, `listDevices`, `listAddresses` | Profile and device management |
| **product-catalog** | 8085 | `getProduct` | Product information and specs |
| **inventory** | 8086 | `getStockBySku` | Stock level checks |
| **physical-stores** | 8087 | `getAllStores`, `getStore`, `getStoreInventory` | Store locator and inventory |
| **customer-support** | 8088 | Tickets, chat sessions, KB articles | Support ticketing |

### AgentGateway limitation

AgentGateway's MCP proxy cannot handle query-parameter-only endpoints (returns HTTP 500). Only path-parameter endpoints work. Workarounds like `GET /orders/customer/{customerId}` (path param) were added instead of using `GET /orders?customerId=cust-010` (query param).

---

## Escalation Logic

The agent checks three escalation conditions before each LLM invocation:

```python
def _check_escalation(self, state: AgentState) -> tuple[bool, str]:
    # 1. Customer explicitly requests a human
    PHRASES = ["speak to a human", "live agent", "real person", ...]
    last_human_msg = ...  # Find most recent HumanMessage
    if any(phrase in last_human_msg.lower() for phrase in PHRASES):
        return True, "customer_request"

    # 2. High-value refund (>$500)
    if state.tool_results.get("refund_amount", 0) > 500:
        return True, "high_value_refund"

    # 3. Repeated tool failures (3+ errors)
    error_count = sum(1 for msg in state.messages
                      if isinstance(msg, ToolMessage) and _has_error(msg.content))
    if error_count >= 3:
        return True, "repeated_failure"

    return False, ""
```

When escalation is triggered, the system message is augmented with escalation instructions so the LLM explains the transfer to the customer before the graph terminates:

```python
if escalation_reason:
    parts.append(
        "## ESCALATION REQUIRED\n"
        f"This conversation must be escalated (reason: {escalation_reason}). "
        "Explain to the customer why you need to transfer them to a specialist."
    )
```

---

## Frontend Integration

The frontend is a Next.js app with a React chat UI.

### API client

```typescript
// pear-genius.ts
export async function sendChatMessage(sessionId: string, message: string): Promise<Response> {
  return fetch(`${PEAR_GENIUS_URL}/api/chat/sessions/${sessionId}/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });
}

export async function approveAction(sessionId: string): Promise<Response> {
  return fetch(`${PEAR_GENIUS_URL}/api/chat/sessions/${sessionId}/approve`, {
    method: "POST",
  });
}
```

### SSE stream processing

The `useChat` hook processes SSE events from all three endpoints (`/messages`, `/approve`, `/reject`) using a shared processor:

```typescript
const processSSEStream = async (response: Response) => {
  const reader = response.body?.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const events = parseSSELines(decoder.decode(value, { stream: true }));

    for (const event of events) {
      switch (event.type) {
        case "token":
          appendToLastMessage(event.content);      // Stream text into chat
          break;
        case "tool_start":
          addActiveTool(event.tool);                // Show "Calling getOrder..."
          break;
        case "tool_end":
          removeActiveTool(event.tool);
          break;
        case "approval_required":
          setPendingApproval({ actions: event.actions });  // Show approval card
          break;
      }
    }
  }
};
```

### Zustand state store

The chat state (messages, streaming status, pending approvals) is managed with Zustand and persisted to `sessionStorage`:

```typescript
interface ChatStore {
  sessionId: string | null;
  messages: ChatMessage[];
  isStreaming: boolean;
  activeTools: string[];
  pendingApproval: PendingApproval | null;
  isAwaitingApproval: boolean;
  // ... actions
}
```

---

## Example Flows

### Flow 1: Order Lookup (no approval needed)

```
User: "What's the status of my order?"

  agent node:  Claude calls order-management_getOrdersByCustomer
               with {"path": {"customerId": "cust-010"}}
  → should_continue: tool calls detected → approval_gate
  → approval_gate: getOrdersByCustomer is NOT high-risk → pass through
  → route_after_approval: → tools
  → tools node: MCP call → AgentGateway → order-management service
               Returns 3 orders for Jennifer Martinez
  → agent node: Claude summarizes the orders

Agent: "Here are your recent orders:
        - Order #PEAR-2024-123466 — PearPhone 16 Pro — Delivered Feb 7
        - Order #PEAR-2024-123467 — PearPods Pro 3 — Processing
        - Order #PEAR-2025-134201 — PearWatch Series 10 — Delivered Oct 20, 2025"
```

### Flow 2: Return with Approval

```
User: "I want to return the PearPhone from my last order"

  agent node:  Claude calls order-management_getOrder (to look up details)
  → approval_gate: getOrder is NOT high-risk → pass through
  → tools node: fetches order ORD-2024-011
  → agent node: Claude calls order-management_checkReturnEligibility
  → tools node: returns eligible (within 14-day window)
  → agent node: Claude calls order-management_createReturn ← HIGH RISK
  → approval_gate: createReturn IS high-risk → interrupt()

  SSE event: {"type": "approval_required", "actions": [{
    "title": "Create Return",
    "description": [
      "PearPhone 16 Pro — $1,199.99",
      "Reason: other",
      "Refund of $1,199.99 to Visa ending in 4821"
    ]
  }]}

  [Frontend shows approval card]

User clicks "Approve"
  → POST /approve
  → graph resumes with Command(resume={"approved": True})
  → tools node: executes createReturn via MCP
  → agent node: Claude confirms the return

Agent: "Your return has been initiated! You'll receive a return shipping
        label at jennifer.martinez@email.com. The refund of $1,199.99
        will be processed to your Visa ending in 4821 once we receive
        the item."
```

### Flow 3: Rejection

```
User: "Cancel my PearWatch order"

  agent node: Claude calls order-management_cancelOrder ← HIGH RISK
  → approval_gate: interrupt() with action details

  [Frontend shows approval card]

User clicks "Reject"
  → POST /reject
  → graph resumes with Command(resume={"approved": False})
  → approval_gate injects rejection ToolMessages
  → route_after_approval: approval_rejected = True → agent
  → agent node: Claude acknowledges rejection

Agent: "No problem! I won't cancel your PearWatch order. Is there
        anything else I can help you with?"
```

### Flow 4: Escalation

```
User: "I want to speak to a human agent"

  agent node: _check_escalation detects "speak to a human"
              → sets needs_escalation = True
              → injects ESCALATION REQUIRED into system message
              → Claude generates escalation response
  → should_continue: needs_escalation = True → END

Agent: "I completely understand, Jennifer. Let me connect you with one
        of our support specialists who can assist you directly. I'll
        make sure they have the full context of our conversation so
        you won't need to repeat anything. A team member will follow
        up with you shortly."
```

---

## Running the Project

### Prerequisites

- Node.js 18+ (for backend services)
- Python 3.11+ with `uv` (for pear-genius)
- Rust toolchain (for AgentGateway)
- Anthropic API key

### Start order

1. **Backend services** (each in a separate terminal):
   ```bash
   cd pear-services/order-management && npm start     # Port 8081
   cd pear-services/shipping && npm start              # Port 8082
   cd pear-services/product-support && npm start       # Port 8083
   cd pear-services/customer-accounts && npm start     # Port 8084
   cd pear-services/product-catalog && npm start       # Port 8085
   cd pear-services/inventory && npm start             # Port 8086
   cd pear-services/physical-stores && npm start       # Port 8087
   ```

2. **AgentGateway**:
   ```bash
   cd agentgateway && cargo run                        # Port 3000
   ```

3. **Pear Genius agent server**:
   ```bash
   cd pear-genius
   cp .env.example .env                                # Add ANTHROPIC_API_KEY
   uv run python -m pear_genius.server                 # Port 8000
   ```

4. **Frontend**:
   ```bash
   cd pear-store && npm run dev                        # Port 3001
   ```

### Key environment variables

```bash
# Required
ANTHROPIC_API_KEY=sk-ant-...

# Optional (defaults shown)
MODEL_NAME=claude-sonnet-4-20250514
AGENT_GATEWAY_URL=http://localhost:3000
SERVER_PORT=8000
```

### Dependencies

```toml
# pear-genius/pyproject.toml
dependencies = [
    "langchain>=1.2.8",
    "langgraph>=1.0.7",
    "langchain-anthropic>1.2.8",
    "langchain-mcp-adapters>=0.2.1",
    "fastapi>=0.115.0",
    "uvicorn[standard]>=0.30.0",
    "sse-starlette>=2.0.0",
    "pydantic>=2.0.0",
    "pydantic-settings>=2.0.0",
    "structlog>=24.0.0",
]
```

---

## Project Structure

```
pear-genius/
├── pear_genius/
│   ├── agents/
│   │   ├── __init__.py
│   │   └── agent.py           # Graph, approval gate, agent logic
│   ├── auth/
│   │   └── keycloak.py        # JWT auth + test customer helper
│   ├── state/
│   │   └── conversation.py    # AgentState, CustomerContext, enums
│   ├── tools/
│   │   ├── mcp_client.py      # MCP connection, patches, tool loading
│   │   └── registry.py        # Tool caching with async lock
│   ├── config.py              # Pydantic settings from .env
│   ├── main.py                # CLI entry point
│   └── server.py              # FastAPI + SSE streaming
├── tests/
│   ├── conftest.py            # Shared fixtures
│   ├── test_agents.py         # Agent, escalation, approval tests
│   ├── test_mcp_client.py     # MCP client tests
│   └── test_state.py          # State model tests
└── pyproject.toml
```
