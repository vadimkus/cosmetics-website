import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { errorLog, debugLog } from '@/lib/logger'
import { STRIPE_SECRET_KEY, MOBILE_APP_KEY } from '@/lib/envValidation'
import Stripe from 'stripe'
import { generateUniqueOrderNumber } from '@/lib/orderNumber'
import { validateMobileAuth, extractTokenFromHeader } from '@/lib/jwt'
import { findUserByEmail } from '@/lib/userStorageDb'
import { calculateMobileShipping, calculateVatIncluded } from '@/lib/mobileCheckoutConfig'
import { getProductById } from '@/lib/productsDb'
import { getCartLinePricing } from '@/lib/cartPricing'
import { CartItem, Product } from '@/types'
import {
  getValidatedBundleDiscountPercent,
  isAllowedFreeGiftProduct,
  isSubmittedBundleLine,
  allowedFreeGiftUnits,
  freeGiftKind,
} from '@/lib/checkoutPricingGuards'

/**
 * MOBILE APPLE PAY (STRIPE PAYMENT INTENT) ENDPOINT
 * POST /api/mobile/payments/applepay/intent
 *
 * Creates (or reuses) a Stripe PaymentIntent for Apple Pay using Stripe React Native SDK.
 * Also persists/updates the order in DB similarly to /api/mobile/checkout/stripe.
 *
 * Authentication: Requires x-api-key header matching MOBILE_APP_KEY
 */

const stripe = new Stripe(STRIPE_SECRET_KEY!, {
  apiVersion: '2026-06-24.dahlia',
})

// NOTE: Shipping/VAT config must match `/api/mobile/shipping-rates` and the mobile UI.

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
  // Server-computed
  bundleDiscount?: number | undefined
}

interface ApplePayIntentRequest {
  orderNumber: string
  customer: {
    name: string
    email: string
    phone: string
    address: string
  }
  emirate: string
  items: CheckoutItem[]
  orderNotes?: string
  locale?: string
}

