#!/usr/bin/env node

/**
 * Test script for order creation (COD and Support-Link) and user registration
 * Run with: node test-orders-and-user.js
 */

const baseUrl = process.env.TEST_URL || 'http://localhost:3000'
const cookies = new Map()

async function getCsrfToken() {
  try {
    const response = await fetch(`${baseUrl}/api/csrf-token`, {
      method: 'GET',
      credentials: 'include'
    })
    
    if (!response.ok) {
      console.error('❌ Failed to get CSRF token:', response.status)
      return null
    }

    // Extract cookies from response
    const setCookieHeaders = response.headers.getSetCookie?.() || []
    setCookieHeaders.forEach(cookie => {
      const [nameValue] = cookie.split(';')
      const [name, value] = nameValue.split('=')
      if (name && value) {
        cookies.set(name.trim(), value.trim())
      }
    })

    const data = await response.json()
    return data.token
  } catch (error) {
    console.error('❌ Error getting CSRF token:', error.message)
    return null
  }
}

async function testUserRegistration() {
  console.log('\n📝 Testing User Registration...')
  
  const csrfToken = await getCsrfToken()
  if (!csrfToken) {
    console.error('❌ Failed to get CSRF token')
    return false
  }

  const timestamp = Date.now()
  const testEmail = `test-user-${timestamp}@example.com`
  const userData = {
    name: `Test User ${timestamp}`,
    email: testEmail,
    password: 'testpass123',
    phone: '+971 50 123 4567',
    address: '123 Test Street, Test Area',
    emirate: 'Dubai'
  }

  try {
    const startTime = Date.now()
    const response = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken,
        'Cookie': Array.from(cookies.entries()).map(([name, value]) => `${name}=${value}`).join('; ')
      },
      body: JSON.stringify({
        ...userData,
        csrfToken
      })
    })

    const data = await response.json()
    const elapsed = Date.now() - startTime

    if (response.ok && data.success) {
      console.log(`✅ User Registration Successful!`)
      console.log(`   Email: ${testEmail}`)
      console.log(`   User ID: ${data.userId || 'N/A'}`)
      console.log(`   Welcome Email: ${data.welcomeEmailSent ? 'Sent' : 'Failed'}`)
      console.log(`   Admin Notification: ${data.adminNotificationSent ? 'Sent' : 'Failed'}`)
      console.log(`   Time: ${elapsed}ms`)
      return true
    } else {
      console.log(`❌ User Registration Failed: ${data.error || 'Unknown error'}`)
      console.log(`   Status: ${response.status}`)
      console.log(`   Response:`, JSON.stringify(data, null, 2))
      console.log(`   Time: ${elapsed}ms`)
      return false
    }
  } catch (error) {
    console.error(`❌ User Registration Error: ${error.message}`)
    return false
  }
}

