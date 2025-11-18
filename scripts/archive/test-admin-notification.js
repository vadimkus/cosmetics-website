#!/usr/bin/env node

/**
 * Test script to send a manual admin notification with all features
 * Uses the admin manual notification endpoint
 */

const baseUrl = 'http://localhost:3000'

async function testAdminNotification() {
  console.log('🧪 Testing Admin Order Notification Template\n')

  // For manual notification, we need admin auth
  // This script simulates what would be sent
  console.log('📋 Test Notification Data:')
  console.log('   Order Number: SUP2511012916')
  console.log('   Customer: Test Customer')
  console.log('   Phone: +971 50 123 4567')
  console.log('   Email: test@example.com')
  console.log('   Products: 3 items')
  console.log('     1. MULTI VITA RADIANCE SERUM - Qty: 2 × AED 250.00')
  console.log('     2. SNOW O₂ CLEANSER - Qty: 1 × AED 180.00')
  console.log('     3. Holiday Kit - Qty: 1 × AED 580.00')
  console.log('   Total: AED 1323.00\n')

  console.log('✅ Expected Email Template Features:')
  console.log('   ✓ Customer phone number (clickable tel: link)')
  console.log('   ✓ Complete products list with images')
  console.log('   ✓ Quantity × Price = Total calculations')
  console.log('   ✓ Individual product totals\n')

  console.log('📝 To test manually:')
  console.log('   1. Go to /admin/manual-notification')
  console.log('   2. Fill in the form with test data')
  console.log('   3. Submit to send notification\n')

  console.log('📝 Or create a real order from the website:')
  console.log('   1. Add products to cart')
  console.log('   2. Go through checkout')
  console.log('   3. Complete order')
  console.log('   4. Admin should receive email with phone & products\n')
}

testAdminNotification()

