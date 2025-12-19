import { NextRequest, NextResponse } from 'next/server'
import { validateMobileAuth, extractTokenFromHeader } from '@/lib/jwt'
import { debugLog, errorLog } from '@/lib/logger'
import { trackUserAction } from '@/lib/analyticsServer'

/**
 * Mobile Logout Endpoint
 * POST /api/mobile/auth/logout
 * 
 * Headers Required:
 * - x-api-key: Mobile app API key
 * - Authorization: Bearer <jwt_token> (optional, for analytics)
 * 
 * Returns:
 * - success: boolean
 * - message: string
 * 
 * Note: Since JWTs are stateless, this endpoint mainly serves for:
 * 1. Server-side analytics/tracking
 * 2. Validating the logout request
 * 3. Providing consistent API response
 * The actual token invalidation happens client-side by removing the token.
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now()
  debugLog('[MOBILE_AUTH] Logout request started')

  try {
    // Extract API key and JWT token
    const apiKey = request.headers.get('x-api-key')
    const authHeader = request.headers.get('Authorization')
    const token = extractTokenFromHeader(authHeader)

    // Validate API key (token is optional for logout)
    const authValidation = validateMobileAuth(apiKey, token)
    
    // API key must be valid, but token can be invalid/expired for logout
    if (!authValidation.valid && (authValidation.status || 500) !== 401) {
      return NextResponse.json(
        { 
          success: false, 
          error: authValidation.error 
        },
        { status: authValidation.status || 500 }
      )
    }

    let userEmail = 'unknown'
    let userName = 'Unknown User'

    // If we have a valid token payload, extract user info for analytics
    if (authValidation.valid && authValidation.payload) {
      userEmail = authValidation.payload.email
      userName = authValidation.payload.name
      
      debugLog('[MOBILE_AUTH] Logging out user:', { email: userEmail, name: userName })
    } else {
      debugLog('[MOBILE_AUTH] Logout request without valid token (client-side cleanup)')
    }

    // Track logout event (if we have user info)
    if (userEmail !== 'unknown') {
      try {
        await trackUserAction({
          action: 'mobile_user_logout',
          userEmail,
          details: `Mobile user logged out: ${userName}`
        })
        debugLog('[MOBILE_AUTH] ✅ Logout event tracked')
      } catch (trackError) {
        errorLog('[MOBILE_AUTH] ❌ Failed to track logout event:', trackError)
        // Don't fail logout if tracking fails
      }
    }

    const duration = Date.now() - startTime
    debugLog(`[MOBILE_AUTH] Logout processed in ${duration}ms`)

    return NextResponse.json({
      success: true,
      message: 'Logout successful. Please remove the authentication token from your app.',
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    const duration = Date.now() - startTime
    errorLog('[MOBILE_AUTH] Logout error:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      duration: `${duration}ms`,
      stack: error instanceof Error ? error.stack : undefined
    })

    // Even if there's an error, we should still indicate successful logout
    // since the main action (token removal) happens client-side
    return NextResponse.json({
      success: true,
      message: 'Logout completed (with server-side processing error)',
      timestamp: new Date().toISOString()
    })
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
