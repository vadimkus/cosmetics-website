import { NextRequest, NextResponse } from 'next/server'
import { findUserByEmail, updateUser } from '@/lib/userStorageDb'
import { errorLog } from '@/lib/logger'
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
      errorLog('Rate limit identifier error:', rateLimitError)
      // Continue without rate limiting if identifier fails
      clientIdentifier = 'unknown'
    }

    // Apply rate limiting - fail closed for security
    let rateLimitResult
    try {
      rateLimitResult = await adminLoginLimiter(clientIdentifier)
    } catch (rateLimitError) {
      errorLog('Admin login rate limiting error:', rateLimitError)
      // Fail closed - reject request if rate limiting fails
      return NextResponse.json(
        { error: 'Rate limiting service unavailable. Please try again later.' },
        { status: 503 }
      )
    }
    
    if (!rateLimitResult || !rateLimitResult.success) {
      return NextResponse.json(
        { error: rateLimitResult?.message || 'Rate limit exceeded' },
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

    // Check password - handle both bcrypt and legacy plaintext passwords
    let isValid = false
    let needsPasswordUpgrade = false
    
    if (user.password && user.password.startsWith('$2')) {
      // bcrypt hash - normal verification
      isValid = await bcrypt.compare(password, user.password)
    } else {
      // Legacy plaintext password - check if it matches, then upgrade to bcrypt
      if (user.password === password) {
        isValid = true
        needsPasswordUpgrade = true
      } else {
        isValid = false
      }
    }

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Upgrade plaintext password to bcrypt if needed
    if (needsPasswordUpgrade) {
      try {
        const hashedPassword = await bcrypt.hash(password, 12)
        await updateUser(user.id, { password: hashedPassword })
      } catch (upgradeError) {
        errorLog('Error upgrading admin password:', upgradeError)
        // Don't fail login if upgrade fails
      }
    }

    // Update last login timestamp
    try {
      await updateUser(user.id, { lastLoginAt: new Date().toISOString() })
    } catch (error) {
      errorLog('Error updating admin last login timestamp:', error)
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
    errorLog('Admin login error:', error)
    errorLog('Error details:', {
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