import crypto from 'crypto'

type AppleJwk = {
  kty: string
  kid: string
  use: string
  alg: string
  n?: string
  e?: string
  x5c?: string[]
}

type AppleJwks = { keys: AppleJwk[] }

export type AppleIdentityClaims = {
  iss: string
  aud: string | string[]
  exp: number
  iat?: number
  sub: string
  email?: string
  email_verified?: string | boolean
  is_private_email?: string | boolean
}

let jwksCache: AppleJwks | null = null
let jwksCacheAt = 0

function base64UrlToBuffer(input: string): Buffer {
  const pad = input.length % 4 === 0 ? '' : '='.repeat(4 - (input.length % 4))
  const b64 = input.replace(/-/g, '+').replace(/_/g, '/') + pad
  return Buffer.from(b64, 'base64')
}

function decodeJsonPart(part: string): any {
  return JSON.parse(base64UrlToBuffer(part).toString('utf8'))
}

async function fetchAppleJwks(): Promise<AppleJwks> {
  const now = Date.now()
  // Cache for 6 hours
  if (jwksCache && now - jwksCacheAt < 6 * 60 * 60 * 1000) return jwksCache

  const res = await fetch('https://appleid.apple.com/auth/keys', { method: 'GET' })
  if (!res.ok) {
    const txt = await res.text().catch(() => '')
    throw new Error(`Failed to fetch Apple JWKS (${res.status}): ${String(txt).slice(0, 120)}`)
  }
  const json = (await res.json()) as AppleJwks
  jwksCache = json
  jwksCacheAt = now
  return json
}

function publicKeyFromJwk(jwk: AppleJwk): crypto.KeyObject {
  // Apple provides x5c; easiest is to convert cert to PEM and extract public key.
  const cert = jwk?.x5c?.[0]
  if (!cert) {
    throw new Error('Apple JWKS key missing x5c certificate')
  }
  const pem = `-----BEGIN CERTIFICATE-----\n${cert}\n-----END CERTIFICATE-----`
  return crypto.createPublicKey(pem)
}

export async function verifyAppleIdentityToken(identityToken: string, options: { audience: string }) {
  if (!identityToken || typeof identityToken !== 'string') {
    throw new Error('Missing identityToken')
  }

  const parts = identityToken.split('.')
  if (parts.length !== 3 || !parts[0] || !parts[1] || !parts[2]) {
    throw new Error('Invalid identityToken format')
  }

  const header = decodeJsonPart(parts[0])
  const claims = decodeJsonPart(parts[1]) as AppleIdentityClaims
  const signature = base64UrlToBuffer(parts[2])
  const data = Buffer.from(`${parts[0]}.${parts[1]}`)

  const kid = String(header?.kid || '')
  if (!kid) throw new Error('Apple identityToken missing kid header')

  const jwks = await fetchAppleJwks()
  const jwk = jwks.keys.find((k) => k.kid === kid)
  if (!jwk) throw new Error(`Apple JWKS key not found for kid=${kid}`)

  const key = publicKeyFromJwk(jwk)
  const ok = crypto.verify('RSA-SHA256', data, key, signature)
  if (!ok) throw new Error('Invalid Apple identityToken signature')

  // Claim checks
  if (claims.iss !== 'https://appleid.apple.com') {
    throw new Error('Invalid Apple identityToken issuer')
  }
  const aud = Array.isArray(claims.aud) ? claims.aud : [claims.aud]
  if (!aud.includes(options.audience)) {
    throw new Error('Invalid Apple identityToken audience')
  }
  const nowSec = Math.floor(Date.now() / 1000)
  if (!claims.exp || claims.exp < nowSec) {
    throw new Error('Apple identityToken expired')
  }

  return { header, claims }
}


