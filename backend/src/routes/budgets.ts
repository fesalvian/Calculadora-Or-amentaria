// src/routes/budgets.ts
import { Router, RequestHandler, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();
const router = Router();

router.use(authenticate);

// wrapper para usar AuthRequest sem conflito de tipos
function authHandler(
  fn: (req: AuthRequest, res: Response) => Promise<any>
): RequestHandler {
  return (req, res, next) => {
    Promise.resolve(fn(req as AuthRequest, res)).catch(next);
  };
}

// POST /budgets — cria um orçamento
router.post(
  '/',
  authHandler(async (req, res) => {
    const { client_name, client_phone, items, total_cost } = req.body;
    const userId = req.userId!;

    const budget = await prisma.budget.create({
      data: {
        clientName:  client_name,
        clientPhone: client_phone,
        totalCost:   total_cost,
        userId,
        items: {
          create: items.map((i: any) => ({
            itemId:   i.itemId,
            quantity: i.quantity,
            subTotal: i.subTotal
          }))
        }
      },
      include: { items: true }
    });

    res.status(201).json(budget);
  })
);

// GET /budgets — lista todos os orçamentos do usuário
router.get(
  '/',
  authHandler(async (req, res) => {
    const userId = req.userId!;
    const budgets = await prisma.budget.findMany({
      where: { userId }
    });
    res.json(budgets);
  })
);

// GET /budgets/:id — retorna um orçamento específico
router.get(
  '/:id',
  authHandler(async (req, res) => {
    const userId = req.userId!;
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ message: 'ID inválido.' });
      return;
    }

    const budget = await prisma.budget.findUnique({
      where: { id },
      include: { items: true }
    });

    if (!budget || budget.userId !== userId) {
      res.status(404).json({ message: 'Orçamento não encontrado.' });
      return;
    }

    res.json(budget);
  })
);

// DELETE /budgets/items/:itemId — remove linha de orçamento individualmente
router.delete(
  '/items/:itemId',
  authHandler(async (req, res) => {
    const userId  = req.userId!;
    const itemId  = Number(req.params.itemId);
    if (isNaN(itemId)) {
      res.status(400).json({ message: 'ID de item inválido.' });
      return;
    }

    // garante que essa linha pertence a um orçamento seu
    const linha = await prisma.budgetItem.findUnique({
      where: { id: itemId },
      select: { budget: { select: { userId: true } } }
    });
    if (!linha || linha.budget.userId !== userId) {
      res.status(404).json({ message: 'Linha não encontrada.' });
      return;
    }

    await prisma.budgetItem.delete({ where: { id: itemId } });
    res.sendStatus(204);
  })
);


export default router;
