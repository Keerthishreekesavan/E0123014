// src/validators/vehicleValidator.js
// Input validation for vehicle payloads

function validateCreateVehicle(body) {
  const errors = [];
  if (!body.make || typeof body.make !== 'string') errors.push('"make" is required.');
  if (!body.model || typeof body.model !== 'string') errors.push('"model" is required.');
  if (!body.year || isNaN(Number(body.year))) errors.push('"year" must be a number.');
  if (!body.licensePlate || typeof body.licensePlate !== 'string') errors.push('"licensePlate" is required.');
  return { valid: errors.length === 0, errors };
}

function validateUpdateVehicle(body) {
  // At least one field must be provided
  const allowed = ['make', 'model', 'year', 'licensePlate', 'ownerId'];
  const provided = Object.keys(body).filter((k) => allowed.includes(k));
  if (provided.length === 0) {
    return { valid: false, errors: ['At least one field is required to update.'] };
  }
  return { valid: true, errors: [] };
}

module.exports = { validateCreateVehicle, validateUpdateVehicle };
