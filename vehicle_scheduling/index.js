require('dotenv').config({ path: '../logging_middleware/.env' });
const axios = require('axios');

const baseURL = process.env.BASE_URL || 'http://4.224.186.213';

// Helper to authenticate
async function authenticate() {
  const response = await axios.post(`${baseURL}/evaluation-service/auth`, {
    email: 'e0123014@sriher.edu.in',
    name: 'keerthishree k',
    rollNo: 'e0123014',
    accessCode: process.env.ACCESS_CODE,
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
  });
  return response.data.access_token;
}

// 0/1 Knapsack logic
function solveKnapsack(capacity, items) {
  const n = items.length;
  // dp[i][w] will store the max impact with i items and w capacity
  const dp = Array.from({ length: n + 1 }, () => Array(capacity + 1).fill(0));

  for (let i = 1; i <= n; i++) {
    const item = items[i - 1];
    const duration = item.Duration;
    const impact = item.Impact;

    for (let w = 1; w <= capacity; w++) {
      if (duration <= w) {
        dp[i][w] = Math.max(dp[i - 1][w], dp[i - 1][w - duration] + impact);
      } else {
        dp[i][w] = dp[i - 1][w];
      }
    }
  }

  // Backtrack to find the selected items
  let res = dp[n][capacity];
  const selectedTasks = [];
  let w = capacity;
  let totalDuration = 0;

  for (let i = n; i > 0 && res > 0; i--) {
    if (res === dp[i - 1][w]) {
      continue;
    } else {
      const item = items[i - 1];
      selectedTasks.push({
        TaskID: item.TaskID,
        Duration: item.Duration,
        Impact: item.Impact
      });
      res = res - item.Impact;
      w = w - item.Duration;
      totalDuration += item.Duration;
    }
  }

  return {
    TotalImpact: dp[n][capacity],
    UtilizedMechanicHours: totalDuration,
    ScheduledVehicles: selectedTasks.reverse()
  };
}

async function runScheduler() {
  try {
    const token = await authenticate();
    
    const [depotsRes, vehiclesRes] = await Promise.all([
      axios.get(`${baseURL}/evaluation-service/depots`, { headers: { Authorization: `Bearer ${token}` } }),
      axios.get(`${baseURL}/evaluation-service/vehicles`, { headers: { Authorization: `Bearer ${token}` } })
    ]);

    const depots = depotsRes.data.depots;
    const vehicles = vehiclesRes.data.vehicles;

    const formattedDepots = depots.map(depot => {
      const result = solveKnapsack(depot.MechanicHours, vehicles);
      return {
        ID: depot.ID,
        MechanicHours: depot.MechanicHours,
        TotalImpact: result.TotalImpact,
        UtilizedMechanicHours: result.UtilizedMechanicHours,
        vehicles: result.ScheduledVehicles
      };
    });

    const finalOutput = { depots: formattedDepots };
    const jsonString = JSON.stringify(finalOutput, null, 2);
    
    // Print to terminal
    console.log(jsonString);
    
    // Save to a file for easy screenshotting
    const fs = require('fs');
    fs.writeFileSync('output.json', jsonString);
    console.log('\\n✅ Successfully saved results to output.json');

  } catch (error) {
    console.error('Error during execution:', error.response?.data || error.message);
  }
}

runScheduler();
