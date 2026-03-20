import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';

const router = Router();

// GET /v1/health
router.get('/', (req: Request, res: Response) => {
    res.status(200).json({
        status: 'healthy',
        message: 'Application is running',
        timestamp: new Date().toISOString(),
    });
});

// GET /v1/health/db — simple MongoDB connection check
router.get('/db', (req: Request, res: Response) => {
    const state = mongoose.connection.readyState; // 0: disconnected, 1: connected, 2: connecting, 3: disconnecting
    const ok = state === 1;

    res.status(ok ? 200 : 503).json({
        db: ok ? 'connected' : 'unavailable',
        state,
        timestamp: new Date().toISOString(),
    });
});

export default router;