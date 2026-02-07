import { NextRequest, NextResponse } from 'next/server'
import { findUserByEmail } from '@/lib/userStorageDb'
import { validateMobileAuth, extractTokenFromHeader, generateMobileToken, verifyMobileTokenIgnoreExpiration } from '@/lib/jwt'
import { debugLog, errorLog } from '@/lib/logger'

/**
 * Mobile Token Refresh Endpoint
 * POST /api/mobile/auth/refresh
 * 
 * Accepts an expired (or about-to-expire) JWT and issues a fresh one,
 * as long as the signature is valid and the user still exists.
 * 
 * This allows the mobile app to silently refresh tokens without forcing
 * a full re-login, improving user experience.
 * 
 * Headers Required:
 * - x-api-key: Mobile app API key
 * - Authorization: Bearer <jwt_token>
 * 
 * Returns:
 * - success: boolean
 * - token: New JWT token (if refresh succeeds)
 * - user: Fresh user data
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now()
  debugLog('[MOBILE_AUTH] Token refresh request started')

  try {
    // Extract API key and JWT token
    const apiKey = request.headers.get('x-api-key')
    const authHeader = request.headers.get('Authorization')
    const rawToken = extractTokenFromHeader(authHeader)

    if (!rawToken) {
      return NextResponse.json(
        { success: false, error: 'Authentication token required' },
        { status: 401 }
      )
    }

    // Validate API key only (don't validate the JWT - it may be expired)
    const authValidation = validateMobileAuth(apiKey, null)
    if (!authValidation.valid) {
      return NextResponse.json(
        { success: false, error: authValidation.error },
        { status: authValidation.status || 500 }
      )
    }

    // Verify token signature WITHOUT checking expiration.
    // This proves the token was genuinely issued by our server.
    const payload = verifyMobileTokenIgnoreExpiration(rawToken)

    if (!payload || !payload.email || !payload.userId) {
      return NextResponse.json(
        { success: false, error: 'Invalid authentication token' },
        { status: 401 }
      )
    }

    // If the token is expired, enforce a grace period (60 days after expiration)
    if (payload.expired && payload.exp) {
      const now = Math.floor(Date.now() / 1000)
      const REFRESH_GRACE_PERIOD = 60 * 24 * 60 * 60 // 60 days in seconds
      if (now - payload.exp > REFRESH_GRACE_PERIOD) {
        debugLog('[MOBILE_AUTH] Token expired beyond refresh grace period', {
          email: payload.email,
          expiredAt: new Date(payload.exp * 1000).toISOString(),
          expiredAgo: `${Math.round((now - payload.exp) / 86400)}d ago`,
        })
        return NextResponse.json(
          { success: false, error: 'Token expired too long ago. Please log in again.' },
          { status: 401 }
        )
      }

      debugLog('[MOBILE_AUTH] Accepting expired token for refresh', {
        email: payload.email,
        expiredAt: new Date(payload.exp * 1000).toISOString(),
        expiredAgo: `${Math.round((now - payload.exp) / 3600)}h ago`,
      })
    }

    // Verify user still exists in database
    const user = await findUserByEmail(payload.email)
    if (!user) {
      debugLog('[MOBILE_AUTH] Refresh failed - user not found:', payload.email)
      return NextResponse.json(
        { success: false, error: 'User account not found' },
        { status: 404 }
      )
    }

    // Verify user ID matches
    if (user.id !== payload.userId) {
      errorLog('[MOBILE_AUTH] Refresh token user ID mismatch:', {
        tokenUserId: payload.userId,
        dbUserId: user.id,
        email: payload.email,
      })
      return NextResponse.json(
        { success: false, error: 'Token validation failed' },
        { status: 401 }
      )
    }

    // Generate a fresh token (30-day expiry)
    const newToken = generateMobileToken({
      id: user.id,
      email: user.email,
      name: user.name,
      isAdmin: user.isAdmin || false,
      canSeePrices: user.canSeePrices !== false,
    })

    // Return fresh user data (without password)
    const { password: __, ...userWithoutPassword } = user

    const duration = Date.now() - startTime
    debugLog(`[MOBILE_AUTH] Token refresh successful for ${payload.email} in ${duration}ms`)

    return NextResponse.json({
      success: true,
      token: newToken,
      user: userWithoutPassword,
      message: 'Token refreshed successfully',
    })
  } catch (error) {
    const duration = Date.now() - startTime
    errorLog('[MOBILE_AUTH] Token refresh error:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      duration: `${duration}ms`,
      stack: error instanceof Error ? error.stack : undefined,
    })

    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * Handle unsupported HTTP methods
 */
export async function GET() {
  return NextResponse.json(
    { success: false, error: 'Method not allowed' },
    { status: 405 }
  )
}

export async function PUT() {
  return NextResponse.json(
    { success: false, error: 'Method not allowed' },
    { status: 405 }
  )
}

export async function DELETE() {
  return NextResponse.json(
    { success: false, error: 'Method not allowed' },
    { status: 405 }
  )
}
