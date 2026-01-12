const jwt = require('jsonwebtoken');

const SECRET_KEY = 'nexora-admin-secret-key-2024';

// Middleware to verify JWT token
function verifyAdmin(req, res, next) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ error: 'Missing authorization header' });
  }

  const token = authHeader.replace('Bearer ', '');
  
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.admin = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
}

// Generate JWT token
function generateToken(adminId = 'admin') {
  return jwt.sign({ adminId }, SECRET_KEY, { expiresIn: '24h' });
}

module.exports = { verifyAdmin, generateToken, SECRET_KEY };

