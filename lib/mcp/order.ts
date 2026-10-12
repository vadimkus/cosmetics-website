/**
 * Orders placed from an AI chat through /mcp (place_order tool).
 *
 * Same pipeline as website card checkout: server-side prices, a PENDING order and a
 * Stripe Checkout session. The Stripe webhook marks it paid and sends every email,
 * so an unpaid chat order is never fulfilled. Prices are always retail: the shopper
 * is not signed in, so an account's partner discount must not apply from a typed email.
 */

import { prisma } from '@/lib/prisma'
import { getProductById } from '@/lib/productsDb'
import { resolveCheckoutSelection } from '@/lib/checkoutSelection'
import { getCartLinePricing } from '@/lib/cartPricing'
import { calculateMobileShipping, calculateVatIncluded, MOBILE_CHECKOUT_CONFIG } from '@/lib/mobileCheckoutConfig'
import { generateUniqueOrderNumber } from '@/lib/orderNumber'
import { enhanceOrderItemWithDefaultSize } from '@/lib/orderSizeDefaults'
import { addOrder, type OrderData, type OrderItemData } from '@/lib/orderStorageDb'
import { createCheckoutSession, getCheckoutSession, aedToFils } from '@/lib/stripe'
import { findUserByEmail } from '@/lib/userStorageDb'
import { getPreferredEmail } from '@/lib/emailHelpers'
import { isValidEmail } from '@/lib/utils'
import { isValidCheckoutPhone } from '@/lib/checkoutPhone'
import { rateLimitSimple } from '@/lib/rateLimitSimple'
import { errorLog } from '@/lib/logger'
import { absoluteUrl, resolveSelection, type McpLocale } from '@/lib/mcp/catalog'
import type { CartItem } from '@/types'

export const MCP_ORDER_PREFIX = 'GENCardA'

// Each order hits Stripe and writes a row: keep it to what a real shopper needs.
const ipLimiter = rateLimitSimple({ name: 'mcp-order-ip', windowMs: 60 * 60 * 1000, max: 8 })
const emailLimiter = rateLimitSimple({ name: 'mcp-order-email', windowMs: 60 * 60 * 1000, max: 5 })

export interface McpOrderInput {
  items: Array<{ product_id: string; quantity?: number | undefined; size?: string | undefined; color?: string | undefined }>
  customer: {
    name: string
    email: string
    phone: string
    emirate: string
    address: string
  }
  notes?: string | undefined
  locale?: McpLocale | undefined
}

export type McpOrderResult =
  | {
      ok: true
      order_number: string
      pay_url: string
      reused: boolean
      items: Array<{ id: string; name: string; quantity: number; size: string | null; color: string | null; unit_price_aed: number; line_total_aed: number }>
      subtotal_aed: number
      delivery_aed: number
      total_aed: number
      vat_included_aed: number
    }
  | { ok: false; error: string }

function canonicalEmirate(value: string): string | null {
  const key = value.trim().toLowerCase().replace(/\s+/g, ' ')
  const aliases: Record<string, string> = { rak: 'Ras Al Khaimah', uaq: 'Umm Al Quwain', 'abudhabi': 'Abu Dhabi', dxb: 'Dubai', auh: 'Abu Dhabi', shj: 'Sharjah' }
  const alias = aliases[key.replace(/\s/g, '')]
  if (alias) return alias
  return MOBILE_CHECKOUT_CONFIG.emirates.find((e) => e.name.toLowerCase() === key)?.name ?? null
}

const round2 = (n: number) => Math.round(n * 100) / 100

