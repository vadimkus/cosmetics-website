import { NextRequest, NextResponse } from 'next/server'
import { validateMobileAuth } from '@/lib/jwt'
import { rateLimitSimple, getClientIdentifierFromNextRequest } from '@/lib/rateLimitSimple'
import { findUserByEmail } from '@/lib/userStorageDb'
import { createPasswordResetToken } from '@/lib/passwordReset'
import { sendPasswordResetEmail } from '@/lib/email'
import { debugLog, errorLog } from '@/lib/logger'

// Rate limiter for password reset requests (20/hour per IP)
const forgotPasswordLimiter = rateLimitSimple({
  windowMs: 60 * 60 * 1000,
  max: 20,
  message: 'Too many password reset requests. Please try again later.',
})

/**
 * Mobile Forgot Password Endpoint
 * POST /api/mobile/auth/forgot-password
 *
 * Headers:
 * - x-api-key
 *
 * Body:
 * - email
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now()
  debugLog('[MOBILE_AUTH] Forgot-password request started')

  try {
    // Validate API key
    const apiKey = request.headers.get('x-api-key')
    const authValidation = validateMobileAuth(apiKey, null)
    if (!authValidation.valid) {
      return NextResponse.json(
        { success: false, error: authValidation.error },
        { status: authValidation.status || 500 }
      )
    }

    // Rate limit
    let clientIdentifier = 'unknown'
    try {
      clientIdentifier = getClientIdentifierFromNextRequest(request)
    } catch (error) {
      errorLog('[MOBILE_AUTH] Forgot-password rate limit identifier error:', error)
    }

    const rateLimitResult = await forgotPasswordLimiter(clientIdentifier)
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { success: false, error: rateLimitResult.message || 'Too many requests' },
        { status: 429 }
      )
    }

    // Parse + validate body
    const body = await request.json().catch(() => ({}))
    const rawEmail = body?.email
    if (!rawEmail || typeof rawEmail !== 'string') {
      return NextResponse.json({ success: false, error: 'Email is required' }, { status: 400 })
    }

    const email = rawEmail.toLowerCase().trim()
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ success: false, error: 'Invalid email format' }, { status: 400 })
    }

    // Don’t reveal whether user exists (anti-enumeration)
    const user = await findUserByEmail(email)
    if (user) {
      try {
        const plainToken = await createPasswordResetToken(user.id)
        const emailResult = await sendPasswordResetEmail(user.email, user.name, plainToken)
        if (!emailResult.success) {
          errorLog('[MOBILE_AUTH] Forgot-password email send failed:', emailResult.error)
        }
      } catch (error) {
        errorLog('[MOBILE_AUTH] Forgot-password processing error:', error)
      }
    }

    const duration = Date.now() - startTime
    debugLog(`[MOBILE_AUTH] Forgot-password completed in ${duration}ms`)

    return NextResponse.json({
      success: true,
      message: 'If an account with that email exists, a password reset link has been sent.',
    })
  } catch (error) {
    errorLog('[MOBILE_AUTH] Forgot-password error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ success: false, error: 'Method not allowed' }, { status: 405 })
}

export async function PUT() {
  return NextResponse.json({ success: false, error: 'Method not allowed' }, { status: 405 })
}

export async function DELETE() {
  return NextResponse.json({ success: false, error: 'Method not allowed' }, { status: 405 })
}


