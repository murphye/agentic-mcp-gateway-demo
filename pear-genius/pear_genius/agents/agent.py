"""Pear Genius agent — single LangGraph agent with MCP tools and human-in-the-loop approval."""

import json as json_mod
from typing import Literal

import structlog
from langchain_anthropic import ChatAnthropic
from langchain_core.messages import AIMessage, HumanMessage, SystemMessage, ToolMessage
from langgraph.checkpoint.memory import MemorySaver
from langgraph.graph import END, StateGraph
from langgraph.prebuilt import ToolNode
from langgraph.types import interrupt, Command

from ..config import settings
from ..state.conversation import (
    AgentState,
    CustomerContext,
    EscalationReason,
)
from ..tools.registry import get_all_tools

logger = structlog.get_logger()

# Tools that modify state and require human approval before execution
HIGH_RISK_TOOLS = {
    "order-management_cancelOrder",
    "order-management_createReturn",
    "product-support_scheduleRepair",
}


SYSTEM_PROMPT = """You are Pear Genius, an intelligent customer support assistant for Pear Computer.
Your role is to help customers with their inquiries about orders, products, warranty, repairs, and account issues.

## Important: Tool Call Format

When calling tools that require path parameters (like order IDs), you MUST nest the parameter inside a "path" object.
For example, to get order details:
- CORRECT: {"path": {"orderId": "ORD-2024-001"}}
- INCORRECT: {"orderId": "ORD-2024-001"}

For query parameters, nest them inside a "query" object:
- CORRECT: {"query": {"customerId": "cust-001"}}
- INCORRECT: {"customerId": "cust-001"}

## Your Capabilities

You can help customers with:
1. **Order Issues**: Track orders, check delivery status, modify shipping, process returns
2. **Warranty & Repairs**: Check warranty coverage, explain repair options, schedule appointments
3. **Troubleshooting**: Guide through technical issues, run diagnostics, find solutions
4. **Account Management**: View profile, manage devices, update preferences
5. **Inventory & Store Info**: Check stock levels by SKU, check store inventory

## Guidelines

1. **Be Helpful & Empathetic**: Acknowledge customer frustrations and focus on solutions
2. **Be Efficient**: Get to the point quickly while being thorough
3. **Use Tools**: Always use the appropriate tools to look up information - don't guess
4. **Verify Identity**: For sensitive operations, confirm you're speaking with the account holder
5. **Know Your Limits**: If you can't resolve an issue, offer to connect with a specialist

## Escalation Rules

Escalate to a human agent when:
- Customer explicitly requests a human
- Refund amount exceeds $500
- Billing dispute or fraud concern
- Safety-related issues
- Issue cannot be resolved after reasonable troubleshooting
- Customer appears very frustrated despite your best efforts

## Response Format

- Be conversational but professional
- Use bullet points or numbered lists for multiple items
- Provide clear next steps
- Always confirm actions before taking them (especially for returns, refunds, cancellations)

## Important: Do Not Retry Failed Actions

If a state-changing action (cancel order, create return, schedule repair) fails or returns an error,
do NOT call the same tool again. Instead, explain the issue to the customer and offer alternatives
or escalate to a specialist.
"""


