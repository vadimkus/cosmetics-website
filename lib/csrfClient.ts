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
    return csrfToken
  } catch {
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
export function addCsrfToBody(body: Record<string, any>): Record<string, any> {
  const token = getCsrfToken()
  if (token) {
    return {
      ...body,
      csrfToken: token
    }
  }
  return body
}

