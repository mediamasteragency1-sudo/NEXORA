import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, '..', '..', 'db', 'data.json');
const SECRET = 'nexora-secret-2026';
const PORT = 4000;

const app = express();
app.use(cors());
app.use(express.json());

// Utilitaires DB
function readDB() {
  try {
    return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
  } catch {
    return { products: [], orders: [], categories: [], customers: [] };
  }
}

function writeDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

// Middleware auth
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(403).json({ error: 'Invalid token' });
  }
};

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'NEXORA API', version: '1.0.0' });
});

// Auth - Customer Login
app.post('/api/auth/login', (req, res) => {
  const db = readDB();
  const { email, password, username } = req.body;
  
  // Support both email (customers) and username (for backwards compatibility)
  if (email && password) {
    // Customer login by email
    console.log(`Login attempt with email: ${email}`);
    console.log(`Customers in database:`, db.customers.map(c => c.email));
    
    const customer = db.customers.find(c => c.email && c.email.toLowerCase() === email.toLowerCase());
    if (customer) {
      console.log(`Customer found:`, customer);
      // For now, accept any password. In production, use bcrypt to hash/verify passwords
      const token = jwt.sign({ id: customer.id, email: customer.email, name: customer.name, role: 'customer' }, SECRET, { expiresIn: '7d' });
      return res.json({ token, user: { id: customer.id, name: customer.name, email: customer.email, role: 'customer' } });
    }
    console.log(`Customer not found for email: ${email}`);
    return res.status(401).json({ error: 'Invalid email or password' });
  }
  
  // Legacy username login (removed - customers should use email)
  res.status(401).json({ error: 'Invalid credentials' });
});

// Admin auth
app.post('/api/auth/admin-login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'admin') {
    const token = jwt.sign({ id: 'admin', username: 'admin', role: 'admin' }, SECRET, { expiresIn: '24h' });
    return res.json({ token, user: { id: 'admin', username: 'admin', role: 'admin' } });
  }
  res.status(401).json({ error: 'Invalid credentials' });
});

// Products - GET (public)
app.get('/api/products', (req, res) => {
  const db = readDB();
  const limit = req.query.limit ? parseInt(req.query.limit) : null;
  const products = limit ? db.products.slice(0, limit) : db.products;
  res.json({ total: products.length, products });
});

// Products - GET by ID (public)
app.get('/api/products/:id', (req, res) => {
  const db = readDB();
  const product = db.products.find(p => p.id === parseInt(req.params.id));
  if (!product) return res.status(404).json({ error: 'Not found' });
  res.json(product);
});

// Products - POST (admin)
app.post('/api/products', verifyToken, (req, res) => {
  const db = readDB();
  const newProduct = {
    id: Math.max(...db.products.map(p => p.id), 0) + 1,
    ...req.body
  };
  db.products.push(newProduct);
  writeDB(db);
  res.status(201).json(newProduct);
});

// Products - PUT (admin)
app.put('/api/products/:id', verifyToken, (req, res) => {
  const db = readDB();
  const idx = db.products.findIndex(p => p.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  db.products[idx] = { ...db.products[idx], ...req.body };
  writeDB(db);
  res.json(db.products[idx]);
});

// Products - DELETE (admin)
app.delete('/api/products/:id', verifyToken, (req, res) => {
  const db = readDB();
  db.products = db.products.filter(p => p.id !== parseInt(req.params.id));
  writeDB(db);
  res.json({ message: 'Deleted' });
});

// Categories - GET (public)
app.get('/api/categories', (req, res) => {
  const db = readDB();
  res.json({ total: db.categories.length, categories: db.categories });
});

// Categories - POST (admin)
app.post('/api/categories', verifyToken, (req, res) => {
  const db = readDB();
  const newCategory = {
    id: Math.max(...db.categories.map(c => c.id || 0), 0) + 1,
    ...req.body
  };
  db.categories.push(newCategory);
  writeDB(db);
  res.status(201).json(newCategory);
});

// Categories - PUT (admin)
app.put('/api/categories/:id', verifyToken, (req, res) => {
  const db = readDB();
  const idx = db.categories.findIndex(c => c.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  db.categories[idx] = { ...db.categories[idx], ...req.body };
  writeDB(db);
  res.json(db.categories[idx]);
});

// Categories - DELETE (admin)
app.delete('/api/categories/:id', verifyToken, (req, res) => {
  const db = readDB();
  db.categories = db.categories.filter(c => c.id !== parseInt(req.params.id));
  writeDB(db);
  res.json({ message: 'Deleted' });
});

// Customers - GET (admin)
app.get('/api/customers', verifyToken, (req, res) => {
  const db = readDB();
  
  // Enrich customers with order statistics
  const customersWithStats = db.customers.map(customer => {
    const customerOrders = db.orders.filter(o => o.customerId === customer.id || o.customerEmail === customer.email);
    const orderCount = customerOrders.length;
    const totalSpent = customerOrders.reduce((sum, order) => sum + (order.total || 0), 0);
    
    return {
      ...customer,
      orderCount,
      totalSpent,
      joinDate: customer.created_at || customer.joinDate
    };
  });
  
  res.json({ total: customersWithStats.length, customers: customersWithStats });
});

// Customers - POST (public - self register)
app.post('/api/customers', (req, res) => {
  const db = readDB();
  const { name, email, phone } = req.body;
  
  console.log('Creating new customer:', { name, email });
  
  // Check if email already exists
  if (db.customers.find(c => c.email && c.email.toLowerCase() === email.toLowerCase())) {
    return res.status(400).json({ error: 'Email already registered' });
  }
  
  const newCustomer = {
    id: Math.max(...db.customers.map(c => c.id || 0), 0) + 1,
    name: name,
    email: email,
    phone: phone || '',
    created_at: new Date().toISOString()
  };
  
  db.customers.push(newCustomer);
  writeDB(db);
  
  console.log('Customer created successfully:', newCustomer);
  res.status(201).json(newCustomer);
});

// Customers - PUT (admin)
app.put('/api/customers/:id', verifyToken, (req, res) => {
  const db = readDB();
  const idx = db.customers.findIndex(c => c.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  db.customers[idx] = { ...db.customers[idx], ...req.body };
  writeDB(db);
  res.json(db.customers[idx]);
});

// Customers - DELETE (admin)
app.delete('/api/customers/:id', verifyToken, (req, res) => {
  const db = readDB();
  db.customers = db.customers.filter(c => c.id !== parseInt(req.params.id));
  writeDB(db);
  res.json({ message: 'Deleted' });
});

// Orders - GET (admin)
app.get('/api/orders', verifyToken, (req, res) => {
  const db = readDB();
  res.json({ total: db.orders.length, orders: db.orders });
});

// Orders - POST (public)
app.post('/api/orders', (req, res) => {
  const db = readDB();
  const newOrder = {
    id: Math.max(...db.orders.map(o => o.id || 0), 0) + 1,
    ...req.body,
    created_at: new Date().toISOString(),
    status: 'PENDING'
  };
  db.orders.push(newOrder);
  writeDB(db);
  res.status(201).json(newOrder);
});

// Orders - PUT (admin)
app.put('/api/orders/:id', verifyToken, (req, res) => {
  const db = readDB();
  const idx = db.orders.findIndex(o => o.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  db.orders[idx] = { ...db.orders[idx], ...req.body };
  writeDB(db);
  res.json(db.orders[idx]);
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

