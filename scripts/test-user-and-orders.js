/**
 * Test script for user creation and order creation
 * Run with: node scripts/test-user-and-orders.js
 * Or with custom URL: TEST_URL=https://genosys.ae node scripts/test-user-and-orders.js
 */

const https = require('https');
const http = require('http');

// Configuration
const BASE_URL = process.env.TEST_URL || 'http://localhost:3000';
const TEST_EMAIL = `test-${Date.now()}@test.com`;
const TEST_PASSWORD = 'TestPassword123!';
const TEST_NAME = 'Test User';
const TEST_PHONE = '+971501234567';
const TEST_ADDRESS = '123 Test Street, Jumeirah';
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
        'Cookie': cookies,
        ...options.headers
      }
    };

    if (options.body) {
      const bodyString = JSON.stringify(options.body);
      requestOptions.headers['Content-Length'] = Buffer.byteLength(bodyString);
    }

    const req = client.request(requestOptions, (res) => {
      let data = '';
      
      // Parse cookies from response
      if (res.headers['set-cookie']) {
        parseCookies(res.headers['set-cookie']);
      }

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        let parsedData;
        try {
          parsedData = JSON.parse(data);
        } catch (e) {
          parsedData = data;
        }

        resolve({
          status: res.statusCode,
          headers: res.headers,
          data: parsedData
        });
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
    console.error('Error getting CSRF token:', error.message);
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
      console.log('   User ID:', response.data.user?.id || 'N/A');
      return { success: true, user: response.data.user };
    } else {
      console.log('   ❌ User creation failed');
      console.log('   Status:', response.status);
      console.log('   Response:', JSON.stringify(response.data, null, 2));
      return { success: false, error: response.data };
    }
  } catch (error) {
    console.error('   ❌ Error creating user:', error.message);
    return { success: false, error: error.message };
  }
}

// Get products for order
async function getProducts() {
  try {
    const response = await makeRequest(`${BASE_URL}/api/products`);
    if (response.status === 200 && Array.isArray(response.data)) {
      return response.data.filter(p => p.inStock).slice(0, 3); // Get first 3 available products
    }
    throw new Error('Failed to get products');
  } catch (error) {
    console.error('Error getting products:', error.message);
    throw error;
  }
}

// Test 2: Create first order
async function testOrderCreation(orderNumber) {
  console.log(`\n🧪 Test ${orderNumber}: Creating order...`);
  
  try {
    const csrfToken = await getCsrfToken();
    console.log('   ✓ CSRF token obtained');

    // Get products
    const products = await getProducts();
    if (products.length < 2) {
      throw new Error('Not enough products available for order');
    }
    console.log(`   ✓ Found ${products.length} products`);

    // Create order items (use first 2 products)
    const items = products.slice(0, 2).map(product => ({
      product: {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image
      },
      quantity: orderNumber === 2 ? 1 : 2, // Order 1: 2 items each, Order 2: 1 item each
      selectedColor: null,
      selectedSize: null
    }));

    console.log(`   Order items: ${items.map(i => `${i.quantity}x ${i.product.name}`).join(', ')}`);

    const response = await makeRequest(`${BASE_URL}/api/checkout`, {
      method: 'POST',
      headers: {
        'X-CSRF-Token': csrfToken
      },
      body: {
        items: items,
        customerEmail: TEST_EMAIL,
        customerName: TEST_NAME,
        customerPhone: TEST_PHONE,
        customerEmirate: TEST_EMIRATE,
        customerAddress: TEST_ADDRESS,
        csrfToken: csrfToken
      }
    });

    if (response.status === 200 || response.status === 201) {
      console.log('   ✅ Order created successfully!');
      console.log('   Response:', JSON.stringify(response.data, null, 2));
      const orderId = response.data.orderId || response.data.order?.orderNumber || response.data.orderNumber;
      console.log('   Order ID:', orderId || 'N/A');
      console.log('   Message:', response.data.message || 'N/A');
      return { success: true, orderId: orderId, data: response.data };
    } else {
      console.log('   ❌ Order creation failed');
      console.log('   Status:', response.status);
      console.log('   Response:', JSON.stringify(response.data, null, 2));
      return { success: false, error: response.data };
    }
  } catch (error) {
    console.error('   ❌ Error creating order:', error.message);
    return { success: false, error: error.message };
  }
}

// Run all tests
async function runTests() {
  console.log('🚀 Starting User Creation and Order Creation Tests');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`📍 Testing against: ${BASE_URL}`);
  console.log(`📧 Test email: ${TEST_EMAIL}`);
  console.log(`📞 Test phone: ${TEST_PHONE}`);
  console.log(`📍 Test address: ${TEST_ADDRESS}, ${TEST_EMIRATE}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  const results = {
    userCreation: false,
    order1: false,
    order2: false
  };

  // Test 1: Create user
  const userResult = await testUserCreation();
  results.userCreation = userResult.success;
  
  if (!results.userCreation) {
    console.log('\n⚠️  Skipping order tests (user creation failed)');
    console.log('   Error:', userResult.error);
  } else {
    // Test 2: Create first order
    const order1Result = await testOrderCreation(2);
    results.order1 = order1Result.success;

    // Test 3: Create second order
    const order2Result = await testOrderCreation(3);
    results.order2 = order2Result.success;
  }

  // Summary
  console.log('\n📊 Test Results Summary:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`   User Creation:     ${results.userCreation ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`   Order 1 Creation:   ${results.order1 ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`   Order 2 Creation:   ${results.order2 ? '✅ PASS' : '❌ FAIL'}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  const allPassed = results.userCreation && results.order1 && results.order2;
  console.log(`\n${allPassed ? '✅ All tests passed!' : '❌ Some tests failed'}`);
  
  if (allPassed) {
    console.log(`\n📋 Test Summary:`);
    console.log(`   User: ${TEST_EMAIL}`);
    console.log(`   Created 2 orders successfully`);
  }
  
  process.exit(allPassed ? 0 : 1);
}

// Run tests
runTests().catch((error) => {
  console.error('\n💥 Fatal error:', error);
  process.exit(1);
});

