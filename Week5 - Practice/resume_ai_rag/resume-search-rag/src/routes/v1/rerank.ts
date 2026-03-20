import { Router, Request, Response } from 'express';
import { LLMService } from '../../services/LLMService';

const router = Router();
const llmService = new LLMService();

// POST /v1/rerank
router.post('/', async (req: Request, res: Response) => {
    const { query, candidates, topK } = req.body;

    if (!query || !candidates || candidates.length === 0) {
        return res.status(400).json({ error: 'Query and candidates are required.' });
    }

    try {
        const rankedCandidates = await llmService.rerankCandidates(query, candidates, topK);
        return res.status(200).json({ rankedCandidates });
    } catch (error) {
        console.error('Error during re-ranking:', error);
        return res.status(500).json({ error: 'Internal server error during re-ranking.' });
    }
});

// GET /v1/rerank?query=...&candidates=[JSON]&topK=...
router.get('/', async (req: Request, res: Response) => {
    const query = req.query.query as string | undefined;
    const candidatesParam = req.query.candidates as string | undefined;
    const topK = req.query.topK ? Number(req.query.topK) : 10;

    if (!query || !candidatesParam) return res.status(400).json({ error: 'Query and candidates are required as query params' });

    let candidates: any[] = [];
    try { candidates = JSON.parse(candidatesParam); } catch (e) { return res.status(400).json({ error: 'Invalid `candidates` JSON' }); }

    try {
        const rankedCandidates = await llmService.rerankCandidates(query, candidates, topK);
        return res.status(200).json({ rankedCandidates });
    } catch (error) {
        console.error('Error during re-ranking (GET):', error);
        return res.status(500).json({ error: 'Internal server error during re-ranking.' });
    }
});

export default router;