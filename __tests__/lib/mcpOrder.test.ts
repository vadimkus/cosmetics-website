import type { Product } from '@/types'

const products: Record<string, Partial<Product>> = {
  '68': { id: '68', productNumber: '68', name: 'GLASS SKIN RITUAL KIT', price: 652.5, category: 'Beauty Boxes', inStock: true, description: 'Kit', image: '/images/kit.jpg', variants: [] },
  '18': { id: '18', productNumber: '18', name: 'MOISTURE REPLENISHING HYALURON SERUM', price: 330, category: 'Serum', inStock: true, noDiscount: true, description: 'Serum', image: '/images/serum.jpg', variants: [] },
  '99': { id: '99', productNumber: '99', name: 'PRO VIAL', price: 0, category: 'PRO Solution', inStock: true, isPriceOnRequest: true, description: '', image: '', variants: [] },
}

const addOrder = jest.fn()
const createCheckoutSession = jest.fn(async () => ({ id: 'cs_test_1', url: 'https://checkout.stripe.com/c/pay/cs_test_1' }))
const findFirst = jest.fn(async () => null)

jest.mock('@/lib/productsDb', () => ({ getProductById: jest.fn(async (id: string) => products[id] ?? null) }))
jest.mock('@/lib/stripe', () => ({
  createCheckoutSession: (...a: unknown[]) => (createCheckoutSession as (...x: unknown[]) => unknown)(...a),
  getCheckoutSession: jest.fn(),
  aedToFils: (n: number) => Math.round(n * 100),
}))
jest.mock('@/lib/orderStorageDb', () => ({ addOrder: (...a: unknown[]) => addOrder(...a) }))
jest.mock('@/lib/prisma', () => ({ prisma: { order: { findFirst: (...a: unknown[]) => (findFirst as (...x: unknown[]) => unknown)(...a) } } }))
jest.mock('@/lib/orderNumber', () => ({ generateUniqueOrderNumber: jest.fn(async ({ channel }: { channel: string }) => `GENCard${channel}2610120001`) }))
jest.mock('@/lib/userStorageDb', () => ({ findUserByEmail: jest.fn(async () => ({ email: 'clinic@x.ae', discountPercentage: 50 })) }))
jest.mock('@/lib/rateLimitSimple', () => ({ rateLimitSimple: () => async () => ({ success: true }) }))

import { placeMcpOrder } from '@/lib/mcp/order'

const customer = { name: 'Test Buyer', email: 'Clinic@X.ae', phone: '+1 786 901 9906', emirate: 'Dubai', address: 'Apt 903, Imperial Avenue, Downtown' }

beforeEach(() => {
  addOrder.mockClear()
  createCheckoutSession.mockClear()
})

describe('placeMcpOrder', () => {
  it('creates a retail-priced AI order with the shade and a Stripe link', async () => {
    const res = await placeMcpOrder({ items: [{ product_id: '68', color: '#02 Natural' }, { product_id: '18', quantity: 2 }], customer }, '1.2.3.4')
    expect(res).toMatchObject({ ok: true, order_number: 'GENCardA2610120001', pay_url: 'https://checkout.stripe.com/c/pay/cs_test_1' })
    if (!res.ok) return
    // Retail even though the email belongs to a 50% account.
    expect(res.items.map((i) => [i.id, i.color, i.unit_price_aed])).toEqual([['68', 'Natural', 652.5], ['18', null, 330]])
    expect(res.subtotal_aed).toBe(1312.5)
    expect(res.delivery_aed).toBe(0)
    expect(res.total_aed).toBe(1312.5)

    const order = addOrder.mock.calls[0][0]
    expect(order).toMatchObject({ orderNumber: 'GENCardA2610120001', customerEmail: 'clinic@x.ae', status: 'PENDING', paymentStatus: 'pending', paymentMethod: 'stripe', stripeSessionId: 'cs_test_1', discountAmount: 0 })
    expect(JSON.parse(order.paymentMetadata)).toEqual({ source: 'ai_assistant', via: 'mcp' })
    expect(order.items[0]).toMatchObject({ productId: '68', color: 'Natural', price: 652.5 })
  })

  it('charges Dubai delivery under AED 1,000', async () => {
    const res = await placeMcpOrder({ items: [{ product_id: '18' }], customer }, '1.2.3.4')
    expect(res).toMatchObject({ ok: true, subtotal_aed: 330, delivery_aed: 45, total_aed: 375 })
    const lines = (createCheckoutSession.mock.calls[0] as unknown as [{ lineItems: Array<{ price_data: { unit_amount: number } }> }])[0].lineItems
    expect(lines.map((l) => l.price_data.unit_amount)).toEqual([33000, 4500])
  })

  it('refuses before touching Stripe when something is missing', async () => {
    const cases: Array<[Parameters<typeof placeMcpOrder>[0], RegExp]> = [
      [{ items: [{ product_id: '68' }], customer }, /pick one/],
      [{ items: [{ product_id: '99' }], customer }, /on request/],
      [{ items: [{ product_id: 'nope' }], customer }, /No GENOSYS product/],
      [{ items: [{ product_id: '18' }], customer: { ...customer, emirate: 'Riyadh' } }, /UAE only/],
      [{ items: [{ product_id: '18' }], customer: { ...customer, phone: '12345' } }, /phone/],
      [{ items: [{ product_id: '18' }], customer: { ...customer, email: 'not-an-email' } }, /email/],
    ]
    for (const [input, message] of cases) {
      const res = await placeMcpOrder(input, '1.2.3.4')
      expect(res.ok).toBe(false)
      if (!res.ok) expect(res.error).toMatch(message)
    }
    expect(createCheckoutSession).not.toHaveBeenCalled()
    expect(addOrder).not.toHaveBeenCalled()
  })
})
