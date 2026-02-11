import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: number;
  isStreaming?: boolean;
  toolsUsed?: string[];
}

interface ChatState {
  sessionId: string | null;
  messages: ChatMessage[];
  isConnecting: boolean;
  isStreaming: boolean;
  activeTools: string[];
  error: string | null;

  setSessionId: (id: string) => void;
  addMessage: (message: ChatMessage) => void;
  appendToLastMessage: (content: string) => void;
  setLastMessageDone: () => void;
  setStreaming: (streaming: boolean) => void;
  setConnecting: (connecting: boolean) => void;
  addActiveTool: (tool: string) => void;
  removeActiveTool: (tool: string) => void;
  clearActiveTools: () => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      sessionId: null,
      messages: [],
      isConnecting: false,
      isStreaming: false,
      activeTools: [],
      error: null,

      setSessionId: (id) => set({ sessionId: id }),

      addMessage: (message) =>
        set((state) => ({ messages: [...state.messages, message] })),

      appendToLastMessage: (content) =>
        set((state) => {
          const messages = [...state.messages];
          const last = messages[messages.length - 1];
          if (last && last.role === "assistant") {
            messages[messages.length - 1] = {
              ...last,
              content: last.content + content,
            };
          }
          return { messages };
        }),

      setLastMessageDone: () =>
        set((state) => {
          const messages = [...state.messages];
          const last = messages[messages.length - 1];
          if (last && last.role === "assistant") {
            messages[messages.length - 1] = { ...last, isStreaming: false };
          }
          return { messages };
        }),

      setStreaming: (streaming) => set({ isStreaming: streaming }),
      setConnecting: (connecting) => set({ isConnecting: connecting }),

      addActiveTool: (tool) =>
        set((state) => ({
          activeTools: state.activeTools.includes(tool)
            ? state.activeTools
            : [...state.activeTools, tool],
        })),

      removeActiveTool: (tool) =>
        set((state) => ({
          activeTools: state.activeTools.filter((t) => t !== tool),
        })),

      clearActiveTools: () => set({ activeTools: [] }),

      setError: (error) => set({ error }),

      reset: () =>
        set({
          sessionId: null,
          messages: [],
          isConnecting: false,
          isStreaming: false,
          activeTools: [],
          error: null,
        }),
    }),
    {
      name: "pear-genius-chat",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        sessionId: state.sessionId,
        messages: state.messages,
      }),
    }
  )
);
