// src/routes/vehicleRoutes.js
const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');
const maintenanceController = require('../controllers/maintenanceController');

// Vehicle CRUD
router.get('/',            vehicleController.getAll);
router.get('/:id',         vehicleController.getById);
router.post('/',           vehicleController.create);
router.put('/:id',         vehicleController.update);
router.delete('/:id',      vehicleController.remove);

// Nested: maintenance for a vehicle
router.get('/:vehicleId/maintenance', maintenanceController.getByVehicleId);

module.exports = router;
