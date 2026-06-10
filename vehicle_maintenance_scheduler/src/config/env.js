// src/config/env.js
require('dotenv').config();

module.exports = {
  port: parseInt(process.env.PORT, 10) || 3001,
  baseUrl: process.env.BASE_URL || 'http://4.224.186.213',
  clientId: process.env.CLIENT_ID || '',
  clientSecret: process.env.CLIENT_SECRET || '',
  accessToken: process.env.ACCESS_TOKEN || '',
};
