import { NextRequest, NextResponse } from 'next/server'
import { rateLimitSimple, getClientIdentifierFromNextRequest } from '@/lib/rateLimitSimple'
import { findUserByEmail, updateUser } from '@/lib/userStorageDb'
import { requireCsrfToken } from '@/lib/csrf'
import { requireBodySizeLimit, getSizeLimitForContentType } from '@/lib/requestSizeLimit'
import { debugLog, errorLog, warnLog } from '@/lib/logger'
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

    // Check if user has a password (social login users don't have passwords)
    if (!user.password) {
      return NextResponse.json(
        { error: 'This account was created with social login. Please sign in with Google instead.' },
        { status: 401 }
      )
    }

    // Check password - handle both bcrypt and legacy plaintext passwords
    debugLog('[LOGIN] Verifying password...', Date.now() - startTime, 'ms')
    let passwordMatches = false
    let needsPasswordUpgrade = false
    
    try {
      if (user.password && user.password.startsWith('$2')) {
        // bcrypt hash - normal verification
        const bcryptStart = Date.now()
        passwordMatches = await bcrypt.compare(password, user.password)
        debugLog('[LOGIN] Password verification completed', Date.now() - bcryptStart, 'ms')
      } else {
        // Legacy plaintext password - check if it matches, then upgrade to bcrypt
        warnLog('Legacy plaintext password detected for user:', user.email)
        
        // Compare plaintext password
        if (user.password === password) {
          passwordMatches = true
          needsPasswordUpgrade = true
          debugLog('[LOGIN] Plaintext password matches, will upgrade to bcrypt')
        } else {
          passwordMatches = false
          debugLog('[LOGIN] Plaintext password does not match')
        }
      }
    } catch (e) {
      passwordMatches = false
      errorLog('[LOGIN] Password verification error:', e)
    }

    if (!passwordMatches) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Upgrade plaintext password to bcrypt if needed
    if (needsPasswordUpgrade) {
      try {
        debugLog('[LOGIN] Upgrading plaintext password to bcrypt for user:', user.email)
        const hashedPassword = await bcrypt.hash(password, 12)
        await updateUser(user.id, { password: hashedPassword })
        debugLog('[LOGIN] Password successfully upgraded to bcrypt')
      } catch (upgradeError) {
        errorLog('[LOGIN] Error upgrading password:', upgradeError)
        // Don't fail login if upgrade fails - user can try again next time
        warnLog('Password upgrade failed, but allowing login to proceed')
      }
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
    const { password: __, ...userWithoutPassword } = updatedUser
    
    // Set session cookie (for consistency with Google OAuth)
    const userSessionData = {
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      isAdmin: updatedUser.isAdmin || false,
      canSeePrices: updatedUser.canSeePrices !== undefined ? updatedUser.canSeePrices : true,
      profilePicture: updatedUser.profilePicture || null,
    }
    
    const response = NextResponse.json({
      user: userWithoutPassword,
      message: 'Login successful'
    })
    
    response.cookies.set('genosys_session', JSON.stringify(userSessionData), {
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