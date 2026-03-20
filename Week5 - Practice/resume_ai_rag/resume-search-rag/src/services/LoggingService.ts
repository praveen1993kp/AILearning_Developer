import { Request, Response } from 'express';

class LoggingService {
    logRequest(request: Request): void {
        const logEntry = {
            requestId: request.headers['x-request-id'] || this.generateRequestId(),
            endpoint: request.originalUrl,
            method: request.method,
            timestamp: new Date().toISOString(),
        };
        console.log(JSON.stringify(logEntry));
    }

    logResponse(response: Response, durationMs: number): void {
        const logEntry = {
            requestId: response.locals.requestId,
            endpoint: response.req.originalUrl,
            method: response.req.method,
            statusCode: response.statusCode,
            durationMs: durationMs,
            timestamp: new Date().toISOString(),
        };
        console.log(JSON.stringify(logEntry));
    }

    private generateRequestId(): string {
        return 'req-' + Math.random().toString(36).substr(2, 9);
    }
}

export default new LoggingService();