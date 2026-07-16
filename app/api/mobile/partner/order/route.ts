import { NextRequest, NextResponse, after } from 'next/server'
import { validateMobileAuth, extractTokenFromHeader } from '@/lib/jwt'
import { findUserByEmail } from '@/lib/userStorageDb'
import { getProductById } from '@/lib/productsDb'
import { canonicalOrderItemImage, ORDER_ITEM_IMAGE_FALLBACK } from '@/lib/orderItemImage'
import { calculateDiscountedPrice } from '@/lib/discountUtils'
import { addOrder, OrderData, OrderItemData } from '@/lib/orderStorageDb'
import { consignmentBlockReason, isValidCreditDays } from '@/lib/partnerCatalog'
import { generateUniquePartnerOrderNumber } from '@/lib/orderNumber'
import { calculateVatIncluded } from '@/lib/mobileCheckoutConfig'
import { getPreferredEmail } from '@/lib/emailHelpers'
import { sendAdminNewOrderNotification, sendOrderConfirmationEmail } from '@/lib/email'
import type { OrderConfirmationEmailData } from '@/lib/email/types'
import { createOrderCheckoutSession } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import { debugLog, errorLog } from '@/lib/logger'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-api-key',
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS })
}

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

/**
 * Mobile (Apple/Android app) partner-order endpoint.
 * Same logic as the cookie-based /api/partners/order, but authenticated with
 * the app's `x-api-key` + `Authorization: Bearer <token>` (no cookies). Ships
 * via Vercel deploy — the app screen that calls it ships via Expo OTA.
 */
