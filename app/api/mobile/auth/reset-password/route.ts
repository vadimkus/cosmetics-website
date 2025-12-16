import { NextRequest, NextResponse } from 'next/server'
import { requireBodySizeLimit, getSizeLimitForContentType } from '@/lib/requestSizeLimit'
import { debugLog, errorLog } from '@/lib/logger'
import { validateMobileAuth } from '@/lib/jwt'
import { verifyPasswordResetToken, markTokenAsUsed, invalidateUserTokens } from '@/lib/passwordReset'
import { updateUser } from '@/lib/userStorageDb'
import bcrypt from 'bcryptjs'

/**
 * Mobile password reset (token + new password)
 * POST /api/mobile/auth/reset-password
 *
 * Required headers:
 * - x-api-key
 *
 * Body:
 * - token: string (plain token)
 * - newPassword: string
 *
 * Notes:
 * - No CSRF for mobile endpoints
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now()
  debugLog('[MOBILE_RESET_PASSWORD] Request started')

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

    const { token, newPassword } = await request.json()
    if (!token || typeof token !== 'string') {
      return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 400 })
    }
    if (!newPassword || typeof newPassword !== 'string') {
      return NextResponse.json({ success: false, error: 'New password is required' }, { status: 400 })
    }
    if (newPassword.length < 8) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 8 characters long' },
        { status: 400 }
      )
    }

    const verification = await verifyPasswordResetToken(token)
    if (!verification.valid || !verification.userId || !verification.tokenId) {
      return NextResponse.json(
        { success: false, error: verification.error || 'Invalid or expired token' },
        { status: 400 }
      )
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12)
    await updateUser(verification.userId, { password: hashedPassword })
    await markTokenAsUsed(verification.tokenId)
    await invalidateUserTokens(verification.userId)

    debugLog('[MOBILE_RESET_PASSWORD] Completed', Date.now() - startTime, 'ms')
    return NextResponse.json({ success: true, message: 'Password has been reset successfully' })
  } catch (error) {
    errorLog('[MOBILE_RESET_PASSWORD] Error:', error)
    return NextResponse.json(
      { success: false, error: 'An error occurred while resetting password' },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { validateMobileAuth } from '@/lib/jwt'
import { rateLimitSimple, getClientIdentifierFromNextRequest } from '@/lib/rateLimitSimple'
import { verifyPasswordResetToken, markTokenAsUsed, invalidateUserTokens } from '@/lib/passwordReset'
import { updateUser } from '@/lib/userStorageDb'
import { debugLog, errorLog } from '@/lib/logger'
import bcrypt from 'bcryptjs'

// Rate limiter for reset attempts (10/15min per IP)
const resetPasswordLimiter = rateLimitSimple({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: 'Too many password reset attempts. Please try again later.',
})

/**
 * Mobile Reset Password Endpoint
 * POST /api/mobile/auth/reset-password
 *
 * Headers:
 * - x-api-key
 *
 * Body:
 * - token
 * - newPassword
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now()
  debugLog('[MOBILE_AUTH] Reset-password request started')

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
      errorLog('[MOBILE_AUTH] Reset-password rate limit identifier error:', error)
    }

    const rateLimitResult = await resetPasswordLimiter(clientIdentifier)
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { success: false, error: rateLimitResult.message || 'Too many requests' },
        { status: 429 }
      )
    }

    // Parse + validate body
    const body = await request.json().catch(() => ({}))
    const token = body?.token
    const newPassword = body?.newPassword

    if (!token || typeof token !== 'string') {
      return NextResponse.json({ success: false, error: 'Reset token is required' }, { status: 400 })
    }
    if (!newPassword || typeof newPassword !== 'string') {
      return NextResponse.json({ success: false, error: 'New password is required' }, { status: 400 })
    }
    if (newPassword.length < 8) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 8 characters long' },
        { status: 400 }
      )
    }

    // Verify token
    const verification = await verifyPasswordResetToken(token)
    if (!verification.valid || !verification.userId || !verification.tokenId) {
      return NextResponse.json(
        { success: false, error: verification.error || 'Invalid or expired token' },
        { status: 400 }
      )
    }

    // Hash + update password
    const hashedPassword = await bcrypt.hash(newPassword, 12)
    await updateUser(verification.userId, { password: hashedPassword })

    // Mark token used + invalidate other tokens
    await markTokenAsUsed(verification.tokenId)
    await invalidateUserTokens(verification.userId)

    const duration = Date.now() - startTime
    debugLog(`[MOBILE_AUTH] Reset-password success in ${duration}ms`)

    return NextResponse.json({ success: true, message: 'Password has been reset successfully' })
  } catch (error) {
    errorLog('[MOBILE_AUTH] Reset-password error:', error)
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


