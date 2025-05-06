// src/routes/items.ts
import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();
const router = Router();

router.use(authenticate);

// GET /items – lista itens do usuário
router.get('/', async (req: AuthRequest, res) => {
  const items = await prisma.item.findMany({ where: { userId: req.userId } });
  res.json(items);
});

// POST /items – cria novo item
router.post('/', async (req: AuthRequest, res) => {
  const { name, unit_value } = req.body;
  const item = await prisma.item.create({
    data: { name, unitValue: unit_value, userId: req.userId! }
  });
  res.json(item);
});

// PUT /items/:id – atualiza item existente
router.put('/:id', async (req: AuthRequest, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ message: 'ID inválido.' });
    return;
  }
  const { name, unit_value } = req.body;
  const updated = await prisma.item.update({
    where: { id },
    data: { name, unitValue: unit_value }
  });
  res.json(updated);
});

// DELETE /items/:id – só apaga se não estiver em nenhum orçamento
router.delete('/:id', async (req: AuthRequest, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ message: 'ID inválido.' });
    return;
  }

  // 1) verifica se há alguma linha de orçamento referenciando este item
  const used = await prisma.budgetItem.count({
    where: { itemId: id }
  });
  if (used > 0) {
    res.status(400).json({
      message:
        'Não é possível excluir: este item está presente em orçamentos. ' +
        'Remova primeiro as linhas de orçamento que o referenciam.'
    });
    return;
  }

  // 2) não está sendo usado, pode apagar
  await prisma.item.delete({ where: { id } });
  // responde 204 sem retornar um objeto
  res.sendStatus(204);
});

export default router;
