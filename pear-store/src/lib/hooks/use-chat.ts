import { useCallback, useEffect, useRef, useState } from "react";

import {
  approveAction,
  createChatSession,
  getSession,
  rejectAction,
  sendChatMessage,
} from "@/lib/api/pear-genius";
import { useChatStore } from "@/stores/chat-store";

interface SSEAction {
  tool_call_id: string;
  tool_name: string;
  title: string;
  description: string[];
}

interface SSEEvent {
  type: string;
  content?: string;
  tool?: string;
  reason?: string;
  actions?: SSEAction[];
}

function parseSSELines(text: string): SSEEvent[] {
  const events: SSEEvent[] = [];
  const lines = text.split("\n");

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith("data:")) {
      const jsonStr = trimmed.slice(5).trim();
      if (jsonStr) {
        try {
          events.push(JSON.parse(jsonStr));
        } catch {
          // skip malformed JSON
        }
      }
    }
  }

  return events;
}

export function useChat() {
  const store = useChatStore();
  const {
    sessionId,
    messages,
    isConnecting,
    isStreaming,
    activeTools,
    error,
    pendingApproval,
    isAwaitingApproval,
    setSessionId,
    addMessage,
    appendToLastMessage,
    setLastMessageDone,
    setStreaming,
    setConnecting,
    addActiveTool,
    removeActiveTool,
    clearActiveTools,
    setError,
    setPendingApproval,
    clearPendingApproval,
    resolveApproval,
    reset,
  } = store;

  // Wait for zustand to hydrate from sessionStorage before initializing
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    const unsub = useChatStore.persist.onFinishHydration(() =>
      setHydrated(true)
    );
    if (useChatStore.persist.hasHydrated()) setHydrated(true);
    return unsub;
  }, []);

  // Guard against concurrent session creation
  const creatingSession = useRef(false);

  const createNewSession = useCallback(async () => {
    if (creatingSession.current) return;
    creatingSession.current = true;

    setConnecting(true);
    setError(null);

    try {
      const { session_id, welcome_message } = await createChatSession();
      setSessionId(session_id);
      addMessage({
        id: crypto.randomUUID(),
        role: "assistant",
        content: welcome_message,
        timestamp: Date.now(),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to connect");
    } finally {
      setConnecting(false);
      creatingSession.current = false;
    }
  }, [setSessionId, addMessage, setConnecting, setError]);

  // Auto-initialize on mount (after hydration)
  const initialized = useRef(false);
  useEffect(() => {
    if (!hydrated || initialized.current) return;
    initialized.current = true;

    const currentSessionId = useChatStore.getState().sessionId;

    if (currentSessionId) {
      // Verify the backend still has this session
      getSession(currentSessionId).then((valid) => {
        if (!valid) {
          reset();
          createNewSession();
        }
      });
    } else {
      createNewSession();
    }
  }, [hydrated, reset, createNewSession]);

  /**
   * Shared SSE stream processor for /messages, /approve, and /reject responses.
   */
  const processSSEStream = useCallback(
    async (response: Response) => {
      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response stream");

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        const lastNewline = buffer.lastIndexOf("\n");
        if (lastNewline === -1) continue;

        const complete = buffer.slice(0, lastNewline + 1);
        buffer = buffer.slice(lastNewline + 1);

        const events = parseSSELines(complete);

        for (const event of events) {
          switch (event.type) {
            case "token":
              if (event.content) {
                appendToLastMessage(event.content);
              }
              break;
            case "tool_start":
              if (event.tool) {
                addActiveTool(event.tool);
              }
              break;
            case "tool_end":
              if (event.tool) {
                removeActiveTool(event.tool);
              }
              break;
            case "approval_required":
              if (event.actions) {
                setPendingApproval({ actions: event.actions });
              }
              break;
            case "error":
              setError(event.content || "An error occurred");
              break;
            case "done":
              break;
          }
        }
      }

      // Process any remaining buffer
      if (buffer.trim()) {
        const events = parseSSELines(buffer);
        for (const event of events) {
          if (event.type === "token" && event.content) {
            appendToLastMessage(event.content);
          }
          if (event.type === "approval_required" && event.actions) {
            setPendingApproval({ actions: event.actions });
          }
        }
      }
    },
    [
      appendToLastMessage,
      addActiveTool,
      removeActiveTool,
      setError,
      setPendingApproval,
    ]
  );

  const sendMessage = useCallback(
    async (content: string) => {
      if (!sessionId || isStreaming) return;

      addMessage({
        id: crypto.randomUUID(),
        role: "user",
        content,
        timestamp: Date.now(),
      });

      addMessage({
        id: crypto.randomUUID(),
        role: "assistant",
        content: "",
        timestamp: Date.now(),
        isStreaming: true,
      });

      setStreaming(true);
      setError(null);
      clearActiveTools();

      try {
        const response = await sendChatMessage(sessionId, content);
        await processSSEStream(response);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to send message"
        );
      } finally {
        setLastMessageDone();
        setStreaming(false);
        clearActiveTools();
      }
    },
    [
      sessionId,
      isStreaming,
      addMessage,
      setLastMessageDone,
      setStreaming,
      setError,
      clearActiveTools,
      processSSEStream,
    ]
  );

  const handleApprove = useCallback(async () => {
    if (!sessionId) return;

    // Snapshot the approval into the message history as resolved, then clear
    resolveApproval("approved");

    // Add a placeholder assistant message for the resumed response
    addMessage({
      id: crypto.randomUUID(),
      role: "assistant",
      content: "",
      timestamp: Date.now(),
      isStreaming: true,
    });

    setStreaming(true);
    setError(null);
    clearActiveTools();

    try {
      const response = await approveAction(sessionId);
      await processSSEStream(response);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to approve action"
      );
    } finally {
      setLastMessageDone();
      setStreaming(false);
      clearActiveTools();
    }
  }, [
    sessionId,
    addMessage,
    setLastMessageDone,
    setStreaming,
    setError,
    clearActiveTools,
    resolveApproval,
    processSSEStream,
  ]);

  const handleReject = useCallback(async () => {
    if (!sessionId) return;

    // Snapshot the approval into the message history as resolved, then clear
    resolveApproval("rejected");

    // Add a placeholder assistant message for the rejection acknowledgment
    addMessage({
      id: crypto.randomUUID(),
      role: "assistant",
      content: "",
      timestamp: Date.now(),
      isStreaming: true,
    });

    setStreaming(true);
    setError(null);
    clearActiveTools();

    try {
      const response = await rejectAction(sessionId);
      await processSSEStream(response);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to reject action"
      );
    } finally {
      setLastMessageDone();
      setStreaming(false);
      clearActiveTools();
    }
  }, [
    sessionId,
    addMessage,
    setLastMessageDone,
    setStreaming,
    setError,
    clearActiveTools,
    resolveApproval,
    processSSEStream,
  ]);

  const newChat = useCallback(async () => {
    reset();
    await createNewSession();
  }, [reset, createNewSession]);

  return {
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
  };
}
