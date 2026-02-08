import { NextRequest, NextResponse } from 'next/server'
import { verifyMobileToken } from '@/lib/jwt'
import { createSessionToken } from '@/lib/jwt'
import { findUserById } from '@/lib/userStorageDb'
import { MOBILE_APP_KEY } from '@/lib/envValidation'
import { debugLog, errorLog } from '@/lib/logger'

/**
 * GET /api/auth/mobile-session
 *
 * Bridge endpoint that converts a mobile JWT token into a web session cookie.
 * Used by the native app's WebView to establish an authenticated session before
 * loading pages like /bundle-builder that require the `genosys_session` cookie.
 *
 * Query params:
 *   - token: Mobile JWT token (required)
 *   - apiKey: Mobile API key for verification (required)
 *   - redirect: Target URL path to redirect to after setting cookie (required)
 *   - locale: Locale prefix (optional, e.g. "ar", "ru")
 *
 * Flow:
 *   1. Native app opens WebView → this endpoint with token + redirect
 *   2. Endpoint validates mobile JWT, looks up user
 *   3. Sets `genosys_session` cookie
 *   4. 302 redirects to the target page (now authenticated)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')
    const apiKey = searchParams.get('apiKey')
    const redirect = searchParams.get('redirect') || '/bundle-builder'
    const locale = searchParams.get('locale') || ''

    // Validate required params
    if (!token || !apiKey) {
      debugLog('[MOBILE-SESSION] Missing token or apiKey')
      return redirectWithoutSession(redirect, locale, request)
    }

    // Verify API key
    const expectedKey = MOBILE_APP_KEY
    if (!expectedKey || apiKey !== expectedKey) {
      debugLog('[MOBILE-SESSION] Invalid API key')
      return redirectWithoutSession(redirect, locale, request)
    }

    // Verify mobile JWT token
    let payload
    try {
      payload = verifyMobileToken(token)
    } catch (tokenErr) {
      errorLog('[MOBILE-SESSION] Token verification threw:', tokenErr)
      return redirectWithoutSession(redirect, locale, request)
    }
    if (!payload) {
      debugLog('[MOBILE-SESSION] Invalid or expired mobile token')
      return redirectWithoutSession(redirect, locale, request)
    }

    debugLog('[MOBILE-SESSION] Token valid for userId:', payload.userId)

    // Look up user in database to get latest data
    let user
    try {
      user = await findUserById(payload.userId)
    } catch (dbErr) {
      errorLog('[MOBILE-SESSION] DB lookup failed:', dbErr)
      return redirectWithoutSession(redirect, locale, request)
    }
    if (!user) {
      debugLog('[MOBILE-SESSION] User not found for userId:', payload.userId)
      return redirectWithoutSession(redirect, locale, request)
    }

    debugLog('[MOBILE-SESSION] User found:', user.email)

    // Create a web session token (same format as regular login)
    let sessionToken
    try {
      sessionToken = createSessionToken({
        id: user.id,
        email: user.email,
        name: user.name || '',
        isAdmin: user.isAdmin || false,
        canSeePrices: user.canSeePrices !== false,
        profilePicture: user.profilePicture || null,
      })
    } catch (sessionErr) {
      errorLog('[MOBILE-SESSION] Session token creation failed:', sessionErr)
      return redirectWithoutSession(redirect, locale, request)
    }

    debugLog('[MOBILE-SESSION] Session created for user:', user.email)

    // Build the redirect URL
    const localePrefix = locale && locale !== 'en' ? `/${locale}` : ''
    const redirectPath = redirect.startsWith('/') ? redirect : `/${redirect}`
    const finalUrl = `${localePrefix}${redirectPath}`

    // Build absolute redirect URL
    const origin = new URL(request.url).origin
    const absoluteRedirectUrl = `${origin}${finalUrl}`

    // Create redirect response with session cookie
    const response = NextResponse.redirect(absoluteRedirectUrl, 302)

    response.cookies.set('genosys_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/',
    })

    return response
  } catch (error) {
    errorLog('[MOBILE-SESSION] Unhandled error:', error)
    // On any error, just redirect without session
    try {
      const parsedUrl = new URL(request.url)
      const fallbackRedirect = parsedUrl.searchParams.get('redirect') || '/bundle-builder'
      return NextResponse.redirect(`${parsedUrl.origin}${fallbackRedirect}`, 302)
    } catch {
      // Last resort: redirect to home
      return NextResponse.redirect('https://genosys.ae/bundle-builder', 302)
    }
  }
}

/**
 * Helper: redirect to the target page without setting a session cookie.
 * This way the user still sees the page (just unauthenticated) rather than an error.
 */
function redirectWithoutSession(
  redirect: string,
  locale: string,
  request: NextRequest
): NextResponse {
  const localePrefix = locale && locale !== 'en' ? `/${locale}` : ''
  const redirectPath = redirect.startsWith('/') ? redirect : `/${redirect}`
  const finalPath = `${localePrefix}${redirectPath}`
  const origin = new URL(request.url).origin
  return NextResponse.redirect(`${origin}${finalPath}`, 302)
}
