import { NextRequest, NextResponse } from 'next/server'
import { generateCsrfToken, setCsrfTokenCookie } from '@/lib/csrf'

/**
 * GET /api/csrf-token
 * Returns a CSRF token and sets it as a cookie
 * Client should include this token in subsequent POST/PUT/DELETE requests
 */
export async function GET(request: NextRequest) {
  // Check if token already exists in cookie
  const existingToken = request.cookies.get('csrf-token')?.value
  
  if (existingToken) {
    const response = NextResponse.json({ token: existingToken })
    return setCsrfTokenCookie(response, existingToken)
  }

  // Generate new token
  const token = generateCsrfToken()
  const response = NextResponse.json({ token })
  
  // Set cookie
  return setCsrfTokenCookie(response, token)
}

