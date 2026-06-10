// src/api/logRoutes.js
// Routes for the logging middleware demo server

const express = require('express');
const router = express.Router();
const { createLog } = require('./logController');
const { register, authenticate } = require('../auth/tokenManager');

// POST /log  — create a log entry
router.post('/log', createLog);

// POST /register — register client
router.post('/register', async (req, res, next) => {
  try {
    const data = await register();
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
});

// POST /auth — get Bearer token
router.post('/auth', async (req, res, next) => {
  try {
    const token = await authenticate();
    res.status(200).json({ success: true, access_token: token });
  } catch (err) {
    next(err);
  }
});

// GET /health — health check
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'logging-middleware' });
});

module.exports = router;
