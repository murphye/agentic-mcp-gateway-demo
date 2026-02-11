"use client";

import type { ChatMessage as ChatMessageType } from "@/stores/chat-store";
import { useEffect, useRef } from "react";

import { ChatMessage } from "./chat-message";
import { ChatToolIndicator } from "./chat-tool-indicator";
import { ChatTypingIndicator } from "./chat-typing-indicator";
import { ChatWelcome } from "./chat-welcome";

interface ChatMessageListProps {
  messages: ChatMessageType[];
  isStreaming: boolean;
  activeTools: string[];
}

export function ChatMessageList({
  messages,
  isStreaming,
  activeTools,
}: ChatMessageListProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const hasOverflow = container.scrollHeight > container.clientHeight;
    if (!hasOverflow) return;
    const isNearBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight < 100;
    if (isNearBottom) {
      container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
    }
  }, [messages, activeTools]);

  const showTypingIndicator =
    isStreaming &&
    activeTools.length > 0 &&
    messages[messages.length - 1]?.content === "";

  return (
    <div ref={containerRef} className="flex-1 overflow-y-auto">
      <ChatWelcome />
      <div className="pb-4">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        {activeTools.length > 0 && (
          <ChatToolIndicator tools={activeTools} />
        )}
        {showTypingIndicator && <ChatTypingIndicator />}
      </div>
    </div>
  );
}
