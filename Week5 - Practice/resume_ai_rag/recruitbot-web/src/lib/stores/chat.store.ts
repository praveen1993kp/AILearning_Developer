import { create } from 'zustand';
import { Message, MessageType } from '@/types/chat.types';
import { SearchResult } from '@/types/search.types';

interface ChatState {
  messages: Message[];
  addUserMessage: (text: string) => void;
  addBotMessage: (text: string, results?: SearchResult[], isLoading?: boolean) => void;
  updateLastBotMessage: (updates: Partial<Message>) => void;
  clearMessages: () => void;
}

let idCounter = 0;
function genId() { return `msg-${++idCounter}-${Date.now()}`; }

export const useChatStore = create<ChatState>((set) => ({
  messages: [],

  addUserMessage: (text) =>
    set((state) => ({
      messages: [
        ...state.messages,
        {
          id: genId(),
          type: MessageType.User,
          content: text,
          timestamp: new Date(),
        },
      ],
    })),

  addBotMessage: (text, results, isLoading = false) =>
    set((state) => ({
      messages: [
        ...state.messages,
        {
          id: genId(),
          type: MessageType.Bot,
          content: text,
          results,
          isLoading,
          timestamp: new Date(),
        },
      ],
    })),

  updateLastBotMessage: (updates) =>
    set((state) => {
      const idx = [...state.messages].reverse().findIndex((m) => m.type === MessageType.Bot);
      if (idx === -1) return state;
      const realIdx = state.messages.length - 1 - idx;
      const updated = [...state.messages];
      updated[realIdx] = { ...updated[realIdx], ...updates };
      return { messages: updated };
    }),

  clearMessages: () => set({ messages: [] }),
}));
