const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 4000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/products', require('./routes/products.routes'));
app.use('/api/categories', require('./routes/categories.routes'));
app.use('/api/customers', require('./routes/customers.routes'));
app.use('/api/orders', require('./routes/orders.routes'));
app.use('/api/invoices', require('./routes/invoices.routes'));
app.use('/api/stats', require('./routes/stats.routes'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'NEXORA API is running' });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'NEXORA E-Commerce API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth/admin/login',
      products: '/api/products',
      categories: '/api/categories',
      customers: '/api/customers',
      orders: '/api/orders',
      invoices: '/api/invoices',
      stats: '/api/stats/overview'
    }
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║   NEXORA API Server Running            ║
║   🚀 http://localhost:${PORT}             ║
║   📦 Products API ready                ║
║   👥 Admin API ready                   ║
║   📊 Stats API ready                   ║
╚════════════════════════════════════════╝
  `);
});

module.exports = app;
