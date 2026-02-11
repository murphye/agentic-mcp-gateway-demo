"""Tests for agent components."""

import pytest
from unittest.mock import AsyncMock, MagicMock, patch
from langchain_core.messages import AIMessage, HumanMessage, ToolMessage

from pear_genius.state.conversation import (
    AgentState,
    CustomerContext,
    CustomerTier,
    EscalationReason,
)
from pear_genius.agents.agent import (
    PearGeniusAgent,
    get_last_ai_response,
    approval_gate,
    route_after_approval,
    HIGH_RISK_TOOLS,
)


class TestPearGeniusAgent:
    """Tests for PearGeniusAgent."""

    @pytest.fixture
    def supervisor(self):
        """Create a supervisor agent for testing."""
        with patch("pear_genius.agents.agent.ChatAnthropic"):
            agent = PearGeniusAgent()
        return agent

    @pytest.fixture
    def basic_state(self):
        """Create a basic state for testing."""
        return AgentState(session_id="test-session")

    @pytest.fixture
    def authenticated_state(self):
        """Create an authenticated state for testing."""
        customer = CustomerContext(
            customer_id="CUST-001",
            email="test@example.com",
            name="Test User",
            tier=CustomerTier.PLUS,
        )
        return AgentState(
            session_id="test-session",
            customer=customer,
            is_authenticated=True,
        )


class TestEscalationLogic:
    """Tests for escalation decision logic."""

    @pytest.fixture
    def supervisor(self):
        """Create a supervisor agent for testing."""
        with patch("pear_genius.agents.agent.ChatAnthropic"):
            agent = PearGeniusAgent()
        return agent

    def test_escalate_on_customer_request(self, supervisor):
        """Test escalation when customer explicitly requests it."""
        state = AgentState(session_id="test")
        state.messages.append(HumanMessage(content="I want to speak to a human agent"))

        should_escalate, reason = supervisor._check_escalation(state)

        assert should_escalate is True
        assert reason == "customer_request"

    def test_escalate_on_high_value_refund(self, supervisor):
        """Test escalation for high-value refunds."""
        state = AgentState(session_id="test")
        state.tool_results["refund_amount"] = 750.00  # Over $500 threshold

        should_escalate, reason = supervisor._check_escalation(state)

        assert should_escalate is True
        assert reason == "high_value_refund"

    def test_no_escalate_on_low_value_refund(self, supervisor):
        """Test no escalation for low-value refunds."""
        state = AgentState(session_id="test")
        state.tool_results["refund_amount"] = 250.00  # Under $500 threshold

        should_escalate, reason = supervisor._check_escalation(state)

        assert should_escalate is False
        assert reason == ""

    def test_escalate_on_repeated_failures(self, supervisor):
        """Test escalation after repeated tool failures."""
        state = AgentState(session_id="test")
        state.messages.append(ToolMessage(content="Error: Tool failed", tool_call_id="1"))
        state.messages.append(ToolMessage(content="Error: Tool failed again", tool_call_id="2"))
        state.messages.append(ToolMessage(content="Error: Third failure", tool_call_id="3"))

        should_escalate, reason = supervisor._check_escalation(state)

        assert should_escalate is True
        assert reason == "repeated_failure"

    def test_no_escalate_on_single_failure(self, supervisor):
        """Test no escalation on single tool failure."""
        state = AgentState(session_id="test")
        state.messages.append(ToolMessage(content="Error: Tool failed", tool_call_id="1"))

        should_escalate, reason = supervisor._check_escalation(state)

        assert should_escalate is False
        assert reason == ""

    def test_no_escalate_normal_conversation(self, supervisor):
        """Test no escalation for normal conversations."""
        state = AgentState(session_id="test")
        state.messages.append(HumanMessage(content="Where is my order?"))
        state.messages.append(AIMessage(content="Let me check that for you."))

        should_escalate, reason = supervisor._check_escalation(state)

        assert should_escalate is False
        assert reason == ""


class TestGetLastAIResponse:
    """Tests for get_last_ai_response helper function."""

    def test_get_last_ai_response_single(self):
        """Test getting last AI response from single message."""
        state = AgentState(session_id="test")
        state.messages.append(AIMessage(content="Hello!"))

        response = get_last_ai_response(state)
        assert response == "Hello!"

    def test_get_last_ai_response_multiple(self):
        """Test getting last AI response from multiple messages."""
        state = AgentState(session_id="test")
        state.messages.append(HumanMessage(content="Hi"))
        state.messages.append(AIMessage(content="First response"))
        state.messages.append(HumanMessage(content="Thanks"))
        state.messages.append(AIMessage(content="Second response"))

        response = get_last_ai_response(state)
        assert response == "Second response"

    def test_get_last_ai_response_empty(self):
        """Test getting last AI response with no messages."""
        state = AgentState(session_id="test")

        response = get_last_ai_response(state)
        assert response == ""

    def test_get_last_ai_response_no_ai_messages(self):
        """Test getting last AI response with only human messages."""
        state = AgentState(session_id="test")
        state.messages.append(HumanMessage(content="Hello"))
        state.messages.append(HumanMessage(content="Anyone there?"))

        response = get_last_ai_response(state)
        assert response == ""


class TestApprovalRejection:
    """Tests for approval gate rejection differentiating high-risk vs low-risk."""

    def test_route_after_approval_uses_flag(self):
        """Test that route_after_approval uses approval_rejected flag, not message type."""
        state = AgentState(session_id="test", approval_rejected=True)
        assert route_after_approval(state) == "agent"

        state = AgentState(session_id="test", approval_rejected=False)
        assert route_after_approval(state) == "tools"

    def test_approval_rejected_default_false(self):
        """Test approval_rejected defaults to False."""
        state = AgentState(session_id="test")
        assert state.approval_rejected is False


class TestSystemMessageOptimization:
    """Tests for system message token optimization."""

    @pytest.fixture
    def agent(self):
        with patch("pear_genius.agents.agent.ChatAnthropic"):
            return PearGeniusAgent()

    def test_first_turn_includes_full_context(self, agent):
        """Test that first turn (turn_count=0) includes full customer context."""
        customer = CustomerContext(
            customer_id="CUST-001",
            email="test@example.com",
            name="Test User",
            tier=CustomerTier.PLUS,
        )
        state = AgentState(session_id="test", customer=customer, turn_count=0)

        msg = agent._build_system_message(state)
        content = msg.content

        assert "Customer Context:" in content
        assert "CUST-001" in content
        assert "test@example.com" in content
        assert "plus" in content

    def test_subsequent_turn_uses_compact_context(self, agent):
        """Test that subsequent turns (turn_count>0) use compact customer reminder."""
        customer = CustomerContext(
            customer_id="CUST-001",
            email="test@example.com",
            name="Test User",
            tier=CustomerTier.PLUS,
        )
        state = AgentState(session_id="test", customer=customer, turn_count=1)

        msg = agent._build_system_message(state)
        content = msg.content

        # Compact format: no "Customer Context:" header, no email
        assert "Customer Context:" not in content
        assert "test@example.com" not in content
        # But still has name and ID
        assert "Test User" in content
        assert "CUST-001" in content

    def test_escalation_instructions_injected(self, agent):
        """Test that escalation reason is injected into system message."""
        state = AgentState(session_id="test", turn_count=0)

        msg = agent._build_system_message(state, escalation_reason="customer request")
        content = msg.content

        assert "ESCALATION REQUIRED" in content
        assert "customer request" in content
        assert "specialist" in content
