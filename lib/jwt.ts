// Simple JWT implementation since jsonwebtoken is not installed
// For production use, install jsonwebtoken: npm install jsonwebtoken @types/jsonwebtoken
import { errorLog, debugLog, warnLog } from '@/lib/logger'
import { JWT_SECRET as ENV_JWT_SECRET, MOBILE_APP_KEY } from '@/lib/envValidation'
import crypto from 'crypto'

// JWT configuration - checked at runtime to avoid build-time errors
let _jwtSecretWarned = false

function getJwtSecret(): string {
  const secret = ENV_JWT_SECRET
  
  if (!secret) {
    // Hard-fail in production: a guessable fallback secret would let anyone
    // forge session cookies and mobile tokens. Vercel has JWT_SECRET set in
    // all environments, so this only fires on misconfiguration.
    if (process.env.NODE_ENV === 'production') {
      errorLog('⚠️ FATAL: JWT_SECRET not set in production — refusing to sign/verify tokens.')
      throw new Error('JWT_SECRET must be set in production')
    }
    if (!_jwtSecretWarned) {
      warnLog('JWT_SECRET not set - using development fallback. Set JWT_SECRET for production.')
      _jwtSecretWarned = true
    }
    // Development/test fallback. CRITICAL: This MUST be deterministic (same on
    // every call) so that tokens created in one request can be verified in
    // subsequent requests.
    const dbUrl = process.env.DATABASE_URL
    const fallback = dbUrl 
      ? `fallback-${Buffer.from(dbUrl).toString('base64').slice(0, 32)}`
      : 'fallback-secret-for-development-only'
    return fallback
  }
  
  // Warn if secret is too short
  if (secret.length < 32 && !_jwtSecretWarned) {
    warnLog(`JWT_SECRET is only ${secret.length} characters. Recommended: 32+ characters.`)
    _jwtSecretWarned = true
  }
  
  return secret
}

// Token payload interface
export interface TokenPayload {
  userId: string
  email: string
  name: string
  isAdmin: boolean
  canSeePrices: boolean
  iat?: number
  exp?: number
}

/**
 * Generates a JWT token for mobile app authentication.
 * Token expires after 30 days and uses HS256 HMAC signature.
 * 
 * @param user - User data to encode in the token
 * @returns JWT token string (header.payload.signature)
 * @throws Never throws - returns empty string on error
 * 
 * @example
 * ```ts
 * const token = generateMobileToken({
 *   id: user.id,
 *   email: user.email,
 *   name: user.name,
 *   isAdmin: false,
 *   canSeePrices: true
 * })
 * res.json({ token })
 * ```
 */
export function generateMobileToken(user: {
  id: string
  email: string
  name: string
  isAdmin: boolean
  canSeePrices: boolean
}): string {
  try {
    const now = Math.floor(Date.now() / 1000)
    const expiresIn = now + (30 * 24 * 60 * 60) // 30 days in seconds
    
    const payload: TokenPayload = {
      userId: user.id,
      email: user.email,
      name: user.name,
      isAdmin: user.isAdmin || false,
      canSeePrices: user.canSeePrices !== false, // Default to true
      iat: now,
      exp: expiresIn
    }

    // Create header and payload
    const header = { alg: 'HS256', typ: 'JWT' }
    const headerEncoded = Buffer.from(JSON.stringify(header)).toString('base64url')
    const payloadEncoded = Buffer.from(JSON.stringify(payload)).toString('base64url')
    
    // Create signature
    const data = `${headerEncoded}.${payloadEncoded}`
    const signature = crypto
      .createHmac('sha256', getJwtSecret())
      .update(data)
      .digest('base64url')
    
    return `${data}.${signature}`
  } catch (error) {
    errorLog('Error generating mobile token:', error)
    throw new Error('Failed to generate authentication token')
  }
}

/**
 * Verify JWT-like token and return payload
 */
