"""Main entry point for Pear Genius agent."""

import asyncio
import logging
import uuid

import structlog
from langchain_core.messages import HumanMessage


# Suppress spurious "Session termination failed: 202" warning from MCP client
# HTTP 202 (Accepted) is actually a success response, not a failure
class MCPSessionTerminationFilter(logging.Filter):
    """Filter out false-positive session termination warnings."""

    def filter(self, record: logging.LogRecord) -> bool:
        if "Session termination failed: 202" in record.getMessage():
            return False
        return True


logging.getLogger("mcp.client.streamable_http").addFilter(MCPSessionTerminationFilter())

from .agents.supervisor import create_agent_graph, get_last_ai_response
from .auth.keycloak import create_test_customer_context
from .config import settings
from .state.conversation import AgentState, CustomerContext, CustomerTier

# Set root logger level so structlog's filter_by_level actually works
logging.basicConfig(format="%(message)s", level=getattr(logging, settings.log_level.upper(), logging.INFO))

# Configure structured logging
structlog.configure(
    processors=[
        structlog.stdlib.filter_by_level,
        structlog.stdlib.add_logger_name,
        structlog.stdlib.add_log_level,
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.StackInfoRenderer(),
        structlog.processors.format_exc_info,
        structlog.processors.JSONRenderer() if not settings.debug else structlog.dev.ConsoleRenderer(),
    ],
    wrapper_class=structlog.stdlib.BoundLogger,
    context_class=dict,
    logger_factory=structlog.stdlib.LoggerFactory(),
    cache_logger_on_first_use=True,
)

logger = structlog.get_logger()


class PearGeniusChat:
    """
    Interactive chat session with Pear Genius.

    Manages conversation state and provides a simple interface
    for sending messages and receiving responses.
    """

    def __init__(self, customer: CustomerContext | None = None):
        self.customer = customer
        self.state: AgentState | None = None
        self.graph = None  # Will be created async in start_session

    async def start_session(self) -> str:
        """Start a new chat session."""
        # Create the agent graph (loads MCP tools)
        if self.graph is None:
            self.graph = await create_agent_graph()
            logger.info("Agent graph created with MCP tools")

        self.state = AgentState(
            session_id=str(uuid.uuid4()),
            customer=self.customer,
            is_authenticated=self.customer is not None,
        )

        # Generate welcome message
        welcome = self._get_welcome_message()
        logger.info(
            "Chat session started",
            session_id=self.state.session_id,
            customer_id=self.customer.customer_id if self.customer else None,
        )
        return welcome

    def _get_welcome_message(self) -> str:
        """Generate a personalized welcome message."""
        if self.customer:
            return (
                f"Hello {self.customer.name}! I'm Pear Genius, your personal support assistant. "
                f"I can help you with orders, returns, warranty questions, troubleshooting, "
                f"and more. How can I assist you today?"
            )
        return (
            "Hello! I'm Pear Genius, Pear Computer's support assistant. "
            "I can help you with orders, products, warranty, and technical support. "
            "How can I help you today?"
        )

    async def send_message(self, message: str) -> str:
        """
        Send a message and get a response.

        Args:
            message: User's message

        Returns:
            Agent's response
        """
        if self.state is None:
            await self.start_session()

        # After start_session, state is guaranteed to be set
        assert self.state is not None

        # Add user message to state
        self.state.messages.append(HumanMessage(content=message))

        logger.info(
            "Processing message",
            session_id=self.state.session_id,
            turn=self.state.turn_count + 1,
        )

        # Run the graph
        result = await self.graph.ainvoke(self.state)
        # Update state with result (cast to AgentState since that's what we passed in)
        self.state = AgentState(**result) if isinstance(result, dict) else result

        # Display tool calls made during this response (for demo purposes)
        tool_calls_made = []
        for msg in self.state.messages:
            if hasattr(msg, 'tool_calls') and msg.tool_calls:
                for tc in msg.tool_calls:
                    tool_name = tc.get('name', 'unknown')
                    # Clean up tool name for display (remove service prefix)
                    display_name = tool_name.split('_', 1)[-1] if '_' in tool_name else tool_name
                    if display_name not in tool_calls_made:
                        tool_calls_made.append(display_name)

        if tool_calls_made:
            print(f"\n  Tools used: {', '.join(tool_calls_made)}")

        # Extract response
        response = get_last_ai_response(self.state)

        # Check for escalation
        if self.state.needs_escalation:
            response += (
                f"\n\n[System: This conversation has been flagged for escalation. "
                f"Reason: {self.state.escalation_reason.value if self.state.escalation_reason else 'unknown'}. "
                f"A human agent will be notified.]"
            )

        logger.info(
            "Response generated",
            session_id=self.state.session_id,
            turn=self.state.turn_count,
            escalated=self.state.needs_escalation,
        )

        return response

    @property
    def is_escalated(self) -> bool:
        """Check if the conversation has been escalated."""
        return self.state.needs_escalation if self.state else False


async def run_cli():
    """Run an interactive CLI chat session."""
    print("=" * 60)
    print("  Pear Genius - Customer Support Agent")
    print("=" * 60)
    print()

    # Create a test customer for demo purposes
    # Uses cust-001 which has existing orders in the order-management service
    customer = create_test_customer_context(
        customer_id="cust-001",
        email="john.smith@email.com",
        name="John Smith",
        tier=CustomerTier.PLUS,
    )

    # Populate with real order IDs from the order-management service
    customer.recent_orders = [
        {"id": "ORD-2024-001", "date": "2024-01-15", "status": "delivered"},
        {"id": "ORD-2024-003", "date": "2024-01-20", "status": "shipped"},
    ]
    customer.registered_devices = [
        {"id": "DEV-001", "name": "John's PearPhone 16 Pro", "serial": "PEAR-PPH16-2024-001234"},
        {"id": "DEV-002", "name": "John's PearPods Pro 2", "serial": "PEAR-PPP2-2024-005678"},
    ]

    print(f"Authenticated as: {customer.name} ({customer.tier.value} member)")
    print()

    # Start chat session
    chat = PearGeniusChat(customer=customer)
    welcome = await chat.start_session()
    print(f"Pear Genius: {welcome}")
    print()

    # Interactive loop
    while True:
        try:
            user_input = input("You: ").strip()

            if not user_input:
                continue

            if user_input.lower() in ("quit", "exit", "bye"):
                print("\nPear Genius: Thank you for chatting with Pear Genius. Have a great day!")
                break

            response = await chat.send_message(user_input)
            if response:
                print(f"\nPear Genius: {response}\n")
            else:
                print("\n[No response generated - check logs]\n")

            if chat.is_escalated:
                print("[Session escalated to human agent]")
                break

        except KeyboardInterrupt:
            print("\n\nSession ended.")
            break


def main():
    """Main entry point."""
    print("Starting Pear Genius...")

    if not settings.anthropic_api_key:
        print("Error: ANTHROPIC_API_KEY environment variable is required")
        print("Please set it in your .env file or environment")
        return

    asyncio.run(run_cli())


if __name__ == "__main__":
    main()
