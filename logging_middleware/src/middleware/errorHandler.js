// src/middleware/errorHandler.js
// Global error handling middleware

const { Log } = require('../services/logService');

/**
 * Express error handling middleware.
 * Logs the error and returns a standardised JSON response.
 */
async function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  try {
    await Log('backend', 'error', 'middleware', 'Request failed');
  } catch (logErr) {
    console.error('[ErrorHandler] Could not send error log:', logErr.message);
  }

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
}

module.exports = { errorHandler };
