/**
 * Meta Conversions API (server side) for website purchases.
 *
 * Sends one Purchase per order with `event_id: purchase_<orderNumber>`, the same
 * id the browser pixel uses, so Meta counts the sale once. Only runs when
 * META_CAPI_ACCESS_TOKEN is set and the buyer accepted cookies at checkout.
 * Customer email, phone and city are SHA-256 hashed before they leave the server.
 */
import { createHash } from 'crypto'
import type { NextRequest } from 'next/server'
import { errorLog, debugLog } from '@/lib/logger'
import { META_PIXEL_ID, metaPurchaseEventId } from '@/lib/metaPixel'

const GRAPH_VERSION = process.env.META_GRAPH_VERSION || 'v24.0'

export interface MetaAttribution {
  fbp?: string | undefined
  fbc?: string | undefined
  ip?: string | undefined
  ua?: string | undefined
  url?: string | undefined
}

const sha256 = (value: string) => createHash('sha256').update(value).digest('hex')

/** UAE numbers to E.164 digits without '+': 0501234567 / 501234567 / +971 50… → 971501234567. */
export function normalizeUaePhone(raw: string | null | undefined): string | null {
  let digits = String(raw || '').replace(/\D/g, '')
  if (!digits) return null
  if (digits.startsWith('00')) digits = digits.slice(2)
  if (digits.startsWith('0') && digits.length === 10) digits = `971${digits.slice(1)}`
  else if (digits.length === 9 && digits.startsWith('5')) digits = `971${digits}`
  return digits.length >= 8 ? digits : null
}

export function hashedUserData(customer: { email?: string | null | undefined; phone?: string | null | undefined; emirate?: string | null | undefined }) {
  const email = String(customer.email || '').trim().toLowerCase()
  const phone = normalizeUaePhone(customer.phone)
  const city = String(customer.emirate || '').toLowerCase().replace(/[^a-z]/g, '')
  return {
    ...(email && email.includes('@') ? { em: [sha256(email)] } : {}),
    ...(phone ? { ph: [sha256(phone)] } : {}),
    ...(city ? { ct: [sha256(city)] } : {}),
    country: [sha256('ae')],
  }
}

/** Attribution for the buyer behind this request, or null without cookie consent. */
export function readMetaAttribution(request: NextRequest, consent: unknown): MetaAttribution | null {
  if (consent !== true) return null
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || undefined
  return {
    fbp: request.cookies.get('_fbp')?.value || undefined,
    fbc: request.cookies.get('_fbc')?.value || undefined,
    ip,
    ua: request.headers.get('user-agent') || undefined,
    url: request.headers.get('referer') || undefined,
  }
}

/** Stripe metadata values are capped at 500 characters. */
export function attributionToStripeMetadata(a: MetaAttribution | null): Record<string, string> {
  if (!a) return {}
  const out: Record<string, string> = { meta_consent: '1' }
  if (a.fbp) out.meta_fbp = a.fbp.slice(0, 500)
  if (a.fbc) out.meta_fbc = a.fbc.slice(0, 500)
  if (a.ip) out.meta_ip = a.ip.slice(0, 500)
  if (a.ua) out.meta_ua = a.ua.slice(0, 500)
  if (a.url) out.meta_url = a.url.slice(0, 500)
  return out
}

export function attributionFromStripeMetadata(md: Record<string, string> | null | undefined): MetaAttribution | null {
  if (!md || md.meta_consent !== '1') return null
  return { fbp: md.meta_fbp, fbc: md.meta_fbc, ip: md.meta_ip, ua: md.meta_ua, url: md.meta_url }
}

export interface MetaPurchaseOrder {
  orderNumber: string
  total: number
  customerEmail?: string | null | undefined
  customerPhone?: string | null | undefined
  customerEmirate?: string | null | undefined
  items: Array<{ id: string; quantity: number; price: number }>
  createdAt?: Date | undefined
}

export function buildPurchaseEvent(order: MetaPurchaseOrder, a: MetaAttribution) {
  const paid = order.items.filter((it) => it.price > 0)
  return {
    event_name: 'Purchase',
    event_time: Math.floor((order.createdAt ?? new Date()).getTime() / 1000),
    event_id: metaPurchaseEventId(order.orderNumber),
    action_source: 'website',
    ...(a.url ? { event_source_url: a.url } : {}),
    user_data: {
      ...hashedUserData({ email: order.customerEmail, phone: order.customerPhone, emirate: order.customerEmirate }),
      ...(a.ip ? { client_ip_address: a.ip } : {}),
      ...(a.ua ? { client_user_agent: a.ua } : {}),
      ...(a.fbp ? { fbp: a.fbp } : {}),
      ...(a.fbc ? { fbc: a.fbc } : {}),
    },
    custom_data: {
      currency: 'AED',
      value: Math.round(order.total * 100) / 100,
      order_id: order.orderNumber,
      content_type: 'product',
      content_ids: paid.map((it) => it.id),
      contents: paid.map((it) => ({ id: it.id, quantity: it.quantity, item_price: it.price })),
      num_items: paid.reduce((n, it) => n + it.quantity, 0),
    },
  }
}

/** Best-effort: never throws, never blocks checkout for longer than 4 s. */
export async function sendMetaPurchase(order: MetaPurchaseOrder, a: MetaAttribution | null): Promise<void> {
  const token = process.env.META_CAPI_ACCESS_TOKEN
  if (!token || !a) return
  const body = {
    data: [buildPurchaseEvent(order, a)],
    ...(process.env.META_CAPI_TEST_EVENT_CODE ? { test_event_code: process.env.META_CAPI_TEST_EVENT_CODE } : {}),
  }
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 4000)
  try {
    const res = await fetch(`https://graph.facebook.com/${GRAPH_VERSION}/${META_PIXEL_ID}/events?access_token=${encodeURIComponent(token)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    })
    if (!res.ok) errorLog('Meta CAPI Purchase rejected:', order.orderNumber, res.status, (await res.text()).slice(0, 300))
    else debugLog('Meta CAPI Purchase sent:', order.orderNumber)
  } catch (error) {
    errorLog('Meta CAPI Purchase failed:', order.orderNumber, error)
  } finally {
    clearTimeout(timer)
  }
}