export async function POST(request: NextRequest) {
  const startTime = Date.now()

  try {
    // Security: Validate API Key
    const apiKey = request.headers.get('x-api-key')
    const expectedKey = MOBILE_APP_KEY

    if (!expectedKey) {
      errorLog('[MOBILE_APPLEPAY] MOBILE_APP_KEY not configured')
      return NextResponse.json({ success: false, error: 'API service unavailable' }, { status: 503 })
    }

    if (!apiKey || apiKey !== expectedKey) {
      debugLog('[MOBILE_APPLEPAY] Unauthorized access attempt')
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Invalid or missing API key' },
        { status: 401 }
      )
    }

    // Validate Stripe configuration
    if (!STRIPE_SECRET_KEY) {
      errorLog('[MOBILE_APPLEPAY] Stripe secret key not configured')
      return NextResponse.json({ success: false, error: 'Payment service unavailable' }, { status: 503 })
    }

    const body: ApplePayIntentRequest = await request.json()
    const { orderNumber: clientOrderNumber, customer, emirate, items, orderNotes } = body
    const locale = String(body?.locale || 'en')

    // Prefer canonical mobile card number (Apple Pay is still a card payment)
    const isCanonicalMobileCard = (s: string) => /^GENCardM\d{10}$/.test(String(s || ''))
    const orderNumber = isCanonicalMobileCard(clientOrderNumber)
      ? String(clientOrderNumber)
      : await generateUniqueOrderNumber({ channel: 'M', payment: 'CARD' })

    if (!orderNumber || !customer?.email || !customer?.name || !emirate || !items?.length) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 })
    }

    // Require user token (discounts + user-specific pricing) and ensure it matches the customer email.
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

    debugLog('[MOBILE_APPLEPAY] Processing intent:', {
      orderNumber,
      customerEmail: customer.email,
      itemCount: items.length,
      emirate,
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
      const product = await getProductById(item.id)

      if (!product) {
        errorLog(`[MOBILE_APPLEPAY] Product not found: ${item.id}`)
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

    // Free-gift candidates, validated against the spend threshold after the
    // paid subtotal is known (below).
    const freeGiftCandidates: Array<{ item: typeof productRecords[number]['item']; product: Product; qty: number; selectedColor: string }> = []

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
        freeGiftCandidates.push({ item, product, qty, selectedColor })
        continue
      }

      // Out-of-stock enforcement (paid items only).
      if (!product.inStock) {
        return NextResponse.json(
          { success: false, error: `${product.name} is currently out of stock` },
          { status: 400 }
        )
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

      validatedItems.push({
        id: product.id,
        name: product.name,
        price: pricing.unitPrice,
        quantity: qty,
        image: item.image || product.image,
        // Preserve a stable promo marker so mobile UI can reliably show "FREE"
        size: selectedSize || undefined,
        color: selectedColor || undefined,
        bundleDiscount: pricing.discountType === 'bundle' ? pricing.discountPercentage : undefined,
      })
    }

    // Round accumulated values to 2 decimal places (prevent floating-point drift)
    serverSubtotal = Math.round(serverSubtotal * 100) / 100
    discountAmount = Math.round(discountAmount * 100) / 100
    bundleDiscountAmount = Math.round(bundleDiscountAmount * 100) / 100

    // Admit only the free masks the spend threshold allows.
    {
      const allowance = allowedFreeGiftUnits(serverSubtotal)
      let collagenLeft = allowance.collagen
      let seaAlgaeLeft = allowance.seaAlgae
      for (const g of freeGiftCandidates) {
        const kind = freeGiftKind(g.product)
        let grant = 0
        if (kind === 'collagen') { grant = Math.min(g.qty, collagenLeft); collagenLeft -= grant }
        else if (kind === 'sea_algae') { grant = Math.min(g.qty, seaAlgaeLeft); seaAlgaeLeft -= grant }
        if (grant <= 0) continue
        validatedItems.push({
          id: g.product.id,
          name: String(g.item.name || `${g.product.name} (FREE)`),
          price: 0,
          quantity: grant,
          image: g.item.image || g.product.image,
          size: '__PROMO__',
          color: g.selectedColor || undefined,
        })
      }
    }

    // Capture user discount percentage at time of order for waterfall display
    const userDiscountPctForOrder = (hasUserDiscount && pct > 0) ? pct : null

    const serverShipping: number = calculateMobileShipping(serverSubtotal, emirate)
    const serverTotal: number = serverSubtotal + serverShipping
    const serverVatAmount: number = calculateVatIncluded(serverTotal)

    // Create or update order in database (PENDING status)
    const existingOrder = await prisma.order.findFirst({ where: { orderNumber } })
    let order

    if (existingOrder) {
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
          locale,
          updatedAt: new Date(),
        },
      })

      await prisma.orderItem.deleteMany({ where: { orderId: order.id } })
    } else {
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
          locale,
        },
      })
    }

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
        },
      })
    }

    // Reuse existing PaymentIntent when possible (avoid creating duplicates)
    if (order.stripePaymentIntentId) {
      try {
        const existingIntent = await stripe.paymentIntents.retrieve(order.stripePaymentIntentId)
        const status = String(existingIntent?.status || '')
        if (status && status !== 'canceled' && status !== 'succeeded') {
          const duration = Date.now() - startTime
          return NextResponse.json({
            success: true,
            orderId: order.id,
            orderNumber: order.orderNumber,
            paymentIntentId: existingIntent.id,
            clientSecret: existingIntent.client_secret,
            reused: true,
            meta: { processingTime: `${duration}ms` },
          })
        }
      } catch {
        // ignore and create a new PaymentIntent
      }
    }

    // Create PaymentIntent for Apple Pay (Stripe RN confirms it on-device)
    const amount = Math.round(serverTotal * 100) // AED -> fils
    const intent = await stripe.paymentIntents.create({
      amount,
      currency: 'aed',
      // Dynamic payment methods so the native Payment Sheet surfaces every
      // method enabled in the Stripe Dashboard (card, Apple Pay, Google Pay,
      // Link) instead of card-only. allow_redirects defaults to 'always';
      // only non-redirect methods are enabled, so no extra return handling.
      automatic_payment_methods: { enabled: true },
      metadata: {
        orderNumber: order.orderNumber,
        orderId: order.id,
        customerEmail: customer.email,
        customerName: customer.name,
        customerPhone: customer.phone,
        customerEmirate: emirate,
        orderNotes: orderNotes || '',
        source: 'mobile_app',
        paymentFlow: 'payment_sheet',
      },
      description: `Genosys UAE order ${order.orderNumber}`,
    }, {
      // Idempotency: dedupe double-taps within a 2-minute window while still
      // allowing a genuine later retry to create a fresh intent.
      idempotencyKey: `applepay_${order.orderNumber}_${Math.floor(Date.now() / 120000)}`,
    })

    await prisma.order.update({
      where: { id: order.id },
      data: {
        stripePaymentIntentId: intent.id,
        paymentMetadata: JSON.stringify({
          paymentIntentId: intent.id,
          clientSecretPresent: !!intent.client_secret,
          createdAt: new Date().toISOString(),
          paymentFlow: 'apple_pay',
        }),
        updatedAt: new Date(),
      },
    })

    const duration = Date.now() - startTime
    debugLog(`[MOBILE_APPLEPAY] Success: PaymentIntent created in ${duration}ms`, {
      orderNumber: order.orderNumber,
      paymentIntentId: intent.id,
    })

    return NextResponse.json({
      success: true,
      orderId: order.id,
      orderNumber: order.orderNumber,
      paymentIntentId: intent.id,
      clientSecret: intent.client_secret,
      reused: false,
      meta: {
        processingTime: `${duration}ms`,
        validatedTotals: {
          subtotal: serverSubtotal,
          discountAmount,
          shipping: serverShipping,
          vat: serverVatAmount,
          total: serverTotal,
        },
      },
    })
  } catch (error) {
    const duration = Date.now() - startTime
    errorLog('[MOBILE_APPLEPAY] Error creating payment intent:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      duration: `${duration}ms`,
      stack: error instanceof Error ? error.stack : undefined,
    })

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create Apple Pay payment intent',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json(
    { success: false, error: 'Method not allowed. Use POST to create payment intent.' },
    { status: 405 }
  )
}


