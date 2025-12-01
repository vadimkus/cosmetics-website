import { OAuth2Client } from 'google-auth-library'
import { errorLog, debugLog } from '@/lib/logger'

/**
 * Google OAuth2 Client Configuration
 * Validates and provides Google OAuth client instance
 */

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
  errorLog('⚠️  WARNING: Google OAuth credentials not configured. Google Sign-In will not work.')
  errorLog('Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in your .env.local file')
}

/**
 * Create and configure Google OAuth2 client
 */
export function getGoogleOAuthClient(): OAuth2Client | null {
  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    return null
  }

  return new OAuth2Client(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    // Redirect URI will be set dynamically based on the request
    undefined
  )
}

/**
 * Generate Google OAuth authorization URL
 */
export function getGoogleAuthUrl(redirectUri: string, state?: string): string | null {
  const client = getGoogleOAuthClient()
  if (!client) {
    return null
  }

  const scopes = [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
  ]

  const authUrlOptions: {
    access_type: string
    scope: string[]
    redirect_uri: string
    prompt: string
    state?: string
  } = {
    access_type: 'offline',
    scope: scopes,
    redirect_uri: redirectUri,
    prompt: 'consent', // Force consent screen to get refresh token
  }
  
  // Only include state if provided (CSRF protection)
  if (state) {
    authUrlOptions.state = state
  }
  
  const authUrl = client.generateAuthUrl(authUrlOptions)

  return authUrl
}

/**
 * Exchange authorization code for tokens
 */
export async function exchangeCodeForTokens(
  code: string,
  redirectUri: string
): Promise<{ accessToken: string; refreshToken?: string; idToken: string } | null> {
  const client = getGoogleOAuthClient()
  if (!client) {
    return null
  }

  try {
    const { tokens } = await client.getToken({
      code,
      redirect_uri: redirectUri,
    })

    if (!tokens.access_token || !tokens.id_token) {
      errorLog('Failed to get tokens from Google')
      return null
    }

    const result: {
      accessToken: string
      idToken: string
      refreshToken?: string
    } = {
      accessToken: tokens.access_token,
      idToken: tokens.id_token!,
    }
    
    // Only include refreshToken if it exists
    if (tokens.refresh_token) {
      result.refreshToken = tokens.refresh_token
    }
    
    return result
  } catch (error) {
    errorLog('Error exchanging code for tokens:', error)
    return null
  }
}

/**
 * Verify Google ID token and get user information
 */
export async function verifyGoogleIdToken(idToken: string): Promise<{
  email: string
  name: string
  picture?: string
  sub: string // Google user ID
} | null> {
  const client = getGoogleOAuthClient()
  if (!client) {
    return null
  }

  try {
    if (!GOOGLE_CLIENT_ID) {
      errorLog('GOOGLE_CLIENT_ID not configured')
      return null
    }
    
    const ticket = await client.verifyIdToken({
      idToken,
      audience: GOOGLE_CLIENT_ID,
    })

    const payload = ticket.getPayload()
    if (!payload) {
      errorLog('Failed to get payload from Google ID token')
      return null
    }

    const email = payload.email
    const name = payload.name
    const picture = payload.picture
    const sub = payload.sub

    if (!email || !name || !sub) {
      errorLog('Missing required fields in Google ID token payload')
      return null
    }

    debugLog('Google ID token verified successfully:', { email, name })

    const result: {
      email: string
      name: string
      sub: string
      picture?: string
    } = {
      email,
      name,
      sub,
    }
    
    // Only include picture if it exists
    if (picture) {
      result.picture = picture
    }
    
    return result
  } catch (error) {
    errorLog('Error verifying Google ID token:', error)
    return null
  }
}

/**
 * Check if Google OAuth is configured
 */
export function isGoogleOAuthConfigured(): boolean {
  return !!(GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET)
}

