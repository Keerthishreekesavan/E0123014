// server.js
// Entry point — starts the Vehicle Maintenance Scheduler server

require('dotenv').config();

const app = require('./src/app');
const config = require('./src/config/env');
const maintenanceRepository = require('./src/repositories/maintenanceRepository');
const { startScheduler } = require('./src/scheduler/maintenanceScheduler');

// Start the maintenance scheduler
startScheduler(maintenanceRepository);

// Start the server
app.listen(config.port, () => {
  console.log(`\n🚀 Vehicle Maintenance Scheduler`);
  console.log(`   Local:        http://localhost:${config.port}`);
  console.log(`   Health:       http://localhost:${config.port}/health`);
  console.log(`   Vehicles:     http://localhost:${config.port}/api/vehicles`);
  console.log(`   Maintenance:  http://localhost:${config.port}/api/maintenance\n`);
});
