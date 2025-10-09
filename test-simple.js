// Simple test to check if the server is responding
const http = require('http');

const options = {
  hostname: 'localhost',
  port: 4002,
  path: '/health',
  method: 'GET'
};

const req = http.request(options, (res) => {
  console.log(`statusCode: ${res.statusCode}`);
  console.log(`headers:`, res.headers);

  res.on('data', (d) => {
    console.log('Response:', d.toString());
  });
});

req.on('error', (error) => {
  console.error('Connection error:', error);
});

req.end();