// src/utils/responseHelper.js
// Standardised API response helpers

function successResponse(res, data, statusCode = 200, message = 'Success') {
  return res.status(statusCode).json({ success: true, message, data });
}

function errorResponse(res, message = 'Error', statusCode = 500) {
  return res.status(statusCode).json({ success: false, message });
}

module.exports = { successResponse, errorResponse };
