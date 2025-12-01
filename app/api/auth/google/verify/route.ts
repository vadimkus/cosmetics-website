import { NextRequest, NextResponse } from 'next/server'
import { verifyGoogleIdToken } from '@/lib/googleAuth'
import { findUserByEmail, addUser, updateUser } from '@/lib/userStorageDb'
import { errorLog, debugLog } from '@/lib/logger'
import { rateLimitSimple, getClientIdentifierFromNextRequest } from '@/lib/rateLimitSimple'

const googleVerifyLimiter = rateLimitSimple({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // 20 attempts per window
})

/**
 * POST /api/auth/google/verify
 * Verifies Google ID token from client-side and returns user data
 * Used when using @react-oauth/google client-side component
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now()
  debugLog('[GOOGLE_VERIFY] Request started')

  try {
    // Apply rate limiting
    let clientIdentifier: string
    try {
      clientIdentifier = getClientIdentifierFromNextRequest(request)
    } catch (rateLimitError) {
      errorLog('[GOOGLE_VERIFY] Rate limit identifier error:', rateLimitError)
      clientIdentifier = 'unknown'
    }

    const rateLimitResult = await googleVerifyLimiter(clientIdentifier)
    if (!rateLimitResult || !rateLimitResult.success) {
      debugLog('[GOOGLE_VERIFY] Rate limit exceeded')
      return NextResponse.json(
        { error: rateLimitResult?.message || 'Rate limit exceeded' },
        { status: 429 }
      )
    }

    // Get ID token from request body
    const { idToken } = await request.json()

    if (!idToken) {
      return NextResponse.json(
        { error: 'ID token is required' },
        { status: 400 }
      )
    }

    // Verify ID token and get user info
    debugLog('[GOOGLE_VERIFY] Verifying ID token...')
    const googleUser = await verifyGoogleIdToken(idToken)
    if (!googleUser) {
      errorLog('[GOOGLE_VERIFY] Failed to verify ID token')
      return NextResponse.json(
        { error: 'Invalid ID token' },
        { status: 401 }
      )
    }

    debugLog('[GOOGLE_VERIFY] Google user verified:', { email: googleUser.email })

    // Find or create user
    let user = await findUserByEmail(googleUser.email)

    if (!user) {
      // Create new user with Google data
      debugLog('[GOOGLE_VERIFY] Creating new user...')
      try {
        user = await addUser({
          name: googleUser.name,
          email: googleUser.email,
          password: null, // No password for Google-authenticated users
          profilePicture: googleUser.picture || null,
          phone: null,
          address: null,
          isAdmin: false,
          canSeePrices: true,
        })
        debugLog('[GOOGLE_VERIFY] New user created:', { id: user.id, email: user.email })
      } catch (error) {
        errorLog('[GOOGLE_VERIFY] Error creating user:', error)
        return NextResponse.json(
          { error: 'Failed to create user account' },
          { status: 500 }
        )
      }
    } else {
      // Existing user - update profile picture if available and not set
      if (googleUser.picture && !user.profilePicture) {
        debugLog('[GOOGLE_VERIFY] Updating profile picture for existing user...')
        await updateUser(user.id, { profilePicture: googleUser.picture })
        user.profilePicture = googleUser.picture
      }

      // Update last login timestamp
      await updateUser(user.id, { lastLoginAt: new Date().toISOString() })
    }

    // Return user data (excluding sensitive fields)
    const userData = {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      address: user.address,
      profilePicture: user.profilePicture,
      birthday: user.birthday,
      isAdmin: user.isAdmin || false,
      canSeePrices: user.canSeePrices !== undefined ? user.canSeePrices : true,
      discountType: user.discountType,
      discountPercentage: user.discountPercentage,
      createdAt: user.createdAt.toISOString(),
    }

    debugLog('[GOOGLE_VERIFY] Success', Date.now() - startTime, 'ms')
    return NextResponse.json({ user: userData })
  } catch (error) {
    errorLog('[GOOGLE_VERIFY] Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

