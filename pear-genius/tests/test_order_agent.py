"""Tests for Order Agent."""

import pytest
from unittest.mock import patch, MagicMock
from langchain_core.messages import HumanMessage, AIMessage

from pear_genius.agents.order import OrderAgent, ORDER_AGENT_SYSTEM_PROMPT
from pear_genius.state.conversation import AgentState, CustomerContext, CustomerTier


class TestOrderAgent:
    """Tests for OrderAgent class."""

    @pytest.fixture
    def order_agent(self):
        """Create an Order Agent for testing."""
        with patch("pear_genius.agents.base.ChatAnthropic"):
            agent = OrderAgent(tools=[])
        return agent

    @pytest.fixture
    def customer_state(self):
        """Create a state with customer context."""
        customer = CustomerContext(
            customer_id="CUST-001",
            email="test@example.com",
            name="Test User",
            tier=CustomerTier.PLUS,
            recent_orders=[
                {"id": "PO-2024-001", "status": "delivered"},
            ],
        )
        return AgentState(
            session_id="test-session",
            customer=customer,
            is_authenticated=True,
        )

    def test_order_agent_initialization(self, order_agent):
        """Test Order Agent is properly initialized."""
        assert order_agent.name == "order"
        assert "Order Specialist" in order_agent.system_prompt
        assert order_agent.tools == []

    def test_order_agent_system_prompt(self):
        """Test Order Agent system prompt contains key elements."""
        assert "Order Status" in ORDER_AGENT_SYSTEM_PROMPT
        assert "Returns & Exchanges" in ORDER_AGENT_SYSTEM_PROMPT
        assert "Refunds" in ORDER_AGENT_SYSTEM_PROMPT
        assert "$500" in ORDER_AGENT_SYSTEM_PROMPT  # Refund limit


class TestOrderAgentEscalation:
    """Tests for Order Agent escalation logic."""

    @pytest.fixture
    def order_agent(self):
        """Create an Order Agent for testing."""
        with patch("pear_genius.agents.base.ChatAnthropic"):
            agent = OrderAgent(tools=[])
        return agent

    def test_escalate_high_value_refund(self, order_agent):
        """Test escalation for refunds over $500."""
        state = AgentState(session_id="test")
        state.tool_results["refund_amount"] = 750.00

        should_escalate, reason = order_agent.should_escalate(state)

        assert should_escalate is True
        assert reason == "high_value_refund"

    def test_no_escalate_low_value_refund(self, order_agent):
        """Test no escalation for refunds under $500."""
        state = AgentState(session_id="test")
        state.tool_results["refund_amount"] = 250.00

        should_escalate, reason = order_agent.should_escalate(state)

        assert should_escalate is False
        assert reason == ""

    def test_escalate_disputed_charge(self, order_agent):
        """Test escalation for disputed charges."""
        state = AgentState(session_id="test")
        state.messages.append(HumanMessage(content="I was charged twice for my order!"))

        should_escalate, reason = order_agent.should_escalate(state)

        assert should_escalate is True
        assert reason == "disputed_charge"

    def test_escalate_fraud_concern(self, order_agent):
        """Test escalation for fraud concerns."""
        state = AgentState(session_id="test")
        state.messages.append(HumanMessage(content="There's an unauthorized charge on my account"))

        should_escalate, reason = order_agent.should_escalate(state)

        assert should_escalate is True
        assert reason == "disputed_charge"

    def test_no_escalate_normal_order_inquiry(self, order_agent):
        """Test no escalation for normal order inquiries."""
        state = AgentState(session_id="test")
        state.messages.append(HumanMessage(content="Where is my order?"))

        should_escalate, reason = order_agent.should_escalate(state)

        assert should_escalate is False
        assert reason == ""

    def test_escalate_order_too_old(self, order_agent):
        """Test escalation for orders flagged as too old."""
        state = AgentState(session_id="test")
        state.tool_results["order_too_old"] = True

        should_escalate, reason = order_agent.should_escalate(state)

        assert should_escalate is True
        assert reason == "order_too_old"


class TestOrderAgentHelpers:
    """Tests for Order Agent helper methods."""

    @pytest.fixture
    def order_agent(self):
        """Create an Order Agent for testing."""
        with patch("pear_genius.agents.base.ChatAnthropic"):
            agent = OrderAgent(tools=[])
        return agent

    def test_get_order_status_summary_shipped(self, order_agent):
        """Test order status summary for shipped order."""
        order_data = {
            "id": "PO-2024-001",
            "status": "shipped",
            "tracking_number": "1Z999AA10123456784",
            "estimated_delivery": "January 30, 2025",
        }

        summary = order_agent.get_order_status_summary(order_data)

        assert "PO-2024-001" in summary
        assert "On its way" in summary
        assert "1Z999AA10123456784" in summary
        assert "January 30, 2025" in summary

    def test_get_order_status_summary_delivered(self, order_agent):
        """Test order status summary for delivered order."""
        order_data = {
            "id": "PO-2024-002",
            "status": "delivered",
            "delivered_date": "January 25, 2025",
        }

        summary = order_agent.get_order_status_summary(order_data)

        assert "PO-2024-002" in summary
        assert "Delivered" in summary
        assert "January 25, 2025" in summary

    def test_get_order_status_summary_processing(self, order_agent):
        """Test order status summary for processing order."""
        order_data = {
            "id": "PO-2024-003",
            "status": "processing",
        }

        summary = order_agent.get_order_status_summary(order_data)

        assert "PO-2024-003" in summary
        assert "Being processed" in summary

    def test_get_order_status_summary_out_for_delivery(self, order_agent):
        """Test order status summary for out for delivery."""
        order_data = {
            "id": "PO-2024-004",
            "status": "out_for_delivery",
        }

        summary = order_agent.get_order_status_summary(order_data)

        assert "Out for delivery" in summary


class TestOrderAgentEscalationMessages:
    """Tests for Order Agent escalation message generation."""

    @pytest.fixture
    def order_agent(self):
        """Create an Order Agent for testing."""
        with patch("pear_genius.agents.base.ChatAnthropic"):
            agent = OrderAgent(tools=[])
        return agent

    @pytest.mark.asyncio
    async def test_generate_high_value_refund_message(self, order_agent):
        """Test escalation message for high value refund."""
        state = AgentState(session_id="test")
        response = await order_agent._generate_escalation_response(state, "high_value_refund")

        assert isinstance(response, AIMessage)
        assert "exceeds $500" in response.content
        assert "senior support specialist" in response.content

    @pytest.mark.asyncio
    async def test_generate_disputed_charge_message(self, order_agent):
        """Test escalation message for disputed charge."""
        state = AgentState(session_id="test")
        response = await order_agent._generate_escalation_response(state, "disputed_charge")

        assert isinstance(response, AIMessage)
        assert "billing specialist" in response.content.lower()

    @pytest.mark.asyncio
    async def test_generate_customer_request_message(self, order_agent):
        """Test escalation message for customer request."""
        state = AgentState(session_id="test")
        response = await order_agent._generate_escalation_response(state, "customer_request")

        assert isinstance(response, AIMessage)
        assert "human agent" in response.content.lower()

    @pytest.mark.asyncio
    async def test_generate_generic_escalation_message(self, order_agent):
        """Test generic escalation message for unknown reason."""
        state = AgentState(session_id="test")
        response = await order_agent._generate_escalation_response(state, "unknown_reason")

        assert isinstance(response, AIMessage)
        assert "specialist" in response.content.lower()
