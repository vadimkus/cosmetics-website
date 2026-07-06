import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { errorLog, debugLog } from '@/lib/logger'
import { STRIPE_SECRET_KEY, MOBILE_APP_KEY, NEXT_PUBLIC_BASE_URL } from '@/lib/envValidation'
import Stripe from 'stripe'
import { validateMobileAuth, extractTokenFromHeader } from '@/lib/jwt'
import { findUserByEmail } from '@/lib/userStorageDb'
import { generateUniqueOrderNumber } from '@/lib/orderNumber'
import { calculateMobileShipping, calculateVatIncluded } from '@/lib/mobileCheckoutConfig'
import { getProductById } from '@/lib/productsDb'
import { getCartLinePricing } from '@/lib/cartPricing'
import { CartItem, Product } from '@/types'
import {
  getValidatedBundleDiscountPercent,
  isAllowedFreeGiftProduct,
  isSubmittedBundleLine,
} from '@/lib/checkoutPricingGuards'

/**
 * MOBILE STRIPE CHECKOUT ENDPOINT
 * POST /api/mobile/checkout/stripe
 * 
 * Creates a Stripe Checkout Session for mobile app card payments
 * Returns paymentUrl for the app to open in browser
 * 
 * Authentication: Requires x-api-key header matching MOBILE_APP_KEY
 * Optional: x-user-id header for user context
 */

const stripe = new Stripe(STRIPE_SECRET_KEY!, {
  apiVersion: '2026-06-24.dahlia'
})

// NOTE: Shipping/VAT logic MUST match the mobile UI + /api/mobile/shipping-rates.
// We treat VAT as INCLUDED in subtotal/shipping/total for mobile.

interface CheckoutItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
  size?: string | undefined
  color?: string | undefined
  selectedSize?: string | undefined
  selectedColor?: string | undefined
  isPromotionItem?: boolean | undefined
  // Bundle ("Build Your Set") fields — sent by native app per item
  fromBundle?: boolean | undefined
  bundleDiscountPercent?: number | undefined
  originalPrice?: number | undefined
  // Server-computed fields
  discountDesc?: string | undefined
  bundleDiscount?: number | undefined
}

