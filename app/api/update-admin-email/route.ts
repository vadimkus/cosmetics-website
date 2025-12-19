import { NextRequest, NextResponse } from 'next/server'
import { requireAdminAuth } from '@/lib/adminAuth'
import { errorLog } from '@/lib/logger'

export async function POST(request: NextRequest) {
  // Require admin authentication
  const auth = await requireAdminAuth(request)
  if (!auth.authorized) {
    return auth.response
  }

  try {
    const { adminEmail } = await request.json()
    
    if (!adminEmail) {
      return NextResponse.json(
        { error: 'Admin email address is required' },
        { status: 400 }
      )
    }
    
    // Test sending an email to the new admin address
    const { sendAdminNewOrderNotification } = await import('@/lib/email')
    
    const result = await sendAdminNewOrderNotification({
      orderNumber: 'TEST-CONFIG',
      customerName: 'System Test',
      customerEmail: 'test@example.com',
      total: 0,
      itemCount: 0
    })
    
    if (result.success && 'messageId' in result) {
      return NextResponse.json({
        success: true,
        message: `Admin email configuration test sent to ${adminEmail}`,
        messageId: result.messageId
      })
    } else {
      return NextResponse.json(
        { error: `Failed to send test email: ${result.error}` },
        { status: 500 }
      )
    }
    
  } catch {
    errorLog('Error testing admin email:', error)
    return NextResponse.json(
      { error: 'Failed to test admin email configuration' },
      { status: 500 }
    )
  }
}
