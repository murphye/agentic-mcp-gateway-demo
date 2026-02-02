"""Order Agent for handling order-related customer inquiries."""

import structlog
from langchain_core.messages import AIMessage, HumanMessage

from ..config import settings
from ..state.conversation import AgentState, EscalationReason
from ..tools.registry import get_tools_for_intent
from .base import BaseAgent

logger = structlog.get_logger()


ORDER_AGENT_SYSTEM_PROMPT = """You are the Order Specialist for Pear Genius, focused on helping customers with their orders.

## Your Expertise

You handle all order-related inquiries:
- **Order Status**: Look up orders, check delivery status, provide tracking
- **Order Tracking**: Get real-time shipping updates, delivery estimates
- **Returns & Exchanges**: Check eligibility, initiate returns, process exchanges
- **Refunds**: Process refunds within policy limits
- **Order Modifications**: Update shipping address (before shipment only)

## Available Tools

You have access to tools for:
- Looking up orders by order ID or customer ID
- Getting order tracking information
- Checking return eligibility
- Initiating returns and exchanges
- Processing refunds (up to $500 without escalation)
- Generating return shipping labels

## Guidelines

1. **Always verify the order first** - Look up the order before making changes
2. **Explain status clearly** - Use customer-friendly terms, not internal codes
3. **Provide tracking proactively** - Include delivery estimates when available
4. **Check eligibility before returns** - Verify return window and item condition
5. **Confirm before actions** - Always confirm before canceling, returning, or refunding

## Return Policy Reference

- **Standard items**: 14 days from delivery
- **Plus members**: 30 days from delivery
- **Premier members**: 90 days from delivery
- **Final sale items**: Not returnable
- **Personalized items**: Not returnable unless defective

## Refund Policy

- Refunds processed to original payment method
- **Your limit**: Up to $500 - process directly
- **Over $500**: Must escalate to human agent
- Partial refunds allowed for multi-item orders

## Response Format

When providing order information:
- Order ID: PO-XXXX-XXXXX
- Status: Processing/Shipped/Delivered/Returned
- Tracking: [carrier] [tracking number]
- ETA: [date] or "Delivered on [date]"

For returns:
1. Confirm eligibility and reason
2. Explain refund amount and timeline
3. Provide return label or instructions
4. Set expectations for refund processing (3-5 business days)
"""


class OrderAgent(BaseAgent):
    """
    Order Agent specialized in handling order-related inquiries.

    Capabilities:
    - Order lookup and status
    - Shipment tracking
    - Return initiation
    - Refund processing (within limits)
    - Order modifications
    """

    def __init__(self, tools: list | None = None):
        super().__init__(
            name="order",
            system_prompt=ORDER_AGENT_SYSTEM_PROMPT,
            tools=tools or [],
        )

    async def process(self, state: AgentState) -> AgentState:
        """Process order-related inquiries."""
        logger.info("Order Agent processing", session_id=state.session_id)

        # Check for escalation conditions before processing
        should_escalate, reason = self.should_escalate(state)
        if should_escalate:
            state.needs_escalation = True
            state.escalation_reason = EscalationReason(reason)
            logger.info("Order Agent escalating", reason=reason)
            # Generate escalation message
            response = await self._generate_escalation_response(state, reason)
            state.messages.append(response)
            return state

        # Generate response using LLM with tools
        response = await self.invoke_llm(state)
        state.messages.append(response)

        return state

    async def _generate_escalation_response(
        self, state: AgentState, reason: str
    ) -> AIMessage:
        """Generate a response explaining the escalation."""
        escalation_messages = {
            "high_value_refund": (
                "I can see this refund exceeds $500. For refunds of this amount, "
                "I need to connect you with a senior support specialist who can "
                "authorize and process this for you. Let me transfer you now."
            ),
            "disputed_charge": (
                "I understand you're concerned about a charge on your account. "
                "Billing disputes require our specialized team to investigate. "
                "I'm connecting you with a billing specialist who can help resolve this."
            ),
            "order_too_old": (
                "I see this order is from more than 90 days ago. Returns and refunds "
                "for orders older than our return window require special approval. "
                "Let me connect you with a team member who can review your case."
            ),
            "customer_request": (
                "Of course! I'll connect you with a human agent right away. "
                "I'll share our conversation so they have all the context."
            ),
        }

        message = escalation_messages.get(
            reason,
            "I want to make sure you get the best help possible. "
            "Let me connect you with a specialist who can assist further."
        )

        return AIMessage(content=message)

    def should_escalate(self, state: AgentState) -> tuple[bool, str]:
        """Determine if the order inquiry should be escalated."""
        # Check for high-value refund
        if "refund_amount" in state.tool_results:
            amount = state.tool_results["refund_amount"]
            if amount > settings.max_refund_amount:
                return True, "high_value_refund"

        # Check for disputed charges in messages
        if state.messages:
            last_message = None
            for msg in reversed(state.messages):
                if isinstance(msg, HumanMessage):
                    last_message = msg.content.lower()
                    break

            if last_message:
                dispute_keywords = [
                    "charged twice", "double charged", "unauthorized charge",
                    "fraud", "didn't authorize", "dispute", "billing error"
                ]
                if any(kw in last_message for kw in dispute_keywords):
                    return True, "disputed_charge"

        # Check for order age in tool results
        if state.tool_results.get("order_too_old", False):
            return True, "order_too_old"

        return False, ""

    def get_order_status_summary(self, order_data: dict) -> str:
        """Format order data into a customer-friendly summary."""
        status_map = {
            "pending": "Being prepared",
            "processing": "Being processed",
            "shipped": "On its way",
            "in_transit": "In transit",
            "out_for_delivery": "Out for delivery",
            "delivered": "Delivered",
            "cancelled": "Cancelled",
            "returned": "Returned",
        }

        status = order_data.get("status", "unknown")
        friendly_status = status_map.get(status, status.replace("_", " ").title())

        summary = f"Order {order_data.get('id', 'Unknown')}: {friendly_status}"

        if order_data.get("tracking_number"):
            summary += f"\nTracking: {order_data['tracking_number']}"

        if order_data.get("estimated_delivery"):
            summary += f"\nExpected: {order_data['estimated_delivery']}"
        elif order_data.get("delivered_date"):
            summary += f"\nDelivered: {order_data['delivered_date']}"

        return summary


async def create_order_agent() -> OrderAgent:
    """Create an Order Agent with MCP tools loaded."""
    tools = await get_tools_for_intent("order")
    logger.info("Created Order Agent", tool_count=len(tools))
    return OrderAgent(tools=tools)
