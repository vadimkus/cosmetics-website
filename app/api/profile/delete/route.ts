import { NextRequest, NextResponse } from 'next/server'
import { anonymizeUser, findUserByEmail, findUserById } from '@/lib/userStorageDb'
import { errorLog } from '@/lib/logger'
import { requireCsrfToken } from '@/lib/csrf'

export async function DELETE(request: NextRequest) {
  // CSRF protection
  const csrfCheck = await requireCsrfToken(request)
  if (!csrfCheck.valid) {
    return csrfCheck.response!
  }

  try {
    // Determine user from session cookie (do NOT trust client-provided userId)
    const sessionCookie = request.cookies.get('genosys_session')
    if (!sessionCookie?.value) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    let sessionData: any = null
    try {
      sessionData = JSON.parse(sessionCookie.value)
    } catch {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
    }

    const user = sessionData?.id
      ? await findUserById(sessionData.id)
      : sessionData?.email
        ? await findUserByEmail(sessionData.email)
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