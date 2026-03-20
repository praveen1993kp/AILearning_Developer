import { useCallback } from 'react';
import toast from 'react-hot-toast';
import { searchApi } from '@/lib/api/search.api';
import { cacheSearchResults } from '@/lib/api/candidate.api';
import { useSearchStore } from '@/lib/stores/search.store';
import { useChatStore } from '@/lib/stores/chat.store';
import { sanitizeQuery } from '@/lib/utils/sanitize';
import { formatDuration, pluralise } from '@/lib/utils/formatters';
import { MessageType } from '@/types/chat.types';

export function useSearch() {
  const { searchType, bm25Weight, vectorWeight, topK, setResults, setIsSearching, setLastQuery, isSearching } = useSearchStore();
  const { addUserMessage, addBotMessage, updateLastBotMessage } = useChatStore();

  const search = useCallback(async (rawQuery: string) => {
    const query = sanitizeQuery(rawQuery);
    if (!query || isSearching) return;

    addUserMessage(query);
    addBotMessage('Searching…', undefined, true);
    setIsSearching(true);
    setLastQuery(query);

    try {
      const response = await searchApi.searchResumes({ query, searchType, bm25Weight, vectorWeight, topK });
      cacheSearchResults(response.results);
      setResults(response.results);
      const summary = `Found **${pluralise(response.resultCount, 'result')}** in ${formatDuration(response.duration)}`;
      updateLastBotMessage({
        content: summary,
        results: response.results,
        isLoading: false,
        type: MessageType.Bot,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Search failed';
      toast.error(msg);
      updateLastBotMessage({ content: `❌ ${msg}`, isLoading: false, type: MessageType.Bot });
    } finally {
      setIsSearching(false);
    }
  }, [searchType, bm25Weight, vectorWeight, topK, isSearching, addUserMessage, addBotMessage, updateLastBotMessage, setResults, setIsSearching, setLastQuery]);

  return { search, isSearching };
}
