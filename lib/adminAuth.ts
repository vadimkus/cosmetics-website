import { NextRequest, NextResponse } from 'next/server'
import { findUserByEmail } from '@/lib/userStorageDb'

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
    // Get admin email from headers (X-Admin-Email) or from request body/cookies
    // Priority: Header > Cookie > Body (for flexibility)
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
    console.error('Admin auth verification error:', error)
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

