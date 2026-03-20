import { ResumeRepository } from '../repositories/ResumeRepository';
import { EmbeddingService } from './EmbeddingService';
import { LLMService } from './LLMService';
import { Candidate, SummaryOptions } from '../types';

export class SearchService {
    private resumeRepository: ResumeRepository;
    private embeddingService: EmbeddingService;
    private llmService: LLMService;

    constructor() {
        this.resumeRepository = new ResumeRepository();
        this.embeddingService = new EmbeddingService();
        this.llmService = new LLMService();
    }
    async bm25Search(query: string, filters: object = {}, topK: number = 10) {
        // Implement BM25 search logic using the ResumeRepository
        return await this.resumeRepository.bm25Search(query, filters, topK);
    }
    async vectorSearch(query: string, filters: object = {}, topK: number = 10) {
        // Generate embedding for the query
        const embedding = await this.embeddingService.generateEmbedding(query);
        // Implement vector search logic using the ResumeRepository
        return await this.resumeRepository.vectorSearch(embedding, filters, topK);
    }
    async hybridSearch(query: string, filters: object = {}, options: { topK?: number } = {}) {
        const topK = options.topK || 10;

        const start = Date.now();

        const bm25Promise = this.bm25Search(query, filters, topK);
        const vectorPromise = this.vectorSearch(query, filters, topK);

        const [bm25Res, vectorRes] = await Promise.allSettled([bm25Promise, vectorPromise]);

        const componentTimings: any = {};
        const duration = Date.now() - start;

        let bm25Results: any[] = [];
        let vectorResults: any[] = [];
        let bm25Fallback = false;
        let vectorFallback = false;

        if (bm25Res.status === 'fulfilled') {
            bm25Results = bm25Res.value;
        } else {
            bm25Fallback = true;
            console.error('bm25Search failed in hybridSearch:', bm25Res.reason);
        }

        if (vectorRes.status === 'fulfilled') {
            vectorResults = vectorRes.value;
        } else {
            vectorFallback = true;
            console.error('vectorSearch failed in hybridSearch:', vectorRes.reason);
        }

        componentTimings.hybridMs = duration;

        return { bm25Results, vectorResults, bm25Fallback, vectorFallback, componentTimings };
    }

    async endToEndSearch(query: string, filters: object = {}, options: { topK?: number; summarize?: boolean; summaryOptions?: SummaryOptions } = {}) {
        const topK = options.topK || 10;
        const rerankTopN = (options as any).rerankTopN || 8;

        const timings: any = {
            embeddingMs: 0,
            bm25Ms: 0,
            vectorMs: 0,
            rerankMs: 0,
            summarizeMs: 0,
        };

        const startAll = Date.now();

        // Generate embedding (for vector search)
        let embedding: number[] | null = null;
        const t0 = Date.now();
        try {
            embedding = await this.embeddingService.generateEmbedding(query);
            timings.embeddingMs = Date.now() - t0;
        } catch (err: any) {
            timings.embeddingMs = Date.now() - t0;
            console.error('Embedding generation failed in endToEndSearch:', err.message || err);
            // proceed without embedding (vector search will be skipped)
            embedding = null;
        }

        // Run BM25 and vector searches in parallel (vector only if embedding available)
        const bm25Start = Date.now();
        const bm25Promise = this.bm25Search(query, filters, topK).catch((e) => { throw e; });

        let vectorPromise: Promise<any[]> = Promise.resolve([]);
        if (embedding) {
            const vectorStart = Date.now();
            vectorPromise = this.vectorSearch(query, filters, topK).catch((e) => { throw e; }).finally(() => {
                timings.vectorMs = Date.now() - vectorStart;
            });
        }

        let bm25Results: any[] = [];
        let vectorResults: any[] = [];
        let bm25Fallback = false;
        let vectorFallback = false;

        const [bm25Res, vectorRes] = await Promise.allSettled([bm25Promise, vectorPromise]);

        timings.bm25Ms = Date.now() - bm25Start;

        if (bm25Res.status === 'fulfilled') {
            bm25Results = bm25Res.value;
        } else {
            bm25Fallback = true;
            console.error('BM25 search failed in endToEndSearch:', bm25Res.reason);
        }

        if (vectorRes.status === 'fulfilled') {
            vectorResults = vectorRes.value;
        } else {
            vectorFallback = true;
            console.error('Vector search failed in endToEndSearch:', vectorRes.reason);
        }

        // Merge and deduplicate candidates preserving BM25 order first
        const combinedResults = this.mergeAndDeduplicate(bm25Results, vectorResults);

        // Decide rerank candidates (top N)
        const rerankCandidates = combinedResults.slice(0, rerankTopN);

        // Re-rank using LLM with fallback to heuristic ordering
        let rankedResults: any[] = [];
        const rerankStart = Date.now();
        try {
            rankedResults = await this.rerankCandidates(query, rerankCandidates, topK);
            timings.rerankMs = Date.now() - rerankStart;
        } catch (err: any) {
            timings.rerankMs = Date.now() - rerankStart;
            console.error('LLM rerank failed in endToEndSearch:', err.message || err);
            // fallback: priority to BM25 results, then vector
            rankedResults = [...bm25Results, ...vectorResults].slice(0, rerankTopN);
        }

        // If rerank returned fewer than desired, append remaining combined results
        if (rankedResults.length < combinedResults.length) {
            const rankedIds = new Set(rankedResults.map((r: any) => r.resumeId));
            for (const c of combinedResults) {
                if (!rankedIds.has(c.resumeId)) rankedResults.push(c);
            }
        }

        // Optionally summarize topK results
        if (options.summarize) {
            const summaryOptions: SummaryOptions = options.summaryOptions || { style: 'short', maxTokens: 150 };
            const sumStart = Date.now();
            for (let i = 0; i < Math.min(topK, rankedResults.length); i++) {
                try {
                    const s = await this.summarizeCandidateFit(query, rankedResults[i], summaryOptions);
                    rankedResults[i].summary = s;
                } catch (err: any) {
                    console.error('Summarization failed for candidate:', rankedResults[i].resumeId, err.message || err);
                    rankedResults[i].summary = '';
                }
            }
            timings.summarizeMs = Date.now() - sumStart;
        }

        const totalMs = Date.now() - startAll;

        return {
            results: rankedResults.slice(0, topK),
            bm25Fallback,
            vectorFallback,
            componentTimings: timings,
            totalMs,
        };
    }

    async rerankCandidates(query: string, candidates: any[], topK: number = 10) {
        try {
            return await this.llmService.rerankCandidates(query, candidates, topK);
        } catch (err: any) {
            console.error('LLM rerankCandidates failed:', err.message || err);
            // Fallback: return candidates as-is with source marker
            return candidates.map(c => ({ ...c, source: c.source || 'fallback' }));
        }
    }

    async summarizeCandidateFit(query: string, candidate: any, options: SummaryOptions = {}) {
        try {
            return await this.llmService.summarizeCandidateFit(query, candidate, options);
        } catch (err: any) {
            console.error('LLM summarizeCandidateFit failed:', err.message || err);
            return '';
        }
    }

    private mergeAndDeduplicate(bm25Results: any[], vectorResults: any[]) {
        // Implement logic to merge and deduplicate results
        const uniqueResults = new Map();
        [...bm25Results, ...vectorResults].forEach(result => {
            uniqueResults.set(result.resumeId, result);
        });
        return Array.from(uniqueResults.values());
    }
}