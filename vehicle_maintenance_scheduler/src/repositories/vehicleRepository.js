// src/repositories/vehicleRepository.js
// Data access layer for vehicles

const vehicleModel = require('../models/vehicleModel');

const vehicleRepository = {
  getAll: () => vehicleModel.findAllVehicles(),
  getById: (id) => vehicleModel.findVehicleById(id),
  create: (data) => vehicleModel.createVehicle(data),
  update: (id, data) => vehicleModel.updateVehicle(id, data),
  remove: (id) => vehicleModel.deleteVehicle(id),
};

module.exports = vehicleRepository;
