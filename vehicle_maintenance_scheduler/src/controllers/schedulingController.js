const schedulingService = require('../services/schedulingService');
const { Log } = require('../../../logging_middleware/src/logger/logger');

const schedulingController = {
  // GET /api/schedule
  scheduleMaintenance: async (req, res, next) => {
    try {
      await Log('backend', 'info', 'controller', 'Schedule request received');

      // Fetch depots and vehicles
      const depots = await schedulingService.getDepots();
      const vehicles = await schedulingService.getVehicles();

      // For simplicity, we can solve the knapsack for each depot
      const schedules = depots.map(depot => {
        const result = schedulingService.solveKnapsack(vehicles, depot.MechanicHours);
        return {
          depotId: depot.ID,
          mechanicHoursAvailable: depot.MechanicHours,
          mechanicHoursUsed: result.totalDuration,
          maxImpactScore: result.maxImpact,
          vehiclesScheduledCount: result.selectedVehicles.length,
          scheduledVehicles: result.selectedVehicles
        };
      });

      await Log('backend', 'info', 'controller', 'Schedule generated');

      res.status(200).json({
        success: true,
        data: schedules
      });
    } catch (err) {
      await Log('backend', 'error', 'controller', 'Schedule maintenance error');
      next(err);
    }
  }
};

module.exports = schedulingController;
