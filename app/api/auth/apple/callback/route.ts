import { NextRequest, NextResponse } from 'next/server'
import { rateLimitSimple, getClientIdentifierFromNextRequest } from '@/lib/rateLimitSimple'
import { debugLog, errorLog } from '@/lib/logger'
import { exchangeAppleCodeForTokens, getAppleWebClientId, getAppleWebRedirectUri } from '@/lib/appleWebAuth'
import { verifyAppleIdentityToken } from '@/lib/appleIdentityToken'
import { addUser, findUserByAppleSub, findUserByEmail, updateUser } from '@/lib/userStorageDb'

const appleCallbackLimiter = rateLimitSimple({
  windowMs: 15 * 60 * 1000,
  max: 20,
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

function getLocaleRedirectPath(request: NextRequest) {
  const localeCookie = request.cookies.get('NEXT_LOCALE')?.value
  const referer = request.headers.get('referer') || ''
  let redirectPath = '/products'
  if (localeCookie === 'ru') redirectPath = '/ru/products'
  else if (localeCookie === 'ar') redirectPath = '/ar/products'
  else if (referer.includes('/ru/')) redirectPath = '/ru/products'
  else if (referer.includes('/ar/')) redirectPath = '/ar/products'
  return redirectPath
}

/**
 * POST /api/auth/apple/callback
 * Handles Apple OAuth callback (response_mode=form_post).
 */
async function handleAppleCallback(request: NextRequest, params: {
  code: string
  state: string
  idTokenFromPost?: string
  userJson?: string
  oauthError?: string
}) {
  const startTime = Date.now()
  debugLog('[APPLE_CALLBACK] Request started')

  const normalizedOrigin = normalizeOrigin(request.nextUrl.origin)

  try {
    let clientIdentifier: string
    try {
      clientIdentifier = getClientIdentifierFromNextRequest(request)
    } catch (e) {
      errorLog('[APPLE_CALLBACK] Rate limit identifier error:', e)
      clientIdentifier = 'unknown'
    }

    const rateLimitResult = await appleCallbackLimiter(clientIdentifier)
    if (!rateLimitResult || !rateLimitResult.success) {
      return NextResponse.redirect(new URL('/login?error=apple_rate_limit', normalizedOrigin))
    }

    const code = String(params.code || '')
    const state = String(params.state || '')
    const idTokenFromPost = String(params.idTokenFromPost || '')
    const userJson = String(params.userJson || '')
    const oauthError = String(params.oauthError || '')

    if (oauthError) {
      errorLog('[APPLE_CALLBACK] OAuth error:', oauthError)
      return NextResponse.redirect(new URL('/login?error=apple_oauth_failed', normalizedOrigin))
    }

    if (!code || !state) {
      return NextResponse.redirect(new URL('/login?error=apple_invalid_request', normalizedOrigin))
    }

    // Verify state
    const storedState = request.cookies.get('apple-oauth-state')?.value
    if (!storedState || storedState !== state) {
      return NextResponse.redirect(new URL('/login?error=apple_invalid_state', normalizedOrigin))
    }

    const clientId = getAppleWebClientId()
    if (!clientId) {
      return NextResponse.redirect(new URL('/login?error=apple_not_configured', normalizedOrigin))
    }

    const redirectUri = getAppleWebRedirectUri(normalizedOrigin)

    // Exchange code for tokens (server-to-server)
    let tokenResponse: any
    try {
      tokenResponse = await exchangeAppleCodeForTokens({
        code,
        origin: normalizedOrigin,
        redirectUri,
        clientId,
      })
    } catch (e) {
      errorLog('[APPLE_CALLBACK] Token exchange failed:', e)
      return NextResponse.redirect(new URL('/login?error=apple_token_exchange_failed', normalizedOrigin))
    }

    const idToken = String(tokenResponse?.id_token || idTokenFromPost || '')
    if (!idToken) {
      return NextResponse.redirect(new URL('/login?error=apple_token_missing', normalizedOrigin))
    }

    // Verify id_token signature + claims
    let claims: any
    try {
      const verified = await verifyAppleIdentityToken(idToken, { audience: clientId })
      claims = verified?.claims
    } catch (e) {
      errorLog('[APPLE_CALLBACK] id_token verification failed:', e)
      return NextResponse.redirect(new URL('/login?error=apple_token_verification_failed', normalizedOrigin))
    }

    // Optional nonce check
    const nonce = request.cookies.get('apple-oauth-nonce')?.value
    if (nonce && claims.nonce && String(claims.nonce) !== String(nonce)) {
      return NextResponse.redirect(new URL('/login?error=apple_invalid_nonce', normalizedOrigin))
    }

    const appleSub = String(claims.sub || '').trim()
    const emailRaw = String(claims.email || '').trim().toLowerCase()
    const email = emailRaw || `apple+${appleSub}@genosys.local`

    // Name is only provided in `user` on first consent
    let fullName = ''
    try {
      if (userJson) {
        const parsed = JSON.parse(userJson)
        const given = parsed?.name?.firstName || ''
        const family = parsed?.name?.lastName || ''
        fullName = [given, family].filter(Boolean).join(' ').trim()
      }
    } catch {
      // ignore
    }
    if (!fullName) fullName = email.split('@')[0] || 'User'

    // Find or create/link user
    let user = await findUserByAppleSub(appleSub)

    // If not found by appleSub, try linking by email (common for existing accounts).
    if (!user && emailRaw) {
      const byEmail = await findUserByEmail(email)
      if (byEmail) {
        // If email user already linked to another appleSub, prefer the appleSub record (if any),
        // otherwise keep the existing account and avoid throwing.
        if (byEmail.appleSub && String(byEmail.appleSub) !== appleSub) {
          const bySub = await findUserByAppleSub(appleSub)
          if (bySub) user = bySub
          else user = byEmail
        } else {
          // Link account (guard against unique constraint errors)
          try {
            await updateUser(byEmail.id, { appleSub })
          } catch (e) {
            errorLog('[APPLE_CALLBACK] Failed to link appleSub to existing email user:', e)
          }
          user = (await findUserByAppleSub(appleSub)) || (await findUserByEmail(email)) || byEmail
        }
      }
    }

    // If still no user, create a new one. Handle duplicates gracefully (common on retries / private relay).
    if (!user) {
      try {
        user = await addUser({
          name: fullName,
          email,
          appleSub,
          password: null,
          profilePicture: null,
          phone: null,
          address: null,
          isAdmin: false,
          canSeePrices: true,
          lastLoginAt: new Date().toISOString(),
        })
      } catch (e) {
        errorLog('[APPLE_CALLBACK] User create failed, attempting recovery:', e)
        user =
          (await findUserByAppleSub(appleSub)) ||
          (emailRaw ? await findUserByEmail(email) : null)

        if (!user) {
          return NextResponse.redirect(new URL('/login?error=apple_user_creation_failed', normalizedOrigin))
        }

        // Best-effort: ensure appleSub is linked
        if (!user.appleSub) {
          try {
            await updateUser(user.id, { appleSub })
          } catch (linkErr) {
            errorLog('[APPLE_CALLBACK] Recovery link appleSub failed:', linkErr)
          }
        }
      }
    } else {
      try {
        await updateUser(user.id, { lastLoginAt: new Date().toISOString() })
      } catch (e) {
        errorLog('[APPLE_CALLBACK] Failed to update lastLoginAt:', e)
        // don't fail login
      }
    }

    const redirectPath = getLocaleRedirectPath(request)
    // IMPORTANT: This callback is typically a cross-site POST (response_mode=form_post).
    // NextResponse.redirect defaults to 307 which preserves the method, causing a POST to /products → 405.
    // Use 303 See Other to force a GET on the redirected page.
    const response = NextResponse.redirect(new URL(redirectPath, normalizedOrigin), 303)

    // Clear oauth cookies
    response.cookies.delete('apple-oauth-state')
    response.cookies.delete('apple-oauth-nonce')

    // Set session cookie (same format as Google)
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
      maxAge: 30 * 24 * 60 * 60,
      path: '/',
    })

    debugLog('[APPLE_CALLBACK] Success', Date.now() - startTime, 'ms')
    return response
  } catch (error) {
    errorLog('[APPLE_CALLBACK] Error:', error)
    return NextResponse.redirect(new URL('/login?error=apple_internal_error', normalizedOrigin))
  }
}

export async function POST(request: NextRequest) {
  const form = await request.formData()
  return handleAppleCallback(request, {
    code: String(form.get('code') || ''),
    state: String(form.get('state') || ''),
    idTokenFromPost: String(form.get('id_token') || ''),
    userJson: String(form.get('user') || ''),
    oauthError: String(form.get('error') || ''),
  })
}

/**
 * Some Apple flows can return to the callback using GET (response_mode=query).
 * Handle GET as well to avoid HTTP 405 pages.
 */
export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams
  const code = String(sp.get('code') || '')
  const state = String(sp.get('state') || '')
  const oauthError = String(sp.get('error') || '')

  // If this isn't an OAuth callback, just bounce to login.
  if (!code || !state) {
    const normalizedOrigin = normalizeOrigin(request.nextUrl.origin)
    return NextResponse.redirect(new URL('/login?error=apple_invalid_request', normalizedOrigin))
  }

  return handleAppleCallback(request, {
    code,
    state,
    oauthError,
    // Apple typically won't include these in query mode; we can still exchange code for tokens.
    idTokenFromPost: String(sp.get('id_token') || ''),
    userJson: String(sp.get('user') || ''),
  })
}


