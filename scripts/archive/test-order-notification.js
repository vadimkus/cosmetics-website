#!/usr/bin/env node

/**
 * Test script to generate a test order and verify admin notification
 */

const baseUrl = 'http://localhost:3000'

async function getCsrfToken() {
  try {
    // Create a simple cookie store for Node.js fetch
    const cookies = new Map()
    
    const response = await fetch(`${baseUrl}/api/csrf-token`, {
      credentials: 'include',
      headers: {
        'Cookie': Array.from(cookies.entries()).map(([name, value]) => `${name}=${value}`).join('; ')
      }
    })
    
    if (response.ok) {
      // Extract cookie from response headers
      const setCookie = response.headers.get('set-cookie')
      if (setCookie) {
        const tokenMatch = setCookie.match(/csrf-token=([^;]+)/)
        if (tokenMatch && tokenMatch[1]) {
          cookies.set('csrf-token', tokenMatch[1])
        }
      }
      
      const data = await response.json()
      const token = data.token || (setCookie ? setCookie.match(/csrf-token=([^;]+)/)?.[1] : null)
      
      return { token, cookies }
    }
  } catch (error) {
    console.error('Failed to get CSRF token:', error.message)
  }
  return { token: null, cookies: new Map() }
}

async function generateTestOrder() {
  console.log('🧪 Generating Test Order for Admin Notification\n')

  const { token: csrfToken, cookies } = await getCsrfToken()
  if (!csrfToken) {
    console.log('❌ Cannot get CSRF token. Server may not be running.')
    console.log('   Please start the server: npm run dev\n')
    return
  }

  console.log('✅ CSRF token obtained\n')
  
  // Build cookie string for requests
  const cookieString = Array.from(cookies.entries())
    .map(([name, value]) => `${name}=${value}`)
    .join('; ')

  // Generate unique order number
  const timestamp = Date.now()
  const orderNumber = `SUP${timestamp.toString().slice(-12)}`

  // Test order data with multiple products
  const testOrder = {
    orderNumber: orderNumber,
    customerName: 'Test Customer',
    customerEmail: 'test@example.com',
    customerPhone: '+971 50 123 4567',
    customerAddress: '123 Test Street, Dubai',
    emirate: 'Dubai',
    items: [
      {
        id: '1',
        name: 'MULTI VITA RADIANCE SERUM',
        price: 250.00,
        quantity: 2,
        image: '/images/products/serum.jpg'
      },
      {
        id: '2',
        name: 'SNOW O₂ CLEANSER',
        price: 180.00,
        quantity: 1,
        image: '/images/products/cleanser.jpg'
      },
      {
        id: '3',
        name: 'Holiday Kit',
        price: 580.00,
        quantity: 1,
        image: '/images/Hol_kit.jpg'
      }
    ],
    subtotal: 1260.00,
    shippingCost: 0,
    vatAmount: 63.00,
    total: 1323.00
  }

  console.log('📦 Test Order Details:')
  console.log(`   Order Number: ${orderNumber}`)
  console.log(`   Customer: ${testOrder.customerName}`)
  console.log(`   Phone: ${testOrder.customerPhone}`)
  console.log(`   Email: ${testOrder.customerEmail}`)
  console.log(`   Items: ${testOrder.items.length} products`)
  testOrder.items.forEach((item, i) => {
    console.log(`     ${i + 1}. ${item.name} - Qty: ${item.quantity} × AED ${item.price.toFixed(2)}`)
  })
  console.log(`   Total: AED ${testOrder.total.toFixed(2)}\n`)

  try {
    console.log('📤 Sending test order to /api/orders/support-link...\n')

    const response = await fetch(`${baseUrl}/api/orders/support-link`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken,
        'Cookie': cookieString,
      },
      body: JSON.stringify({
        ...testOrder,
        csrfToken: csrfToken,
      }),
    })

    const data = await response.json()

    if (response.ok) {
      console.log('✅ Test Order Created Successfully!')
      console.log(`   Order Number: ${orderNumber}`)
      console.log(`   Status: ${response.status}\n`)
      console.log('📧 Admin notification should have been sent with:')
      console.log('   ✓ Customer phone number')
      console.log('   ✓ Complete products list with images')
      console.log('   ✓ Quantity × Price calculations\n')
      console.log('📬 Please check the admin email inbox to verify the notification.\n')
    } else {
      console.log('❌ Failed to create test order')
      console.log(`   Status: ${response.status}`)
      console.log(`   Error: ${data.error || JSON.stringify(data)}\n`)
    }
  } catch (error) {
    console.error('❌ Error creating test order:', error.message)
    console.log('\n   Make sure the server is running: npm run dev\n')
  }
}

// Check if server is running
fetch(`${baseUrl}/api/health`)
  .then(() => {
    generateTestOrder()
  })
  .catch(() => {
    console.log('⚠️  Server not running on port 3000')
    console.log('   Please start the server: npm run dev\n')
    process.exit(1)
  })

