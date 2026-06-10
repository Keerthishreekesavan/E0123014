const express = require('express');
const router = express.Router();
const schedulingController = require('../controllers/schedulingController');
const { authMiddleware } = require('../middleware/authMiddleware');

// GET /api/schedule
router.get('/', authMiddleware, schedulingController.scheduleMaintenance);

module.exports = router;
