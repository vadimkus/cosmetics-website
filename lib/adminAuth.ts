import { NextRequest, NextResponse } from 'next/server'
import { findUserByEmail } from '@/lib/userStorageDb'
import { errorLog, debugLog } from '@/lib/logger'
import { ADMIN_SESSION_SECRET as ENV_ADMIN_SESSION_SECRET, JWT_SECRET } from '@/lib/envValidation'
import crypto from 'crypto'

// Admin session secret - uses ADMIN_SESSION_SECRET or JWT_SECRET from env
// In production, one of these MUST be set for secure admin authentication
const ADMIN_SESSION_SECRET = (() => {
  const secret = ENV_ADMIN_SESSION_SECRET || JWT_SECRET
  if (!secret && process.env.NODE_ENV === 'production') {
    errorLog('⚠️ CRITICAL: ADMIN_SESSION_SECRET and JWT_SECRET are both missing in production! Admin auth will not work.')
  }
  // In development, use a dev-only fallback (never used in production)
  return secret || (process.env.NODE_ENV === 'production' ? '' : 'dev-only-not-for-production')
})()

/**
 * Generate a signed admin session token
 * @param email - Admin user email
 * @param expiresIn - Expiration time in seconds (default: 24 hours)
 */
export function generateAdminSessionToken(email: string, expiresIn: number = 24 * 60 * 60): string {
  const payload = {
    email,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + expiresIn
  }
  
  const payloadBase64 = Buffer.from(JSON.stringify(payload)).toString('base64url')
  const signature = crypto
    .createHmac('sha256', ADMIN_SESSION_SECRET)
    .update(payloadBase64)
    .digest('base64url')
  
  return `${payloadBase64}.${signature}`
}

/**
 * Verify and decode an admin session token
 * @param token - The session token to verify
 * @returns The decoded payload if valid, null otherwise
 */
export function verifyAdminSessionToken(token: string): { email: string; iat: number; exp: number } | null {
  try {
    const parts = token.split('.')
    if (parts.length !== 2 || !parts[0] || !parts[1]) {
      return null
    }
    
    const [payloadBase64, signature] = parts
    
    // Verify signature (timing-safe comparison)
    const expectedSignature = crypto
      .createHmac('sha256', ADMIN_SESSION_SECRET)
      .update(payloadBase64)
      .digest('base64url')
    
    const signatureBuffer = Buffer.from(signature)
    const expectedBuffer = Buffer.from(expectedSignature)
    if (
      signatureBuffer.length !== expectedBuffer.length ||
      !crypto.timingSafeEqual(signatureBuffer, expectedBuffer)
    ) {
      debugLog('Admin session token signature mismatch')
      return null
    }
    
    // Decode and validate payload
    const payload = JSON.parse(Buffer.from(payloadBase64, 'base64url').toString())
    
    // Check expiration
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      debugLog('Admin session token expired')
      return null
    }
    
    return payload
  } catch (error) {
    debugLog('Admin session token verification failed:', error)
    return null
  }
}

/**
 * Admin authentication middleware
 * Verifies that the request is from an authenticated admin user
 * 
 * @param request - Next.js request object
 * @returns User object if authenticated, null if not
 */
export async function verifyAdminAuth(request: NextRequest): Promise<{
  user: { id: string; email: string; name: string; isAdmin: boolean } | null
  error: string | null
}> {
  try {
    // Verify using the signed session token (set by /api/auth/admin-login).
    // NOTE: The legacy email-only fallback (x-admin-email header / admin-email
    // cookie) was removed - it allowed full admin access with a spoofable header.
    const sessionToken = request.cookies.get('admin-session')?.value
    
    if (!sessionToken) {
      return {
        user: null,
        error: 'Admin authentication required. Please log in.'
      }
    }

    const tokenPayload = verifyAdminSessionToken(sessionToken)
    
    if (!tokenPayload) {
      return {
        user: null,
        error: 'Invalid or expired admin session. Please log in again.'
      }
    }

    // Verify the user still exists and is still an admin
    const user = await findUserByEmail(tokenPayload.email)
    
    if (!user || !user.isAdmin) {
      return {
        user: null,
        error: 'Invalid admin credentials. Please log in again.'
      }
    }

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        isAdmin: true
      },
      error: null
    }
  } catch (error) {
    errorLog('Admin auth verification error:', error)
    return {
      user: null,
      error: 'Authentication verification failed. Please try again.'
    }
  }
}

/**
 * Middleware wrapper for admin routes
 * Use this to protect admin API routes
 * 
 * @example
 * export async function GET(request: NextRequest) {
 *   const auth = await verifyAdminAuth(request)
 *   if (auth.error) {
 *     return NextResponse.json({ error: auth.error }, { status: 401 })
 *   }
 *   // ... rest of route logic
 * }
 */
export async function requireAdminAuth(request: NextRequest): Promise<
  | { authorized: true; user: { id: string; email: string; name: string; isAdmin: boolean } }
  | { authorized: false; response: NextResponse }
> {
  const auth = await verifyAdminAuth(request)
  
  if (auth.error || !auth.user) {
    return {
      authorized: false,
      response: NextResponse.json(
        { error: auth.error || 'Unauthorized' },
        { status: 401 }
      )
    }
  }

  return {
    authorized: true,
    user: auth.user
  }
}

