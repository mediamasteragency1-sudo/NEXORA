const express = require('express');
const db = require('../services/db.service');
const { verifyAdmin } = require('../middleware/authAdmin');

const router = express.Router();

// GET all products (PUBLIC)
router.get('/', (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit) : null;
  const products = db.getProducts(limit);
  res.json({ products, total: db.getProducts().length });
});

// GET product by ID (PUBLIC)
router.get('/:id', (req, res) => {
  const product = db.getProductById(req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
});

// POST create product (ADMIN)
router.post('/', verifyAdmin, (req, res) => {
  const { name, price, stock, categoryId, image, active } = req.body;
  if (!name || price === undefined) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const product = db.createProduct({ name, price, stock, categoryId, image, active });
  res.status(201).json(product);
});

// PUT update product (ADMIN)
router.put('/:id', verifyAdmin, (req, res) => {
  const product = db.updateProduct(req.params.id, req.body);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
});

// DELETE product (ADMIN)
router.delete('/:id', verifyAdmin, (req, res) => {
  const success = db.deleteProduct(req.params.id);
  if (!success) return res.status(404).json({ error: 'Product not found' });
  res.json({ message: 'Product deleted' });
});

module.exports = router;