export function verifyMobileToken(token: string): TokenPayload | null {
  try {
    // Split token into parts
    const parts = token.split('.')
    if (parts.length !== 3 || !parts[0] || !parts[1] || !parts[2]) {
      debugLog('Invalid mobile token format')
      return null
    }

    const [headerEncoded, payloadEncoded, signature] = parts

    // Verify signature
    const data = `${headerEncoded}.${payloadEncoded}`
    const expectedSignature = crypto
      .createHmac('sha256', getJwtSecret())
      .update(data)
      .digest('base64url')
    
    if (signature !== expectedSignature) {
      debugLog('Invalid mobile token signature')
      return null
    }

    // Decode payload
    const payload = JSON.parse(Buffer.from(payloadEncoded, 'base64url').toString()) as TokenPayload

    // Check expiration
    const now = Math.floor(Date.now() / 1000)
    if (payload.exp && payload.exp < now) {
      debugLog('Mobile token expired')
      return null
    }

    return payload
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    debugLog('Error verifying mobile token:', errorMessage)
    return null
  }
}

/**
 * Verify JWT token signature WITHOUT checking expiration.
 * Used by the token refresh endpoint to accept expired-but-authentic tokens.
 * Returns the payload if the signature is valid, or null if tampered/malformed.
 */
export function verifyMobileTokenIgnoreExpiration(token: string): (TokenPayload & { expired?: boolean }) | null {
  try {
    const parts = token.split('.')
    if (parts.length !== 3 || !parts[0] || !parts[1] || !parts[2]) {
      debugLog('Invalid mobile token format (refresh)')
      return null
    }

    const [headerEncoded, payloadEncoded, signature] = parts

    // Verify signature (proves the token was issued by us)
    const data = `${headerEncoded}.${payloadEncoded}`
    const expectedSignature = crypto
      .createHmac('sha256', getJwtSecret())
      .update(data)
      .digest('base64url')
    
    if (signature !== expectedSignature) {
      debugLog('Invalid mobile token signature (refresh)')
      return null
    }

    // Decode payload
    const payload = JSON.parse(Buffer.from(payloadEncoded, 'base64url').toString()) as TokenPayload

    // Mark whether it's expired (but don't reject it)
    const now = Math.floor(Date.now() / 1000)
    const expired = !!(payload.exp && payload.exp < now)

    return { ...payload, expired }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    debugLog('Error verifying mobile token (refresh):', errorMessage)
    return null
  }
}

/**
 * Extract token from Authorization header
 */
export function extractTokenFromHeader(authHeader: string | null): string | null {
  if (!authHeader) {
    return null
  }

  // Expected format: "Bearer <token>"
  const parts = authHeader.split(' ')
  if (parts.length !== 2 || parts[0] !== 'Bearer' || !parts[1]) {
    return null
  }

  return parts[1]
}

/**
 * Result of mobile authentication validation
 */
export interface MobileAuthResult {
  valid: boolean
  error?: string
  status?: number
  payload?: TokenPayload | null
}

/**
 * Middleware to validate mobile API key and JWT token.
 * Returns validation result with optional user payload.
 * 
 * @param apiKey - The API key from request header (X-API-Key)
 * @param token - The JWT token from Authorization header (optional)
 * @returns Validation result with status code and optional user payload
 */
export function validateMobileAuth(apiKey: string | null, token: string | null): MobileAuthResult {
  // Check API key first
  const expectedKey = MOBILE_APP_KEY
  if (!expectedKey) {
    return {
      valid: false,
      error: 'API service unavailable',
      status: 503
    }
  }

  if (!apiKey || apiKey !== expectedKey) {
    return {
      valid: false,
      error: 'Unauthorized - Invalid or missing API key',
      status: 401
    }
  }

  // If token is provided, validate it
  if (token) {
    const payload = verifyMobileToken(token)
    if (!payload) {
      return {
        valid: false,
        error: 'Invalid or expired authentication token',
        status: 401
      }
    }
    
    return {
      valid: true,
      payload
    }
  }

  // API key is valid, but no user token
  return {
    valid: true,
    payload: null
  }
}

