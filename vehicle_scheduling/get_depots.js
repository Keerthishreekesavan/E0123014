require('dotenv').config({ path: '../logging_middleware/.env' });
const axios = require('axios');
const fs = require('fs');

const baseURL = process.env.BASE_URL || 'http://4.224.186.213';

async function fetchDepots() {
  try {
    const authRes = await axios.post(`${baseURL}/evaluation-service/auth`, {
      email: 'e0123014@sriher.edu.in',
      name: 'keerthishree k',
      rollNo: 'e0123014',
      accessCode: process.env.ACCESS_CODE,
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
    });
    const token = authRes.data.access_token;

    const response = await axios.get(`${baseURL}/evaluation-service/depots`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const jsonString = JSON.stringify(response.data, null, 2);
    
    // Output exactly the JSON they want
    console.log(jsonString);
    fs.writeFileSync('depots.json', jsonString);

  } catch (error) {
    console.error('Error:', error.message);
  }
}

fetchDepots();
