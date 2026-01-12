const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Serve static files from the client folder
const clientPath = path.join(__dirname, '../client');
const adminPath = path.join(__dirname, '../admin');

app.use(express.static(clientPath));
app.use('/admin', express.static(adminPath));

// Specific routes for HTML files
app.get('/catalog', (req, res) => {
  res.sendFile(path.join(clientPath, 'catalog.html'));
});

app.get('/product', (req, res) => {
  res.sendFile(path.join(clientPath, 'product.html'));
});

app.get('/cart', (req, res) => {
  res.sendFile(path.join(clientPath, 'cart.html'));
});

app.get('/checkout', (req, res) => {
  res.sendFile(path.join(clientPath, 'checkout.html'));
});

app.get('/orders', (req, res) => {
  res.sendFile(path.join(clientPath, 'orders.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(clientPath, 'login.html'));
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(clientPath, 'register.html'));
});

app.get('/about', (req, res) => {
  res.sendFile(path.join(clientPath, 'about.html'));
});

app.get('/confirmation', (req, res) => {
  res.sendFile(path.join(clientPath, 'confirmation.html'));
});

app.get('/payment', (req, res) => {
  res.sendFile(path.join(clientPath, 'payment.html'));
});

// Admin routes
app.get('/admin', (req, res) => {
  res.sendFile(path.join(adminPath, 'index.html'));
});

app.get('/admin/dashboard', (req, res) => {
  res.sendFile(path.join(adminPath, 'dashboard.html'));
});

app.get('/admin/products', (req, res) => {
  res.sendFile(path.join(adminPath, 'products.html'));
});

app.get('/admin/orders', (req, res) => {
  res.sendFile(path.join(adminPath, 'orders.html'));
});

app.get('/admin/categories', (req, res) => {
  res.sendFile(path.join(adminPath, 'categories.html'));
});

app.get('/admin/customers', (req, res) => {
  res.sendFile(path.join(adminPath, 'customers.html'));
});

app.get('/admin/invoices', (req, res) => {
  res.sendFile(path.join(adminPath, 'invoices.html'));
});

// Handle SPA routing - fallback to index.html for unknown routes
app.get('*', (req, res) => {
  // If the requested file doesn't exist, serve index.html
  res.sendFile(path.join(clientPath, 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`[INFO] Frontend server listening on http://localhost:${PORT}`);
  console.log(`[INFO] Serving static files from: ${clientPath}`);
  console.log(`[INFO] Access the application at http://localhost:${PORT}`);
});
