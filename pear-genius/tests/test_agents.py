"""Tests for agent components."""

import pytest
from unittest.mock import AsyncMock, MagicMock, patch
from langchain_core.messages import AIMessage, HumanMessage, ToolMessage

from pear_genius.state.conversation import (
    AgentState,
    CustomerContext,
    CustomerTier,
    EscalationReason,
    IntentCategory,
)
from pear_genius.agents.supervisor import SupervisorAgent, get_last_ai_response


class TestSupervisorAgent:
    """Tests for SupervisorAgent."""

    @pytest.fixture
    def supervisor(self):
        """Create a supervisor agent for testing."""
        with patch("pear_genius.agents.base.ChatAnthropic"):
            agent = SupervisorAgent()
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


class TestIntentClassification:
    """Tests for intent classification logic."""

    @pytest.fixture
    def supervisor(self):
        """Create a supervisor agent for testing."""
        with patch("pear_genius.agents.base.ChatAnthropic"):
            agent = SupervisorAgent()
        return agent

    @pytest.mark.asyncio
    async def test_classify_order_intent(self, supervisor):
        """Test classification of order-related messages."""
        state = AgentState(session_id="test")
        state.messages.append(HumanMessage(content="Where is my order?"))

        intent = await supervisor._classify_intent(state)
        assert intent == IntentCategory.ORDER

    @pytest.mark.asyncio
    async def test_classify_tracking_intent(self, supervisor):
        """Test classification of tracking messages."""
        state = AgentState(session_id="test")
        state.messages.append(HumanMessage(content="I need tracking information"))

        intent = await supervisor._classify_intent(state)
        assert intent == IntentCategory.ORDER

    @pytest.mark.asyncio
    async def test_classify_return_intent(self, supervisor):
        """Test classification of return-related messages."""
        state = AgentState(session_id="test")
        state.messages.append(HumanMessage(content="I want to return this item"))

        intent = await supervisor._classify_intent(state)
        assert intent == IntentCategory.RETURN

    @pytest.mark.asyncio
    async def test_classify_refund_intent(self, supervisor):
        """Test classification of refund messages."""
        state = AgentState(session_id="test")
        state.messages.append(HumanMessage(content="Can I get a refund?"))

        intent = await supervisor._classify_intent(state)
        assert intent == IntentCategory.RETURN

    @pytest.mark.asyncio
    async def test_classify_warranty_intent(self, supervisor):
        """Test classification of warranty messages."""
        state = AgentState(session_id="test")
        state.messages.append(HumanMessage(content="Is my device still under warranty?"))

        intent = await supervisor._classify_intent(state)
        assert intent == IntentCategory.WARRANTY

    @pytest.mark.asyncio
    async def test_classify_repair_intent(self, supervisor):
        """Test classification of repair messages."""
        state = AgentState(session_id="test")
        state.messages.append(HumanMessage(content="My screen is cracked and needs repair"))

        intent = await supervisor._classify_intent(state)
        assert intent == IntentCategory.WARRANTY

    @pytest.mark.asyncio
    async def test_classify_troubleshoot_intent(self, supervisor):
        """Test classification of troubleshooting messages."""
        state = AgentState(session_id="test")
        state.messages.append(HumanMessage(content="My device is not working properly"))

        intent = await supervisor._classify_intent(state)
        assert intent == IntentCategory.TROUBLESHOOT

    @pytest.mark.asyncio
    async def test_classify_problem_intent(self, supervisor):
        """Test classification of problem messages."""
        state = AgentState(session_id="test")
        state.messages.append(HumanMessage(content="I have a problem with my pPhone"))

        intent = await supervisor._classify_intent(state)
        assert intent == IntentCategory.TROUBLESHOOT

    @pytest.mark.asyncio
    async def test_classify_account_intent(self, supervisor):
        """Test classification of account messages."""
        state = AgentState(session_id="test")
        state.messages.append(HumanMessage(content="I need to update my account email"))

        intent = await supervisor._classify_intent(state)
        assert intent == IntentCategory.ACCOUNT

    @pytest.mark.asyncio
    async def test_classify_product_intent(self, supervisor):
        """Test classification of product inquiry messages."""
        state = AgentState(session_id="test")
        state.messages.append(HumanMessage(content="Can you compare the pPhone 16 and 16 Pro?"))

        intent = await supervisor._classify_intent(state)
        assert intent == IntentCategory.PRODUCT

    @pytest.mark.asyncio
    async def test_classify_escalate_intent(self, supervisor):
        """Test classification of escalation requests."""
        state = AgentState(session_id="test")
        state.messages.append(HumanMessage(content="I want to speak to a human agent"))

        intent = await supervisor._classify_intent(state)
        assert intent == IntentCategory.ESCALATE

    @pytest.mark.asyncio
    async def test_classify_general_intent(self, supervisor):
        """Test classification of general messages."""
        state = AgentState(session_id="test")
        state.messages.append(HumanMessage(content="Hello there!"))

        intent = await supervisor._classify_intent(state)
        assert intent == IntentCategory.GENERAL

    @pytest.mark.asyncio
    async def test_classify_empty_messages(self, supervisor):
        """Test classification with no messages."""
        state = AgentState(session_id="test")

        intent = await supervisor._classify_intent(state)
        assert intent == IntentCategory.GENERAL


