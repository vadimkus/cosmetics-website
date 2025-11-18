#!/usr/bin/env node

/**
 * Test Order Creation - Both Options
 * Tests Support Link and COD order creation
 */

const baseUrl = process.env.TEST_URL || 'http://localhost:3000'

// Simple cookie store for Node.js fetch
const cookies = new Map()

async function getCsrfToken() {
  try {
    const response = await fetch(`${baseUrl}/api/csrf-token`, {
      headers: {
        'Cookie': Array.from(cookies.entries()).map(([name, value]) => `${name}=${value}`).join('; ')
      }
    })
    
    // Extract cookies from response
    const setCookie = response.headers.get('set-cookie')
    if (setCookie) {
      const tokenMatch = setCookie.match(/csrf-token=([^;]+)/)
      if (tokenMatch && tokenMatch[1]) {
        cookies.set('csrf-token', tokenMatch[1])
      }
    }
    
    const data = await response.json()
    return data.token || cookies.get('csrf-token')
  } catch (error) {
    console.error('Failed to get CSRF token:', error.message)
    return null
  }
}

async function testSupportLinkOrder() {
  const csrfToken = await getCsrfToken()
  if (!csrfToken) {
    console.error('❌ Failed to get CSRF token')
    return false
  }

  const orderNumber = `SUP${Date.now().toString().slice(-10)}`
  const orderData = {
    customerName: 'Test Customer Support Link',
    customerEmail: 'test-support@example.com',
    customerPhone: '+971 50 123 4567',
    customerAddress: '123 Test Street, Test Area',
    emirate: 'Dubai',
    items: [
      { id: '1', name: 'Test Product 1', quantity: 2, price: 250.00, total: 500.00, image: '/images/test1.jpg' },
      { id: '2', name: 'Test Product 2', quantity: 1, price: 180.00, total: 180.00, image: '/images/test2.jpg' }
    ],
    subtotal: 680.00,
    shippingCost: 0.00,
    vatAmount: 34.00,
    total: 714.00,
    orderNumber
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
      console.log(`✅ Support Link Order Created!`)
      console.log(`   Order Number: ${orderNumber}`)
      console.log(`   Order ID: ${data.orderId}`)
      console.log(`   Admin Notification: ${data.adminNotificationSent ? 'Sent' : 'Failed'}`)
      console.log(`   Time: ${elapsed}ms`)
      return true
    } else {
      console.log(`❌ Support Link Order Failed: ${data.error || 'Unknown error'}`)
      console.log(`   Status: ${response.status}`)
      console.log(`   Time: ${elapsed}ms`)
      return false
    }
  } catch (error) {
    console.error(`❌ Support Link Order Error: ${error.message}`)
    return false
  }
}

async function testCODOrder() {
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
      { id: '3', name: 'COD Test Product 1', quantity: 1, price: 580.00, image: '/images/cod1.jpg' },
      { id: '4', name: 'COD Test Product 2', quantity: 2, price: 120.00, image: '/images/cod2.jpg' }
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
      console.log(`✅ COD Order Created!`)
      console.log(`   Order Number: ${orderNumber}`)
      console.log(`   Order ID: ${data.orderId}`)
      console.log(`   Admin Notification: ${data.adminNotificationSent ? 'Sent' : 'Failed'}`)
      console.log(`   Time: ${elapsed}ms`)
      return true
    } else {
      console.log(`❌ COD Order Failed: ${data.error || 'Unknown error'}`)
      console.log(`   Status: ${response.status}`)
      console.log(`   Time: ${elapsed}ms`)
      return false
    }
  } catch (error) {
    console.error(`❌ COD Order Error: ${error.message}`)
    return false
  }
}

async function runTests() {
  console.log('\n🧪 Testing Order Creation - Both Options\n')
  console.log('='.repeat(60))

  // Test 1: Support Link Order
  console.log('\n📝 Test 1: Support Link Order Creation')
  const supportLinkSuccess = await testSupportLinkOrder()

  // Test 2: COD Order
  console.log('\n📝 Test 2: COD (Cash on Delivery) Order Creation')
  const codSuccess = await testCODOrder()

  // Summary
  console.log('\n' + '='.repeat(60))
  console.log('\n📊 Test Results Summary\n')
  console.log(`Support Link Order: ${supportLinkSuccess ? '✅ PASSED' : '❌ FAILED'}`)
  console.log(`COD Order: ${codSuccess ? '✅ PASSED' : '❌ FAILED'}`)
  
  if (supportLinkSuccess && codSuccess) {
    console.log('\n🎉 All order creation tests passed!')
    process.exit(0)
  } else {
    console.log('\n⚠️  Some tests failed. Please review the results above.')
    process.exit(1)
  }
}

runTests().catch(error => {
  console.error('\n❌ Fatal error:', error.message)
  console.error(error)
  process.exit(1)
})

