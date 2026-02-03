"""MCP tools and client for Pear Genius agent."""

from .mcp_client import (
    create_mcp_client,
    load_mcp_tools,
    load_tools_by_prefix,
    load_tools_for_category,
    TOOL_CATEGORIES,
)
from .registry import (
    get_all_tools,
    get_tools_for_intent,
    get_tools_for_agent,
    list_available_categories,
)

__all__ = [
    "create_mcp_client",
    "load_mcp_tools",
    "load_tools_by_prefix",
    "load_tools_for_category",
    "TOOL_CATEGORIES",
    "get_all_tools",
    "get_tools_for_intent",
    "get_tools_for_agent",
    "list_available_categories",
]
