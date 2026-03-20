import { SearchMode } from '@/types/search.types';

export const SEARCH_MODES: { value: SearchMode; label: string; description: string }[] = [
  { value: 'keyword', label: 'Keyword', description: 'BM25 full-text search' },
  { value: 'vector', label: 'Semantic', description: 'Vector similarity search' },
  { value: 'hybrid', label: 'Hybrid', description: 'Combines keyword + semantic' },
];

export const SCORE_COLORS: Record<SearchMode, string> = {
  keyword: 'text-score-bm25',
  bm25: 'text-score-bm25',
  vector: 'text-score-vector',
  hybrid: 'text-score-hybrid',
};

export const SCORE_BG_COLORS: Record<SearchMode, string> = {
  keyword: 'bg-score-bm25/15 text-score-bm25',
  bm25: 'bg-score-bm25/15 text-score-bm25',
  vector: 'bg-score-vector/15 text-score-vector',
  hybrid: 'bg-score-hybrid/15 text-score-hybrid',
};

export const TOP_K_OPTIONS = [5, 10, 15, 20, 25, 30];

export const DEFAULT_SUGGESTIONS = [
  'Find senior React developers with 5+ years',
  'Machine learning engineers with Python experience',
  'Full stack developers with Node.js and TypeScript',
  'DevOps engineers with Kubernetes expertise',
  'Data scientists with NLP and LLM experience',
];

export const WELCOME_MESSAGE = `Hi! I'm **RecruitBot** 🤖\n\nI can help you search through resumes using three powerful modes:\n- **Keyword** — fast BM25 full-text search\n- **Semantic** — AI-powered vector similarity\n- **Hybrid** — the best of both worlds\n\nTry a search like "Senior React developer with TypeScript" to get started.`;
