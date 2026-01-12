const express = require('express');
const db = require('../services/db.service');

const router = express.Router();

// GET overall stats (PUBLIC)
router.get('/overview', (req, res) => {
  const stats = db.getStats();
  res.json(stats);
});

// GET orders by status (PUBLIC)
router.get('/orders-by-status', (req, res) => {
  const stats = db.getStats();
  res.json(stats.ordersByStatus);
});

// GET top products (PUBLIC)
router.get('/top-products', (req, res) => {
  const topProducts = db.getTopProducts(5);
  res.json(topProducts);
});

// GET daily sales (PUBLIC)
router.get('/daily-sales', (req, res) => {
  const dailySales = db.getDailySales();
  res.json(dailySales);
});

// GET sales by category (PUBLIC)
router.get('/sales-by-category', (req, res) => {
  const salesByCategory = db.getSalesByCategory();
  res.json(salesByCategory);
});

module.exports = router;
