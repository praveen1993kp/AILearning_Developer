import { useChatStore } from '@/lib/stores/chat.store';
import { useSearch } from './use-search';

export function useChat() {
  const { messages, clearMessages } = useChatStore();
  const { search, isSearching } = useSearch();

  return { messages, clearMessages, search, isSearching };
}