class PearGeniusAgent:
    """
    The Pear Genius customer support agent.

    Uses LLM tool calls for implicit intent routing — no separate
    classification step needed.
    """

    def __init__(self, tools: list | None = None):
        self.tools = tools or []

        self.llm = ChatAnthropic(
            model=settings.model_name,
            api_key=settings.anthropic_api_key,
            max_tokens=settings.max_tokens,
            temperature=settings.temperature,
        )

        if self.tools:
            self.llm_with_tools = self.llm.bind_tools(self.tools)
        else:
            self.llm_with_tools = self.llm

    async def process(self, state: AgentState) -> AgentState:
        """Process the current state and generate a response."""
        state.turn_count += 1

        # Check for escalation conditions
        should_escalate, reason = self._check_escalation(state)
        if should_escalate:
            state.needs_escalation = True
            state.escalation_reason = EscalationReason(reason)
            logger.info("Escalation triggered", reason=reason)

        # Build messages with system prompt + customer context
        system_msg = self._build_system_message(state)
        messages = [system_msg] + state.messages

        logger.info(
            "Invoking LLM",
            agent="pear-genius",
            message_count=len(messages),
            has_tools=bool(self.tools),
        )

        response = await self.llm_with_tools.ainvoke(messages)

        if hasattr(response, "tool_calls") and response.tool_calls:
            for tc in response.tool_calls:
                logger.info(
                    "LLM tool call",
                    tool_name=tc.get("name"),
                    tool_args=tc.get("args"),
                )

        state.messages.append(response)
        return state

    def _build_system_message(self, state: AgentState) -> SystemMessage:
        """Build the system message with customer context."""
        parts = [SYSTEM_PROMPT]

        if state.customer:
            parts.append(
                f"\n\nCustomer Context:\n"
                f"- Name: {state.customer.name}\n"
                f"- Customer ID: {state.customer.customer_id}\n"
                f"- Tier: {state.customer.tier.value}\n"
                f"- Email: {state.customer.email}"
            )

            if state.customer.recent_orders:
                orders = ", ".join(
                    o.get("id", "Unknown") for o in state.customer.recent_orders[:3]
                )
                parts.append(f"- Recent Orders: {orders}")

            if state.customer.registered_devices:
                devices = ", ".join(
                    f"{d.get('name', 'Unknown')} (Product: {d.get('productId', 'N/A')})"
                    for d in state.customer.registered_devices[:3]
                )
                parts.append(f"- Devices: {devices}")

        return SystemMessage(content="\n".join(parts))

    def _check_escalation(self, state: AgentState) -> tuple[bool, str]:
        """Check if conversation should be escalated to human."""
        if state.messages:
            for msg in reversed(state.messages):
                if isinstance(msg, HumanMessage):
                    text = msg.content.lower()
                    if any(
                        kw in text
                        for kw in ["human", "agent", "representative", "speak to someone", "manager"]
                    ):
                        return True, "customer_request"
                    break

        if "refund_amount" in state.tool_results:
            amount = state.tool_results["refund_amount"]
            if amount > settings.max_refund_amount:
                return True, "high_value_refund"

        error_count = sum(
            1
            for msg in state.messages
            if isinstance(msg, ToolMessage) and _has_error(msg.content)
        )
        if error_count >= 3:
            return True, "repeated_failure"

        return False, ""


def _has_error(content) -> bool:
    """Check if tool message content contains an error."""
    if isinstance(content, str):
        return "error" in content.lower()
    elif isinstance(content, list):
        return any(
            isinstance(item, str) and "error" in item.lower()
            for item in content
        )
    return False


def _flatten_args(tool_call: dict) -> dict:
    """Flatten path/query/body args from a tool call."""
    args = tool_call.get("args", {})
    flat = {}
    for key in ("path", "query", "body"):
        if isinstance(args.get(key), dict):
            flat.update(args[key])
    for k, v in args.items():
        if k not in ("path", "query", "body"):
            flat[k] = v
    return flat


# --- Human-readable description builders ---


def _find_order_in_history(order_id: str, messages: list) -> dict | None:
    """Search conversation ToolMessages for order data matching the given ID."""
    for msg in reversed(messages):
        if not isinstance(msg, ToolMessage):
            continue
        content = msg.content
        if not isinstance(content, str) or order_id not in content:
            continue
        try:
            data = json_mod.loads(content)
            if isinstance(data, dict):
                # Direct order object
                if data.get("id") == order_id or data.get("orderNumber") == order_id:
                    return data
                # Nested inside {"orders": [...]} from list endpoints
                for order in data.get("orders", []):
                    if isinstance(order, dict) and (
                        order.get("id") == order_id or order.get("orderNumber") == order_id
                    ):
                        return order
        except (json_mod.JSONDecodeError, TypeError):
            continue
    return None


def _fmt_money(amount: float, currency: str = "USD") -> str:
    """Format a monetary amount."""
    if currency == "USD":
        return f"${amount:,.2f}"
    return f"{amount:,.2f} {currency}"


