/**
 * Meta Pixel (browser side). Dataset "genosys.ae" in Events Manager.
 *
 * The pixel script is only loaded after the visitor accepts cookies
 * (`genosys_cookie_consent === 'accepted'`); before that nothing is sent and
 * no _fbp cookie is set. Purchase events carry `eventID: purchase_<orderNumber>`
 * so Meta deduplicates them against the server-side Conversions API event
 * sent by lib/metaCapi.ts.
 */
import { getConsent } from '@/lib/consent'

export const META_PIXEL_ID = '1644419117314458'

type Fbq = ((...args: unknown[]) => void) & {
  callMethod?: (...args: unknown[]) => void
  queue: unknown[][]
  push: Fbq
  loaded: boolean
  version: string
}

declare global {
  interface Window {
    fbq?: Fbq
    _fbq?: Fbq
  }
}

let initialised = false

function ensurePixel(): Fbq | null {
  if (typeof window === 'undefined' || getConsent() !== 'accepted') return null
  if (!window.fbq) {
    const fbq = function (...args: unknown[]) {
      if (fbq.callMethod) fbq.callMethod(...args)
      else fbq.queue.push(args)
    } as Fbq
    fbq.push = fbq
    fbq.loaded = true
    fbq.version = '2.0'
    fbq.queue = []
    window.fbq = fbq
    if (!window._fbq) window._fbq = fbq
    const script = document.createElement('script')
    script.async = true
    script.src = 'https://connect.facebook.net/en_US/fbevents.js'
    document.head.appendChild(script)
  }
  if (!initialised) {
    window.fbq('consent', 'grant')
    window.fbq('init', META_PIXEL_ID)
    initialised = true
  }
  return window.fbq
}

export function metaPageView(): void {
  ensurePixel()?.('track', 'PageView')
}

export function metaTrack(event: string, params: Record<string, unknown>, eventId?: string): void {
  const fbq = ensurePixel()
  if (!fbq) return
  if (eventId) fbq('track', event, params, { eventID: eventId })
  else fbq('track', event, params)
}

export function metaPurchaseEventId(orderNumber: string): string {
  return `purchase_${orderNumber}`
}
