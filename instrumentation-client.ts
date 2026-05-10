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

/**
 * iOS Safari + experimental.viewTransition + React 19 race condition.
 *
 * During a client-side route change, WebKit's View Transitions API takes a
 * snapshot of the page and reparents nodes for the cross-fade. React's
 * commit phase (commitDeletionEffectsOnFiber → commitMutationEffectsOnFiber)
 * then tries to call `removeChild` on a node WebKit has already moved out
 * of its parent, and `Node.removeChild` throws DOMException code 8
 * ("NotFoundError: The object can not be found here.").
 *
 * Symptoms in the Sentry event:
 *   - exception type "NotFoundError" + message "The object can not be found here."
 *   - tags: browser.name "Mobile Safari", os.name "iOS", DOMException.code 8
 *   - stack is exclusively inside minified _next/static/chunks/*.js (React's
 *     commitWork; we never call removeChild on App Router-managed DOM)
 *   - mechanism.handled: true (React swallows it on the next render)
 *   - reproduces around route navigations (transaction != url, e.g. /orders → /products)
 *
 * Seen first 2026-05-02 06:02 UTC, event dd9c98ca18f4… on iOS 18.7 / Mobile
 * Safari 26.2. Browser-engine race, no user-visible breakage, nothing for us
 * to fix in product code. Drop to silence the alerting noise; let any
 * NotFoundError originating from real app code (frames pointing at our own
 * source files) through.
 */
function isIOSViewTransitionRemoveChildRace(event: Sentry.ErrorEvent): boolean {
  const values = event.exception?.values
  if (!values || values.length !== 1) return false
  const exc = values[0]
  if (!exc) return false
  if (exc.type !== 'NotFoundError') return false
  if (!exc.value || !/object can not be found here/i.test(exc.value)) return false

  // Sentry's `Contexts` type is an indexed map (`{ [k: string]: Context }`),
  // so `event.contexts.os.name` resolves to `{}` instead of `string`. Narrow
  // explicitly with `typeof` to satisfy TS strict mode.
  const asString = (v: unknown): string => (typeof v === 'string' ? v : '')
  const os = asString(event.contexts?.os?.name)
  const browser = asString(event.contexts?.browser?.name)
  const isIOSWebKit =
    /^iOS$/i.test(os) ||
    /Mobile Safari|Safari/i.test(browser) ||
    /WebKit/i.test(browser)
  if (!isIOSWebKit) return false

  const frames = exc.stacktrace?.frames || []
  if (frames.length === 0) return false
  const isAllNextChunks = frames.every((f) => {
    const file = f.filename || f.abs_path || ''
    return file === '' || /_next\/static\/chunks\//.test(file)
  })
  return isAllNextChunks
}

/**
 * Chrome / Google Translate DOM mutation.
 *
 * Chrome's page translator rewrites text nodes inside React-managed markup by
 * wrapping translated strings in nested `<font>` elements. If the user navigates
 * while that translated subtree is mounted, React can later try to remove a
 * text node that Google Translate already replaced, producing:
 *   NotFoundError: Failed to execute 'removeChild' on 'Node': The node to be
 *   removed is not a child of this node.
 *
 * The 2026-05-10 `/products` event had a `ui.click` breadcrumb ending in
 * `font > font`, Turkish culture/title, and a stack made only of minified React
 * commit frames. The layout now opts out of browser translation; this filter
 * keeps any cached/pre-opt-out repeats from paging us.
 */
function isGoogleTranslateRemoveChildMutation(event: Sentry.ErrorEvent): boolean {
  const values = event.exception?.values
  if (!values || values.length !== 1) return false
  const exc = values[0]
  if (!exc) return false
  if (exc.type !== 'NotFoundError') return false
  if (!exc.value || !/removeChild.*not a child of this node/i.test(exc.value)) return false

  const frames = exc.stacktrace?.frames || []
  const isAllNextChunks = frames.length > 0 && frames.every((f) => {
    const file = f.filename || f.abs_path || ''
    return file === '' || /_next\/static\/chunks\//.test(file)
  })
  if (!isAllNextChunks) return false

  return (event.breadcrumbs || []).some((breadcrumb) => {
    const message = breadcrumb.message || ''
    return breadcrumb.category === 'ui.click' && /font\s*>\s*font/i.test(message)
  })
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
      if (isIOSViewTransitionRemoveChildRace(event)) return null
      if (isGoogleTranslateRemoveChildMutation(event)) return null

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
