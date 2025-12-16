import { NextRequest, NextResponse } from 'next/server'
import { rateLimitSimple, getClientIdentifierFromNextRequest } from '@/lib/rateLimitSimple'
import { requireBodySizeLimit, getSizeLimitForContentType } from '@/lib/requestSizeLimit'
import { debugLog, errorLog } from '@/lib/logger'
import { findUserByEmail } from '@/lib/userStorageDb'
import { createPasswordResetToken } from '@/lib/passwordReset'
import { sendPasswordResetEmail } from '@/lib/email'
import { validateMobileAuth } from '@/lib/jwt'

// Rate limiter for password reset requests (20 requests per hour per IP)
const forgotPasswordLimiter = rateLimitSimple({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20,
  message: 'Too many password reset requests. Please try again later.'
})

/**
 * Mobile password reset request
 * POST /api/mobile/auth/forgot-password
 *
 * Required headers:
 * - x-api-key
 *
 * Body:
 * - email: string
 *
 * Notes:
 * - No CSRF for mobile endpoints (native clients)
 * - Always returns success to prevent email enumeration
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now()
  debugLog('[MOBILE_FORGOT_PASSWORD] Request started')

  try {
    const apiKey = request.headers.get('x-api-key')
    const authValidation = validateMobileAuth(apiKey, null)
    if (!authValidation.valid) {
      return NextResponse.json(
        { success: false, error: authValidation.error },
        { status: authValidation.status || 401 }
      )
    }

    // Request body size limit check
    const sizeLimit = getSizeLimitForContentType(request)
    const sizeCheck = requireBodySizeLimit(request, sizeLimit)
    if (!sizeCheck.valid) return sizeCheck.response!

    // Rate limiting (fail closed)
    let clientIdentifier = 'unknown'
    try {
      clientIdentifier = getClientIdentifierFromNextRequest(request)
    } catch (e) {
      errorLog('[MOBILE_FORGOT_PASSWORD] Rate limit identifier error:', e)
    }

    let rateLimitResult
    try {
      rateLimitResult = await forgotPasswordLimiter(clientIdentifier)
    } catch (e) {
      errorLog('[MOBILE_FORGOT_PASSWORD] Rate limiting error:', e)
      return NextResponse.json(
        { success: false, error: 'Rate limiting service unavailable. Please try again later.' },
        { status: 503 }
      )
    }

    if (!rateLimitResult || !rateLimitResult.success) {
      return NextResponse.json(
        { success: false, error: rateLimitResult?.message || 'Rate limit exceeded' },
        { status: 429 }
      )
    }

    const { email } = await request.json()
    if (!email || typeof email !== 'string') {
      return NextResponse.json({ success: false, error: 'Email is required' }, { status: 400 })
    }

    const emailNormalized = email.toLowerCase().trim()
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(emailNormalized)) {
      return NextResponse.json({ success: false, error: 'Invalid email format' }, { status: 400 })
    }

    const user = await findUserByEmail(emailNormalized)

    // Always return success (prevent email enumeration)
    if (user) {
      try {
        const plainToken = await createPasswordResetToken(user.id)
        const emailResult = await sendPasswordResetEmail(user.email, user.name, plainToken)
        if (!emailResult.success) {
          errorLog('[MOBILE_FORGOT_PASSWORD] Failed to send reset email:', emailResult.error)
        }
      } catch (e) {
        errorLog('[MOBILE_FORGOT_PASSWORD] Error processing reset:', e)
      }
    }

    debugLog('[MOBILE_FORGOT_PASSWORD] Completed', Date.now() - startTime, 'ms')
    return NextResponse.json({
      success: true,
      message: 'If an account with that email exists, a password reset link has been sent.'
    })
  } catch (error) {
    errorLog('[MOBILE_FORGOT_PASSWORD] Error:', error)
    return NextResponse.json(
      { success: false, error: 'An error occurred. Please try again later.' },
      { status: 500 }
    )
  }
}

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


