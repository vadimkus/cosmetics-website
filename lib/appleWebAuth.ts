import crypto from 'crypto'
import { errorLog } from '@/lib/logger'

type AppleTokenResponse = {
  access_token?: string
  expires_in?: number
  id_token?: string
  refresh_token?: string
  token_type?: string
  error?: string
  error_description?: string
}

function base64UrlEncode(buf: Buffer) {
  return buf
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '')
}

function jsonBase64Url(obj: Record<string, unknown>) {
  return base64UrlEncode(Buffer.from(JSON.stringify(obj)))
}

function normalizeApplePrivateKey(raw: string) {
  // Vercel envs often store newlines as \n
  const key = String(raw || '').trim().replace(/\\n/g, '\n')
  if (!key.includes('BEGIN PRIVATE KEY') && !key.includes('BEGIN EC PRIVATE KEY')) {
    // Apple p8 is PKCS8 and usually already includes headers when pasted;
    // if not, assume it's a raw key and wrap (best effort).
    return `-----BEGIN PRIVATE KEY-----\n${key}\n-----END PRIVATE KEY-----`
  }
  return key
}

export function getAppleWebClientId() {
  return (
    process.env.APPLE_WEB_SERVICE_ID ||
    process.env.APPLE_SERVICE_ID ||
    ''
  )
}

export function getAppleWebRedirectUri(origin: string) {
  // Allow override for exact match in Apple console.
  return process.env.APPLE_WEB_REDIRECT_URI || `${origin}/api/auth/apple/callback`
}

export function createAppleClientSecret(params: { clientId: string }) {
  const teamId = process.env.APPLE_TEAM_ID
  const keyId = process.env.APPLE_KEY_ID
  const privateKeyRaw = process.env.APPLE_PRIVATE_KEY

  if (!teamId || !keyId || !privateKeyRaw) {
    throw new Error('Apple web auth is not configured (missing APPLE_TEAM_ID / APPLE_KEY_ID / APPLE_PRIVATE_KEY)')
  }
  if (!params.clientId) {
    throw new Error('Apple web auth is not configured (missing APPLE_WEB_SERVICE_ID)')
  }

  const now = Math.floor(Date.now() / 1000)
  const header = { alg: 'ES256', kid: keyId, typ: 'JWT' }
  const payload = {
    iss: teamId,
    iat: now,
    exp: now + 5 * 60, // 5 minutes
    aud: 'https://appleid.apple.com',
    sub: params.clientId,
  }

  const input = `${jsonBase64Url(header)}.${jsonBase64Url(payload)}`
  const privateKey = normalizeApplePrivateKey(privateKeyRaw)

  const signature = crypto.sign('sha256', Buffer.from(input), {
    key: privateKey,
    dsaEncoding: 'ieee-p1363',
  })
  return `${input}.${base64UrlEncode(signature)}`
}

export async function exchangeAppleCodeForTokens(params: {
  code: string
  origin: string
  redirectUri: string
  clientId: string
}) {
  try {
    const clientSecret = createAppleClientSecret({ clientId: params.clientId })
    const body = new URLSearchParams({
      grant_type: 'authorization_code',
      code: params.code,
      redirect_uri: params.redirectUri,
      client_id: params.clientId,
      client_secret: clientSecret,
    })

    const res = await fetch('https://appleid.apple.com/auth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    })

    const json = (await res.json().catch(() => null)) as AppleTokenResponse | null
    if (!res.ok || !json) {
      const msg = json?.error_description || json?.error || `Token exchange failed (${res.status})`
      throw new Error(msg)
    }
    return json
  } catch (e) {
    errorLog('[APPLE_WEB_AUTH] Token exchange error:', e)
    throw e
  }
}


