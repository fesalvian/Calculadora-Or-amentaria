// src/middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  userId?: number;
}

export function authenticate(req: AuthRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({ message: 'Token missing' });
    return;
  }
  const parts = authHeader.split(' ');
  if (parts.length !== 2) {
    res.status(401).json({ message: 'Token error' });
    return;
  }
  const [, token] = parts;

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!);
    req.userId = (payload as any).userId;
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
    return;
  }
}
