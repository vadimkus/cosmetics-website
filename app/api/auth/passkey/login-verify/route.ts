import { NextRequest, NextResponse } from 'next/server'
import { verifyAuthenticationResponse } from '@simplewebauthn/server'
import { prisma } from '@/lib/prisma'
import { createSessionToken } from '@/lib/jwt'
import { errorLog, debugLog } from '@/lib/logger'
import { trackUserActivityNow } from '@/lib/activityTracker'

// WebAuthn configuration
const rpID = process.env.NODE_ENV === 'production' ? 'genosys.ae' : 'localhost'
const origin = process.env.NODE_ENV === 'production' 
  ? 'https://genosys.ae' 
  : 'http://localhost:3000'

/**
 * POST /api/auth/passkey/login-verify
 * Verifies the passkey authentication response and creates a session
 */
export async function POST(request: NextRequest) {
  try {
    // Get the challenge and user ID from cookies
    const challengeCookie = request.cookies.get('passkey_auth_challenge')
    const userIdCookie = request.cookies.get('passkey_auth_user')

    if (!challengeCookie || !userIdCookie) {
      return NextResponse.json(
        { error: 'Authentication session expired. Please try again.' },
        { status: 400 }
      )
    }

    const expectedChallenge = challengeCookie.value
    const userId = userIdCookie.value
    const body = await request.json()

    debugLog('[PASSKEY] Verifying authentication for user ID:', userId)

    // Find the passkey by credential ID
    const credentialIdBase64 = body.id
    const passkey = await prisma.passkey.findUnique({
      where: { credentialId: credentialIdBase64 },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            isAdmin: true,
            canSeePrices: true,
            profilePicture: true,
          }
        }
      }
    })

    if (!passkey) {
      debugLog('[PASSKEY] Passkey not found for credential ID:', credentialIdBase64.substring(0, 20) + '...')
      return NextResponse.json(
        { error: 'Passkey not found' },
        { status: 404 }
      )
    }

    // Verify the passkey belongs to the expected user
    if (passkey.userId !== userId) {
      errorLog('[PASSKEY] Passkey user mismatch - possible attack')
      return NextResponse.json(
        { error: 'Authentication failed' },
        { status: 401 }
      )
    }

    // Verify the authentication response
    let verification
    try {
      // Convert base64url encoded public key to Uint8Array
      const publicKeyBuffer = Buffer.from(passkey.publicKey, 'base64url')
      const publicKeyArray = new Uint8Array(publicKeyBuffer.buffer, publicKeyBuffer.byteOffset, publicKeyBuffer.length)
      
      verification = await verifyAuthenticationResponse({
        response: body,
        expectedChallenge,
        expectedOrigin: origin,
        expectedRPID: rpID,
        credential: {
          id: passkey.credentialId, // Base64url encoded string
          publicKey: publicKeyArray,
          counter: Number(passkey.counter),
        },
      })
    } catch (verifyError) {
      errorLog('[PASSKEY] Authentication verification error:', verifyError)
      return NextResponse.json(
        { error: 'Passkey verification failed' },
        { status: 400 }
      )
    }

    if (!verification.verified) {
      return NextResponse.json(
        { error: 'Passkey verification failed' },
        { status: 401 }
      )
    }

    debugLog('[PASSKEY] Authentication verified successfully')

    // Update the passkey counter (prevents replay attacks)
    await prisma.passkey.update({
      where: { id: passkey.id },
      data: {
        counter: BigInt(verification.authenticationInfo.newCounter),
        lastUsedAt: new Date(),
      }
    })

    // Detect login source from User-Agent
    const userAgent = request.headers.get('user-agent') || ''
    const isMobileDevice = /mobile|android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase())
    const loginSource = isMobileDevice ? 'mobile_web' : 'desktop_web'

    // Update user's last login timestamp, source, and activity
    await prisma.user.update({
      where: { id: passkey.user.id },
      data: { 
        lastLoginAt: new Date(),
        lastLoginSource: loginSource
      }
    })
    // Update lastActiveAt immediately for online status tracking
    await trackUserActivityNow(passkey.user.id)

    // Create session token (same as regular login)
    const sessionToken = createSessionToken({
      id: passkey.user.id,
      email: passkey.user.email,
      name: passkey.user.name,
      isAdmin: passkey.user.isAdmin,
      canSeePrices: passkey.user.canSeePrices,
      profilePicture: passkey.user.profilePicture,
    })

    // Return user data and set session cookie
    const { ...userWithoutPassword } = passkey.user
    
    const response = NextResponse.json({
      user: userWithoutPassword,
      message: 'Login successful'
    })
    
    // Set session cookie (same as regular login)
    response.cookies.set('genosys_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/',
    })

    // Clear the authentication cookies
    response.cookies.delete('passkey_auth_challenge')
    response.cookies.delete('passkey_auth_user')

    debugLog('[PASSKEY] Login successful for user:', passkey.user.email)

    return response
  } catch (error) {
    errorLog('[PASSKEY] Error verifying authentication:', error)
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    )
  }
}
