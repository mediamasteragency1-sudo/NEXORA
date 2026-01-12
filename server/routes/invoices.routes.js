const express = require('express');
const db = require('../services/db.service');
const { verifyAdmin } = require('../middleware/authAdmin');

const router = express.Router();

// GET all invoices (ADMIN)
router.get('/', verifyAdmin, (req, res) => {
  const invoices = db.getInvoices();
  res.json({ invoices, total: invoices.length });
});

// GET invoice by ID (ADMIN)
router.get('/:id', verifyAdmin, (req, res) => {
  const invoice = db.getInvoiceById(req.params.id);
  if (!invoice) return res.status(404).json({ error: 'Invoice not found' });
  res.json(invoice);
});

// POST create invoice (ADMIN)
router.post('/', verifyAdmin, (req, res) => {
  const { orderId, customerId, total, items, status } = req.body;
  if (!orderId) return res.status(400).json({ error: 'Order ID required' });
  const invoice = db.createInvoice({ orderId, customerId, total, items, status });
  res.status(201).json(invoice);
});

// PUT update invoice (ADMIN)
router.put('/:id', verifyAdmin, (req, res) => {
  const invoice = db.updateInvoice(req.params.id, req.body);
  if (!invoice) return res.status(404).json({ error: 'Invoice not found' });
  res.json(invoice);
});

// DELETE invoice (ADMIN)
router.delete('/:id', verifyAdmin, (req, res) => {
  const success = db.deleteInvoice(req.params.id);
  if (!success) return res.status(404).json({ error: 'Invoice not found' });
  res.json({ message: 'Invoice deleted' });
});

module.exports = router;
