export interface Resume {
    _id: string;
    text: string;
    embedding: number[];
    name: string;
    email: string;
    phone: string | null;
    location: string;
    company: string;
    role: string;
    education: string;
    total_Experience: number;
    relevant_Experience: number;
    skills: string[];
}

export interface EmbeddingRequest {
    model?: string;
    input: string;
}

export interface SearchRequest {
    query: string;
    topK?: number;
    filters?: {
        minYearsExperience?: number;
    };
}

export interface RerankRequest {
    query: string;
    candidates: Array<{
        resumeId: string;
        snippet: string;
    }>;
    topK?: number;
}

export interface SummarizeRequest {
    query: string;
    candidate: {
        resumeId: string;
        snippet: string;
    };
    style?: 'short' | 'detailed';
    maxTokens?: number;
}

export interface HealthCheckResponse {
    status: string;
    version: string;
    uptime: number;
}

export interface DBHealthCheckResponse {
    status: string;
    latency: number;
}

export interface Candidate {
    resumeId: string;
    snippet: string;
    score?: number;
    source?: 'bm25' | 'vector' | string;
    summary?: string;
}

export interface SummaryOptions {
    style?: 'short' | 'detailed';
    maxTokens?: number;
}