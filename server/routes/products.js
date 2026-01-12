const express = require('express');
const { authAdmin } = require('../middleware/authAdmin');
const db = require('../db/db.service');

const router = express.Router();

// GET all products (public - for client)
router.get('/', (req, res) => {
  const data = db.readDB();
  res.json({ products: data.products });
});

// GET product by id (public)
router.get('/:id', (req, res) => {
  const data = db.readDB();
  const product = data.products.find(p => p.id === parseInt(req.params.id));
  
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  
  res.json(product);
});

// POST create product (admin only)
router.post('/', authAdmin, (req, res) => {
  const { name, description, price, category, image_url, stock } = req.body;
  
  if (!name || !price) {
    return res.status(400).json({ error: 'Name and price required' });
  }
  
  const data = db.readDB();
  const newProduct = {
    id: Math.max(...data.products.map(p => p.id || 0), 0) + 1,
    name,
    description: description || '',
    price: parseFloat(price),
    category: category || 'General',
    image_url: image_url || '/assets/images/placeholder.jpg',
    stock: stock || 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  data.products.push(newProduct);
  
  if (db.writeDB(data)) {
    res.status(201).json(newProduct);
  } else {
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// PUT update product (admin only)
router.put('/:id', authAdmin, (req, res) => {
  const data = db.readDB();
  const productIndex = data.products.findIndex(p => p.id === parseInt(req.params.id));
  
  if (productIndex === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }
  
  const { name, description, price, category, image_url, stock } = req.body;
  
  data.products[productIndex] = {
    ...data.products[productIndex],
    name: name || data.products[productIndex].name,
    description: description !== undefined ? description : data.products[productIndex].description,
    price: price !== undefined ? parseFloat(price) : data.products[productIndex].price,
    category: category || data.products[productIndex].category,
    image_url: image_url || data.products[productIndex].image_url,
    stock: stock !== undefined ? stock : data.products[productIndex].stock,
    updated_at: new Date().toISOString()
  };
  
  if (db.writeDB(data)) {
    res.json(data.products[productIndex]);
  } else {
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// DELETE product (admin only)
router.delete('/:id', authAdmin, (req, res) => {
  const data = db.readDB();
  const productIndex = data.products.findIndex(p => p.id === parseInt(req.params.id));
  
  if (productIndex === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }
  
  const deletedProduct = data.products.splice(productIndex, 1)[0];
  
  if (db.writeDB(data)) {
    res.json({ message: 'Product deleted', product: deletedProduct });
  } else {
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

module.exports = router;
