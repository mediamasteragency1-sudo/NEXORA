import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, '..', '..', 'db', 'data.json');

// Read DB safely
export function readDB() {
  try {
    const data = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading DB:', error);
    return { products: [], categories: [], customers: [], orders: [], invoices: [] };
  }
}

// Write DB safely
export function writeDB(data) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing DB:', error);
    return false;
  }
}

// Get products
export function getProducts(limit = null) {
  const db = readDB();
  const products = db.products || [];
  if (limit) {
    return products.slice(0, parseInt(limit));
  }
  return products;
}

// Get product by ID
export function getProductById(id) {
  const db = readDB();
  const products = db.products || [];
  return products.find(p => p.id === parseInt(id));
}

// Create product
export function createProduct(productData) {
  const db = readDB();
  const products = db.products || [];
  const newId = (Math.max(...products.map(p => p.id), 0)) + 1;
  const newProduct = { id: newId, ...productData };
  products.push(newProduct);
  db.products = products;
  writeDB(db);
  return newProduct;
}

// Update product
export function updateProduct(id, productData) {
  const db = readDB();
  const products = db.products || [];
  const index = products.findIndex(p => p.id === parseInt(id));
  if (index === -1) return null;
  products[index] = { ...products[index], ...productData };
  db.products = products;
  writeDB(db);
  return products[index];
}

// Delete product
export function deleteProduct(id) {
  const db = readDB();
  const products = db.products || [];
  const filtered = products.filter(p => p.id !== parseInt(id));
  if (filtered.length === products.length) return false; // Not found
  db.products = filtered;
  writeDB(db);
  return true;
}

// Get orders
export function getOrders() {
  const db = readDB();
  return db.orders || [];
}

// Get order by ID
export function getOrderById(id) {
  const db = readDB();
  const orders = db.orders || [];
  return orders.find(o => o.id === parseInt(id));
}

// Create order
export function createOrder(orderData) {
  const db = readDB();
  const orders = db.orders || [];
  const newId = (Math.max(...orders.map(o => o.id), 0)) + 1;
  const newOrder = { 
    id: newId, 
    ...orderData,
    created_at: new Date().toISOString(),
    status: 'PENDING'
  };
  orders.push(newOrder);
  db.orders = orders;
  writeDB(db);
  return newOrder;
}

// Update order
export function updateOrder(id, orderData) {
  const db = readDB();
  const orders = db.orders || [];
  const index = orders.findIndex(o => o.id === parseInt(id));
  if (index === -1) return null;
  orders[index] = { ...orders[index], ...orderData };
  db.orders = orders;
  writeDB(db);
  return orders[index];
}

// Get categories
export function getCategories() {
  const db = readDB();
  return db.categories || [];
}

// Get customers
export function getCustomers() {
  const db = readDB();
  return db.customers || [];
}

// Create customer
export function createCustomer(customerData) {
  const db = readDB();
  const customers = db.customers || [];
  const newId = (Math.max(...customers.map(c => c.id), 0)) + 1;
  const newCustomer = { 
    id: newId, 
    ...customerData,
    created_at: new Date().toISOString()
  };
  customers.push(newCustomer);
  db.customers = customers;
  writeDB(db);
  return newCustomer;
}

// Get customer by ID
export function getCustomerById(id) {
  const db = readDB();
  const customers = db.customers || [];
  return customers.find(c => c.id === parseInt(id));
}
