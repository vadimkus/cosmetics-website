/**
 * Test script for user creation and password reset functionality
 * Run with: node scripts/test-user-and-password-reset.js
 */

const https = require('https');
const http = require('http');

// Configuration
const BASE_URL = process.env.TEST_URL || 'http://localhost:3000';
const TEST_EMAIL = `test-${Date.now()}@test.com`;
const TEST_PASSWORD = 'TestPassword123!';
const TEST_NAME = 'Test User';
const TEST_PHONE = '+971501234567';
const TEST_ADDRESS = '123 Test Street';
const TEST_EMIRATE = 'Dubai';

// Cookie storage
let cookies = '';

// Helper function to parse and store cookies
function parseCookies(setCookieHeaders) {
  if (!setCookieHeaders) return;
  
  const cookieArray = Array.isArray(setCookieHeaders) ? setCookieHeaders : [setCookieHeaders];
  cookieArray.forEach(cookie => {
    if (cookie) {
      const cookieValue = cookie.split(';')[0];
      if (cookies) {
        cookies += '; ' + cookieValue;
      } else {
        cookies = cookieValue;
      }
    }
  });
}

// Helper function to make HTTP requests
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const isHttps = urlObj.protocol === 'https:';
    const client = isHttps ? https : http;
    
    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port || (isHttps ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(cookies ? { 'Cookie': cookies } : {}),
        ...options.headers
      }
    };

    const req = client.request(requestOptions, (res) => {
      // Parse and store cookies from response
      if (res.headers['set-cookie']) {
        parseCookies(res.headers['set-cookie']);
      }
      
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: jsonData
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: data
          });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (options.body) {
      req.write(JSON.stringify(options.body));
    }

    req.end();
  });
}

// Get CSRF token
async function getCsrfToken() {
  try {
    const response = await makeRequest(`${BASE_URL}/api/csrf-token`);
    if (response.status === 200 && response.data.token) {
      return response.data.token;
    }
    throw new Error(`Failed to get CSRF token. Status: ${response.status}, Response: ${JSON.stringify(response.data)}`);
  } catch (error) {
    console.error('❌ Error getting CSRF token:', error.message);
    throw error;
  }
}

// Test 1: Create new user
async function testUserCreation() {
  console.log('\n🧪 Test 1: Creating new user...');
  console.log(`   Email: ${TEST_EMAIL}`);
  console.log(`   Name: ${TEST_NAME}`);
  
  try {
    const csrfToken = await getCsrfToken();
    console.log('   ✓ CSRF token obtained');

    const response = await makeRequest(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'X-CSRF-Token': csrfToken
      },
      body: {
        name: TEST_NAME,
        email: TEST_EMAIL,
        password: TEST_PASSWORD,
        phone: TEST_PHONE,
        address: TEST_ADDRESS,
        emirate: TEST_EMIRATE,
        csrfToken: csrfToken
      }
    });

    if (response.status === 200 || response.status === 201) {
      console.log('   ✅ User created successfully!');
      console.log('   Response:', JSON.stringify(response.data, null, 2));
      return true;
    } else {
      console.log('   ❌ User creation failed');
      console.log('   Status:', response.status);
      console.log('   Response:', JSON.stringify(response.data, null, 2));
      return false;
    }
  } catch (error) {
    console.error('   ❌ Error creating user:', error.message);
    return false;
  }
}

// Test 2: Request password reset
async function testPasswordReset() {
  console.log('\n🧪 Test 2: Requesting password reset...');
  console.log(`   Email: ${TEST_EMAIL}`);
  
  try {
    const csrfToken = await getCsrfToken();
    console.log('   ✓ CSRF token obtained');

    const response = await makeRequest(`${BASE_URL}/api/auth/forgot-password`, {
      method: 'POST',
      headers: {
        'X-CSRF-Token': csrfToken
      },
      body: {
        email: TEST_EMAIL,
        csrfToken: csrfToken
      }
    });

    if (response.status === 200) {
      console.log('   ✅ Password reset request successful!');
      console.log('   Response:', JSON.stringify(response.data, null, 2));
      return true;
    } else {
      console.log('   ❌ Password reset request failed');
      console.log('   Status:', response.status);
      console.log('   Response:', JSON.stringify(response.data, null, 2));
      return false;
    }
  } catch (error) {
    console.error('   ❌ Error requesting password reset:', error.message);
    return false;
  }
}

// Test 3: Login with new user
async function testLogin() {
  console.log('\n🧪 Test 3: Testing login with new user...');
  console.log(`   Email: ${TEST_EMAIL}`);
  
  try {
    const csrfToken = await getCsrfToken();
    console.log('   ✓ CSRF token obtained');

    const response = await makeRequest(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'X-CSRF-Token': csrfToken
      },
      body: {
        email: TEST_EMAIL,
        password: TEST_PASSWORD,
        csrfToken: csrfToken
      }
    });

    if (response.status === 200) {
      console.log('   ✅ Login successful!');
      console.log('   User:', response.data.user?.email || 'N/A');
      return true;
    } else {
      console.log('   ❌ Login failed');
      console.log('   Status:', response.status);
      console.log('   Response:', JSON.stringify(response.data, null, 2));
      return false;
    }
  } catch (error) {
    console.error('   ❌ Error logging in:', error.message);
    return false;
  }
}

// Run all tests
async function runTests() {
  console.log('🚀 Starting User Creation and Password Reset Tests');
  console.log(`📍 Testing against: ${BASE_URL}`);
  console.log(`📧 Test email: ${TEST_EMAIL}`);

  const results = {
    userCreation: false,
    passwordReset: false,
    login: false
  };

  // Test 1: Create user
  results.userCreation = await testUserCreation();
  
  if (results.userCreation) {
    // Test 2: Request password reset
    results.passwordReset = await testPasswordReset();
    
    // Test 3: Login
    results.login = await testLogin();
  } else {
    console.log('\n⚠️  Skipping password reset and login tests (user creation failed)');
  }

  // Summary
  console.log('\n📊 Test Results Summary:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`   User Creation:     ${results.userCreation ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`   Password Reset:     ${results.passwordReset ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`   Login:              ${results.login ? '✅ PASS' : '❌ FAIL'}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  const allPassed = results.userCreation && results.passwordReset && results.login;
  console.log(`\n${allPassed ? '✅ All tests passed!' : '❌ Some tests failed'}`);
  
  process.exit(allPassed ? 0 : 1);
}

// Run tests
runTests().catch((error) => {
  console.error('\n💥 Fatal error:', error);
  process.exit(1);
});

