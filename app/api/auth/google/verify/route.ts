import { NextRequest, NextResponse } from 'next/server'
import { verifyGoogleIdToken } from '@/lib/googleAuth'
import { findUserByEmail, addUser, updateUser } from '@/lib/userStorageDb'
import { errorLog, debugLog } from '@/lib/logger'
import { rateLimitSimple, getClientIdentifierFromNextRequest } from '@/lib/rateLimitSimple'
import { sendAdminNewUserNotification } from '@/lib/email'
import { trackUserAction } from '@/lib/analyticsServer'

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

        // Track user registration
        try {
          await trackUserAction({
            action: 'user_registered',
            userEmail: googleUser.email,
            details: `New user registered via Google OAuth: ${googleUser.name}`
          })
          debugLog('[GOOGLE_VERIFY] ✅ User registration tracked')
        } catch (trackError) {
          errorLog('[GOOGLE_VERIFY] ❌ Failed to track user registration:', trackError)
          // Don't fail registration if tracking fails
        }

        // Send admin notification for new Google OAuth user registration
        try {
          debugLog('[GOOGLE_VERIFY] 📧 Attempting to send admin notification...')
          const adminResult = await sendAdminNewUserNotification(
            googleUser.name,
            googleUser.email,
            undefined, // Phone not available from Google OAuth
            undefined, // Address not available from Google OAuth
            'Google OAuth' // Registration method
          )
          
          if (adminResult && adminResult.success) {
            debugLog('[GOOGLE_VERIFY] ✅ Admin notification sent successfully for new Google OAuth user:', googleUser.email)
            debugLog('[GOOGLE_VERIFY] ✅ Notification message ID:', adminResult.messageId)
          } else {
            errorLog('[GOOGLE_VERIFY] ❌ FAILED to send admin notification')
            errorLog('[GOOGLE_VERIFY] ❌ Error:', adminResult?.error || 'Unknown error')
            errorLog('[GOOGLE_VERIFY] ❌ Full result:', JSON.stringify(adminResult, null, 2))
          }
        } catch (emailError) {
          errorLog('[GOOGLE_VERIFY] ❌ EXCEPTION sending admin notification')
          errorLog('[GOOGLE_VERIFY] ❌ Exception type:', emailError instanceof Error ? emailError.constructor.name : typeof emailError)
          errorLog('[GOOGLE_VERIFY] ❌ Exception message:', emailError instanceof Error ? emailError.message : String(emailError))
          errorLog('[GOOGLE_VERIFY] ❌ Exception stack:', emailError instanceof Error ? emailError.stack : 'No stack trace')
          // Don't fail registration if email fails
        }
      } catch {
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
  } catch {
    errorLog('[GOOGLE_VERIFY] Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

