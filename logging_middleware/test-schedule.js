const axios = require('axios');
const token = require('./src/config/env').accessToken;

(async () => {
  try {
    const res = await axios.get('http://localhost:3001/api/schedule', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log(JSON.stringify(res.data, null, 2));
  } catch(e) { 
    console.error(e.response ? e.response.data : e.message); 
  }
})();
