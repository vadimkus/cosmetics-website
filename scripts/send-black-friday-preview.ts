import { sendBlackFridayEmail } from '../lib/email'
import { debugLog, errorLog } from '../lib/logger'

const PREVIEW_EMAIL = 'f.this.that@gmail.com'
const BLOG_LINK = 'https://genosys.ae/blog/black-friday-sale-20-off'

async function sendPreview() {
  try {
    debugLog('📧 Sending Black Friday email preview to:', PREVIEW_EMAIL)
    
    const result = await sendBlackFridayEmail(
      PREVIEW_EMAIL,
      'Valued Customer',
      BLOG_LINK
    )

    if (result.success) {
      console.log('✅ Preview email sent successfully!')
      console.log('📧 Message ID:', result.messageId)
      console.log('📧 Sent to:', PREVIEW_EMAIL)
    } else {
      console.error('❌ Failed to send preview email:', result.error)
      process.exit(1)
    }
  } catch (error) {
    errorLog('❌ Error sending preview email:', error)
    console.error('❌ Error:', error instanceof Error ? error.message : 'Unknown error')
    process.exit(1)
  }
}

sendPreview()

