import { NextResponse } from 'next/server'

/**
 * POST /api/auth/logout
 * Clears the session cookie to log the user out
 */
export async function POST() {
  const response = NextResponse.json({ 
    success: true,
    message: 'Logged out successfully' 
  })
  
  // Clear the session cookie
  response.cookies.delete('genosys_session')
  response.cookies.set('genosys_session', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0, // Expire immediately
    path: '/',
  })
  
  return response
}

