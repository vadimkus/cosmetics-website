import { NextRequest, NextResponse } from 'next/server'
import { verifyGoogleIdToken } from '@/lib/googleAuth'
import { findUserByEmail, addUser, updateUser } from '@/lib/userStorageDb'
import { generateMobileToken, validateMobileAuth } from '@/lib/jwt'
import { rateLimitSimple, getClientIdentifierFromNextRequest } from '@/lib/rateLimitSimple'
import { debugLog, errorLog } from '@/lib/logger'
import { trackUserAction } from '@/lib/analyticsServer'
import { sendAdminNewUserNotification } from '@/lib/email'

// Rate limiting for mobile Google OAuth
const mobileGoogleLimiter = rateLimitSimple({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // 20 attempts per window
})

/**
 * Mobile Google OAuth Endpoint
 * POST /api/mobile/auth/google
 * 
 * Headers Required:
 * - x-api-key: Mobile app API key
 * - Content-Type: application/json
 * 
 * Body:
 * - idToken: Google ID token from mobile app
 * 
 * Returns:
 * - success: boolean
 * - user: User data (without password)
 * - token: JWT authentication token
 * - isNewUser: boolean (true if account was just created)
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now()
  debugLog('[MOBILE_AUTH] Google OAuth request started')

  try {
    // Validate API key
    const apiKey = request.headers.get('x-api-key')
    const authValidation = validateMobileAuth(apiKey, null)
    
    if (!authValidation.valid) {
      return NextResponse.json(
        { 
          success: false, 
          error: authValidation.error 
        },
        { status: authValidation.status || 500 }
      )
    }

    // Apply rate limiting
    let clientIdentifier: string
    try {
      clientIdentifier = getClientIdentifierFromNextRequest(request)
    } catch (error) {
      errorLog('[MOBILE_AUTH] Rate limit identifier error:', error)
      clientIdentifier = 'unknown'
    }

    const rateLimitResult = await mobileGoogleLimiter(clientIdentifier)
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Too many authentication attempts. Please try again later.' 
        },
        { status: 429 }
      )
    }

    // Parse request body
    const { idToken } = await request.json()

    if (!idToken) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Google ID token is required' 
        },
        { status: 400 }
      )
    }

    // Verify Google ID token and get user info
    debugLog('[MOBILE_AUTH] Verifying Google ID token...')
    const googleUser = await verifyGoogleIdToken(idToken)
    if (!googleUser) {
      errorLog('[MOBILE_AUTH] Failed to verify Google ID token')
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid Google ID token' 
        },
        { status: 401 }
      )
    }

    const normalizedEmail = String(googleUser.email || '').trim().toLowerCase()
    const normalizedName =
      String(googleUser.name || '').trim() ||
      (normalizedEmail ? normalizedEmail.split('@')[0] : '') ||
      'User'
    debugLog('[MOBILE_AUTH] Google user verified:', { email: normalizedEmail })

    // Find existing user or create new one
    let user = await findUserByEmail(normalizedEmail)
    let isNewUser = false

    if (!user) {
      // Create new user with Google data
      debugLog('[MOBILE_AUTH] Creating new user from Google OAuth...')
      isNewUser = true
      
      try {
        user = await addUser({
          name: normalizedName,
          email: normalizedEmail,
          password: null, // No password for Google-authenticated users
          profilePicture: googleUser.picture || null,
          phone: null,
          address: null,
          isAdmin: false,
          canSeePrices: true,
          discountType: null,
          discountPercentage: null,
          birthday: null,
          lastLoginAt: new Date().toISOString()
        })
        
        debugLog('[MOBILE_AUTH] New user created:', { id: user.id, email: user.email })

        // Track user registration
        try {
          await trackUserAction({
            action: 'mobile_user_registered',
            userEmail: normalizedEmail,
            details: `New mobile user registered via Google OAuth: ${googleUser.name}`
          })
          debugLog('[MOBILE_AUTH] ✅ User registration tracked')
        } catch (trackError) {
          errorLog('[MOBILE_AUTH] ❌ Failed to track user registration:', trackError)
          // Don't fail registration if tracking fails
        }

        // Send admin notification for new Google OAuth user registration
        try {
          // Get client information
          const userAgent = request.headers.get('user-agent') || 'Unknown'
          const forwarded = request.headers.get('x-forwarded-for')
          const ipAddress = (forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip')) || 'Unknown'
          
          // Import device detection and geolocation utilities
          const { parseUserAgent } = await import('@/lib/deviceDetection')
          const { getGeolocationData } = await import('@/lib/geolocation')
          
          // Parse device information
          const deviceInfo = parseUserAgent(userAgent)
          
          // Get geolocation data
          const geoData = await getGeolocationData(ipAddress)
          
          // Build additionalInfo object, only including defined values
          const additionalInfo: Record<string, string | number> = {}
          if (ipAddress) additionalInfo.ipAddress = ipAddress
          if (geoData?.country) additionalInfo.country = geoData.country
          if (geoData?.city) additionalInfo.city = geoData.city
          additionalInfo.deviceType = deviceInfo.deviceType as string
          if (deviceInfo.deviceModel) additionalInfo.deviceModel = deviceInfo.deviceModel
          if (deviceInfo.os) additionalInfo.os = deviceInfo.os
          if (deviceInfo.browser) additionalInfo.browser = deviceInfo.browser
          
          const adminResult = await sendAdminNewUserNotification(
            googleUser.name,
            normalizedEmail,
            undefined, // Phone not available from Google OAuth
            undefined, // Address not available from Google OAuth
            'Mobile App - Google OAuth', // Registration method
            additionalInfo
          )
          
          if (adminResult?.success) {
            debugLog('[MOBILE_AUTH] ✅ Admin notification sent for new Google OAuth user:', normalizedEmail)
          } else {
            errorLog('[MOBILE_AUTH] ❌ Failed to send admin notification:', adminResult?.error || 'Unknown error')
          }
        } catch (error) {
          errorLog('[MOBILE_AUTH] ❌ Exception sending admin notification:', error)
          // Don't fail registration if email fails
        }

      } catch (error) {
        errorLog('[MOBILE_AUTH] Error creating user from Google OAuth:', error)
        // Race-safe fallback: if the user was created in a concurrent request, recover by fetching.
        const existing = await findUserByEmail(normalizedEmail)
        if (existing) {
          user = existing
          isNewUser = false
        } else {
          return NextResponse.json(
            { 
              success: false, 
              error: 'Failed to create user account' 
            },
            { status: 500 }
          )
        }
      }
    } else {
      // Existing user - update profile picture if available and not set
      if (googleUser.picture && !user.profilePicture) {
        debugLog('[MOBILE_AUTH] Updating profile picture for existing user...')
        try {
          await updateUser(user.id, { profilePicture: googleUser.picture })
          user.profilePicture = googleUser.picture
        } catch (error) {
          errorLog('[MOBILE_AUTH] Error updating profile picture:', error)
          // Don't fail login if profile picture update fails
        }
      }

      // Update last login timestamp
      try {
        await updateUser(user.id, { lastLoginAt: new Date().toISOString() })
      } catch (error) {
        errorLog('[MOBILE_AUTH] Error updating last login timestamp:', error)
        // Don't fail login if timestamp update fails
      }
    }

    // Generate JWT token
    const token = generateMobileToken({
      id: user.id,
      email: user.email,
      name: user.name,
      isAdmin: user.isAdmin || false,
      canSeePrices: user.canSeePrices !== false
    })

    // Return user data without password
    const { password: __, ...userWithoutPassword } = user

    const duration = Date.now() - startTime
    debugLog(`[MOBILE_AUTH] Google OAuth ${isNewUser ? 'registration' : 'login'} successful for ${googleUser.email} in ${duration}ms`)

    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
      token,
      isNewUser,
      message: isNewUser ? 'Account created successfully' : 'Login successful'
    })

  } catch (error) {
    const duration = Date.now() - startTime
    errorLog('[MOBILE_AUTH] Google OAuth error:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      duration: `${duration}ms`,
      stack: error instanceof Error ? error.stack : undefined
    })

    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error' 
      },
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
