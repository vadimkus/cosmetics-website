import { NextRequest, NextResponse } from 'next/server'
import { exchangeCodeForTokens, verifyGoogleIdToken } from '@/lib/googleAuth'
import { findUserByEmail, addUser, updateUser } from '@/lib/userStorageDb'
import { errorLog, debugLog } from '@/lib/logger'
import { rateLimitSimple, getClientIdentifierFromNextRequest } from '@/lib/rateLimitSimple'
import { sendAdminNewUserNotification } from '@/lib/email'
import { trackUserAction } from '@/lib/analyticsServer'

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
      return NextResponse.redirect(
        new URL('/login?error=rate_limit', normalizedOrigin)
      )
    }

    // Get authorization code and state from query parameters
    const searchParams = request.nextUrl.searchParams
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const error = searchParams.get('error')

    // Handle OAuth errors
    if (error) {
      errorLog('[GOOGLE_CALLBACK] OAuth error:', error)
      return NextResponse.redirect(
        new URL('/login?error=oauth_failed', normalizedOrigin)
      )
    }

    // Verify required parameters
    if (!code || !state) {
      errorLog('[GOOGLE_CALLBACK] Missing code or state parameter')
      return NextResponse.redirect(
        new URL('/login?error=invalid_request', normalizedOrigin)
      )
    }

    // Verify state (CSRF protection)
    const storedState = request.cookies.get('google-oauth-state')?.value
    if (!storedState || storedState !== state) {
      errorLog('[GOOGLE_CALLBACK] Invalid state parameter')
      return NextResponse.redirect(
        new URL('/login?error=invalid_state', normalizedOrigin)
      )
    }

    // Get redirect URI (must match exactly what was sent to Google)
    const redirectUri = `${normalizedOrigin}/api/auth/google/callback`
    debugLog('[GOOGLE_CALLBACK] Redirect URI:', redirectUri)

    // Exchange authorization code for tokens
    debugLog('[GOOGLE_CALLBACK] Exchanging code for tokens...')
    const tokens = await exchangeCodeForTokens(code, redirectUri)
    if (!tokens) {
      errorLog('[GOOGLE_CALLBACK] Failed to exchange code for tokens')
      return NextResponse.redirect(
        new URL('/login?error=token_exchange_failed', normalizedOrigin)
      )
    }

    // Verify ID token and get user info
    // Pass access token to fetch picture from userinfo API if not in ID token
    debugLog('[GOOGLE_CALLBACK] Verifying ID token...')
    const googleUser = await verifyGoogleIdToken(tokens.idToken, tokens.accessToken)
    if (!googleUser) {
      errorLog('[GOOGLE_CALLBACK] Failed to verify ID token')
      return NextResponse.redirect(
        new URL('/login?error=token_verification_failed', normalizedOrigin)
      )
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
        })
        debugLog('[GOOGLE_CALLBACK] New user created:', { 
          id: user.id, 
          email: user.email,
          profilePicture: user.profilePicture,
          hasProfilePicture: !!user.profilePicture
        })

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
          const adminResult = await sendAdminNewUserNotification(
            googleUser.name,
            googleUser.email,
            undefined, // Phone not available from Google OAuth
            undefined, // Address not available from Google OAuth
            'Google OAuth' // Registration method
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
          return NextResponse.redirect(
            new URL('/login?error=user_creation_failed', normalizedOrigin)
          )
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

      // Update last login timestamp
      await updateUser(user.id, { lastLoginAt: new Date().toISOString() })
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
    
    // Clear the state cookie and redirect directly to products
    const response = NextResponse.redirect(
      new URL(redirectPath, normalizedOrigin)
    )
    response.cookies.delete('google-oauth-state')

    // Set user session cookie (similar to regular login)
    // Store minimal user data in a secure cookie
    const userSessionData = {
      id: user.id,
      email: user.email,
      name: user.name,
      isAdmin: user.isAdmin || false,
      canSeePrices: user.canSeePrices !== undefined ? user.canSeePrices : true,
      profilePicture: user.profilePicture || null,
    }

    response.cookies.set('genosys_session', JSON.stringify(userSessionData), {
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
    const normalizedOrigin = normalizeOrigin(request.nextUrl.origin)
    return NextResponse.redirect(
      new URL('/login?error=internal_error', normalizedOrigin)
    )
  }
}

