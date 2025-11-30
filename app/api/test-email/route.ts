import { NextRequest, NextResponse } from 'next/server'
import { sendWelcomeEmail, sendOrderConfirmationEmail, sendAdminNewUserNotification, sendAdminNewOrderNotification, sendOrderStatusUpdate } from '@/lib/email'
import { requireAdminAuth } from '@/lib/adminAuth'
import { requireCsrfToken } from '@/lib/csrf'
import { errorLog } from '@/lib/logger'

export async function POST(request: NextRequest) {
  // Require admin authentication and CSRF protection
  const auth = await requireAdminAuth(request)
  if (!auth.authorized) {
    return auth.response
  }

  const csrfCheck = await requireCsrfToken(request)
  if (!csrfCheck.valid) {
    return csrfCheck.response!
  }

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
        result = await sendAdminNewUserNotification('Test User', testEmail, '+971 50 123 4567', 'Test Address, Dubai')
        break
      
      case 'admin-order':
        result = await sendAdminNewOrderNotification({
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
        }, testEmail)
        break
      
      case 'order-status':
        result = await sendOrderStatusUpdate({
          orderNumber: 'ORD-2024-001',
          customerName: 'John Doe',
          customerEmail: testEmail,
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
          total: 456.75
        }, 'DELIVERED')
        break
      
      default:
        return NextResponse.json(
          { error: 'Invalid email type. Use: welcome, order, admin-user, admin-order, or order-status' },
          { status: 400 }
        )
    }

    if (result.success && 'messageId' in result) {
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
    errorLog('Test email error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
