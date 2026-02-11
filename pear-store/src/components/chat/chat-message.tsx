import { cn } from "@/lib/utils";
import type { ChatMessage as ChatMessageType } from "@/stores/chat-store";
import { Bot } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface ChatMessageProps {
  message: ChatMessageType;
}

// Matches both ORD-YYYY-NNN order IDs and PEAR-YYYY-NNNNNN order numbers
const ORDER_ID_REGEX = /(ORD-\d{4}-\d{3,}|PEAR-\d{4}-\d{4,})/g;

// Strip hallucinated XML tool calls that the model may emit when tools fail to load
const XML_TOOL_CALL_REGEX =
  /<function_calls>[\s\S]*?<\/function_calls>\s*(<function_result>[\s\S]*?<\/function_result>)?/g;

function sanitizeContent(text: string): string {
  return text.replace(XML_TOOL_CALL_REGEX, "").trim();
}

function linkifyOrderIds(text: string): string {
  return text.replace(ORDER_ID_REGEX, (id) => `[${id}](/account/orders/${id})`);
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div className={cn("flex gap-3 px-4 py-2", isUser && "flex-row-reverse")}>
      {!isUser && (
        <div className="h-8 w-8 rounded-full bg-pear/20 flex-shrink-0 flex items-center justify-center">
          <Bot className="h-4 w-4 text-pear-dark" />
        </div>
      )}
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-3 text-sm",
          isUser
            ? "bg-pear text-gray-dark"
            : "bg-gray-light text-gray-dark"
        )}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap">{message.content}</p>
        ) : (
          <div className="prose prose-sm max-w-none prose-p:my-1 prose-ul:my-1 prose-ol:my-1 prose-li:my-0.5">
            <ReactMarkdown
              components={{
                a: ({ href, children }) => (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-pear-dark underline hover:text-gray-dark"
                  >
                    {children}
                  </a>
                ),
              }}
            >
              {linkifyOrderIds(sanitizeContent(message.content))}
            </ReactMarkdown>
            {message.isStreaming && (
              <span className="inline-block w-1.5 h-4 bg-pear-dark animate-pulse ml-0.5 align-text-bottom" />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
