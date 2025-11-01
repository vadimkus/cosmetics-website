import { NextRequest, NextResponse } from 'next/server'
import { findUserByEmail, updateUser } from '@/lib/userStorageDb'
import bcrypt from 'bcryptjs'
import { rateLimitSimple, getClientIdentifierFromNextRequest } from '@/lib/rateLimitSimple'

const adminLoginLimiter = rateLimitSimple({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // 3 attempts per window for admin
  message: 'Too many admin login attempts. Please try again later.'
})

export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting
    let clientIdentifier: string
    try {
      clientIdentifier = getClientIdentifierFromNextRequest(request)
    } catch (rateLimitError) {
      console.error('Rate limit identifier error:', rateLimitError)
      // Continue without rate limiting if identifier fails
      clientIdentifier = 'unknown'
    }

    // Apply rate limiting - fail closed for security
    const rateLimitResult = await adminLoginLimiter(clientIdentifier)
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

    // Check if user exists in database and is admin
    const user = await findUserByEmail(email)
    
    if (!user || !user.isAdmin) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Only allow bcrypt hashed passwords - no plaintext support
    if (!user.password || !user.password.startsWith('$2')) {
      return NextResponse.json(
        { error: 'Account requires password reset. Please contact support.' },
        { status: 401 }
      )
    }

    // Verify password with bcrypt
    const isValid = await bcrypt.compare(password, user.password)

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Update last login timestamp
    try {
      await updateUser(user.id, { lastLoginAt: new Date().toISOString() })
    } catch (error) {
      console.error('Error updating admin last login timestamp:', error)
      // Don't fail login if timestamp update fails
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        isAdmin: true
      }
    })
  } catch (error) {
    console.error('Admin login error:', error)
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined
    })
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}