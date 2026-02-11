"use client";

import { useChat } from "@/lib/hooks/use-chat";
import { ArrowLeft, Bot, SquarePen } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

import { ChatInput } from "./chat-input";
import { ChatMessageList } from "./chat-message-list";

export function ChatInterface() {
  // Hide the site footer on this page to prevent scroll issues
  useEffect(() => {
    const footer = document.getElementById("site-footer");
    if (footer) footer.style.display = "none";
    return () => {
      if (footer) footer.style.display = "";
    };
  }, []);

  const {
    messages,
    isConnecting,
    isStreaming,
    activeTools,
    error,
    pendingApproval,
    isAwaitingApproval,
    sendMessage,
    handleApprove,
    handleReject,
    newChat,
  } = useChat();

  return (
    <div className="mx-auto max-w-7xl px-4 lg:px-8 flex flex-col h-[calc(100vh-73px)]">
      {/* Header */}
      <div className="flex items-center gap-3 py-3 border-b border-gray-200">
        <Link
          href="/support"
          className="p-1 text-gray-medium hover:text-gray-dark transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="h-8 w-8 rounded-full bg-pear/20 flex items-center justify-center">
          <Bot className="h-4 w-4 text-pear-dark" />
        </div>
        <div className="flex-1">
          <h1 className="text-sm font-semibold text-gray-dark">Pear Genius</h1>
          <p className="text-xs text-gray-medium">
            {isConnecting
              ? "Connecting..."
              : isAwaitingApproval
                ? "Awaiting your approval..."
                : isStreaming
                  ? "Typing..."
                  : "AI Support Assistant"}
          </p>
        </div>
        <button
          type="button"
          onClick={newChat}
          disabled={isConnecting || isStreaming}
          className="p-2 text-gray-medium hover:text-gray-dark transition-colors disabled:opacity-50"
          aria-label="New chat"
          title="New chat"
        >
          <SquarePen className="h-5 w-5" />
        </button>
      </div>

      {/* Error banner */}
      {error && (
        <div className="py-2 bg-red-50 text-red-700 text-sm border-b border-red-100">
          {error}
        </div>
      )}

      {/* Messages */}
      <ChatMessageList
        messages={messages}
        isStreaming={isStreaming}
        activeTools={activeTools}
        pendingApproval={pendingApproval}
        onApprove={handleApprove}
        onReject={handleReject}
      />

      {/* Input */}
      <ChatInput
        onSend={sendMessage}
        disabled={isConnecting || isStreaming || isAwaitingApproval}
      />
    </div>
  );
}
