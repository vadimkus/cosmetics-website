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
  // Normalize www → apex domain to avoid cookie/redirect_uri mismatches.
  try {
    const u = new URL(normalized)
    if (u.hostname.startsWith('www.')) {
      u.hostname = u.hostname.replace(/^www\./, '')
      normalized = u.origin
    }
  } catch {
    // ignore
  }
  return normalized
}

function getCookieDomainForRequest(request: NextRequest): string | undefined {
  const host = request.headers.get('host') || ''
  // Allow sharing state/nonce between www and apex in production.
  if (host === 'genosys.ae' || host.endsWith('.genosys.ae')) return '.genosys.ae'
  return undefined
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
    const promo = String(request.nextUrl.searchParams.get('promo') || '').trim().toUpperCase()

    const authUrl = new URL('https://appleid.apple.com/auth/authorize')
    authUrl.searchParams.set('response_type', 'code id_token')
    authUrl.searchParams.set('response_mode', 'form_post')
    authUrl.searchParams.set('client_id', clientId)
    authUrl.searchParams.set('redirect_uri', redirectUri)
    authUrl.searchParams.set('scope', 'name email')
    authUrl.searchParams.set('state', state)
    authUrl.searchParams.set('nonce', nonce)

    const response = NextResponse.redirect(authUrl.toString())
    const domain = getCookieDomainForRequest(request)
    // IMPORTANT: Apple uses `response_mode=form_post` by default, which is a cross-site POST.
    // Cookies with SameSite=Lax are NOT sent on cross-site POST requests, so state/nonce would be missing.
    // In production we must use SameSite=None; Secure to allow the callback POST to include cookies.
    const isProd = process.env.NODE_ENV === 'production'
    const sameSite = isProd ? 'none' : 'lax'
    response.cookies.set('apple-oauth-state', state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite,
      maxAge: 600,
      path: '/',
      ...(domain ? { domain } : {}),
    })
    response.cookies.set('apple-oauth-nonce', nonce, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite,
      maxAge: 600,
      path: '/',
      ...(domain ? { domain } : {}),
    })

    if (promo) {
      response.cookies.set('apple-oauth-promo', promo, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite,
        maxAge: 600,
        path: '/',
        ...(domain ? { domain } : {}),
      })
    }

    debugLog('[APPLE_AUTH] Redirecting to Apple', Date.now() - startTime, 'ms')
    return response
  } catch (error) {
    errorLog('[APPLE_AUTH] Error:', error)
    return NextResponse.redirect(new URL('/login?error=apple_internal_error', request.nextUrl.origin))
  }
}


