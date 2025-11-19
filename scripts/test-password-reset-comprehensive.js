/**
 * Comprehensive Password Reset Test
 * Tests the complete password reset flow
 * Run with: node scripts/test-password-reset-comprehensive.js
 */

const https = require('https');
const http = require('http');

// Configuration
const BASE_URL = process.env.TEST_URL || 'https://genosys.ae';
const TEST_EMAIL = `test-reset-${Date.now()}@test.com`;
const TEST_PASSWORD = 'OriginalPassword123!';
const NEW_PASSWORD = 'NewPassword456!';
const TEST_NAME = 'Password Reset Test User';
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

// Test 1: Create test user
async function createTestUser() {
  console.log('\n📝 Test 1: Creating test user...');
  console.log(`   Email: ${TEST_EMAIL}`);
  
  try {
    const csrfToken = await getCsrfToken();
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
      console.log('   ✅ User created successfully');
      return true;
    } else {
      console.log('   ❌ User creation failed');
      console.log('   Status:', response.status);
      console.log('   Response:', JSON.stringify(response.data, null, 2));
      return false;
    }
  } catch (error) {
    console.error('   ❌ Error:', error.message);
    return false;
  }
}

// Test 2: Verify login with original password
async function testLoginWithOriginalPassword() {
  console.log('\n🔐 Test 2: Testing login with original password...');
  
  try {
    const csrfToken = await getCsrfToken();
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
      console.log('   ✅ Login successful with original password');
      return true;
    } else {
      console.log('   ❌ Login failed');
      console.log('   Status:', response.status);
      console.log('   Response:', JSON.stringify(response.data, null, 2));
      return false;
    }
  } catch (error) {
    console.error('   ❌ Error:', error.message);
    return false;
  }
}

// Test 3: Request password reset
async function requestPasswordReset() {
  console.log('\n📧 Test 3: Requesting password reset...');
  
  try {
    const csrfToken = await getCsrfToken();
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
      console.log('   ✅ Password reset request successful');
      console.log('   Message:', response.data.message);
      return true;
    } else {
      console.log('   ❌ Password reset request failed');
      console.log('   Status:', response.status);
      console.log('   Response:', JSON.stringify(response.data, null, 2));
      return false;
    }
  } catch (error) {
    console.error('   ❌ Error:', error.message);
    return false;
  }
}

// Test 4: Check password reset table health
async function checkPasswordResetTable() {
  console.log('\n🏥 Test 4: Checking password reset table health...');
  
  try {
    const response = await makeRequest(`${BASE_URL}/api/health/password-reset-table`);

    if (response.status === 200) {
      console.log('   ✅ Password reset table is ready');
      console.log('   Table exists:', response.data.tableExists);
      console.log('   Token count:', response.data.tokenCount);
      return true;
    } else {
      console.log('   ⚠️  Password reset table check failed');
      console.log('   Status:', response.status);
      console.log('   Response:', JSON.stringify(response.data, null, 2));
      return false;
    }
  } catch (error) {
    console.error('   ❌ Error:', error.message);
    return false;
  }
}

// Test 5: Verify login fails with old password after reset (simulated)
async function testLoginFailsWithOldPassword() {
  console.log('\n🚫 Test 5: Verifying old password no longer works (after reset)...');
  console.log('   Note: This test assumes password was reset. If not, this will fail.');
  
  try {
    const csrfToken = await getCsrfToken();
    const response = await makeRequest(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'X-CSRF-Token': csrfToken
      },
      body: {
        email: TEST_EMAIL,
        password: TEST_PASSWORD, // Old password
        csrfToken: csrfToken
      }
    });

    if (response.status === 401) {
      console.log('   ✅ Old password correctly rejected (401)');
      return true;
    } else if (response.status === 200) {
      console.log('   ⚠️  Old password still works (password may not have been reset)');
      return false;
    } else {
      console.log('   ⚠️  Unexpected status:', response.status);
      return false;
    }
  } catch (error) {
    console.error('   ❌ Error:', error.message);
    return false;
  }
}

// Test 6: Test login with new password (simulated)
async function testLoginWithNewPassword() {
  console.log('\n✅ Test 6: Testing login with new password (after reset)...');
  console.log('   Note: This test assumes password was reset. If not, this will fail.');
  
  try {
    const csrfToken = await getCsrfToken();
    const response = await makeRequest(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'X-CSRF-Token': csrfToken
      },
      body: {
        email: TEST_EMAIL,
        password: NEW_PASSWORD, // New password
        csrfToken: csrfToken
      }
    });

    if (response.status === 200) {
      console.log('   ✅ Login successful with new password');
      return true;
    } else {
      console.log('   ⚠️  Login failed (password may not have been reset yet)');
      console.log('   Status:', response.status);
      console.log('   Response:', JSON.stringify(response.data, null, 2));
      return false;
    }
  } catch (error) {
    console.error('   ❌ Error:', error.message);
    return false;
  }
}

// Run all tests
async function runTests() {
  console.log('🚀 Comprehensive Password Reset Test Suite');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`📍 Testing against: ${BASE_URL}`);
  console.log(`📧 Test email: ${TEST_EMAIL}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  const results = {
    userCreation: false,
    loginOriginal: false,
    passwordResetRequest: false,
    tableHealth: false,
    loginOldPassword: false,
    loginNewPassword: false
  };

  // Test 1: Create user
  results.userCreation = await createTestUser();
  
  if (results.userCreation) {
    // Test 2: Login with original password
    results.loginOriginal = await testLoginWithOriginalPassword();
    
    // Test 3: Request password reset
    results.passwordResetRequest = await requestPasswordReset();
    
    // Test 4: Check table health
    results.tableHealth = await checkPasswordResetTable();
    
    console.log('\n⏸️  Pausing for 2 seconds before testing password reset completion...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Test 5 & 6: These will fail if password wasn't actually reset via email link
    // They're here to verify the flow, but require manual password reset completion
    console.log('\n⚠️  Note: Tests 5 & 6 require manual password reset via email link');
    console.log('   To complete the full test:');
    console.log('   1. Check email for password reset link');
    console.log('   2. Click the link and reset password to:', NEW_PASSWORD);
    console.log('   3. Re-run this script or manually test login');
  }

  // Summary
  console.log('\n📊 Test Results Summary:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`   User Creation:           ${results.userCreation ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`   Login (Original):        ${results.loginOriginal ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`   Password Reset Request:   ${results.passwordResetRequest ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`   Table Health Check:       ${results.tableHealth ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`   Login (Old Password):     ${results.loginOldPassword ? '✅ PASS' : '⏭️  SKIP'}`);
  console.log(`   Login (New Password):     ${results.loginNewPassword ? '✅ PASS' : '⏭️  SKIP'}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  const criticalTests = results.userCreation && results.loginOriginal && results.passwordResetRequest && results.tableHealth;
  console.log(`\n${criticalTests ? '✅ Critical tests passed!' : '❌ Some critical tests failed'}`);
  console.log('\n💡 Next Steps:');
  console.log('   1. Check email inbox for password reset link');
  console.log('   2. Click the reset link');
  console.log('   3. Set new password');
  console.log('   4. Test login with new password');
  
  process.exit(criticalTests ? 0 : 1);
}

// Run tests
runTests().catch((error) => {
  console.error('\n💥 Fatal error:', error);
  process.exit(1);
});

