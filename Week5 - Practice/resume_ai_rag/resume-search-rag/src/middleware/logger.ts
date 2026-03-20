import { Request, Response, NextFunction } from 'express';

const logger = (req: Request, res: Response, next: NextFunction) => {
    const { method, url, headers } = req;
    const requestId = headers['x-request-id'] || 'N/A';
    const startTime = Date.now();

    console.log(`[${new Date().toISOString()}] ${method} ${url} - Request ID: ${requestId}`);

    res.on('finish', () => {
        const duration = Date.now() - startTime;
        console.log(`[${new Date().toISOString()}] ${method} ${url} - Request ID: ${requestId} - Status: ${res.statusCode} - Duration: ${duration}ms`);
    });

    next();
};

export default logger;