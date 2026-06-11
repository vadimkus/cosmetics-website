/**
 * Regression tests for previously unguarded routes (audit Tasks 1.2/1.4):
 *
 * - POST /api/admin/create-payment-blog  — wrote a blog post with NO auth
 * - GET/POST /api/init-db                — leaked user/order/product counts with NO auth
 * - POST /api/admin/ping-search-engines  — accepted ANY "Bearer x" token
 * - POST /api/auth/register              — had no rate limiting (bulk signup spam)
 *
 * These tests assert that unauthenticated requests are rejected with 401
 * before touching the database, that a valid signed admin session is still
 * accepted (admins are not locked out), and that registration is
 * rate-limited after repeated attempts.
 */

jest.mock('next/server', () => ({
  NextRequest: jest.fn(),
  NextResponse: {
    json: jest.fn((body: unknown, init?: { status?: number }) => ({
      status: init?.status ?? 200,
      json: async () => body,
    })),
  },
  after: jest.fn(),
}))

jest.mock('@/lib/envValidation', () => ({
  ADMIN_SESSION_SECRET: 'test-admin-session-secret-with-enough-length',
  JWT_SECRET: 'test-jwt-secret-with-enough-length-0123456789',
}))

jest.mock('@/lib/logger', () => ({
  debugLog: jest.fn(),
  errorLog: jest.fn(),
  warnLog: jest.fn(),
}))

const mockFindUserByEmail = jest.fn()
jest.mock('@/lib/userStorageDb', () => ({
  findUserByEmail: (...args: unknown[]) => mockFindUserByEmail(...args),
}))

// prisma used by init-db (lib/database) and create-payment-blog (lib/prisma)
const mockCounts = {
  productCount: jest.fn(async () => 42),
  userCount: jest.fn(async () => 7),
  orderCount: jest.fn(async () => 3),
}
jest.mock('@/lib/database', () => ({
  prisma: {
    product: { count: () => mockCounts.productCount() },
    user: { count: () => mockCounts.userCount() },
    order: { count: () => mockCounts.orderCount() },
  },
}))

const mockBlogFindUnique = jest.fn()
const mockBlogCreate = jest.fn()
jest.mock('@/lib/prisma', () => ({
  prisma: {
    blogPost: {
      findUnique: (...a: unknown[]) => mockBlogFindUnique(...a),
      create: (...a: unknown[]) => mockBlogCreate(...a),
    },
  },
}))

// register route dependencies — only what runs before/after the rate limiter
jest.mock('@/lib/csrf', () => ({
  requireCsrfToken: jest.fn(async () => ({ valid: true })),
}))
jest.mock('@/lib/requestSizeLimit', () => ({
  requireBodySizeLimit: jest.fn(() => ({ valid: true })),
  getSizeLimitForContentType: jest.fn(() => 1024),
}))
jest.mock('@/lib/analyticsServer', () => ({ trackUserAction: jest.fn() }))
jest.mock('@/lib/email', () => ({
  sendWelcomeEmail: jest.fn(),
  sendAdminNewUserNotification: jest.fn(),
}))
jest.mock('@/lib/emailHelpers', () => ({
  isApplePrivateRelayEmail: jest.fn(() => false),
}))
jest.mock('@/lib/deviceDetection', () => ({ parseUserAgent: jest.fn(() => ({})) }))
jest.mock('@/lib/geolocation', () => ({ getGeolocationData: jest.fn(async () => ({})) }))
jest.mock('@/lib/activityTracker', () => ({ trackUserActivityNow: jest.fn() }))

import type { NextRequest } from 'next/server'
import { generateAdminSessionToken } from '@/lib/adminAuth'
import { POST as createPaymentBlogPOST } from '@/app/api/admin/create-payment-blog/route'
import { GET as initDbGET, POST as initDbPOST } from '@/app/api/init-db/route'
import { POST as pingSearchEnginesPOST } from '@/app/api/admin/ping-search-engines/route'
import { POST as registerPOST } from '@/app/api/auth/register/route'
import { POST as adminVerifyPOST } from '@/app/api/auth/admin-verify/route'

const ADMIN_EMAIL = 'admin@example.com'
const adminUser = {
  id: 'user_admin_1',
  email: ADMIN_EMAIL,
  name: 'Admin User',
  isAdmin: true,
}

interface MockRequestOptions {
  headers?: Record<string, string>
  cookies?: Record<string, string>
  body?: unknown
  ip?: string
}

function createMockRequest(options: MockRequestOptions = {}): NextRequest {
  const headers = new Map<string, string>(
    Object.entries(options.headers ?? {}).map(([k, v]) => [k.toLowerCase(), v])
  )
  const cookies = new Map<string, { value: string }>(
    Object.entries(options.cookies ?? {}).map(([k, v]) => [k, { value: v }])
  )
  return {
    headers: {
      get: (name: string) => headers.get(name.toLowerCase()) ?? null,
    },
    cookies: {
      get: (name: string) => cookies.get(name),
    },
    json: async () => options.body ?? {},
    nextUrl: { pathname: '/api/test' },
  } as unknown as NextRequest
}

