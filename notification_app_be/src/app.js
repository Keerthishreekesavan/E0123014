// src/app.js
// Express application setup for notification backend

const express = require('express');
const cors = require('cors');
const notificationRoutes = require('./routes/notificationRoutes');
const priorityInboxRoutes = require('./routes/priorityInboxRoutes');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();

// ─── Core Middleware ──────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Request Logging ──────────────────────────────────────────────────────────
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// ─── Routes ──────────────────────────────────────────────────────────────────
app.use('/api/notifications', notificationRoutes);
app.use('/api/priority', priorityInboxRoutes);

// Root health check
app.get('/', (req, res) => {
  res.json({ message: 'Notification Backend Service is running', version: '1.0.0' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'notification-app-be' });
});

// ─── Error Handler ────────────────────────────────────────────────────────────
app.use(errorHandler);

module.exports = app;
