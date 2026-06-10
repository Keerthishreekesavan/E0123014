// src/middleware/requestLogger.js
// Express middleware: logs every incoming request automatically

const { Log } = require('../services/logService');

/**
 * Express middleware that logs every request to the evaluation service.
 */
function requestLogger(stack = 'backend', pkg = 'middleware') {
  return async (req, res, next) => {
    const start = Date.now();

    res.on('finish', async () => {
      const duration = Date.now() - start;
      const level = res.statusCode >= 500
        ? 'error'
        : res.statusCode >= 400
        ? 'warn'
        : 'info';

      const message = `${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`;

      try {
        await Log(stack, level, pkg, message);
      } catch (err) {
        console.error('[RequestLogger] Failed to send log:', err.message);
      }
    });

    next();
  };
}

module.exports = { requestLogger };
