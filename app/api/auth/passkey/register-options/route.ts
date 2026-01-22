import { NextRequest, NextResponse } from 'next/server'
import { generateRegistrationOptions } from '@simplewebauthn/server'
import { verifySessionToken } from '@/lib/jwt'
import { prisma } from '@/lib/prisma'
import { errorLog, debugLog } from '@/lib/logger'

// WebAuthn configuration
const rpName = 'GENOSYS Middle East'
const rpID = process.env.NODE_ENV === 'production' ? 'genosys.ae' : 'localhost'

/**
 * POST /api/auth/passkey/register-options
 * Generates WebAuthn registration options for creating a new passkey
 * User must be logged in to add a passkey to their account
 */
export async function POST(request: NextRequest) {
  try {
    // Check if user is logged in via session cookie
    const sessionCookie = request.cookies.get('genosys_session')
    if (!sessionCookie) {
      return NextResponse.json(
        { error: 'Authentication required. Please log in first.' },
        { status: 401 }
      )
    }

    const session = verifySessionToken(sessionCookie.value)
    if (!session || !session.id) {
      return NextResponse.json(
        { error: 'Invalid session. Please log in again.' },
        { status: 401 }
      )
    }

    debugLog('[PASSKEY] Generating registration options for user:', session.email)

    // Get user's existing passkeys to exclude them
    const existingPasskeys = await prisma.passkey.findMany({
      where: { userId: session.id },
      select: { credentialId: true }
    })

    debugLog('[PASSKEY] User has', existingPasskeys.length, 'existing passkeys')

    // Generate registration options
    const options = await generateRegistrationOptions({
      rpName,
      rpID,
      userID: new TextEncoder().encode(session.id),
      userName: session.email,
      userDisplayName: session.name || session.email,
      // Don't require attestation for better device compatibility
      attestationType: 'none',
      // Exclude credentials the user already has
      excludeCredentials: existingPasskeys.map(passkey => ({
        id: passkey.credentialId, // Already base64url encoded string
      })),
      authenticatorSelection: {
        // Prefer platform authenticators (Face ID, Touch ID, Windows Hello)
        authenticatorAttachment: 'platform',
        // Require user verification (biometric)
        userVerification: 'preferred',
        // Create a resident key (discoverable credential)
        residentKey: 'preferred',
      },
      // Support common algorithms
      supportedAlgorithmIDs: [-7, -257], // ES256, RS256
    })

    debugLog('[PASSKEY] Generated registration options, challenge:', options.challenge.substring(0, 20) + '...')

    // Store the challenge in a short-lived cookie for verification
    // The challenge is tied to this specific registration attempt
    const response = NextResponse.json(options)
    
    response.cookies.set('passkey_challenge', options.challenge, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 5 * 60, // 5 minutes
      path: '/',
    })

    return response
  } catch (error) {
    errorLog('[PASSKEY] Error generating registration options:', error)
    return NextResponse.json(
      { error: 'Failed to generate passkey registration options' },
      { status: 500 }
    )
  }
}
