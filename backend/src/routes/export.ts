import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';
import excelJS from 'exceljs';
import PDFDocument from 'pdfkit';
import fs from 'fs';

const prisma = new PrismaClient();
const router = Router();

// Exporta Excel
router.get('/budgets/:id/excel', async (req: AuthRequest, res) => {
  const id = Number(req.params.id);
  const budget = await prisma.budget.findUnique({ where: { id }, include: { items: { include: { item: true } } } });
  const workbook = new excelJS.Workbook();
  const sheet = workbook.addWorksheet('Orçamento');
  sheet.addRow(['Item', 'Quantidade', 'Subtotal']);
  budget!.items.forEach(bi => {
    sheet.addRow([bi.item.name, bi.quantity, bi.subTotal]);
  });
  sheet.addRow([]);
  sheet.addRow(['Total', '', budget!.totalCost]);

  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', `attachment; filename=orcamento_${id}.xlsx`);
  await workbook.xlsx.write(res);
  res.end();
});

// Exporta PDF com logo
router.get('/budgets/:id/pdf', async (req: AuthRequest, res) => {
  const id = Number(req.params.id);
  const budget = await prisma.budget.findUnique({ where: { id }, include: { items: { include: { item: true } }, user: true } });
  const doc = new PDFDocument();
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=orcamento_${id}.pdf`);
  doc.pipe(res);

  // logo
  if (budget?.user.logoPath) {
    doc.image(`.${budget.user.logoPath}`, 50, 50, { width: 100 });
  }
  doc.fontSize(18).text('Orçamento', 50, 160);
  doc.moveDown();

  // itens
  budget!.items.forEach(bi => {
    doc.fontSize(12).text(`${bi.item.name} x${bi.quantity} = R$${bi.subTotal.toFixed(2)}`);
  });
  doc.moveDown();
  doc.fontSize(14).text(`Total: R$${budget!.totalCost.toFixed(2)}`);
  doc.end();
});

export default router;