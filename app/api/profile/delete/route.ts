import { NextRequest, NextResponse } from 'next/server'
import { anonymizeUser, findUserByEmail, findUserById } from '@/lib/userStorageDb'
import { errorLog } from '@/lib/logger'

/**
 * DELETE /api/profile/delete
 * 
 * Deletes (anonymizes) the current user's account.
 * Uses session cookie for authentication.
 * 
 * Note: CSRF protection is handled by SameSite cookie attribute.
 * Session cookies with SameSite=lax/strict prevent cross-site requests.
 */
export async function DELETE(request: NextRequest) {
  try {
    // Determine user from session cookie (do NOT trust client-provided userId)
    const sessionCookie = request.cookies.get('genosys_session')
    if (!sessionCookie?.value) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    let sessionData: any = null
    try {
      sessionData = JSON.parse(sessionCookie.value)
    } catch (error) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
    }

    // Session can have user data at root level or nested under .user
    const userId = sessionData?.user?.id || sessionData?.id
    const userEmail = sessionData?.user?.email || sessionData?.email
    
    const user = userId
      ? await findUserById(userId)
      : userEmail
        ? await findUserByEmail(userEmail)
        : null

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Anonymize user (preserves orders; relies on FK ON UPDATE CASCADE like mobile)
    const success = await anonymizeUser(user.id)
    
    if (!success) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const response = NextResponse.json({
      success: true,
      message: 'Account deleted successfully'
    })

    // Clear session cookie so the user is logged out immediately
    response.cookies.set('genosys_session', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/',
    })
    return response
  } catch (error) {
    errorLog('Account deletion error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}