def _describe_create_return(args: dict, messages: list) -> list[str]:
    """Build description lines for a createReturn action."""
    order_id = args.get("orderId", "Unknown")
    items = args.get("items", [])
    refund_method = str(args.get("refundMethod", "original_payment")).replace("_", " ")

    order = _find_order_in_history(order_id, messages)
    order_items_by_id = {}
    if order and "items" in order:
        for oi in order["items"]:
            order_items_by_id[oi.get("id", "")] = oi

    lines = []
    total_refund = 0.0
    currency = "USD"

    for item in items:
        item_id = item.get("itemId", "")
        qty = item.get("quantity", 1)
        reason = str(item.get("reason", "")).replace("_", " ")

        oi = order_items_by_id.get(item_id, {})
        name = oi.get("name", item_id)
        unit_price = oi.get("unitPrice", {})
        price_amount = unit_price.get("amount") if isinstance(unit_price, dict) else None
        currency = unit_price.get("currency", "USD") if isinstance(unit_price, dict) else "USD"

        line = f"{name}"
        if qty > 1:
            line += f" (×{qty})"
        if price_amount is not None:
            item_total = price_amount * qty
            total_refund += item_total
            line += f" — {_fmt_money(item_total, currency)}"
        if reason:
            lines.append(line)
            lines.append(f"Reason: {reason}")
        else:
            lines.append(line)

    # Resolve payment method description from order data
    payment_desc = refund_method
    if order and "payment" in order:
        payment = order["payment"]
        brand = payment.get("brand", "")
        last4 = payment.get("last4", "")
        if brand and last4:
            payment_desc = f"{brand} ending in {last4}"
        elif brand:
            payment_desc = brand

    if total_refund > 0:
        lines.append(f"Refund of {_fmt_money(total_refund, currency)} to {payment_desc}")
    else:
        lines.append(f"Refund to {payment_desc}")

    return lines


def _describe_cancel_order(args: dict, messages: list) -> list[str]:
    """Build description lines for a cancelOrder action."""
    order_id = args.get("orderId", "Unknown")
    reason = str(args.get("reason", "")).replace("_", " ")

    order = _find_order_in_history(order_id, messages)

    lines = []
    if reason:
        lines.append(f"Reason: {reason}")

    if order:
        total = order.get("pricing", {}).get("total", {})
        if isinstance(total, dict) and "amount" in total:
            currency = total.get("currency", "USD")
            lines.append(f"Order total: {_fmt_money(total['amount'], currency)}")

        item_count = len(order.get("items", []))
        if item_count:
            names = [it.get("name", "item") for it in order["items"][:3]]
            summary = ", ".join(names)
            if item_count > 3:
                summary += f", and {item_count - 3} more"
            lines.append(summary)

    return lines


def _describe_schedule_repair(args: dict, _messages: list) -> list[str]:
    """Build description lines for a scheduleRepair action."""
    lines = []
    if args.get("deviceId") or args.get("serialNumber"):
        lines.append(f"Device: {args.get('deviceId') or args.get('serialNumber')}")
    if args.get("issueType"):
        lines.append(f"Issue: {str(args['issueType']).replace('_', ' ')}")
    if args.get("location") or args.get("storeId"):
        lines.append(f"Location: {args.get('location') or args.get('storeId')}")
    if args.get("date"):
        lines.append(f"Date: {args['date']}")
    return lines


_DESCRIBERS = {
    "order-management_createReturn": _describe_create_return,
    "order-management_cancelOrder": _describe_cancel_order,
    "product-support_scheduleRepair": _describe_schedule_repair,
}


def _build_action_description(tool_call: dict, messages: list) -> list[str]:
    """Build a human-readable description for a high-risk tool call."""
    name = tool_call["name"]
    args = _flatten_args(tool_call)
    describer = _DESCRIBERS.get(name)
    if describer:
        return describer(args, messages)
    return []


def _format_tool_title(name: str) -> str:
    """'order-management_cancelOrder' → 'Cancel Order'"""
    parts = name.split("_")
    action = parts[-1]
    return action[0].upper() + "".join(
        f" {c}" if c.isupper() else c for c in action[1:]
    )


