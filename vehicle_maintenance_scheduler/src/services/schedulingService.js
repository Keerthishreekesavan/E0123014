const axios = require('axios');
const config = require('../config/env');
const { Log } = require('../../../logging_middleware/src/logger/logger');

const apiClient = axios.create({
  baseURL: config.baseUrl,
  headers: {
    Authorization: `Bearer ${config.accessToken}`
  }
});

async function getDepots() {
  try {
    const response = await apiClient.get('/evaluation-service/depots');
    await Log('backend', 'info', 'service', 'Fetched depots');
    return response.data.depots;
  } catch (error) {
    await Log('backend', 'error', 'service', 'Fetch depots failed');
    throw error;
  }
}

async function getVehicles() {
  try {
    const response = await apiClient.get('/evaluation-service/vehicles');
    await Log('backend', 'info', 'service', 'Fetched vehicles');
    return response.data.vehicles;
  } catch (error) {
    await Log('backend', 'error', 'service', 'Fetch vehicles failed');
    throw error;
  }
}

function solveKnapsack(vehicles, capacity) {
  const n = vehicles.length;
  // dp array to store max impact
  const dp = new Array(capacity + 1).fill(0);
  // selected 2D array to track which vehicles are included
  const selected = Array.from({ length: n + 1 }, () => new Array(capacity + 1).fill(false));

  for (let i = 0; i < n; i++) {
    const v = vehicles[i];
    const weight = v.Duration;
    const value = v.Impact;
    for (let w = capacity; w >= weight; w--) {
      if (dp[w - weight] + value > dp[w]) {
        dp[w] = dp[w - weight] + value;
        selected[i + 1][w] = true;
      }
    }
  }

  // Backtrack to find selected vehicles
  let w = capacity;
  const resultVehicles = [];
  for (let i = n; i > 0; i--) {
    if (selected[i][w]) {
      resultVehicles.push(vehicles[i - 1]);
      w -= vehicles[i - 1].Duration;
    }
  }

  Log('backend', 'info', 'service', 'Knapsack complete').catch(() => {});

  return {
    maxImpact: dp[capacity],
    totalDuration: capacity - w,
    selectedVehicles: resultVehicles.reverse()
  };
}

module.exports = { getDepots, getVehicles, solveKnapsack };
