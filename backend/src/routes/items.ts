// src/routes/items.ts
import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();
const router = Router();

// Aplica autenticação em todas as rotas deste router
router.use(authenticate);

// GET /items – lista itens do usuário
router.get('/', async (req: AuthRequest, res: Response) => {
  const items = await prisma.item.findMany({ where: { userId: req.userId } });
  res.json(items);
});

// POST /items – cria novo item
router.post('/', async (req: AuthRequest, res: Response) => {
  const { name, unit_value } = req.body;
  const item = await prisma.item.create({
    data: { name, unitValue: unit_value, userId: req.userId! }
  });
  res.json(item);
});

// PUT /items/:id – atualiza item existente
router.put('/:id', async (req: AuthRequest, res: Response) => {
  const { name, unit_value } = req.body;
  const item = await prisma.item.update({
    where: { id: Number(req.params.id) },
    data: { name, unitValue: unit_value }
  });
  res.json(item);
});

// DELETE /items/:id – remove item
router.delete('/:id', async (req: AuthRequest, res: Response) => {
  await prisma.item.delete({ where: { id: Number(req.params.id) } });
  res.status(204).end();
});

export default router;
