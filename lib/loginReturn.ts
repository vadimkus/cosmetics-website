/**
 * Post-login return path.
 *
 * A guest who taps "Log in to shop" on a product page should land back on
 * that product after signing in, not on /products. Callers build the login
 * URL with `loginPathWithReturn`; the login page reads `?redirect=` and, for
 * Google/Apple, forwards it to the OAuth start route which keeps it in a
 * short-lived cookie for the callback.
 *
 * Only same-origin absolute paths are honoured, so the parameter can never
 * send anyone off-site.
 */

import { getLocalizedPath, type Locale } from '@/lib/i18n'

export const POST_LOGIN_REDIRECT_COOKIE = 'post-login-redirect'

export function isSafeReturnPath(path: unknown): path is string {
  if (typeof path !== 'string' || path.length === 0 || path.length > 2000) return false
  if (!path.startsWith('/') || path.startsWith('//') || path.startsWith('/\\')) return false
  if (path.includes(':') || /[\r\n]/.test(path)) return false
  // Bouncing back onto an auth page would loop.
  if (/^(\/(ru|ar))?\/(login|signup|pwa-login|forgot-password|reset-password)(\/|\?|$)/.test(path)) {
    return false
  }
  return true
}

/** The current page (path + query), or null outside the browser. */
export function currentReturnPath(): string | null {
  if (typeof window === 'undefined') return null
  const path = `${window.location.pathname}${window.location.search}`
  return isSafeReturnPath(path) ? path : null
}

/** `/login?redirect=<returnTo>` for the locale; plain `/login` when nothing to return to. */
export function loginPathWithReturn(locale: Locale, returnTo?: string | null): string {
  const base = getLocalizedPath('/login', locale)
  const target = returnTo === undefined ? currentReturnPath() : returnTo
  if (!isSafeReturnPath(target)) return base
  return `${base}?redirect=${encodeURIComponent(target)}`
}
