import { useCallback, useEffect, useRef, useState } from "react";

import { createChatSession, getSession, sendChatMessage } from "@/lib/api/pear-genius";
import { useChatStore } from "@/stores/chat-store";

function parseSSELines(text: string): Array<{ type: string; content?: string; tool?: string; reason?: string }> {
  const events: Array<{ type: string; content?: string; tool?: string; reason?: string }> = [];
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
    reset,
  } = store;

  // Wait for zustand to hydrate from sessionStorage before initializing
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    const unsub = useChatStore.persist.onFinishHydration(() => setHydrated(true));
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
              case "error":
                setError(event.content || "An error occurred");
                break;
              case "done":
                break;
            }
          }
        }

        if (buffer.trim()) {
          const events = parseSSELines(buffer);
          for (const event of events) {
            if (event.type === "token" && event.content) {
              appendToLastMessage(event.content);
            }
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to send message");
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
      appendToLastMessage,
      setLastMessageDone,
      setStreaming,
      setError,
      clearActiveTools,
      addActiveTool,
      removeActiveTool,
    ]
  );

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
    sendMessage,
    newChat,
  };
}
