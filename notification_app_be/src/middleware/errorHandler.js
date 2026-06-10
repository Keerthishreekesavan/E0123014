// src/middleware/errorHandler.js
// Global error handler middleware for notification app

function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  console.error(`[Error] ${req.method} ${req.originalUrl} — ${message}`);
  res.status(statusCode).json({ success: false, statusCode, message });
}

module.exports = { errorHandler };
