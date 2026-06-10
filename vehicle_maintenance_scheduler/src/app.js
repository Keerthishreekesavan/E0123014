// src/app.js
// Express application setup for vehicle maintenance scheduler

const express = require('express');
const cors = require('cors');
const vehicleRoutes = require('./routes/vehicleRoutes');
const maintenanceRoutes = require('./routes/maintenanceRoutes');
const schedulingRoutes = require('./routes/schedulingRoutes');
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
app.use('/api/vehicles',    vehicleRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/schedule',    schedulingRoutes);

// Root health check
app.get('/', (req, res) => {
  res.json({ message: 'Vehicle Maintenance Scheduler API is running', version: '1.0.0' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'vehicle-maintenance-scheduler' });
});

// ─── Error Handler ────────────────────────────────────────────────────────────
app.use(errorHandler);

module.exports = app;
