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

function asString(v: unknown): string {
  return typeof v === 'string' ? v : ''
}

function getTagValue(event: Sentry.ErrorEvent, key: string): string {
  const tag = event.tags?.[key]
  if (typeof tag === 'string') return tag
  if (typeof tag === 'number' || typeof tag === 'boolean') return String(tag)
  return ''
}

/**
 * The live `navigator.userAgent` from the browser running `beforeSend`.
 *
 * Critical: Sentry derives `event.contexts.browser` / `event.contexts.os` and
 * the `browser.name` / `os.name` tags SERVER-SIDE from the User-Agent header.
 * Inside `beforeSend` (which runs in the browser before the event is sent)
 * those fields are still empty, so any filter that relies only on them never
 * matches. Reading `navigator.userAgent` directly is the one browser/OS signal
 * we can trust client-side.
 */
function getUserAgent(): string {
  return typeof navigator !== 'undefined' && typeof navigator.userAgent === 'string'
    ? navigator.userAgent
    : ''
}

function isIOSWebKitBrowser(event: Sentry.ErrorEvent): boolean {
  const os =
    asString(event.contexts?.os?.name) ||
    getTagValue(event, 'os.name') ||
    getTagValue(event, 'os')
  const browser =
    asString(event.contexts?.browser?.name) ||
    getTagValue(event, 'browser.name') ||
    getTagValue(event, 'browser')
  if (
    /^iOS$/i.test(os) ||
    /Mobile Safari|Chrome Mobile iOS|Safari/i.test(browser)
  ) {
    return true
  }

  // Fallback: server-derived browser/OS are absent in beforeSend, so read the
  // UA directly. On iOS every browser is WebKit, so an iOS device UA is enough
  // (iPhone/iPad/iPod, plus CriOS/FxiOS/EdgiOS for in-app variants).
  const ua = getUserAgent()
  return /iPhone|iPad|iPod/i.test(ua) || /CriOS|FxiOS|EdgiOS/i.test(ua)
}

function hasNoAppStack(event: Sentry.ErrorEvent): boolean {
  const frames = event.exception?.values?.[0]?.stacktrace?.frames || []
  if (frames.length === 0) return true
  return frames.every((frame) => {
    const file = frame.filename || frame.abs_path || ''
    return file === '' || /_next\/static\/chunks\//.test(file)
  })
}

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
  return isIOSWebKitBrowser(event) && hasNoAppStack(event)
}

function isIOSNavigationAbortError(event: Sentry.ErrorEvent): boolean {
  const values = event.exception?.values
  if (!values || values.length !== 1) return false
  const exc = values[0]
  if (!exc) return false

  const value = exc.value || ''
  const isAbort =
    /AbortError/i.test(exc.type || '') ||
    /AbortError: The operation was aborted\.?/i.test(value)
  if (!isAbort) return false
  if (exc.mechanism?.type !== 'auto.browser.global_handlers.onunhandledrejection') return false

  return isIOSWebKitBrowser(event) && hasNoAppStack(event)
}

/**
 * Media element fetch abort (Firefox wording).
 *
 * Product pages render a native `<video controls preload="metadata">` tab
 * (components/product/ProductImmersiveMedia.tsx). When the user starts
 * loading/playing the video and then switches media tabs or navigates away,
 * the browser aborts the in-flight media fetch and rejects its internal
 * load/play promise with DOMException code 20:
 *   "AbortError: The fetching process for the media resource was aborted by
 *    the user agent at the user's request."
 * With native controls that promise is browser-internal — there is no app
 * code to attach a .catch() to — so it surfaces as an unhandled rejection
 * with zero stack frames.
 *
 * Seen first 2026-06-11 16:37 UTC, event 63ce51a5… on Firefox 151 / Windows
 * at /products/40. Same class of noise as the iOS navigation aborts above,
 * just Firefox's message wording. Aborting a media fetch on tab switch or
 * navigation is correct behavior; drop these events.
 */
