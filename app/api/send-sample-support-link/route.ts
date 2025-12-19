import { NextRequest, NextResponse } from 'next/server'
import { sendEmail, generateSupportLinkOrderHTML } from '@/lib/email'
import { errorLog } from '@/lib/logger'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()
    const testEmail = email || 'f.this.that@gmail.com'

    const supportOrderData = {
      orderNumber: 'SUP2511300207',
      customerName: 'Vadim Sagatdinov',
      customerEmail: testEmail,
      customerPhone: '+971 559152985',
      customerAddress: 'Dubai',
      emirate: 'Dubai',
      items: [
        {
          name: 'GENOSYS SKIN CARING BLEMISH BALM CUSHION [SPF 50+ PA++++]',
          quantity: 2,
          price: 150.00,
          total: 300.00,
          image: 'https://genosys.ae/images/CUSHC.png',
          color: 'Beige',
          size: 'Medium'
        },
        {
          name: 'GENOSYS MOISTURE REPLENISHING HYALURON SERUM',
          quantity: 1,
          price: 156.75,
          total: 156.75,
          image: 'https://genosys.ae/images/HRS.jpg'
        }
      ],
      subtotal: 456.75,
      shippingCost: 45.00,
      vatAmount: 23.89,
      total: 525.64
    }
    
    // Load translations
    const locale = 'en'
    const translations = (await import('@/messages/en.json')).default.orderEmail.supportLink
    const orderHTML = generateSupportLinkOrderHTML(supportOrderData, locale, translations)
    const emailSubject = translations.subject.replace('#{orderNumber}', supportOrderData.orderNumber).replace('{orderNumber}', supportOrderData.orderNumber)
    
    const result = await sendEmail(testEmail, emailSubject, orderHTML)

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: `Support link order email sent successfully to ${testEmail}`,
        messageId: result.messageId
      })
    } else {
      return NextResponse.json(
        { error: `Failed to send email: ${result.error}` },
        { status: 500 }
      )
    }

  } catch {
    errorLog('Error sending sample support link email:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

