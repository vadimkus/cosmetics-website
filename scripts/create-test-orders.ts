#!/usr/bin/env tsx
/**
 * Script to create test orders (SUP and COD) to verify notifications
 * Usage: npx tsx scripts/create-test-orders.ts
 */

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

// Get CSRF token from server
async function getCsrfToken(): Promise<{ token: string; cookie: string } | null> {
  try {
    const response = await fetch(`${BASE_URL}/api/csrf-token`, {
      method: 'GET',
      credentials: 'include'
    })

    if (!response.ok) {
      console.error(`❌ Failed to get CSRF token: ${response.status}`)
      return null
    }

    const data = await response.json()
    const setCookieHeader = response.headers.get('set-cookie')
    
    // Extract cookie value from Set-Cookie header
    let cookieValue = ''
    if (setCookieHeader) {
      const match = setCookieHeader.match(/csrf-token=([^;]+)/)
      if (match) {
        cookieValue = match[1]
      }
    }

    return {
      token: data.token,
      cookie: cookieValue || data.token
    }
  } catch {
    console.error('❌ Exception getting CSRF token:', error)
    return null
  }
}

// Create a test order
async function createTestOrder(
  type: 'SUP' | 'COD',
  csrfToken: string,
  csrfCookie: string
): Promise<void> {
  const timestamp = Date.now()
  const orderNumber = `TEST-${type}-${timestamp}`

  const orderData = {
    orderNumber,
    customerName: `Test Customer ${type}`,
    customerEmail: 'test@example.com',
    customerPhone: '+971 50 123 4567',
    customerAddress: '123 Test Street',
    emirate: 'Dubai',
    items: [
      {
        id: 'product-1',
        name: 'Test Product 1',
        price: 100.00,
        quantity: 2,
        image: '/images/default-product.jpg',
        size: '50ml',
        color: 'White'
      },
      {
        id: 'product-2',
        name: 'Test Product 2',
        price: 150.00,
        quantity: 1,
        image: '/images/default-product.jpg',
        size: '100ml',
        color: 'Blue'
      }
    ],
    subtotal: 350.00,
    shippingCost: 20.00,
    vatAmount: 17.50,
    total: 387.50,
    locale: 'en'
  }

  const endpoint = type === 'SUP' 
    ? '/api/orders/support-link'
    : '/api/orders/cod-confirmation'

  console.log(`\n📦 Creating ${type} test order: ${orderNumber}`)
  console.log(`   Endpoint: ${endpoint}`)
  console.log(`   Customer: ${orderData.customerName} (${orderData.customerEmail})`)
  console.log(`   Total: AED ${orderData.total}`)

  try {
    // Use the cookie value from CSRF token response
    const cookieString = `csrf-token=${csrfCookie}`

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken,
        'Cookie': cookieString,
        'User-Agent': 'Test-Script/1.0'
      },
      body: JSON.stringify({
        ...orderData,
        csrfToken // Also include in body as fallback
      })
    })

    const result = await response.json()

    if (response.ok && result.success) {
      console.log(`✅ ${type} order created successfully!`)
      console.log(`   Order ID: ${result.orderId}`)
      console.log(`   Order Number: ${result.orderNumber}`)
      console.log(`   Message: ${result.message}`)
    } else {
      console.error(`❌ Failed to create ${type} order`)
      console.error(`   Status: ${response.status}`)
      console.error(`   Error:`, result.error || result)
    }
  } catch {
    console.error(`❌ Exception creating ${type} order:`)
    console.error(`   Error:`, error instanceof Error ? error.message : String(error))
  }
}

async function main() {
  console.log('🚀 Creating test orders to verify notifications...')
  console.log(`📍 Base URL: ${BASE_URL}`)

  // Get CSRF token from server
  console.log('\n🔐 Getting CSRF token from server...')
  const csrfData = await getCsrfToken()
  
  if (!csrfData) {
    console.error('❌ Failed to get CSRF token. Cannot create test orders.')
    process.exit(1)
  }

  console.log(`✅ CSRF Token received: ${csrfData.token.substring(0, 16)}...`)

  // Create SUP order
  await createTestOrder('SUP', csrfData.token, csrfData.cookie)

  // Wait a bit between orders
  await new Promise(resolve => setTimeout(resolve, 2000))

  // Get a fresh CSRF token for the second order (some servers require this)
  const csrfData2 = await getCsrfToken()
  if (csrfData2) {
    await createTestOrder('COD', csrfData2.token, csrfData2.cookie)
  } else {
    // Fallback to using the same token
    await createTestOrder('COD', csrfData.token, csrfData.cookie)
  }

  console.log('\n✅ Test orders creation completed!')
  console.log('📧 Check your email for admin notifications')
  console.log('📊 Check server logs for detailed notification status')
}

main().catch(console.error)
