import { NextRequest, NextResponse, after } from 'next/server'
import { cookies } from 'next/headers'
import { verifySessionToken } from '@/lib/jwt'
import { findUserByEmail } from '@/lib/userStorageDb'
import { getProductById } from '@/lib/productsDb'
import { calculateDiscountedPrice } from '@/lib/discountUtils'
import { addOrder, OrderData, OrderItemData } from '@/lib/orderStorageDb'
import { generateUniquePartnerOrderNumber } from '@/lib/orderNumber'
import { calculateVatIncluded } from '@/lib/mobileCheckoutConfig'
import { getPreferredEmail } from '@/lib/emailHelpers'
import { sendAdminNewOrderNotification, sendOrderConfirmationEmail } from '@/lib/email'
import type { OrderConfirmationEmailData } from '@/lib/email/types'
import { createPaymentIntent } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import { requireCsrfToken } from '@/lib/csrf'
import { rateLimitSimple, getClientIdentifierFromNextRequest } from '@/lib/rateLimitSimple'
import { debugLog, errorLog } from '@/lib/logger'

export const runtime = 'nodejs'

// A partner is a logged-in user flagged as a clinic/wholesale account.
function isPartner(user: { discountType?: string | null } | null): boolean {
  const t = String(user?.discountType || '').toUpperCase()
  return t === 'CLINIC' || t === 'VIP'
}

interface SubmittedPartnerItem {
  id: string
  quantity: number
  size?: string
  color?: string
}

const partnerLimiter = rateLimitSimple({ windowMs: 10 * 60 * 1000, max: 10 })

