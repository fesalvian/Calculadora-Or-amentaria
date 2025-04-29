// src/routes/auth.ts
import { Router, Request, Response, NextFunction } from 'express';
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
    res.status(401).json({ message: 'Email inválido' });
    return;
  }
  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) {
    res.status(401).json({ message: 'Senha inválida' });
    return;
  }
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '1d' });
  res.json({ token });
});

// GET /auth/users/me
router.get('/users/me', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  const user = await prisma.user.findUnique({ where: { id: req.userId! } });
      res.json({
          email: user?.email,
          logoPath: user?.logoPath ?? null
        })
});

router.post(
  '/users/me/logo',
  authenticate,
  upload.single('logo'),
  async (
    req: AuthRequest & { file?: Express.Multer.File },
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.file) {
        res.status(400).json({ message: 'Nenhum arquivo enviado.' });
        return;
      }
      const filePath = `/uploads/${req.file.filename}`;
      await prisma.user.update({
        where: { id: req.userId! },
        data: { logoPath: filePath },
      });
      // Notar que aqui chamamos res.json e não retornamos ele
      res.status(201).json({ logoPath: filePath });
    } catch (err) {
      next(err);
    }
  }
);

router.put(
  '/users/me/password',
  authenticate,
  async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.userId!
      const { currentPassword, newPassword } = req.body

      if (!currentPassword || !newPassword) {
        res.status(400).json({ message: 'Informe senha atual e nova senha.' })
        return
      }

      const user = await prisma.user.findUnique({ where: { id: userId } })
      if (!user) {
        res.status(404).json({ message: 'Usuário não encontrado.' })
        return
      }

      const valid = await bcrypt.compare(currentPassword, user.passwordHash)
      if (!valid) {
        res.status(401).json({ message: 'Senha atual incorreta.' })
        return
      }

      const newHash = await bcrypt.hash(newPassword, 10)
      await prisma.user.update({
        where: { id: userId },
        data: { passwordHash: newHash }
      })

      res.status(204).end()
      return
    } catch (err) {
      next(err)
    }
  }
)


export default router;
