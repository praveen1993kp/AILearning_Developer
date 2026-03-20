import axios from 'axios';
import config from '../config';
import { Candidate, SummaryOptions } from '../types';

export class LLMService {
    private apiUrl: string | undefined;
    private apiKey: string;

    constructor() {
        // Prefer explicit config values exposed in config/index.ts
        this.apiUrl = config.LLM_API_URL || config.MISTRAL_LLM_API_URL || process.env.LLM_API_URL || process.env.MISTRAL_LLM_API_URL || '';
        this.apiKey = config.MISTRAL_LLM_API_KEY || process.env.MISTRAL_LLM_API_KEY || '';
        // If no external LLM is configured, fall back to local mock LLM (helpful for dev)
        if (!this.apiUrl && (process.env.NODE_ENV !== 'production')) {
            const port = config.PORT || 3000
            this.apiUrl = `http://localhost:${port}/v1/mock-llm`
            console.info('LLMService: using local mock LLM at', this.apiUrl)
        }
    }

    public async rerankCandidates(query: string, candidates: Candidate[], topK: number = 10): Promise<Candidate[]> {
        if (!this.apiUrl) throw new Error('LLM API URL not configured');

        const url = `${this.apiUrl.replace(/\/$/, '')}/rerank`;
        try {
            console.debug('LLM rerank request', { url, query, topK, candidatesCount: candidates.length });
            const response = await axios.post(url, {
                query,
                candidates,
                topK,
            }, {
                headers: {
                    Authorization: `Bearer ${this.apiKey}`,
                },
                timeout: 20000,
            });

            const data = response.data;
            // Try multiple possible shapes
            if (!data) return [];
            if (Array.isArray(data.sortedCandidates)) return data.sortedCandidates;
            if (Array.isArray(data.ranked)) return data.ranked;
            if (Array.isArray(data.rankedCandidates)) return data.rankedCandidates;
            if (Array.isArray(data.results)) return data.results;
            // Some providers return { items: [...] }
            if (Array.isArray(data.items)) return data.items;

            // If provider returned a single object with scores, map to candidates
            if (data.scores && typeof data.scores === 'object') {
                // scores: { resumeId: score }
                const scored = candidates.map(c => ({ ...c, score: data.scores[c.resumeId] ?? null }));
                return scored.sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
            }

            // As a last attempt, return original candidates
            return candidates;
        } catch (err: any) {
            if (err.response) {
                console.error('LLM rerank provider error', { status: err.response.status, data: err.response.data });
            } else {
                console.error('LLM rerank request failed', err.message || err);
            }
            throw err;
        }
    }

    public async summarizeCandidateFit(query: string, candidate: Candidate, options: SummaryOptions = {}): Promise<string> {
        if (!this.apiUrl) throw new Error('LLM API URL not configured');
        const body: any = {
            query,
            candidate,
            style: options.style || 'short',
            maxTokens: options.maxTokens || config.DEFAULT_SUMMARY_MAX_TOKENS,
        };

        try {
            const response = await axios.post(`${this.apiUrl}/summarize`, body, {
                headers: {
                    Authorization: `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                },
                timeout: 15000,
            });

            // Robust parsing of different provider shapes
            const data = response.data;
            if (!data) return '';

            if (typeof data.summary === 'string') return data.summary;
            if (typeof data.output === 'string') return data.output;
            if (Array.isArray(data.outputs) && data.outputs.length > 0) {
                const first = data.outputs[0];
                if (typeof first === 'string') return first;
                if (first && typeof first.text === 'string') return first.text;
                if (first && typeof first.summary === 'string') return first.summary;
            }

            // Some providers return { choices: [{ text }] }
            if (Array.isArray(data.choices) && data.choices.length > 0) {
                const text = data.choices[0].text || data.choices[0].message?.content;
                if (typeof text === 'string') return text;
            }

            return '';
        } catch (err: any) {
            if (err.response) {
                console.error('LLM summarization provider error', { status: err.response.status, data: err.response.data });
            }
            console.error('LLM summarizeCandidateFit failed:', err.message || err);
            throw new Error('LLM summarization failed');
        }
    }

    public async extractMetadata(rawText: string): Promise<{ skills: string[]; jobTitles: string[]; experienceSummary: string }> {
        if (!this.apiUrl) throw new Error('LLM API URL not configured');

        const response = await axios.post(`${this.apiUrl}/extract-metadata`, {
            text: rawText,
        }, {
            headers: {
                Authorization: `Bearer ${this.apiKey}`,
            },
        });

        return response.data.metadata || { skills: [], jobTitles: [], experienceSummary: '' };
    }
}