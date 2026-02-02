"""Shared test fixtures for Pear Genius tests."""

import pytest
from unittest.mock import AsyncMock, MagicMock, patch

from pear_genius.state.conversation import (
    AgentState,
    CustomerContext,
    CustomerTier,
)


@pytest.fixture
def mock_anthropic():
    """Mock the ChatAnthropic client."""
    with patch("pear_genius.agents.base.ChatAnthropic") as mock:
        mock_instance = MagicMock()
        mock_instance.ainvoke = AsyncMock()
        mock.return_value = mock_instance
        yield mock


@pytest.fixture
def standard_customer():
    """Create a standard tier customer."""
    return CustomerContext(
        customer_id="CUST-STANDARD",
        email="standard@example.com",
        name="Standard User",
        tier=CustomerTier.STANDARD,
    )


@pytest.fixture
def plus_customer():
    """Create a plus tier customer with orders and devices."""
    return CustomerContext(
        customer_id="CUST-PLUS",
        email="plus@example.com",
        name="Plus User",
        tier=CustomerTier.PLUS,
        recent_orders=[
            {"id": "PO-001", "date": "2024-01-20", "status": "delivered"},
            {"id": "PO-002", "date": "2024-01-15", "status": "processing"},
        ],
        registered_devices=[
            {"id": "DEV-001", "name": "pPhone 16 Pro", "serial": "PEAR-PPH-001"},
            {"id": "DEV-002", "name": "PearBook Pro", "serial": "PEAR-PBK-001"},
        ],
    )


@pytest.fixture
def premium_customer():
    """Create a premium tier customer."""
    return CustomerContext(
        customer_id="CUST-PREMIUM",
        email="premium@example.com",
        name="Premium User",
        tier=CustomerTier.PREMIUM,
        recent_orders=[
            {"id": "PO-100", "date": "2024-01-25", "status": "delivered"},
        ],
        registered_devices=[
            {"id": "DEV-100", "name": "pPhone 16 Pro Max", "serial": "PEAR-PPH-100"},
            {"id": "DEV-101", "name": "PearBook Pro 16", "serial": "PEAR-PBK-100"},
            {"id": "DEV-102", "name": "pWatch Ultra", "serial": "PEAR-PWU-100"},
        ],
    )


@pytest.fixture
def empty_state():
    """Create an empty agent state."""
    return AgentState(session_id="test-empty")


@pytest.fixture
def authenticated_state(plus_customer):
    """Create an authenticated state with a plus customer."""
    return AgentState(
        session_id="test-authenticated",
        customer=plus_customer,
        is_authenticated=True,
    )


@pytest.fixture
def mock_mcp_client():
    """Create a mock MCP client."""
    with patch("pear_genius.tools.mcp_client.MCPClient") as mock:
        mock_instance = MagicMock()
        mock_instance.connect = AsyncMock()
        mock_instance.call_tool = AsyncMock()
        mock_instance.list_tools = AsyncMock(return_value=[])
        mock.return_value = mock_instance
        yield mock_instance
