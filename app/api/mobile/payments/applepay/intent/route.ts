import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { errorLog, debugLog } from '@/lib/logger'
import Stripe from 'stripe'
import { generateUniqueOrderNumber } from '@/lib/orderNumber'
import { validateMobileAuth, extractTokenFromHeader } from '@/lib/jwt'
import { findUserByEmail } from '@/lib/userStorageDb'
import { calculateMobileShipping, calculateVatIncluded } from '@/lib/mobileCheckoutConfig'

/**
 * MOBILE APPLE PAY (STRIPE PAYMENT INTENT) ENDPOINT
 * POST /api/mobile/payments/applepay/intent
 *
 * Creates (or reuses) a Stripe PaymentIntent for Apple Pay using Stripe React Native SDK.
 * Also persists/updates the order in DB similarly to /api/mobile/checkout/stripe.
 *
 * Authentication: Requires x-api-key header matching MOBILE_APP_KEY
 */

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-09-30.clover',
})

// NOTE: Shipping/VAT config must match `/api/mobile/shipping-rates` and the mobile UI.

interface CheckoutItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
  size: string | undefined
  color: string | undefined
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
    const expectedKey = process.env.MOBILE_APP_KEY

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
    if (!process.env.STRIPE_SECRET_KEY) {
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
    if (String(user.email || '').trim().toLowerCase() !== String(customer.email || '').trim().toLowerCase()) {
      return NextResponse.json({ success: false, error: 'Customer email does not match authenticated user' }, { status: 403 })
    }

    debugLog('[MOBILE_APPLEPAY] Processing intent:', {
      orderNumber,
      customerEmail: customer.email,
      itemCount: items.length,
      emirate,
    })

    // SERVER-SIDE CALCULATION: Recompute totals (authoritative, MUST match mobile UI)
    let serverSubtotal = 0
    let discountAmount = 0
    const validatedItems: CheckoutItem[] = []

    for (const item of items) {
      const product = await prisma.product.findFirst({
        where: {
          OR: [{ id: item.id }, { productNumber: item.id }],
          isHidden: false,
        },
      })

      if (!product) {
        errorLog(`[MOBILE_APPLEPAY] Product not found: ${item.id}`)
        return NextResponse.json(
          { success: false, error: `Product not found: ${item.name}` },
          { status: 400 }
        )
      }

      // Variant price support (size/color). Use product price if no matching variant.
      const wantedSize = item.size ? String(item.size).trim() : null
      const wantedColor = item.color ? String(item.color).trim() : null
      const variant = (wantedSize || wantedColor)
        ? await prisma.productVariant.findFirst({
            where: {
              productId: product.id,
              ...(wantedSize ? { size: wantedSize } : {}),
              ...(wantedColor ? { color: wantedColor } : {}),
              available: true,
            },
          })
        : null

      const baseUnit = Number(variant?.price ?? product.price)
      const qty = Number(item.quantity) || 0

      // Apply user discount unless product is excluded
      const pct = Number(user.discountPercentage)
      const hasUserDiscount = Number.isFinite(pct) && pct > 0 && pct < 100
      const excluded = product.noDiscount === true
      const discountedUnit = (!excluded && hasUserDiscount) ? (baseUnit * (1 - pct / 100)) : baseUnit
      const unitPrice = Number(discountedUnit)
      const itemSubtotal = unitPrice * qty
      serverSubtotal += itemSubtotal

      if (!excluded && hasUserDiscount) {
        discountAmount += (baseUnit - unitPrice) * qty
      }

      validatedItems.push({
        id: product.id,
        name: product.name,
        price: unitPrice,
        quantity: qty,
        image: item.image || product.image,
        size: item.size,
        color: item.color,
      })
    }

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
          discountAmount: discountAmount,
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
          discountAmount: discountAmount,
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
      payment_method_types: ['card'],
      metadata: {
        orderNumber: order.orderNumber,
        orderId: order.id,
        customerEmail: customer.email,
        customerName: customer.name,
        customerPhone: customer.phone,
        customerEmirate: emirate,
        orderNotes: orderNotes || '',
        source: 'mobile_app',
        paymentFlow: 'apple_pay',
      },
      description: `Genosys UAE order ${order.orderNumber} (Apple Pay)`,
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
  } catch {
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


