const axios = require('axios');

async function testAdminSystem() {
  const baseUrl = 'http://localhost:4002/api';
  
  try {
    console.log('🧪 Testing Admin Monitoring System...\n');
    
    // Test 1: Admin Login
    console.log('1. Testing admin login...');
    const loginResponse = await axios.post(`${baseUrl}/admin/login`, {
      email: 'admin@yourcompany.com',
      password: 'secure-admin-password'
    });
    
    const adminToken = loginResponse.data.token;
    console.log('✅ Admin login successful!');
    console.log('Token:', adminToken.substring(0, 20) + '...\n');
    
    // Test 2: Register a test user (should trigger admin notification)
    console.log('2. Registering test user (should trigger notification)...');
    const registerResponse = await axios.post(`${baseUrl}/auth/register`, {
      name: 'Test User',
      email: 'testuser@example.com',
      password: 'password123'
    });
    
    const userToken = registerResponse.data.token;
    console.log('✅ User registration successful!');
    console.log('User Token:', userToken.substring(0, 20) + '...\n');
    
    // Test 3: Login test user (should trigger admin notification)
    console.log('3. Logging in test user (should trigger notification)...');
    await axios.post(`${baseUrl}/auth/login`, {
      email: 'testuser@example.com',
      password: 'password123'
    });
    console.log('✅ User login successful!\n');
    
    // Test 4: Complete an activity (should trigger admin notification)
    console.log('4. Completing activity (should trigger notification)...');
    await axios.post(`${baseUrl}/activities/1/complete`, {
      userId: registerResponse.data.user.id
    });
    console.log('✅ Activity completion successful!\n');
    
    // Test 5: Get admin stats
    console.log('5. Getting admin statistics...');
    const statsResponse = await axios.get(`${baseUrl}/admin/stats`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    console.log('✅ Admin stats retrieved:');
    console.log('Stats:', JSON.stringify(statsResponse.data, null, 2));
    console.log('');
    
    // Test 6: Get activity logs
    console.log('6. Getting activity logs...');
    const logsResponse = await axios.get(`${baseUrl}/admin/activity-logs?limit=10`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    console.log('✅ Activity logs retrieved:');
    console.log('Logs:', JSON.stringify(logsResponse.data, null, 2));
    
    console.log('\n🎉 All tests completed successfully!');
    console.log('Admin monitoring system is working properly.');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Error code:', error.code);
    if (error.response) {
      console.error('Response:', error.response.data);
      console.error('Status:', error.response.status);
    } else {
      console.error('No response - likely connection error');
      console.error('Full error:', error);
    }
  }
}

testAdminSystem();