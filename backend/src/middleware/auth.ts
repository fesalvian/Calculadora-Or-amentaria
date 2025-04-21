import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  userId?: number;
}

export function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'Token missing' });
  const [, token] = authHeader.split(' ');
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!);
    req.userId = (payload as any).userId;
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid token' });
  }
}