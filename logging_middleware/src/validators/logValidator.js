// src/validators/logValidator.js
// Validates the log payload against allowed values

const {
  ALLOWED_STACKS,
  ALLOWED_LEVELS,
  ALLOWED_PACKAGES,
} = require('../constants/logConstants');

/**
 * Validates the log payload.
 * @param {Object} payload - { stack, level, package, message }
 * @returns {{ valid: boolean, errors: string[] }}
 */
function validateLogPayload(payload) {
  const errors = [];

  if (!payload.stack) {
    errors.push('Field "stack" is required.');
  } else if (!ALLOWED_STACKS.includes(payload.stack)) {
    errors.push(
      `Invalid stack "${payload.stack}". Allowed: ${ALLOWED_STACKS.join(', ')}`
    );
  }

  if (!payload.level) {
    errors.push('Field "level" is required.');
  } else if (!ALLOWED_LEVELS.includes(payload.level)) {
    errors.push(
      `Invalid level "${payload.level}". Allowed: ${ALLOWED_LEVELS.join(', ')}`
    );
  }

  if (!payload.package) {
    errors.push('Field "package" is required.');
  } else if (!ALLOWED_PACKAGES.includes(payload.package)) {
    errors.push(
      `Invalid package "${payload.package}". Allowed: ${ALLOWED_PACKAGES.join(', ')}`
    );
  }

  if (!payload.message || typeof payload.message !== 'string' || payload.message.trim() === '') {
    errors.push('Field "message" is required and must be a non-empty string.');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

module.exports = { validateLogPayload };
