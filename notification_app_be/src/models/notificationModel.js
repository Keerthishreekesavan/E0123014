// src/models/notificationModel.js
// In-memory data model for notifications

const { v4: uuidv4 } = require('uuid');

const notifications = [];

const VALID_TYPES = ['email', 'sms', 'push'];
const VALID_STATUSES = ['PENDING', 'SENT', 'FAILED'];

function createNotification({ type, recipient, subject, message, status }) {
  const record = {
    id: uuidv4(),
    type,
    recipient,
    subject: subject || '',
    message,
    status: status || 'PENDING',
    retryCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  notifications.push(record);
  return record;
}

function findAll() {
  return notifications;
}

function findById(id) {
  return notifications.find((n) => n.id === id) || null;
}

function updateNotification(id, updates) {
  const idx = notifications.findIndex((n) => n.id === id);
  if (idx === -1) return null;
  notifications[idx] = { ...notifications[idx], ...updates, updatedAt: new Date().toISOString() };
  return notifications[idx];
}

function deleteNotification(id) {
  const idx = notifications.findIndex((n) => n.id === id);
  if (idx === -1) return false;
  notifications.splice(idx, 1);
  return true;
}

module.exports = {
  createNotification,
  findAll,
  findById,
  updateNotification,
  deleteNotification,
  VALID_TYPES,
  VALID_STATUSES,
};