// ============================================================================
// SESSION COOKIE FUNCTIONS
// ============================================================================

// Session payload interface (stored in cookie)
export interface SessionPayload {
  id: string
  email: string
  name: string
  isAdmin: boolean
  canSeePrices: boolean
  profilePicture: string | null
  iat?: number
  exp?: number
}

/**
 * Create a signed session token for the session cookie
 * This is more secure than storing raw JSON as it prevents tampering
 */
export function createSessionToken(user: {
  id: string
  email: string
  name: string
  isAdmin?: boolean
  canSeePrices?: boolean
  profilePicture?: string | null
}): string {
  try {
    const now = Math.floor(Date.now() / 1000)
    const expiresIn = now + (30 * 24 * 60 * 60) // 30 days in seconds
    
    const payload: SessionPayload = {
      id: user.id,
      email: user.email,
      name: user.name,
      isAdmin: user.isAdmin || false,
      canSeePrices: user.canSeePrices !== false, // Default to true
      profilePicture: user.profilePicture || null,
      iat: now,
      exp: expiresIn
    }

    // Create header and payload (standard JWT format)
    const header = { alg: 'HS256', typ: 'JWT' }
    const headerEncoded = Buffer.from(JSON.stringify(header)).toString('base64url')
    const payloadEncoded = Buffer.from(JSON.stringify(payload)).toString('base64url')
    
    // Create HMAC signature
    const data = `${headerEncoded}.${payloadEncoded}`
    const signature = crypto
      .createHmac('sha256', getJwtSecret())
      .update(data)
      .digest('base64url')
    
    return `${data}.${signature}`
  } catch (error) {
    errorLog('Error creating session token:', error)
    throw new Error('Failed to create session token')
  }
}

/**
 * Verify and decode a session token from the session cookie
 * Returns null if token is invalid, expired, or tampered with
 */
export function verifySessionToken(token: string): SessionPayload | null {
  try {
    // SECURITY: legacy unsigned-JSON cookies are no longer accepted. They had
    // no signature (any client could forge {"isAdmin":true}) and no expiry.
    // The signed-JWT cookie format has been issued on every login since the
    // migration; remaining legacy cookies just require a fresh sign-in.
    if (token.startsWith('{')) {
      debugLog('Rejected legacy unsigned session cookie - user must sign in again')
      return null
    }

    // Split token into parts
    const parts = token.split('.')
    if (parts.length !== 3 || !parts[0] || !parts[1] || !parts[2]) {
      debugLog('Invalid session token format')
      return null
    }

    const [headerEncoded, payloadEncoded, signature] = parts

    // Verify HMAC signature (prevents tampering)
    const data = `${headerEncoded}.${payloadEncoded}`
    const expectedSignature = crypto
      .createHmac('sha256', getJwtSecret())
      .update(data)
      .digest('base64url')
    
    // Use timing-safe comparison to prevent timing attacks
    // First check lengths match (timingSafeEqual requires same length buffers)
    const signatureBuffer = Buffer.from(signature)
    const expectedBuffer = Buffer.from(expectedSignature)
    
    if (signatureBuffer.length !== expectedBuffer.length || 
        !crypto.timingSafeEqual(signatureBuffer, expectedBuffer)) {
      debugLog('Invalid session token signature - possible tampering detected')
      return null
    }

    // Decode payload
    const payload = JSON.parse(Buffer.from(payloadEncoded, 'base64url').toString()) as SessionPayload

    // Check expiration
    const now = Math.floor(Date.now() / 1000)
    if (payload.exp && payload.exp < now) {
      debugLog('Session token expired')
      return null
    }

    return payload
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    debugLog('Error verifying session token:', errorMessage)
    return null
  }
}

/**
 * Parse session from cookie value (signed JWT format only)
 */
export function parseSessionCookie(cookieValue: string | undefined): SessionPayload | null {
  if (!cookieValue) {
    return null
  }
  
  return verifySessionToken(cookieValue)
}
