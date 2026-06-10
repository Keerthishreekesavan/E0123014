// src/utils/httpClient.js
// Axios HTTP client utility with base configuration

const axios = require('axios');
const config = require('../config/env');

const httpClient = axios.create({
  baseURL: config.baseUrl,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

module.exports = httpClient;