async function validAdminCookie(): Promise<Record<string, string>> {
  const token = await generateAdminSessionToken(ADMIN_EMAIL)
  return { 'admin-session': token }
}

beforeEach(() => {
  jest.clearAllMocks()
  mockFindUserByEmail.mockResolvedValue(adminUser)
})

describe('POST /api/admin/create-payment-blog', () => {
  it('rejects unauthenticated requests with 401 and never touches the DB', async () => {
    const res = await createPaymentBlogPOST(createMockRequest())
    expect(res.status).toBe(401)
    expect(mockBlogFindUnique).not.toHaveBeenCalled()
    expect(mockBlogCreate).not.toHaveBeenCalled()
  })

  it('rejects a forged x-admin-email header', async () => {
    const res = await createPaymentBlogPOST(
      createMockRequest({ headers: { 'x-admin-email': ADMIN_EMAIL } })
    )
    expect(res.status).toBe(401)
    expect(mockBlogCreate).not.toHaveBeenCalled()
  })

  it('accepts a valid signed admin session', async () => {
    mockBlogFindUnique.mockResolvedValue({ id: 'existing' })
    const res = await createPaymentBlogPOST(
      createMockRequest({ cookies: await validAdminCookie() })
    )
    // Existing post → route returns success without creating a duplicate
    expect(res.status).toBe(200)
    expect(mockBlogFindUnique).toHaveBeenCalled()
  })
})

describe('GET/POST /api/init-db', () => {
  it('GET rejects unauthenticated requests and leaks no counts', async () => {
    const res = await initDbGET(createMockRequest())
    expect(res.status).toBe(401)
    expect(mockCounts.productCount).not.toHaveBeenCalled()
    expect(mockCounts.userCount).not.toHaveBeenCalled()
    expect(mockCounts.orderCount).not.toHaveBeenCalled()
  })

  it('POST rejects unauthenticated requests', async () => {
    const res = await initDbPOST(createMockRequest())
    expect(res.status).toBe(401)
    expect(mockCounts.productCount).not.toHaveBeenCalled()
  })

  it('GET returns stats for a valid admin session', async () => {
    const res = await initDbGET(createMockRequest({ cookies: await validAdminCookie() }))
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.success).toBe(true)
    expect(body.database).toEqual({ products: 42, users: 7, orders: 3 })
  })
})

describe('POST /api/admin/ping-search-engines', () => {
  it('rejects requests with an arbitrary Bearer token (old bypass)', async () => {
    const res = await pingSearchEnginesPOST(
      createMockRequest({ headers: { authorization: 'Bearer anything-at-all' } })
    )
    expect(res.status).toBe(401)
  })

  it('rejects unauthenticated requests', async () => {
    const res = await pingSearchEnginesPOST(createMockRequest())
    expect(res.status).toBe(401)
  })
})

describe('POST /api/auth/admin-verify', () => {
  it('rejects a body email without a signed cookie (old enumeration oracle)', async () => {
    const res = await adminVerifyPOST(
      createMockRequest({ body: { email: ADMIN_EMAIL } })
    )
    expect(res.status).toBe(401)
    // The route must not even look the email up — no oracle behavior
    expect(mockFindUserByEmail).not.toHaveBeenCalledWith(ADMIN_EMAIL)
  })

  it('accepts a valid signed admin session and returns the cookie user', async () => {
    const res = await adminVerifyPOST(
      createMockRequest({ cookies: await validAdminCookie() })
    )
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.success).toBe(true)
    expect(body.user.email).toBe(ADMIN_EMAIL)
  })

  it('ignores a body email that differs from the cookie identity', async () => {
    const res = await adminVerifyPOST(
      createMockRequest({
        cookies: await validAdminCookie(),
        body: { email: 'someone-else@example.com' },
      })
    )
    expect(res.status).toBe(200)
    const body = await res.json()
    // Identity comes from the signed cookie, never the body
    expect(body.user.email).toBe(ADMIN_EMAIL)
  })
})

describe('POST /api/auth/register rate limiting', () => {
  it('returns 429 after exceeding the hourly limit from the same client', async () => {
    // Same client IP for all attempts; empty body fails validation (400)
    // AFTER the rate limiter has counted the attempt.
    const makeRequest = () =>
      createMockRequest({
        headers: { 'x-forwarded-for': '203.0.113.99' },
        body: {},
      })

    const statuses: number[] = []
    for (let i = 0; i < 12; i++) {
      const res = await registerPOST(makeRequest())
      statuses.push(res.status)
    }

    // First 10 attempts pass the limiter (then fail validation with 400),
    // attempts 11+ are rate-limited.
    expect(statuses.slice(0, 10).every((s) => s === 400)).toBe(true)
    expect(statuses[10]).toBe(429)
    expect(statuses[11]).toBe(429)
  })

  it('does not rate-limit a different client', async () => {
    const res = await registerPOST(
      createMockRequest({
        headers: { 'x-forwarded-for': '198.51.100.42' },
        body: {},
      })
    )
    expect(res.status).toBe(400)
  })
})
