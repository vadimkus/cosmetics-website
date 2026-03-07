import { errorLog } from '@/lib/logger'
/**
 * Client-side CSRF token management
 * 
 * Usage:
 * 1. Call fetchCsrfToken() on page load
 * 2. Include token in POST/PUT/DELETE requests via header or body
 */

let csrfToken: string | null = null

/**
 * Fetch CSRF token from server
 * Should be called once per page load
 */
export async function fetchCsrfToken(): Promise<string | null> {
  try {
    const response = await fetch('/api/csrf-token', {
      method: 'GET',
      credentials: 'include' // Important: include cookies
    })

    if (!response.ok) {
      errorLog('Failed to fetch CSRF token')
      return null
    }

    const data = await response.json()
    csrfToken = data.token

    // Set cookie client-side as fallback: service workers strip Set-Cookie
    // from responses passed through event.respondWith(), so the server's
    // Set-Cookie may never reach the browser cookie jar.
    if (typeof document !== 'undefined' && csrfToken) {
      const secure = location.protocol === 'https:' ? '; Secure' : ''
      document.cookie = `csrf-token=${encodeURIComponent(csrfToken)}; path=/; max-age=86400; SameSite=Lax${secure}`
    }

    return csrfToken
  } catch (error) {
    errorLog('Error fetching CSRF token:', error)
    return null
  }
}

/**
 * Get current CSRF token (from memory or cookie)
 */
export function getCsrfToken(): string | null {
  // Try memory first
  if (csrfToken) {
    return csrfToken
  }

  // Fallback to cookie (if set by server)
  if (typeof document !== 'undefined') {
      const cookies = document.cookie.split(';')
      for (const cookie of cookies) {
        const [name, value] = cookie.trim().split('=')
        if (name === 'csrf-token' && value) {
          csrfToken = decodeURIComponent(value)
          return csrfToken
        }
      }
  }

  return null
}

/**
 * Get headers with CSRF token
 */
export function getCsrfHeaders(): HeadersInit {
  const token = getCsrfToken()
  const headers: HeadersInit = {
    'Content-Type': 'application/json'
  }

  if (token) {
    headers['X-CSRF-Token'] = token
  }

  return headers
}

/**
 * Add CSRF token to form data
 */
export function addCsrfToBody(body: Record<string, unknown>): Record<string, unknown> {
  const token = getCsrfToken()
  if (token) {
    return {
      ...body,
      csrfToken: token
    }
  }
  return body
}

