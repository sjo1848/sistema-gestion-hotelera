import { NextFunction, Request, Response } from 'express';
import { randomUUID } from 'crypto';

export function requestId(req: Request, res: Response, next: NextFunction) {
  const headerId = (req.headers['x-request-id'] as string | undefined) ?? '';
  const id = headerId.trim() || randomUUID();
  (req as any).requestId = id;
  res.setHeader('x-request-id', id);
  next();
}
