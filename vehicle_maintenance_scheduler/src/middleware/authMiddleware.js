// src/middleware/authMiddleware.js
// Validates Bearer Token on incoming requests

const config = require('../config/env');

function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Unauthorized: Missing Bearer Token.' });
  }
  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ success: false, message: 'Unauthorized: Token is empty.' });
  }
  // Attach token for downstream use
  req.token = token;
  next();
}

module.exports = { authMiddleware };
