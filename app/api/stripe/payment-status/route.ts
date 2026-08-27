import { NextRequest, NextResponse } from 'next/server'
import { getCheckoutSession, getPaymentIntent } from '@/lib/stripe'
import { prisma } from '@/lib/database'
import { debugLog, errorLog } from '@/lib/logger'
import { sendOrderConfirmationEmail, sendAdminNewOrderNotification } from '@/lib/email'
import { getPreferredEmail } from '@/lib/emailHelpers'
import { findUserByEmail } from '@/lib/userStorageDb'
import { isUserDiscountExcludedProduct } from '@/lib/mobileDiscountRules'
import { estimateOrderPoints, recordRedemption } from '@/lib/loyalty'
import { trackUserAction } from '@/lib/analyticsServer'
import type { Prisma } from '@prisma/client'

type OrderWithItems = Prisma.OrderGetPayload<{ include: { items: true } }>

/**
 * Atomically claim the pending -> paid transition for an order.
 *
 * Both this route (mobile/web payment-status polling) and the Stripe webhook
 * can observe a payment becoming "paid" at nearly the same time. Whoever flips
 * the row from non-paid to paid first "wins" and is responsible for sending the
 * confirmation + admin emails. Using a conditional updateMany makes this a
 * single atomic DB operation, so emails are sent exactly once regardless of
 * which path arrives first. This fixes the bug where the poll marked the order
 * paid (without emailing) and the webhook then skipped emails as a "duplicate".
 *
 * @returns true if this caller won the transition and should send emails.
 */
async function claimPaidTransition(
  orderId: string,
  data: Prisma.OrderUpdateManyMutationInput,
): Promise<boolean> {
  const result = await prisma.order.updateMany({
    where: { id: orderId, paymentStatus: { not: 'paid' } },
    data,
  })
  return result.count === 1
}

/**
 * Card orders store the requested redemption on the order and debit the ledger
 * only after Stripe confirms payment. Every successful observer may call this:
 * the ledger's (orderId, type) constraint makes it idempotent and also lets a
 * later poll/webhook retry recover from a transient settlement failure.
 */
async function settleLoyaltyRedemption(
  order: OrderWithItems,
  context: 'session-poll' | 'payment-intent-poll'
) {
  const points = Number(order.loyaltyPointsRedeemed || 0)
  if (points <= 0) return

  try {
    const loyaltyUser = await findUserByEmail(order.customerEmail)
    if (!loyaltyUser) {
      errorLog('❌ Loyalty redemption settle: user not found for', order.customerEmail)
      return
    }
    await recordRedemption({
      userId: loyaltyUser.id,
      orderId: order.id,
      orderNumber: order.orderNumber,
      points,
      amountAed: Number(order.loyaltyDiscountAmount || 0),
    })
  } catch (loyaltyError) {
    errorLog(`❌ Loyalty redemption settle failed (${context}):`, loyaltyError)
  }
}

/**
 * Sends the customer confirmation email and the admin new-order notification
 * for an order that just transitioned to paid. Mirrors the logic used by the
 * Stripe webhook so both paths produce identical emails.
 */
