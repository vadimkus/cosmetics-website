/**
 * Client-side Sentry init (Next.js 16 convention).
 * Replaces the legacy `sentry.client.config.ts` — this file is auto-registered
 * by Next.js on the browser side.
 *
 * Session Replay and Feedback widget are intentionally disabled. Replay costs
 * quota and adds ~90KB to the bundle; we explicitly dropped LogRocket to cut
 * bundle size, enabling Replay here would partly undo that win. Revisit if a
 * specific debugging need appears.
 */
import * as Sentry from '@sentry/nextjs'

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN
const release = process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA
const environment =
  process.env.NEXT_PUBLIC_VERCEL_ENV || process.env.NODE_ENV || 'development'
const enabled =
  process.env.NODE_ENV === 'production' ||
  process.env.NEXT_PUBLIC_SENTRY_ENABLE_DEV === 'true'

/**
 * iOS Safari / WebKit quirk: when the user taps a link, any in-flight
 * `fetch()` (including Next.js App Router's RSC prefetches) gets aborted and
 * surfaces `TypeError: Load failed` on `window.onerror` instead of
 * `window.onunhandledrejection` (unlike Chrome's "Failed to fetch" / Firefox's
 * "NetworkError when attempting to fetch").
 *
 * Seen first in Sentry 2026-04-23 05:16 UTC, event 350fb357…:
 *   - transaction: /products (user tapped /products link on /)
 *   - breadcrumbs show 6 RSC prefetches aborted at the same millisecond,
 *     followed by navigation to /products ~12ms later
 *   - stack is a single frame inside a minified _next/static/chunks/*.js
 *     entry, i.e. Next.js's internal prefetch handler, not our code
 *   - user saw no broken UX; navigation completed successfully
 *
 * There is nothing to fix here — the fetch was supposed to be aborted. Drop
 * these events so they don't fire production alerts. Anything with a real
 * stack (>1 frame, or not inside Next.js chunks) passes through untouched.
 */
function isSafariNavigationAbortLoadFailed(event: Sentry.ErrorEvent): boolean {
  const values = event.exception?.values
  if (!values || values.length !== 1) return false
  const exc = values[0]
  if (!exc) return false
  if (exc.type !== 'TypeError' || exc.value !== 'Load failed') return false
  if (exc.mechanism?.type !== 'auto.browser.global_handlers.onerror') return false

  const frames = exc.stacktrace?.frames || []
  if (frames.length !== 1) return false
  const frame = frames[0]
  if (!frame) return false
  const file = frame.filename || frame.abs_path || ''
  return /_next\/static\/chunks\//.test(file)
}

if (dsn) {
  Sentry.init({
    dsn,
    environment,
    tracesSampleRate: process.env.NODE_ENV === 'development' ? 1.0 : 0.1,
    enabled,
    // Only include `release` when we actually know the commit SHA — avoids
    // tripping `exactOptionalPropertyTypes` and keeps Sentry's own logic
    // happy (it auto-infers otherwise).
    ...(release ? { release } : {}),
    beforeSend(event) {
      // Drop unactionable iOS Safari navigation-abort noise.
      if (isSafariNavigationAbortLoadFailed(event)) return null

      // Strip PII-sensitive fields before events leave the browser.
      // Checkout pages see email/address/phone; scrub them from breadcrumbs.
      if (event.request?.cookies) delete event.request.cookies
      if (event.user) {
        delete event.user.ip_address
        delete event.user.email
      }
      return event
    },
  })
}

// Instruments App Router client-side navigations so Sentry groups transactions
// by destination route rather than by the hydrated bundle entry point.
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart
