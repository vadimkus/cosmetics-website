import { POST as generateInvoice } from '@/app/api/invoice/generate/route'
import { POST as sendManualNotification } from '@/app/api/admin/manual-order-notification/route'
import { sendAdminNewOrderNotification, sendEmail } from '@/lib/email'
import { getOrderByNumber } from '@/lib/orderStorageDb'

jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn((body, init) => ({
      status: init?.status || 200,
      json: async () => body,
    })),
  },
}))

jest.mock('@/lib/email', () => ({
  sendEmail: jest.fn(async () => ({ success: true, messageId: 'invoice-email-id' })),
  sendAdminNewOrderNotification: jest.fn(async () => ({ success: true, messageId: 'admin-email-id' })),
}))

jest.mock('@/lib/logger', () => ({
  debugLog: jest.fn(),
  errorLog: jest.fn(),
}))

jest.mock('@/lib/csrf', () => ({
  requireCsrfToken: jest.fn(async () => ({ valid: true })),
}))

jest.mock('@/lib/adminAuth', () => ({
  requireAdminAuth: jest.fn(async () => ({ authorized: true })),
  verifyAdminSessionToken: jest.fn(() => ({ email: 'admin@genosys.ae' })),
}))

jest.mock('@/lib/jwt', () => ({
  verifySessionToken: jest.fn(() => null),
}))

jest.mock('@/lib/userStorageDb', () => ({
  findUserByEmail: jest.fn(async () => null),
}))

jest.mock('@/lib/emailHelpers', () => ({
  getPreferredEmail: jest.fn((user) => user.email),
  isApplePrivateRelayEmail: jest.fn(() => false),
}))

jest.mock('@/lib/siteConfig', () => ({
  SITE_URL: 'https://genosys.ae',
}))

jest.mock('@/lib/email/utils', () => ({
  LOGO_URL: 'https://genosys.ae/logo.png',
}))

jest.mock('@/lib/orderStorageDb', () => ({
  getOrderByNumber: jest.fn(),
}))

const storedOrder = {
  id: 'order-db-id',
  orderNumber: 'GEN2604260001',
  customerEmail: 'customer@example.com',
  customerName: 'Customer',
  customerPhone: '+971500000000',
  customerEmirate: 'Dubai',
  customerAddress: 'Dubai Marina',
  subtotal: 200,
  discountPercentage: 0,
  discountAmount: 0,
  bundleDiscountPercentage: null,
  bundleDiscountAmount: 0,
  shipping: 0,
  vat: 9.52,
  total: 200,
  status: 'DELIVERED',
  locale: 'en',
  items: [
    {
      id: 'item-1',
      productId: 'product-1',
      productName: 'Server Serum',
      price: 200,
      quantity: 1,
      image: '/server.jpg',
      color: null,
      size: null,
      bundleDiscount: null,
    },
  ],
}

function createRequest(body: unknown): Parameters<typeof generateInvoice>[0] {
  return {
    json: async () => body,
    // Invoice route requires owner session or admin cookie (2026-07-06 hardening)
    cookies: {
      get: jest.fn((name: string) =>
        name === 'admin-session' ? { name, value: 'admin-token' } : undefined
      ),
    },
  } as unknown as Parameters<typeof generateInvoice>[0]
}

describe('invoice and admin notification pricing integrity', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(getOrderByNumber as jest.Mock).mockResolvedValue(storedOrder)
  })

  it('generates invoice from stored order data instead of submitted client totals', async () => {
    const response = await generateInvoice(createRequest({
      orderNumber: 'GEN2604260001',
      customerEmail: 'customer@example.com',
      customerName: 'Tampered Customer',
      items: [{ name: 'Tampered Serum', price: 1, quantity: 1, total: 1 }],
      subtotal: 1,
      shippingCost: 0,
      vatAmount: 0,
      total: 1,
      locale: 'en',
    }))

    const body = await response.json()
    const html = (sendEmail as jest.Mock).mock.calls[0][2] as string

    expect(response.status).toBe(200)
    expect(body.success).toBe(true)
    expect(getOrderByNumber).toHaveBeenCalledWith('GEN2604260001')
    expect(html).toContain('Server Serum')
    expect(html).toContain('AED 200.00')
    expect(html).not.toContain('Tampered Serum')
  })

  it('sends manual admin notification from stored order data instead of submitted totals', async () => {
    const response = await sendManualNotification(createRequest({
      orderNumber: 'GEN2604260001',
      customerName: 'Tampered Customer',
      customerEmail: 'attacker@example.com',
      total: 1,
      itemCount: 99,
      items: [{ productName: 'Tampered Serum', quantity: 1, price: 1 }],
    }) as Parameters<typeof sendManualNotification>[0])

    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body.success).toBe(true)
    expect(sendAdminNewOrderNotification).toHaveBeenCalledWith(expect.objectContaining({
      orderNumber: 'GEN2604260001',
      customerName: 'Customer',
      customerEmail: 'customer@example.com',
      total: 200,
      itemCount: 1,
      items: [
        expect.objectContaining({
          productName: 'Server Serum',
          quantity: 1,
          price: 200,
        }),
      ],
    }))
  })
})
