import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = Router();

router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  const hash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({ data: { username, email, passwordHash: hash } });
  res.json({ id: user.id, username: user.username });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) return res.status(401).json({ message: 'Invalid credentials' });
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '1d' });
  res.json({ token });
});

router.get('/users/me', async (req, res) => {
  const auth = req as any;
  const user = await prisma.user.findUnique({ where: { id: auth.userId } });
  res.json({ email: user?.email });
});

router.post('/users/me/logo', require('../../middleware/auth').authenticate, multer({ dest: 'uploads/' }).single('logo'), async (req, res) => {
  const auth = req as any;
  const filePath = `/uploads/${req.file.filename}`;
  await prisma.user.update({ where: { id: auth.userId }, data: { logoPath: filePath } });
  res.json({ logoPath: filePath });
});

export default router;