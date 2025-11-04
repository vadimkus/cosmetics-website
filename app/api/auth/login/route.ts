import { NextRequest, NextResponse } from 'next/server'
import { rateLimitSimple, getClientIdentifierFromNextRequest } from '@/lib/rateLimitSimple'
import { findUserByEmail, updateUser } from '@/lib/userStorageDb'
import { requireCsrfToken } from '@/lib/csrf'
import { requireBodySizeLimit, getSizeLimitForContentType } from '@/lib/requestSizeLimit'
import { debugLog, errorLog, warnLog } from '@/lib/logger'
import bcrypt from 'bcryptjs'

const loginLimiter = rateLimitSimple({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
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
    const rateLimitResult = await loginLimiter(clientIdentifier)
    debugLog('[LOGIN] Rate limiting completed', Date.now() - rateLimitStart, 'ms')
    if (!rateLimitResult.success) {
      debugLog('[LOGIN] Rate limit exceeded')
      return NextResponse.json(
        { error: rateLimitResult.message || 'Rate limit exceeded' },
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

    // Check password - only bcrypt hashes allowed
    debugLog('[LOGIN] Verifying password...', Date.now() - startTime, 'ms')
    let passwordMatches = false
    try {
      if (user.password && user.password.startsWith('$2')) {
        // bcrypt hash
        const bcryptStart = Date.now()
        passwordMatches = await bcrypt.compare(password, user.password)
        debugLog('[LOGIN] Password verification completed', Date.now() - bcryptStart, 'ms')
      } else {
        // Legacy plaintext passwords are no longer supported
        warnLog('Legacy plaintext password detected for user:', user.email)
        return NextResponse.json(
          { error: 'Account requires password reset. Please contact support.' },
          { status: 401 }
        )
      }
    } catch (e) {
      passwordMatches = false
    }

    if (!passwordMatches) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Update last login timestamp
    let updatedUser = user
    try {
      await updateUser(user.id, { lastLoginAt: new Date().toISOString() })
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
    const { password: _, ...userWithoutPassword } = updatedUser
    return NextResponse.json({
      user: userWithoutPassword,
      message: 'Login successful'
    })

  } catch (error) {
    errorLog('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}