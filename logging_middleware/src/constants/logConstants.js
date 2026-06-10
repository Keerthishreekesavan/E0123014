// src/constants/logConstants.js
// Allowed values for stack, level, and package fields

const ALLOWED_STACKS = ['backend', 'frontend'];

const ALLOWED_LEVELS = ['debug', 'info', 'warn', 'error', 'fatal'];

const BACKEND_PACKAGES = [
  'cache',
  'controller',
  'cron_job',
  'db',
  'domain',
  'handler',
  'repository',
  'route',
  'service',
];

const COMMON_PACKAGES = ['auth', 'config', 'middleware', 'utils'];

const ALLOWED_PACKAGES = [...BACKEND_PACKAGES, ...COMMON_PACKAGES];

module.exports = {
  ALLOWED_STACKS,
  ALLOWED_LEVELS,
  BACKEND_PACKAGES,
  COMMON_PACKAGES,
  ALLOWED_PACKAGES,
};
