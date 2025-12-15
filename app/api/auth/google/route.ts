import { NextRequest, NextResponse } from 'next/server'
import { getGoogleAuthUrl } from '@/lib/googleAuth'
import { generateCsrfToken } from '@/lib/csrf'
import { errorLog, debugLog } from '@/lib/logger'
import { rateLimitSimple, getClientIdentifierFromNextRequest } from '@/lib/rateLimitSimple'
import crypto from 'crypto'

const googleAuthLimiter = rateLimitSimple({
  windowMs: 15 * 60 * 1000, // 15 minutes
  // OAuth initiation can be hit multiple times by retries/prefetch; keep this lenient.
  max: 60,
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

    // If IP is not available (can happen behind some proxies), use a cookie-based identifier
    // so we don't accidentally rate-limit all users into the same "unknown" bucket.
    if (clientIdentifier.startsWith('unknown-')) {
      const existing = request.cookies.get('google-oauth-rlid')?.value
      const rlid = existing || crypto.randomBytes(16).toString('hex')
      const ua = request.headers.get('user-agent') || 'unknown'
      clientIdentifier = `cookie-${rlid}-${Buffer.from(ua).toString('base64').slice(0, 10)}`
    }

    const rateLimitResult = await googleAuthLimiter(clientIdentifier)
    if (!rateLimitResult || !rateLimitResult.success) {
      debugLog('[GOOGLE_AUTH] Rate limit exceeded')
      // Redirect back to login with a friendly message (better than showing raw JSON).
      return NextResponse.redirect(new URL('/login?error=rate_limit', request.nextUrl.origin))
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

    // Store state in cookie for verification in callback
    const response = NextResponse.redirect(authUrl)
    // Persist cookie-based RL id if we had to fall back to it
    if (clientIdentifier.startsWith('cookie-')) {
      const current = request.cookies.get('google-oauth-rlid')?.value
      if (!current) {
        const cookieId = clientIdentifier.split('-')[1] || crypto.randomBytes(16).toString('hex')
        response.cookies.set('google-oauth-rlid', cookieId, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 30 * 24 * 60 * 60, // 30 days
          path: '/',
        })
      }
    }
    response.cookies.set('google-oauth-state', state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 600, // 10 minutes
      path: '/',
    })

    return response
  } catch (error) {
    errorLog('[GOOGLE_AUTH] Error:', error)
    return NextResponse.json(
      { error: 'Failed to initiate Google Sign-In. Please try again.' },
      { status: 500 }
    )
  }
}