class TestEscalationLogic:
    """Tests for escalation decision logic."""

    @pytest.fixture
    def supervisor(self):
        """Create a supervisor agent for testing."""
        with patch("pear_genius.agents.base.ChatAnthropic"):
            agent = SupervisorAgent()
        return agent

    def test_escalate_on_customer_request(self, supervisor):
        """Test escalation when customer explicitly requests it."""
        state = AgentState(session_id="test")
        state.current_intent = IntentCategory.ESCALATE

        should_escalate, reason = supervisor.should_escalate(state)

        assert should_escalate is True
        assert reason == "customer_request"

    def test_escalate_on_high_value_refund(self, supervisor):
        """Test escalation for high-value refunds."""
        state = AgentState(session_id="test")
        state.tool_results["refund_amount"] = 750.00  # Over $500 threshold

        should_escalate, reason = supervisor.should_escalate(state)

        assert should_escalate is True
        assert reason == "high_value_refund"

    def test_no_escalate_on_low_value_refund(self, supervisor):
        """Test no escalation for low-value refunds."""
        state = AgentState(session_id="test")
        state.tool_results["refund_amount"] = 250.00  # Under $500 threshold

        should_escalate, reason = supervisor.should_escalate(state)

        assert should_escalate is False
        assert reason == ""

    def test_escalate_on_repeated_failures(self, supervisor):
        """Test escalation after repeated tool failures."""
        state = AgentState(session_id="test")
        # Add multiple error tool messages
        state.messages.append(ToolMessage(content="Error: Tool failed", tool_call_id="1"))
        state.messages.append(ToolMessage(content="Error: Tool failed again", tool_call_id="2"))
        state.messages.append(ToolMessage(content="Error: Third failure", tool_call_id="3"))

        should_escalate, reason = supervisor.should_escalate(state)

        assert should_escalate is True
        assert reason == "repeated_failure"

    def test_no_escalate_on_single_failure(self, supervisor):
        """Test no escalation on single tool failure."""
        state = AgentState(session_id="test")
        state.messages.append(ToolMessage(content="Error: Tool failed", tool_call_id="1"))

        should_escalate, reason = supervisor.should_escalate(state)

        assert should_escalate is False
        assert reason == ""

    def test_no_escalate_normal_conversation(self, supervisor):
        """Test no escalation for normal conversations."""
        state = AgentState(session_id="test")
        state.current_intent = IntentCategory.ORDER
        state.messages.append(HumanMessage(content="Where is my order?"))
        state.messages.append(AIMessage(content="Let me check that for you."))

        should_escalate, reason = supervisor.should_escalate(state)

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
