/**
 * WhatsApp Send API Endpoint
 * 
 * POST /api/whatsapp/send
 * 
 * Sends WhatsApp messages via Twilio.
 * This is an internal API - requires admin authentication or internal API key.
 */

import { NextRequest, NextResponse } from 'next/server'
import { 
  sendWhatsAppMessage, 
  isTwilioConfigured,
  WhatsAppMessageType 
} from '@/lib/twilio'
import { debugLog, errorLog } from '@/lib/logger'
import { verifyAdminAuth } from '@/lib/adminAuth'

interface SendWhatsAppRequest {
  phone: string
  messageType: WhatsAppMessageType
  variables: Record<string, string>
}

export async function POST(request: NextRequest) {
  try {
    // Verify internal API key or signed admin session.
    // NOTE: The legacy x-admin-email header was removed — any non-empty
    // value passed the check, allowing unauthenticated WhatsApp sends.
    const authHeader = request.headers.get('x-api-key')
    const internalKey = process.env.INTERNAL_API_KEY
    
    let isAuthorized = Boolean(authHeader && internalKey && authHeader === internalKey)
    
    if (!isAuthorized) {
      const auth = await verifyAdminAuth(request)
      isAuthorized = Boolean(auth.user)
    }
    
    if (!isAuthorized) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if Twilio is configured
    if (!isTwilioConfigured()) {
      return NextResponse.json({
        success: false,
        error: 'WhatsApp notifications not configured',
        configured: false
      })
    }

    // Parse request body
    const body: SendWhatsAppRequest = await request.json()
    const { phone, messageType, variables } = body

    // Validate required fields
    if (!phone || !messageType) {
      return NextResponse.json(
        { success: false, error: 'Phone and messageType are required' },
        { status: 400 }
      )
    }

    // Send the message
    const result = await sendWhatsAppMessage(phone, messageType, variables || {})

    if (result.success) {
      debugLog('[WHATSAPP_API] Message sent:', {
        phone,
        messageType,
        messageId: result.messageId
      })
      
      return NextResponse.json({
        success: true,
        messageId: result.messageId,
        message: 'WhatsApp message sent successfully'
      })
    } else {
      return NextResponse.json({
        success: false,
        error: result.error,
        skipped: result.skipped,
        reason: result.reason
      })
    }

  } catch (error) {
    errorLog('[WHATSAPP_API] Error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/whatsapp/send
 * 
 * Returns configuration status
 */
export async function GET() {
  return NextResponse.json({
    configured: isTwilioConfigured(),
    message: isTwilioConfigured() 
      ? 'WhatsApp integration is configured' 
      : 'WhatsApp integration not configured - add Twilio credentials to environment'
  })
}
