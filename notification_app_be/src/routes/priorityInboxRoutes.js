const express = require('express');
const router = express.Router();
const priorityInboxController = require('../controllers/priorityInboxController');
const { authMiddleware } = require('../middleware/authMiddleware');

// GET /api/priority
router.get('/', authMiddleware, priorityInboxController.getPriorityInbox);

module.exports = router;
