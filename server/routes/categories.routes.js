const express = require('express');
const db = require('../services/db.service');
const { verifyAdmin } = require('../middleware/authAdmin');

const router = express.Router();

// GET all categories (PUBLIC)
router.get('/', (req, res) => {
  const categories = db.getCategories();
  res.json({ categories, total: categories.length });
});

// GET category by ID (PUBLIC)
router.get('/:id', (req, res) => {
  const category = db.getCategoryById(req.params.id);
  if (!category) return res.status(404).json({ error: 'Category not found' });
  res.json(category);
});

// POST create category (ADMIN)
router.post('/', verifyAdmin, (req, res) => {
  const { name, description } = req.body;
  if (!name) return res.status(400).json({ error: 'Name required' });
  const category = db.createCategory({ name, description });
  res.status(201).json(category);
});

// PUT update category (ADMIN)
router.put('/:id', verifyAdmin, (req, res) => {
  const category = db.updateCategory(req.params.id, req.body);
  if (!category) return res.status(404).json({ error: 'Category not found' });
  res.json(category);
});

// DELETE category (ADMIN)
router.delete('/:id', verifyAdmin, (req, res) => {
  const success = db.deleteCategory(req.params.id);
  if (!success) return res.status(404).json({ error: 'Category not found' });
  res.json({ message: 'Category deleted' });
});

module.exports = router;
