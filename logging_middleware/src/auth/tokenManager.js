// src/auth/tokenManager.js
// Manages token registration and authentication with the evaluation service

const httpClient = require('../utils/httpClient');
const config = require('../config/env');

let cachedToken = config.accessToken || null;

/**
 * Register the client with the evaluation service.
 * @returns {Promise<Object>} Registration response data
 */
async function register() {
  try {
    const response = await httpClient.post('/evaluation-service/register', {
      email: 'abiramikarunakaran7@gmail.com',
      name: 'abirami',
      rollNo: 'e0123011',
      accessCode: config.accessCode,
      clientID: config.clientId,
      clientSecret: config.clientSecret,
    });
    console.log('[Auth] Registration successful:', response.data);
    return response.data;
  } catch (error) {
    const msg = error.response?.data || error.message;
    console.error('[Auth] Registration failed:', msg);
    throw new Error('Registration failed: ' + JSON.stringify(msg));
  }
}

/**
 * Authenticate and retrieve a Bearer Token.
 * @returns {Promise<string>} access_token
 */
async function authenticate() {
  try {
    const response = await httpClient.post('/evaluation-service/auth', {
      email: 'abiramikarunakaran7@gmail.com',
      name: 'Abirami',
      rollNo: 'e0123011',
      accessCode: config.accessCode,
      clientID: config.clientId,
      clientSecret: config.clientSecret,
    });
    const { access_token } = response.data;
    cachedToken = access_token;
    console.log('[Auth] Authentication successful. Token cached.');
    return access_token;
  } catch (error) {
    const msg = error.response?.data || error.message;
    console.error('[Auth] Authentication failed:', msg);
    throw new Error('Authentication failed: ' + JSON.stringify(msg));
  }
}

/**
 * Returns a valid Bearer token (uses cache or re-authenticates).
 * @returns {Promise<string>} access_token
 */
async function getToken() {
  if (cachedToken) return cachedToken;
  return await authenticate();
}

/**
 * Clears the cached token (forces re-authentication on next call).
 */
function clearToken() {
  cachedToken = null;
}

module.exports = { register, authenticate, getToken, clearToken };
