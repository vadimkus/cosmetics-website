import { NextRequest, NextResponse } from 'next/server'
import { sendWelcomeEmail, sendOrderConfirmationEmail, sendAdminNewUserNotification, sendAdminNewOrderNotification } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const { type, testEmail } = await request.json()

    if (!testEmail) {
      return NextResponse.json(
        { error: 'Test email address is required' },
        { status: 400 }
      )
    }

    let result

    switch (type) {
      case 'welcome':
        result = await sendWelcomeEmail('Test User', testEmail)
        break
      
      case 'order':
        result = await sendOrderConfirmationEmail({
          orderNumber: 'TEST123456',
          customerName: 'Test Customer',
          customerEmail: testEmail,
          items: [
            {
              productName: 'Test Product',
              quantity: 2,
              price: 150.00,
              image: '/images/test.jpg'
            }
          ],
          subtotal: 300.00,
          shipping: 45.00,
          vat: 17.25,
          total: 362.25,
          address: 'Test Address, Dubai',
          emirate: 'Dubai'
        })
        break
      
      case 'admin-user':
        result = await sendAdminNewUserNotification('Test User', testEmail)
        break
      
      case 'admin-order':
        result = await sendAdminNewOrderNotification({
          orderNumber: 'TEST123456',
          customerName: 'Test Customer',
          customerEmail: testEmail,
          total: 362.25,
          itemCount: 2
        })
        break
      
      default:
        return NextResponse.json(
          { error: 'Invalid email type. Use: welcome, order, admin-user, or admin-order' },
          { status: 400 }
        )
    }

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: `${type} email sent successfully to ${testEmail}`,
        messageId: result.messageId
      })
    } else {
      return NextResponse.json(
        { error: `Failed to send ${type} email: ${result.error}` },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Test email error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
