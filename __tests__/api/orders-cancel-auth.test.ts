/**
 * POST /api/orders/[id]/cancel must belong to the order's owner.
 *
 * It used to check only the CSRF token, which every visitor is issued on page
 * load, so anyone with an order id could cancel it at any status. These pin
 * the three gates: signed in, owns the order, order still cancellable.
 */
jest.mock('next/server', () => ({
  NextResponse: {
    json: (body: unknown, init?: { status?: number }) => ({
      status: init?.status ?? 200,
      json: async () => body,
    }),
  },
}))
jest.mock('@/lib/logger', () => ({ errorLog: jest.fn(), debugLog: jest.fn() }))
jest.mock('@/lib/csrf', () => ({ requireCsrfToken: jest.fn(async () => ({ valid: true })) }))
jest.mock('@/lib/jwt', () => ({ verifySessionToken: jest.fn() }))
jest.mock('@/lib/userStorageDb', () => ({ findUserById: jest.fn() }))
jest.mock('@/lib/orderStorageDb', () => ({ updateOrderStatus: jest.fn(async () => true) }))
jest.mock('@/lib/loyalty', () => ({ reverseRedemptionForOrder: jest.fn(async () => false) }))
jest.mock('@/lib/homecare', () => ({ restoreClinicPointsRedemptionForOrder: jest.fn(async () => false) }))
jest.mock('@/lib/prisma', () => ({ prisma: { order: { findUnique: jest.fn() } } }))

import { POST } from '@/app/api/orders/[id]/cancel/route'
import { prisma } from '@/lib/prisma'
import { verifySessionToken } from '@/lib/jwt'
import { updateOrderStatus } from '@/lib/orderStorageDb'

const findUnique = prisma.order.findUnique as jest.Mock
const verify = verifySessionToken as jest.Mock

function request(cookie: string | null) {
  return {
    cookies: { get: () => (cookie ? { value: cookie } : undefined) },
    headers: { get: () => null },
  } as unknown as Parameters<typeof POST>[0]
}
const params = { params: Promise.resolve({ id: 'order-1' }) }

const pendingOwnedBy = (email: string, extra: Record<string, unknown> = {}) => ({
  id: 'order-1',
  customerEmail: email,
  status: 'PENDING',
  paymentStatus: 'pending',
  ...extra,
})

describe('cancel order', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    verify.mockImplementation((token: string) => (token === 'good' ? { email: 'Me@Example.com' } : null))
  })

  it('refuses without a session, and never reads the order', async () => {
    const res = await POST(request(null), params)
    expect(res.status).toBe(401)
    expect(findUnique).not.toHaveBeenCalled()
    expect(updateOrderStatus).not.toHaveBeenCalled()
  })

  it("refuses someone else's order with the same answer as a missing one", async () => {
    findUnique.mockResolvedValueOnce(pendingOwnedBy('other@example.com'))
    const theirs = await POST(request('good'), params)
    findUnique.mockResolvedValueOnce(null)
    const missing = await POST(request('good'), params)
    expect(theirs.status).toBe(404)
    expect(missing.status).toBe(404)
    expect(await theirs.json()).toEqual(await missing.json())
    expect(updateOrderStatus).not.toHaveBeenCalled()
  })

  it('cancels your own pending unpaid order, matching email case-insensitively', async () => {
    findUnique.mockResolvedValueOnce(pendingOwnedBy('me@example.com'))
    const res = await POST(request('good'), params)
    expect(res.status).toBe(200)
    expect(updateOrderStatus).toHaveBeenCalledWith('order-1', 'CANCELLED')
  })

  it.each([
    ['confirmed', { status: 'CONFIRMED' }],
    ['shipped', { status: 'SHIPPED' }],
    ['delivered', { status: 'DELIVERED' }],
    ['pending but already paid', { status: 'PENDING', paymentStatus: 'paid' }],
  ])('refuses to cancel an order that is %s', async (_label, extra) => {
    findUnique.mockResolvedValueOnce(pendingOwnedBy('me@example.com', extra))
    const res = await POST(request('good'), params)
    expect(res.status).toBe(409)
    expect(updateOrderStatus).not.toHaveBeenCalled()
  })

  it('treats an already cancelled order as done', async () => {
    findUnique.mockResolvedValueOnce(pendingOwnedBy('me@example.com', { status: 'CANCELLED' }))
    const res = await POST(request('good'), params)
    expect(res.status).toBe(200)
    expect(updateOrderStatus).not.toHaveBeenCalled()
  })
})
