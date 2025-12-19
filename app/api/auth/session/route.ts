import { NextRequest, NextResponse } from 'next/server'
import { findUserByEmail, findUserById } from '@/lib/userStorageDb'
import { errorLog, debugLog } from '@/lib/logger'

/**
 * GET /api/auth/session
 * Returns the current user from the session cookie (set after Google OAuth or regular login)
 */
export async function GET(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get('genosys_session')
    
    if (!sessionCookie) {
      return NextResponse.json({ user: null })
    }

    let sessionData
    try {
      sessionData = JSON.parse(sessionCookie.value)
    } catch {
      errorLog('Error parsing session cookie:', error)
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

    // Return user data (without password)
    const { password: __, ...userWithoutPassword } = user
    
    // Debug logging for profile picture (always log for troubleshooting)
    debugLog('[SESSION_API] User profile picture:', {
      email: user.email,
      profilePicture: user.profilePicture,
      profilePictureType: typeof user.profilePicture,
      isNull: user.profilePicture === null,
      isUndefined: user.profilePicture === undefined,
      hasProfilePicture: !!user.profilePicture,
      profilePictureLength: user.profilePicture?.length || 0,
      profilePicturePreview: user.profilePicture ? user.profilePicture.substring(0, 50) + '...' : 'N/A',
      fullUserObject: JSON.stringify(userWithoutPassword, null, 2)
    })
    
    return NextResponse.json({ 
      user: userWithoutPassword 
    })
  } catch {
    errorLog('Session check error:', error)
    return NextResponse.json({ user: null })
  }
}

