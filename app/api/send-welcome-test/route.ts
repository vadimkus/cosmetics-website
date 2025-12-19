import { NextRequest, NextResponse } from 'next/server'
import { sendWelcomeEmail } from '@/lib/email'
import { errorLog, debugLog } from '@/lib/logger'

/**
 * Simple endpoint to send welcome email for testing
 * POST /api/send-welcome-test
 * Body: { email: string, name?: string, password?: string }
 */
export async function POST(request: NextRequest) {
  try {
    const { email, name = 'John Doe', password } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email address is required' },
        { status: 400 }
      )
    }

    debugLog(`📧 Sending welcome email to: ${email}`)
    debugLog(`👤 Name: ${name}`)
    if (password) {
      debugLog(`🔑 Password: ${password}`)
    }

    const result = await sendWelcomeEmail(name, email, password)

    if (result.success && 'messageId' in result) {
      return NextResponse.json({
        success: true,
        message: `Welcome email sent successfully to ${email}`,
        messageId: result.messageId
      })
    } else {
      return NextResponse.json(
        { error: `Failed to send welcome email: ${result.error}` },
        { status: 500 }
      )
    }

  } catch {
    errorLog('Send welcome test error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

