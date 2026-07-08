import { GET as GET_ORDERS } from '@/app/api/mobile/orders/route'
import { GET as GET_ORDER_DETAIL } from '@/app/api/mobile/orders/[id]/route'
import { prisma } from '@/lib/database'
import { findUserByEmail } from '@/lib/userStorageDb'

jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn((body, init) => ({
      status: init?.status || 200,
      json: async () => body,
    })),
  },
}))

jest.mock('@/lib/jwt', () => ({
  extractTokenFromHeader: jest.fn(() => 'token'),
  validateMobileAuth: jest.fn(() => ({
    valid: true,
    payload: { email: 'relay@privaterelay.appleid.com' },
  })),
}))

jest.mock('@/lib/userStorageDb', () => ({
  findUserByEmail: jest.fn(),
}))

jest.mock('@/lib/logger', () => ({
  debugLog: jest.fn(),
  errorLog: jest.fn(),
}))

jest.mock('@/lib/activityTracker', () => ({
  trackUserActivity: jest.fn(),
}))

jest.mock('@/lib/database', () => ({
  prisma: {
    order: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
    },
  },
}))

jest.mock('@/lib/email', () => ({
  sendOrderConfirmationEmail: jest.fn(),
  sendAdminNewOrderNotification: jest.fn(),
}))

jest.mock('@/lib/orderNumber', () => ({
  generateUniqueOrderNumber: jest.fn(async () => 'GENCODM2604260001'),
}))

jest.mock('@/lib/productsDb', () => ({
  getProductById: jest.fn(),
}))

// Loyalty engine pulls in the real Prisma client — mock the whole module
jest.mock('@/lib/loyalty', () => ({
  resolveRedemptionForCheckout: jest.fn(async () => ({ points: 0, amountAed: 0 })),
  recordRedemption: jest.fn(async () => true),
}))

jest.mock('@/lib/cartPricing', () => ({
  getCartLinePricing: jest.fn(),
}))

jest.mock('@/lib/mobileCheckoutConfig', () => ({
  calculateMobileShipping: jest.fn(() => 0),
  calculateVatIncluded: jest.fn(() => 0),
}))

function createRequest(url = 'https://genosys.ae/api/mobile/orders'): Parameters<typeof GET_ORDERS>[0] {
  return {
    url,
    headers: {
      get: jest.fn((key: string) => {
        if (key === 'x-api-key') return 'mobile-key'
        if (key === 'Authorization') return 'Bearer token'
        return null
      }),
    },
  } as unknown as Parameters<typeof GET_ORDERS>[0]
}

const createOrder = (overrides: Record<string, unknown> = {}) => ({
  id: 'order-login',
  orderNumber: 'GENCardM2604260001',
  status: 'DELIVERED',
  paymentMethod: 'stripe',
  paymentStatus: 'paid',
  paymentMetadata: null,
  orderNotes: '',
  subtotal: 100,
  discountPercentage: null,
  discountAmount: 0,
  bundleDiscountPercentage: null,
  bundleDiscountAmount: 0,
  shipping: 45,
  vat: 6.9,
  total: 145,
  customerName: 'Customer',
  customerPhone: '+971500000000',
  customerEmirate: 'Dubai',
  customerAddress: 'Dubai Marina',
  locale: 'en',
  createdAt: new Date('2026-04-26T10:00:00Z'),
  updatedAt: new Date('2026-04-26T10:00:00Z'),
  paidAt: new Date('2026-04-26T10:01:00Z'),
  items: [
    {
      id: 'item-1',
      productId: 'product-1',
      productName: 'Server Serum',
      price: 100,
      quantity: 1,
      image: '/server.jpg',
      color: null,
      size: null,
      bundleDiscount: null,
    },
  ],
  ...overrides,
})

describe('mobile orders history email matching', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(findUserByEmail as jest.Mock).mockResolvedValue({
      id: 'user-1',
      email: 'relay@privaterelay.appleid.com',
      contactEmail: 'real.customer@example.com',
      name: 'Customer',
    })
  })

  it('lists orders stored under login email and contact email', async () => {
    ;(prisma.order.findMany as jest.Mock).mockResolvedValue([
      createOrder({ id: 'order-login', customerEmail: 'relay@privaterelay.appleid.com' }),
      createOrder({ id: 'order-contact', customerEmail: 'real.customer@example.com' }),
    ])

    const response = await GET_ORDERS(createRequest('https://genosys.ae/api/mobile/orders?page=1&limit=10'))
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body.data).toHaveLength(2)
    expect(prisma.order.findMany).toHaveBeenCalledWith(expect.objectContaining({
      where: {
        OR: [
          { customerEmail: 'relay@privaterelay.appleid.com' },
          { customerEmail: 'real.customer@example.com' },
        ],
      },
    }))
  })

  it('loads order details for an order stored under contact email', async () => {
    ;(prisma.order.findFirst as jest.Mock).mockResolvedValue(
      createOrder({ id: 'order-contact', customerEmail: 'real.customer@example.com' })
    )

    const response = await GET_ORDER_DETAIL(
      createRequest('https://genosys.ae/api/mobile/orders/order-contact') as Parameters<typeof GET_ORDER_DETAIL>[0],
      { params: Promise.resolve({ id: 'order-contact' }) }
    )
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body.data.id).toBe('order-contact')
    expect(prisma.order.findFirst).toHaveBeenCalledWith(expect.objectContaining({
      where: {
        id: 'order-contact',
        OR: [
          { customerEmail: 'relay@privaterelay.appleid.com' },
          { customerEmail: 'real.customer@example.com' },
        ],
      },
    }))
  })
})
