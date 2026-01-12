const express = require('express');
const db = require('../services/db.service');
const { verifyAdmin } = require('../middleware/authAdmin');

const router = express.Router();

// GET all customers (ADMIN)
router.get('/', verifyAdmin, (req, res) => {
  const customers = db.getCustomers();
  res.json({ customers, total: customers.length });
});

// GET customer by ID (ADMIN)
router.get('/:id', verifyAdmin, (req, res) => {
  const customer = db.getCustomerById(req.params.id);
  if (!customer) return res.status(404).json({ error: 'Customer not found' });
  res.json(customer);
});

// POST create customer (PUBLIC or ADMIN)
router.post('/', (req, res) => {
  const { fullName, email, phone } = req.body;
  if (!fullName || !email) {
    return res.status(400).json({ error: 'Name and email required' });
  }
  const customer = db.createCustomer({ fullName, email, phone });
  res.status(201).json(customer);
});

// PUT update customer (ADMIN)
router.put('/:id', verifyAdmin, (req, res) => {
  const customer = db.updateCustomer(req.params.id, req.body);
  if (!customer) return res.status(404).json({ error: 'Customer not found' });
  res.json(customer);
});

// DELETE customer (ADMIN)
router.delete('/:id', verifyAdmin, (req, res) => {
  const success = db.deleteCustomer(req.params.id);
  if (!success) return res.status(404).json({ error: 'Customer not found' });
  res.json({ message: 'Customer deleted' });
});

module.exports = router;
