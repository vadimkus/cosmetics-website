import { NextRequest, NextResponse } from 'next/server'
import { findUserByEmail, updateUser } from '@/lib/userStorageDb'
import { errorLog, debugLog } from '@/lib/logger'
import bcrypt from 'bcryptjs'
import { rateLimitSimple, getClientIdentifierFromNextRequest } from '@/lib/rateLimitSimple'
import { generateAdminSessionToken } from '@/lib/adminAuth'
import { getDirectPrismaClient } from '@/lib/prisma'

const adminLoginLimiter = rateLimitSimple({
  name: 'admin-login',
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 attempts per window for admin
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
    let user = await findUserByEmail(email)

    // Prisma Accelerate can occasionally time out while the underlying
    // PostgreSQL database remains healthy. Admin login is a critical recovery
    // path, so fall back to the existing direct, pooled connection before
    // reporting invalid credentials.
    if (!user) {
      const directPrisma = getDirectPrismaClient()
      if (directPrisma) {
        try {
          user = await directPrisma.user.findUnique({
            where: { email: String(email).trim().toLowerCase() },
          })
        } catch (directError) {
          errorLog('Admin login direct database fallback failed:', directError)
        }
      }
    }
    
    if (!user || !user.isAdmin) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // bcrypt only. The legacy plaintext branch compared with `===`, which leaks
    // how many leading characters matched through timing, and every admin has
    // long since been migrated to a hash, so the branch could only ever help an
    // attacker. A non-hash value in the column now simply fails to log in.
    const isValid =
      typeof user.password === 'string' && user.password.startsWith('$2')
        ? await bcrypt.compare(password, user.password)
        : false

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
      errorLog('Error updating admin last login timestamp:', error)
      // Don't fail login if timestamp update fails
    }

    // Generate signed admin session token
    const sessionToken = generateAdminSessionToken(user.email)
    debugLog('✅ Admin session token generated for:', user.email)

    // Create response with session token cookie
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        isAdmin: true
      }
    })

    // Set secure session cookie (24 hours expiry)
    response.cookies.set('admin-session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60, // 24 hours
      path: '/'
    })

    return response
  } catch (error) {
    errorLog('Admin login error:', error)
    errorLog('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined
    })
    return NextResponse.json(
      {
        error: 'Internal server error',
        // Never leak internal error messages (DB/Prisma details) in production
        ...(process.env.NODE_ENV === 'development'
          ? { details: error instanceof Error ? error.message : 'Unknown error' }
          : {}),
      },
      { status: 500 }
    )
  }
}