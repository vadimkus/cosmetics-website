import { NextRequest, NextResponse } from 'next/server'
import { sendAdminNewOrderNotification } from '@/lib/email'
import { errorLog } from '@/lib/logger'
import { requireDevelopment } from '@/lib/apiErrorHandler'

export async function POST(request: NextRequest) {
  // Development-only route
  const devCheck = requireDevelopment()
  if (devCheck) return devCheck

  try {
    const { email } = await request.json()
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email address is required' },
        { status: 400 }
      )
    }

    const result = await sendAdminNewOrderNotification({
      orderNumber: 'SAMPLE-' + Date.now(),
      customerName: 'John Doe',
      customerEmail: 'customer@example.com',
      customerPhone: '+971 50 123 4567',
      total: 456.75,
      itemCount: 3,
      items: [
        {
          productName: 'GENOSYS SKIN CARING BLEMISH BALM CUSHION [SPF 50+ PA++++]',
          quantity: 2,
          price: 150.00,
          image: 'https://genosys.ae/images/product-placeholder.jpg',
          size: 'Medium',
          color: 'Beige'
        },
        {
          productName: 'GENOSYS MOISTURE REPLENISHING HYALURON SERUM',
          quantity: 1,
          price: 156.75,
          image: 'https://genosys.ae/images/product-placeholder.jpg'
        }
      ],
      subtotal: 456.75,
      shipping: 0,
      vat: 22.84,
      address: '123 Business Bay, Dubai Marina, Dubai',
      emirate: 'Dubai'
    }, email)

    if (result.success && 'messageId' in result) {
      return NextResponse.json({
        success: true,
        message: `Sample admin order notification sent successfully to ${email}`,
        messageId: result.messageId
      })
    } else {
      return NextResponse.json(
        { error: `Failed to send email: ${result.error}` },
        { status: 500 }
      )
    }
  } catch (error) {
    errorLog('Send sample email error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

