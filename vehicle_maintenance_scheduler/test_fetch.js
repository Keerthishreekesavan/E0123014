const axios = require('axios');
const env = require('../logging_middleware/src/config/env');

const baseURL = env.baseUrl;

async function test() {
  try {
    const authRes = await axios.post(`${baseURL}/evaluation-service/auth`, {
      email: 'abiramikarunakaran7@gmail.com',
      name: 'abirami',
      rollNo: 'e0123011',
      accessCode: env.accessCode,
      clientID: env.clientId,
      clientSecret: env.clientSecret,
    });
    const token = authRes.data.access_token;
    
    const depotsRes = await axios.get(`${baseURL}/evaluation-service/depots`, { headers: { Authorization: `Bearer ${token}` } });
    console.log('Depots count:', depotsRes.data.depots.length);
    console.log('Depots sample:', depotsRes.data.depots.slice(0, 2));
    
    const vehiclesRes = await axios.get(`${baseURL}/evaluation-service/vehicles`, { headers: { Authorization: `Bearer ${token}` } });
    console.log('Vehicles count:', vehiclesRes.data.vehicles.length);
    console.log('Vehicles sample:', vehiclesRes.data.vehicles.slice(0, 2));
  } catch (e) {
    console.error('Error:', e.response ? e.response.data : e.message);
  }
}
test();
