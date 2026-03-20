import { Router, Request, Response } from 'express';
import { SearchService } from '../../services/SearchService';
import { Candidate } from '../../types';

const router = Router();
const searchService = new SearchService();

// BM25 Search Endpoint
router.post('/bm25', async (req: Request, res: Response) => {
    const { query, topK, filters } = req.body;

    if (!query || typeof query !== 'string') {
        return res.status(400).json({ error: 'Field `query` is required and must be a non-empty string' });
    }

    try {
        const results = await searchService.bm25Search(query, filters, topK);
        res.status(200).json(results);
    } catch (error: any) {
        console.error('BM25 search error:', error.message || error);
        res.status(500).json({ error: 'An error occurred while processing the search.' });
    }
});

// GET /v1/search/bm25?query=...&topK=10&filters={...}
router.get('/bm25', async (req: Request, res: Response) => {
    const query = req.query.query as string | undefined;
    const topK = req.query.topK ? Number(req.query.topK) : 10;
    const filtersParam = req.query.filters as string | undefined;

    if (!query) return res.status(400).json({ error: 'Query parameter `query` is required' });

    let filters: any = {};
    if (filtersParam) {
        try { filters = JSON.parse(filtersParam); } catch (e) { return res.status(400).json({ error: 'Invalid `filters` JSON' }); }
    }

    try {
        const results = await searchService.bm25Search(query, filters, topK);
        res.status(200).json(results);
    } catch (error: any) {
        console.error('BM25 GET error:', error.message || error);
        res.status(500).json({ error: 'An error occurred while processing the search.' });
    }
});

// Vector Search Endpoint
router.post('/vector', async (req: Request, res: Response) => {
    const { query, topK, filters } = req.body;

    try {
        const results = await searchService.vectorSearch(query, filters, topK);
        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while processing the vector search.' });
    }
});

// GET /v1/search/vector?query=...&topK=10&filters={...}
router.get('/vector', async (req: Request, res: Response) => {
    const query = req.query.query as string | undefined;
    const topK = req.query.topK ? Number(req.query.topK) : 10;
    const filtersParam = req.query.filters as string | undefined;

    if (!query) return res.status(400).json({ error: 'Query parameter `query` is required' });

    let filters: any = {};
    if (filtersParam) {
        try { filters = JSON.parse(filtersParam); } catch (e) { return res.status(400).json({ error: 'Invalid `filters` JSON' }); }
    }

    try {
        const results = await searchService.vectorSearch(query, filters, topK);
        res.status(200).json(results);
    } catch (error: any) {
        console.error('Vector GET error:', error.message || error);
        res.status(500).json({ error: 'An error occurred while processing the vector search.' });
    }
});

// Hybrid Search Endpoint
router.post('/hybrid', async (req: Request, res: Response) => {
    const { query, filters, options } = req.body;

    if (!query || typeof query !== 'string') {
        return res.status(400).json({ error: 'Field `query` is required and must be a non-empty string' });
    }

    const opts = options || { topK: 10 };

    try {
        const results = await searchService.hybridSearch(query, filters, opts);
        res.status(200).json(results);
    } catch (error: any) {
        console.error('Hybrid search error:', error.message || error);
        res.status(500).json({ error: 'An error occurred while processing the hybrid search.' });
    }
});

// GET /v1/search/hybrid?query=...&topK=10&filters={...}
router.get('/hybrid', async (req: Request, res: Response) => {
    const query = req.query.query as string | undefined;
    const topK = req.query.topK ? Number(req.query.topK) : 10;
    const filtersParam = req.query.filters as string | undefined;

    if (!query) return res.status(400).json({ error: 'Query parameter `query` is required' });

    let filters: any = {};
    if (filtersParam) {
        try { filters = JSON.parse(filtersParam); } catch (e) { return res.status(400).json({ error: 'Invalid `filters` JSON' }); }
    }

    const opts = { topK };

    try {
        const results = await searchService.hybridSearch(query, filters, opts);
        res.status(200).json(results);
    } catch (error: any) {
        console.error('Hybrid GET error:', error.message || error);
        res.status(500).json({ error: 'An error occurred while processing the hybrid search.' });
    }
});

