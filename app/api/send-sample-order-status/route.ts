import { NextRequest, NextResponse } from 'next/server'
import { sendOrderStatusUpdate } from '@/lib/email'
import { errorLog } from '@/lib/logger'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()
    const testEmail = email || 'f.this.that@gmail.com'

    const result = await sendOrderStatusUpdate({
      orderNumber: 'ORD-2024-001',
      customerName: 'John Doe',
      customerEmail: testEmail,
      locale: 'en',
      items: [
        {
          productName: 'GENOSYS SKIN CARING BLEMISH BALM CUSHION [SPF 50+ PA++++]',
          quantity: 2,
          price: 150.00,
          image: 'https://genosys.ae/images/CUSHC.png',
          color: 'Beige',
          size: 'Medium'
        },
        {
          productName: 'GENOSYS MOISTURE REPLENISHING HYALURON SERUM',
          quantity: 1,
          price: 156.75,
          image: 'https://genosys.ae/images/HRS.jpg'
        }
      ],
      total: 456.75,
      customerAddress: '123 Business Bay, Dubai Marina',
      customerEmirate: 'Dubai'
    }, 'DELIVERED')

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: `Order status update email sent successfully to ${testEmail}`,
        messageId: result.messageId
      })
    } else {
      return NextResponse.json(
        { error: `Failed to send email: ${result.error}` },
        { status: 500 }
      )
    }

  } catch (error) {
    errorLog('Error sending sample order status email:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

