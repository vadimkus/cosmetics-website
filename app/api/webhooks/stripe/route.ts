import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { validateWebhookSignature } from '@/lib/stripe'
import { prisma } from '@/lib/database'
import { sendOrderConfirmationEmail, sendAdminNewOrderNotification } from '@/lib/email'
import { trackUserAction } from '@/lib/analyticsServer'
import { debugLog, errorLog, warnLog } from '@/lib/logger'
import { STRIPE_WEBHOOK_SECRET } from '@/lib/envValidation'
import { getPreferredEmail } from '@/lib/emailHelpers'
import { findUserByEmail } from '@/lib/userStorageDb'
import { isUserDiscountExcludedProduct } from '@/lib/mobileDiscountRules'
import { createMoySkladOrder, isMoySkladEnabled } from '@/lib/moysklad'
import Stripe from 'stripe'

// Disable body parsing for webhooks
export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    // Get the raw body for signature verification
    const body = await request.text()
    const headersList = await headers()
    const signature = headersList.get('stripe-signature')
    
    if (!signature) {
      errorLog('❌ Missing Stripe signature header')
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 400 }
      )
    }

    if (!STRIPE_WEBHOOK_SECRET) {
      errorLog('❌ Missing STRIPE_WEBHOOK_SECRET environment variable')
      return NextResponse.json(
        { error: 'Webhook configuration error' },
        { status: 500 }
      )
    }

    // Verify webhook signature
    let event: Stripe.Event
    try {
      event = validateWebhookSignature(body, signature, STRIPE_WEBHOOK_SECRET)
    } catch (error) {
      errorLog('❌ Webhook signature verification failed:', error)
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      )
    }

    debugLog('🎉 Stripe webhook received:', {
      type: event.type,
      id: event.id,
      created: event.created
    })

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session)
        break
      
      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent)
        break
      
      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent)
        break
      
      case 'invoice.payment_succeeded':
        // Handle subscription payments (if needed in future)
        debugLog('📧 Invoice payment succeeded:', event.data.object.id)
        break
      
      case 'invoice.payment_failed':
        // Handle failed subscription payments (if needed in future)
        warnLog('⚠️ Invoice payment failed:', event.data.object.id)
        break
      
      default:
        debugLog('🔄 Unhandled webhook event type:', event.type)
    }

    // Return success response to Stripe
    return NextResponse.json({ received: true })

  } catch (error) {
    errorLog('❌ Webhook processing error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  try {
    debugLog('✅ Processing checkout.session.completed:', {
      sessionId: session.id,
      paymentStatus: session.payment_status,
      customerEmail: session.customer_email
    })

    // Find the order by Stripe session ID
    const order = await prisma.order.findFirst({
      where: {
        stripeSessionId: session.id
      },
      include: {
        items: true
      }
    })

    if (!order) {
      errorLog('❌ Order not found for session:', session.id)
      return
    }

    // Update order status - build the update object dynamically to handle optional fields
    const updateData: {
      paymentStatus: string
      status: string
      stripePaymentIntentId?: string
      paymentMetadata: string
      updatedAt: Date
      paidAt?: Date
    } = {
      paymentStatus: session.payment_status === 'paid' ? 'paid' : 'processing',
      status: session.payment_status === 'paid' ? 'CONFIRMED' : 'PROCESSING',
      paymentMetadata: JSON.stringify({
        sessionId: session.id,
        paymentIntentId: session.payment_intent,
        amountTotal: session.amount_total,
        currency: session.currency,
        customerEmail: session.customer_email,
        completedAt: new Date(session.created * 1000).toISOString()
      }),
      updatedAt: new Date()
    }

    // Only set stripePaymentIntentId if it exists
    if (session.payment_intent) {
      updateData.stripePaymentIntentId = session.payment_intent as string
    }

    if (session.payment_status === 'paid') {
      updateData.paidAt = new Date()
    }

    await prisma.order.update({
      where: { id: order.id },
      data: updateData
    })

    debugLog('✅ Order updated after checkout completion:', {
      orderId: order.orderNumber,
      paymentStatus: updateData.paymentStatus,
      status: updateData.status
    })

    // If payment is complete and order wasn't already marked as paid, send confirmation emails
    // This prevents duplicate emails if Stripe retries the webhook
    const wasAlreadyPaid = order.paymentStatus === 'paid'
    
    if (session.payment_status === 'paid' && !wasAlreadyPaid) {
      debugLog('📧 Order newly paid, sending confirmation emails:', order.orderNumber)
      await sendConfirmationEmails(order)
      
      // Track successful order completion
      trackUserAction({
        action: 'order_completed',
        userEmail: order.customerEmail,
        details: `Order #${order.orderNumber} - Payment: ${session.amount_total} fils - Stripe session: ${session.id}`
      }).catch(err => {
        errorLog('❌ Failed to track order completion:', err)
      })

      // Create order in MoySklad (non-blocking - fire and forget)
      if (isMoySkladEnabled()) {
        createMoySkladOrder({
          orderNumber: order.orderNumber,
          customerName: order.customerName,
          customerEmail: order.customerEmail,
          customerPhone: order.customerPhone || '',
          customerAddress: order.customerAddress || '',
          customerEmirate: order.customerEmirate || '',
          items: order.items.map((item: { productName: string; quantity: number; price: number }) => ({
            productName: item.productName,
            quantity: item.quantity,
            price: item.price,
          })),
          total: order.total,
          shipping: order.shipping || 0,
          paymentMethod: 'stripe',
        }).then(result => {
          if (result.success) {
            debugLog('✅ MoySklad: Stripe order synced:', result.moySkladOrderId)
          } else {
            errorLog('❌ MoySklad: Stripe order sync failed:', result.error)
          }
        }).catch(err => {
          errorLog('❌ MoySklad: Stripe order sync exception:', err)
        })
      }
    } else if (wasAlreadyPaid) {
      debugLog('ℹ️ Order already marked as paid, skipping duplicate emails:', order.orderNumber)
    }

  } catch (error) {
    errorLog('❌ Error handling checkout.session.completed:', error)
  }
}

