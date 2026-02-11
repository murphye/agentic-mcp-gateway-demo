"use client";

import type { PendingApproval } from "@/stores/chat-store";
import type { ChatMessage as ChatMessageType } from "@/stores/chat-store";
import { useCallback, useEffect, useRef } from "react";

import { ChatApprovalCard } from "./chat-approval-card";
import { ChatMessage } from "./chat-message";
import { ChatToolIndicator } from "./chat-tool-indicator";
import { ChatTypingIndicator } from "./chat-typing-indicator";
import { ChatWelcome } from "./chat-welcome";

interface ChatMessageListProps {
  messages: ChatMessageType[];
  isStreaming: boolean;
  activeTools: string[];
  pendingApproval: PendingApproval | null;
  onApprove: () => void;
  onReject: () => void;
}

export function ChatMessageList({
  messages,
  isStreaming,
  activeTools,
  pendingApproval,
  onApprove,
  onReject,
}: ChatMessageListProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wasNearBottom = useRef(true);
  const prevApproval = useRef<PendingApproval | null>(null);

  // Track scroll position continuously so we know *before* new content arrives
  const handleScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    wasNearBottom.current =
      container.scrollHeight - container.scrollTop - container.clientHeight < 150;
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const hasOverflow = container.scrollHeight > container.clientHeight;
    if (!hasOverflow) return;

    // Always scroll when approval card just appeared
    const approvalJustAppeared =
      pendingApproval !== null && prevApproval.current === null;
    prevApproval.current = pendingApproval;

    if (wasNearBottom.current || approvalJustAppeared) {
      container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
    }
  }, [messages, activeTools, pendingApproval]);

  const showTypingIndicator =
    isStreaming &&
    activeTools.length > 0 &&
    messages[messages.length - 1]?.content === "";

  return (
    <div ref={containerRef} className="flex-1 overflow-y-auto">
      <ChatWelcome />
      <div className="pb-4">
        {messages.map((message) =>
          message.approval ? (
            <ChatApprovalCard
              key={message.id}
              actions={message.approval.actions}
              status={message.approval.status}
            />
          ) : (
            <ChatMessage key={message.id} message={message} />
          )
        )}
        {pendingApproval && (
          <ChatApprovalCard
            actions={pendingApproval.actions}
            onApprove={onApprove}
            onReject={onReject}
            disabled={isStreaming}
          />
        )}
        {activeTools.length > 0 && (
          <ChatToolIndicator tools={activeTools} />
        )}
        {showTypingIndicator && <ChatTypingIndicator />}
      </div>
    </div>
  );
}
