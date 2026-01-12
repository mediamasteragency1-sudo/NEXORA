const express = require('express');
const { authAdmin } = require('../middleware/authAdmin');
const db = require('../db/db.service');

const router = express.Router();

// GET overview stats (admin only)
router.get('/overview', authAdmin, (req, res) => {
  const data = db.readDB();
  
  const totalRevenue = data.orders.reduce((sum, order) => {
    if (order.status === 'completed') {
      return sum + (order.total || 0);
    }
    return sum;
  }, 0);
  
  const totalOrders = data.orders.length;
  const totalCustomers = new Set(data.orders.map(o => o.customer_email)).size;
  const totalProducts = data.products.length;
  
  // Top products by sales
  const productSales = {};
  data.orders.forEach(order => {
    if (order.items && Array.isArray(order.items)) {
      order.items.forEach(item => {
        productSales[item.id] = (productSales[item.id] || 0) + item.quantity;
      });
    }
  });
  
  const topProducts = Object.entries(productSales)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([id, quantity]) => {
      const product = data.products.find(p => p.id === parseInt(id));
      return {
        id: parseInt(id),
        name: product?.name || 'Unknown',
        quantity
      };
    });
  
  // Orders by status
  const ordersByStatus = {
    completed: data.orders.filter(o => o.status === 'completed').length,
    pending: data.orders.filter(o => o.status === 'pending').length,
    cancelled: data.orders.filter(o => o.status === 'cancelled').length
  };
  
  res.json({
    totalRevenue,
    totalOrders,
    totalCustomers,
    totalProducts,
    topProducts,
    ordersByStatus
  });
});

// GET sales stats for date range (admin only)
router.get('/sales', authAdmin, (req, res) => {
  const { from, to } = req.query;
  
  const data = db.readDB();
  
  // Calculate daily sales
  const dailySales = {};
  data.orders.forEach(order => {
    if (order.status === 'completed' && order.created_at) {
      const date = new Date(order.created_at).toISOString().split('T')[0];
      dailySales[date] = (dailySales[date] || 0) + (order.total || 0);
    }
  });
  
  // Sales by category
  const salesByCategory = {};
  data.orders.forEach(order => {
    if (order.items && Array.isArray(order.items)) {
      order.items.forEach(item => {
        const product = data.products.find(p => p.id === item.id);
        const category = product?.category || 'Other';
        salesByCategory[category] = (salesByCategory[category] || 0) + (item.price * item.quantity);
      });
    }
  });
  
  res.json({
    dailySales: Object.entries(dailySales).map(([date, amount]) => ({ date, amount })),
    salesByCategory: Object.entries(salesByCategory).map(([category, amount]) => ({ category, amount }))
  });
});

module.exports = router;
