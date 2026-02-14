import { NextRequest, NextResponse } from 'next/server'
import { validateMobileAuth } from '@/lib/jwt'
import { debugLog, errorLog } from '@/lib/logger'
import { findUserByEmail, addUser, updateUser } from '@/lib/userStorageDb'
import { generateMobileToken } from '@/lib/jwt'
import { verifyAppleIdentityToken } from '@/lib/appleIdentityToken'
import { sendAdminNewUserNotification } from '@/lib/email'
import { trackUserActivityNow } from '@/lib/activityTracker'

export const maxDuration = 30

/**
 * Mobile Apple Sign-In Endpoint
 * POST /api/mobile/auth/apple
 *
 * Headers Required:
 * - x-api-key: Mobile app API key
 *
 * Body:
 * - identityToken: Apple identity token (JWT) from expo-apple-authentication
 * - fullName?: string
 *
 * Returns:
 * - success: boolean
 * - user: User data (without password)
 * - token: JWT authentication token
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now()
  debugLog('[MOBILE_AUTH] Apple login request started')

  try {
    const apiKey = request.headers.get('x-api-key')
    const authValidation = validateMobileAuth(apiKey, null)
    if (!authValidation.valid) {
      return NextResponse.json(
        { success: false, error: authValidation.error },
        { status: authValidation.status || 500 }
      )
    }

    const body = await request.json().catch(() => ({}))
    const identityToken = String(body?.identityToken || '')
    const fullName = String(body?.fullName || '').trim()

    // IMPORTANT: audience must match the iOS bundle id used in the native app (TestFlight/production).
    // Fallback to the new bundle id to avoid "setup not completed" / token verification issues when env is missing.
    const appleAudience = process.env.APPLE_CLIENT_ID || process.env.APPLE_BUNDLE_ID || 'ae.genosys.app'
    const { claims } = await verifyAppleIdentityToken(identityToken, { audience: appleAudience })

    const email = String(claims.email || '').trim().toLowerCase()
    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Apple sign-in did not provide an email address' },
        { status: 400 }
      )
    }

    // DB lookup with retry for Neon cold starts
    let user: Awaited<ReturnType<typeof findUserByEmail>> = null
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        user = await findUserByEmail(email)
        break
      } catch (dbError) {
        if (attempt === 2) throw dbError
        debugLog('[MOBILE_AUTH] DB cold start, retrying findUserByEmail...')
        await new Promise(r => setTimeout(r, 2000))
      }
    }
    const nowIso = new Date().toISOString()

    if (!user) {
      const nameFromEmail = email.split('@')[0] || 'User'
      const created = await addUser({
        name: fullName || nameFromEmail,
        email,
        password: null,
        phone: null,
        address: null,
        profilePicture: null,
        isAdmin: false,
        canSeePrices: true,
        discountType: null,
        discountPercentage: null,
        birthday: null,
        lastLoginAt: nowIso,
        lastLoginSource: 'mobile_app',
      })
      user = created
      // Update lastActiveAt immediately for online status tracking
      await trackUserActivityNow(created.id)

      // Send admin notification for new user registration via Apple Sign-In
      try {
        await sendAdminNewUserNotification(
          fullName || nameFromEmail,
          email,
          undefined, // phone
          undefined, // address
          'Apple Sign-In (Mobile App)'
        )
        debugLog(`[MOBILE_AUTH] Admin notification sent for new Apple Sign-In user: ${email}`)
      } catch (emailError) {
        // Don't fail the registration if email fails
        errorLog('[MOBILE_AUTH] Failed to send admin notification for new Apple user:', emailError)
      }
    } else {
      // Update last login timestamp, source, and activity
      try {
        await updateUser(user.id, { 
          lastLoginAt: nowIso,
          lastLoginSource: 'mobile_app'
        })
        // Update lastActiveAt immediately for online status tracking
        await trackUserActivityNow(user.id)
      } catch (error) {
        errorLog('[MOBILE_AUTH] Apple login: failed to update lastLoginAt', error)
      }
    }

    const token = generateMobileToken({
      id: user.id,
      email: user.email,
      name: user.name,
      isAdmin: user.isAdmin || false,
      canSeePrices: user.canSeePrices !== false,
    })

    const { password: __, ...userWithoutPassword } = user
    const duration = Date.now() - startTime
    debugLog(`[MOBILE_AUTH] Apple login successful for ${email} in ${duration}ms`)

    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
      token,
      message: 'Login successful',
    })
  } catch (error) {
    const duration = Date.now() - startTime
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    errorLog('[MOBILE_AUTH] Apple login error:', {
      error: errorMessage,
      duration: `${duration}ms`,
      stack: error instanceof Error ? error.stack : undefined,
    })

    // Return specific error for token validation failures (not generic 500)
    if (errorMessage.includes('identityToken') || errorMessage.includes('Apple')) {
      return NextResponse.json({ success: false, error: errorMessage }, { status: 401 })
    }

    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ success: false, error: 'Method not allowed' }, { status: 405 })
}



