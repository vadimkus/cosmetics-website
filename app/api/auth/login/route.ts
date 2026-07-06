import { NextRequest, NextResponse } from 'next/server'
import { rateLimitSimple, getClientIdentifierFromNextRequest } from '@/lib/rateLimitSimple'
import { findUserByEmail, updateUser } from '@/lib/userStorageDb'
import { requireCsrfToken } from '@/lib/csrf'
import { requireBodySizeLimit, getSizeLimitForContentType } from '@/lib/requestSizeLimit'
import { debugLog, errorLog } from '@/lib/logger'
import { createSessionToken } from '@/lib/jwt'
import { trackUserActivityNow } from '@/lib/activityTracker'
import bcrypt from 'bcryptjs'

const loginLimiter = rateLimitSimple({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // 20 attempts per window
})

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  debugLog('[LOGIN] Request started')
  
  try {
    // CSRF protection
    debugLog('[LOGIN] Checking CSRF token...')
    const csrfCheck = await requireCsrfToken(request)
    if (!csrfCheck.valid) {
      debugLog('[LOGIN] CSRF check failed')
      return csrfCheck.response!
    }
    debugLog('[LOGIN] CSRF check passed', Date.now() - startTime, 'ms')

    // Request body size limit check (DoS prevention)
    debugLog('[LOGIN] Checking body size...')
    const sizeLimit = getSizeLimitForContentType(request)
    const sizeCheck = requireBodySizeLimit(request, sizeLimit)
    if (!sizeCheck.valid) {
      debugLog('[LOGIN] Body size check failed')
      return sizeCheck.response!
    }

    // Apply rate limiting
    debugLog('[LOGIN] Getting client identifier...')
    let clientIdentifier: string
    try {
      clientIdentifier = getClientIdentifierFromNextRequest(request)
    } catch (rateLimitError) {
      errorLog('[LOGIN] Rate limit identifier error:', rateLimitError)
      clientIdentifier = 'unknown'
    }

    // Apply rate limiting - fail closed for security
    debugLog('[LOGIN] Applying rate limiting...', Date.now() - startTime, 'ms')
    const rateLimitStart = Date.now()
    let rateLimitResult
    try {
      rateLimitResult = await loginLimiter(clientIdentifier)
    } catch (rateLimitError) {
      errorLog('[LOGIN] Rate limiting error:', rateLimitError)
      // Fail closed - reject request if rate limiting fails
      return NextResponse.json(
        { error: 'Rate limiting service unavailable. Please try again later.' },
        { status: 503 }
      )
    }
    debugLog('[LOGIN] Rate limiting completed', Date.now() - rateLimitStart, 'ms')
    
    if (!rateLimitResult || !rateLimitResult.success) {
      debugLog('[LOGIN] Rate limit exceeded')
      return NextResponse.json(
        { error: rateLimitResult?.message || 'Rate limit exceeded' },
        { status: 429 }
      )
    }
    debugLog('[LOGIN] Rate limiting passed', Date.now() - startTime, 'ms')

    debugLog('[LOGIN] Parsing request body...')
    const { email, password } = await request.json()
    debugLog('[LOGIN] Email:', email, Date.now() - startTime, 'ms')

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Find user in database
    debugLog('[LOGIN] Searching for user:', email, Date.now() - startTime, 'ms')
    const dbStart = Date.now()
    const user = await findUserByEmail(email)
    debugLog('[LOGIN] Database query completed', Date.now() - dbStart, 'ms', 'User found:', !!user)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Check if user has a password (social login users don't have passwords).
    // Method-agnostic hint: don't reveal WHICH provider the account uses.
    if (!user.password) {
      return NextResponse.json(
        { error: 'This account uses social sign-in. Please use the Google or Apple button to log in.' },
        { status: 401 }
      )
    }

    // Verify bcrypt password. Legacy plaintext passwords were migrated to
    // bcrypt in bulk (scripts/migrate-plaintext-passwords.ts, 2026-07-06),
    // so the plaintext comparison path is gone.
    debugLog('[LOGIN] Verifying password...', Date.now() - startTime, 'ms')
    let passwordMatches = false
    try {
      passwordMatches = await bcrypt.compare(password, user.password)
    } catch (error) {
      passwordMatches = false
      errorLog('[LOGIN] Password verification error:', error)
    }

    if (!passwordMatches) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Detect login source from User-Agent
    const userAgent = request.headers.get('user-agent') || ''
    const isMobileDevice = /mobile|android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase())
    const loginSource = isMobileDevice ? 'mobile_web' : 'desktop_web'

    // Update last login timestamp, source, and activity
    let updatedUser = user
    try {
      await updateUser(user.id, { 
        lastLoginAt: new Date().toISOString(),
        lastLoginSource: loginSource
      })
      // Update lastActiveAt immediately on login (for online status tracking)
      await trackUserActivityNow(user.id)
      // Fetch updated user to get the latest lastLoginAt value
      const refreshedUser = await findUserByEmail(email)
      if (refreshedUser) {
        updatedUser = refreshedUser
      }
    } catch (error) {
      errorLog('Error updating last login timestamp:', error)
      // Don't fail login if timestamp update fails
    }

    // Return user data (without password)
    const { password: __, ...userWithoutPassword } = updatedUser
    
    // Create signed session token (prevents tampering)
    // Fallback to legacy JSON if JWT creation fails
    let sessionToken: string
    try {
      sessionToken = createSessionToken({
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        isAdmin: updatedUser.isAdmin || false,
        canSeePrices: updatedUser.canSeePrices !== undefined ? updatedUser.canSeePrices : true,
        profilePicture: updatedUser.profilePicture || null,
        tokenVersion: (updatedUser as { tokenVersion?: number }).tokenVersion ?? 0,
      })
      debugLog('[LOGIN] Created signed session token')
    } catch (jwtError) {
      errorLog('[LOGIN] JWT creation failed, using legacy format:', jwtError)
      sessionToken = JSON.stringify({
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        isAdmin: updatedUser.isAdmin || false,
        canSeePrices: updatedUser.canSeePrices !== undefined ? updatedUser.canSeePrices : true,
        profilePicture: updatedUser.profilePicture || null,
      })
    }
    
    const response = NextResponse.json({
      user: userWithoutPassword,
      message: 'Login successful'
    })
    
    // Set session cookie (httpOnly prevents XSS access)
    response.cookies.set('genosys_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/',
    })
    
    return response

  } catch (error) {
    errorLog('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}