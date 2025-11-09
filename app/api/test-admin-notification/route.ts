import { NextRequest, NextResponse } from 'next/server'
import { sendAdminNewOrderNotification, sendAdminNewUserNotification } from '@/lib/email'
import { requireAdminAuth } from '@/lib/adminAuth'
import { requireCsrfToken } from '@/lib/csrf'
import { debugLog, errorLog } from '@/lib/logger'

/**
 * Test endpoint to verify admin email notifications are working
 * POST /api/test-admin-notification
 * Requires admin authentication and CSRF token
 */
export async function POST(request: NextRequest) {
  // Require admin authentication
  const auth = await requireAdminAuth(request)
  if (!auth.authorized) {
    return auth.response
  }

  // CSRF protection
  const csrfCheck = await requireCsrfToken(request)
  if (!csrfCheck.valid) {
    return csrfCheck.response!
  }

  try {
    const { type } = await request.json()
    
    // Get admin email configuration
    const adminEmail = process.env.ADMIN_EMAIL || process.env.GMAIL_USER || process.env.EMAIL_USER || '5856825@gmail.com'
    
    debugLog('🧪 Testing admin notification...')
    debugLog(`📧 Admin email configured: ${adminEmail}`)
    debugLog(`📧 Environment variables - ADMIN_EMAIL: ${process.env.ADMIN_EMAIL || 'NOT_SET'}, GMAIL_USER: ${process.env.GMAIL_USER || 'NOT_SET'}, EMAIL_USER: ${process.env.EMAIL_USER || 'NOT_SET'}`)
    
    let result
    
    if (type === 'order') {
      // Test order notification
      result = await sendAdminNewOrderNotification({
        orderNumber: 'TEST-' + Date.now(),
        customerName: 'Test Customer',
        customerEmail: 'test@example.com',
        customerPhone: '+971 50 123 4567',
        total: 100.00,
        itemCount: 1,
        items: [{
          productName: 'Test Product',
          quantity: 1,
          price: 100.00,
          image: '/images/default-product.jpg'
        }],
        subtotal: 95.24,
        shipping: 0,
        vat: 4.76,
        address: 'Test Address',
        emirate: 'Dubai'
      })
    } else if (type === 'user') {
      // Test user notification
      result = await sendAdminNewUserNotification(
        'Test User',
        'test@example.com',
        '+971 50 123 4567',
        'Test Address, Dubai'
      )
    } else {
      return NextResponse.json(
        { error: 'Invalid type. Use "order" or "user"' },
        { status: 400 }
      )
    }
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        message: `Admin ${type} notification test sent successfully`,
        adminEmail,
        messageId: result.messageId,
        environment: {
          ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'NOT_SET',
          GMAIL_USER: process.env.GMAIL_USER || 'NOT_SET',
          EMAIL_USER: process.env.EMAIL_USER || 'NOT_SET',
          resolved: adminEmail
        }
      })
    } else {
      return NextResponse.json({
        success: false,
        error: result.error,
        adminEmail,
        environment: {
          ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'NOT_SET',
          GMAIL_USER: process.env.GMAIL_USER || 'NOT_SET',
          EMAIL_USER: process.env.EMAIL_USER || 'NOT_SET',
          resolved: adminEmail
        }
      }, { status: 500 })
    }
  } catch (error) {
    errorLog('Test admin notification error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        adminEmail: process.env.ADMIN_EMAIL || process.env.GMAIL_USER || process.env.EMAIL_USER || '5856825@gmail.com'
      },
      { status: 500 }
    )
  }
}