async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  try {
    debugLog('✅ Processing payment_intent.succeeded:', {
      paymentIntentId: paymentIntent.id,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency
    })

    // Find order by payment intent ID
    const order = await prisma.order.findFirst({
      where: {
        stripePaymentIntentId: paymentIntent.id
      },
      include: {
        items: true
      }
    })

    if (!order) {
      debugLog('🔍 No order found for payment intent:', paymentIntent.id)
      return
    }

    // Update order to paid status
    await prisma.order.update({
      where: { id: order.id },
      data: {
        paymentStatus: 'paid',
        status: 'CONFIRMED',
        paidAt: new Date(),
        paymentMetadata: JSON.stringify({
          paymentIntentId: paymentIntent.id,
          amount: paymentIntent.amount,
          currency: paymentIntent.currency,
          paidAt: new Date().toISOString()
        }),
        updatedAt: new Date()
      }
    })

    debugLog('✅ Order marked as paid:', {
      orderId: order.orderNumber,
      paymentIntentId: paymentIntent.id
    })

    // Send confirmation emails if not already sent
    await sendConfirmationEmails(order)

  } catch (error) {
    errorLog('❌ Error handling payment_intent.succeeded:', error)
  }
}

async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  try {
    debugLog('❌ Processing payment_intent.payment_failed:', {
      paymentIntentId: paymentIntent.id,
      failureCode: paymentIntent.last_payment_error?.code,
      failureMessage: paymentIntent.last_payment_error?.message
    })

    // Find order by payment intent ID
    const order = await prisma.order.findFirst({
      where: {
        stripePaymentIntentId: paymentIntent.id
      }
    })

    if (!order) {
      debugLog('🔍 No order found for failed payment intent:', paymentIntent.id)
      return
    }

    // Update order to failed status
    await prisma.order.update({
      where: { id: order.id },
      data: {
        paymentStatus: 'failed',
        status: 'FAILED',
        paymentMetadata: JSON.stringify({
          paymentIntentId: paymentIntent.id,
          failureCode: paymentIntent.last_payment_error?.code,
          failureMessage: paymentIntent.last_payment_error?.message,
          failedAt: new Date().toISOString()
        }),
        updatedAt: new Date()
      }
    })

    debugLog('❌ Order marked as failed:', {
      orderId: order.orderNumber,
      paymentIntentId: paymentIntent.id,
      reason: paymentIntent.last_payment_error?.message
    })

    // Track failed payment
    trackUserAction({
      action: 'payment_failed',
      userEmail: order.customerEmail,
      details: `Order #${order.orderNumber} - Payment failed: ${paymentIntent.last_payment_error?.message || 'Unknown error'}`
    }).catch(err => {
      errorLog('❌ Failed to track payment failure:', err)
    })

  } catch (error) {
    errorLog('❌ Error handling payment_intent.payment_failed:', error)
  }
}

