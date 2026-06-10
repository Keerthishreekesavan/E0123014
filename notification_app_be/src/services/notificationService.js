// src/services/notificationService.js
// Business logic for notification operations

const notificationRepository = require('../repositories/notificationRepository');
const { dispatch } = require('../notifications/notificationDispatcher');

const MAX_RETRIES = 3;

const notificationService = {
  getAll: () => notificationRepository.getAll(),

  getById: (id) => {
    const record = notificationRepository.getById(id);
    if (!record) throw { statusCode: 404, message: `Notification "${id}" not found.` };
    return record;
  },

  send: async (data) => {
    // Create with PENDING status
    const notification = notificationRepository.create({ ...data, status: 'PENDING' });

    // Dispatch to channel
    const result = await dispatch(notification);

    // Update status based on dispatch result
    const updated = notificationRepository.update(notification.id, {
      status: result.success ? 'SENT' : 'FAILED',
    });

    return updated;
  },

  update: (id, data) => {
    const existing = notificationRepository.getById(id);
    if (!existing) throw { statusCode: 404, message: `Notification "${id}" not found.` };
    return notificationRepository.update(id, data);
  },

  remove: (id) => {
    const existing = notificationRepository.getById(id);
    if (!existing) throw { statusCode: 404, message: `Notification "${id}" not found.` };
    return notificationRepository.remove(id);
  },

  retry: async (id) => {
    const existing = notificationRepository.getById(id);
    if (!existing) throw { statusCode: 404, message: `Notification "${id}" not found.` };
    if (existing.status !== 'FAILED') {
      throw { statusCode: 400, message: 'Only FAILED notifications can be retried.' };
    }
    if (existing.retryCount >= MAX_RETRIES) {
      throw { statusCode: 400, message: `Max retries (${MAX_RETRIES}) exceeded.` };
    }

    // Increment retry count & reset to PENDING
    notificationRepository.update(id, {
      status: 'PENDING',
      retryCount: existing.retryCount + 1,
    });

    const result = await dispatch(existing);
    return notificationRepository.update(id, {
      status: result.success ? 'SENT' : 'FAILED',
    });
  },
};

module.exports = notificationService;
