import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { errorLog, debugLog } from '@/lib/logger'
import Stripe from 'stripe'

/**
 * MOBILE APPLE PAY STATUS ENDPOINT
 * POST /api/mobile/payments/applepay/status
 *
 * Retrieves a Stripe PaymentIntent status and (best-effort) updates the related order.
 * Note: Stripe webhooks also update order status; this endpoint is for client-side confirmation.
 *
 * Authentication: Requires x-api-key header matching MOBILE_APP_KEY
 */

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-09-30.clover',
})

export async function POST(request: NextRequest) {
  try {
    const apiKey = request.headers.get('x-api-key')
    const expectedKey = process.env.MOBILE_APP_KEY

    if (!expectedKey) {
      return NextResponse.json({ success: false, error: 'API service unavailable' }, { status: 503 })
    }
    if (!apiKey || apiKey !== expectedKey) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Invalid or missing API key' },
        { status: 401 }
      )
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ success: false, error: 'Payment service unavailable' }, { status: 503 })
    }

    const body = await request.json().catch(() => ({}))
    const paymentIntentId = String(body?.paymentIntentId || body?.id || '').trim()
    const orderId = String(body?.orderId || '').trim()
    const orderNumber = String(body?.orderNumber || '').trim()

    if (!paymentIntentId && !orderId && !orderNumber) {
      return NextResponse.json(
        { success: false, error: 'Missing paymentIntentId or order identifiers' },
        { status: 400 }
      )
    }

    // Locate the order first (if possible)
    const order =
      (paymentIntentId
        ? await prisma.order.findFirst({ where: { stripePaymentIntentId: paymentIntentId } })
        : null) ||
      (orderId ? await prisma.order.findFirst({ where: { id: orderId } }) : null) ||
      (orderNumber ? await prisma.order.findFirst({ where: { orderNumber } }) : null)

    const intentId = paymentIntentId || String(order?.stripePaymentIntentId || '').trim()
    if (!intentId) {
      return NextResponse.json(
        { success: false, error: 'PaymentIntent not found for this order' },
        { status: 404 }
      )
    }

    const intent = await stripe.paymentIntents.retrieve(intentId)
    const status = String(intent.status || '')

    debugLog('[MOBILE_APPLEPAY_STATUS] Retrieved PaymentIntent', {
      intentId,
      status,
      orderNumber: order?.orderNumber,
    })

    // Best-effort order status sync (webhooks should also do this)
    if (order) {
      const nextPaymentStatus =
        status === 'succeeded'
          ? 'paid'
          : status === 'processing'
            ? 'processing'
            : status === 'canceled'
              ? 'cancelled'
              : status === 'requires_payment_method' || status === 'requires_confirmation' || status === 'requires_action'
                ? 'pending'
                : 'failed'

      const nextOrderStatus =
        nextPaymentStatus === 'paid'
          ? 'CONFIRMED'
          : nextPaymentStatus === 'failed'
            ? 'FAILED'
            : nextPaymentStatus === 'cancelled'
              ? 'CANCELLED'
              : 'PENDING'

      const shouldUpdate =
        String(order.paymentStatus || '').toLowerCase() !== nextPaymentStatus ||
        String(order.status || '').toUpperCase() !== nextOrderStatus

      if (shouldUpdate) {
        try {
          await prisma.order.update({
            where: { id: order.id },
            data: {
              paymentStatus: nextPaymentStatus,
              status: nextOrderStatus,
              stripePaymentIntentId: intent.id,
              paidAt: nextPaymentStatus === 'paid' ? new Date() : null,
              paymentMetadata: JSON.stringify({
                paymentIntentId: intent.id,
                status: intent.status,
                amount: intent.amount,
                currency: intent.currency,
                updatedAt: new Date().toISOString(),
                via: 'mobile_applepay_status_endpoint',
              }),
              updatedAt: new Date(),
            },
          })
        } catch (error) {
          errorLog('[MOBILE_APPLEPAY_STATUS] Failed to update order status (non-fatal)', {
            orderId: order.id,
            error: error instanceof Error ? error.message : String(error || ''),
          })
        }
      }
    }

    return NextResponse.json({
      success: true,
      paymentIntentId: intent.id,
      status: intent.status,
      amount: intent.amount,
      currency: intent.currency,
      orderId: order?.id || null,
      orderNumber: order?.orderNumber || null,
    })
  } catch (error) {
    errorLog('[MOBILE_APPLEPAY_STATUS] Error:', error instanceof Error ? error.message : error)
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve payment status' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json(
    { success: false, error: 'Method not allowed. Use POST.' },
    { status: 405 }
  )
}




