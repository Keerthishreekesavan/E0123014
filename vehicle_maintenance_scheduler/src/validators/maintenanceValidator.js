// src/validators/maintenanceValidator.js
// Input validation for maintenance payloads

const VALID_STATUSES = ['SCHEDULED', 'COMPLETED', 'CANCELLED'];
const VALID_TYPES = ['oil_change', 'tire_rotation', 'brake_service', 'engine_check', 'battery_check', 'general_service'];

function validateCreateMaintenance(body) {
  const errors = [];
  if (!body.vehicleId) errors.push('"vehicleId" is required.');
  if (!body.type || !VALID_TYPES.includes(body.type)) {
    errors.push(`"type" must be one of: ${VALID_TYPES.join(', ')}`);
  }
  if (!body.scheduledDate) errors.push('"scheduledDate" is required.');
  return { valid: errors.length === 0, errors };
}

function validateUpdateMaintenance(body) {
  const errors = [];
  if (body.status && !VALID_STATUSES.includes(body.status)) {
    errors.push(`"status" must be one of: ${VALID_STATUSES.join(', ')}`);
  }
  if (body.type && !VALID_TYPES.includes(body.type)) {
    errors.push(`"type" must be one of: ${VALID_TYPES.join(', ')}`);
  }
  const allowed = ['vehicleId', 'type', 'scheduledDate', 'notes', 'status'];
  const provided = Object.keys(body).filter((k) => allowed.includes(k));
  if (provided.length === 0) {
    errors.push('At least one field is required to update.');
  }
  return { valid: errors.length === 0, errors };
}

module.exports = { validateCreateMaintenance, validateUpdateMaintenance, VALID_STATUSES, VALID_TYPES };
