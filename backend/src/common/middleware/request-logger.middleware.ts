import { NextFunction, Request, Response } from 'express';

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();
  const requestId = (req as any).requestId ?? null;

  res.on('finish', () => {
    const durationMs = Date.now() - start;
    const log = {
      level: 'info',
      msg: 'request',
      method: req.method,
      path: req.originalUrl,
      status: res.statusCode,
      durationMs,
      ip: req.ip,
      userAgent: req.headers['user-agent'] ?? null,
      requestId,
      timestamp: new Date().toISOString(),
    };
    // Structured log
    console.log(JSON.stringify(log));
  });

  next();
}
