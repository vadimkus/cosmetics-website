import { NextRequest, NextResponse } from 'next/server'
import { exchangeCodeForTokens, verifyGoogleIdToken } from '@/lib/googleAuth'
import { findUserByEmail, addUser, updateUser } from '@/lib/userStorageDb'
import { errorLog, debugLog } from '@/lib/logger'
import { rateLimitSimple, getClientIdentifierFromNextRequest } from '@/lib/rateLimitSimple'
import { sendAdminNewUserNotification } from '@/lib/email'
import { trackUserAction } from '@/lib/analyticsServer'
import { createSessionToken } from '@/lib/jwt'
import { trackUserActivityNow } from '@/lib/activityTracker'

const googleCallbackLimiter = rateLimitSimple({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // 20 attempts per window
})

/**
 * GET /api/auth/google/callback
 * Handles Google OAuth callback and creates/authenticates user
 */
/**
 * Normalize origin to use localhost instead of 0.0.0.0
 * Google OAuth doesn't accept 0.0.0.0
 */
function normalizeOrigin(origin: string): string {
  let normalized = origin
  
  // Replace 0.0.0.0 with localhost (Google OAuth requirement)
  if (normalized.includes('0.0.0.0')) {
    normalized = normalized.replace('0.0.0.0', 'localhost')
  }
  
  // For localhost, ensure we use http:// (not https://)
  // For production, ensure we use https://
  if (normalized.includes('localhost') || normalized.includes('127.0.0.1')) {
    normalized = normalized.replace('https://', 'http://')
  } else {
    normalized = normalized.replace('http://', 'https://')
  }
  
  return normalized
}

