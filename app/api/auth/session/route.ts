import { NextRequest, NextResponse } from 'next/server'
import { findUserByEmail } from '@/lib/userStorageDb'
import { errorLog } from '@/lib/logger'

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
    
    return NextResponse.json({ 
      user: userWithoutPassword 
    })
  } catch (error) {
    errorLog('Session check error:', error)
    return NextResponse.json({ user: null })
  }
}

