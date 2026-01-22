import { NextRequest, NextResponse } from 'next/server'
import { generateAuthenticationOptions } from '@simplewebauthn/server'
import { prisma } from '@/lib/prisma'
import { errorLog, debugLog } from '@/lib/logger'

// WebAuthn configuration
const rpID = process.env.NODE_ENV === 'production' ? 'genosys.ae' : 'localhost'

/**
 * POST /api/auth/passkey/login-options
 * Generates WebAuthn authentication options for logging in with a passkey
 */
export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    debugLog('[PASSKEY] Generating login options for email:', email)

    // Find the user and their passkeys
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      include: {
        passkeys: {
          select: {
            credentialId: true,
            transports: true,
          }
        }
      }
    })

    if (!user) {
      debugLog('[PASSKEY] User not found:', email)
      return NextResponse.json(
        { error: 'No account found with this email' },
        { status: 404 }
      )
    }

    if (user.passkeys.length === 0) {
      debugLog('[PASSKEY] User has no passkeys:', email)
      return NextResponse.json(
        { error: 'No passkeys registered for this account' },
        { status: 404 }
      )
    }

    debugLog('[PASSKEY] Found', user.passkeys.length, 'passkeys for user')

    // Generate authentication options
    const options = await generateAuthenticationOptions({
      rpID,
      userVerification: 'preferred',
      allowCredentials: user.passkeys.map(passkey => ({
        id: passkey.credentialId, // Already base64url encoded string
        transports: passkey.transports 
          ? JSON.parse(passkey.transports) 
          : undefined,
      })),
    })

    debugLog('[PASSKEY] Generated authentication options')

    // Store the challenge and user ID for verification
    const response = NextResponse.json(options)
    
    response.cookies.set('passkey_auth_challenge', options.challenge, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 5 * 60, // 5 minutes
      path: '/',
    })

    // Store user ID to link the authentication to the right user
    response.cookies.set('passkey_auth_user', user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 5 * 60, // 5 minutes
      path: '/',
    })

    return response
  } catch (error) {
    errorLog('[PASSKEY] Error generating login options:', error)
    return NextResponse.json(
      { error: 'Failed to generate login options' },
      { status: 500 }
    )
  }
}
