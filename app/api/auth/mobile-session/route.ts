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
    const payload = verifyMobileToken(token)
    if (!payload) {
      debugLog('[MOBILE-SESSION] Invalid or expired mobile token')
      return redirectWithoutSession(redirect, locale, request)
    }

    // Look up user in database to get latest data
    const user = await findUserById(payload.userId)
    if (!user) {
      debugLog('[MOBILE-SESSION] User not found for userId:', payload.userId)
      return redirectWithoutSession(redirect, locale, request)
    }

    // Create a web session token (same format as regular login)
    const sessionToken = createSessionToken({
      id: user.id,
      email: user.email,
      name: user.name,
      isAdmin: user.isAdmin || false,
      canSeePrices: user.canSeePrices !== undefined ? user.canSeePrices : true,
      profilePicture: user.profilePicture || null,
    })

    debugLog('[MOBILE-SESSION] Session created for user:', user.email)

    // Build the redirect URL
    const localePrefix = locale && locale !== 'en' ? `/${locale}` : ''
    const redirectPath = redirect.startsWith('/') ? redirect : `/${redirect}`
    const finalUrl = `${localePrefix}${redirectPath}`

    // Create redirect response with session cookie
    const response = NextResponse.redirect(new URL(finalUrl, request.url), 302)

    response.cookies.set('genosys_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/',
    })

    return response
  } catch (error) {
    errorLog('[MOBILE-SESSION] Error:', error)
    // On any error, just redirect without session
    const redirect = new URL(request.url).searchParams.get('redirect') || '/bundle-builder'
    return NextResponse.redirect(new URL(redirect, request.url), 302)
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
  const finalUrl = `${localePrefix}${redirectPath}`
  return NextResponse.redirect(new URL(finalUrl, request.url), 302)
}
