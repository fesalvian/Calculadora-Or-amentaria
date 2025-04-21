import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();
const router = Router();

// cria orçamento
router.post('/', async (req: AuthRequest, res) => {
  const { client_name, client_phone, items, total_cost } = req.body;
  const budget = await prisma.budget.create({
    data: {
      clientName: client_name,
      clientPhone: client_phone,
      totalCost: total_cost,
      userId: req.userId!,
      items: {
        create: items.map((i: any) => ({ itemId: i.itemId, quantity: i.quantity, subTotal: i.subTotal })),
      },
    },
    include: { items: true },
  });
  res.json(budget);
});
// lista orçamentos
router.get('/', async (req: AuthRequest, res) => {
  const budgets = await prisma.budget.findMany({ where: { userId: req.userId } });
  res.json(budgets);
});
router.get('/:id', async (req: AuthRequest, res) => {
  const budget = await prisma.budget.findUnique({
    where: { id: Number(req.params.id) }, include: { items: true }
  });
  res.json(budget);
});
// editar e deletar podem ser adicionados similarmente

export default router;