import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

/**
 * CSRF Protection Utilities
 * 
 * Uses the Double Submit Cookie pattern:
 * - Server generates a token
 * - Token is sent as both a cookie and in the request body/header
 * - Server verifies both match
 */

const CSRF_TOKEN_COOKIE_NAME = 'csrf-token'
const CSRF_TOKEN_HEADER_NAME = 'X-CSRF-Token'
const CSRF_TOKEN_BODY_FIELD = 'csrfToken'

/**
 * Generate a secure random CSRF token
 */
export function generateCsrfToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

/**
 * Get CSRF token from request (checks cookie first, then header, then body)
 */
export function getCsrfTokenFromRequest(request: NextRequest): string | null {
  // Priority: Cookie > Header > Body
  const cookieToken = request.cookies.get(CSRF_TOKEN_COOKIE_NAME)?.value
  if (cookieToken) {
    return cookieToken
  }

  const headerToken = request.headers.get(CSRF_TOKEN_HEADER_NAME)
  if (headerToken) {
    return headerToken
  }

  // For body, we need to clone and read it (async)
  // This is handled in validateCsrfToken
  return null
}

/**
 * Validate CSRF token in request
 * Expects token in both cookie and header/body (Double Submit Cookie pattern)
 */
export async function validateCsrfToken(request: NextRequest): Promise<{
  valid: boolean
  error?: string
}> {
  // Get token from cookie (set by server)
  const cookieToken = request.cookies.get(CSRF_TOKEN_COOKIE_NAME)?.value

  if (!cookieToken) {
    return {
      valid: false,
      error: 'CSRF token cookie missing. Please refresh the page.'
    }
  }

  // Get token from header or body
  let submittedToken: string | null = null

  // Try header first
  submittedToken = request.headers.get(CSRF_TOKEN_HEADER_NAME)

  // If not in header, try body (for POST/PUT requests)
  if (!submittedToken) {
    try {
      // Use a timeout to prevent hanging
      const clonedRequest = request.clone()
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Body read timeout')), 5000)
      )
      
      const bodyPromise = clonedRequest.json().catch(() => ({}))
      const body = await Promise.race([bodyPromise, timeoutPromise]).catch(() => ({}))
      submittedToken = body && typeof body === 'object' ? body[CSRF_TOKEN_BODY_FIELD] || null : null
    } catch (error) {
      // Body might not be JSON or might already be consumed
      // Continue with header-only check - this is acceptable for security
      console.warn('CSRF token body read failed (non-critical):', error instanceof Error ? error.message : 'Unknown error')
    }
  }

  if (!submittedToken) {
    return {
      valid: false,
      error: 'CSRF token missing in request. Please include it in the X-CSRF-Token header or csrfToken field.'
    }
  }

  // Compare tokens using constant-time comparison to prevent timing attacks
  // First check length to avoid buffer mismatch errors
  if (cookieToken.length !== submittedToken.length) {
    return {
      valid: false,
      error: 'CSRF token mismatch. Please refresh the page and try again.'
    }
  }

  // Convert to Buffers for timing-safe comparison
  const cookieBuffer = Buffer.from(cookieToken, 'utf8')
  const submittedBuffer = Buffer.from(submittedToken, 'utf8')
  
  // Use constant-time comparison to prevent timing attacks
  const isValid = crypto.timingSafeEqual(cookieBuffer, submittedBuffer)

  if (!isValid) {
    return {
      valid: false,
      error: 'CSRF token mismatch. Please refresh the page and try again.'
    }
  }

  return { valid: true }
}

/**
 * Create response with CSRF token cookie
 */
export function setCsrfTokenCookie(response: NextResponse, token: string): NextResponse {
  response.cookies.set(CSRF_TOKEN_COOKIE_NAME, token, {
    httpOnly: false, // Must be accessible to JavaScript for Double Submit Cookie pattern
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    sameSite: 'strict', // CSRF protection
    path: '/',
    maxAge: 60 * 60 * 24 // 24 hours
  })
  return response
}

/**
 * Create a response with CSRF token for client to use
 */
export function createCsrfResponse(): NextResponse {
  const token = generateCsrfToken()
  const response = NextResponse.json({ token })
  return setCsrfTokenCookie(response, token)
}

/**
 * Middleware to require CSRF token for state-changing methods
 */
export async function requireCsrfToken(
  request: NextRequest,
  skipMethods: string[] = ['GET', 'HEAD', 'OPTIONS']
): Promise<{ valid: boolean; response?: NextResponse }> {
  const method = request.method.toUpperCase()

  // Skip CSRF check for safe methods
  if (skipMethods.includes(method)) {
    return { valid: true }
  }

  const validation = await validateCsrfToken(request)
  
  if (!validation.valid) {
    return {
      valid: false,
      response: NextResponse.json(
        { error: validation.error || 'CSRF validation failed' },
        { status: 403 }
      )
    }
  }

  return { valid: true }
}

