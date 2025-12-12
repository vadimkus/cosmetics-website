import { NextRequest, NextResponse } from 'next/server'
import { sendEmail, generateCODOrderHTML } from '@/lib/email'
import { errorLog } from '@/lib/logger'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()
    const testEmail = email || 'f.this.that@gmail.com'

    const codOrderData = {
      orderNumber: 'COD2501010001',
      customerName: 'Vadim Sagatdinov',
      customerEmail: testEmail,
      customerPhone: '+971 50 123 4567',
      customerAddress: 'Dubai Marina, Building 123, Apt 456',
      emirate: 'Dubai',
      items: [
        {
          name: 'GENOSYS SKIN CARING BLEMISH BALM CUSHION [SPF 50+ PA++++]',
          quantity: 2,
          price: 150.00,
          total: 300.00,
          size: 'Medium',
          color: 'Beige'
        },
        {
          name: 'GENOSYS MOISTURE REPLENISHING HYALURON SERUM',
          quantity: 1,
          price: 156.75,
          total: 156.75
        }
      ],
      subtotal: 456.75,
      shippingCost: 0,
      vatAmount: 22.84,
      total: 479.59
    }
    
    // Load translations
    const locale = 'en'
    const translations = (await import('@/messages/en.json')).default.orderEmail.cod
    const orderHTML = generateCODOrderHTML(codOrderData, locale, translations)
    const emailSubject = translations.subject.replace('#{orderNumber}', codOrderData.orderNumber).replace('{orderNumber}', codOrderData.orderNumber)
    
    const result = await sendEmail(testEmail, emailSubject, orderHTML)

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: `COD order email sent successfully to ${testEmail}`,
        messageId: result.messageId
      })
    } else {
      return NextResponse.json(
        { error: `Failed to send email: ${result.error}` },
        { status: 500 }
      )
    }

  } catch (error) {
    errorLog('Error sending sample COD email:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}












