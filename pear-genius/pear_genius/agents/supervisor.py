"""Supervisor agent for orchestrating Pear Genius conversations."""

from typing import Literal

import structlog
from langchain_core.messages import AIMessage, HumanMessage, ToolMessage
from langgraph.graph import END, StateGraph
from langgraph.prebuilt import ToolNode

from ..config import settings
from ..state.conversation import (
    AgentState,
    CustomerContext,
    EscalationReason,
    IntentCategory,
)
from ..tools.registry import get_all_tools
from .base import BaseAgent

logger = structlog.get_logger()


SUPERVISOR_SYSTEM_PROMPT = """You are Pear Genius, an intelligent customer support assistant for Pear Computer.
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
"""


class SupervisorAgent(BaseAgent):
    """
    Supervisor agent that orchestrates the conversation.

    Responsibilities:
    - Classify customer intent
    - Route to appropriate tools
    - Manage conversation flow
    - Determine when to escalate
    """

    def __init__(self, tools: list | None = None):
        super().__init__(
            name="supervisor",
            system_prompt=SUPERVISOR_SYSTEM_PROMPT,
            tools=tools or [],
        )

    async def process(self, state: AgentState) -> AgentState:
        """Process the current state and generate a response."""
        # Increment turn count
        state.turn_count += 1

        # Classify intent from the latest message
        if state.messages:
            intent = await self._classify_intent(state)
            state.current_intent = intent
            logger.info("Classified intent", intent=intent.value)

        # Check for escalation conditions
        should_escalate, reason = self.should_escalate(state)
        if should_escalate:
            state.needs_escalation = True
            state.escalation_reason = EscalationReason(reason)
            logger.info("Escalation triggered", reason=reason)

        # Generate response using LLM with tools
        response = await self.invoke_llm(state)

        # Add response to messages
        state.messages.append(response)

        return state

    async def _classify_intent(self, state: AgentState) -> IntentCategory:
        """
        Classify the customer's intent from their message.

        Uses a simple keyword-based approach for speed,
        with LLM fallback for ambiguous cases.
        """
        if not state.messages:
            return IntentCategory.GENERAL

        # Get the last human message
        last_message = None
        for msg in reversed(state.messages):
            if isinstance(msg, HumanMessage):
                last_message = msg.content.lower()
                break

        if not last_message:
            return IntentCategory.GENERAL

        # Keyword-based classification
        if any(
            kw in last_message
            for kw in ["order", "tracking", "delivery", "shipped", "package", "where is my"]
        ):
            return IntentCategory.ORDER

        if any(
            kw in last_message
            for kw in ["return", "exchange", "refund", "send back", "wrong item"]
        ):
            return IntentCategory.RETURN

        if any(
            kw in last_message
            for kw in ["warranty", "covered", "repair", "broken", "cracked", "damaged", "fix"]
        ):
            return IntentCategory.WARRANTY

        if any(
            kw in last_message
            for kw in [
                "not working",
                "problem",
                "issue",
                "error",
                "won't",
                "can't",
                "doesn't",
                "help me",
                "troubleshoot",
            ]
        ):
            return IntentCategory.TROUBLESHOOT

        if any(
            kw in last_message
            for kw in ["account", "profile", "password", "email", "address", "payment method"]
        ):
            return IntentCategory.ACCOUNT

        if any(
            kw in last_message
            for kw in [
                "product",
                "compare",
                "difference",
                "which one",
                "recommend",
                "specs",
                "features",
            ]
        ):
            return IntentCategory.PRODUCT

        if any(
            kw in last_message
            for kw in ["human", "agent", "representative", "speak to someone", "manager"]
        ):
            return IntentCategory.ESCALATE

        return IntentCategory.GENERAL

    def should_escalate(self, state: AgentState) -> tuple[bool, str]:
        """Check if conversation should be escalated to human."""
        # Check for explicit escalation intent
        if state.current_intent == IntentCategory.ESCALATE:
            return True, "customer_request"

        # Check for high-value refund in tool results
        if "refund_amount" in state.tool_results:
            amount = state.tool_results["refund_amount"]
            if amount > settings.max_refund_amount:
                return True, "high_value_refund"

        # Check for repeated failures (more than 3 tool errors)
        def has_error(content) -> bool:
            """Check if tool message content contains an error."""
            if isinstance(content, str):
                return "error" in content.lower()
            elif isinstance(content, list):
                return any(
                    isinstance(item, str) and "error" in item.lower()
                    for item in content
                )
            return False

        error_count = sum(
            1
            for msg in state.messages
            if isinstance(msg, ToolMessage) and has_error(msg.content)
        )
        if error_count >= 3:
            return True, "repeated_failure"

        return False, ""


