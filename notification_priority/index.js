require('dotenv').config({ path: '../logging_middleware/.env' });
const axios = require('axios');
const fs = require('fs');

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

const TYPE_WEIGHTS = {
  'Placement': 3,
  'Result': 2,
  'Event': 1
};

function getPriorityScore(notification) {
  const weight = TYPE_WEIGHTS[notification.Type] || 0;
  // Convert ISO string to unix timestamp in seconds
  const timestampSeconds = Math.floor(new Date(notification.Timestamp).getTime() / 1000);
  
  // Placement > Result > Event + Recency
  return (weight * 10000000000) + timestampSeconds;
}

async function runPriorityInbox() {
  try {
    console.log('Authenticating...');
    const token = await authenticate();
    console.log('Authentication successful.\n');

    console.log('Fetching Notifications...');
    const response = await axios.get(`${baseURL}/evaluation-service/notifications`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const notifications = response.data.notifications;
    console.log(`Fetched ${notifications.length} notifications.\n`);

    // Sort descending by priority score
    notifications.sort((a, b) => getPriorityScore(b) - getPriorityScore(a));

    // Get top 10 notifications (assuming N=10 for priority inbox based on typical requirements)
    const topN = notifications.slice(0, 10);

    // Format exactly like the screenshot
    const finalOutput = { notifications: topN };
    const jsonString = JSON.stringify(finalOutput, null, 2);

    console.log('--- Priority Inbox Results ---\n');
    console.log(jsonString);

    fs.writeFileSync('output.json', jsonString);
    console.log('\n✅ Successfully saved results to output.json');

  } catch (error) {
    console.error('Error during execution:', error.response?.data || error.message);
  }
}

runPriorityInbox();
