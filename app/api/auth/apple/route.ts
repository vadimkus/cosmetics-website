import { NextRequest, NextResponse } from 'next/server'
import { generateCsrfToken } from '@/lib/csrf'
import { rateLimitSimple, getClientIdentifierFromNextRequest } from '@/lib/rateLimitSimple'
import { debugLog, errorLog } from '@/lib/logger'
import { getAppleWebClientId, getAppleWebRedirectUri } from '@/lib/appleWebAuth'

const appleAuthLimiter = rateLimitSimple({
  windowMs: 15 * 60 * 1000,
  max: 10,
})

function normalizeOrigin(origin: string): string {
  let normalized = origin
  if (normalized.includes('0.0.0.0')) normalized = normalized.replace('0.0.0.0', 'localhost')
  if (normalized.includes('localhost') || normalized.includes('127.0.0.1')) {
    normalized = normalized.replace('https://', 'http://')
  } else {
    normalized = normalized.replace('http://', 'https://')
  }
  return normalized
}

/**
 * GET /api/auth/apple
 * Initiates Apple OAuth flow by redirecting to Apple's authorization screen.
 *
 * Requires Apple web env vars:
 * - APPLE_WEB_SERVICE_ID (client_id)
 * - APPLE_TEAM_ID, APPLE_KEY_ID, APPLE_PRIVATE_KEY (used in callback for token exchange)
 * - APPLE_WEB_REDIRECT_URI (optional override; otherwise uses `${origin}/api/auth/apple/callback`)
 */
export async function GET(request: NextRequest) {
  const startTime = Date.now()
  debugLog('[APPLE_AUTH] Request started')

  try {
    let clientIdentifier: string
    try {
      clientIdentifier = getClientIdentifierFromNextRequest(request)
    } catch (e) {
      errorLog('[APPLE_AUTH] Rate limit identifier error:', e)
      clientIdentifier = 'unknown'
    }

    const rateLimitResult = await appleAuthLimiter(clientIdentifier)
    if (!rateLimitResult || !rateLimitResult.success) {
      return NextResponse.redirect(new URL('/login?error=apple_rate_limit', request.nextUrl.origin))
    }

    const clientId = getAppleWebClientId()
    if (!clientId) {
      return NextResponse.redirect(new URL('/login?error=apple_not_configured', request.nextUrl.origin))
    }

    const origin = normalizeOrigin(request.nextUrl.origin)
    const redirectUri = getAppleWebRedirectUri(origin)

    const state = generateCsrfToken()
    const nonce = generateCsrfToken()

    const authUrl = new URL('https://appleid.apple.com/auth/authorize')
    authUrl.searchParams.set('response_type', 'code id_token')
    authUrl.searchParams.set('response_mode', 'form_post')
    authUrl.searchParams.set('client_id', clientId)
    authUrl.searchParams.set('redirect_uri', redirectUri)
    authUrl.searchParams.set('scope', 'name email')
    authUrl.searchParams.set('state', state)
    authUrl.searchParams.set('nonce', nonce)

    const response = NextResponse.redirect(authUrl.toString())
    response.cookies.set('apple-oauth-state', state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 600,
      path: '/',
    })
    response.cookies.set('apple-oauth-nonce', nonce, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 600,
      path: '/',
    })

    debugLog('[APPLE_AUTH] Redirecting to Apple', Date.now() - startTime, 'ms')
    return response
  } catch (error) {
    errorLog('[APPLE_AUTH] Error:', error)
    return NextResponse.redirect(new URL('/login?error=apple_internal_error', request.nextUrl.origin))
  }
}


