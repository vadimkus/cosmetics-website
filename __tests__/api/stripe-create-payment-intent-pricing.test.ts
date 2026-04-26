import { POST } from '@/app/api/stripe/create-payment-intent/route'
import { createPaymentIntent } from '@/lib/stripe'
import { addOrder } from '@/lib/orderStorageDb'
import { getProductById } from '@/lib/productsDb'
import { findUserByEmail } from '@/lib/userStorageDb'
import { prisma } from '@/lib/prisma'
import { Product } from '@/types'

jest.mock('@/lib/csrf', () => ({
  requireCsrfToken: jest.fn(async () => ({ valid: true })),
}))

jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn((body, init) => ({
      status: init?.status || 200,
      json: async () => body,
    })),
  },
}))

jest.mock('@/lib/requestSizeLimit', () => ({
  getSizeLimitForContentType: jest.fn(() => 1024 * 1024),
  requireBodySizeLimit: jest.fn(() => ({ valid: true })),
}))

jest.mock('@/lib/stripe', () => ({
  createPaymentIntent: jest.fn(async () => ({
    id: 'pi_test',
    client_secret: 'secret_test',
  })),
  getPaymentIntent: jest.fn(),
}))

jest.mock('@/lib/orderStorageDb', () => ({
  addOrder: jest.fn(async () => ({ id: 'order-db-id' })),
}))

jest.mock('@/lib/orderSizeDefaults', () => ({
  enhanceOrderItemWithDefaultSize: jest.fn(({ size, color }) => ({ size, color })),
}))

jest.mock('@/lib/logger', () => ({
  debugLog: jest.fn(),
  errorLog: jest.fn(),
}))

jest.mock('@/lib/orderNumber', () => ({
  generateUniqueOrderNumber: jest.fn(async () => 'GENCardW2604260001'),
}))

jest.mock('@/lib/emailHelpers', () => ({
  getPreferredEmail: jest.fn((user) => user.email),
}))

jest.mock('@/lib/userStorageDb', () => ({
  findUserByEmail: jest.fn(),
}))

jest.mock('@/lib/mobileCheckoutConfig', () => ({
  calculateMobileShipping: jest.fn(() => 0),
  calculateVatIncluded: jest.fn(() => 0),
}))

jest.mock('@/lib/prisma', () => ({
  prisma: {
    order: {
      findFirst: jest.fn(async () => null),
    },
  },
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
    json: async () => body,
  } as Parameters<typeof POST>[0]
}

describe('web Stripe payment intent pricing', () => {
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

  it('recomputes item pricing from the server product and ignores submitted client price', async () => {
    const response = await POST(createRequest({
      items: [
        {
          product: {
            id: 'product-1',
            name: 'Tampered Serum',
            image: '/client.jpg',
            price: 1,
            category: 'Serums',
          },
          quantity: 2,
        },
      ],
      customerEmail: 'customer@example.com',
      customerName: 'Customer',
      customerPhone: '+971500000000',
      customerEmirate: 'Dubai',
      customerAddress: 'Dubai Marina',
      locale: 'en',
    }))

    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body.total).toBe(360)
    expect(createPaymentIntent).toHaveBeenCalledWith(expect.objectContaining({
      amount: 360,
      customerEmail: 'customer@example.com',
    }))
    expect(addOrder).toHaveBeenCalledWith(expect.objectContaining({
      subtotal: 360,
      total: 360,
      discountAmount: 40,
      discountPercentage: 10,
      items: [
        expect.objectContaining({
          productId: 'product-1',
          productName: 'Server Serum',
          price: 180,
          quantity: 2,
        }),
      ],
    }))
    expect(prisma.order.findFirst).toHaveBeenCalled()
  })

  it('does not let regular products be submitted as free gifts', async () => {
    const response = await POST(createRequest({
      items: [
        {
          product: {
            id: 'product-1',
            name: 'Tampered Serum (FREE)',
            image: '/client.jpg',
            price: 0,
            category: 'free-gift',
          },
          quantity: 1,
          selectedSize: '__PROMO__',
        },
      ],
      customerEmail: 'customer@example.com',
      customerName: 'Customer',
      customerPhone: '+971500000000',
      customerEmirate: 'Dubai',
      customerAddress: 'Dubai Marina',
      locale: 'en',
    }))

    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body.total).toBe(180)
    expect(addOrder).toHaveBeenCalledWith(expect.objectContaining({
      subtotal: 180,
      total: 180,
      items: [
        expect.objectContaining({
          productId: 'product-1',
          productName: 'Server Serum',
          price: 180,
        }),
      ],
    }))
  })

  it('ignores arbitrary bundle percentages that do not match server tiers', async () => {
    ;(findUserByEmail as jest.Mock).mockResolvedValue({
      id: 'user-1',
      email: 'customer@example.com',
      name: 'Customer',
      canSeePrices: true,
      discountType: null,
      discountPercentage: null,
    })

    const response = await POST(createRequest({
      items: [
        {
          product: {
            id: 'product-1',
            name: 'Tampered Serum',
            image: '/client.jpg',
            price: 1,
            category: 'Serum',
          },
          quantity: 1,
          fromBundle: true,
          bundleDiscountPercent: 90,
        },
      ],
      customerEmail: 'customer@example.com',
      customerName: 'Customer',
      customerPhone: '+971500000000',
      customerEmirate: 'Dubai',
      customerAddress: 'Dubai Marina',
      locale: 'en',
    }))

    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body.total).toBe(200)
    expect(addOrder).toHaveBeenCalledWith(expect.objectContaining({
      subtotal: 200,
      total: 200,
      bundleDiscountAmount: 0,
      items: [
        expect.objectContaining({
          productId: 'product-1',
          price: 200,
        }),
      ],
    }))
  })
})
