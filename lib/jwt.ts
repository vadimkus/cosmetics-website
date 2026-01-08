// Simple JWT implementation since jsonwebtoken is not installed
// For production use, install jsonwebtoken: npm install jsonwebtoken @types/jsonwebtoken
import { errorLog, debugLog, warnLog } from '@/lib/logger'
import crypto from 'crypto'

// JWT configuration - require secret in production, use fallback only for development
const JWT_SECRET = (() => {
  const secret = process.env.JWT_SECRET
  
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      // In production, throw an error if JWT_SECRET is not set
      throw new Error(
        'CRITICAL SECURITY ERROR: JWT_SECRET environment variable is not set in production. ' +
        'Please set a strong, random JWT_SECRET value.'
      )
    }
    // In development, warn and use fallback
    warnLog('⚠️ JWT_SECRET not set - using insecure fallback. Set JWT_SECRET for production.')
    return 'fallback-secret-for-development-only'
  }
  
  return secret
})()

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
 * Generate JWT-like token for mobile authentication
 * Using base64 encoding with HMAC signature for simplicity
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
      .createHmac('sha256', JWT_SECRET)
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
      .createHmac('sha256', JWT_SECRET)
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
 * Middleware to validate mobile API key and JWT token
 */
export function validateMobileAuth(apiKey: string | null, token: string | null) {
  // Check API key first
  const expectedKey = process.env.MOBILE_APP_KEY
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