// End-to-End Search Pipeline
router.post('/', async (req: Request, res: Response) => {
    const { query, filters, options } = req.body;

    if (!query || typeof query !== 'string') {
        return res.status(400).json({ error: 'Field `query` is required and must be a non-empty string' });
    }

    try {
        const results = await searchService.endToEndSearch(query, filters, options);
        res.status(200).json(results);
    } catch (error: any) {
        console.error('End-to-end search error:', error.message || error);
        res.status(500).json({ error: 'An error occurred while processing the end-to-end search.' });
    }
});

// Rerank Endpoint (LLM-driven)
router.post('/rerank', async (req: Request, res: Response) => {
    const { query, candidates, topK } = req.body;

    if (!query || typeof query !== 'string' || !Array.isArray(candidates) || candidates.length === 0) {
        return res.status(400).json({ error: 'Fields `query` (string) and `candidates` (non-empty array) are required' });
    }

    try {
        const ranked = await searchService.rerankCandidates(query, candidates as Candidate[], topK);
        return res.status(200).json({ ranked });
    } catch (err: any) {
        console.error('Rerank endpoint failed:', err.message || err);
        return res.status(500).json({ error: 'Failed to rerank candidates' });
    }
});

// GET /v1/search/rerank?query=...&candidates=[JSON]&topK=...
router.get('/rerank', async (req: Request, res: Response) => {
    const query = req.query.query as string | undefined;
    const candidatesParam = req.query.candidates as string | undefined;
    const topK = req.query.topK ? Number(req.query.topK) : 10;

    if (!query || !candidatesParam) return res.status(400).json({ error: 'Query and candidates are required as query params' });

    let candidates: any[] = [];
    try { candidates = JSON.parse(candidatesParam); } catch (e) { return res.status(400).json({ error: 'Invalid `candidates` JSON' }); }

    try {
        const ranked = await searchService.rerankCandidates(query, candidates, topK);
        return res.status(200).json({ ranked });
    } catch (err: any) {
        console.error('Rerank GET failed:', err.message || err);
        return res.status(500).json({ error: 'Failed to rerank candidates' });
    }
});

// Summarize Endpoint (LLM-driven)
router.post('/summarize', async (req: Request, res: Response) => {
    const { query, candidate, style, maxTokens } = req.body;

    if (!query || typeof query !== 'string' || !candidate) {
        return res.status(400).json({ error: 'Fields `query` (string) and `candidate` are required' });
    }

    try {
        const summary = await searchService.summarizeCandidateFit(query, candidate, { style, maxTokens });
        return res.status(200).json({ summary });
    } catch (err: any) {
        console.error('Summarize endpoint failed:', err.message || err);
        return res.status(500).json({ error: 'Failed to summarize candidate' });
    }
});

// GET /v1/search/summarize?query=...&candidate={JSON}&style=short&maxTokens=...
router.get('/summarize', async (req: Request, res: Response) => {
    const query = req.query.query as string | undefined;
    const candidateParam = req.query.candidate as string | undefined;
    const style = req.query.style as string | undefined;
    const maxTokens = req.query.maxTokens ? Number(req.query.maxTokens) : undefined;

    if (!query || !candidateParam) return res.status(400).json({ error: 'Fields `query` and `candidate` are required as query params' });

    let candidate: any;
    try { candidate = JSON.parse(candidateParam); } catch (e) { return res.status(400).json({ error: 'Invalid `candidate` JSON' }); }

    try {
        const summary = await searchService.summarizeCandidateFit(query, candidate, { style: style as any, maxTokens });
        return res.status(200).json({ summary });
    } catch (err: any) {
        console.error('Summarize GET failed:', err.message || err);
        return res.status(500).json({ error: 'Failed to summarize candidate' });
    }
});

export default router;