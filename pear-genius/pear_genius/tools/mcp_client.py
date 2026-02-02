"""MCP Client for connecting to AgentGateway using langchain-mcp-adapters.

Includes a workaround for https://github.com/langchain-ai/langchain-mcp-adapters/issues/283
where structuredContent is ignored.
"""

import json
from typing import Any

import structlog
from langchain_core.tools import BaseTool
from langchain_mcp_adapters.client import MultiServerMCPClient
import langchain_mcp_adapters.tools as mcp_tools_module

from ..config import settings

logger = structlog.get_logger()


# Monkey-patch langchain-mcp-adapters to handle structuredContent
# This fixes: https://github.com/langchain-ai/langchain-mcp-adapters/issues/283
_original_convert_call_tool_result = None

def _patched_convert_call_tool_result(result: Any) -> tuple[str, Any]:
    """
    Convert MCP CallToolResult to (content_string, artifact) tuple.

    agentgateway returns: {"content": [], "structuredContent": {...data...}}
    The original function only reads "content", missing the actual data.

    Returns a tuple of (content_string, structured_data) for content_and_artifact format.
    """
    # First try structuredContent if content is empty
    structured = getattr(result, 'structuredContent', None)
    content = getattr(result, 'content', None)

    # If content is empty/None but structuredContent exists, use it
    if (not content or content == []) and structured:
        logger.debug("Using structuredContent from MCP result")
        content_str = json.dumps(structured, indent=2) if not isinstance(structured, str) else structured
        return (content_str, structured)

    # Otherwise, extract content
    content_str = ""
    if content:
        if isinstance(content, list):
            texts = []
            for item in content:
                if hasattr(item, 'text'):
                    texts.append(item.text)
                elif isinstance(item, str):
                    texts.append(item)
            content_str = "\n".join(texts)
        else:
            content_str = str(content)

    # Return tuple format for content_and_artifact
    return (content_str, structured or content)


def _apply_structured_content_patch():
    """Apply the monkey patch to fix structuredContent handling."""
    global _original_convert_call_tool_result

    # Find and patch the convert function
    if hasattr(mcp_tools_module, '_convert_call_tool_result'):
        _original_convert_call_tool_result = mcp_tools_module._convert_call_tool_result
        mcp_tools_module._convert_call_tool_result = _patched_convert_call_tool_result
        logger.info("Applied structuredContent patch to langchain-mcp-adapters")
    elif hasattr(mcp_tools_module, 'convert_call_tool_result'):
        _original_convert_call_tool_result = mcp_tools_module.convert_call_tool_result
        mcp_tools_module.convert_call_tool_result = _patched_convert_call_tool_result
        logger.info("Applied structuredContent patch to langchain-mcp-adapters")
    else:
        logger.warning("Could not find convert function to patch in langchain-mcp-adapters")


# Apply patch on module load
_apply_structured_content_patch()


def create_mcp_client() -> MultiServerMCPClient:
    """
    Create an MCP client configured to connect to AgentGateway.

    AgentGateway exposes backend services as MCP tools via HTTP transport.
    This uses the official langchain-mcp-adapters package.

    Returns:
        MultiServerMCPClient configured for AgentGateway
    """
    return MultiServerMCPClient(
        {
            "agentgateway": {
                "transport": "streamable_http",
                "url": f"{settings.agent_gateway_url}/mcp",
            }
        }
    )


async def load_mcp_tools(filter_essential: bool = True) -> list[BaseTool]:
    """
    Load MCP tools from AgentGateway.

    Args:
        filter_essential: If True, only load essential tools to reduce token usage

    Returns:
        List of LangChain-compatible tools from the MCP server
    """
    client = create_mcp_client()

    try:
        all_tools = await client.get_tools()
        logger.info("Loaded all MCP tools from AgentGateway", count=len(all_tools))

        if filter_essential:
            # Filter to only essential tools to stay under API rate limits
            tools = [t for t in all_tools if t.name in ESSENTIAL_TOOLS]
            logger.info(
                "Filtered to essential tools",
                total=len(all_tools),
                filtered=len(tools),
            )
        else:
            tools = all_tools

        # Log tool names for debugging
        logger.debug("Available tools", tools=[t.name for t in tools])

        return tools
    except Exception as e:
        logger.error("Failed to load MCP tools", error=str(e))
        return []


async def load_tools_by_prefix(prefix: str) -> list[BaseTool]:
    """
    Load MCP tools filtered by name prefix.

    Args:
        prefix: Tool name prefix to filter by (e.g., "order-management")

    Returns:
        List of tools matching the prefix
    """
    all_tools = await load_mcp_tools()
    filtered = [t for t in all_tools if t.name.startswith(prefix)]
    logger.info("Filtered MCP tools", prefix=prefix, count=len(filtered))
    return filtered


# Tool category mappings for agent routing
TOOL_CATEGORIES = {
    "order": ["order-management", "shipping"],
    "warranty": ["product-support"],
    "troubleshoot": ["product-support", "product-catalog"],
    "account": ["customer-accounts"],
    "product": ["product-catalog", "online-store"],
    "support": ["customer-support"],
}

# Essential tools whitelist for customer support (to reduce token usage)
# Only these tools will be loaded to stay under API rate limits
ESSENTIAL_TOOLS = [
    # Order management
    "order-management_getOrder",
    "order-management_listOrders",
    "order-management_lookupOrder",
    "order-management_getOrderTracking",
    "order-management_checkReturnEligibility",
    "order-management_createReturn",
    "order-management_getReturn",
    "order-management_cancelOrder",
    # Shipping
    "shipping_getShipment",
    "shipping_trackShipment",
    "shipping_listShipments",
    # Product support
    "product-support_checkWarranty",
    "product-support_getArticle",
    "product-support_searchArticles",
    "product-support_listFAQs",
    "product-support_runDiagnostics",
    "product-support_scheduleRepair",
    # Customer accounts
    "customer-accounts_getProfile",
    "customer-accounts_listDevices",
    "customer-accounts_listAddresses",
    # Product catalog
    "product-catalog_getProduct",
    "product-catalog_listProducts",
]


async def load_tools_for_category(category: str) -> list[BaseTool]:
    """
    Load MCP tools for a specific intent category.

    Args:
        category: Intent category (order, warranty, troubleshoot, account, product, support)

    Returns:
        List of tools relevant to the category
    """
    prefixes = TOOL_CATEGORIES.get(category, [])
    if not prefixes:
        return await load_mcp_tools()  # Return all tools for unknown categories

    all_tools = await load_mcp_tools()
    filtered = [
        t for t in all_tools if any(t.name.startswith(p) for p in prefixes)
    ]
    logger.info("Loaded tools for category", category=category, count=len(filtered))
    return filtered
