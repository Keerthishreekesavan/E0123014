// src/controllers/vehicleController.js
// Handles HTTP requests for vehicle CRUD operations

const vehicleService = require('../services/vehicleService');
const { validateCreateVehicle, validateUpdateVehicle } = require('../validators/vehicleValidator');

const vehicleController = {
  // GET /api/vehicles
  getAll: async (req, res, next) => {
    try {
      const vehicles = vehicleService.getAllVehicles();
      res.status(200).json({ success: true, count: vehicles.length, data: vehicles });
    } catch (err) { next(err); }
  },

  // GET /api/vehicles/:id
  getById: async (req, res, next) => {
    try {
      const vehicle = vehicleService.getVehicleById(req.params.id);
      res.status(200).json({ success: true, data: vehicle });
    } catch (err) { next(err); }
  },

  // POST /api/vehicles
  create: async (req, res, next) => {
    try {
      const { valid, errors } = validateCreateVehicle(req.body);
      if (!valid) return res.status(400).json({ success: false, errors });
      const vehicle = vehicleService.createVehicle(req.body);
      res.status(201).json({ success: true, data: vehicle });
    } catch (err) { next(err); }
  },

  // PUT /api/vehicles/:id
  update: async (req, res, next) => {
    try {
      const { valid, errors } = validateUpdateVehicle(req.body);
      if (!valid) return res.status(400).json({ success: false, errors });
      const vehicle = vehicleService.updateVehicle(req.params.id, req.body);
      res.status(200).json({ success: true, data: vehicle });
    } catch (err) { next(err); }
  },

  // DELETE /api/vehicles/:id
  remove: async (req, res, next) => {
    try {
      vehicleService.deleteVehicle(req.params.id);
      res.status(200).json({ success: true, message: 'Vehicle deleted successfully.' });
    } catch (err) { next(err); }
  },
};

module.exports = vehicleController;