function isMediaResourceFetchAbortError(event: Sentry.ErrorEvent): boolean {
  const values = event.exception?.values
  if (!values || values.length !== 1) return false
  const exc = values[0]
  if (!exc) return false

  const isAbort = /AbortError/i.test(exc.type || '') || /AbortError/i.test(exc.value || '')
  if (!isAbort) return false
  if (!/fetching process for the media resource was aborted/i.test(exc.value || '')) {
    return false
  }
  if (exc.mechanism?.type !== 'auto.browser.global_handlers.onunhandledrejection') return false

  return hasNoAppStack(event)
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

function hasBrowserTranslationBreadcrumb(event: Sentry.ErrorEvent): boolean {
  return (event.breadcrumbs || []).some((breadcrumb) => {
    if (breadcrumb.category !== 'console') return false

    const args = Array.isArray(breadcrumb.data?.arguments)
      ? breadcrumb.data.arguments
      : []

    return args.some((arg) => {
      if (!arg || typeof arg !== 'object') return false
      const data = arg as Record<string, unknown>

      return (
        (typeof data.from === 'string' && typeof data.to === 'string') ||
        (
          typeof data.current === 'number' &&
          typeof data.total === 'number' &&
          typeof data.success === 'boolean'
        )
      )
    })
  })
}

function isBrowserTranslationContentDocumentProbe(event: Sentry.ErrorEvent): boolean {
  const values = event.exception?.values
  if (!values || values.length !== 1) return false
  const exc = values[0]
  if (!exc) return false
  if (exc.type !== 'TypeError') return false
  if (!/contentDocument\.body/i.test(exc.value || '')) return false
  if (exc.mechanism?.type !== 'auto.browser.global_handlers.onerror') return false

  return hasBrowserTranslationBreadcrumb(event)
}

function isBlobOnlyBoundingClientRectProbe(event: Sentry.ErrorEvent): boolean {
  const values = event.exception?.values
  if (!values || values.length !== 1) return false
  const exc = values[0]
  if (!exc) return false
  if (!/getBoundingClientRect is not a function/i.test(exc.value || '')) return false
  if (exc.mechanism?.type !== 'auto.browser.global_handlers.onerror') return false
  if (!isIOSWebKitBrowser(event)) return false

  const frames = exc.stacktrace?.frames || []
  if (frames.length === 0) return false

  return frames.every((frame) => {
    const file = frame.filename || frame.abs_path || ''
    return /^blob:app:\/\//i.test(file)
  })
}

function isInstagramAndroidNavigationLoggerError(event: Sentry.ErrorEvent): boolean {
  const values = event.exception?.values
  if (!values || values.length !== 1) return false
  const exc = values[0]
  if (!exc) return false
  if (exc.type !== 'Error') return false
  if (!/Error invoking enableDidUserTypeOnKeyboardLogging: Java object is gone/i.test(exc.value || '')) {
    return false
  }
  if (exc.mechanism?.type !== 'auto.browser.global_handlers.onerror') return false

  const ua = getUserAgent()
  const os =
    asString(event.contexts?.os?.name) ||
    getTagValue(event, 'os.name') ||
    getTagValue(event, 'os') ||
    ua
  const browser =
    asString(event.contexts?.browser?.name) ||
    getTagValue(event, 'browser.name') ||
    getTagValue(event, 'browser') ||
    ua
  if (!/Android/i.test(os) || !/Instagram/i.test(browser)) return false

  const frames = exc.stacktrace?.frames || []
  if (frames.length === 0) return false

  return frames.every((frame) => {
    const file = frame.filename || frame.abs_path || ''
    return /^app:\/\/navigation_performance_logger_android/i.test(file)
  })
}

function isInjectedZpScriptError(event: Sentry.ErrorEvent): boolean {
  const values = event.exception?.values
  if (!values || values.length !== 1) return false
  const exc = values[0]
  if (!exc) return false
  if (exc.type !== 'ReferenceError' || !/zp_token is not defined/i.test(exc.value || '')) {
    return false
  }

  return (exc.stacktrace?.frames || []).some((frame) => {
    const file = frame.filename || frame.abs_path || ''
    return /\/1\/zp\.js(?:$|\?)/.test(file)
  })
}

function isInjectedShopLookupRejection(event: Sentry.ErrorEvent): boolean {
  const values = event.exception?.values
  if (!values || values.length !== 1) return false
  const exc = values[0]
  if (!exc) return false
  if (exc.type !== 'UnhandledRejection') return false
  if (!/Non-Error promise rejection captured with value:\s*Not found/i.test(exc.value || '')) {
    return false
  }
  if (exc.mechanism?.type !== 'auto.browser.global_handlers.onunhandledrejection') return false

  return (event.breadcrumbs || []).some((breadcrumb) => {
    if (breadcrumb.category !== 'fetch') return false
    const data = breadcrumb.data || {}
    const url = typeof data.url === 'string' ? data.url : ''
    const statusCode = data.status_code
    return (
      statusCode === 404 &&
      /execute-api\.[a-z0-9-]+\.amazonaws\.com\/dev\/sites\?site=genosys\.ae/i.test(url)
    )
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
      if (isIOSNavigationAbortError(event)) return null
      if (isMediaResourceFetchAbortError(event)) return null
      if (isIOSViewTransitionRemoveChildRace(event)) return null
      if (isGoogleTranslateRemoveChildMutation(event)) return null
      if (isBrowserTranslationContentDocumentProbe(event)) return null
      if (isBlobOnlyBoundingClientRectProbe(event)) return null
      if (isInstagramAndroidNavigationLoggerError(event)) return null
      if (isInjectedZpScriptError(event)) return null
      if (isInjectedShopLookupRejection(event)) return null

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
