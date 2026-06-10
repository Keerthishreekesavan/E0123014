// src/repositories/maintenanceRepository.js
// Data access layer for maintenance records

const maintenanceModel = require('../models/maintenanceModel');

const maintenanceRepository = {
  getAll: () => maintenanceModel.findAllMaintenance(),
  getById: (id) => maintenanceModel.findMaintenanceById(id),
  getByVehicleId: (vehicleId) => maintenanceModel.findMaintenanceByVehicleId(vehicleId),
  create: (data) => maintenanceModel.createMaintenance(data),
  update: (id, data) => maintenanceModel.updateMaintenance(id, data),
  remove: (id) => maintenanceModel.deleteMaintenance(id),
};

module.exports = maintenanceRepository;
