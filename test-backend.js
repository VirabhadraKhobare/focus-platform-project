// Test backend connection
const http = require('http');

const options = {
  hostname: 'localhost',
  port: 4000,
  path: '/health',
  method: 'GET'
};

console.log('🧪 Testing backend connection...');

const req = http.request(options, (res) => {
  console.log(`✅ Status: ${res.statusCode}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('✅ Response:', data);
  });
});

req.on('error', (error) => {
  console.error('❌ Connection error:', error.message);
});

req.end();