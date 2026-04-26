import { POST } from '@/app/api/mobile/orders/route'
import { prisma } from '@/lib/database'
import { getProductById } from '@/lib/productsDb'
import { findUserByEmail } from '@/lib/userStorageDb'
import { Product } from '@/types'

jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn((body, init) => ({
      status: init?.status || 200,
      json: async () => body,
    })),
  },
  after: jest.fn(),
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

jest.mock('@/lib/logger', () => ({
  debugLog: jest.fn(),
  errorLog: jest.fn(),
}))

jest.mock('@/lib/database', () => ({
  prisma: {
    order: {
      create: jest.fn(async ({ data }) => ({
        id: 'mobile-cod-order-id',
        orderNumber: data.orderNumber,
        status: 'PENDING',
        paymentMethod: data.paymentMethod,
        paymentStatus: 'pending',
        subtotal: data.subtotal,
        discountPercentage: data.discountPercentage,
        discountAmount: data.discountAmount,
        bundleDiscountPercentage: data.bundleDiscountPercentage,
        bundleDiscountAmount: data.bundleDiscountAmount,
        shipping: data.shipping,
        vat: data.vat,
        total: data.total,
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        customerEmirate: data.customerEmirate,
        customerAddress: data.customerAddress,
        locale: data.locale,
        createdAt: new Date('2026-04-26T10:00:00Z'),
        items: data.items.create.map((item: Record<string, unknown>, index: number) => ({
          id: `item-${index + 1}`,
          ...item,
        })),
      })),
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

jest.mock('@/lib/emailHelpers', () => ({
  getPreferredEmail: jest.fn((user) => user.email),
}))

jest.mock('@/lib/mobileCheckoutConfig', () => ({
  calculateMobileShipping: jest.fn(() => 0),
  calculateVatIncluded: jest.fn(() => 0),
}))

jest.mock('@/lib/activityTracker', () => ({
  trackUserActivity: jest.fn(),
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

describe('mobile orders COD pricing', () => {
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
      customerName: 'Customer',
      customerPhone: '+971500000000',
      customerEmirate: 'Dubai',
      customerAddress: 'Dubai Marina',
      paymentMethod: 'cod',
      items: [
        {
          productId: 'product-1',
          name: 'Tampered Serum',
          price: 1,
          quantity: 2,
          image: '/client.jpg',
        },
      ],
      subtotal: 2,
      total: 2,
      locale: 'en',
    }))

    const body = await response.json()

    expect(response.status).toBe(201)
    expect(body.success).toBe(true)
    expect(prisma.order.create).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({
        subtotal: 360,
        total: 360,
        discountAmount: 40,
        discountPercentage: 10,
        items: {
          create: [
            expect.objectContaining({
              productId: 'product-1',
              productName: 'Server Serum',
              price: 180,
              quantity: 2,
            }),
          ],
        },
      }),
      include: { items: true },
    }))
  })
})
