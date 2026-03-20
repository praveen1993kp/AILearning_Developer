import { Router, Request, Response } from 'express';
import { LLMService } from '../../services/LLMService';

const router = Router();
const llmService = new LLMService();

// POST /v1/summarize
router.post('/', async (req: Request, res: Response) => {
    const { query, candidate, style, maxTokens } = req.body;

    try {
        const summary = await llmService.summarizeCandidateFit(query, candidate, { style, maxTokens });
        res.status(200).json({ summary });
    } catch (error) {
        console.error('Error summarizing candidate:', error);
        res.status(500).json({ error: 'Failed to generate summary' });
    }
});

export default router;