export async function GET(request: NextRequest) {
  const startTime = Date.now()
  debugLog('[GOOGLE_CALLBACK] Request started')

  // Normalize origin for all redirects
  const normalizedOrigin = normalizeOrigin(request.nextUrl.origin)
  debugLog('[GOOGLE_CALLBACK] Original origin:', request.nextUrl.origin)
  debugLog('[GOOGLE_CALLBACK] Normalized origin:', normalizedOrigin)

  // Check if request came from PWA
  const isFromPWA = request.cookies.get('oauth-from-pwa')?.value === 'true'
  const loginPath = isFromPWA ? '/pwa-login' : '/login'

  // Helper function to create error redirect and clean up cookies
  const createErrorRedirect = (errorCode: string) => {
    const response = NextResponse.redirect(
      new URL(`${loginPath}?error=${errorCode}`, normalizedOrigin)
    )
    // Clean up OAuth cookies
    response.cookies.delete('google-oauth-state')
    response.cookies.delete('oauth-from-pwa')
    return response
  }

  try {
    // Apply rate limiting
    let clientIdentifier: string
    try {
      clientIdentifier = getClientIdentifierFromNextRequest(request)
    } catch (rateLimitError) {
      errorLog('[GOOGLE_CALLBACK] Rate limit identifier error:', rateLimitError)
      clientIdentifier = 'unknown'
    }

    const rateLimitResult = await googleCallbackLimiter(clientIdentifier)
    if (!rateLimitResult || !rateLimitResult.success) {
      debugLog('[GOOGLE_CALLBACK] Rate limit exceeded')
      return createErrorRedirect('rate_limit')
    }

    // Get authorization code and state from query parameters
    const searchParams = request.nextUrl.searchParams
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const error = searchParams.get('error')

    // Handle OAuth errors
    if (error) {
      errorLog('[GOOGLE_CALLBACK] OAuth error:', error)
      return createErrorRedirect('oauth_failed')
    }

    // Verify required parameters
    if (!code || !state) {
      errorLog('[GOOGLE_CALLBACK] Missing code or state parameter')
      return createErrorRedirect('invalid_request')
    }

    // Verify state (CSRF protection)
    const storedState = request.cookies.get('google-oauth-state')?.value
    if (!storedState || storedState !== state) {
      errorLog('[GOOGLE_CALLBACK] Invalid state parameter')
      return createErrorRedirect('invalid_state')
    }

    // Get redirect URI (must match exactly what was sent to Google)
    const redirectUri = `${normalizedOrigin}/api/auth/google/callback`
    debugLog('[GOOGLE_CALLBACK] Redirect URI:', redirectUri)

    // Exchange authorization code for tokens
    debugLog('[GOOGLE_CALLBACK] Exchanging code for tokens...')
    const tokens = await exchangeCodeForTokens(code, redirectUri)
    if (!tokens) {
      errorLog('[GOOGLE_CALLBACK] Failed to exchange code for tokens')
      return createErrorRedirect('token_exchange_failed')
    }

    // Verify ID token and get user info
    // Pass access token to fetch picture from userinfo API if not in ID token
    debugLog('[GOOGLE_CALLBACK] Verifying ID token...')
    const googleUser = await verifyGoogleIdToken(tokens.idToken, tokens.accessToken)
    if (!googleUser) {
      errorLog('[GOOGLE_CALLBACK] Failed to verify ID token')
      return createErrorRedirect('token_verification_failed')
    }

    debugLog('[GOOGLE_CALLBACK] Google user verified:', { 
      email: googleUser.email, 
      name: googleUser.name,
      picture: googleUser.picture,
      hasPicture: !!googleUser.picture 
    })

    // Find or create user
    const normalizedEmail = String(googleUser.email || '').trim().toLowerCase()
    let user = await findUserByEmail(normalizedEmail)

    // Detect login source from User-Agent
    const callbackUserAgent = request.headers.get('user-agent') || ''
    const isMobileCallback = /mobile|android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(callbackUserAgent.toLowerCase())
    const loginSource = isMobileCallback ? 'mobile_web' : 'desktop_web'

    if (!user) {
      // Create new user with Google data
      debugLog('[GOOGLE_CALLBACK] Creating new user...')
      try {
        user = await addUser({
          name: googleUser.name,
          email: normalizedEmail,
          password: null, // No password for Google-authenticated users
          profilePicture: googleUser.picture || null,
          phone: null,
          address: null,
          isAdmin: false,
          canSeePrices: true,
          lastLoginAt: new Date().toISOString(),
          lastLoginSource: loginSource,
        })
        debugLog('[GOOGLE_CALLBACK] New user created:', { 
          id: user.id, 
          email: user.email,
          profilePicture: user.profilePicture,
          hasProfilePicture: !!user.profilePicture
        })

        // Update lastActiveAt immediately for online status tracking
        await trackUserActivityNow(user.id)

        // Track user registration
        try {
          await trackUserAction({
            action: 'user_registered',
            userEmail: googleUser.email,
            details: `New user registered via Google OAuth: ${googleUser.name}`
          })
          debugLog('[GOOGLE_CALLBACK] ✅ User registration tracked')
        } catch (trackError) {
          errorLog('[GOOGLE_CALLBACK] ❌ Failed to track user registration:', trackError)
          // Don't fail registration if tracking fails
        }

        // Send admin notification for new Google OAuth user registration
        try {
          debugLog('[GOOGLE_CALLBACK] 📧 Attempting to send admin notification...')
          
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
            googleUser.email,
            undefined, // Phone not available from Google OAuth
            undefined, // Address not available from Google OAuth
            'Google OAuth', // Registration method
            additionalInfo
          )
          
          if (adminResult && adminResult.success) {
            debugLog('[GOOGLE_CALLBACK] ✅ Admin notification sent successfully for new Google OAuth user:', googleUser.email)
            debugLog('[GOOGLE_CALLBACK] ✅ Notification message ID:', adminResult.messageId)
          } else {
            errorLog('[GOOGLE_CALLBACK] ❌ FAILED to send admin notification')
            errorLog('[GOOGLE_CALLBACK] ❌ Error:', adminResult?.error || 'Unknown error')
            errorLog('[GOOGLE_CALLBACK] ❌ Full result:', JSON.stringify(adminResult, null, 2))
          }
        } catch (emailError) {
          errorLog('[GOOGLE_CALLBACK] ❌ EXCEPTION sending admin notification')
          errorLog('[GOOGLE_CALLBACK] ❌ Exception type:', emailError instanceof Error ? emailError.constructor.name : typeof emailError)
          errorLog('[GOOGLE_CALLBACK] ❌ Exception message:', emailError instanceof Error ? emailError.message : String(emailError))
          errorLog('[GOOGLE_CALLBACK] ❌ Exception stack:', emailError instanceof Error ? emailError.stack : 'No stack trace')
          // Don't fail registration if email fails
        }
      } catch (error) {
        // If user creation fails (race condition / constraint), try to find the user and proceed.
        errorLog('[GOOGLE_CALLBACK] Error creating user:', error)
        const existing = await findUserByEmail(normalizedEmail)
        if (existing) {
          user = existing
        } else {
          return createErrorRedirect('user_creation_failed')
        }
      }
    } else {
      // Existing user - always update profile picture with Google picture if available
      debugLog('[GOOGLE_CALLBACK] Existing user found:', {
        id: user.id,
        email: user.email,
        currentProfilePicture: user.profilePicture,
        googlePicture: googleUser.picture,
        willUpdate: !!googleUser.picture
      })
      
      if (googleUser.picture) {
        debugLog('[GOOGLE_CALLBACK] Updating profile picture for existing user...')
        const updateResult = await updateUser(user.id, { profilePicture: googleUser.picture })
        debugLog('[GOOGLE_CALLBACK] Profile picture update result:', updateResult)
        
        // Fetch updated user to verify picture was saved
        const updatedUser = await findUserByEmail(normalizedEmail)
        if (updatedUser) {
          user = updatedUser
          debugLog('[GOOGLE_CALLBACK] User after update:', {
            profilePicture: user.profilePicture,
            hasProfilePicture: !!user.profilePicture
          })
        }
      } else {
        debugLog('[GOOGLE_CALLBACK] No picture provided by Google, skipping update')
      }

      // Update last login timestamp, source, and activity
      await updateUser(user.id, { 
        lastLoginAt: new Date().toISOString(),
        lastLoginSource: loginSource,
      })
      // Update lastActiveAt immediately for online status tracking
      await trackUserActivityNow(user.id)
    }

    // Detect locale from cookie or referer, default to English
    const localeCookie = request.cookies.get('NEXT_LOCALE')?.value
    const referer = request.headers.get('referer') || ''
    let redirectPath = '/products'
    
    // Check locale cookie first (most reliable)
    if (localeCookie === 'ru') {
      redirectPath = '/ru/products'
    } else if (localeCookie === 'ar') {
      redirectPath = '/ar/products'
    } else if (referer.includes('/ru/')) {
      // Fallback to referer if cookie not set
      redirectPath = '/ru/products'
    } else if (referer.includes('/ar/')) {
      redirectPath = '/ar/products'
    }
    // For English (default), use /products without prefix
    
    debugLog('[GOOGLE_CALLBACK] Redirecting to:', redirectPath)
    
    // Clear OAuth cookies and redirect directly to products
    const response = NextResponse.redirect(
      new URL(redirectPath, normalizedOrigin)
    )
    response.cookies.delete('google-oauth-state')
    response.cookies.delete('oauth-from-pwa')

    // Create signed session token (prevents tampering)
    // Fallback to legacy JSON if JWT creation fails (e.g., missing JWT_SECRET)
    let sessionToken: string
    try {
      sessionToken = createSessionToken({
        id: user.id,
        email: user.email,
        name: user.name,
        isAdmin: user.isAdmin || false,
        canSeePrices: user.canSeePrices !== undefined ? user.canSeePrices : true,
        profilePicture: user.profilePicture || null,
      })
      debugLog('[GOOGLE_CALLBACK] Created signed session token')
    } catch (jwtError) {
      // Fallback to legacy JSON format if JWT creation fails
      errorLog('[GOOGLE_CALLBACK] JWT creation failed, using legacy format:', jwtError)
      sessionToken = JSON.stringify({
        id: user.id,
        email: user.email,
        name: user.name,
        isAdmin: user.isAdmin || false,
        canSeePrices: user.canSeePrices !== undefined ? user.canSeePrices : true,
        profilePicture: user.profilePicture || null,
      })
    }

    // Set session cookie
    response.cookies.set('genosys_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/',
    })

    debugLog('[GOOGLE_CALLBACK] Success', Date.now() - startTime, 'ms')
    return response
  } catch (error) {
    errorLog('[GOOGLE_CALLBACK] Error:', error)
    // Check if request came from PWA for error redirect
    const isPWA = request.cookies.get('oauth-from-pwa')?.value === 'true'
    const errorLoginPath = isPWA ? '/pwa-login' : '/login'
    const response = NextResponse.redirect(
      new URL(`${errorLoginPath}?error=internal_error`, normalizeOrigin(request.nextUrl.origin))
    )
    response.cookies.delete('google-oauth-state')
    response.cookies.delete('oauth-from-pwa')
    return response
  }
}

