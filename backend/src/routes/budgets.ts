import { Router, RequestHandler, Response } from 'express';
import { PrismaClient }         from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();
const router = Router();

// todas as rotas abaixo exigem autenticação
router.use(authenticate);

// wrapper para capturar erros de async/await
function wrap(
  fn: (req: AuthRequest, res: Response) => Promise<any>
): RequestHandler {
  return (req, res, next) => {
    fn(req as AuthRequest, res).catch(next);
  };
}

// cria um orçamento
router.post(
  '/',
  wrap(async (req, res) => {
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
      include: {
        // não precisamos aqui incluir o 'item' — o front só usa GET /:id
        items: true
      }
    });

    return res.status(201).json(budget);
  })
);

// lista todos os orçamentos do usuário
router.get(
  '/',
  wrap(async (req, res) => {
    const userId = req.userId!;
    const budgets = await prisma.budget.findMany({
      where: { userId }
    });
    return res.json(budgets);
  })
);

// busca um orçamento específico, incluindo linhas e cada item
router.get(
  '/:id',
  wrap(async (req, res) => {
    const userId = req.userId!;
    const id     = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'ID inválido.' });
    }

    const budget = await prisma.budget.findUnique({
      where: { id },
      include: {
        items: {
          include: { item: true }    // garante que "l.item" não seja undefined
        }
      }
    });

    if (!budget || budget.userId !== userId) {
      return res.status(404).json({ message: 'Orçamento não encontrado.' });
    }

    // monta o JSON exatamente como o front espera
    return res.json({
      client_name:  budget.clientName,
      client_phone: budget.clientPhone,
      items: budget.items.map(l => ({
        id:       l.id,
        item: {
          id:         l.item.id,
          name:       l.item.name,
          unit_value: l.item.unitValue
        },
        quantity: l.quantity,
        subTotal: l.subTotal
      }))
    });
  })
);

// exclui um orçamento inteiro
router.delete(
  '/:id',
  wrap(async (req, res) => {
    const userId = req.userId!;
    const id     = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'ID inválido.' });
    }

    await prisma.budget.deleteMany({
      where: { id, userId }
    });

    return res.sendStatus(204);
  })
);

export default router;
