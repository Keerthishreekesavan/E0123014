// src/api/logController.js
// Controller: handles POST /log requests to trigger a log via the middleware

const { Log } = require('../services/logService');
const { validateLogPayload } = require('../validators/logValidator');

/**
 * POST /log
 * Body: { stack, level, package, message }
 */
async function createLog(req, res, next) {
  try {
    const { stack, level, package: pkg, message } = req.body;

    // Validate
    const { valid, errors } = validateLogPayload({ stack, level, package: pkg, message });
    if (!valid) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors,
      });
    }

    // Call the Log function
    const result = await Log(stack, level, pkg, message);

    return res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { createLog };
