// src/config/env.js
// Load and export environment configuration

require('dotenv').config();

const config = {
  clientId: process.env.CLIENT_ID || '',
  clientSecret: process.env.CLIENT_SECRET || '',
  accessCode: process.env.ACCESS_CODE || '',
  accessToken: process.env.ACCESS_TOKEN || '',
  baseUrl: process.env.BASE_URL || 'http://4.224.186.213',
  port: parseInt(process.env.PORT, 10) || 3000,
};

module.exports = config;
