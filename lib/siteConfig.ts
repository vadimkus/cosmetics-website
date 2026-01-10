/**
 * Site configuration
 * Centralizes site URLs and other configuration
 */

// Site URL - uses environment variable with fallback
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://genosys.ae'

// Get the site URL as a URL object (useful for metadata)
export function getSiteUrl(): URL {
  return new URL(SITE_URL)
}

// Build a full URL from a path
export function buildUrl(path: string): string {
  // Ensure path starts with /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${SITE_URL}${normalizedPath}`
}

// Site metadata
export const SITE_NAME = 'GENOSYS Middle East FZ-LLC'
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
