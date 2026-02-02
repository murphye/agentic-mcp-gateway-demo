"""Conversation state management for LangGraph."""

from dataclasses import dataclass, field
from datetime import datetime
from enum import Enum
from typing import Annotated, Any

from langchain_core.messages import BaseMessage
from langgraph.graph.message import add_messages
from pydantic import BaseModel, ConfigDict


class CustomerTier(str, Enum):
    """Customer loyalty tier levels."""

    STANDARD = "standard"
    PLUS = "plus"
    PREMIER = "premier"


class IntentCategory(str, Enum):
    """High-level intent categories for routing."""

    ORDER = "order"  # Order status, tracking, modifications
    RETURN = "return"  # Returns and exchanges
    WARRANTY = "warranty"  # Warranty and repairs
    TROUBLESHOOT = "troubleshoot"  # Technical issues
    ACCOUNT = "account"  # Account management
    PRODUCT = "product"  # Product questions
    GENERAL = "general"  # General inquiries
    ESCALATE = "escalate"  # Needs human agent


class CustomerContext(BaseModel):
    """Customer context extracted from authentication."""

    customer_id: str
    email: str
    name: str
    tier: CustomerTier = CustomerTier.STANDARD
    roles: list[str] = []

    # Loaded context (populated after auth)
    recent_orders: list[dict[str, Any]] = []
    registered_devices: list[dict[str, Any]] = []
    open_tickets: list[dict[str, Any]] = []


class EscalationReason(str, Enum):
    """Reasons for escalating to human agent."""

    HIGH_VALUE_REFUND = "high_value_refund"
    BILLING_DISPUTE = "billing_dispute"
    SAFETY_ISSUE = "safety_issue"
    CUSTOMER_REQUEST = "customer_request"
    REPEATED_FAILURE = "repeated_failure"
    POLICY_EXCEPTION = "policy_exception"
    ACCOUNT_SECURITY = "account_security"
    UNRESOLVED_ISSUE = "unresolved_issue"


@dataclass
class ConversationMemory:
    """Tracks conversation context and history."""

    session_id: str
    started_at: datetime = field(default_factory=datetime.utcnow)
    turn_count: int = 0
    tools_called: list[str] = field(default_factory=list)
    intents_detected: list[IntentCategory] = field(default_factory=list)
    entities_extracted: dict[str, Any] = field(default_factory=dict)

    def add_tool_call(self, tool_name: str) -> None:
        """Record a tool call."""
        self.tools_called.append(tool_name)

    def add_intent(self, intent: IntentCategory) -> None:
        """Record a detected intent."""
        if intent not in self.intents_detected:
            self.intents_detected.append(intent)

    def add_entity(self, entity_type: str, value: Any) -> None:
        """Record an extracted entity."""
        self.entities_extracted[entity_type] = value


class AgentState(BaseModel):
    """
    LangGraph state for the Pear Genius agent.

    This state is passed between nodes in the graph and accumulates
    information throughout the conversation.
    """

    # Conversation messages (using LangGraph's add_messages reducer)
    messages: Annotated[list[BaseMessage], add_messages] = []

    # Customer context (populated after authentication)
    customer: CustomerContext | None = None

    # Current routing state
    current_agent: str = "supervisor"
    current_intent: IntentCategory | None = None

    # Escalation state
    needs_escalation: bool = False
    escalation_reason: EscalationReason | None = None
    escalation_context: str = ""

    # Conversation tracking
    session_id: str = ""
    turn_count: int = 0

    # Tool execution results (for passing between nodes)
    tool_results: dict[str, Any] = {}

    # Flags
    is_authenticated: bool = False
    conversation_complete: bool = False

    model_config = ConfigDict(arbitrary_types_allowed=True)


def create_initial_state(session_id: str) -> AgentState:
    """Create a new conversation state."""
    return AgentState(session_id=session_id)


def should_escalate(state: AgentState) -> bool:
    """Determine if the conversation should be escalated to a human."""
    return state.needs_escalation


def is_complete(state: AgentState) -> bool:
    """Determine if the conversation is complete."""
    return state.conversation_complete
