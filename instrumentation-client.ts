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
    // Strip PII-sensitive fields before they leave the browser.
    // Checkout pages see email/address/phone; scrub them from breadcrumbs.
    beforeSend(event) {
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
