/**
 * @jest-environment node
 */
import { createHash } from 'crypto'
import type { NextRequest } from 'next/server'
import {
  attributionFromStripeMetadata,
  attributionToStripeMetadata,
  buildPurchaseEvent,
  hashedUserData,
  normalizeUaePhone,
  readMetaAttribution,
  sendMetaPurchase,
} from '@/lib/metaCapi'

const sha = (v: string) => createHash('sha256').update(v).digest('hex')

function fakeRequest(headers: Record<string, string>, cookies: Record<string, string>): NextRequest {
  return {
    headers: new Headers(headers),
    cookies: { get: (name: string) => (name in cookies ? { name, value: cookies[name] } : undefined) },
  } as unknown as NextRequest
}

describe('normalizeUaePhone', () => {
  it.each([
    ['0501234567', '971501234567'],
    ['501234567', '971501234567'],
    ['+971 50 123 4567', '971501234567'],
    ['00971501234567', '971501234567'],
    ['+7 916 123-45-67', '79161234567'],
  ])('%s -> %s', (raw, out) => expect(normalizeUaePhone(raw)).toBe(out))

  it('drops empty and junk numbers', () => {
    expect(normalizeUaePhone('')).toBeNull()
    expect(normalizeUaePhone('N/A')).toBeNull()
    expect(normalizeUaePhone('123')).toBeNull()
  })
})

describe('hashedUserData', () => {
  it('hashes normalised email, phone, city and country', () => {
    const u = hashedUserData({ email: ' Buyer@Example.com ', phone: '050 123 4567', emirate: 'Abu Dhabi' })
    expect(u.em).toEqual([sha('buyer@example.com')])
    expect(u.ph).toEqual([sha('971501234567')])
    expect(u.ct).toEqual([sha('abudhabi')])
    expect(u.country).toEqual([sha('ae')])
  })
})

describe('readMetaAttribution', () => {
  const req = fakeRequest(
    { 'x-forwarded-for': '94.200.1.2, 10.0.0.1', 'user-agent': 'UA', referer: 'https://genosys.ae/checkout' },
    { _fbp: 'fb.1.1.2', _fbc: 'fb.1.1.abc' },
  )

  it('returns nothing without cookie consent', () => {
    expect(readMetaAttribution(req, false)).toBeNull()
    expect(readMetaAttribution(req, undefined)).toBeNull()
    expect(readMetaAttribution(req, 'true')).toBeNull()
  })

  it('reads cookies, first forwarded IP, user agent and page', () => {
    expect(readMetaAttribution(req, true)).toEqual({
      fbp: 'fb.1.1.2', fbc: 'fb.1.1.abc', ip: '94.200.1.2', ua: 'UA', url: 'https://genosys.ae/checkout',
    })
  })

  it('survives a round trip through Stripe metadata', () => {
    const a = readMetaAttribution(req, true)
    expect(attributionFromStripeMetadata(attributionToStripeMetadata(a))).toEqual(a)
    expect(attributionToStripeMetadata(null)).toEqual({})
    expect(attributionFromStripeMetadata({ orderNumber: 'X' })).toBeNull()
  })
})

describe('buildPurchaseEvent', () => {
  const event = buildPurchaseEvent({
    orderNumber: 'GENCardW2610020001',
    total: 600,
    customerEmail: 'a@b.ae',
    customerPhone: '0501234567',
    customerEmirate: 'Dubai',
    items: [{ id: '41', quantity: 2, price: 300 }, { id: 'mask', quantity: 1, price: 0 }],
    createdAt: new Date('2026-10-02T10:00:00Z'),
  }, { fbp: 'fb.1.1.2', ip: '94.200.1.2', ua: 'UA', url: 'https://genosys.ae/checkout' })

  it('shares the browser event id and uses website source', () => {
    expect(event.event_id).toBe('purchase_GENCardW2610020001')
    expect(event.event_name).toBe('Purchase')
    expect(event.action_source).toBe('website')
    expect(event.event_time).toBe(1790935200)
  })

  it('counts paid items only', () => {
    expect(event.custom_data).toMatchObject({
      currency: 'AED', value: 600, content_ids: ['41'], num_items: 2,
      contents: [{ id: '41', quantity: 2, item_price: 300 }],
    })
  })
})

describe('sendMetaPurchase', () => {
  const order = { orderNumber: 'X1', total: 300, items: [{ id: '41', quantity: 1, price: 300 }] }
  const realFetch = global.fetch

  afterEach(() => {
    global.fetch = realFetch
    delete process.env.META_CAPI_ACCESS_TOKEN
  })

  it('sends nothing without a token or without consent', async () => {
    const spy = jest.fn()
    global.fetch = spy as unknown as typeof fetch
    await sendMetaPurchase(order, { ip: '1.2.3.4' })
    process.env.META_CAPI_ACCESS_TOKEN = 'token'
    await sendMetaPurchase(order, null)
    expect(spy).not.toHaveBeenCalled()
  })

  it('posts one Purchase to the dataset', async () => {
    process.env.META_CAPI_ACCESS_TOKEN = 'token'
    const spy = jest.fn().mockResolvedValue({ ok: true, text: async () => '' })
    global.fetch = spy as unknown as typeof fetch
    await sendMetaPurchase(order, { ip: '1.2.3.4' })
    expect(spy).toHaveBeenCalledTimes(1)
    const [url, init] = spy.mock.calls[0]
    expect(url).toContain('/1644419117314458/events?access_token=token')
    expect(JSON.parse(init.body).data[0].event_id).toBe('purchase_X1')
  })

  it('never throws when Meta is down', async () => {
    process.env.META_CAPI_ACCESS_TOKEN = 'token'
    global.fetch = jest.fn().mockRejectedValue(new Error('offline')) as unknown as typeof fetch
    await expect(sendMetaPurchase(order, { ip: '1.2.3.4' })).resolves.toBeUndefined()
  })
})
