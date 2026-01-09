/**
 * Test script for email templates in all locales
 * Run with: npx tsx scripts/test-email-templates.ts
 */

// Load environment variables first
import * as fs from 'fs'
import * as path from 'path'

// Load .env.local
const envPath = path.join(process.cwd(), '.env.local')
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8')
  envContent.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=')
    if (key && valueParts.length > 0) {
      const value = valueParts.join('=').replace(/^["']|["']$/g, '')
      if (!process.env[key]) {
        process.env[key] = value
      }
    }
  })
}

import { 
  sendWelcomeEmail, 
  sendPasswordResetEmail,
  sendOrderConfirmationEmail,
  sendOrderStatusUpdate,
  sendEmail,
  generateCODOrderHTML
} from '../lib/email'

const TEST_EMAIL = process.argv[2] || 'f.this.that@gmail.com'
const LOCALES = ['en', 'ru', 'ar'] as const

console.log(`\n📧 Testing email templates to: ${TEST_EMAIL}\n`)
console.log('='.repeat(50))

async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function testWelcomeEmails() {
  console.log('\n🎉 Testing WELCOME emails...\n')
  
  for (const locale of LOCALES) {
    try {
      const result = await sendWelcomeEmail(
        'Test User',
        TEST_EMAIL,
        'TestPassword123',
        locale
      )
      console.log(`  ✅ Welcome email (${locale}): ${result.success ? 'SENT' : 'FAILED'}`)
      await delay(1000) // Rate limiting
    } catch (error) {
      console.log(`  ❌ Welcome email (${locale}): ERROR - ${error}`)
    }
  }
}

async function testPasswordResetEmails() {
  console.log('\n🔐 Testing PASSWORD RESET emails...\n')
  
  for (const locale of LOCALES) {
    try {
      const result = await sendPasswordResetEmail(
        TEST_EMAIL,
        'Test User',
        'test-token-12345',
        locale
      )
      console.log(`  ✅ Password Reset email (${locale}): ${result.success ? 'SENT' : 'FAILED'}`)
      await delay(1000)
    } catch (error) {
      console.log(`  ❌ Password Reset email (${locale}): ERROR - ${error}`)
    }
  }
}

async function testOrderConfirmationEmails() {
  console.log('\n📦 Testing ORDER CONFIRMATION emails...\n')
  
  for (const locale of LOCALES) {
    try {
      const result = await sendOrderConfirmationEmail({
        orderNumber: `TEST-${locale.toUpperCase()}-001`,
        customerName: 'Test Customer',
        customerEmail: TEST_EMAIL,
        items: [
          {
            productName: 'GENOSYS SKIN CARING BLEMISH BALM CUSHION',
            quantity: 2,
            price: 150.00,
            image: 'https://genosys.ae/images/CUSHC.png',
            size: 'Medium',
            color: 'Beige'
          },
          {
            productName: 'GENOSYS MOISTURE REPLENISHING HYALURON SERUM',
            quantity: 1,
            price: 156.75,
            image: 'https://genosys.ae/images/HRS.jpg'
          }
        ],
        subtotal: 456.75,
        shipping: 0,
        vat: 22.84,
        total: 479.59,
        address: 'Dubai Marina, Building 123',
        emirate: 'Dubai',
        locale: locale
      })
      console.log(`  ✅ Order Confirmation email (${locale}): ${result.success ? 'SENT' : 'FAILED'}`)
      await delay(1000)
    } catch (error) {
      console.log(`  ❌ Order Confirmation email (${locale}): ERROR - ${error}`)
    }
  }
}

async function testCODEmails() {
  console.log('\n💵 Testing COD ORDER emails...\n')
  
  for (const locale of LOCALES) {
    try {
      const orderData = {
        orderNumber: `COD-${locale.toUpperCase()}-001`,
        customerName: 'Test Customer',
        customerEmail: TEST_EMAIL,
        customerPhone: '+971 50 123 4567',
        customerAddress: 'Dubai Marina, Building 123, Apt 456',
        emirate: 'Dubai',
        items: [
          {
            name: 'GENOSYS SKIN CARING BLEMISH BALM CUSHION',
            quantity: 2,
            price: 150.00,
            size: 'Medium',
            color: 'Beige'
          },
          {
            name: 'GENOSYS MOISTURE REPLENISHING HYALURON SERUM',
            quantity: 1,
            price: 156.75
          }
        ],
        subtotal: 456.75,
        shippingCost: 0,
        vatAmount: 22.84,
        total: 479.59
      }
      
      const html = generateCODOrderHTML(orderData, locale)
      const subject = locale === 'ru' 
        ? `Подтверждение заказа ${orderData.orderNumber}` 
        : locale === 'ar' 
        ? `تأكيد الطلب ${orderData.orderNumber}`
        : `Order Confirmation ${orderData.orderNumber}`
      
      const result = await sendEmail(TEST_EMAIL, subject, html)
      console.log(`  ✅ COD Order email (${locale}): ${result.success ? 'SENT' : 'FAILED'}`)
      await delay(1000)
    } catch (error) {
      console.log(`  ❌ COD Order email (${locale}): ERROR - ${error}`)
    }
  }
}

async function testOrderStatusEmails() {
  console.log('\n📊 Testing ORDER STATUS UPDATE emails...\n')
  
  const statuses = ['CONFIRMED', 'SHIPPED', 'DELIVERED'] as const
  
  for (const locale of LOCALES) {
    for (const status of statuses) {
      try {
        const result = await sendOrderStatusUpdate({
          orderNumber: `STATUS-${locale.toUpperCase()}-001`,
          customerName: 'Test Customer',
          customerEmail: TEST_EMAIL,
          items: [
            {
              productName: 'GENOSYS Test Product',
              quantity: 1,
              price: 150.00,
              image: 'https://genosys.ae/images/CUSHC.png'
            }
          ],
          total: 150.00,
          locale: locale
        }, status)
        console.log(`  ✅ Order Status (${locale} - ${status}): ${result.success ? 'SENT' : 'FAILED'}`)
        await delay(1000)
      } catch (error) {
        console.log(`  ❌ Order Status (${locale} - ${status}): ERROR - ${error}`)
      }
    }
  }
}

async function runAllTests() {
  try {
    await testWelcomeEmails()
    await testPasswordResetEmails()
    await testOrderConfirmationEmails()
    await testCODEmails()
    await testOrderStatusEmails()
    
    console.log('\n' + '='.repeat(50))
    console.log('✅ All email tests completed!')
    console.log(`📬 Check ${TEST_EMAIL} for all test emails\n`)
    
  } catch (error) {
    console.error('\n❌ Test suite failed:', error)
    process.exit(1)
  }
}

runAllTests()