async function testCODOrder() {
  console.log('\n💰 Testing COD Order Creation...')
  
  const csrfToken = await getCsrfToken()
  if (!csrfToken) {
    console.error('❌ Failed to get CSRF token')
    return false
  }

  const orderNumber = `COD${Date.now().toString().slice(-10)}`
  const orderData = {
    orderNumber,
    customerName: 'Test Customer COD',
    customerEmail: 'test-cod@example.com',
    customerPhone: '+971 50 987 6543',
    customerAddress: '456 COD Street, Test Area',
    emirate: 'Abu Dhabi',
    items: [
      { 
        id: '1', 
        name: 'Test Product 1', 
        quantity: 1, 
        price: 580.00, 
        image: '/images/test1.jpg',
        size: '50g',
        color: 'Beige'
      },
      { 
        id: '2', 
        name: 'Test Product 2', 
        quantity: 2, 
        price: 120.00, 
        image: '/images/test2.jpg',
        size: '30ml'
      }
    ],
    subtotal: 820.00,
    shippingCost: 50.00,
    vatAmount: 43.50,
    total: 913.50
  }

  try {
    const startTime = Date.now()
    const response = await fetch(`${baseUrl}/api/orders/cod-confirmation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken,
        'Cookie': Array.from(cookies.entries()).map(([name, value]) => `${name}=${value}`).join('; ')
      },
      body: JSON.stringify({
        ...orderData,
        csrfToken
      })
    })

    const data = await response.json()
    const elapsed = Date.now() - startTime

    if (response.ok && data.success) {
      console.log(`✅ COD Order Created Successfully!`)
      console.log(`   Order Number: ${orderNumber}`)
      console.log(`   Order ID: ${data.orderId || 'N/A'}`)
      console.log(`   Confirmation Email: ${data.confirmationEmailSent ? 'Sent' : 'Failed'}`)
      console.log(`   Admin Notification: ${data.adminNotificationSent ? 'Sent' : 'Failed'}`)
      console.log(`   Time: ${elapsed}ms`)
      return true
    } else {
      console.log(`❌ COD Order Failed: ${data.error || 'Unknown error'}`)
      console.log(`   Status: ${response.status}`)
      console.log(`   Response:`, JSON.stringify(data, null, 2))
      console.log(`   Time: ${elapsed}ms`)
      return false
    }
  } catch (error) {
    console.error(`❌ COD Order Error: ${error.message}`)
    return false
  }
}

async function testSupportLinkOrder() {
  console.log('\n🔗 Testing Support-Link Order Creation...')
  
  const csrfToken = await getCsrfToken()
  if (!csrfToken) {
    console.error('❌ Failed to get CSRF token')
    return false
  }

  const orderNumber = `SL${Date.now().toString().slice(-10)}`
  const orderData = {
    orderNumber,
    customerName: 'Test Customer Support Link',
    customerEmail: 'test-support@example.com',
    customerPhone: '+971 50 111 2222',
    customerAddress: '789 Support Street, Test Area',
    emirate: 'Dubai',
    items: [
      { 
        id: '3', 
        name: 'Support Link Product 1', 
        quantity: 1, 
        price: 350.00, 
        image: '/images/support1.jpg',
        size: '50g'
      },
      { 
        id: '4', 
        name: 'Support Link Product 2', 
        quantity: 3, 
        price: 150.00, 
        image: '/images/support2.jpg',
        color: 'Ivory'
      }
    ],
    subtotal: 800.00,
    shippingCost: 0.00,
    vatAmount: 40.00,
    total: 840.00
  }

  try {
    const startTime = Date.now()
    const response = await fetch(`${baseUrl}/api/orders/support-link`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken,
        'Cookie': Array.from(cookies.entries()).map(([name, value]) => `${name}=${value}`).join('; ')
      },
      body: JSON.stringify({
        ...orderData,
        csrfToken
      })
    })

    const data = await response.json()
    const elapsed = Date.now() - startTime

    if (response.ok && data.success) {
      console.log(`✅ Support-Link Order Created Successfully!`)
      console.log(`   Order Number: ${orderNumber}`)
      console.log(`   Order ID: ${data.orderId || 'N/A'}`)
      console.log(`   Confirmation Email: ${data.confirmationEmailSent ? 'Sent' : 'Failed'}`)
      console.log(`   Admin Notification: ${data.adminNotificationSent ? 'Sent' : 'Failed'}`)
      console.log(`   Time: ${elapsed}ms`)
      return true
    } else {
      console.log(`❌ Support-Link Order Failed: ${data.error || 'Unknown error'}`)
      console.log(`   Status: ${response.status}`)
      console.log(`   Response:`, JSON.stringify(data, null, 2))
      console.log(`   Time: ${elapsed}ms`)
      return false
    }
  } catch (error) {
    console.error(`❌ Support-Link Order Error: ${error.message}`)
    return false
  }
}

async function runTests() {
  console.log('\n🧪 Testing Order Creation & User Registration\n')
  console.log(`📍 Testing against: ${baseUrl}\n`)

  const results = {
    userRegistration: false,
    codOrder: false,
    supportLinkOrder: false
  }

  // Test User Registration
  results.userRegistration = await testUserRegistration()

  // Test COD Order
  results.codOrder = await testCODOrder()

  // Test Support-Link Order
  results.supportLinkOrder = await testSupportLinkOrder()

  // Summary
  console.log('\n' + '='.repeat(60))
  console.log('📊 Test Summary')
  console.log('='.repeat(60))
  console.log(`User Registration:     ${results.userRegistration ? '✅ PASSED' : '❌ FAILED'}`)
  console.log(`COD Order:            ${results.codOrder ? '✅ PASSED' : '❌ FAILED'}`)
  console.log(`Support-Link Order:  ${results.supportLinkOrder ? '✅ PASSED' : '❌ FAILED'}`)
  console.log('='.repeat(60))
  
  const allPassed = results.userRegistration && results.codOrder && results.supportLinkOrder
  console.log(`\nOverall: ${allPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}\n`)

  process.exit(allPassed ? 0 : 1)
}

// Run tests
runTests().catch(error => {
  console.error('❌ Test execution error:', error)
  process.exit(1)
})

