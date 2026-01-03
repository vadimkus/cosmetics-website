import { NextRequest, NextResponse } from 'next/server'
import { 
  emailTemplates, 
  sendEmail,
  generateCODOrderHTML,
  generateSupportLinkOrderHTML,
  generateStripePaymentConfirmationHTML,
  sendOrderStatusUpdate
} from '@/lib/email'

// Sample test data
const testCustomer = {
  name: 'John Doe',
  email: 'f.this.that@gmail.com',
  phone: '+971 58 548 76 65',
  address: 'Villa E02, Cordoba Residence',
  emirate: 'Dubai'
}

const testItems = [
  { 
    name: 'Micro Needle Therapy System', 
    productName: 'Micro Needle Therapy System',
    quantity: 1, 
    price: 450.00, 
    size: '50ml',
    image: '/images/MTS.png'
  },
  { 
    name: 'Blemish Balm Cream', 
    productName: 'Blemish Balm Cream',
    quantity: 2, 
    price: 250.00,
    image: '/images/BBcream.png'
  }
]

const testOrderNumber = 'GENTest2601' + Math.floor(Math.random() * 10000)

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()
    const targetEmail = email || testCustomer.email
    
    const results: Array<{ template: string; success: boolean; error?: string }> = []
    
    // 1. Welcome User
    console.log('📧 Sending Welcome User email...')
    const welcomeTemplate = emailTemplates.welcomeUser(testCustomer.name, targetEmail, 'TestPass123!')
    const welcomeResult = await sendEmail(targetEmail, welcomeTemplate.subject, welcomeTemplate.html)
    results.push({ template: 'Welcome User', success: welcomeResult.success, error: welcomeResult.error })
    await new Promise(resolve => setTimeout(resolve, 2000)) // Delay to avoid rate limiting
    
    // 2. Order Confirmed
    console.log('📧 Sending Order Confirmed email...')
    const confirmedTemplate = emailTemplates.orderConfirmed({
      orderNumber: testOrderNumber,
      customerName: testCustomer.name,
      customerEmail: targetEmail,
      total: 950.00
    })
    const confirmedResult = await sendEmail(targetEmail, confirmedTemplate.subject, confirmedTemplate.html)
    results.push({ template: 'Order Confirmed', success: confirmedResult.success, error: confirmedResult.error })
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // 3. Order Shipped
    console.log('📧 Sending Order Shipped email...')
    const shippedTemplate = emailTemplates.orderShipped({
      orderNumber: testOrderNumber,
      customerName: testCustomer.name,
      customerEmail: targetEmail,
      total: 950.00,
      customerAddress: testCustomer.address,
      customerEmirate: testCustomer.emirate
    })
    const shippedResult = await sendEmail(targetEmail, shippedTemplate.subject, shippedTemplate.html)
    results.push({ template: 'Order Shipped', success: shippedResult.success, error: shippedResult.error })
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // 4. Order Delivered
    console.log('📧 Sending Order Delivered email...')
    const deliveredTemplate = emailTemplates.orderDelivered({
      orderNumber: testOrderNumber,
      customerName: testCustomer.name,
      customerEmail: targetEmail,
      total: 950.00
    })
    const deliveredResult = await sendEmail(targetEmail, deliveredTemplate.subject, deliveredTemplate.html)
    results.push({ template: 'Order Delivered', success: deliveredResult.success, error: deliveredResult.error })
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // 5. Discount Assigned (VIP)
    console.log('📧 Sending Discount Assigned email...')
    const discountTemplate = emailTemplates.discountAssigned({
      customerName: testCustomer.name,
      customerEmail: targetEmail,
      discountType: 'VIP',
      discountPercentage: 15
    })
    const discountResult = await sendEmail(targetEmail, discountTemplate.subject, discountTemplate.html)
    results.push({ template: 'Discount Assigned', success: discountResult.success, error: discountResult.error })
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // 6. Order Confirmation (Full with items)
    console.log('📧 Sending Order Confirmation (full) email...')
    const orderConfirmationTemplate = emailTemplates.orderConfirmation({
      orderNumber: testOrderNumber,
      customerName: testCustomer.name,
      customerEmail: targetEmail,
      address: testCustomer.address,
      emirate: testCustomer.emirate,
      items: testItems.map(i => ({
        productName: i.name,
        quantity: i.quantity,
        price: i.price,
        size: i.size,
        image: i.image
      })),
      subtotal: 950.00,
      shipping: 0,
      vat: 45.24,
      total: 950.00,
      locale: 'en'
    })
    const orderConfirmationResult = await sendEmail(targetEmail, orderConfirmationTemplate.subject, orderConfirmationTemplate.html)
    results.push({ template: 'Order Confirmation (Full)', success: orderConfirmationResult.success, error: orderConfirmationResult.error })
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // 7. Password Reset
    console.log('📧 Sending Password Reset email...')
    const resetTemplate = emailTemplates.passwordReset(testCustomer.name, 'test-reset-token-abc123')
    const resetResult = await sendEmail(targetEmail, resetTemplate.subject, resetTemplate.html)
    results.push({ template: 'Password Reset', success: resetResult.success, error: resetResult.error })
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // 8. COD Order HTML
    console.log('📧 Sending COD Order email...')
    const codOrderData = {
      orderNumber: testOrderNumber,
      customerName: testCustomer.name,
      customerEmail: targetEmail,
      customerPhone: testCustomer.phone,
      customerAddress: testCustomer.address,
      emirate: testCustomer.emirate,
      items: testItems,
      subtotal: 950.00,
      shippingCost: 0,
      vatAmount: 45.24,
      total: 950.00
    }
    const codHTML = generateCODOrderHTML(codOrderData, 'en')
    const codResult = await sendEmail(targetEmail, `COD Order Confirmation #${testOrderNumber}`, codHTML)
    results.push({ template: 'COD Order', success: codResult.success, error: codResult.error })
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // 9. Support Link Order HTML
    console.log('📧 Sending Support Link Order email...')
    const supportLinkHTML = generateSupportLinkOrderHTML(codOrderData, 'en')
    const supportLinkResult = await sendEmail(targetEmail, `Support Link Order #${testOrderNumber}`, supportLinkHTML)
    results.push({ template: 'Support Link Order', success: supportLinkResult.success, error: supportLinkResult.error })
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // 10. Stripe Payment Confirmation
    console.log('📧 Sending Stripe Payment Confirmation email...')
    const stripeHTML = generateStripePaymentConfirmationHTML(codOrderData, 'en')
    const stripeResult = await sendEmail(targetEmail, `Payment Confirmed #${testOrderNumber}`, stripeHTML)
    results.push({ template: 'Stripe Payment Confirmation', success: stripeResult.success, error: stripeResult.error })
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // 11. Order Status Update - CANCELLED
    console.log('📧 Sending Order Status Update (CANCELLED) email...')
    const statusUpdateResult = await sendOrderStatusUpdate({
      orderNumber: testOrderNumber,
      customerName: testCustomer.name,
      customerEmail: targetEmail,
      items: testItems.map(i => ({
        productName: i.name,
        quantity: i.quantity,
        price: i.price,
        size: i.size,
        image: i.image
      })),
      total: 950.00,
      locale: 'en'
    }, 'CANCELLED')
    results.push({ template: 'Order Status Update (CANCELLED)', success: statusUpdateResult.success, error: statusUpdateResult.error })
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // 12. Order Status Update - PROCESSING
    console.log('📧 Sending Order Status Update (PROCESSING) email...')
    const statusUpdateProcessing = await sendOrderStatusUpdate({
      orderNumber: testOrderNumber,
      customerName: testCustomer.name,
      customerEmail: targetEmail,
      items: testItems.map(i => ({
        productName: i.name,
        quantity: i.quantity,
        price: i.price,
        size: i.size,
        image: i.image
      })),
      total: 950.00,
      locale: 'en'
    }, 'PROCESSING')
    results.push({ template: 'Order Status Update (PROCESSING)', success: statusUpdateProcessing.success, error: statusUpdateProcessing.error })
    
    const successCount = results.filter(r => r.success).length
    const failedCount = results.filter(r => !r.success).length
    
    console.log(`\n📬 Email Test Summary:`)
    console.log(`   ✅ Successful: ${successCount}`)
    console.log(`   ❌ Failed: ${failedCount}`)
    results.forEach(r => {
      console.log(`   ${r.success ? '✅' : '❌'} ${r.template}${r.error ? `: ${r.error}` : ''}`)
    })
    
    return NextResponse.json({
      success: failedCount === 0,
      message: `Sent ${successCount} emails to ${targetEmail}. ${failedCount} failed.`,
      results
    })
    
  } catch (error) {
    console.error('Error sending test emails:', error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

