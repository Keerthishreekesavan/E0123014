// src/repositories/notificationRepository.js
// Data access layer for notifications

const notificationModel = require('../models/notificationModel');

const notificationRepository = {
  getAll: () => notificationModel.findAll(),
  getById: (id) => notificationModel.findById(id),
  create: (data) => notificationModel.createNotification(data),
  update: (id, data) => notificationModel.updateNotification(id, data),
  remove: (id) => notificationModel.deleteNotification(id),
};

module.exports = notificationRepository;
