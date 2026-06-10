// src/controllers/maintenanceController.js
// Handles HTTP requests for maintenance schedule CRUD

const maintenanceService = require('../services/maintenanceService');
const { validateCreateMaintenance, validateUpdateMaintenance } = require('../validators/maintenanceValidator');

const maintenanceController = {
  // GET /api/maintenance
  getAll: async (req, res, next) => {
    try {
      const records = maintenanceService.getAllMaintenance();
      res.status(200).json({ success: true, count: records.length, data: records });
    } catch (err) { next(err); }
  },

  // GET /api/maintenance/:id
  getById: async (req, res, next) => {
    try {
      const record = maintenanceService.getMaintenanceById(req.params.id);
      res.status(200).json({ success: true, data: record });
    } catch (err) { next(err); }
  },

  // GET /api/vehicles/:vehicleId/maintenance
  getByVehicleId: async (req, res, next) => {
    try {
      const records = maintenanceService.getMaintenanceByVehicleId(req.params.vehicleId);
      res.status(200).json({ success: true, count: records.length, data: records });
    } catch (err) { next(err); }
  },

  // POST /api/maintenance
  create: async (req, res, next) => {
    try {
      const { valid, errors } = validateCreateMaintenance(req.body);
      if (!valid) return res.status(400).json({ success: false, errors });
      const record = maintenanceService.createMaintenance(req.body);
      res.status(201).json({ success: true, data: record });
    } catch (err) { next(err); }
  },

  // PUT /api/maintenance/:id
  update: async (req, res, next) => {
    try {
      const { valid, errors } = validateUpdateMaintenance(req.body);
      if (!valid) return res.status(400).json({ success: false, errors });
      const record = maintenanceService.updateMaintenance(req.params.id, req.body);
      res.status(200).json({ success: true, data: record });
    } catch (err) { next(err); }
  },

  // DELETE /api/maintenance/:id
  remove: async (req, res, next) => {
    try {
      maintenanceService.deleteMaintenance(req.params.id);
      res.status(200).json({ success: true, message: 'Maintenance record deleted successfully.' });
    } catch (err) { next(err); }
  },
};

module.exports = maintenanceController;
