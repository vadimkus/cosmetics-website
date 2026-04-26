import { POST } from '@/app/api/orders/cod-confirmation/route'
import { addOrder } from '@/lib/orderStorageDb'
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

jest.mock('@/lib/email', () => ({
  sendEmail: jest.fn(),
  sendAdminNewOrderNotification: jest.fn(),
  generateCODOrderHTML: jest.fn(() => '<html>order</html>'),
}))

jest.mock('@/lib/logger', () => ({
  debugLog: jest.fn(),
  errorLog: jest.fn(),
}))

jest.mock('@/lib/orderStorageDb', () => ({
  addOrder: jest.fn(async () => ({ id: 'cod-db-id' })),
}))

jest.mock('@/lib/csrf', () => ({
  requireCsrfToken: jest.fn(async () => ({ valid: true })),
}))

jest.mock('@/lib/orderSizeDefaults', () => ({
  enhanceOrderItemWithDefaultSize: jest.fn(({ size, color }) => ({ size, color })),
}))

jest.mock('@/lib/emailHelpers', () => ({
  getPreferredEmail: jest.fn((user) => user.email),
}))

jest.mock('@/lib/userStorageDb', () => ({
  findUserByEmail: jest.fn(),
}))

jest.mock('@/lib/productsDb', () => ({
  getProductById: jest.fn(),
}))

jest.mock('@/lib/mobileCheckoutConfig', () => ({
  calculateMobileShipping: jest.fn(() => 0),
  calculateVatIncluded: jest.fn(() => 0),
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
      get: jest.fn(() => 'Mozilla/5.0'),
    },
    json: async () => body,
  } as unknown as Parameters<typeof POST>[0]
}

describe('web COD confirmation pricing', () => {
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

  it('recomputes item pricing from server product and ignores submitted client price', async () => {
    const response = await POST(createRequest({
      orderNumber: 'CODW2604260001',
      customerName: 'Customer',
      customerEmail: 'customer@example.com',
      customerPhone: '+971500000000',
      customerAddress: 'Dubai Marina',
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
      shippingCost: 0,
      vatAmount: 0,
      total: 2,
      locale: 'en',
    }))

    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body.success).toBe(true)
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
  })

  it('does not double-discount Beauty Boxes when submitted with stale bundle metadata', async () => {
    ;(getProductById as jest.Mock).mockResolvedValue(createProduct({
      id: 'product-62',
      productNumber: '62',
      name: 'SENSITIVE SKIN BEAUTY BOX',
      price: 1442,
      category: 'Beauty Boxes',
    }))

    const response = await POST(createRequest({
      orderNumber: 'CODW2604260002',
      customerName: 'Customer',
      customerEmail: 'customer@example.com',
      customerPhone: '+971500000000',
      customerAddress: 'Dubai Marina',
      emirate: 'Dubai',
      items: [
        {
          id: 'product-62',
          name: 'SENSITIVE SKIN BEAUTY BOX',
          price: 1442,
          quantity: 1,
          image: '/beauty-box.jpg',
          size: '1 set',
          bundleDiscount: 15,
        },
      ],
      subtotal: 1442,
      shippingCost: 0,
      vatAmount: 0,
      total: 1442,
      locale: 'en',
    }))

    expect(response.status).toBe(200)
    expect(addOrder).toHaveBeenCalledWith(expect.objectContaining({
      subtotal: 1442,
      total: 1442,
      discountAmount: 0,
      bundleDiscountAmount: 0,
      items: [
        expect.objectContaining({
          productId: 'product-62',
          productName: 'SENSITIVE SKIN BEAUTY BOX',
          price: 1442,
          quantity: 1,
        }),
      ],
    }))
  })

  it('does not let regular products be submitted as free gifts', async () => {
    const response = await POST(createRequest({
      orderNumber: 'CODW2604260003',
      customerName: 'Customer',
      customerEmail: 'customer@example.com',
      customerPhone: '+971500000000',
      customerAddress: 'Dubai Marina',
      emirate: 'Dubai',
      items: [
        {
          id: 'product-1',
          name: 'Tampered Serum (FREE)',
          price: 0,
          quantity: 1,
          image: '/client.jpg',
          size: '__PROMO__',
        },
      ],
      subtotal: 0,
      shippingCost: 0,
      vatAmount: 0,
      total: 0,
      locale: 'en',
    }))

    expect(response.status).toBe(200)
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
      orderNumber: 'CODW2604260004',
      customerName: 'Customer',
      customerEmail: 'customer@example.com',
      customerPhone: '+971500000000',
      customerAddress: 'Dubai Marina',
      emirate: 'Dubai',
      items: [
        {
          id: 'product-1',
          name: 'Tampered Serum',
          price: 1,
          quantity: 1,
          image: '/client.jpg',
          bundleDiscount: 90,
        },
      ],
      subtotal: 1,
      shippingCost: 0,
      vatAmount: 0,
      total: 1,
      locale: 'en',
    }))

    expect(response.status).toBe(200)
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
