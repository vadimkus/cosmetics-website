'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { trackPageView } from '@/lib/analytics'
import { getConsent } from '@/lib/consent'

export default function PageViewTracker() {
  const pathname = usePathname()

  useEffect(() => {
    if (typeof window === 'undefined' || !pathname) return

    // First-party analytics (IP/geo/device) only runs with explicit consent.
    // GA itself is gated separately via Consent Mode. Re-run when consent
    // changes so an accept mid-session starts capturing without a reload.
    const record = () => {
      if (getConsent() !== 'accepted') return
      sendPageView(pathname)
    }
    record()
    window.addEventListener('genosys-consent-change', record)
    return () => window.removeEventListener('genosys-consent-change', record)
  }, [pathname])

  return null
}

function sendPageView(pathname: string) {
    trackPageView(pathname)

    // Best-effort POST to our own analytics pipe.
    //
    // `keepalive: true` lets the request complete even if the user taps a link
    // and the page navigates away mid-flight. Without it, Safari aborts the
    // fetch and surfaces `TypeError: Load failed` on `window.onerror` - that's
    // exactly the noise filtered in `instrumentation-client.ts` and first seen
    // in Sentry event 350fb357… (2026-04-23). Fixing the source here means
    // fewer dropped page views + one less class of non-bug errors reaching
    // the error pipeline at all.
    //
    // Errors are swallowed deliberately: analytics is fire-and-forget, a
    // dropped page-view is not a user-visible bug, and surfacing these to
    // Sentry/console only adds noise.
    const body = JSON.stringify({
      type: 'pageview',
      page: pathname,
      userAgent: navigator.userAgent,
      referrer: document.referrer,
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
    })

    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      keepalive: true,
    }).catch(() => {})
}
