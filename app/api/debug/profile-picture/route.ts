import { NextRequest, NextResponse } from 'next/server'
import { findUserByEmail } from '@/lib/userStorageDb'
import { errorLog, debugLog } from '@/lib/logger'

/**
 * GET /api/debug/profile-picture
 * Debug endpoint to check profile picture status for the current user
 */
export async function GET(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get('genosys_session')
    
    if (!sessionCookie) {
      return NextResponse.json({ 
        error: 'No session found',
        loggedIn: false 
      })
    }

    let sessionData
    try {
      sessionData = JSON.parse(sessionCookie.value)
    } catch (error) {
      return NextResponse.json({ 
        error: 'Invalid session cookie',
        loggedIn: false 
      })
    }

    if (!sessionData.email) {
      return NextResponse.json({ 
        error: 'No email in session',
        loggedIn: false 
      })
    }

    // Fetch user from database
    const user = await findUserByEmail(sessionData.email)
    
    if (!user) {
      return NextResponse.json({ 
        error: 'User not found in database',
        email: sessionData.email,
        loggedIn: true 
      })
    }

    // Log to server console for debugging
    debugLog('[DEBUG_PROFILE_PICTURE] Database check:', {
      email: user.email,
      profilePictureRaw: user.profilePicture,
      profilePictureType: typeof user.profilePicture,
      isNull: user.profilePicture === null,
      isUndefined: user.profilePicture === undefined,
      isString: typeof user.profilePicture === 'string',
      length: user.profilePicture?.length || 0
    })
    
    // Return detailed profile picture information
    return NextResponse.json({ 
      success: true,
      email: user.email,
      name: user.name,
      profilePicture: {
        value: user.profilePicture,
        exists: !!user.profilePicture,
        isNull: user.profilePicture === null,
        isUndefined: user.profilePicture === undefined,
        length: user.profilePicture?.length || 0,
        type: typeof user.profilePicture,
        preview: user.profilePicture ? user.profilePicture.substring(0, 100) + '...' : 'N/A',
        fullValue: user.profilePicture // Include full value for debugging
      },
      userFromDatabase: {
        id: user.id,
        email: user.email,
        name: user.name,
        profilePicture: user.profilePicture
      }
    })
  } catch (error) {
    errorLog('Debug profile picture error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

