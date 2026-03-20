export interface Candidate {
  resumeId?: string
  id?: string
  snippet?: string
  text?: string
  score?: number
  source?: string
  summary?: string
  [key: string]: any
}

export interface SearchResult extends Candidate {
  resumeId?: string
}

export interface SearchResponse {
  results: SearchResult[]
  bm25Fallback?: boolean
  vectorFallback?: boolean
  componentTimings?: Record<string, number>
  totalMs?: number
}

export interface SummaryOptions {
  style?: 'short' | 'detailed' | string
  maxTokens?: number
}

export interface SummarizeResponse {
  summary?: string
  warning?: string
}

export default {} as any
