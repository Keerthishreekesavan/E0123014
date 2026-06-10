// src/services/maintenanceService.js
// Business logic for maintenance scheduling

const maintenanceRepository = require('../repositories/maintenanceRepository');
const vehicleRepository = require('../repositories/vehicleRepository');

const maintenanceService = {
  getAllMaintenance: () => {
    return maintenanceRepository.getAll();
  },

  getMaintenanceById: (id) => {
    const record = maintenanceRepository.getById(id);
    if (!record) throw { statusCode: 404, message: `Maintenance record "${id}" not found.` };
    return record;
  },

  getMaintenanceByVehicleId: (vehicleId) => {
    // Verify vehicle exists
    const vehicle = vehicleRepository.getById(vehicleId);
    if (!vehicle) throw { statusCode: 404, message: `Vehicle with id "${vehicleId}" not found.` };
    return maintenanceRepository.getByVehicleId(vehicleId);
  },

  createMaintenance: (data) => {
    // Verify vehicle exists
    const vehicle = vehicleRepository.getById(data.vehicleId);
    if (!vehicle) throw { statusCode: 404, message: `Vehicle with id "${data.vehicleId}" not found.` };
    return maintenanceRepository.create(data);
  },

  updateMaintenance: (id, data) => {
    const existing = maintenanceRepository.getById(id);
    if (!existing) throw { statusCode: 404, message: `Maintenance record "${id}" not found.` };
    return maintenanceRepository.update(id, data);
  },

  deleteMaintenance: (id) => {
    const existing = maintenanceRepository.getById(id);
    if (!existing) throw { statusCode: 404, message: `Maintenance record "${id}" not found.` };
    return maintenanceRepository.remove(id);
  },
};

module.exports = maintenanceService;
