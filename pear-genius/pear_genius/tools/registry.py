"""Tool registry for Pear Genius agents.

This module provides functions to load MCP tools from AgentGateway
for use with LangChain/LangGraph agents. Tools are loaded dynamically
from the MCP server rather than being defined manually.
"""

import structlog
from langchain_core.tools import BaseTool

from .mcp_client import load_mcp_tools, load_tools_for_category, TOOL_CATEGORIES

logger = structlog.get_logger()

# Cache for loaded tools
_tools_cache: list[BaseTool] | None = None


async def get_all_tools(force_refresh: bool = False) -> list[BaseTool]:
    """
    Get all available MCP tools from AgentGateway.

    Args:
        force_refresh: If True, reload tools from the server

    Returns:
        List of all available LangChain tools
    """
    global _tools_cache

    if _tools_cache is None or force_refresh:
        _tools_cache = await load_mcp_tools()
        logger.info("Tools cache populated", count=len(_tools_cache))

    return _tools_cache


async def get_tools_for_intent(intent: str) -> list[BaseTool]:
    """
    Get tools relevant to a specific customer intent.

    Args:
        intent: The classified intent (order, return, warranty, etc.)

    Returns:
        List of tools relevant to the intent
    """
    # Map intents to tool categories
    intent_to_category = {
        "order": "order",
        "return": "order",  # Returns are handled by order-management
        "warranty": "warranty",
        "troubleshoot": "troubleshoot",
        "account": "account",
        "product": "product",
        "escalate": "support",
        "general": None,  # Use all tools
    }

    category = intent_to_category.get(intent)
    if category:
        return await load_tools_for_category(category)

    # For general intent, return all tools
    return await get_all_tools()


def get_tools_for_agent(agent_name: str) -> list[BaseTool]:
    """
    Get tools for a specific agent (synchronous wrapper).

    This returns an empty list. Tools should be loaded asynchronously
    using get_all_tools() or get_tools_for_intent() during agent
    initialization.

    For the supervisor agent with LangGraph, tools are loaded at
    graph construction time via the async load_mcp_tools() function.

    Args:
        agent_name: Name of the agent (supervisor, order, warranty, etc.)

    Returns:
        Empty list - use async functions for actual tool loading
    """
    # Note: This is kept for backwards compatibility with supervisor.py
    # In async contexts, use get_all_tools() or get_tools_for_intent()
    logger.debug(
        "Synchronous get_tools_for_agent called",
        agent=agent_name,
        note="Use async get_all_tools() for MCP tools",
    )
    return []


def list_available_categories() -> list[str]:
    """
    List all available tool categories.

    Returns:
        List of category names
    """
    return list(TOOL_CATEGORIES.keys())


def get_service_prefixes_for_category(category: str) -> list[str]:
    """
    Get the service prefixes for a tool category.

    Args:
        category: Category name

    Returns:
        List of service prefixes (e.g., ["order-management", "shipping"])
    """
    return TOOL_CATEGORIES.get(category, [])
