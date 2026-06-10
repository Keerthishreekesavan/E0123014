// src/routes/maintenanceRoutes.js
const express = require('express');
const router = express.Router();
const maintenanceController = require('../controllers/maintenanceController');

// Maintenance CRUD
router.get('/',       maintenanceController.getAll);
router.get('/:id',    maintenanceController.getById);
router.post('/',      maintenanceController.create);
router.put('/:id',    maintenanceController.update);
router.delete('/:id', maintenanceController.remove);

module.exports = router;
