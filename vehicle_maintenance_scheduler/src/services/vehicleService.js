// src/services/vehicleService.js
// Business logic for vehicle operations

const vehicleRepository = require('../repositories/vehicleRepository');

const vehicleService = {
  getAllVehicles: () => {
    return vehicleRepository.getAll();
  },

  getVehicleById: (id) => {
    const vehicle = vehicleRepository.getById(id);
    if (!vehicle) throw { statusCode: 404, message: `Vehicle with id "${id}" not found.` };
    return vehicle;
  },

  createVehicle: (data) => {
    return vehicleRepository.create(data);
  },

  updateVehicle: (id, data) => {
    const existing = vehicleRepository.getById(id);
    if (!existing) throw { statusCode: 404, message: `Vehicle with id "${id}" not found.` };
    return vehicleRepository.update(id, data);
  },

  deleteVehicle: (id) => {
    const existing = vehicleRepository.getById(id);
    if (!existing) throw { statusCode: 404, message: `Vehicle with id "${id}" not found.` };
    return vehicleRepository.remove(id);
  },
};

module.exports = vehicleService;
