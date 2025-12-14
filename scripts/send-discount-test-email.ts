import 'dotenv/config'
import { sendDiscountAssignmentEmail } from '../lib/email'

const targetEmail = process.argv[2] || 'f.this.that@gmail.com'
const customerName = process.argv[3] || 'Test Customer'
const discountType = (process.argv[4] || 'CLINIC') as 'CLINIC' | 'VIP'
const discountPercentage = parseInt(process.argv[5]) || 15

async function sendDiscountTestEmail() {
  try {
    console.log('📧 Sending discount assignment email to', targetEmail + '...')
    console.log(`👤 Customer Name: ${customerName}`)
    console.log(`🎁 Discount Type: ${discountType}`)
    console.log(`💰 Discount Percentage: ${discountPercentage}%`)
    console.log('')
    
    const result = await sendDiscountAssignmentEmail({
      customerName: customerName,
      customerEmail: targetEmail,
      discountType: discountType,
      discountPercentage: discountPercentage
    })
    
    if (result.success) {
      console.log('✅ Discount assignment email sent successfully!')
      if (result.messageId) {
        console.log(`📬 Message ID: ${result.messageId}`)
      }
    } else {
      console.error('❌ Failed to send discount assignment email:', result.error)
      process.exit(1)
    }
  } catch (error: any) {
    console.error('❌ Error:', error.message)
    if (error.stack) {
      console.error(error.stack)
    }
    process.exit(1)
  }
}

sendDiscountTestEmail()






























