import { POST } from '@/app/api/mobile/checkout/stripe/route'
import { prisma } from '@/lib/prisma'
import { getProductById } from '@/lib/productsDb'
import { findUserByEmail } from '@/lib/userStorageDb'
import { Product } from '@/types'

jest.mock('@/lib/envValidation', () => ({
  STRIPE_SECRET_KEY: 'sk_test_123',
  MOBILE_APP_KEY: 'mobile-key',
  NEXT_PUBLIC_BASE_URL: 'https://genosys.ae',
}))

jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn((body, init) => ({
      status: init?.status || 200,
      json: async () => body,
    })),
  },
}))

jest.mock('stripe', () => {
  return jest.fn().mockImplementation(() => ({
    checkout: {
      sessions: {
        create: jest.fn(async () => ({
          id: 'cs_test_mobile',
          url: 'https://checkout.stripe.com/test',
          expires_at: 123456,
        })),
        retrieve: jest.fn(),
      },
    },
  }))
})

jest.mock('@/lib/prisma', () => ({
  prisma: {
    order: {
      findFirst: jest.fn(async () => null),
      create: jest.fn(async () => ({ id: 'order-mobile-id' })),
      update: jest.fn(async () => ({ id: 'order-mobile-id' })),
    },
    orderItem: {
      deleteMany: jest.fn(async () => ({})),
      create: jest.fn(async () => ({})),
    },
  },
}))

jest.mock('@/lib/logger', () => ({
  debugLog: jest.fn(),
  errorLog: jest.fn(),
}))

jest.mock('@/lib/jwt', () => ({
  extractTokenFromHeader: jest.fn(() => 'token'),
  validateMobileAuth: jest.fn(() => ({
    valid: true,
    payload: { email: 'customer@example.com' },
  })),
}))

jest.mock('@/lib/userStorageDb', () => ({
  findUserByEmail: jest.fn(),
}))

jest.mock('@/lib/orderNumber', () => ({
  generateUniqueOrderNumber: jest.fn(async () => 'GENCardM2604260001'),
}))

jest.mock('@/lib/mobileCheckoutConfig', () => ({
  calculateMobileShipping: jest.fn(() => 0),
  calculateVatIncluded: jest.fn(() => 0),
}))

jest.mock('@/lib/productsDb', () => ({
  getProductById: jest.fn(),
}))

const createProduct = (overrides: Partial<Product> = {}): Product => ({
  id: 'product-1',
  productNumber: '1',
  name: 'Server Serum',
  image: '/server.jpg',
  price: 200,
  category: 'Serums',
  description: 'Server product',
  inStock: true,
  rating: 5,
  ...overrides,
})

function createRequest(body: unknown): Parameters<typeof POST>[0] {
  return {
    headers: {
      get: jest.fn((key: string) => {
        if (key === 'x-api-key') return 'mobile-key'
        if (key === 'Authorization') return 'Bearer token'
        return null
      }),
    },
    json: async () => body,
  } as unknown as Parameters<typeof POST>[0]
}

describe('mobile Stripe checkout pricing', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(findUserByEmail as jest.Mock).mockResolvedValue({
      id: 'user-1',
      email: 'customer@example.com',
      name: 'Customer',
      canSeePrices: true,
      discountType: 'percentage',
      discountPercentage: 10,
    })
    ;(getProductById as jest.Mock).mockResolvedValue(createProduct())
  })

  it('recomputes item pricing through server product data and ignores submitted client price', async () => {
    const response = await POST(createRequest({
      orderNumber: 'GENCardM2604260001',
      customer: {
        name: 'Customer',
        email: 'customer@example.com',
        phone: '+971500000000',
        address: 'Dubai Marina',
      },
      emirate: 'Dubai',
      items: [
        {
          id: 'product-1',
          name: 'Tampered Serum',
          price: 1,
          quantity: 2,
          image: '/client.jpg',
        },
      ],
      subtotal: 2,
      total: 2,
    }))

    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body.meta.validatedTotals.total).toBe(360)
    expect(prisma.order.create).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({
        subtotal: 360,
        total: 360,
        discountAmount: 40,
        discountPercentage: 10,
      }),
    }))
    expect(prisma.orderItem.create).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({
        productId: 'product-1',
        productName: 'Server Serum',
        price: 180,
        quantity: 2,
      }),
    }))
  })
})
