// src/controllers/notificationController.js
// Handles HTTP requests for notification operations

const notificationService = require('../services/notificationService');
const { validateCreateNotification, validateUpdateNotification } = require('../validators/notificationValidator');

const notificationController = {
  // GET /api/notifications
  getAll: async (req, res, next) => {
    try {
      const records = notificationService.getAll();
      res.status(200).json({ success: true, count: records.length, data: records });
    } catch (err) { next(err); }
  },

  // GET /api/notifications/:id
  getById: async (req, res, next) => {
    try {
      const record = notificationService.getById(req.params.id);
      res.status(200).json({ success: true, data: record });
    } catch (err) { next(err); }
  },

  // POST /api/notifications
  send: async (req, res, next) => {
    try {
      const { valid, errors } = validateCreateNotification(req.body);
      if (!valid) return res.status(400).json({ success: false, errors });
      const record = await notificationService.send(req.body);
      res.status(201).json({ success: true, data: record });
    } catch (err) { next(err); }
  },

  // PUT /api/notifications/:id
  update: async (req, res, next) => {
    try {
      const { valid, errors } = validateUpdateNotification(req.body);
      if (!valid) return res.status(400).json({ success: false, errors });
      const record = notificationService.update(req.params.id, req.body);
      res.status(200).json({ success: true, data: record });
    } catch (err) { next(err); }
  },

  // DELETE /api/notifications/:id
  remove: async (req, res, next) => {
    try {
      notificationService.remove(req.params.id);
      res.status(200).json({ success: true, message: 'Notification deleted successfully.' });
    } catch (err) { next(err); }
  },

  // POST /api/notifications/:id/retry
  retry: async (req, res, next) => {
    try {
      const record = await notificationService.retry(req.params.id);
      res.status(200).json({ success: true, data: record });
    } catch (err) { next(err); }
  },
};

module.exports = notificationController;
