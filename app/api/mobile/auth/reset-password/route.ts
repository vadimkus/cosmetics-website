import { NextRequest, NextResponse } from 'next/server'
import { requireBodySizeLimit, getSizeLimitForContentType } from '@/lib/requestSizeLimit'
import { debugLog, errorLog } from '@/lib/logger'
import { validateMobileAuth } from '@/lib/jwt'
import { rateLimitSimple, getClientIdentifierFromNextRequest } from '@/lib/rateLimitSimple'
import { verifyPasswordResetToken, markTokenAsUsed, invalidateUserTokens } from '@/lib/passwordReset'
import { updateUser } from '@/lib/userStorageDb'
import bcrypt from 'bcryptjs'

// Rate limiter for reset attempts (10 / 15 minutes per IP)
const resetPasswordLimiter = rateLimitSimple({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: 'Too many password reset attempts. Please try again later.',
})

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

    // Rate limiting (fail closed)
    let clientIdentifier = 'unknown'
    try {
      clientIdentifier = getClientIdentifierFromNextRequest(request)
    } catch {
      errorLog('[MOBILE_RESET_PASSWORD] Rate limit identifier error:', e)
    }

    let rateLimitResult
    try {
      rateLimitResult = await resetPasswordLimiter(clientIdentifier)
    } catch {
      errorLog('[MOBILE_RESET_PASSWORD] Rate limiting error:', e)
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
  } catch {
    errorLog('[MOBILE_RESET_PASSWORD] Error:', error)
    return NextResponse.json(
      { success: false, error: 'An error occurred while resetting password' },
      { status: 500 }
    )
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
