const express = require('express');
const { generateToken } = require('../middleware/authAdmin');

const router = express.Router();

// Admin Login - Generate Token
router.post('/admin/login', (req, res) => {
  const { username, password } = req.body;

  // Hardcoded admin credentials
  if (username === 'admin' && password === 'admin') {
    const token = generateToken('admin');
    return res.json({ token, message: 'Login successful' });
  }

  res.status(401).json({ error: 'Invalid credentials' });
});

module.exports = router;
