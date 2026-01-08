import { NextRequest, NextResponse } from 'next/server'
import { findUserByEmail } from '@/lib/userStorageDb'
import { errorLog, debugLog } from '@/lib/logger'
import crypto from 'crypto'

// Admin session secret - must be set in production
const ADMIN_SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || process.env.JWT_SECRET || 'admin-session-fallback-dev-only'

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
    
    // Verify signature
    const expectedSignature = crypto
      .createHmac('sha256', ADMIN_SESSION_SECRET)
      .update(payloadBase64)
      .digest('base64url')
    
    if (signature !== expectedSignature) {
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
    // First, try to verify using signed session token (secure method)
    const sessionToken = request.cookies.get('admin-session')?.value
    
    if (sessionToken) {
      const tokenPayload = verifyAdminSessionToken(sessionToken)
      
      if (tokenPayload) {
        // Verify the user still exists and is still an admin
        const user = await findUserByEmail(tokenPayload.email)
        
        if (user && user.isAdmin) {
          return {
            user: {
              id: user.id,
              email: user.email,
              name: user.name,
              isAdmin: true
            },
            error: null
          }
        }
      }
    }
    
    // Fallback: Get admin email from headers or cookies (legacy method - for backward compatibility)
    const adminEmail = 
      request.headers.get('x-admin-email') || 
      request.cookies.get('admin-email')?.value ||
      null

    if (!adminEmail) {
      return {
        user: null,
        error: 'Admin authentication required. Please log in.'
      }
    }

    // Verify user exists and is admin
    const user = await findUserByEmail(adminEmail)
    
    if (!user || !user.isAdmin) {
      return {
        user: null,
        error: 'Invalid admin credentials. Please log in again.'
      }
    }

    // Log that legacy auth was used (for monitoring purposes)
    debugLog('⚠️ Admin auth using legacy email-only method for:', adminEmail)

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

