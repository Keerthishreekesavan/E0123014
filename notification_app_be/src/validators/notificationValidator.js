// src/validators/notificationValidator.js
// Input validation for notification payloads

const { VALID_TYPES, VALID_STATUSES } = require('../models/notificationModel');

function validateCreateNotification(body) {
  const errors = [];
  if (!body.type || !VALID_TYPES.includes(body.type)) {
    errors.push(`"type" must be one of: ${VALID_TYPES.join(', ')}`);
  }
  if (!body.recipient || typeof body.recipient !== 'string') {
    errors.push('"recipient" is required.');
  }
  if (!body.message || typeof body.message !== 'string' || body.message.trim() === '') {
    errors.push('"message" is required and must be a non-empty string.');
  }
  return { valid: errors.length === 0, errors };
}

function validateUpdateNotification(body) {
  const errors = [];
  if (body.status && !VALID_STATUSES.includes(body.status)) {
    errors.push(`"status" must be one of: ${VALID_STATUSES.join(', ')}`);
  }
  if (body.type && !VALID_TYPES.includes(body.type)) {
    errors.push(`"type" must be one of: ${VALID_TYPES.join(', ')}`);
  }
  const allowed = ['type', 'recipient', 'subject', 'message', 'status'];
  const provided = Object.keys(body).filter((k) => allowed.includes(k));
  if (provided.length === 0) errors.push('At least one field is required to update.');
  return { valid: errors.length === 0, errors };
}

module.exports = { validateCreateNotification, validateUpdateNotification };
