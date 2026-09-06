import { NextRequest, NextResponse } from 'next/server'
import { isSafeReturnPath, POST_LOGIN_REDIRECT_COOKIE } from '@/lib/loginReturn'
import { getGoogleAuthUrl } from '@/lib/googleAuth'
import { generateCsrfToken } from '@/lib/csrf'
import { errorLog, debugLog } from '@/lib/logger'
import { rateLimitSimple, getClientIdentifierFromNextRequest } from '@/lib/rateLimitSimple'

const googleAuthLimiter = rateLimitSimple({
  name: 'google',
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 attempts per window
})

/**
 * GET /api/auth/google
 * Initiates Google OAuth flow by redirecting to Google's consent screen
 */
export async function GET(request: NextRequest) {
  const startTime = Date.now()
  debugLog('[GOOGLE_AUTH] Request started')

  try {
    // Apply rate limiting
    let clientIdentifier: string
    try {
      clientIdentifier = getClientIdentifierFromNextRequest(request)
    } catch (rateLimitError) {
      errorLog('[GOOGLE_AUTH] Rate limit identifier error:', rateLimitError)
      clientIdentifier = 'unknown'
    }

    const rateLimitResult = await googleAuthLimiter(clientIdentifier)
    if (!rateLimitResult || !rateLimitResult.success) {
      debugLog('[GOOGLE_AUTH] Rate limit exceeded')
      return NextResponse.json(
        { error: rateLimitResult?.message || 'Rate limit exceeded' },
        { status: 429 }
      )
    }

    // Get the redirect URI from the request
    // Google doesn't accept 0.0.0.0, so we need to use localhost for local development
    let origin = request.headers.get('origin') || request.nextUrl.origin
    
    // Replace 0.0.0.0 with localhost (Google OAuth requirement)
    if (origin.includes('0.0.0.0')) {
      origin = origin.replace('0.0.0.0', 'localhost')
    }
    
    // For localhost, ensure we use http:// (not https://)
    // For production, ensure we use https://
    if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
      origin = origin.replace('https://', 'http://')
    } else {
      origin = origin.replace('http://', 'https://')
    }
    
    const redirectUri = `${origin}/api/auth/google/callback`
    
    debugLog('[GOOGLE_AUTH] Original origin:', request.headers.get('origin') || request.nextUrl.origin)
    debugLog('[GOOGLE_AUTH] Fixed origin:', origin)
    debugLog('[GOOGLE_AUTH] Redirect URI:', redirectUri)

    // Generate CSRF token for state parameter
    const state = generateCsrfToken()

    // Generate Google OAuth URL
    const authUrl = getGoogleAuthUrl(redirectUri, state)
    if (!authUrl) {
      errorLog('[GOOGLE_AUTH] Google OAuth not configured')
      return NextResponse.json(
        { error: 'Google Sign-In is not configured. Please contact support.' },
        { status: 503 }
      )
    }

    debugLog('[GOOGLE_AUTH] Generated auth URL', Date.now() - startTime, 'ms')

    // Check if request is from PWA
    const fromPWA = request.nextUrl.searchParams.get('from_pwa') === 'true'

    // Store state in cookie for verification in callback
    const response = NextResponse.redirect(authUrl)
    response.cookies.set('google-oauth-state', state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 600, // 10 minutes
      path: '/',
    })

    // Store PWA flag for callback redirect
    if (fromPWA) {
      response.cookies.set('oauth-from-pwa', 'true', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 600, // 10 minutes
        path: '/',
      })
    }

    // Post-login return path from /login?redirect=..., carried across the
    // provider round trip in a short-lived cookie for the callback.
    const returnTo = request.nextUrl.searchParams.get('redirect')
    if (isSafeReturnPath(returnTo)) {
      response.cookies.set(POST_LOGIN_REDIRECT_COOKIE, returnTo, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 600,
        path: '/',
      })
    }

    return response
  } catch (error) {
    errorLog('[GOOGLE_AUTH] Error:', error)
    return NextResponse.json(
      { error: 'Failed to initiate Google Sign-In. Please try again.' },
      { status: 500 }
    )
  }
}

