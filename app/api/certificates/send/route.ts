import { NextResponse } from 'next/server'
import { sendCertificateEmail } from '@/lib/certificate-email'

/**
 * API endpoint to send a gift certificate via email
 * POST /api/certificates/send
 * 
 * Request body:
 * {
 *   recipientEmail: string (required)
 *   recipientName?: string
 *   certificateCode: string (required)
 *   amount: number (required)
 *   currency?: string (default: 'AED')
 *   senderName?: string
 *   senderMessage?: string
 * }
 */

interface SendCertificateRequest {
  recipientEmail: string
  recipientName?: string
  certificateCode: string
  amount: number
  currency?: string
  senderName?: string
  senderMessage?: string
}

export async function POST(request: Request) {
  try {
    const body: SendCertificateRequest = await request.json()

    // Validate required fields
    if (!body.recipientEmail || !body.certificateCode || !body.amount) {
      return NextResponse.json(
        { 
          error: 'Missing required fields',
          required: ['recipientEmail', 'certificateCode', 'amount']
        },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.recipientEmail)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    // Validate amount
    if (body.amount <= 0) {
      return NextResponse.json(
        { error: 'Amount must be greater than 0' },
        { status: 400 }
      )
    }

    // Construct certificate URL
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.genosys.ae'
    const certificateUrl = `${baseUrl}/certificate/${body.certificateCode}`

    // Send email
    const emailParams: {
      recipientEmail: string
      recipientName?: string
      certificateCode: string
      amount: number
      currency: string
      senderName?: string
      senderMessage?: string
      certificateUrl: string
    } = {
      recipientEmail: body.recipientEmail,
      certificateCode: body.certificateCode,
      amount: body.amount,
      currency: body.currency || 'AED',
      certificateUrl,
    }
    
    if (body.recipientName) emailParams.recipientName = body.recipientName
    if (body.senderName) emailParams.senderName = body.senderName
    if (body.senderMessage) emailParams.senderMessage = body.senderMessage
    
    const success = await sendCertificateEmail(emailParams)

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Certificate email sent successfully',
      certificateUrl,
    })
  } catch (error) {
    console.error('Error sending certificate email:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Example usage with curl:
// curl -X POST http://localhost:3001/api/certificates/send \
//   -H "Content-Type: application/json" \
//   -d '{
//     "recipientEmail": "customer@example.com",
//     "recipientName": "Sarah Johnson",
//     "certificateCode": "178B2",
//     "amount": 200,
//     "currency": "AED",
//     "senderName": "GENOSYS Team",
//     "senderMessage": "Thank you for your purchase!"
//   }'