interface OrderItem {
  productName: string
  quantity: number
  price: number
  image?: string | null
  size?: string | null
  color?: string | null
}

interface OrderWithItems {
  id: string
  orderNumber: string
  customerName: string
  customerEmail: string
  customerPhone?: string | null | undefined
  customerAddress?: string | null | undefined
  customerEmirate?: string | null | undefined
  subtotal?: number | null | undefined
  shipping?: number | null | undefined
  vat?: number | null | undefined
  total: number
  locale?: string | null | undefined
  paymentStatus?: string | null | undefined
  paymentMethod?: string | null | undefined
  discountAmount?: number | null | undefined
  bundleDiscountPercentage?: number | null | undefined
  bundleDiscountAmount?: number | null | undefined
  items: OrderItem[]
}

async function sendConfirmationEmails(order: OrderWithItems) {
  try {
    // Fetch user to get preferred email (for Apple Private Relay users with contactEmail)
    const user = await findUserByEmail(order.customerEmail)
    const emailToUse = user ? getPreferredEmail(user) : order.customerEmail

    debugLog('📧 Sending Stripe confirmation emails:', {
      orderNumber: order.orderNumber,
      customerEmail: emailToUse,
      hasUser: !!user,
      hasContactEmail: !!(user?.contactEmail),
      emailToUse,
      isAppleRelay: order.customerEmail.includes('@privaterelay.appleid.com')
    })

    // Calculate discount info for items
    const userDiscountPct = Number(user?.discountPercentage || 0)
    const hasUserDiscount = Number.isFinite(userDiscountPct) && userDiscountPct > 0 && userDiscountPct < 100
    
    // Send customer confirmation email
    await sendOrderConfirmationEmail({
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      customerEmail: emailToUse, // Use preferred email
      items: order.items.map((item) => {
        const itemName = item.productName || 'Product'
        
        // Check item type for discount labeling
        const isFreeItem = item.price === 0 || itemName.toLowerCase().includes('(free)')
        const isBundle = itemName.toLowerCase().includes('beauty box') || itemName.toLowerCase().includes('bundle')
        const isExcludedFromUserDiscount = isUserDiscountExcludedProduct({ name: itemName })
        const hasUserDiscountApplied = hasUserDiscount && !isExcludedFromUserDiscount && !isFreeItem
        
        // Determine discount label
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
      bundleDiscountAmount: order.bundleDiscountAmount ?? undefined
    })

    debugLog('✅ Customer confirmation email sent for order:', order.orderNumber)

    // Send admin notification
    await sendAdminNewOrderNotification({
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      customerEmail: emailToUse,
      customerPhone: order.customerPhone ?? undefined,
      total: order.total,
      itemCount: order.items.length,
      items: order.items.map((item) => {
        const itemName = item.productName || 'Product'
        
        // Check item type for discount labeling (same logic as customer email)
        const isFreeItem = item.price === 0 || itemName.toLowerCase().includes('(free)')
        const isBundle = itemName.toLowerCase().includes('beauty box') || itemName.toLowerCase().includes('bundle')
        const isExcludedFromUserDiscount = isUserDiscountExcludedProduct({ name: itemName })
        const hasUserDiscountApplied = hasUserDiscount && !isExcludedFromUserDiscount && !isFreeItem
        
        // Determine discount label and original price
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
      bundleDiscountAmount: order.bundleDiscountAmount ?? undefined
    })

    debugLog('✅ Admin notification sent for order:', order.orderNumber)

  } catch (error) {
    errorLog('❌ Error sending confirmation emails:', error)
    // Don't throw - email failures shouldn't fail the webhook
  }
}