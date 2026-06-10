// src/services/logService.js
// Core service: posts a validated log entry to the evaluation service

const httpClient = require('../utils/httpClient');
const { getToken, clearToken } = require('../auth/tokenManager');
const { validateLogPayload } = require('../validators/logValidator');

/**
 * Log(stack, level, package, message)
 *
 * Validates input → Attaches Bearer Token → POST /evaluation-service/logs
 * → Returns response → Handles errors
 *
 * @param {string} stack   - 'backend' | 'frontend'
 * @param {string} level   - 'debug' | 'info' | 'warn' | 'error' | 'fatal'
 * @param {string} pkg     - Allowed package name
 * @param {string} message - Log message
 * @returns {Promise<Object>} API response data
 */
async function Log(stack, level, pkg, message) {
  // Step 1: Validate input
  const payload = { stack, level, package: pkg, message };
  const { valid, errors } = validateLogPayload(payload);

  if (!valid) {
    throw new Error(`Validation failed: ${errors.join(' | ')}`);
  }

  // Step 2: Attach Bearer Token
  const token = await getToken();

  try {
    // Step 3: POST /evaluation-service/logs
    const response = await httpClient.post(
      '/evaluation-service/logs',
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Step 4: Return response
    return response.data;
  } catch (error) {
    // Step 5: Handle errors — if 401, clear token and retry once
    if (error.response?.status === 401) {
      console.warn('[LogService] Token expired. Re-authenticating...');
      clearToken();
      try {
        const freshToken = await getToken();

        const retryResponse = await httpClient.post(
          '/evaluation-service/logs',
          payload,
          {
            headers: {
              Authorization: `Bearer ${freshToken}`,
            },
          }
        );
        return retryResponse.data;
      } catch (retryError) {
        console.error("Log API error on retry:", retryError.response?.data || retryError.message);
        return null;
      }
    }

    const errMsg = error.response?.data || error.message;
    console.error("Log API error:", errMsg);
    return null;
  }
}

module.exports = { Log };
