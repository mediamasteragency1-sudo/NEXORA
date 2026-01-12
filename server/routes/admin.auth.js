const express = require('express');
const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../middleware/authAdmin');

const router = express.Router();

// Admin login
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  // Simple auth - credentials: admin/admin
  if (username === 'admin' && password === 'admin') {
    const token = jwt.sign(
      { username: 'admin', role: 'admin' },
      SECRET_KEY,
      { expiresIn: '24h' }
    );
    return res.json({ token, admin: { username: 'admin', role: 'admin' } });
  }
  
  res.status(401).json({ error: 'Invalid credentials' });
});

// Admin logout (client-side: remove token from localStorage)
router.post('/logout', (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

module.exports = router;
