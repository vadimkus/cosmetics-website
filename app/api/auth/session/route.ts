import { NextRequest, NextResponse } from 'next/server'
import { findUserByEmail } from '@/lib/userStorageDb'
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
    } catch (error) {
      errorLog('Error parsing session cookie:', error)
      return NextResponse.json({ user: null })
    }

    if (!sessionData.email) {
      return NextResponse.json({ user: null })
    }

    // Fetch latest user data from database
    const user = await findUserByEmail(sessionData.email)
    
    if (!user) {
      return NextResponse.json({ user: null })
    }

    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = user
    
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
  } catch (error) {
    errorLog('Session check error:', error)
    return NextResponse.json({ user: null })
  }
}

