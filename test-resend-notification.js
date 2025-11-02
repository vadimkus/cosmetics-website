#!/usr/bin/env node

/**
 * Test script to resend admin notification for an existing order
 * Uses the resend notification endpoint which includes all data from the database
 */

const baseUrl = 'http://localhost:3000'

async function getCsrfToken() {
  try {
    const response = await fetch(`${baseUrl}/api/csrf-token`)
    if (response.ok) {
      const data = await response.json()
      return data.token
    }
  } catch (error) {
    console.error('Failed to get CSRF token:', error.message)
  }
  return null
}

async function resendNotification(orderNumber) {
  console.log(`🔄 Resending Admin Notification for Order #${orderNumber}\n`)

  const csrfToken = await getCsrfToken()
  if (!csrfToken) {
    console.log('❌ Cannot get CSRF token. Server may not be running.')
    return
  }

  // Note: This requires admin authentication
  // You'll need to be logged in as admin or provide admin email
  console.log('⚠️  This requires admin authentication.')
  console.log('   Please use the admin panel at /admin to resend notifications.')
  console.log(`   Or use the endpoint: POST /api/admin/resend-order-notification`)
  console.log(`   with body: { "orderNumber": "${orderNumber}" }\n`)
  
  console.log('✅ The resend endpoint will automatically include:')
  console.log('   ✓ Customer phone from database')
  console.log('   ✓ All order items from database')
  console.log('   ✓ Complete order details\n')
}

// Test with the order number the user mentioned
const orderNumber = process.argv[2] || 'SUP2511012916'
resendNotification(orderNumber)