export async function placeMcpOrder(input: McpOrderInput, clientIp: string): Promise<McpOrderResult> {
  const name = input.customer.name.trim()
  const email = input.customer.email.trim().toLowerCase()
  const phone = input.customer.phone.trim()
  const address = input.customer.address.trim()
  const emirate = canonicalEmirate(input.customer.emirate)
  const locale = input.locale || 'en'

  if (name.length < 2) return { ok: false, error: 'The full name of the person receiving the order is needed.' }
  if (!isValidEmail(email)) return { ok: false, error: 'A valid email is needed: the receipt and order updates go there.' }
  if (!isValidCheckoutPhone(phone)) {
    return { ok: false, error: 'A valid phone number is needed for the courier: a UAE number (050 123 4567) or one with its country code (+44 7700 900123).' }
  }
  if (!emirate) {
    return { ok: false, error: `Delivery is UAE only. Emirate must be one of: ${MOBILE_CHECKOUT_CONFIG.emirates.map((e) => e.name).join(', ')}.` }
  }
  if (address.length < 8) return { ok: false, error: 'A full delivery address is needed (building or villa, street, area).' }
  if (input.items.length === 0) return { ok: false, error: 'The order has no items.' }

  const ipCheck = await ipLimiter(clientIp)
  if (!ipCheck.success) return { ok: false, error: 'Too many orders from this connection. Please try again later or order on genosys.ae.' }
  const emailCheck = await emailLimiter(email)
  if (!emailCheck.success) return { ok: false, error: 'Too many orders for this email in the last hour. Please check your inbox or contact GENOSYS on WhatsApp +971 58 548 76 65.' }

  const priced: Array<{ cart: CartItem; unitPrice: number; lineTotal: number }> = []
  for (const item of input.items) {
    const product = await getProductById(item.product_id)
    if (!product || product.isHidden) return { ok: false, error: `No GENOSYS product with id "${item.product_id}".` }
    if (!product.inStock) return { ok: false, error: `${product.name} is out of stock right now.` }
    if (product.isPriceOnRequest) {
      return { ok: false, error: `${product.name} is a professional product sold on request: contact GENOSYS on WhatsApp +971 58 548 76 65.` }
    }
    const picked = resolveSelection(product, item.size, item.color)
    if (!picked.ok) return { ok: false, error: picked.error }
    const selection = resolveCheckoutSelection(product, picked.size || '', picked.color || '')
    if (!selection.ok) return { ok: false, error: `${product.name}: choose one of ${selection.options.join(', ')}.` }
    const quantity = Math.min(Math.max(Math.round(item.quantity ?? 1), 1), 20)
    const cart: CartItem = {
      product,
      quantity,
      ...(selection.selectedColor ? { selectedColor: selection.selectedColor } : {}),
      ...(selection.selectedSize ? { selectedSize: selection.selectedSize } : {}),
    }
    const pricing = getCartLinePricing(cart, null)
    priced.push({ cart, unitPrice: pricing.unitPrice, lineTotal: pricing.lineTotal })
  }

  const subtotal = round2(priced.reduce((sum, p) => sum + p.lineTotal, 0))
  const shipping = calculateMobileShipping(subtotal, emirate)
  const total = round2(subtotal + shipping)
  const vat = calculateVatIncluded(total)

  const summary = {
    items: priced.map((p) => ({
      id: p.cart.product.productNumber || p.cart.product.id,
      name: p.cart.product.name,
      quantity: p.cart.quantity,
      size: p.cart.selectedSize || null,
      color: p.cart.selectedColor || null,
      unit_price_aed: p.unitPrice,
      line_total_aed: round2(p.lineTotal),
    })),
    subtotal_aed: subtotal,
    delivery_aed: shipping,
    total_aed: total,
    vat_included_aed: vat,
  }

  // A retry from the chat (same shopper, same total, still unpaid) gets the same payment page.
  const recent = await prisma.order.findFirst({
    where: {
      customerEmail: { equals: email, mode: 'insensitive' },
      orderNumber: { startsWith: MCP_ORDER_PREFIX },
      paymentStatus: 'pending',
      total,
      createdAt: { gte: new Date(Date.now() - 30 * 60 * 1000) },
    },
    orderBy: { createdAt: 'desc' },
  })
  if (recent?.stripeSessionId) {
    try {
      const existing = await getCheckoutSession(recent.stripeSessionId)
      if (existing.status === 'open' && existing.url) {
        return { ok: true, order_number: recent.orderNumber, pay_url: existing.url, reused: true, ...summary }
      }
    } catch (error) {
      errorLog('[MCP_ORDER] could not reuse session', error)
    }
  }

  const user = await findUserByEmail(email)
  const emailForStripe = user ? getPreferredEmail(user) : email
  const orderNumber = await generateUniqueOrderNumber({ channel: 'A', payment: 'CARD' })

  const orderItems: OrderItemData[] = priced.map((p) => {
    const enhanced = enhanceOrderItemWithDefaultSize({
      productName: p.cart.product.name,
      size: p.cart.selectedSize || null,
      color: p.cart.selectedColor || null,
    })
    return {
      productId: p.cart.product.id,
      productName: p.cart.product.name,
      price: p.unitPrice,
      quantity: p.cart.quantity,
      image: p.cart.product.image,
      color: enhanced.color || '',
      size: enhanced.size || '',
    }
  })

  const lineItems = priced.map((p) => {
    const image = absoluteUrl(p.cart.product.image)
    return {
      price_data: {
        currency: 'aed',
        product_data: {
          name: [p.cart.product.name, p.cart.selectedSize, p.cart.selectedColor].filter(Boolean).join(' · '),
          description: String(p.cart.product.description || p.cart.product.name).substring(0, 300),
          metadata: { product_id: p.cart.product.id, color: p.cart.selectedColor || '', size: p.cart.selectedSize || '' },
          ...(image ? { images: [image] } : {}),
        },
        unit_amount: aedToFils(p.unitPrice),
      },
      quantity: p.cart.quantity,
    }
  })
  if (shipping > 0) {
    lineItems.push({
      price_data: {
        currency: 'aed',
        product_data: { name: `Shipping to ${emirate}`, description: 'Standard delivery', metadata: { product_id: '', color: '', size: '' } },
        unit_amount: aedToFils(shipping),
      },
      quantity: 1,
    })
  }

  const session = await createCheckoutSession({
    lineItems,
    customerEmail: emailForStripe,
    customerName: name,
    customerPhone: phone,
    shippingAddress: { line1: address, city: emirate, country: 'AE' },
    orderNumber,
    locale,
  })
  if (!session.url) return { ok: false, error: 'The payment page could not be created. Please try again in a minute.' }

  const order: OrderData = {
    orderNumber,
    customerEmail: email,
    customerName: name,
    customerPhone: phone,
    customerEmirate: emirate,
    customerAddress: address,
    ...(input.notes?.trim() ? { orderNotes: input.notes.trim().slice(0, 1000) } : {}),
    items: orderItems,
    subtotal,
    discountPercentage: 0,
    discountAmount: 0,
    bundleDiscountAmount: 0,
    shipping,
    vat,
    total,
    status: 'PENDING',
    paymentMethod: 'stripe',
    paymentStatus: 'pending',
    stripeSessionId: session.id,
    paymentMetadata: JSON.stringify({ source: 'ai_assistant', via: 'mcp' }),
    locale,
  }
  await addOrder(order)

  return { ok: true, order_number: orderNumber, pay_url: session.url, reused: false, ...summary }
}

export async function getMcpOrderStatus(orderNumber: string, email: string) {
  const order = await prisma.order.findFirst({
    where: {
      orderNumber: orderNumber.trim(),
      customerEmail: { equals: email.trim(), mode: 'insensitive' },
    },
    include: { items: true },
  })
  if (!order) return null
  return {
    order_number: order.orderNumber,
    status: order.status,
    payment: order.paymentStatus,
    total_aed: order.total,
    placed_at: order.createdAt.toISOString(),
    paid_at: order.paidAt?.toISOString() ?? null,
    delivered_at: order.deliveredAt?.toISOString() ?? null,
    items: order.items.map((i) => ({ name: i.productName, quantity: i.quantity, size: i.size || null, color: i.color || null })),
  }
}
