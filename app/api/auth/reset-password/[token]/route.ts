import { NextRequest, NextResponse } from 'next/server'
import { verifyPasswordResetToken, markTokenAsUsed, invalidateUserTokens } from '@/lib/passwordReset'
import { updateUser } from '@/lib/userStorageDb'
import { requireCsrfToken } from '@/lib/csrf'
import { requireBodySizeLimit, getSizeLimitForContentType } from '@/lib/requestSizeLimit'
import { debugLog, errorLog } from '@/lib/logger'
import bcrypt from 'bcryptjs'

/**
 * GET /api/auth/reset-password/[token]
 * Verify if a password reset token is valid
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params
    
    if (!token || typeof token !== 'string') {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 400 }
      )
    }

    debugLog('[RESET-PASSWORD-VERIFY] Verifying token...')
    
    // Verify token
    const verification = await verifyPasswordResetToken(token)
    
    if (!verification.valid) {
      debugLog('[RESET-PASSWORD-VERIFY] Token invalid or expired')
      return NextResponse.json(
        { 
          valid: false,
          error: verification.error || 'Invalid or expired token'
        },
        { status: 400 }
      )
    }

    debugLog('[RESET-PASSWORD-VERIFY] Token verified successfully')
    
    // Return success (don't expose userId or tokenId to client)
    return NextResponse.json({
      valid: true,
      message: 'Token is valid'
    })

  } catch {
    errorLog('[RESET-PASSWORD-VERIFY] Error:', error)
    return NextResponse.json(
      { error: 'An error occurred while verifying token' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/auth/reset-password/[token]
 * Reset password using a valid reset token
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const startTime = Date.now()
  debugLog('[RESET-PASSWORD] Request started')
  
  try {
    // CSRF protection
    debugLog('[RESET-PASSWORD] Checking CSRF token...')
    const csrfCheck = await requireCsrfToken(request)
    if (!csrfCheck.valid) {
      debugLog('[RESET-PASSWORD] CSRF check failed')
      return csrfCheck.response!
    }
    debugLog('[RESET-PASSWORD] CSRF check passed', Date.now() - startTime, 'ms')

    // Request body size limit check
    debugLog('[RESET-PASSWORD] Checking body size...')
    const sizeLimit = getSizeLimitForContentType(request)
    const sizeCheck = requireBodySizeLimit(request, sizeLimit)
    if (!sizeCheck.valid) {
      debugLog('[RESET-PASSWORD] Body size check failed')
      return sizeCheck.response!
    }

    const { token } = await params
    
    if (!token || typeof token !== 'string') {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 400 }
      )
    }

    // Parse request body
    debugLog('[RESET-PASSWORD] Parsing request body...')
    const { newPassword } = await request.json()
    
    if (!newPassword || typeof newPassword !== 'string') {
      return NextResponse.json(
        { error: 'New password is required' },
        { status: 400 }
      )
    }

    // Validate password strength
    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      )
    }

    // Verify token
    debugLog('[RESET-PASSWORD] Verifying token...')
    const verification = await verifyPasswordResetToken(token)
    
    if (!verification.valid || !verification.userId || !verification.tokenId) {
      debugLog('[RESET-PASSWORD] Token invalid or expired')
      return NextResponse.json(
        { 
          error: verification.error || 'Invalid or expired token'
        },
        { status: 400 }
      )
    }

    debugLog('[RESET-PASSWORD] Token verified, resetting password for user:', verification.userId)

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12)
    
    // Update user password
    await updateUser(verification.userId, { password: hashedPassword })
    
    // Mark token as used
    await markTokenAsUsed(verification.tokenId)
    
    // Invalidate all other tokens for this user (security best practice)
    await invalidateUserTokens(verification.userId)
    
    debugLog('[RESET-PASSWORD] Password reset successful')

    return NextResponse.json({
      success: true,
      message: 'Password has been reset successfully'
    })

  } catch {
    errorLog('[RESET-PASSWORD] Error:', error)
    return NextResponse.json(
      { error: 'An error occurred while resetting password' },
      { status: 500 }
    )
  }
}
