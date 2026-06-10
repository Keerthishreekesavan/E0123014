// src/logger/logger.js
// Exported logger — convenience wrappers around Log()

const { Log } = require('../services/logService');

/**
 * Create a logger instance for a given stack and package.
 * @param {string} stack - 'backend' | 'frontend'
 * @param {string} pkg   - Allowed package name
 * @returns {Object} Logger with debug/info/warn/error/fatal methods
 */
function createLogger(stack, pkg) {
  return {
    debug: (message) => Log(stack, 'debug', pkg, message),
    info:  (message) => Log(stack, 'info',  pkg, message),
    warn:  (message) => Log(stack, 'warn',  pkg, message),
    error: (message) => Log(stack, 'error', pkg, message),
    fatal: (message) => Log(stack, 'fatal', pkg, message),
  };
}

module.exports = { Log, createLogger };
