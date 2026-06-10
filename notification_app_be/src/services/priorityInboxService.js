const axios = require('axios');
const config = require('../config/env');
const { Log } = require('../../../logging_middleware/src/logger/logger');

const apiClient = axios.create({
  baseURL: config.baseUrl,
  headers: {
    Authorization: `Bearer ${config.accessToken}`
  }
});

const TYPE_WEIGHTS = {
  'Placement': 3,
  'Result': 2,
  'Event': 1
};

async function fetchNotifications() {
  try {
    const response = await apiClient.get('/evaluation-service/notifications');
    await Log('backend', 'info', 'service', 'Fetched notifications');
    return response.data.notifications;
  } catch (error) {
    await Log('backend', 'error', 'service', 'Fetch notifications failed');
    throw error;
  }
}

function getPriorityScore(notification) {
  const weight = TYPE_WEIGHTS[notification.Type] || 0;
  // Convert ISO string to unix timestamp in seconds
  const timestampSeconds = Math.floor(new Date(notification.Timestamp).getTime() / 1000);
  
  // Placement > Result > Event + Recency
  return (weight * 10000000000) + timestampSeconds;
}

// Simple sorting implementation for the Top-N problem
// In a real continuously updating system, a Min-Heap would be used.
async function getTopNNotifications(n = 10) {
  const notifications = await fetchNotifications();
  
  // Sort descending by priority score
  notifications.sort((a, b) => getPriorityScore(b) - getPriorityScore(a));
  
  const topN = notifications.slice(0, n);
  
  Log('backend', 'info', 'service', 'Priority notifications calculated').catch(() => {});
  
  return topN;
}

module.exports = { getTopNNotifications };
