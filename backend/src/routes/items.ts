import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();
const router = Router();

router.get('/', async (req: AuthRequest, res) => {
  const items = await prisma.item.findMany({ where: { userId: req.userId } });
  res.json(items);
});
router.post('/', async (req: AuthRequest, res) => {
  const { name, unit_value } = req.body;
  const item = await prisma.item.create({ data: { name, unitValue: unit_value, userId: req.userId! } });
  res.json(item);
});
router.put('/:id', async (req: AuthRequest, res) => {
  const { name, unit_value } = req.body;
  const item = await prisma.item.update({ where: { id: Number(req.params.id) }, data: { name, unitValue: unit_value } });
  res.json(item);
});
router.delete('/:id', async (req: AuthRequest, res) => {
  await prisma.item.delete({ where: { id: Number(req.params.id) } });
  res.status(204).end();
});

export default router;