import express from 'express';
import cors from 'cors';
import { json } from 'body-parser';
import healthRoutes from './routes/v1/health';
import embeddingsRoutes from './routes/v1/embeddings';
import searchRoutes from './routes/v1/search';
import rerankRoutes from './routes/v1/rerank';
import summarizeRoutes from './routes/v1/summarize';
import mockLLMRoutes from './routes/v1/mockLLM';
import requestIdMiddleware from './middleware/requestId';
import logger from './middleware/logger';
import errorHandler from './middleware/errorHandler';

const app = express();

// Middleware
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';
app.use(cors({ origin: FRONTEND_ORIGIN, credentials: true }));
app.use(requestIdMiddleware);
app.use(logger);
app.use(json());

// Routes
app.use('/v1/health', healthRoutes);
app.use('/v1/embeddings', embeddingsRoutes);
app.use('/v1/search', searchRoutes);
app.use('/v1/rerank', rerankRoutes);
app.use('/v1/summarize', summarizeRoutes);
// local mock LLM for offline testing
app.use('/v1/mock-llm', mockLLMRoutes);

// Error handling middleware
app.use(errorHandler);

export default app;