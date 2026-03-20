import { Router, Request, Response } from 'express';
import { EmbeddingService } from '../../services/EmbeddingService';

const router = Router();
const embeddingService = new EmbeddingService();

// POST /v1/embeddings
router.post('/', async (req: Request, res: Response) => {
    const { model, input } = req.body;

    if (!input || (typeof input !== 'string' && !Array.isArray(input))) {
        return res.status(400).json({ error: 'Input is required and must be a string or array of strings' });
    }

    const modelToUse = model || embeddingService.getModelName();

    try {
        const embedding = await embeddingService.generateEmbedding(input, modelToUse);
        return res.status(200).json({ embedding, model: modelToUse });
    } catch (error: any) {
        console.error('Error generating embedding:', error.message || error);
        const message = error.message || 'Failed to generate embedding';
        return res.status(500).json({ error: message });
    }
});

// GET /v1/embeddings?input=...&model=...
router.get('/', async (req: Request, res: Response) => {
    const input = req.query.input as string | undefined;
    const model = req.query.model as string | undefined;

    if (!input) {
        return res.status(400).json({ error: 'Query parameter `input` is required' });
    }

    try {
        const embedding = await embeddingService.generateEmbedding(input, model);
        return res.status(200).json({ embedding, model: model || embeddingService.getModelName() });
    } catch (error: any) {
        console.error('Error generating embedding (GET):', error.message || error);
        return res.status(500).json({ error: error.message || 'Failed to generate embedding' });
    }
});

export default router;