def approval_gate(state: AgentState):
    """
    Check if pending tool calls require human approval.

    If any tool call is high-risk, interrupt the graph and wait for
    human approval. On resume, either pass through (approved) or
    inject rejection ToolMessages (rejected).
    """
    last_message = state.messages[-1] if state.messages else None
    if not isinstance(last_message, AIMessage) or not last_message.tool_calls:
        return state

    high_risk_calls = [
        tc for tc in last_message.tool_calls if tc["name"] in HIGH_RISK_TOOLS
    ]

    if not high_risk_calls:
        return state

    # Build action details with human-readable descriptions
    actions = []
    for tc in high_risk_calls:
        actions.append({
            "tool_call_id": tc["id"],
            "tool_name": tc["name"],
            "title": _format_tool_title(tc["name"]),
            "description": _build_action_description(tc, state.messages),
        })

    logger.info(
        "Approval required — interrupting graph",
        actions=[a["tool_name"] for a in actions],
    )

    decision = interrupt({
        "action": "approve_tool_calls",
        "actions": actions,
    })

    if decision.get("approved"):
        logger.info("Tool calls approved by user")
        return state
    else:
        logger.info("Tool calls rejected by user")
        rejection_messages = []
        for tc in last_message.tool_calls:
            rejection_messages.append(
                ToolMessage(
                    content="Action was rejected by the customer. Do not retry this action. Acknowledge the rejection and ask how else you can help.",
                    tool_call_id=tc["id"],
                )
            )
        return Command(update={"messages": rejection_messages})


def route_after_approval(state: AgentState) -> Literal["tools", "agent"]:
    """Route after approval gate: to tools if approved, to agent if rejected."""
    last_message = state.messages[-1] if state.messages else None
    if isinstance(last_message, ToolMessage):
        # Rejection ToolMessages were injected — send back to agent
        return "agent"
    # AIMessage still present — approved or no approval needed
    return "tools"


async def create_agent_graph():
    """
    Create the LangGraph state machine for Pear Genius.

    Graph structure:
        agent → should_continue → approval_gate → route_after_approval
              → tools → agent
              → END

    Returns:
        Tuple of (compiled graph, checkpointer)
    """
    tools = await get_all_tools()
    logger.info("Loaded MCP tools", count=len(tools))

    agent = PearGeniusAgent(tools=tools)
    tool_node = ToolNode(tools)
    checkpointer = MemorySaver()

    graph = StateGraph(AgentState)
    graph.add_node("agent", agent.process)
    graph.add_node("approval_gate", approval_gate)
    graph.add_node("tools", tool_node)

    def should_continue(state: AgentState) -> Literal["approval_gate", "end"]:
        """Route to approval gate if the LLM made tool calls, otherwise end."""
        if state.needs_escalation:
            return "end"

        if state.messages:
            last_message = state.messages[-1]
            if isinstance(last_message, AIMessage) and last_message.tool_calls:
                return "approval_gate"

        return "end"

    graph.set_entry_point("agent")
    graph.add_conditional_edges(
        "agent",
        should_continue,
        {"approval_gate": "approval_gate", "end": END},
    )
    graph.add_conditional_edges(
        "approval_gate",
        route_after_approval,
        {"tools": "tools", "agent": "agent"},
    )
    graph.add_edge("tools", "agent")

    compiled = graph.compile(checkpointer=checkpointer)
    return compiled, checkpointer


async def run_conversation(
    user_message: str,
    state: AgentState | None = None,
    customer: CustomerContext | None = None,
) -> AgentState:
    """
    Run a conversation turn with the Pear Genius agent.

    Args:
        user_message: The user's message
        state: Existing conversation state (or None to start new)
        customer: Customer context (required for new conversations)

    Returns:
        Updated conversation state
    """
    if state is None:
        import uuid

        state = AgentState(
            session_id=str(uuid.uuid4()),
            customer=customer,
            is_authenticated=customer is not None,
        )

    state.messages.append(HumanMessage(content=user_message))

    graph, _checkpointer = await create_agent_graph()
    result = await graph.ainvoke(state)

    return result


def get_last_ai_response(state: AgentState) -> str:
    """Extract the last AI response with actual text content from the state."""
    for msg in reversed(state.messages):
        if isinstance(msg, AIMessage):
            content = msg.content

            if isinstance(content, str) and content.strip():
                return content

            elif isinstance(content, list):
                text_parts = []
                for item in content:
                    if isinstance(item, str) and item.strip():
                        text_parts.append(item)
                    elif isinstance(item, dict) and item.get("type") == "text":
                        text = item.get("text", "")
                        if text.strip():
                            text_parts.append(text)
                if text_parts:
                    return " ".join(text_parts)

            continue

    return ""
