import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { errorLog, debugLog } from '@/lib/logger'
import Stripe from 'stripe'
import { generateUniqueOrderNumber } from '@/lib/orderNumber'

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

// Shipping costs per emirate (AED)
const SHIPPING_COSTS: Record<string, number> = {
  Dubai: 0,
  'Abu Dhabi': 25,
  Sharjah: 25,
  Ajman: 25,
  'Umm Al Quwain': 25,
  'Ras Al Khaimah': 25,
  Fujairah: 25,
  Other: 25,
}

const UAE_VAT_RATE = 0.05 // 5% VAT
const FREE_SHIPPING_THRESHOLD_AED = 1000

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

    debugLog('[MOBILE_APPLEPAY] Processing intent:', {
      orderNumber,
      customerEmail: customer.email,
      itemCount: items.length,
      emirate,
    })

    // SERVER-SIDE CALCULATION: Recompute totals (authoritative, matching /mobile/checkout/stripe)
    let serverSubtotal = 0
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

      const itemPrice = product.price
      const itemSubtotal = itemPrice * item.quantity
      serverSubtotal += itemSubtotal

      validatedItems.push({
        id: product.id,
        name: product.name,
        price: itemPrice,
        quantity: item.quantity,
        image: item.image || product.image,
        size: item.size,
        color: item.color,
      })
    }

    const serverShipping: number =
      serverSubtotal >= FREE_SHIPPING_THRESHOLD_AED ? 0 : (SHIPPING_COSTS[emirate] || SHIPPING_COSTS.Other || 25)
    const serverVatAmount: number = (serverSubtotal + serverShipping) * UAE_VAT_RATE
    const serverTotal: number = serverSubtotal + serverShipping + serverVatAmount

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