export async function POST(request: NextRequest) {
  // CSRF protection (same pattern as retail checkout)
  const csrfCheck = await requireCsrfToken(request)
  if (!csrfCheck.valid) {
    return csrfCheck.response!
  }

  // Abuse protection
  const rl = await partnerLimiter(`partner-order:${getClientIdentifierFromNextRequest(request)}`)
  if (!rl.success) {
    return NextResponse.json({ error: rl.message || 'Too many requests' }, { status: 429 })
  }

  try {
    // ---- Auth: must be a logged-in partner account ----
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('genosys_session')
    const session = sessionCookie?.value ? verifySessionToken(sessionCookie.value) : null
    if (!session?.email) {
      return NextResponse.json({ error: 'Please log in.' }, { status: 401 })
    }

    const user = await findUserByEmail(session.email)
    if (!user) {
      return NextResponse.json({ error: 'Account not found.' }, { status: 401 })
    }
    if (!isPartner(user)) {
      return NextResponse.json({ error: 'Partner access only.' }, { status: 403 })
    }

    const body = await request.json()
    const submitted: SubmittedPartnerItem[] = Array.isArray(body?.items) ? body.items : []
    if (submitted.length === 0) {
      return NextResponse.json({ error: 'No items in order.' }, { status: 400 })
    }

    // Payment option: consignment (only if agreement active) | online | cod.
    const rawOption = String(body?.paymentOption || 'cod').toLowerCase()
    const paymentOption: 'consignment' | 'online' | 'cod' =
      rawOption === 'consignment' ? 'consignment' : rawOption === 'online' ? 'online' : 'cod'
    if (paymentOption === 'consignment' && !user.consignmentActive) {
      return NextResponse.json({ error: 'No active consignment agreement on this account.' }, { status: 403 })
    }

    const orderNotesInput =
      typeof body?.orderNotes === 'string' && body.orderNotes.trim()
        ? body.orderNotes.trim().slice(0, 1000)
        : ''
    const emirate =
      typeof body?.emirate === 'string' && body.emirate.trim()
        ? body.emirate.trim()
        : (user.address ? 'Dubai' : 'Dubai')

    // ---- Server-side pricing (never trust client prices) ----
    let subtotal = 0
    const orderItems: OrderItemData[] = []
    const emailItems: OrderConfirmationEmailData['items'] = []

    for (const line of submitted) {
      const productId = String(line?.id || '').trim()
      const quantity = Math.floor(Number(line?.quantity) || 0)
      if (!productId || quantity <= 0) {
        return NextResponse.json({ error: 'Invalid order line.' }, { status: 400 })
      }

      const product = await getProductById(productId)
      if (!product) {
        return NextResponse.json({ error: `Product not found: ${productId}` }, { status: 400 })
      }

      const size = line.size ? String(line.size) : undefined
      const color = line.color ? String(line.color) : undefined

      // Size/color variant selected → the variant's price is the retail base
      // (e.g. CERABARRIER 200ml vs 600ml). Discount applies on top of it.
      const variant = (size || color)
        ? (product.variants || []).find(v =>
            (size ? String(v.size || '') === size : true) &&
            (color ? String(v.color || '') === color : true))
        : undefined

      // Partner price = this account's own discount off retail (existing
      // accounts keep their negotiated %, new partner accounts default to 50%).
      const pricing = calculateDiscountedPrice(
        variant ? ({ ...product, price: variant.price } as typeof product) : product,
        user
      )
      const unitPrice = pricing.discountedPrice
      const lineTotal = Math.round(unitPrice * quantity * 100) / 100
      subtotal += lineTotal
      orderItems.push({
        productId: product.id,
        productName: product.name,
        price: unitPrice,
        quantity,
        image: product.image || '/images/placeholder.jpg',
        ...(size ? { size } : {}),
        ...(color ? { color } : {}),
      })
      emailItems.push({
        productName: product.name,
        quantity,
        price: unitPrice,
        image: product.image || '/images/placeholder.jpg',
        ...(size ? { size } : {}),
        ...(color ? { color } : {}),
        ...(pricing.hasDiscount ? { originalPrice: pricing.originalPrice, discountLabel: `${Math.round(pricing.discountPercentage)}% OFF` } : {}),
      })
    }

    subtotal = Math.round(subtotal * 100) / 100
    const shipping = 0
    const total = subtotal
    const vat = calculateVatIncluded(total)
    const discountPct = Number(user.discountPercentage || 0)

    const orderNumber = await generateUniquePartnerOrderNumber({ channel: 'W' })

    // Mark clearly as a partner order. paymentMethod keeps "partner" so existing
    // detection (badge/email) still matches; the settlement type is appended.
    const paymentMethodByOption: Record<typeof paymentOption, string> = {
      consignment: 'partner_consignment',
      online: 'partner_online', // "online" keyword → app shows Pay/resume for abandoned checkouts
      cod: 'partner_cod',
    }
    const settlementLabel = paymentOption === 'consignment'
      ? 'CONSIGNMENT STOCK (settle via monthly report)'
      : paymentOption === 'online' ? 'ONLINE CARD PAYMENT' : 'CASH ON DELIVERY'
    const partnerTag = `PARTNER ORDER — ${user.name || user.email}\nSettlement: ${settlementLabel}`
    const orderNotes = orderNotesInput ? `${partnerTag}\n${orderNotesInput}` : partnerTag

    const dbOrder: OrderData = {
      orderNumber,
      customerEmail: user.email,
      customerName: user.name || user.email,
      customerPhone: user.phone || '',
      customerEmirate: emirate,
      customerAddress: user.address || 'Partner account',
      orderNotes,
      items: orderItems,
      subtotal,
      discountPercentage: discountPct > 0 ? discountPct : 0,
      discountAmount: 0,
      shipping,
      vat,
      total,
      status: 'PENDING',
      paymentMethod: paymentMethodByOption[paymentOption],
      paymentStatus: 'pending',
      locale: typeof body?.locale === 'string' ? body.locale : 'en',
    }

    let savedOrderId = 'pending'
    try {
      const saved = await addOrder(dbOrder)
      savedOrderId = saved.id
      debugLog('✅ Partner order saved:', orderNumber, saved.id, paymentOption)
    } catch (dbError) {
      errorLog('❌ Partner order DB save failed:', dbError)
      return NextResponse.json({ error: 'Could not save order. Please try again.' }, { status: 500 })
    }

    // Online payment: create a PaymentIntent so the client can render the
    // embedded Stripe Payment Element in a bottom sheet on the same page
    // (no redirect to hosted checkout). The webhook marks the order paid
    // via stripePaymentIntentId on payment_intent.succeeded.
    let clientSecret: string | null = null
    if (paymentOption === 'online') {
      try {
        const paymentIntent = await createPaymentIntent({
          amount: total,
          customerEmail: user.email,
          customerName: user.name || user.email,
          customerPhone: user.phone || '',
          customerEmirate: emirate,
          orderNumber,
          locale: typeof body?.locale === 'string' ? body.locale : 'en',
          description: `Partner order ${orderNumber}`,
        })
        clientSecret = paymentIntent.client_secret
        await prisma.order.update({
          where: { id: savedOrderId },
          data: {
            stripePaymentIntentId: paymentIntent.id,
            paymentMetadata: JSON.stringify({ paymentIntentId: paymentIntent.id, source: 'partner_web', createdAt: new Date().toISOString() }),
          },
        })
      } catch (payErr) {
        errorLog('❌ Partner online payment intent failed:', orderNumber, payErr)
        // Order still exists as pending; report so the client can fall back.
        return NextResponse.json({ success: true, orderNumber, orderId: savedOrderId, total, paymentOption, clientSecret: null, paymentError: true })
      }
    }

    // Notify admin (Vadim) — same channel as retail orders. He then pushes to MoySklad.
    after(async () => {
      try {
        await sendAdminNewOrderNotification({
          orderNumber,
          customerName: user.name || user.email,
          customerEmail: getPreferredEmail(user),
          customerPhone: user.phone || 'N/A',
          total,
          itemCount: orderItems.length,
          items: orderItems.map(item => ({
            productName: item.productName,
            quantity: item.quantity,
            price: item.price,
            image: item.image || '/images/default-product.jpg',
            ...(item.size ? { size: item.size } : {}),
            ...(item.color ? { color: item.color } : {}),
          })),
          subtotal,
          shipping,
          vat,
          emirate,
          paymentStatus: 'PENDING',
          paymentMethod: `Partner — ${settlementLabel}`,
          discountPercentage: discountPct > 0 ? discountPct : undefined,
        })
        debugLog('✅ Admin notified of partner order:', orderNumber)
      } catch (emailError) {
        errorLog('❌ Failed to notify admin of partner order:', orderNumber, emailError)
      }

      // Confirmation to the partner themselves.
      try {
        await sendOrderConfirmationEmail({
          orderNumber,
          customerName: user.name || user.email,
          customerEmail: getPreferredEmail(user),
          items: emailItems,
          subtotal,
          shipping,
          vat,
          total,
          address: user.address || 'Partner account',
          emirate,
          ...(discountPct > 0 ? { discountPercentage: discountPct } : {}),
          locale: typeof body?.locale === 'string' ? body.locale : 'en',
        })
        debugLog('✅ Partner order confirmation sent:', orderNumber)
      } catch (emailError) {
        errorLog('❌ Failed to send partner confirmation:', orderNumber, emailError)
      }
    })

    return NextResponse.json({
      success: true,
      orderNumber,
      orderId: savedOrderId,
      total,
      paymentOption,
      clientSecret,
    })
  } catch (error) {
    errorLog('❌ Partner order error:', error)
    return NextResponse.json({ error: 'Failed to create partner order.' }, { status: 500 })
  }
}
