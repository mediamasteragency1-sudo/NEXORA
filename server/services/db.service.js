const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '../db/data.json');

class DatabaseService {
  constructor() {
    this.data = null;
    this.load();
  }

  load() {
    try {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      this.data = JSON.parse(raw);
    } catch (error) {
      console.error('Error loading database:', error.message);
      this.data = {
        products: [],
        categories: [],
        customers: [],
        orders: [],
        invoices: []
      };
    }
  }

  save() {
    try {
      fs.writeFileSync(DATA_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (error) {
      console.error('Error saving database:', error.message);
      throw error;
    }
  }

  // ===== PRODUCTS =====
  getProducts(limit = null) {
    const products = this.data.products || [];
    return limit ? products.slice(0, limit) : products;
  }

  getProductById(id) {
    return this.data.products.find(p => p.id === parseInt(id));
  }

  createProduct(product) {
    const id = Math.max(...this.data.products.map(p => p.id), 0) + 1;
    const newProduct = { id, ...product, createdAt: new Date().toISOString() };
    this.data.products.push(newProduct);
    this.save();
    return newProduct;
  }

  updateProduct(id, updates) {
    const product = this.getProductById(id);
    if (!product) return null;
    Object.assign(product, updates);
    this.save();
    return product;
  }

  deleteProduct(id) {
    const index = this.data.products.findIndex(p => p.id === parseInt(id));
    if (index === -1) return false;
    this.data.products.splice(index, 1);
    this.save();
    return true;
  }

  // ===== CATEGORIES =====
  getCategories() {
    return this.data.categories || [];
  }

  getCategoryById(id) {
    return this.data.categories.find(c => c.id === parseInt(id));
  }

  createCategory(category) {
    const id = Math.max(...this.data.categories.map(c => c.id), 0) + 1;
    const newCategory = { id, ...category, createdAt: new Date().toISOString() };
    this.data.categories.push(newCategory);
    this.save();
    return newCategory;
  }

  updateCategory(id, updates) {
    const category = this.getCategoryById(id);
    if (!category) return null;
    Object.assign(category, updates);
    this.save();
    return category;
  }

  deleteCategory(id) {
    const index = this.data.categories.findIndex(c => c.id === parseInt(id));
    if (index === -1) return false;
    this.data.categories.splice(index, 1);
    this.save();
    return true;
  }

  // ===== CUSTOMERS =====
  getCustomers() {
    return this.data.customers || [];
  }

  getCustomerById(id) {
    return this.data.customers.find(c => c.id === parseInt(id));
  }

  createCustomer(customer) {
    const id = Math.max(...this.data.customers.map(c => c.id), 0) + 1;
    const newCustomer = { id, ...customer, createdAt: new Date().toISOString() };
    this.data.customers.push(newCustomer);
    this.save();
    return newCustomer;
  }

  updateCustomer(id, updates) {
    const customer = this.getCustomerById(id);
    if (!customer) return null;
    Object.assign(customer, updates);
    this.save();
    return customer;
  }

  deleteCustomer(id) {
    const index = this.data.customers.findIndex(c => c.id === parseInt(id));
    if (index === -1) return false;
    this.data.customers.splice(index, 1);
    this.save();
    return true;
  }

  // ===== ORDERS =====
  getOrders() {
    return this.data.orders || [];
  }

  getOrdersByCustomer(customerId) {
    return this.data.orders.filter(o => o.customerId === parseInt(customerId));
  }

  getOrderById(id) {
    return this.data.orders.find(o => o.id === parseInt(id));
  }

  createOrder(order) {
    const id = Math.max(...this.data.orders.map(o => o.id), 0) + 1;
    const newOrder = { id, ...order, status: 'pending', createdAt: new Date().toISOString() };
    this.data.orders.push(newOrder);
    
    // Reduce stock for products in order
    newOrder.items.forEach(item => {
      const product = this.getProductById(item.productId);
      if (product) {
        product.stock = Math.max(0, product.stock - item.quantity);
      }
    });
    
    this.save();
    return newOrder;
  }

  updateOrder(id, updates) {
    const order = this.getOrderById(id);
    if (!order) return null;
    Object.assign(order, updates);
    this.save();
    return order;
  }

  deleteOrder(id) {
    const index = this.data.orders.findIndex(o => o.id === parseInt(id));
    if (index === -1) return false;
    this.data.orders.splice(index, 1);
    this.save();
    return true;
  }

  // ===== INVOICES =====
  getInvoices() {
    return this.data.invoices || [];
  }

  getInvoiceById(id) {
    return this.data.invoices.find(i => i.id === parseInt(id));
  }

  createInvoice(invoice) {
    const id = Math.max(...this.data.invoices.map(i => i.id), 0) + 1;
    const newInvoice = { id, ...invoice, createdAt: new Date().toISOString() };
    this.data.invoices.push(newInvoice);
    this.save();
    return newInvoice;
  }

  updateInvoice(id, updates) {
    const invoice = this.getInvoiceById(id);
    if (!invoice) return null;
    Object.assign(invoice, updates);
    this.save();
    return invoice;
  }

  deleteInvoice(id) {
    const index = this.data.invoices.findIndex(i => i.id === parseInt(id));
    if (index === -1) return false;
    this.data.invoices.splice(index, 1);
    this.save();
    return true;
  }

  // ===== STATS =====
  getStats() {
    const orders = this.data.orders || [];
    const products = this.data.products || [];
    const customers = this.data.customers || [];
    
    return {
      totalRevenue: orders.reduce((sum, o) => sum + (o.total || 0), 0),
      totalOrders: orders.length,
      totalCustomers: customers.length,
      totalProducts: products.length,
      ordersByStatus: {
        completed: orders.filter(o => o.status === 'completed').length,
        pending: orders.filter(o => o.status === 'pending').length,
        cancelled: orders.filter(o => o.status === 'cancelled').length
      },
      topProducts: this.getTopProducts(5),
      dailySales: this.getDailySales(),
      salesByCategory: this.getSalesByCategory()
    };
  }

  getTopProducts(limit = 5) {
    const orders = this.data.orders || [];
    const productMap = {};

    orders.forEach(order => {
      order.items.forEach(item => {
        if (!productMap[item.productId]) {
          productMap[item.productId] = { ...item, total: 0, qty: 0 };
        }
        productMap[item.productId].qty += item.quantity;
        productMap[item.productId].total += item.price * item.quantity;
      });
    });

    return Object.values(productMap)
      .sort((a, b) => b.qty - a.qty)
      .slice(0, limit);
  }

  getDailySales() {
    const orders = this.data.orders || [];
    const daily = {};

    orders.forEach(order => {
      const date = new Date(order.createdAt).toISOString().split('T')[0];
      if (!daily[date]) daily[date] = 0;
      daily[date] += order.total || 0;
    });

    return Object.entries(daily)
      .map(([date, total]) => ({ date, total }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }

  getSalesByCategory() {
    const orders = this.data.orders || [];
    const categories = this.data.categories || [];
    const catMap = {};

    categories.forEach(cat => {
      catMap[cat.id] = { id: cat.id, name: cat.name, total: 0 };
    });

    orders.forEach(order => {
      order.items.forEach(item => {
        const product = this.getProductById(item.productId);
        if (product && catMap[product.categoryId]) {
          catMap[product.categoryId].total += item.price * item.quantity;
        }
      });
    });

    return Object.values(catMap).filter(c => c.total > 0);
  }
}

module.exports = new DatabaseService();
