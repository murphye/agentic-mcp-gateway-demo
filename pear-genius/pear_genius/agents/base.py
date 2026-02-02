"""Base agent class for Pear Genius."""

from abc import ABC, abstractmethod
from typing import Any

import structlog
from langchain_anthropic import ChatAnthropic
from langchain_core.messages import AIMessage, HumanMessage, SystemMessage
from langchain_core.tools import StructuredTool

from ..config import settings
from ..state.conversation import AgentState

logger = structlog.get_logger()


class BaseAgent(ABC):
    """
    Base class for all Pear Genius agents.

    Provides common functionality for LLM interactions and tool usage.
    """

    def __init__(
        self,
        name: str,
        system_prompt: str,
        tools: list[StructuredTool] | None = None,
    ):
        self.name = name
        self.system_prompt = system_prompt
        self.tools = tools or []

        # Initialize the LLM
        self.llm = ChatAnthropic(
            model=settings.model_name,
            api_key=settings.anthropic_api_key,
            max_tokens=settings.max_tokens,
            temperature=settings.temperature,
        )

        # Bind tools if provided
        if self.tools:
            self.llm_with_tools = self.llm.bind_tools(self.tools)
        else:
            self.llm_with_tools = self.llm

    @abstractmethod
    async def process(self, state: AgentState) -> AgentState:
        """
        Process the current state and return updated state.

        This is the main entry point for agent logic.

        Args:
            state: Current conversation state

        Returns:
            Updated conversation state
        """
        pass

    def get_system_message(self, state: AgentState) -> SystemMessage:
        """
        Build the system message with customer context.

        Args:
            state: Current conversation state

        Returns:
            SystemMessage with context-aware prompt
        """
        context_parts = [self.system_prompt]

        # Add customer context if available
        if state.customer:
            context_parts.append(
                f"\n\nCustomer Context:\n"
                f"- Name: {state.customer.name}\n"
                f"- Customer ID: {state.customer.customer_id}\n"
                f"- Tier: {state.customer.tier.value}\n"
                f"- Email: {state.customer.email}"
            )

            if state.customer.recent_orders:
                orders_summary = ", ".join(
                    f"{o.get('id', 'Unknown')}" for o in state.customer.recent_orders[:3]
                )
                context_parts.append(f"- Recent Orders: {orders_summary}")

            if state.customer.registered_devices:
                devices_summary = ", ".join(
                    f"{d.get('name', 'Unknown')}" for d in state.customer.registered_devices[:3]
                )
                context_parts.append(f"- Devices: {devices_summary}")

        return SystemMessage(content="\n".join(context_parts))

    async def invoke_llm(
        self,
        state: AgentState,
        additional_context: str | None = None,
    ) -> AIMessage:
        """
        Invoke the LLM with the current conversation state.

        Args:
            state: Current conversation state
            additional_context: Optional additional context to append to system message

        Returns:
            AI response message
        """
        # Build messages
        system_msg = self.get_system_message(state)
        if additional_context:
            system_msg = SystemMessage(content=f"{system_msg.content}\n\n{additional_context}")

        messages = [system_msg] + state.messages

        logger.info(
            "Invoking LLM",
            agent=self.name,
            message_count=len(messages),
            has_tools=bool(self.tools),
        )

        # Invoke LLM
        response = await self.llm_with_tools.ainvoke(messages)

        # Log tool calls for debugging
        if hasattr(response, 'tool_calls') and response.tool_calls:
            for tc in response.tool_calls:
                logger.info(
                    "LLM tool call",
                    tool_name=tc.get('name'),
                    tool_args=tc.get('args'),
                )

        return response

    async def execute_tool(
        self,
        tool_name: str,
        tool_args: dict[str, Any],
    ) -> dict[str, Any]:
        """
        Execute a tool by name.

        Args:
            tool_name: Name of the tool to execute
            tool_args: Arguments for the tool

        Returns:
            Tool execution result
        """
        # Find the tool
        tool = next((t for t in self.tools if t.name == tool_name), None)
        if not tool:
            logger.error("Tool not found", tool=tool_name)
            return {"error": f"Tool '{tool_name}' not found"}

        logger.info("Executing tool", tool=tool_name, args=tool_args)

        try:
            result = await tool.ainvoke(tool_args)
            logger.info("Tool execution successful", tool=tool_name)
            return result
        except Exception as e:
            logger.error("Tool execution failed", tool=tool_name, error=str(e))
            return {"error": str(e)}

    def should_escalate(self, state: AgentState) -> tuple[bool, str]:
        """
        Determine if the conversation should be escalated.

        Override in subclasses for agent-specific escalation logic.

        Args:
            state: Current conversation state

        Returns:
            Tuple of (should_escalate, reason)
        """
        return False, ""
