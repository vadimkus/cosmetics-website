import { NextRequest, NextResponse } from 'next/server'
import { rateLimitSimple, getClientIdentifierFromNextRequest } from '@/lib/rateLimitSimple'
import { findUserByEmail, updateUser } from '@/lib/userStorageDb'
import { requireCsrfToken } from '@/lib/csrf'
import { requireBodySizeLimit, getSizeLimitForContentType } from '@/lib/requestSizeLimit'
import bcrypt from 'bcryptjs'

const loginLimiter = rateLimitSimple({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
})

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  console.log('[LOGIN] Request started')
  
  try {
    // CSRF protection
    console.log('[LOGIN] Checking CSRF token...')
    const csrfCheck = await requireCsrfToken(request)
    if (!csrfCheck.valid) {
      console.log('[LOGIN] CSRF check failed')
      return csrfCheck.response!
    }
    console.log('[LOGIN] CSRF check passed', Date.now() - startTime, 'ms')

    // Request body size limit check (DoS prevention)
    console.log('[LOGIN] Checking body size...')
    const sizeLimit = getSizeLimitForContentType(request)
    const sizeCheck = requireBodySizeLimit(request, sizeLimit)
    if (!sizeCheck.valid) {
      console.log('[LOGIN] Body size check failed')
      return sizeCheck.response!
    }

    // Apply rate limiting
    console.log('[LOGIN] Getting client identifier...')
    let clientIdentifier: string
    try {
      clientIdentifier = getClientIdentifierFromNextRequest(request)
    } catch (rateLimitError) {
      console.error('[LOGIN] Rate limit identifier error:', rateLimitError)
      clientIdentifier = 'unknown'
    }

    // Apply rate limiting - fail closed for security
    console.log('[LOGIN] Applying rate limiting...', Date.now() - startTime, 'ms')
    const rateLimitStart = Date.now()
    const rateLimitResult = await loginLimiter(clientIdentifier)
    console.log('[LOGIN] Rate limiting completed', Date.now() - rateLimitStart, 'ms')
    if (!rateLimitResult.success) {
      console.log('[LOGIN] Rate limit exceeded')
      return NextResponse.json(
        { error: rateLimitResult.message || 'Rate limit exceeded' },
        { status: 429 }
      )
    }
    console.log('[LOGIN] Rate limiting passed', Date.now() - startTime, 'ms')

    console.log('[LOGIN] Parsing request body...')
    const { email, password } = await request.json()
    console.log('[LOGIN] Email:', email, Date.now() - startTime, 'ms')

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Find user in database
    console.log('[LOGIN] Searching for user:', email, Date.now() - startTime, 'ms')
    const dbStart = Date.now()
    const user = await findUserByEmail(email)
    console.log('[LOGIN] Database query completed', Date.now() - dbStart, 'ms', 'User found:', !!user)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Check password - only bcrypt hashes allowed
    console.log('[LOGIN] Verifying password...', Date.now() - startTime, 'ms')
    let passwordMatches = false
    try {
      if (user.password && user.password.startsWith('$2')) {
        // bcrypt hash
        const bcryptStart = Date.now()
        passwordMatches = await bcrypt.compare(password, user.password)
        console.log('[LOGIN] Password verification completed', Date.now() - bcryptStart, 'ms')
      } else {
        // Legacy plaintext passwords are no longer supported
        console.warn('Legacy plaintext password detected for user:', user.email)
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
      console.error('Error updating last login timestamp:', error)
      // Don't fail login if timestamp update fails
    }

    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = updatedUser
    return NextResponse.json({
      user: userWithoutPassword,
      message: 'Login successful'
    })

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}