export async function POST(request: NextRequest) {
  try {
    const apiKey = request.headers.get('x-api-key')
    const token = extractTokenFromHeader(request.headers.get('Authorization'))
    const auth = validateMobileAuth(apiKey, token)
    if (!auth.valid || !auth.payload) {
      return NextResponse.json(
        { success: false, error: auth.error || 'Authentication required' },
        { status: auth.status || 401, headers: CORS }
      )
    }

    const user = await findUserByEmail(auth.payload.email)
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404, headers: CORS })
    }
    if (!isPartner(user)) {
      return NextResponse.json({ success: false, error: 'Partner access only' }, { status: 403, headers: CORS })
    }

    const body = await request.json()
    const submitted: SubmittedPartnerItem[] = Array.isArray(body?.items) ? body.items : []
    if (submitted.length === 0) {
      return NextResponse.json({ success: false, error: 'No items in order' }, { status: 400, headers: CORS })
    }

    const rawOption = String(body?.paymentOption || 'cod').toLowerCase()
    const paymentOption: 'consignment' | 'credit' | 'online' | 'cod' =
      rawOption === 'consignment' ? 'consignment'
      : rawOption === 'credit' ? 'credit'
      : rawOption === 'online' ? 'online' : 'cod'
    if (paymentOption === 'consignment' && !user.consignmentActive) {
      return NextResponse.json({ success: false, error: 'No active consignment agreement on this account.' }, { status: 403, headers: CORS })
    }
    const creditDays = Number(user.creditDays || 0)
    if (paymentOption === 'credit' && (!user.creditActive || !isValidCreditDays(creditDays))) {
      return NextResponse.json({ success: false, error: 'No active credit terms on this account.' }, { status: 403, headers: CORS })
    }

    const orderNotesInput =
      typeof body?.orderNotes === 'string' && body.orderNotes.trim() ? body.orderNotes.trim().slice(0, 1000) : ''
    const emirate = typeof body?.emirate === 'string' && body.emirate.trim() ? body.emirate.trim() : 'Dubai'

    let subtotal = 0
    const orderItems: OrderItemData[] = []
    const emailItems: OrderConfirmationEmailData['items'] = []

    for (const line of submitted) {
      const productId = String(line?.id || '').trim()
      const quantity = Math.floor(Number(line?.quantity) || 0)
      if (!productId || quantity <= 0) {
        return NextResponse.json({ success: false, error: 'Invalid order line' }, { status: 400, headers: CORS })
      }
      const product = await getProductById(productId)
      if (!product) {
        return NextResponse.json({ success: false, error: `Product not found: ${productId}` }, { status: 400, headers: CORS })
      }
      const size = line.size ? String(line.size) : undefined
      const color = line.color ? String(line.color) : undefined
      // Consignment stock is retail products only — professional sizes,
      // PRO Solutions and equipment must go on credit/paid orders.
      if (paymentOption === 'consignment') {
        const blocked = consignmentBlockReason(product, size)
        if (blocked) {
          return NextResponse.json({ success: false, error: blocked }, { status: 403, headers: CORS })
        }
      }
      // Size/color variant selected → the variant's price is the retail base
      // (e.g. CERABARRIER 200ml vs 600ml). Discount applies on top of it.
      const variant = (size || color)
        ? (product.variants || []).find(v =>
            (size ? String(v.size || '') === size : true) &&
            (color ? String(v.color || '') === color : true))
        : undefined
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
        image: canonicalOrderItemImage(product),
        ...(size ? { size } : {}),
        ...(color ? { color } : {}),
      })
      emailItems.push({
        productName: product.name,
        quantity,
        price: unitPrice,
        image: canonicalOrderItemImage(product),
        ...(size ? { size } : {}),
        ...(color ? { color } : {}),
        ...(pricing.hasDiscount ? { originalPrice: pricing.originalPrice, discountLabel: `${Math.round(pricing.discountPercentage)}% OFF` } : {}),
      })
    }

    subtotal = Math.round(subtotal * 100) / 100
    const shipping = 0
    const total = subtotal
    const vat = calculateVatIncluded(total)
    const orderNumber = await generateUniquePartnerOrderNumber({ channel: 'M' })

    const paymentMethodByOption: Record<typeof paymentOption, string> = {
      consignment: 'partner_consignment',
      credit: 'partner_credit',
      online: 'partner_online', // "online" keyword → app shows Pay/resume for abandoned checkouts
      cod: 'partner_cod',
    }
    const paymentDueDate = paymentOption === 'credit'
      ? new Date(Date.now() + creditDays * 24 * 60 * 60 * 1000)
      : undefined
    const settlementLabel = paymentOption === 'consignment'
      ? 'CONSIGNMENT STOCK (settle via monthly report)'
      : paymentOption === 'credit'
        ? `CREDIT ${creditDays} DAYS (due ${paymentDueDate!.toLocaleDateString('en-GB')})`
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
      discountPercentage: Number(user.discountPercentage || 0),
      discountAmount: 0,
      shipping,
      vat,
      total,
      status: 'PENDING',
      paymentMethod: paymentMethodByOption[paymentOption],
      paymentStatus: 'pending',
      locale: typeof body?.locale === 'string' ? body.locale : 'en',
      ...(paymentOption === 'credit' && paymentDueDate ? { creditDays, paymentDueDate } : {}),
    }

    let savedOrderId = 'pending'
    try {
      const saved = await addOrder(dbOrder)
      savedOrderId = saved.id
      debugLog('✅ Mobile partner order saved:', orderNumber, saved.id, paymentOption)
    } catch (dbError) {
      errorLog('❌ Mobile partner order DB save failed:', dbError)
      return NextResponse.json({ success: false, error: 'Could not save order' }, { status: 500, headers: CORS })
    }

    // Online payment: hosted Stripe Checkout URL for the app to open.
    let paymentUrl: string | null = null
    if (paymentOption === 'online') {
      try {
        const session = await createOrderCheckoutSession({
          order: {
            id: savedOrderId,
            orderNumber,
            customerEmail: user.email,
            customerName: user.name || user.email,
            customerPhone: user.phone || '',
            total,
            items: orderItems,
          },
          source: 'mobile_app',
        })
        paymentUrl = session.url
        await prisma.order.update({
          where: { id: savedOrderId },
          data: {
            stripeSessionId: session.id,
            paymentMetadata: JSON.stringify({ sessionUrl: session.url, source: 'mobile_app', createdAt: new Date().toISOString() }),
          },
        })
      } catch (payErr) {
        errorLog('❌ Mobile partner online payment session failed:', orderNumber, payErr)
        return NextResponse.json({ success: true, orderNumber, orderId: savedOrderId, total, paymentOption, paymentUrl: null, paymentError: true }, { headers: CORS })
      }
    }

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
            image: item.image || ORDER_ITEM_IMAGE_FALLBACK,
            ...(item.size ? { size: item.size } : {}),
            ...(item.color ? { color: item.color } : {}),
          })),
          subtotal,
          shipping,
          vat,
          emirate,
          paymentStatus: 'PENDING',
          paymentMethod: `Partner (App) — ${settlementLabel}`,
          discountPercentage: Number(user.discountPercentage || 0) || undefined,
        })
      } catch (emailError) {
        errorLog('❌ Failed to notify admin of mobile partner order:', orderNumber, emailError)
      }

      try {
        const dPct = Number(user.discountPercentage || 0)
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
          ...(dPct > 0 ? { discountPercentage: dPct } : {}),
          locale: typeof body?.locale === 'string' ? body.locale : 'en',
        })
      } catch (emailError) {
        errorLog('❌ Failed to send mobile partner confirmation:', orderNumber, emailError)
      }
    })

    return NextResponse.json(
      { success: true, orderNumber, orderId: savedOrderId, total, paymentOption, paymentUrl },
      { headers: CORS }
    )
  } catch (error) {
    errorLog('❌ Mobile partner order error:', error)
    return NextResponse.json({ success: false, error: 'Failed to create partner order' }, { status: 500, headers: CORS })
  }
}
