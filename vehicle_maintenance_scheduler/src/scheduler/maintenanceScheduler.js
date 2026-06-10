// src/scheduler/maintenanceScheduler.js
// Cron-style scheduler: checks for upcoming/overdue maintenance every minute

function checkUpcomingMaintenance(maintenanceRepository) {
  const now = new Date();
  const upcoming = [];
  const overdue = [];

  const records = maintenanceRepository.getAll();
  records.forEach((r) => {
    if (r.status !== 'SCHEDULED') return;
    const scheduled = new Date(r.scheduledDate);
    const diffMs = scheduled - now;
    const diffDays = diffMs / (1000 * 60 * 60 * 24);

    if (diffMs < 0) {
      overdue.push(r);
    } else if (diffDays <= 7) {
      upcoming.push(r);
    }
  });

  if (overdue.length > 0) {
    console.warn(`[Scheduler] ⚠️  ${overdue.length} overdue maintenance record(s):`);
    overdue.forEach((r) => console.warn(`  - [${r.id}] ${r.type} for vehicle ${r.vehicleId} was due ${r.scheduledDate}`));
  }
  if (upcoming.length > 0) {
    console.info(`[Scheduler] 📅 ${upcoming.length} upcoming maintenance record(s) within 7 days:`);
    upcoming.forEach((r) => console.info(`  - [${r.id}] ${r.type} for vehicle ${r.vehicleId} on ${r.scheduledDate}`));
  }
}

function startScheduler(maintenanceRepository) {
  console.log('[Scheduler] Maintenance scheduler started (checks every 60s)');
  setInterval(() => {
    checkUpcomingMaintenance(maintenanceRepository);
  }, 60 * 1000);

  // Run once on startup
  checkUpcomingMaintenance(maintenanceRepository);
}

module.exports = { startScheduler };
