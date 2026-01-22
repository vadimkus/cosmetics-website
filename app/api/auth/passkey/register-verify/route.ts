import { NextRequest, NextResponse } from 'next/server'
import { verifyRegistrationResponse, VerifiedRegistrationResponse } from '@simplewebauthn/server'
import { verifySessionToken } from '@/lib/jwt'
import { prisma } from '@/lib/prisma'
import { errorLog, debugLog } from '@/lib/logger'

// WebAuthn configuration
const rpID = process.env.NODE_ENV === 'production' ? 'genosys.ae' : 'localhost'
const origin = process.env.NODE_ENV === 'production' 
  ? 'https://genosys.ae' 
  : 'http://localhost:3000'

/**
 * Derive device name from user agent
 */
function getDeviceName(userAgent: string | null): string {
  if (!userAgent) return 'Unknown Device'
  
  // Check for specific devices
  if (userAgent.includes('iPhone')) return 'iPhone'
  if (userAgent.includes('iPad')) return 'iPad'
  if (userAgent.includes('Mac OS')) {
    if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) return 'Mac (Safari)'
    if (userAgent.includes('Chrome')) return 'Mac (Chrome)'
    return 'Mac'
  }
  if (userAgent.includes('Windows')) {
    if (userAgent.includes('Edge')) return 'Windows (Edge)'
    if (userAgent.includes('Chrome')) return 'Windows (Chrome)'
    return 'Windows'
  }
  if (userAgent.includes('Android')) return 'Android'
  if (userAgent.includes('Linux')) return 'Linux'
  
  return 'Unknown Device'
}

/**
 * POST /api/auth/passkey/register-verify
 * Verifies the passkey registration response and stores the credential
 */
export async function POST(request: NextRequest) {
  try {
    // Check if user is logged in
    const sessionCookie = request.cookies.get('genosys_session')
    if (!sessionCookie) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const session = verifySessionToken(sessionCookie.value)
    if (!session || !session.id) {
      return NextResponse.json(
        { error: 'Invalid session' },
        { status: 401 }
      )
    }

    // Get the challenge from the cookie
    const challengeCookie = request.cookies.get('passkey_challenge')
    if (!challengeCookie) {
      return NextResponse.json(
        { error: 'Registration session expired. Please try again.' },
        { status: 400 }
      )
    }

    const expectedChallenge = challengeCookie.value
    const body = await request.json()

    debugLog('[PASSKEY] Verifying registration for user:', session.email)

    // Verify the registration response
    let verification: VerifiedRegistrationResponse
    try {
      verification = await verifyRegistrationResponse({
        response: body,
        expectedChallenge,
        expectedOrigin: origin,
        expectedRPID: rpID,
      })
    } catch (verifyError) {
      errorLog('[PASSKEY] Verification error:', verifyError)
      return NextResponse.json(
        { error: 'Passkey verification failed. Please try again.' },
        { status: 400 }
      )
    }

    if (!verification.verified || !verification.registrationInfo) {
      return NextResponse.json(
        { error: 'Passkey verification failed' },
        { status: 400 }
      )
    }

    const { credential, credentialDeviceType, credentialBackedUp } = verification.registrationInfo

    debugLog('[PASSKEY] Registration verified successfully')
    debugLog('[PASSKEY] Device type:', credentialDeviceType)
    debugLog('[PASSKEY] Backed up:', credentialBackedUp)

    // Store the passkey in the database
    const userAgent = request.headers.get('user-agent')
    
    try {
      await prisma.passkey.create({
        data: {
          userId: session.id,
          credentialId: Buffer.from(credential.id).toString('base64url'),
          publicKey: Buffer.from(credential.publicKey).toString('base64url'),
          counter: BigInt(credential.counter),
          transports: body.response?.transports 
            ? JSON.stringify(body.response.transports) 
            : null,
          deviceType: credentialDeviceType || 'platform',
          deviceName: getDeviceName(userAgent),
          backedUp: credentialBackedUp || false,
        }
      })
    } catch (dbError) {
      // Check if it's a duplicate credential error
      if ((dbError as { code?: string }).code === 'P2002') {
        return NextResponse.json(
          { error: 'This passkey is already registered' },
          { status: 409 }
        )
      }
      throw dbError
    }

    debugLog('[PASSKEY] Passkey stored successfully for user:', session.email)

    // Clear the challenge cookie
    const response = NextResponse.json({
      success: true,
      message: 'Passkey registered successfully'
    })
    
    response.cookies.delete('passkey_challenge')
    
    return response
  } catch (error) {
    errorLog('[PASSKEY] Error verifying registration:', error)
    return NextResponse.json(
      { error: 'Failed to register passkey' },
      { status: 500 }
    )
  }
}
