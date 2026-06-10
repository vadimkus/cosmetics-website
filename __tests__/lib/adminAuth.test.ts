/**
 * Regression tests for the admin auth bypass fix (SEC-1).
 *
 * Previously, verifyAdminAuth fell back to trusting an unsigned
 * `x-admin-email` header (or `admin-email` cookie) when no signed
 * session cookie was present — allowing full admin access with a
 * spoofable header. These tests assert that the only accepted
 * credential is a valid HMAC-signed `admin-session` cookie.
 */

jest.mock('next/server', () => ({
  NextRequest: jest.fn(),
  NextResponse: {
    json: (body: unknown, init?: { status?: number }) => ({ body, status: init?.status ?? 200 }),
  },
}))

jest.mock('@/lib/envValidation', () => ({
  ADMIN_SESSION_SECRET: 'test-admin-session-secret-with-enough-length',
  JWT_SECRET: 'test-jwt-secret-with-enough-length-0123456789',
}))

jest.mock('@/lib/logger', () => ({
  errorLog: jest.fn(),
  debugLog: jest.fn(),
  warnLog: jest.fn(),
}))

const mockFindUserByEmail = jest.fn()
jest.mock('@/lib/userStorageDb', () => ({
  findUserByEmail: (...args: unknown[]) => mockFindUserByEmail(...args),
}))

import type { NextRequest } from 'next/server'
import {
  generateAdminSessionToken,
  verifyAdminSessionToken,
  verifyAdminAuth,
} from '@/lib/adminAuth'

const ADMIN_EMAIL = 'admin@example.com'

const adminUser = {
  id: 'user_admin_1',
  email: ADMIN_EMAIL,
  name: 'Admin User',
  isAdmin: true,
}

/**
 * Build a minimal request double exposing only the surface
 * verifyAdminAuth reads: headers.get() and cookies.get().
 */
function makeRequest(options: {
  headers?: Record<string, string>
  cookies?: Record<string, string>
} = {}): NextRequest {
  const headerMap = new Map(
    Object.entries(options.headers ?? {}).map(([k, v]) => [k.toLowerCase(), v])
  )
  const cookieMap = new Map(Object.entries(options.cookies ?? {}))

  return {
    headers: {
      get: (name: string) => headerMap.get(name.toLowerCase()) ?? null,
    },
    cookies: {
      get: (name: string) => {
        const value = cookieMap.get(name)
        return value === undefined ? undefined : { name, value }
      },
    },
  } as unknown as NextRequest
}

beforeEach(() => {
  mockFindUserByEmail.mockReset()
  mockFindUserByEmail.mockImplementation(async (email: string) =>
    email === ADMIN_EMAIL ? adminUser : null
  )
})

describe('verifyAdminAuth — legacy bypass removed (SEC-1 regression)', () => {
  it('rejects a request whose only credential is the x-admin-email header', async () => {
    const request = makeRequest({ headers: { 'x-admin-email': ADMIN_EMAIL } })

    const result = await verifyAdminAuth(request)

    expect(result.user).toBeNull()
    expect(result.error).toBeTruthy()
    // The legacy path looked the user up by the header value — it must not anymore
    expect(mockFindUserByEmail).not.toHaveBeenCalled()
  })

  it('rejects a request whose only credential is the admin-email cookie', async () => {
    const request = makeRequest({ cookies: { 'admin-email': ADMIN_EMAIL } })

    const result = await verifyAdminAuth(request)

    expect(result.user).toBeNull()
    expect(result.error).toBeTruthy()
    expect(mockFindUserByEmail).not.toHaveBeenCalled()
  })

  it('rejects a request with no credentials at all', async () => {
    const result = await verifyAdminAuth(makeRequest())

    expect(result.user).toBeNull()
    expect(result.error).toBeTruthy()
  })

  it('accepts a valid signed admin-session cookie', async () => {
    const token = generateAdminSessionToken(ADMIN_EMAIL)
    const request = makeRequest({ cookies: { 'admin-session': token } })

    const result = await verifyAdminAuth(request)

    expect(result.error).toBeNull()
    expect(result.user).toEqual({
      id: adminUser.id,
      email: adminUser.email,
      name: adminUser.name,
      isAdmin: true,
    })
  })

  it('rejects a tampered admin-session cookie', async () => {
    const token = generateAdminSessionToken(ADMIN_EMAIL)
    const [payload] = token.split('.')
    const tampered = `${payload}.AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA`
    const request = makeRequest({ cookies: { 'admin-session': tampered } })

    const result = await verifyAdminAuth(request)

    expect(result.user).toBeNull()
    expect(result.error).toBeTruthy()
  })

  it('rejects an unsigned forged cookie payload', async () => {
    // A forged payload without a valid HMAC must never authenticate
    const forged = Buffer.from(
      JSON.stringify({ email: ADMIN_EMAIL, iat: 0, exp: Math.floor(Date.now() / 1000) + 3600 })
    ).toString('base64url')
    const request = makeRequest({ cookies: { 'admin-session': `${forged}.invalid` } })

    const result = await verifyAdminAuth(request)

    expect(result.user).toBeNull()
  })

  it('rejects a valid token for a user who is no longer an admin', async () => {
    mockFindUserByEmail.mockResolvedValue({ ...adminUser, isAdmin: false })
    const token = generateAdminSessionToken(ADMIN_EMAIL)
    const request = makeRequest({ cookies: { 'admin-session': token } })

    const result = await verifyAdminAuth(request)

    expect(result.user).toBeNull()
    expect(result.error).toBeTruthy()
  })

  it('rejects an expired admin-session token', async () => {
    const token = generateAdminSessionToken(ADMIN_EMAIL, -60) // expired 60s ago
    const request = makeRequest({ cookies: { 'admin-session': token } })

    const result = await verifyAdminAuth(request)

    expect(result.user).toBeNull()
  })

  it('header is ignored even when combined with an invalid cookie', async () => {
    const request = makeRequest({
      headers: { 'x-admin-email': ADMIN_EMAIL },
      cookies: { 'admin-session': 'not-a-valid-token' },
    })

    const result = await verifyAdminAuth(request)

    expect(result.user).toBeNull()
  })
})

describe('verifyAdminSessionToken', () => {
  it('round-trips a generated token', () => {
    const token = generateAdminSessionToken(ADMIN_EMAIL)
    const payload = verifyAdminSessionToken(token)

    expect(payload?.email).toBe(ADMIN_EMAIL)
    expect(payload?.exp).toBeGreaterThan(Math.floor(Date.now() / 1000))
  })

  it('returns null for malformed tokens', () => {
    expect(verifyAdminSessionToken('')).toBeNull()
    expect(verifyAdminSessionToken('a')).toBeNull()
    expect(verifyAdminSessionToken('a.b.c')).toBeNull()
    expect(verifyAdminSessionToken('{"email":"admin@example.com"}')).toBeNull()
  })
})
