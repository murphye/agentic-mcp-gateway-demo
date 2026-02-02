"""Tests for MCP client using langchain-mcp-adapters."""

import pytest
from unittest.mock import AsyncMock, MagicMock, patch


class TestMCPClient:
    """Tests for MCP client functions."""

    def test_create_mcp_client(self):
        """Test creating an MCP client."""
        from pear_genius.tools.mcp_client import create_mcp_client

        client = create_mcp_client()
        assert client is not None

    @pytest.mark.asyncio
    async def test_load_mcp_tools_returns_list(self):
        """Test that load_mcp_tools returns a list."""
        from pear_genius.tools.mcp_client import load_mcp_tools

        with patch("pear_genius.tools.mcp_client.create_mcp_client") as mock_create:
            mock_client = MagicMock()
            mock_client.get_tools = AsyncMock(return_value=[])
            mock_create.return_value = mock_client

            tools = await load_mcp_tools()
            assert isinstance(tools, list)

    @pytest.mark.asyncio
    async def test_load_mcp_tools_handles_error(self):
        """Test that load_mcp_tools handles connection errors gracefully."""
        from pear_genius.tools.mcp_client import load_mcp_tools

        with patch("pear_genius.tools.mcp_client.create_mcp_client") as mock_create:
            mock_client = MagicMock()
            mock_client.get_tools = AsyncMock(side_effect=Exception("Connection failed"))
            mock_create.return_value = mock_client

            # Should return empty list on error, not raise
            tools = await load_mcp_tools()
            assert tools == []

    @pytest.mark.asyncio
    async def test_load_tools_by_prefix(self):
        """Test filtering tools by prefix."""
        from pear_genius.tools.mcp_client import load_tools_by_prefix

        mock_tool1 = MagicMock()
        mock_tool1.name = "order-management_get_order"
        mock_tool2 = MagicMock()
        mock_tool2.name = "product-catalog_get_product"
        mock_tool3 = MagicMock()
        mock_tool3.name = "order-management_list_orders"

        with patch("pear_genius.tools.mcp_client.load_mcp_tools") as mock_load:
            mock_load.return_value = [mock_tool1, mock_tool2, mock_tool3]

            tools = await load_tools_by_prefix("order-management")

            assert len(tools) == 2
            assert all("order-management" in t.name for t in tools)

    @pytest.mark.asyncio
    async def test_load_tools_for_category(self):
        """Test loading tools for a specific category."""
        from pear_genius.tools.mcp_client import load_tools_for_category

        mock_tool1 = MagicMock()
        mock_tool1.name = "order-management_get_order"
        mock_tool2 = MagicMock()
        mock_tool2.name = "shipping_track_package"
        mock_tool3 = MagicMock()
        mock_tool3.name = "product-catalog_get_product"

        with patch("pear_genius.tools.mcp_client.load_mcp_tools") as mock_load:
            mock_load.return_value = [mock_tool1, mock_tool2, mock_tool3]

            # Order category includes order-management and shipping
            tools = await load_tools_for_category("order")

            assert len(tools) == 2


class TestToolCategories:
    """Tests for tool category mappings."""

    def test_tool_categories_defined(self):
        """Test that tool categories are defined."""
        from pear_genius.tools.mcp_client import TOOL_CATEGORIES

        assert "order" in TOOL_CATEGORIES
        assert "warranty" in TOOL_CATEGORIES
        assert "troubleshoot" in TOOL_CATEGORIES
        assert "account" in TOOL_CATEGORIES
        assert "product" in TOOL_CATEGORIES
        assert "support" in TOOL_CATEGORIES

    def test_order_category_prefixes(self):
        """Test order category service prefixes."""
        from pear_genius.tools.mcp_client import TOOL_CATEGORIES

        prefixes = TOOL_CATEGORIES["order"]
        assert "order-management" in prefixes
        assert "shipping" in prefixes

    def test_account_category_prefixes(self):
        """Test account category service prefixes."""
        from pear_genius.tools.mcp_client import TOOL_CATEGORIES

        prefixes = TOOL_CATEGORIES["account"]
        assert "customer-accounts" in prefixes
