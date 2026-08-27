import { NextResponse } from 'next/server'

/**
 * POST /api/auth/admin-logout
 * Expires the httpOnly admin-session cookie. Without this, clicking Logout
 * in the admin UI only cleared localStorage - the cookie stayed valid for
 * up to 24h on the machine.
 */
export async function POST() {
  const response = NextResponse.json({
    success: true,
    message: 'Admin logged out',
  })

  response.cookies.delete('admin-session')
  response.cookies.set('admin-session', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0, // Expire immediately
    path: '/',
  })

  return response
}
