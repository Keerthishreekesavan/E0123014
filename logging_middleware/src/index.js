// src/index.js
// Entry point for the logging middleware demo Express server

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const config = require('./config/env');
const logRoutes = require('./api/logRoutes');
const { requestLogger } = require('./middleware/requestLogger');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();

// ─── Core Middleware ─────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Request Logging Middleware ───────────────────────────────────────────────
app.use(requestLogger('backend', 'middleware'));

// ─── Routes ──────────────────────────────────────────────────────────────────
app.use('/api', logRoutes);

// Root health check
app.get('/', (req, res) => {
  res.json({ message: 'Logging Middleware Service is running', version: '1.0.0' });
});

// ─── Error Handler ────────────────────────────────────────────────────────────
app.use(errorHandler);

// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(config.port, () => {
  console.log(`\n🚀 Logging Middleware Server`);
  console.log(`   Local:   http://localhost:${config.port}`);
  console.log(`   Health:  http://localhost:${config.port}/api/health`);
  console.log(`   Log API: http://localhost:${config.port}/api/log\n`);
});

module.exports = app;