async function sendPaidConfirmationEmails(order: OrderWithItems) {
  // Get user for discount tier info and preferred email
  const user = order.customerEmail
    ? await findUserByEmail(order.customerEmail)
    : null

  // Get preferred email address (use user's contactEmail if available for Apple Private Relay)
  const emailToUse = user ? getPreferredEmail(user) : order.customerEmail || ''

  // Calculate discount info for items
  const userDiscountPct = Number(user?.discountPercentage || 0)
  const hasUserDiscount = Number.isFinite(userDiscountPct) && userDiscountPct > 0 && userDiscountPct < 100

  // Send customer confirmation email
  if (emailToUse) {
    await sendOrderConfirmationEmail({
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      customerEmail: emailToUse,
      items: order.items.map((item) => {
        const itemName = item.productName || 'Product'
        const isFreeItem = item.price === 0 || itemName.toLowerCase().includes('(free)')
        const isBundle = itemName.toLowerCase().includes('beauty box') || itemName.toLowerCase().includes('bundle')
        const isExcludedFromUserDiscount = isUserDiscountExcludedProduct({ name: itemName })
        const hasUserDiscountApplied = hasUserDiscount && !isExcludedFromUserDiscount && !isFreeItem

        let discountLabel: string | undefined = undefined
        if (isFreeItem) {
          discountLabel = undefined
        } else if (isBundle) {
          discountLabel = '15% OFF - Bundle'
        } else if (hasUserDiscountApplied) {
          discountLabel = `${userDiscountPct}% OFF`
        }

        return {
          productName: itemName,
          quantity: item.quantity,
          price: item.price,
          image: item.image || '',
          ...(item.size ? { size: item.size } : {}),
          ...(item.color ? { color: item.color } : {}),
          ...(discountLabel ? { discountLabel } : {})
        }
      }),
      subtotal: order.subtotal || 0,
      shipping: order.shipping || 0,
      vat: order.vat || 0,
      total: order.total || 0,
      address: order.customerAddress || '',
      emirate: order.customerEmirate || '',
      locale: order.locale || 'en',
      discountPercentage: hasUserDiscount ? userDiscountPct : undefined,
      discountAmount: order.discountAmount ?? undefined,
      bundleDiscountPercentage: order.bundleDiscountPercentage ?? undefined,
      bundleDiscountAmount: order.bundleDiscountAmount ?? undefined,
      loyaltyPointsRedeemed: order.loyaltyPointsRedeemed ?? undefined,
      loyaltyDiscountAmount: order.loyaltyDiscountAmount ?? undefined,
      loyaltyPointsExpected: estimateOrderPoints({
        total: order.total,
        shipping: order.shipping || 0,
        user,
      }),
      rewardsCreditTiming: 'paid',
    })

    debugLog('📧 Customer email sent for order:', order.orderNumber)

    if (order.customerEmail) {
      await trackUserAction({
        userEmail: order.customerEmail,
        action: 'order_confirmation_email_sent',
        metadata: {
          orderNumber: order.orderNumber,
          source: 'payment-status-route'
        }
      })
    }
  }

  // Send admin notification email
  await sendAdminNewOrderNotification({
    orderNumber: order.orderNumber,
    customerName: order.customerName,
    customerEmail: emailToUse,
    customerPhone: order.customerPhone ?? undefined,
    total: order.total,
    itemCount: order.items.length,
    items: order.items.map((item) => {
      const itemName = item.productName || 'Product'
      const isFreeItem = item.price === 0 || itemName.toLowerCase().includes('(free)')
      const isBundle = itemName.toLowerCase().includes('beauty box') || itemName.toLowerCase().includes('bundle')
      const isExcludedFromUserDiscount = isUserDiscountExcludedProduct({ name: itemName })
      const hasUserDiscountApplied = hasUserDiscount && !isExcludedFromUserDiscount && !isFreeItem

      let discountLabel: string | undefined = undefined
      let originalPrice: number | undefined = undefined

      if (isFreeItem) {
        discountLabel = undefined
        originalPrice = undefined
      } else if (isBundle) {
        discountLabel = '15% OFF - Bundle'
        originalPrice = item.price / (1 - 0.15)
      } else if (hasUserDiscountApplied) {
        discountLabel = `${userDiscountPct}% OFF`
        originalPrice = item.price / (1 - userDiscountPct / 100)
      }

      return {
        productName: itemName,
        quantity: item.quantity,
        price: item.price,
        originalPrice,
        image: item.image || '',
        ...(item.size ? { size: item.size } : {}),
        ...(item.color ? { color: item.color } : {}),
        ...(discountLabel ? { discountLabel } : {})
      }
    }),
    subtotal: order.subtotal ?? undefined,
    shipping: order.shipping ?? undefined,
    vat: order.vat ?? undefined,
    address: order.customerAddress ?? undefined,
    emirate: order.customerEmirate ?? undefined,
    paymentStatus: 'PAID',
    paymentMethod: order.paymentMethod ?? 'Stripe',
    discountPercentage: hasUserDiscount ? userDiscountPct : 0,
    discountAmount: order.discountAmount ?? 0,
    bundleDiscountPercentage: order.bundleDiscountPercentage ?? undefined,
    bundleDiscountAmount: order.bundleDiscountAmount ?? undefined,
    loyaltyPointsRedeemed: order.loyaltyPointsRedeemed ?? undefined,
    loyaltyDiscountAmount: order.loyaltyDiscountAmount ?? undefined,
  })

  debugLog('📧 Admin notification sent for order:', order.orderNumber)
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('session_id')
    const paymentIntentId = searchParams.get('payment_intent')
    const orderId = searchParams.get('order_id')
    
    // Handle payment intent (embedded checkout flow)
    if (paymentIntentId) {
      return await handlePaymentIntentStatus(paymentIntentId, orderId)
    }
    
    // Handle session ID (hosted checkout flow)
    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID or Payment Intent is required' },
        { status: 400 }
      )
    }

    debugLog('🔍 Checking payment status for session:', sessionId)

    // Get session details from Stripe
    const session = await getCheckoutSession(sessionId)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      )
    }

    // Get order from database using session ID
    const order = await prisma.order.findFirst({
      where: {
        stripeSessionId: sessionId
      },
      include: {
        items: true
      }
    })

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    // Determine payment status based on Stripe session
    let paymentStatus = 'pending'
    let orderStatus = order.status
    
    switch (session.payment_status) {
      case 'paid':
        paymentStatus = 'paid'
        orderStatus = 'CONFIRMED'
        break
      case 'unpaid':
        paymentStatus = session.status === 'expired' ? 'cancelled' : 'pending'
        orderStatus = session.status === 'expired' ? 'CANCELLED' : 'PENDING'
        break
      case 'no_payment_required':
        paymentStatus = 'paid'
        orderStatus = 'CONFIRMED'
        break
      default:
        paymentStatus = 'failed'
        orderStatus = 'FAILED'
    }

    if (paymentStatus === 'paid') {
      await settleLoyaltyRedemption(order, 'session-poll')
    }

    // When a payment becomes paid, both this poll and the Stripe webhook race to
    // handle it. We atomically claim the pending -> paid transition so that
    // exactly one path marks the order paid AND sends the emails. Previously this
    // route marked the order paid but deferred emails to the webhook; if the poll
    // won, the webhook then saw the order "already paid" and skipped ALL emails -
    // so neither the customer nor the admin got notified for a paid order.
    const justBecamePaid = paymentStatus === 'paid' && order.paymentStatus !== 'paid'

    if (justBecamePaid) {
      try {
        const won = await claimPaidTransition(order.id, {
          paymentStatus: 'paid',
          status: orderStatus,
          stripePaymentIntentId: (session.payment_intent as string) || null,
          paidAt: new Date(),
          updatedAt: new Date()
        })

        if (won) {
          debugLog('📧 Payment-status poll won paid-transition, sending confirmation emails for:', order.orderNumber)
          try {
            await sendPaidConfirmationEmails(order)
          } catch (emailError) {
            // Don't fail the request if email fails
            errorLog('❌ Failed to send confirmation emails:', emailError)
          }
        } else {
          debugLog('ℹ️ Paid-transition already handled by webhook/earlier poll, skipping emails for:', order.orderNumber)
        }
      } catch (updateError) {
        errorLog('❌ Failed to update order status:', updateError)
        // Continue without failing the entire request
      }
    } else if (order.paymentStatus !== paymentStatus || order.status !== orderStatus) {
      // Non paid-transition status change (e.g. pending, cancelled, failed).
      try {
        await prisma.order.update({
          where: { id: order.id },
          data: {
            paymentStatus: paymentStatus,
            status: orderStatus,
            stripePaymentIntentId: (session.payment_intent as string) || null,
            paidAt: paymentStatus === 'paid' ? new Date() : null,
            updatedAt: new Date()
          }
        })

        debugLog('✅ Order status updated successfully:', {
          orderId: order.orderNumber,
          paymentStatus,
          orderStatus
        })
      } catch (updateError) {
        errorLog('❌ Failed to update order status:', updateError)
        // Continue without failing the entire request
      }
    }

    // Return comprehensive payment status
    return NextResponse.json({
      sessionId,
      orderId: order.orderNumber,
      paymentStatus,
      orderStatus,
      session: {
        id: session.id,
        payment_status: session.payment_status,
        status: session.status,
        amount_total: session.amount_total,
        currency: session.currency,
        customer_email: session.customer_email,
        created: session.created,
        expires_at: session.expires_at
      },
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        customerEmail: order.customerEmail,
        customerName: order.customerName,
        total: order.total,
        status: orderStatus,
        paymentMethod: order.paymentMethod,
        paymentStatus,
        createdAt: order.createdAt,
        items: order.items.map(item => ({
          productName: item.productName,
          quantity: item.quantity,
          price: item.price,
          color: item.color || '',
          size: item.size || ''
        }))
      }
    })

  } catch (error) {
    errorLog('❌ Error checking payment status:', error)
    
    if (error instanceof Error && error.message.includes('No such checkout session')) {
      return NextResponse.json(
        { error: 'Invalid session ID' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to check payment status' },
      { status: 500 }
    )
  }
}

// Handle payment intent status (for embedded checkout flow)
async function handlePaymentIntentStatus(paymentIntentId: string, orderId: string | null) {
  try {
    debugLog('🔍 Checking payment status for payment intent:', paymentIntentId)

    // Get payment intent details from Stripe
    const paymentIntent = await getPaymentIntent(paymentIntentId)
    
    if (!paymentIntent) {
      return NextResponse.json(
        { error: 'Payment intent not found' },
        { status: 404 }
      )
    }

    // Get order from database using payment intent ID or order ID
    let order = await prisma.order.findFirst({
      where: {
        stripePaymentIntentId: paymentIntentId
      },
      include: {
        items: true
      }
    })

    // Fallback: try to find by order ID if not found by payment intent
    if (!order && orderId) {
      order = await prisma.order.findFirst({
        where: {
          orderNumber: orderId
        },
        include: {
          items: true
        }
      })
    }

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    // Determine payment status based on Stripe payment intent
    let paymentStatus = 'pending'
    let orderStatus = order.status
    
    switch (paymentIntent.status) {
      case 'succeeded':
        paymentStatus = 'paid'
        orderStatus = 'CONFIRMED'
        break
      case 'processing':
        paymentStatus = 'processing'
        orderStatus = 'PENDING'
        break
      case 'requires_payment_method':
      case 'requires_confirmation':
      case 'requires_action':
        paymentStatus = 'pending'
        orderStatus = 'PENDING'
        break
      case 'canceled':
        paymentStatus = 'cancelled'
        orderStatus = 'CANCELLED'
        break
      default:
        paymentStatus = 'failed'
        orderStatus = 'FAILED'
    }

    if (paymentStatus === 'paid') {
      await settleLoyaltyRedemption(order, 'payment-intent-poll')
    }

    const justBecamePaid = paymentStatus === 'paid' && order.paymentStatus !== 'paid'

    if (justBecamePaid) {
      // Atomically claim the pending -> paid transition so emails are sent
      // exactly once across this poll and the Stripe webhook.
      try {
        const won = await claimPaidTransition(order.id, {
          paymentStatus: 'paid',
          status: orderStatus,
          stripePaymentIntentId: paymentIntentId,
          paidAt: new Date(),
          updatedAt: new Date()
        })

        if (won) {
          debugLog('📧 Payment-status poll won paid-transition (payment intent), sending emails for:', order.orderNumber)
          try {
            await sendPaidConfirmationEmails(order)
          } catch (emailError) {
            // Don't fail the request if email fails
            errorLog('❌ Failed to send confirmation emails:', emailError)
          }
        } else {
          debugLog('ℹ️ Paid-transition already handled by webhook/earlier poll, skipping emails for:', order.orderNumber)
        }
      } catch (updateError) {
        errorLog('❌ Failed to update order status:', updateError)
      }
    } else if (order.paymentStatus !== paymentStatus || order.status !== orderStatus) {
      // Non paid-transition status change (e.g. processing, cancelled, failed).
      try {
        await prisma.order.update({
          where: { id: order.id },
          data: {
            paymentStatus: paymentStatus,
            status: orderStatus,
            stripePaymentIntentId: paymentIntentId,
            paidAt: paymentStatus === 'paid' ? new Date() : null,
            updatedAt: new Date()
          }
        })

        debugLog('✅ Order status updated successfully (payment intent):', {
          orderId: order.orderNumber,
          paymentStatus,
          orderStatus
        })
      } catch (updateError) {
        errorLog('❌ Failed to update order status:', updateError)
      }
    }

    // Return comprehensive payment status
    return NextResponse.json({
      paymentIntentId,
      orderId: order.orderNumber,
      paymentStatus,
      orderStatus,
      session: {
        id: paymentIntent.id,
        payment_status: paymentStatus,
        status: paymentIntent.status,
        amount_total: paymentIntent.amount,
        currency: paymentIntent.currency,
        customer_email: paymentIntent.receipt_email,
        created: paymentIntent.created,
        expires_at: null
      },
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        customerEmail: order.customerEmail,
        customerName: order.customerName,
        total: order.total,
        status: orderStatus,
        paymentMethod: order.paymentMethod,
        paymentStatus,
        createdAt: order.createdAt,
        items: order.items.map(item => ({
          productName: item.productName,
          quantity: item.quantity,
          price: item.price,
          color: item.color || '',
          size: item.size || ''
        }))
      }
    })

  } catch (error) {
    errorLog('❌ Error checking payment intent status:', error)
    
    if (error instanceof Error && error.message.includes('No such payment_intent')) {
      return NextResponse.json(
        { error: 'Invalid payment intent ID' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to check payment status' },
      { status: 500 }
    )
  }
}

// Handle session verification for success/cancel pages
export async function POST(request: NextRequest) {
  try {
    const { sessionId } = await request.json()
    
    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      )
    }

    // Use the GET logic for consistency
    const url = new URL(request.url)
    url.searchParams.set('session_id', sessionId)
    
    const getRequest = new NextRequest(url, {
      method: 'GET',
      headers: request.headers
    })
    
    return await GET(getRequest)
    
  } catch (error) {
    errorLog('❌ Error in payment status POST:', error)
    return NextResponse.json(
      { error: 'Failed to verify session' },
      { status: 500 }
    )
  }
}