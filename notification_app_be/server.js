// server.js
// Entry point — starts the Notification Backend server

require('dotenv').config();

const app = require('./src/app');
const config = require('./src/config/env');

app.listen(config.port, () => {
  console.log(`\n🚀 Notification Backend Service`);
  console.log(`   Local:          http://localhost:${config.port}`);
  console.log(`   Health:         http://localhost:${config.port}/health`);
  console.log(`   Notifications:  http://localhost:${config.port}/api/notifications\n`);
});
