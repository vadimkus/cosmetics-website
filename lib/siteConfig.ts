/**
 * Site configuration
 * Centralizes site URLs and other configuration
 *
 * NOTE: This file is imported by client components (e.g. BreadcrumbSchema).
 * It must NOT import from envValidation.ts, which triggers server-only
 * validation (DATABASE_URL etc.) that crashes on the client.
 * Instead, read NEXT_PUBLIC_* env vars directly — they are inlined into
 * client bundles by Next.js.
 */

// Site URL - uses environment variable with fallback
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://genosys.ae'

// Get the site URL as a URL object (useful for metadata)
export function getSiteUrl(): URL {
  return new URL(SITE_URL)
}

export function isAbsoluteUrl(value: string): boolean {
  return /^https?:\/\//i.test(value)
}

// Build a full URL from a path
export function buildUrl(path: string): string {
  if (!path) return SITE_URL
  if (isAbsoluteUrl(path)) return path
  if (path.startsWith('//')) return `https:${path}`

  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${SITE_URL}${normalizedPath}`
}

// Site metadata
// SITE_NAME is the brand name used in titles, OG metadata and headers.
// The full legal entity ("Genosys Middle East FZ-LLC") is reserved for legal,
// transactional and "about/contact" body content.
export const SITE_NAME = 'GENOSYS'
export const SITE_LEGAL_NAME = 'Genosys Middle East FZ-LLC'
export const SITE_DESCRIPTION = 'Official distributor of GENOSYS Korean dermacosmetics in UAE'

// Social media and contact
export const SOCIAL_LINKS = {
  instagram: 'https://www.instagram.com/genosys.ae/',
  whatsapp: 'https://api.whatsapp.com/send?phone=971507319498',
  phone: '+971507319498',
  email: 'info@genosys.ae'
}

// Push notifications VAPID key
export const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || ''

// App / PWA version — single source of truth for the Profile footer and any
// other user-visible "version" string. Keep in sync with `public/manifest.json`.
// Bump this + manifest.json whenever you ship a release.
export const APP_VERSION = '3.3.0'
