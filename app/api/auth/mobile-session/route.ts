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
 * Returns a tiny HTML page that sets the cookie (via Set-Cookie header) and
 * then navigates to the target page via JavaScript. This avoids 302-redirect
 * + Set-Cookie issues that some WebView implementations handle poorly.
 *
 * Query params:
 *   - token: Mobile JWT token (required)
 *   - apiKey: Mobile API key for verification (required)
 *   - redirect: Target URL path to redirect to after setting cookie (required)
 *   - locale: Locale prefix (optional, e.g. "ar", "ru")
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const redirect = searchParams.get('redirect') || '/bundle-builder'
  const locale = searchParams.get('locale') || ''
  const token = searchParams.get('token')
  const apiKey = searchParams.get('apiKey')

  // Build the final target URL
  const localePrefix = locale && locale !== 'en' ? `/${locale}` : ''
  const redirectPath = redirect.startsWith('/') ? redirect : `/${redirect}`
  const targetPath = `${localePrefix}${redirectPath}`

  try {
    // Validate required params
    if (!token || !apiKey) {
      debugLog('[MOBILE-SESSION] Missing token or apiKey')
      return htmlRedirect(targetPath)
    }

    // Verify API key
    const expectedKey = MOBILE_APP_KEY
    if (!expectedKey || apiKey !== expectedKey) {
      debugLog('[MOBILE-SESSION] Invalid API key')
      return htmlRedirect(targetPath)
    }

    // Verify mobile JWT token
    const payload = verifyMobileToken(token)
    if (!payload) {
      debugLog('[MOBILE-SESSION] Invalid or expired mobile token')
      return htmlRedirect(targetPath)
    }

    debugLog('[MOBILE-SESSION] Token valid for userId:', payload.userId)

    // Look up user in database to get latest data
    const user = await findUserById(payload.userId)
    if (!user) {
      debugLog('[MOBILE-SESSION] User not found for userId:', payload.userId)
      return htmlRedirect(targetPath)
    }

    // Create a web session token (same format as regular login)
    const sessionToken = createSessionToken({
      id: user.id,
      email: user.email,
      name: user.name || '',
      isAdmin: user.isAdmin || false,
      canSeePrices: user.canSeePrices !== false,
      profilePicture: user.profilePicture || null,
    })

    debugLog('[MOBILE-SESSION] Session created for user:', user.email)

    // Return HTML page that will navigate to the target — cookie is set via header
    const response = htmlRedirect(targetPath)
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
    return htmlRedirect(targetPath)
  }
}

/**
 * Returns a minimal HTML page that immediately navigates to the target path.
 * The page is rendered by the WebView, which processes the Set-Cookie header
 * on the response BEFORE the JavaScript redirect fires. This ensures the
 * session cookie is properly stored before loading the target page.
 */
function htmlRedirect(targetPath: string): NextResponse {
  const safeTarget = targetPath.replace(/"/g, '&quot;').replace(/</g, '&lt;')
  const html = `<!DOCTYPE html>
<html><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Loading...</title>
<style>body{display:flex;align-items:center;justify-content:center;height:100vh;margin:0;font-family:system-ui;color:#6b7280;background:#fff}
.spinner{width:24px;height:24px;border:3px solid #e5e7eb;border-top-color:#dc2626;border-radius:50%;animation:spin .6s linear infinite;margin-right:12px}
@keyframes spin{to{transform:rotate(360deg)}}</style>
</head><body>
<div class="spinner"></div> Loading...
<script>window.location.replace("${safeTarget}");</script>
</body></html>`

  return new NextResponse(html, {
    status: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  })
}
