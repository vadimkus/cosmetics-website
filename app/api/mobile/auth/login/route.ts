import { NextRequest, NextResponse } from 'next/server'
import { findUserByEmail, updateUser } from '@/lib/userStorageDb'
import { generateMobileToken, validateMobileAuth } from '@/lib/jwt'
import { rateLimitSimple, getClientIdentifierFromNextRequest } from '@/lib/rateLimitSimple'
import { debugLog, errorLog } from '@/lib/logger'
import bcrypt from 'bcryptjs'

// Rate limiting for mobile login
const mobileLoginLimiter = rateLimitSimple({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 attempts per window (more lenient for mobile)
})

/**
 * Mobile Login Endpoint
 * POST /api/mobile/auth/login
 * 
 * Headers Required:
 * - x-api-key: Mobile app API key
 * - Content-Type: application/json
 * 
 * Body:
 * - email: User email
 * - password: User password
 * 
 * Returns:
 * - success: boolean
 * - user: User data (without password)
 * - token: JWT authentication token
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now()
  debugLog('[MOBILE_AUTH] Login request started')

  try {
    // Validate API key
    const apiKey = request.headers.get('x-api-key')
    const authValidation = validateMobileAuth(apiKey, null)
    
    if (!authValidation.valid) {
      return NextResponse.json(
        { 
          success: false, 
          error: authValidation.error 
        },
        { status: authValidation.status || 500 }
      )
    }

    // Apply rate limiting
    let clientIdentifier: string
    try {
      clientIdentifier = getClientIdentifierFromNextRequest(request)
    } catch (error) {
      errorLog('[MOBILE_AUTH] Rate limit identifier error:', error)
      clientIdentifier = 'unknown'
    }

    const rateLimitResult = await mobileLoginLimiter(clientIdentifier)
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Too many login attempts. Please try again later.' 
        },
        { status: 429 }
      )
    }

    // Parse request body
    const { email, password } = await request.json()

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Email and password are required' 
        },
        { status: 400 }
      )
    }

    // Find user in database
    const user = await findUserByEmail(email)
    if (!user) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid email or password' 
        },
        { status: 401 }
      )
    }

    // Verify password
    let passwordValid = false
    
    if (user.password) {
      // Check if password is bcrypt hashed (starts with $2a$, $2b$, or $2y$)
      if (user.password.startsWith('$2')) {
        passwordValid = await bcrypt.compare(password, user.password)
      } else {
        // Legacy plaintext password - compare directly and then upgrade to bcrypt
        if (user.password === password) {
          passwordValid = true
          
          // Upgrade to bcrypt hash
          try {
            const hashedPassword = await bcrypt.hash(password, 12)
            await updateUser(user.id, { password: hashedPassword })
            debugLog('Password upgraded to bcrypt for user:', email)
          } catch (upgradeError) {
            errorLog('Failed to upgrade password for user:', email, upgradeError)
            // Don't fail login if password upgrade fails
          }
        }
      }
    }

    if (!passwordValid) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid email or password' 
        },
        { status: 401 }
      )
    }

    // Update last login timestamp
    try {
      await updateUser(user.id, { lastLoginAt: new Date().toISOString() })
    } catch (error) {
      errorLog('Error updating last login timestamp:', error)
      // Don't fail login if timestamp update fails
    }

    // Generate JWT token
    const token = generateMobileToken({
      id: user.id,
      email: user.email,
      name: user.name,
      isAdmin: user.isAdmin || false,
      canSeePrices: user.canSeePrices !== false
    })

    // Return user data without password
    const { password: __, ...userWithoutPassword } = user

    const duration = Date.now() - startTime
    debugLog(`[MOBILE_AUTH] Login successful for ${email} in ${duration}ms`)

    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
      token,
      message: 'Login successful'
    })

  } catch (error) {
    const duration = Date.now() - startTime
    errorLog('[MOBILE_AUTH] Login error:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      duration: `${duration}ms`,
      stack: error instanceof Error ? error.stack : undefined
    })

    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error' 
      },
      { status: 500 }
    )
  }
}

/**
 * Handle unsupported HTTP methods
 */
export async function GET() {
  return NextResponse.json(
    { success: false, error: 'Method not allowed' },
    { status: 405 }
  )
}

export async function PUT() {
  return NextResponse.json(
    { success: false, error: 'Method not allowed' },
    { status: 405 }
  )
}

export async function DELETE() {
  return NextResponse.json(
    { success: false, error: 'Method not allowed' },
    { status: 405 }
  )
}
