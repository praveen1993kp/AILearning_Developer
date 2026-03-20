export type SearchMode = 'vector' | 'bm25' | 'keyword' | 'hybrid';

export interface SearchRequest {
  query: string;
  searchType: SearchMode;
  topK: number;
  bm25Weight?: number;
  vectorWeight?: number;
}

export interface SearchResult {
  candidateId: string;
  resumeId?: string;
  name?: string;
  email?: string;
  phoneNumber?: string;
  score: number;
  experienceYears?: number;
  content?: string;
  snippet?: string;
  source?: string;
  summary?: string;
}

export interface SearchResponse {
  query: string;
  searchType: string;
  topK: number;
  resultCount: number;
  duration: number;
  results: SearchResult[];
  metadata?: Record<string, unknown>;
}
