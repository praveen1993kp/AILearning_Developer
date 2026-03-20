import { create } from 'zustand';
import { SearchMode, SearchResult } from '@/types/search.types';

interface SearchState {
  searchType: SearchMode;
  bm25Weight: number;
  vectorWeight: number;
  topK: number;
  results: SearchResult[];
  isSearching: boolean;
  lastQuery: string;
  // Setters
  setSearchType: (mode: SearchMode) => void;
  setBm25Weight: (w: number) => void;
  setVectorWeight: (w: number) => void;
  setTopK: (k: number) => void;
  setResults: (results: SearchResult[]) => void;
  setIsSearching: (v: boolean) => void;
  setLastQuery: (q: string) => void;
  clearResults: () => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  searchType: 'hybrid',
  bm25Weight: 0.5,
  vectorWeight: 0.5,
  topK: 10,
  results: [],
  isSearching: false,
  lastQuery: '',

  setSearchType: (mode) => set({ searchType: mode }),
  setBm25Weight: (w) => set({ bm25Weight: w }),
  setVectorWeight: (w) => set({ vectorWeight: w }),
  setTopK: (k) => set({ topK: k }),
  setResults: (results) => set({ results }),
  setIsSearching: (v) => set({ isSearching: v }),
  setLastQuery: (q) => set({ lastQuery: q }),
  clearResults: () => set({ results: [], lastQuery: '' }),
}));
