import { GET } from '@/app/api/stripe/payment-status/route'
import { getPaymentIntent } from '@/lib/stripe'
import { prisma } from '@/lib/database'
import { findUserByEmail } from '@/lib/userStorageDb'
import { recordRedemption } from '@/lib/loyalty'

jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn((body, init) => ({
      status: init?.status || 200,
      json: async () => body,
    })),
  },
}))

jest.mock('@/lib/stripe', () => ({
  getCheckoutSession: jest.fn(),
  getPaymentIntent: jest.fn(),
}))

jest.mock('@/lib/database', () => ({
  prisma: {
    order: {
      findFirst: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
    },
  },
}))

jest.mock('@/lib/email', () => ({
  sendOrderConfirmationEmail: jest.fn(async () => true),
  sendAdminNewOrderNotification: jest.fn(async () => true),
}))

jest.mock('@/lib/emailHelpers', () => ({
  getPreferredEmail: jest.fn((user) => user.email),
}))

jest.mock('@/lib/userStorageDb', () => ({
  findUserByEmail: jest.fn(),
}))

jest.mock('@/lib/mobileDiscountRules', () => ({
  isUserDiscountExcludedProduct: jest.fn(() => false),
}))

jest.mock('@/lib/loyalty', () => ({
  estimateOrderPoints: jest.fn(() => 0),
  recordRedemption: jest.fn(async () => true),
}))

jest.mock('@/lib/analyticsServer', () => ({
  trackUserAction: jest.fn(async () => undefined),
}))

jest.mock('@/lib/logger', () => ({
  debugLog: jest.fn(),
  errorLog: jest.fn(),
}))

const order = {
  id: 'order-db-id',
  orderNumber: 'GENCardW2607180001',
  customerName: 'Rewards Customer',
  customerEmail: 'customer@example.com',
  customerPhone: '+971500000000',
  customerAddress: 'Dubai Marina',
  customerEmirate: 'Dubai',
  locale: 'en',
  subtotal: 200,
  shipping: 0,
  vat: 9.52,
  total: 200,
  status: 'PENDING',
  paymentStatus: 'pending',
  paymentMethod: 'Stripe',
  discountAmount: 0,
  bundleDiscountPercentage: null,
  bundleDiscountAmount: 0,
  loyaltyPointsRedeemed: 400,
  loyaltyDiscountAmount: 20,
  createdAt: new Date('2026-07-18T00:00:00Z'),
  items: [
    {
      productName: 'GENOSYS Product',
      quantity: 1,
      price: 200,
      image: '/images/product.jpg',
      color: null,
      size: null,
    },
  ],
}

describe('payment-status loyalty settlement', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(getPaymentIntent as jest.Mock).mockResolvedValue({
      id: 'pi_rewards',
      status: 'succeeded',
    })
    ;(prisma.order.findFirst as jest.Mock).mockResolvedValue(order)
    ;(prisma.order.updateMany as jest.Mock).mockResolvedValue({ count: 1 })
    ;(findUserByEmail as jest.Mock).mockResolvedValue({
      id: 'user-1',
      email: 'customer@example.com',
      discountType: null,
      discountPercentage: null,
    })
  })

  it('deducts deferred points when the payment-intent poll wins the paid transition', async () => {
    const response = await GET({
      url: 'http://localhost/api/stripe/payment-status?payment_intent=pi_rewards&order_id=GENCardW2607180001',
    } as Parameters<typeof GET>[0])

    expect(response.status).toBe(200)
    expect(prisma.order.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: order.id, paymentStatus: { not: 'paid' } },
      })
    )
    expect(recordRedemption).toHaveBeenCalledWith({
      userId: 'user-1',
      orderId: order.id,
      orderNumber: order.orderNumber,
      points: 400,
      amountAed: 20,
    })
  })

  it('idempotently retries settlement when another handler won the transition', async () => {
    ;(prisma.order.updateMany as jest.Mock).mockResolvedValue({ count: 0 })

    await GET({
      url: 'http://localhost/api/stripe/payment-status?payment_intent=pi_rewards&order_id=GENCardW2607180001',
    } as Parameters<typeof GET>[0])

    expect(recordRedemption).toHaveBeenCalledWith(
      expect.objectContaining({
        orderId: order.id,
        points: 400,
      })
    )
  })
})
