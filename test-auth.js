// Test authentication endpoints
console.log('🧪 Testing authentication endpoints...');

const API_BASE = 'http://localhost:4002/api';

// Test registration
async function testRegister() {
  try {
    console.log('📝 Testing registration...');
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        password: 'test123'
      })
    });

    const data = await response.json();
    console.log('✅ Registration response:', data);
    
    if (response.ok) {
      return data;
    } else {
      console.error('❌ Registration failed:', data);
      return null;
    }
  } catch (error) {
    console.error('❌ Registration error:', error);
    return null;
  }
}

// Test login
async function testLogin() {
  try {
    console.log('🔐 Testing login...');
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'test123'
      })
    });

    const data = await response.json();
    console.log('✅ Login response:', data);
    
    if (response.ok) {
      return data;
    } else {
      console.error('❌ Login failed:', data);
      return null;
    }
  } catch (error) {
    console.error('❌ Login error:', error);
    return null;
  }
}

// Test health endpoint
async function testHealth() {
  try {
    console.log('🏥 Testing health endpoint...');
    const response = await fetch(`${API_BASE}/../health`);
    const data = await response.json();
    console.log('✅ Health response:', data);
    return data;
  } catch (error) {
    console.error('❌ Health check failed:', error);
    return null;
  }
}

// Run tests
async function runTests() {
  console.log('🚀 Starting authentication tests...\n');
  
  await testHealth();
  console.log('');
  
  const registerResult = await testRegister();
  console.log('');
  
  if (registerResult) {
    await testLogin();
  }
  
  console.log('\n✅ Tests completed!');
}

// Run if in browser console
if (typeof window !== 'undefined') {
  runTests();
} else {
  console.log('Run this in the browser console to test the endpoints');
}