const axios = require('axios');
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJhYmlyYW1pa2FydW5ha2FyYW43QGdtYWlsLmNvbSIsImV4cCI6MTc4MTA2ODMxMSwiaWF0IjoxNzgxMDY3NDExLCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiODA1MDc0YmItOWRmYy00NDRmLWE0ZGYtYzg3ZDE2NGM3NmI1IiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoiYWJpcmFtaSIsInN1YiI6IjA0MzNmYjA1LTA5MTMtNDE2OS05YjE2LWJiMmU5N2E4OGY3YSJ9LCJlbWFpbCI6ImFiaXJhbWlrYXJ1bmFrYXJhbjdAZ21haWwuY29tIiwibmFtZSI6ImFiaXJhbWkiLCJyb2xsTm8iOiJlMDEyMzAxMSIsImFjY2Vzc0NvZGUiOiJEdndFRFoiLCJjbGllbnRJRCI6IjA0MzNmYjA1LTA5MTMtNDE2OS05YjE2LWJiMmU5N2E4OGY3YSIsImNsaWVudFNlY3JldCI6IlBZV1BTY2FFRWhNYXlUSFQifQ.uiDJEtO2Dw4qhoxXo0jZDiZvyXp_hFH8JZ8XcFecRI4';
const baseURL = 'http://4.224.186.213';

async function test() {
  try {
    const depotsRes = await axios.get(`${baseURL}/evaluation-service/depots`, { headers: { Authorization: `Bearer ${token}` } });
    console.log('Depots:', JSON.stringify(depotsRes.data).substring(0, 500));
    
    const vehiclesRes = await axios.get(`${baseURL}/evaluation-service/vehicles`, { headers: { Authorization: `Bearer ${token}` } });
    console.log('Vehicles:', JSON.stringify(vehiclesRes.data).substring(0, 500));
  } catch (e) {
    console.error(e.response ? e.response.data : e.message);
  }
}
test();
