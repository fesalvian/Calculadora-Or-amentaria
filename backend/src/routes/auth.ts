// src/routes/auth.ts
import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();
const router = Router();
const upload = multer({ dest: 'uploads/' });

// POST /auth/register
router.post('/register', async (req: Request, res: Response): Promise<void> => {
  const { username, email, password } = req.body;
  const hash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { username, email, passwordHash: hash }
  });
  res.json({ id: user.id, username: user.username });
});

// POST /auth/login
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    res.status(401).json({ message: 'Invalid credentials' });
    return;
  }
  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) {
    res.status(401).json({ message: 'Invalid credentials' });
    return;
  }
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '1d' });
  res.json({ token });
});

// GET /auth/users/me
router.get('/users/me', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  const user = await prisma.user.findUnique({ where: { id: req.userId! } });
  res.json({ email: user?.email });
});

// POST /auth/users/me/logo
router.post(
  '/users/me/logo',
  authenticate,
  upload.single('logo'),
  async (req: AuthRequest & { file?: Express.Multer.File }, res: Response): Promise<void> => {
    if (!req.file) {
      res.status(400).json({ message: 'No file uploaded' });
      return;
    }
    const filePath = `/uploads/${req.file.filename}`;
    await prisma.user.update({
      where: { id: req.userId! },
      data: { logoPath: filePath }
    });
    res.json({ logoPath: filePath });
  }
);

export default router;
