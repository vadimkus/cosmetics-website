import { NextRequest, NextResponse } from 'next/server'
import { findUserByEmail } from '@/lib/userStorageDb'
import { validateMobileAuth, extractTokenFromHeader } from '@/lib/jwt'
import { debugLog, errorLog } from '@/lib/logger'

/**
 * Mobile Token Validation Endpoint
 * GET /api/mobile/auth/validate
 * 
 * Headers Required:
 * - x-api-key: Mobile app API key
 * - Authorization: Bearer <jwt_token>
 * 
 * Returns:
 * - success: boolean
 * - user: User data (if token is valid)
 * - valid: boolean (token validity status)
 */
export async function GET(request: NextRequest) {
  const startTime = Date.now()
  debugLog('[MOBILE_AUTH] Token validation request started')

  try {
    // Extract API key and JWT token
    const apiKey = request.headers.get('x-api-key')
    const authHeader = request.headers.get('Authorization')
    const token = extractTokenFromHeader(authHeader)

    // Validate API key and token
    const authValidation = validateMobileAuth(apiKey, token)
    
    if (!authValidation.valid) {
      return NextResponse.json(
        { 
          success: false, 
          error: authValidation.error,
          valid: false
        },
        { status: authValidation.status || 500 }
      )
    }

    // If no token provided, just validate API key
    if (!token) {
      return NextResponse.json({
        success: true,
        valid: false,
        message: 'No authentication token provided'
      })
    }

    // Token is valid, get user data
    if (!authValidation.payload) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid token payload',
          valid: false 
        },
        { status: 401 }
      )
    }

    const tokenPayload = authValidation.payload

    // Fetch fresh user data from database to ensure user still exists and get latest info
    const user = await findUserByEmail(tokenPayload.email)
    
    if (!user) {
      // User no longer exists in database
      debugLog('[MOBILE_AUTH] Token valid but user not found:', tokenPayload.email)
      return NextResponse.json(
        { 
          success: false, 
          error: 'User account not found',
          valid: false 
        },
        { status: 404 }
      )
    }

    // Check if user ID matches (additional security check)
    if (user.id !== tokenPayload.userId) {
      errorLog('[MOBILE_AUTH] Token user ID mismatch:', {
        tokenUserId: tokenPayload.userId,
        dbUserId: user.id,
        email: tokenPayload.email
      })
      return NextResponse.json(
        { 
          success: false, 
          error: 'Token validation failed',
          valid: false 
        },
        { status: 401 }
      )
    }

    // Revocation check: password change/reset bumps users.tokenVersion,
    // invalidating all previously issued tokens.
    const userTv = (user as { tokenVersion?: number }).tokenVersion ?? 0
    if ((tokenPayload.tv ?? 0) !== userTv) {
      debugLog('[MOBILE_AUTH] Token revoked (tokenVersion mismatch):', tokenPayload.email)
      return NextResponse.json(
        {
          success: false,
          error: 'Session revoked. Please log in again.',
          valid: false
        },
        { status: 401 }
      )
    }

    // Return fresh user data (without password)
    const { password: __, ...userWithoutPassword } = user

    const duration = Date.now() - startTime
    debugLog(`[MOBILE_AUTH] Token validation successful for ${tokenPayload.email} in ${duration}ms`)

    return NextResponse.json({
      success: true,
      valid: true,
      user: {
        ...userWithoutPassword,
        memberNumber: (user as any).memberNumber || null,
        memberTier: (user as any).memberTier || 'MEMBER',
        memberSince: (user as any).memberSince || null,
      },
      tokenInfo: {
        userId: tokenPayload.userId,
        email: tokenPayload.email,
        issuedAt: tokenPayload.iat ? new Date(tokenPayload.iat * 1000).toISOString() : null,
        expiresAt: tokenPayload.exp ? new Date(tokenPayload.exp * 1000).toISOString() : null
      },
      message: 'Token is valid'
    })

  } catch (error) {
    const duration = Date.now() - startTime
    errorLog('[MOBILE_AUTH] Token validation error:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      duration: `${duration}ms`,
      stack: error instanceof Error ? error.stack : undefined
    })

    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error',
        valid: false 
      },
      { status: 500 }
    )
  }
}

/**
 * Handle unsupported HTTP methods
 */
export async function POST() {
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
