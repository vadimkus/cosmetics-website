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
  try {
    // CSRF protection
    const csrfCheck = await requireCsrfToken(request)
    if (!csrfCheck.valid) {
      return csrfCheck.response!
    }

    // Request body size limit check (DoS prevention)
    const sizeLimit = getSizeLimitForContentType(request)
    const sizeCheck = requireBodySizeLimit(request, sizeLimit)
    if (!sizeCheck.valid) {
      return sizeCheck.response!
    }

    // Apply rate limiting
    let clientIdentifier: string
    try {
      clientIdentifier = getClientIdentifierFromNextRequest(request)
    } catch (rateLimitError) {
      console.error('Rate limit identifier error:', rateLimitError)
      clientIdentifier = 'unknown'
    }

    // Apply rate limiting - fail closed for security
    const rateLimitResult = await loginLimiter(clientIdentifier)
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: rateLimitResult.message || 'Rate limit exceeded' },
        { status: 429 }
      )
    }

    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Find user in database
    const user = await findUserByEmail(email)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Check password - only bcrypt hashes allowed
    let passwordMatches = false
    try {
      if (user.password && user.password.startsWith('$2')) {
        // bcrypt hash
        passwordMatches = await bcrypt.compare(password, user.password)
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
    try {
      await updateUser(user.id, { lastLoginAt: new Date().toISOString() })
    } catch (error) {
      console.error('Error updating last login timestamp:', error)
      // Don't fail login if timestamp update fails
    }

    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = user
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