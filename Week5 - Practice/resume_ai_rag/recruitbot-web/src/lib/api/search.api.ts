import apiClient from './client';
import { SearchRequest, SearchResponse } from '@/types/search.types';

// Adapts our internal SearchMode to backend endpoint paths
function getEndpoint(searchType: string): string {
  if (searchType === 'keyword' || searchType === 'bm25') return '/v1/search/bm25';
  if (searchType === 'vector') return '/v1/search/vector';
  if (searchType === 'hybrid') return '/v1/search/hybrid';
  return '/v1/search'; // pipeline fallback
}

export const searchApi = {
  async searchResumes(params: SearchRequest): Promise<SearchResponse> {
    const endpoint = getEndpoint(params.searchType);
    const startTime = Date.now();

    let body: Record<string, unknown> = { query: params.query, topK: params.topK };

    if (params.searchType === 'hybrid') {
      body = { query: params.query, options: { topK: params.topK, bm25Weight: params.bm25Weight, vectorWeight: params.vectorWeight } };
    }

    const response = await apiClient.post(endpoint, body);
    const duration = Date.now() - startTime;
    const raw = response.data;

    // Normalise backend response shape → SearchResponse
    let results: SearchResponse['results'] = [];

    if (Array.isArray(raw)) {
      results = raw.map(normaliseResult);
    } else if (Array.isArray(raw.results)) {
      results = raw.results.map(normaliseResult);
    } else if (Array.isArray(raw.ranked)) {
      results = raw.ranked.map(normaliseResult);
    } else if (raw.bm25Results || raw.vectorResults) {
      const bm = Array.isArray(raw.bm25Results) ? raw.bm25Results : [];
      const ve = Array.isArray(raw.vectorResults) ? raw.vectorResults : [];
      const map = new Map<string, unknown>();
      [...bm, ...ve].forEach((r) => { const k = (r as Record<string, unknown>).resumeId as string || JSON.stringify(r); if (!map.has(k)) map.set(k, r); });
      results = Array.from(map.values()).map(normaliseResult);
    }

    return {
      query: params.query,
      searchType: params.searchType,
      topK: params.topK,
      resultCount: results.length,
      duration: raw.totalMs || duration,
      results,
      metadata: raw.componentTimings ? { componentTimings: raw.componentTimings } : undefined,
    };
  },
};

function normaliseResult(r: unknown): SearchResponse['results'][number] {
  const c = r as Record<string, unknown>;
  return {
    candidateId: (c.resumeId as string) || (c._id as string) || String(Math.random()),
    resumeId: (c.resumeId as string) || (c._id as string),
    name: (c.name as string) || undefined,
    email: (c.email as string) || undefined,
    phoneNumber: (c.phone as string) || (c.phoneNumber as string) || undefined,
    score: typeof c.score === 'number' ? c.score : 0,
    experienceYears: (c.total_Experience as number) || (c.experienceYears as number) || undefined,
    content: (c.text as string) || (c.snippet as string) || '',
    snippet: (c.snippet as string) || (c.text as string) || '',
    source: (c.source as string) || undefined,
    summary: (c.summary as string) || undefined,
  };
}