async def create_agent_graph(use_specialized_agents: bool = True) -> StateGraph:
    """
    Create the LangGraph state machine for Pear Genius.

    Graph Structure (multi-agent):
    1. supervisor: Classifies intent and routes to specialized agents
    2. order_agent: Handles order-related inquiries
    3. tools: ToolNode that executes tool calls
    4. Conditional routing based on intent and tool calls

    Args:
        use_specialized_agents: If True, route to specialized agents.
                               If False, use supervisor for everything.

    Returns:
        Compiled LangGraph state machine
    """
    from .order import OrderAgent

    # Load MCP tools from AgentGateway
    tools = await get_all_tools()
    logger.info("Loaded MCP tools", count=len(tools))

    # Initialize agents
    supervisor = SupervisorAgent(tools=tools)

    # Create the tool node with loaded tools
    tool_node = ToolNode(tools)

    # Define the graph
    graph = StateGraph(AgentState)

    # Add supervisor node
    graph.add_node("supervisor", supervisor.process)
    graph.add_node("tools", tool_node)

    if use_specialized_agents:
        # Add specialized agent nodes
        order_agent = OrderAgent(tools=tools)
        graph.add_node("order_agent", order_agent.process)

        # Routing logic after supervisor classifies intent
        def route_by_intent(state: AgentState) -> Literal["order_agent", "tools", "end"]:
            """Route to appropriate agent based on classified intent."""
            # Check for escalation first
            if state.needs_escalation:
                return "end"

            # Check if the last message has tool calls (supervisor handled it)
            if state.messages:
                last_message = state.messages[-1]
                if isinstance(last_message, AIMessage) and last_message.tool_calls:
                    return "tools"

            # Route based on intent
            intent = state.current_intent
            if intent in (IntentCategory.ORDER, IntentCategory.RETURN):
                state.current_agent = "order"
                return "order_agent"

            # For other intents, supervisor handles directly
            return "end"

        def should_continue_from_agent(state: AgentState) -> Literal["tools", "supervisor"]:
            """Determine if specialized agent needs tools or returns to supervisor."""
            if state.needs_escalation:
                return "supervisor"

            if state.messages:
                last_message = state.messages[-1]
                if isinstance(last_message, AIMessage) and last_message.tool_calls:
                    return "tools"

            return "supervisor"

        def route_after_tools(state: AgentState) -> Literal["supervisor", "order_agent"]:
            """Route back to the appropriate agent after tool execution."""
            if state.current_agent == "order":
                return "order_agent"
            return "supervisor"

        # Add edges for multi-agent flow
        graph.set_entry_point("supervisor")
        graph.add_conditional_edges(
            "supervisor",
            route_by_intent,
            {
                "order_agent": "order_agent",
                "tools": "tools",
                "end": END,
            },
        )
        graph.add_conditional_edges(
            "order_agent",
            should_continue_from_agent,
            {
                "tools": "tools",
                "supervisor": END,  # Return to caller
            },
        )
        graph.add_conditional_edges(
            "tools",
            route_after_tools,
            {
                "supervisor": "supervisor",
                "order_agent": "order_agent",
            },
        )
    else:
        # Simple single-agent flow
        def should_continue(state: AgentState) -> Literal["tools", "end"]:
            """Determine if we should continue to tools or end."""
            if state.needs_escalation:
                return "end"

            if state.messages:
                last_message = state.messages[-1]
                if isinstance(last_message, AIMessage) and last_message.tool_calls:
                    return "tools"

            return "end"

        graph.set_entry_point("supervisor")
        graph.add_conditional_edges(
            "supervisor",
            should_continue,
            {
                "tools": "tools",
                "end": END,
            },
        )
        graph.add_edge("tools", "supervisor")

    return graph.compile()


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
    # Initialize state if needed
    if state is None:
        import uuid

        state = AgentState(
            session_id=str(uuid.uuid4()),
            customer=customer,
            is_authenticated=customer is not None,
        )

    # Add user message
    state.messages.append(HumanMessage(content=user_message))

    # Create and run the graph (async to load MCP tools)
    graph = await create_agent_graph()
    result = await graph.ainvoke(state)

    return result


def get_last_ai_response(state: AgentState) -> str:
    """Extract the last AI response with actual text content from the state."""
    for msg in reversed(state.messages):
        if isinstance(msg, AIMessage):
            content = msg.content

            # Handle string content
            if isinstance(content, str) and content.strip():
                return content

            # Handle list content (might contain tool calls + text blocks)
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

            # Skip this message if it has no text content (e.g., only tool calls or empty)
            # Continue looking for earlier messages with actual text
            continue

    return ""
