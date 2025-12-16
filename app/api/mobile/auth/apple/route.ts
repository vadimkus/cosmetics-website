import { NextRequest, NextResponse } from 'next/server'
import { validateMobileAuth } from '@/lib/jwt'
import { debugLog, errorLog } from '@/lib/logger'
import { findUserByEmail, addUser, updateUser } from '@/lib/userStorageDb'
import { generateMobileToken } from '@/lib/jwt'
import { verifyAppleIdentityToken } from '@/lib/appleIdentityToken'

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

    const appleAudience = process.env.APPLE_CLIENT_ID || process.env.APPLE_BUNDLE_ID || 'com.genosys.mobile'
    const { claims } = await verifyAppleIdentityToken(identityToken, { audience: appleAudience })

    const email = String(claims.email || '').trim().toLowerCase()
    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Apple sign-in did not provide an email address' },
        { status: 400 }
      )
    }

    let user = await findUserByEmail(email)
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
      })
      user = created
    } else {
      // Update last login timestamp
      try {
        await updateUser(user.id, { lastLoginAt: nowIso })
      } catch (e) {
        errorLog('[MOBILE_AUTH] Apple login: failed to update lastLoginAt', e)
      }
    }

    const token = generateMobileToken({
      id: user.id,
      email: user.email,
      name: user.name,
      isAdmin: user.isAdmin || false,
      canSeePrices: user.canSeePrices !== false,
    })

    const { password: __, ...userWithoutPassword } = user as any
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
    errorLog('[MOBILE_AUTH] Apple login error:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      duration: `${duration}ms`,
      stack: error instanceof Error ? error.stack : undefined,
    })
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ success: false, error: 'Method not allowed' }, { status: 405 })
}