interface CheckoutRequest {
  orderNumber: string
  orderId?: string
  resume?: boolean
  customer: {
    name: string
    email: string
    phone: string
    address: string
  }
  emirate: string
  items: CheckoutItem[]
  shippingCost?: number
  vatAmount?: number
  subtotal?: number
  total?: number
  orderNotes?: string
}

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    // Security: Validate API Key
    const apiKey = request.headers.get('x-api-key')
    const expectedKey = MOBILE_APP_KEY
    
    if (!expectedKey) {
      errorLog('[MOBILE_STRIPE] MOBILE_APP_KEY not configured')
      return NextResponse.json(
        { success: false, error: 'API service unavailable' },
        { status: 503 }
      )
    }
    
    if (!apiKey || apiKey !== expectedKey) {
      debugLog('[MOBILE_STRIPE] Unauthorized access attempt')
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Invalid or missing API key' },
        { status: 401 }
      )
    }

    // Validate Stripe configuration
    if (!STRIPE_SECRET_KEY) {
      errorLog('[MOBILE_STRIPE] Stripe secret key not configured')
      return NextResponse.json(
        { success: false, error: 'Payment service unavailable' },
        { status: 503 }
      )
    }

    // Parse request body
    const body: CheckoutRequest = await request.json()
    const { orderNumber: clientOrderNumber, customer, emirate, items, orderNotes } = body

    // Prefer a canonical server order number. If client already provides one in the new canonical format,
    // keep it for idempotency; otherwise generate a fresh one.
    const isCanonicalMobileCard = (s: string) => /^GENCardM\\d{10}$/.test(String(s || ''))
    const orderNumber = isCanonicalMobileCard(clientOrderNumber)
      ? String(clientOrderNumber)
      : await generateUniqueOrderNumber({ channel: 'M', payment: 'CARD' })

    // Resume payment flow for an existing order (pending/unpaid).
    // This is used by the mobile app "Pay now" on pending orders.
    if (body?.resume === true) {
      const authHeader = request.headers.get('Authorization')
      const token = extractTokenFromHeader(authHeader)
      const authValidation = validateMobileAuth(apiKey, token)

      if (!authValidation.valid) {
        return NextResponse.json(
          { success: false, error: authValidation.error },
          { status: authValidation.status || 500 }
        )
      }

      if (!authValidation.payload) {
        return NextResponse.json(
          { success: false, error: 'Authentication token required' },
          { status: 401 }
        )
      }

      const user = await findUserByEmail(authValidation.payload.email)
      if (!user) {
        return NextResponse.json(
          { success: false, error: 'User not found' },
          { status: 404 }
        )
      }

      const resumeOrderId = String(body?.orderId || '').trim()
      const resumeOrderNumber = String(body?.orderNumber || '').trim()

      if (!resumeOrderId && !resumeOrderNumber) {
        return NextResponse.json(
          { success: false, error: 'Missing orderId or orderNumber' },
          { status: 400 }
        )
      }

      const existing = await prisma.order.findFirst({
        where: {
          ...(resumeOrderId ? { id: resumeOrderId } : {}),
          ...(resumeOrderNumber ? { orderNumber: resumeOrderNumber } : {}),
          customerEmail: user.email,
        },
        include: { items: true },
      })

      if (!existing) {
        return NextResponse.json(
          { success: false, error: 'Order not found' },
          { status: 404 }
        )
      }

      const status = String(existing.status || '').toUpperCase()
      const paymentStatus = String(existing.paymentStatus || '').toUpperCase()

      if (status === 'DELETED') {
        return NextResponse.json(
          { success: false, error: 'Order was deleted' },
          { status: 400 }
        )
      }

      if (paymentStatus === 'PAID') {
        return NextResponse.json(
          { success: false, error: 'Order is already paid' },
          { status: 400 }
        )
      }

      if (status !== 'PENDING') {
        return NextResponse.json(
          { success: false, error: 'Order is not pending' },
          { status: 400 }
        )
      }

      // If there's an existing Stripe session, try to reuse it if still open.
      if (existing.stripeSessionId) {
        try {
          const s = await stripe.checkout.sessions.retrieve(existing.stripeSessionId)
          if (s?.url) {
            return NextResponse.json({
              success: true,
              orderId: existing.id,
              orderNumber: existing.orderNumber,
              paymentUrl: s.url,
              reused: true,
            })
          }
        } catch {
          // ignore and create a new session
          debugLog('[MOBILE_STRIPE_RESUME] Failed to reuse stripe session, will create new', {
            orderId: existing.id,
          })
        }
      }

      // Recompute totals server-side from stored order items.
      // NOTE: Order item prices are already server-authoritative at time of order creation.
      const serverSubtotal = existing.items.reduce((sum, it) => sum + (Number(it.price) || 0) * (Number(it.quantity) || 0), 0)
      const emirateFromOrder = String(existing.customerEmirate || emirate || 'Dubai')
      const serverShipping = calculateMobileShipping(serverSubtotal, emirateFromOrder)
      const serverTotal = serverSubtotal + serverShipping
      const serverVatAmount = calculateVatIncluded(serverTotal)

      const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = existing.items.map((it) => ({
        price_data: {
          currency: 'aed',
          unit_amount: Math.round((Number(it.price) || 0) * 100),
          product_data: {
            name: String(it.productName || 'Item') + (it.size ? ` (${it.size})` : '') + (it.color ? ` - ${it.color}` : ''),
            ...(it.image ? { images: String(it.image).startsWith('http') ? [it.image] : [`https://genosys.ae${it.image}`] } : {}),
            metadata: {
              product_id: String(it.productId || ''),
              size: String(it.size || ''),
              color: String(it.color || ''),
            },
          },
        },
        quantity: Number(it.quantity) || 1,
      }))

      if (serverShipping > 0) {
        lineItems.push({
          price_data: {
            currency: 'aed',
            unit_amount: Math.round(serverShipping * 100),
            product_data: {
              name: `Shipping to ${emirateFromOrder}`,
              description: 'Standard delivery',
            },
          },
          quantity: 1,
        })
      }

      const successUrl = `${NEXT_PUBLIC_BASE_URL || 'https://genosys.ae'}/pay/success?orderNumber=${existing.orderNumber}`
      const cancelUrl = `${NEXT_PUBLIC_BASE_URL || 'https://genosys.ae'}/pay/cancel?orderNumber=${existing.orderNumber}`

      const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        line_items: lineItems,
        customer_email: existing.customerEmail,
        metadata: {
          orderNumber: existing.orderNumber,
          orderId: existing.id,
          customerName: existing.customerName || '',
          customerPhone: existing.customerPhone || '',
          customerEmirate: emirateFromOrder,
          source: 'mobile_app',
          resume: 'true',
        },
        success_url: successUrl,
        cancel_url: cancelUrl,
        // Dynamic payment methods: omit payment_method_types so the hosted
        // Checkout page uses the methods enabled in the Stripe Dashboard.
        expires_at: Math.floor(Date.now() / 1000) + (30 * 60),
      }, {
        // Idempotency: dedupe double-taps within a 2-minute window; a genuine
        // later resume still gets a fresh session.
        idempotencyKey: `mob_sess_${existing.orderNumber}_${Math.floor(Date.now() / 120000)}`,
      })

      await prisma.order.update({
        where: { id: existing.id },
        data: {
          stripeSessionId: session.id,
          subtotal: serverSubtotal,
          shipping: serverShipping,
          vat: serverVatAmount,
          total: serverTotal,
          paymentMetadata: JSON.stringify({
            sessionUrl: session.url,
            expiresAt: session.expires_at,
            createdAt: new Date().toISOString(),
            resumedAt: new Date().toISOString(),
          }),
          updatedAt: new Date(),
        },
      })

      return NextResponse.json({
        success: true,
        orderId: existing.id,
        orderNumber: existing.orderNumber,
        paymentUrl: session.url,
        reused: false,
      })
    }

    // Validate required fields
    if (!orderNumber || !customer?.email || !customer?.name || !emirate || !items?.length) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Require authenticated user for accurate discounts/pricing, and ensure it matches the customer email.
    const authHeader = request.headers.get('Authorization')
    const token = extractTokenFromHeader(authHeader)
    const authValidation = validateMobileAuth(apiKey, token)
    if (!authValidation.valid) {
      return NextResponse.json(
        { success: false, error: authValidation.error },
        { status: authValidation.status || 500 }
      )
    }
    if (!authValidation.payload) {
      return NextResponse.json({ success: false, error: 'Authentication token required' }, { status: 401 })
    }
    const user = await findUserByEmail(authValidation.payload.email)
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 })
    }
    const customerEmailLower = String(customer.email || '').trim().toLowerCase()
    const userEmailLower = String(user.email || '').trim().toLowerCase()
    const contactEmailLower = String((user as any).contactEmail || '').trim().toLowerCase()
    const isAppleRelay = userEmailLower.includes('@privaterelay.appleid.com') || customerEmailLower.includes('@privaterelay.appleid.com')
    if (!isAppleRelay && customerEmailLower !== userEmailLower && (!contactEmailLower || customerEmailLower !== contactEmailLower)) {
      return NextResponse.json({ success: false, error: 'Customer email does not match authenticated user' }, { status: 403 })
    }

    debugLog('[MOBILE_STRIPE] Processing checkout:', {
      orderNumber,
      customerEmail: customer.email,
      itemCount: items.length,
      emirate
    })

    // SERVER-SIDE CALCULATION: Recompute totals through the shared cart pricing helper.
    let serverSubtotal = 0
    let discountAmount = 0
    let bundleDiscountAmount = 0
    let bundleDiscountPct = 0
    const validatedItems: CheckoutItem[] = []
    const productRecords: Array<{ item: CheckoutItem; product: Product }> = []

    // User discount (constant across all items)
    const pct = Number(user.discountPercentage)
    const hasUserDiscount = Boolean(user.discountType) && Number.isFinite(pct) && pct > 0 && pct < 100

    for (const item of items) {
      // Verify product exists and get current price
      const product = await getProductById(item.id)

      if (!product) {
        errorLog(`[MOBILE_STRIPE] Product not found: ${item.id}`)
        return NextResponse.json(
          { success: false, error: `Product not found: ${item.name}` },
          { status: 400 }
        )
      }

      productRecords.push({ item, product })
    }

    const bundleLineCount = productRecords.filter(({ item, product }) =>
      isSubmittedBundleLine(item.bundleDiscountPercent, product)
    ).length

    for (const { item, product } of productRecords) {

      const selectedSize = String(item.size || item.selectedSize || '').trim()
      const selectedColor = String(item.color || item.selectedColor || '').trim()
      const isPromo =
        (item.isPromotionItem === true ||
          selectedSize === '__PROMO__' ||
          // Client can send promo items with price 0 but without the flag; treat as promo signal only.
          Number(item.price) === 0) &&
        isAllowedFreeGiftProduct(product)
      const bundlePct = getValidatedBundleDiscountPercent(item.bundleDiscountPercent, product, bundleLineCount)
      const qty = Number(item.quantity) || 0
      if (qty <= 0) {
        return NextResponse.json(
          { success: false, error: `Invalid quantity for ${product.name}` },
          { status: 400 }
        )
      }

      if (isPromo) {
        validatedItems.push({
          id: product.id,
          name: String(item.name || `${product.name} (FREE)`),
          price: 0,
          quantity: qty,
          image: item.image || product.image,
          size: '__PROMO__',
          color: selectedColor || undefined,
        })
        continue
      }

      const cartItem: CartItem = {
        product,
        quantity: qty,
        ...(selectedSize ? { selectedSize } : {}),
        ...(selectedColor ? { selectedColor } : {}),
        ...(bundlePct ? { fromBundle: true, bundleDiscountPercent: bundlePct } : {}),
      }
      const pricing = getCartLinePricing(cartItem, user)
      serverSubtotal += pricing.lineTotal

      if (pricing.discountType === 'bundle') {
        bundleDiscountAmount += pricing.discountAmount
        if (pricing.discountPercentage > 0) bundleDiscountPct = pricing.discountPercentage
      } else if (pricing.discountType === 'user' || pricing.discountType === 'black_friday') {
        discountAmount += pricing.discountAmount
      }

      let discountDesc = ''
      if (pricing.discountAmount > 0) {
        if (pricing.discountType === 'bundle') {
          discountDesc = `${Math.round(pricing.discountPercentage)}% Bundle discount applied (was AED ${pricing.retailUnitPrice.toFixed(2)})`
        } else if (pricing.discountType === 'user' || pricing.discountType === 'black_friday') {
          discountDesc = `${Math.round(pricing.discountPercentage)}% discount applied (was AED ${pricing.retailUnitPrice.toFixed(2)})`
        } else if (pricing.discountType === 'beauty_box') {
          discountDesc = `${Math.round(pricing.discountPercentage)}% Beauty Box discount applied (was AED ${pricing.retailUnitPrice.toFixed(2)})`
        }
      }

      validatedItems.push({
        id: product.id,
        name: product.name,
        price: pricing.unitPrice,
        quantity: qty,
        image: item.image || product.image,
        // Preserve a stable promo marker so mobile UI can reliably show "FREE"
        size: selectedSize || undefined,
        color: selectedColor || undefined,
        discountDesc,
        bundleDiscount: pricing.discountType === 'bundle' ? pricing.discountPercentage : undefined,
      })
    }

    // Round accumulated values to 2 decimal places (prevent floating-point drift)
    serverSubtotal = Math.round(serverSubtotal * 100) / 100
    discountAmount = Math.round(discountAmount * 100) / 100
    bundleDiscountAmount = Math.round(bundleDiscountAmount * 100) / 100

    // Capture user discount percentage at time of order for waterfall display
    const userDiscountPctForOrder = (hasUserDiscount && pct > 0) ? pct : null

    const serverShipping: number = calculateMobileShipping(serverSubtotal, emirate)
    const serverTotal: number = serverSubtotal + serverShipping
    const serverVatAmount: number = calculateVatIncluded(serverTotal)

    debugLog('[MOBILE_STRIPE] Server-calculated totals:', {
      subtotal: serverSubtotal,
      discountAmount,
      discountPercentage: userDiscountPctForOrder,
      shipping: serverShipping,
      vat: serverVatAmount,
      total: serverTotal
    })

    // Create or update order in database (PENDING status)
    const existingOrder = await prisma.order.findFirst({
      where: { orderNumber }
    })

    let order
    if (existingOrder) {
      // Update existing order
      order = await prisma.order.update({
        where: { id: existingOrder.id },
        data: {
          customerName: customer.name,
          customerEmail: customer.email,
          customerPhone: customer.phone,
          customerAddress: customer.address,
          customerEmirate: emirate,
          orderNotes: orderNotes ? String(orderNotes).trim() : null,
          subtotal: serverSubtotal,
          discountPercentage: userDiscountPctForOrder,
          discountAmount: discountAmount,
          bundleDiscountPercentage: bundleDiscountPct > 0 ? bundleDiscountPct : null,
          bundleDiscountAmount: bundleDiscountAmount > 0 ? bundleDiscountAmount : 0,
          shipping: serverShipping,
          vat: serverVatAmount,
          total: serverTotal,
          status: 'PENDING',
          paymentMethod: 'stripe',
          paymentStatus: 'pending',
          updatedAt: new Date()
        }
      })

      // Update order items
      await prisma.orderItem.deleteMany({
        where: { orderId: order.id }
      })
    } else {
      // Create new order
      order = await prisma.order.create({
        data: {
          orderNumber,
          customerName: customer.name,
          customerEmail: customer.email,
          customerPhone: customer.phone,
          customerAddress: customer.address,
          customerEmirate: emirate,
          orderNotes: orderNotes ? String(orderNotes).trim() : null,
          subtotal: serverSubtotal,
          discountPercentage: userDiscountPctForOrder,
          discountAmount: discountAmount,
          bundleDiscountPercentage: bundleDiscountPct > 0 ? bundleDiscountPct : null,
          bundleDiscountAmount: bundleDiscountAmount > 0 ? bundleDiscountAmount : 0,
          shipping: serverShipping,
          vat: serverVatAmount,
          total: serverTotal,
          status: 'PENDING',
          paymentMethod: 'stripe',
          paymentStatus: 'pending',
          locale: 'en'
        }
      })
    }

    // Create order items
    for (const item of validatedItems) {
      await prisma.orderItem.create({
        data: {
          orderId: order.id,
          productId: item.id,
          productName: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          size: item.size || null,
          color: item.color || null,
          bundleDiscount: item.bundleDiscount ?? null,
        }
      })
    }

    debugLog('[MOBILE_STRIPE] Order persisted:', order.id)

    // Create Stripe line items
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = validatedItems.map(item => ({
      price_data: {
        currency: 'aed',
        unit_amount: Math.round(item.price * 100), // Convert AED to fils
        product_data: {
          name: item.name + (item.size ? ` (${item.size})` : '') + (item.color ? ` - ${item.color}` : ''),
          ...(item.discountDesc ? { description: item.discountDesc } : {}),
          images: item.image.startsWith('http') ? [item.image] : [`https://genosys.ae${item.image}`],
          metadata: {
            product_id: item.id,
            size: item.size || '',
            color: item.color || ''
          }
        }
      },
      quantity: item.quantity
    }))

    // Add shipping as line item (if not free)
    if (serverShipping > 0) {
      lineItems.push({
        price_data: {
          currency: 'aed',
          unit_amount: Math.round(serverShipping * 100), // Convert to fils
          product_data: {
            name: `Shipping to ${emirate}`,
            description: 'Standard delivery'
          }
        },
        quantity: 1
      })
    }

    // Create Stripe Checkout Session
    const successUrl = `${NEXT_PUBLIC_BASE_URL || 'https://genosys.ae'}/pay/success?orderNumber=${orderNumber}`
    const cancelUrl = `${NEXT_PUBLIC_BASE_URL || 'https://genosys.ae'}/pay/cancel?orderNumber=${orderNumber}`

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: lineItems,
      customer_email: customer.email,
      metadata: {
        orderNumber,
        orderId: order.id,
        customerName: customer.name,
        customerPhone: customer.phone,
        customerEmirate: emirate,
        orderNotes: orderNotes || '',
        source: 'mobile_app'
      },
      success_url: successUrl,
      cancel_url: cancelUrl,
      // Dynamic payment methods: omit payment_method_types so the hosted
      // Checkout page uses the methods enabled in the Stripe Dashboard.
      expires_at: Math.floor(Date.now() / 1000) + (30 * 60) // 30 minutes
    }, {
      // Idempotency: dedupe double-taps within a 2-minute window; a genuine
      // later resume still gets a fresh session.
      idempotencyKey: `mob_sess_${orderNumber}_${Math.floor(Date.now() / 120000)}`,
    })

    // Update order with Stripe session ID
    await prisma.order.update({
      where: { id: order.id },
      data: {
        stripeSessionId: session.id,
        paymentMetadata: JSON.stringify({
          sessionUrl: session.url,
          expiresAt: session.expires_at,
          createdAt: new Date().toISOString()
        })
      }
    })

    const duration = Date.now() - startTime
    debugLog(`[MOBILE_STRIPE] Success: Session created in ${duration}ms`, {
      orderNumber,
      sessionId: session.id
    })

    // Return payment URL for mobile app to open
    return NextResponse.json({
      success: true,
      paymentUrl: session.url,
      sessionId: session.id,
      orderNumber,
      expiresAt: session.expires_at,
      meta: {
        processingTime: `${duration}ms`,
        validatedTotals: {
          subtotal: serverSubtotal,
          shipping: serverShipping,
          vat: serverVatAmount,
          total: serverTotal
        }
      }
    })

  } catch (error) {
    const duration = Date.now() - startTime
    errorLog('[MOBILE_STRIPE] Error creating checkout session:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      duration: `${duration}ms`,
      stack: error instanceof Error ? error.stack : undefined
    })

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create payment session',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

/**
 * Handle unsupported HTTP methods
 */
export async function GET() {
  return NextResponse.json(
    { success: false, error: 'Method not allowed. Use POST to create checkout session.' },
    { status: 405 }
  )
}

export async function PUT() {
  return NextResponse.json(
    { success: false, error: 'Method not allowed' },
    { status: 405 }
  )
}

export async function DELETE() {
  return NextResponse.json(
    { success: false, error: 'Method not allowed' },
    { status: 405 }
  )
}
