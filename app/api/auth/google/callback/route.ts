import { NextRequest, NextResponse } from 'next/server'
import { exchangeCodeForTokens, verifyGoogleIdToken } from '@/lib/googleAuth'
import { findUserByEmail, addUser, updateUser } from '@/lib/userStorageDb'
import { errorLog, debugLog } from '@/lib/logger'
import { rateLimitSimple, getClientIdentifierFromNextRequest } from '@/lib/rateLimitSimple'

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
    debugLog('[GOOGLE_CALLBACK] Verifying ID token...')
    const googleUser = await verifyGoogleIdToken(tokens.idToken)
    if (!googleUser) {
      errorLog('[GOOGLE_CALLBACK] Failed to verify ID token')
      return NextResponse.redirect(
        new URL('/login?error=token_verification_failed', normalizedOrigin)
      )
    }

    debugLog('[GOOGLE_CALLBACK] Google user verified:', { email: googleUser.email })

    // Find or create user
    let user = await findUserByEmail(googleUser.email)

    if (!user) {
      // Create new user with Google data
      debugLog('[GOOGLE_CALLBACK] Creating new user...')
      try {
        user = await addUser({
          name: googleUser.name,
          email: googleUser.email,
          password: null, // No password for Google-authenticated users
          profilePicture: googleUser.picture || null,
          phone: null,
          address: null,
          isAdmin: false,
          canSeePrices: true,
        })
        debugLog('[GOOGLE_CALLBACK] New user created:', { id: user.id, email: user.email })
      } catch (error) {
        errorLog('[GOOGLE_CALLBACK] Error creating user:', error)
        return NextResponse.redirect(
          new URL('/login?error=user_creation_failed', normalizedOrigin)
        )
      }
    } else {
      // Existing user - update profile picture if available and not set
      if (googleUser.picture && !user.profilePicture) {
        debugLog('[GOOGLE_CALLBACK] Updating profile picture for existing user...')
        await updateUser(user.id, { profilePicture: googleUser.picture })
        user.profilePicture = googleUser.picture
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

