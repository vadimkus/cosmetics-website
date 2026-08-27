import { NextRequest, NextResponse } from 'next/server'
import { findUserByEmail, findUserById } from '@/lib/userStorageDb'
import { errorLog, debugLog } from '@/lib/logger'
import { verifySessionToken } from '@/lib/jwt'
import { trackUserActivity } from '@/lib/activityTracker'

/**
 * GET /api/auth/session
 * Returns the current user from the session cookie (set after Google OAuth or regular login)
 * Now supports signed JWT tokens for tamper protection
 * 
 * Also serves as a heartbeat for web user activity tracking.
 * Called every ~5 minutes by UserRefreshWrapper on the client side,
 * so we piggyback activity tracking here (throttled to 1 DB write per minute).
 */
export async function GET(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get('genosys_session')
    
    if (!sessionCookie) {
      return NextResponse.json({ user: null })
    }

    // Verify and decode the session token (handles both JWT and legacy JSON format)
    const sessionData = verifySessionToken(sessionCookie.value)
    
    if (!sessionData) {
      debugLog('Invalid or expired session token')
      return NextResponse.json({ user: null })
    }

    if (!sessionData.email && !sessionData.id) {
      return NextResponse.json({ user: null })
    }

    // Fetch latest user data from database (prefer id if present)
    const user = sessionData.id
      ? await findUserById(sessionData.id)
      : await findUserByEmail(sessionData.email)
    
    if (!user) {
      return NextResponse.json({ user: null })
    }

    // Revocation check: tokens carry the tokenVersion they were issued with.
    // A password change/reset bumps users.tokenVersion, killing older sessions.
    const userTv = (user as { tokenVersion?: number }).tokenVersion ?? 0
    if ((sessionData.tv ?? 0) !== userTv) {
      debugLog('Session token revoked (tokenVersion mismatch)')
      return NextResponse.json({ user: null })
    }

    // Track web user activity (throttled - updates DB at most once per minute)
    // This serves as a heartbeat since UserRefreshWrapper calls this endpoint periodically
    trackUserActivity(user.id)

    // Return user data (without password)
    const { password: __, ...userWithoutPassword } = user
    
    return NextResponse.json({ 
      user: userWithoutPassword 
    })
  } catch (error) {
    errorLog('Session check error:', error)
    return NextResponse.json({ user: null })
  }
}

