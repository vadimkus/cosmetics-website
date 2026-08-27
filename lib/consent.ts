/**
 * Cookie / analytics consent - first-party, lightweight.
 *
 * Stored in localStorage under `genosys_cookie_consent`:
 *   'accepted' → GA + first-party analytics enabled
 *   'declined' → analytics off (Consent Mode stays denied; tracker won't fire)
 *   (unset)    → undecided: GA loads in Consent-Mode "denied" (cookieless);
 *                first-party tracker holds until a choice is made.
 */
export const CONSENT_KEY = 'genosys_cookie_consent'
export type ConsentValue = 'accepted' | 'declined'

export function getConsent(): ConsentValue | null {
  if (typeof window === 'undefined') return null
  try {
    const v = window.localStorage.getItem(CONSENT_KEY)
    return v === 'accepted' || v === 'declined' ? v : null
  } catch {
    return null
  }
}

export function setConsent(value: ConsentValue): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(CONSENT_KEY, value)
  } catch {
    /* storage blocked - nothing to persist */
  }
  // Update Google Consent Mode v2 live so the current pageview is honored.
  const granted = value === 'accepted' ? 'granted' : 'denied'
  const w = window as unknown as { gtag?: (...args: unknown[]) => void }
  if (typeof w.gtag === 'function') {
    w.gtag('consent', 'update', {
      ad_storage: granted,
      analytics_storage: granted,
      ad_user_data: granted,
      ad_personalization: granted,
    })
  }
  // Let listeners (e.g. the page-view tracker) react immediately.
  window.dispatchEvent(new CustomEvent('genosys-consent-change', { detail: value }))
}
