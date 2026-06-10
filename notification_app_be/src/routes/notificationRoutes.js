// src/routes/notificationRoutes.js
const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

// Notification CRUD + retry
router.get('/',           notificationController.getAll);
router.get('/:id',        notificationController.getById);
router.post('/',          notificationController.send);
router.put('/:id',        notificationController.update);
router.delete('/:id',     notificationController.remove);
router.post('/:id/retry', notificationController.retry);

module.exports = router;
