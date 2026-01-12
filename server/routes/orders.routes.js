const express = require('express');
const db = require('../services/db.service');
const { verifyAdmin } = require('../middleware/authAdmin');

const router = express.Router();

// GET all orders (ADMIN or by customerId for customers)
router.get('/', (req, res) => {
  if (req.query.customerId) {
    const orders = db.getOrdersByCustomer(req.query.customerId);
    return res.json({ orders, total: orders.length });
  }
  
  // Admin only for all orders
  const orders = db.getOrders();
  res.json({ orders, total: orders.length });
});

// GET order by ID (PUBLIC)
router.get('/:id', (req, res) => {
  const order = db.getOrderById(req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  res.json(order);
});

// POST create order (PUBLIC - from checkout)
router.post('/', (req, res) => {
  const { customerId, items, total } = req.body;
  
  if (!items || items.length === 0) {
    return res.status(400).json({ error: 'Order must have items' });
  }

  const order = db.createOrder({ customerId, items, total });
  res.status(201).json(order);
});

// PUT update order (ADMIN)
router.put('/:id', verifyAdmin, (req, res) => {
  const order = db.updateOrder(req.params.id, req.body);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  res.json(order);
});

// DELETE order (ADMIN)
router.delete('/:id', verifyAdmin, (req, res) => {
  const success = db.deleteOrder(req.params.id);
  if (!success) return res.status(404).json({ error: 'Order not found' });
  res.json({ message: 'Order deleted' });
});

module.exports = router;
