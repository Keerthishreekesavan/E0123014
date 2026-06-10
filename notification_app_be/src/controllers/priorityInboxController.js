const priorityInboxService = require('../services/priorityInboxService');
const { Log } = require('../../../logging_middleware/src/logger/logger');

const priorityInboxController = {
  // GET /api/priority
  getPriorityInbox: async (req, res, next) => {
    try {
      const n = parseInt(req.query.n) || 10;
      await Log('backend', 'info', 'controller', 'Priority inbox request received');

      const topNotifications = await priorityInboxService.getTopNNotifications(n);

      await Log('backend', 'info', 'controller', 'Priority notifications returned');

      res.status(200).json({
        success: true,
        count: topNotifications.length,
        data: topNotifications
      });
    } catch (err) {
      await Log('backend', 'error', 'controller', 'Priority inbox error');
      next(err);
    }
  }
};

module.exports = priorityInboxController;
