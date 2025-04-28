// src/routes/export.ts
import { Router } from 'express';
import ExcelJS from 'exceljs';
import PDFDocument from 'pdfkit';

const router = Router();

// POST /export/excel
router.post('/excel', async (req, res) => {
  const { client_name, client_phone, total_cost, items } = req.body;

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Orçamento');

  // Cabeçalho
  sheet.addRow(['Cliente', client_name]);
  if (client_phone) sheet.addRow(['Telefone', client_phone]);
  sheet.addRow([]);
  sheet.addRow(['Item', 'Quantidade', 'Subtotal']);
  // Linhas
  items.forEach((l: any) =>
    sheet.addRow([l.name || l.itemName, l.quantity, l.subTotal])
  );
  sheet.addRow([]);
  sheet.addRow(['Total', '', total_cost]);

  // Gera buffer
  const buffer = await workbook.xlsx.writeBuffer();
  res
    .status(200)
    .header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    .header('Content-Disposition', 'attachment; filename="orcamento.xlsx"')
    .send(buffer);
});

// POST /export/pdf
router.post('/pdf', (req, res) => {
  const { client_name, client_phone, total_cost, items } = req.body;
  const doc = new PDFDocument({ margin: 50 });
  // Headers HTTP
  res
    .status(200)
    .header('Content-Type', 'application/pdf')
    .header('Content-Disposition', 'attachment; filename="orcamento.pdf"');
  doc.pipe(res);

  doc.fontSize(18).text(`Orçamento para ${client_name}`, { underline: true });
  if (client_phone) {
    doc.moveDown().fontSize(12).text(`Telefone: ${client_phone}`);
  }
  doc.moveDown();

  // Tabela simples
  doc.fontSize(12).text('Item                     Qtd    Subtotal');
  doc.moveDown(0.5);
  items.forEach((l: any) => {
    const name = l.name || l.itemName;
    doc.text(
      `${name.padEnd(25)} ${String(l.quantity).padStart(3)}    R$${l.subTotal.toFixed(2)}`
    );
  });

  doc.moveDown();
  doc.fontSize(14).text(`Total: R$${Number(total_cost).toFixed(2)}`, { align: 'right' });

  doc.end();
});

export default router;
