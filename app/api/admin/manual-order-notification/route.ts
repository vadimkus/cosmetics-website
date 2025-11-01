import { NextRequest, NextResponse } from 'next/server'
import { sendAdminNewOrderNotification } from '@/lib/email'
import { requireAdminAuth } from '@/lib/adminAuth'
import { requireCsrfToken } from '@/lib/csrf'

export async function POST(request: NextRequest) {
  const auth = await requireAdminAuth(request)
  if (!auth.authorized) {
    return auth.response
  }

  // CSRF protection (defense in depth)
  const csrfCheck = await requireCsrfToken(request)
  if (!csrfCheck.valid) {
    return csrfCheck.response!
  }

  try {
    const { 
      orderNumber, 
      customerName, 
      customerEmail, 
      total, 
      itemCount 
    } = await request.json()

    // Validate required fields
    if (!orderNumber || !customerName || !customerEmail || !total) {
      return NextResponse.json(
        { error: 'Missing required fields: orderNumber, customerName, customerEmail, total' },
        { status: 400 }
      )
    }

    // Send admin notification
    const result = await sendAdminNewOrderNotification({
      orderNumber,
      customerName,
      customerEmail,
      total: parseFloat(total),
      itemCount: parseInt(itemCount) || 1
    })

    if (result.success && 'messageId' in result) {
      return NextResponse.json({
        success: true,
        message: `Admin notification sent for order #${orderNumber}`,
        messageId: result.messageId
      })
    } else {
      return NextResponse.json(
        { error: `Failed to send notification: ${result.error}` },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Error sending manual order notification:', error)
    return NextResponse.json(
      { error: 'Failed to send notification' },
      { status: 500 }
    )
  }
}
