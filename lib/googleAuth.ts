import { OAuth2Client } from 'google-auth-library'
import { errorLog, debugLog } from '@/lib/logger'

/**
 * Google OAuth2 Client Configuration
 * Validates and provides Google OAuth client instance
 */

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET
// Allow multiple audiences for ID token verification (e.g., web + iOS + Android client IDs).
// Comma-separated list is supported.
const GOOGLE_ALLOWED_AUDIENCES_RAW =
  process.env.GOOGLE_ALLOWED_AUDIENCES ||
  [
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_WEB_CLIENT_ID,
    process.env.GOOGLE_IOS_CLIENT_ID,
    process.env.GOOGLE_ANDROID_CLIENT_ID,
  ]
    .filter(Boolean)
    .join(',')

const GOOGLE_ALLOWED_AUDIENCES = Array.from(
  new Set(
    String(GOOGLE_ALLOWED_AUDIENCES_RAW || '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
  )
)

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
  errorLog('⚠️  WARNING: Google OAuth credentials not configured. Google Sign-In will not work.')
  errorLog('Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in your .env.local file')
}

/**
 * Create and configure Google OAuth2 client
 */
export function getGoogleOAuthClient(): OAuth2Client | null {
  // NOTE: For ID token verification we do NOT need a client secret.
  // Keep the warning for misconfigured OAuth flows, but allow token verification to work.
  if (!GOOGLE_CLIENT_ID) {
    return null
  }

  return new OAuth2Client(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET || undefined, undefined)
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
  } catch {
    errorLog('Error exchanging code for tokens:', error)
    return null
  }
}

/**
 * Fetch user info from Google using access token
 * This is more reliable than ID token for getting profile picture
 */
export async function fetchGoogleUserInfo(accessToken: string): Promise<{
  email: string
  name: string
  picture?: string
  sub: string
} | null> {
  try {
    const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      errorLog('Failed to fetch user info from Google:', response.status, response.statusText)
      return null
    }

    const userInfo = await response.json()
    
    debugLog('Google userinfo API response:', {
      email: userInfo.email,
      name: userInfo.name,
      picture: userInfo.picture,
      hasPicture: !!userInfo.picture,
      pictureLength: userInfo.picture?.length || 0
    })

    if (!userInfo.email || !userInfo.name || !userInfo.id) {
      errorLog('Missing required fields in Google userinfo response')
      return null
    }

    const result: {
      email: string
      name: string
      sub: string
      picture?: string
    } = {
      email: userInfo.email,
      name: userInfo.name,
      sub: userInfo.id,
    }
    
    if (userInfo.picture) {
      result.picture = userInfo.picture
      debugLog('Google picture URL from userinfo API:', userInfo.picture.substring(0, 50) + '...')
    } else {
      debugLog('⚠️ No picture in Google userinfo API response')
    }
    
    return result
  } catch {
    errorLog('Error fetching user info from Google:', error)
    return null
  }
}

/**
 * Verify Google ID token and get user information
 * Falls back to userinfo API if picture is missing from ID token
 */
export async function verifyGoogleIdToken(idToken: string, accessToken?: string): Promise<{
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
    if (!GOOGLE_ALLOWED_AUDIENCES.length) {
      errorLog('Google OAuth audiences not configured (set GOOGLE_CLIENT_ID or GOOGLE_ALLOWED_AUDIENCES)')
      return null
    }

    // Verify signature/exp using Google's certs, then validate audience ourselves.
    // This avoids brittle audience handling differences across library versions.
    const ticket = await client.verifyIdToken({ idToken })

    const payload = ticket.getPayload()
    if (!payload) {
      errorLog('Failed to get payload from Google ID token')
      return null
    }

    // Audience check
    const aud = String((payload as any)?.aud || '')
    if (!aud || !GOOGLE_ALLOWED_AUDIENCES.includes(aud)) {
      errorLog('Google ID token audience mismatch', {
        aud,
        allowed: GOOGLE_ALLOWED_AUDIENCES,
      })
      return null
    }

    const email = payload.email
    const name =
      payload.name ||
      [payload.given_name, payload.family_name].filter(Boolean).join(' ').trim() ||
      (email ? String(email).split('@')[0] : '') ||
      'User'
    let picture = payload.picture
    const sub = payload.sub

    if (!email || !sub) {
      errorLog('Missing required fields in Google ID token payload')
      return null
    }

    debugLog('Google ID token verified successfully:', { 
      email, 
      name, 
      picture,
      hasPicture: !!picture,
      pictureLength: picture?.length || 0,
      // Helpful when diagnosing mismatched client IDs in production.
      aud,
    })

    // If no picture in ID token, try fetching from userinfo API
    if (!picture && accessToken) {
      debugLog('No picture in ID token, fetching from userinfo API...')
      const userInfo = await fetchGoogleUserInfo(accessToken)
      if (userInfo?.picture) {
        picture = userInfo.picture
        debugLog('Got picture from userinfo API:', picture.substring(0, 50) + '...')
      }
    }

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
      debugLog('Google picture URL included:', picture.substring(0, 50) + '...')
    } else {
      debugLog('⚠️ No picture available from Google (neither ID token nor userinfo API)')
    }
    
    return result
  } catch {
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

