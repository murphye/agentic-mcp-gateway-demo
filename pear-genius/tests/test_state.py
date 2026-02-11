"""Tests for conversation state management."""

import pytest
from langchain_core.messages import AIMessage, HumanMessage, ToolMessage

from pear_genius.state.conversation import (
    AgentState,
    CustomerContext,
    CustomerTier,
    EscalationReason,
)


class TestCustomerContext:
    """Tests for CustomerContext model."""

    def test_create_basic_customer(self):
        """Test creating a basic customer context."""
        customer = CustomerContext(
            customer_id="CUST-001",
            email="test@example.com",
            name="Test User",
            tier=CustomerTier.STANDARD,
        )
        assert customer.customer_id == "CUST-001"
        assert customer.email == "test@example.com"
        assert customer.name == "Test User"
        assert customer.tier == CustomerTier.STANDARD
        assert customer.recent_orders == []
        assert customer.registered_devices == []

    def test_create_customer_with_orders(self):
        """Test creating customer with order history."""
        customer = CustomerContext(
            customer_id="CUST-002",
            email="premium@example.com",
            name="Premium User",
            tier=CustomerTier.PLUS,
            recent_orders=[
                {"id": "PO-001", "status": "delivered"},
                {"id": "PO-002", "status": "processing"},
            ],
        )
        assert len(customer.recent_orders) == 2
        assert customer.recent_orders[0]["id"] == "PO-001"

    def test_create_customer_with_devices(self):
        """Test creating customer with registered devices."""
        customer = CustomerContext(
            customer_id="CUST-003",
            email="user@example.com",
            name="Device User",
            tier=CustomerTier.PREMIER,
            registered_devices=[
                {"id": "DEV-001", "name": "pPhone 16", "serial": "ABC123"},
            ],
        )
        assert len(customer.registered_devices) == 1
        assert customer.registered_devices[0]["name"] == "pPhone 16"

    def test_customer_tier_values(self):
        """Test all customer tier enum values."""
        assert CustomerTier.STANDARD.value == "standard"
        assert CustomerTier.PLUS.value == "plus"
        assert CustomerTier.PREMIER.value == "premier"


class TestAgentState:
    """Tests for AgentState model."""

    def test_create_empty_state(self):
        """Test creating a new empty state."""
        state = AgentState(session_id="session-001")
        assert state.session_id == "session-001"
        assert state.messages == []
        assert state.customer is None
        assert state.is_authenticated is False
        assert state.turn_count == 0
        assert state.needs_escalation is False
        assert state.tool_results == {}
        assert state.approval_rejected is False

    def test_create_authenticated_state(self):
        """Test creating state with authenticated customer."""
        customer = CustomerContext(
            customer_id="CUST-001",
            email="auth@example.com",
            name="Auth User",
            tier=CustomerTier.PLUS,
        )
        state = AgentState(
            session_id="session-002",
            customer=customer,
            is_authenticated=True,
        )
        assert state.is_authenticated is True
        assert state.customer.name == "Auth User"

    def test_add_messages_to_state(self):
        """Test adding messages to state."""
        state = AgentState(session_id="session-003")

        # Add human message
        state.messages.append(HumanMessage(content="Hello"))
        assert len(state.messages) == 1

        # Add AI response
        state.messages.append(AIMessage(content="Hi there!"))
        assert len(state.messages) == 2

        # Verify message types
        assert isinstance(state.messages[0], HumanMessage)
        assert isinstance(state.messages[1], AIMessage)

    def test_set_escalation(self):
        """Test setting escalation flags."""
        state = AgentState(session_id="session-004")

        state.needs_escalation = True
        state.escalation_reason = EscalationReason.CUSTOMER_REQUEST

        assert state.needs_escalation is True
        assert state.escalation_reason == EscalationReason.CUSTOMER_REQUEST

    def test_track_tool_results(self):
        """Test storing tool results in state."""
        state = AgentState(session_id="session-005")

        state.tool_results["order_lookup"] = {"order_id": "PO-001", "status": "shipped"}
        state.tool_results["refund_amount"] = 250.00

        assert state.tool_results["order_lookup"]["status"] == "shipped"
        assert state.tool_results["refund_amount"] == 250.00

    def test_increment_turn_count(self):
        """Test turn counting."""
        state = AgentState(session_id="session-006")

        assert state.turn_count == 0
        state.turn_count += 1
        assert state.turn_count == 1
        state.turn_count += 1
        assert state.turn_count == 2


class TestEscalationReason:
    """Tests for EscalationReason enum."""

    def test_all_escalation_reasons(self):
        """Test all escalation reason values."""
        assert EscalationReason.CUSTOMER_REQUEST.value == "customer_request"
        assert EscalationReason.HIGH_VALUE_REFUND.value == "high_value_refund"
        assert EscalationReason.BILLING_DISPUTE.value == "billing_dispute"
        assert EscalationReason.SAFETY_ISSUE.value == "safety_issue"
        assert EscalationReason.REPEATED_FAILURE.value == "repeated_failure"
        assert EscalationReason.POLICY_EXCEPTION.value == "policy_exception"
        assert EscalationReason.ACCOUNT_SECURITY.value == "account_security"
        assert EscalationReason.UNRESOLVED_ISSUE.value == "unresolved_issue"
