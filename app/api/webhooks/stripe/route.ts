import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { validateWebhookSignature } from '@/lib/stripe'
import { prisma } from '@/lib/database'
import { sendOrderConfirmationEmail, sendAdminNewOrderNotification } from '@/lib/email'
import { trackUserAction } from '@/lib/analyticsServer'
import { debugLog, errorLog, warnLog } from '@/lib/logger'
import { getPreferredEmail } from '@/lib/emailHelpers'
import { findUserByEmail } from '@/lib/userStorageDb'
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

    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      errorLog('❌ Missing STRIPE_WEBHOOK_SECRET environment variable')
      return NextResponse.json(
        { error: 'Webhook configuration error' },
        { status: 500 }
      )
    }

    // Verify webhook signature
    let event: Stripe.Event
    try {
      event = validateWebhookSignature(body, signature, process.env.STRIPE_WEBHOOK_SECRET)
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

    // Update order status
    const updateData: any = {
      paymentStatus: session.payment_status === 'paid' ? 'paid' : 'processing',
      status: session.payment_status === 'paid' ? 'CONFIRMED' : 'PROCESSING',
      stripePaymentIntentId: session.payment_intent as string || undefined,
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

    // If payment is complete, send confirmation emails
    if (session.payment_status === 'paid') {
      await sendConfirmationEmails(order)
      
      // Track successful order completion
      trackUserAction({
        action: 'order_completed',
        userEmail: order.customerEmail,
        details: `Order #${order.orderNumber} - Payment: ${session.amount_total} fils - Stripe session: ${session.id}`
      }).catch(err => {
        errorLog('❌ Failed to track order completion:', err)
      })
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

async function sendConfirmationEmails(order: any) {
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

    // Send customer confirmation email
    await sendOrderConfirmationEmail({
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      customerEmail: emailToUse, // Use preferred email
      items: order.items.map((item: any) => ({
        productName: item.productName,
        quantity: item.quantity,
        price: item.price,
        image: item.image || '',
        ...(item.size ? { size: item.size } : {}),
        ...(item.color ? { color: item.color } : {})
      })),
      subtotal: order.subtotal || 0,
      shipping: order.shipping || 0,
      vat: order.vat || 0,
      total: order.total || 0,
      address: order.customerAddress || '',
      emirate: order.customerEmirate || '',
      locale: order.locale || 'en'
    })

    debugLog('✅ Customer confirmation email sent for order:', order.orderNumber)

    // Send admin notification
    await sendAdminNewOrderNotification({
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      customerEmail: emailToUse,
      customerPhone: order.customerPhone,
      total: order.total,
      itemCount: order.items.length,
      items: order.items.map((item: any) => ({
        productName: item.productName,
        quantity: item.quantity,
        price: item.price,
        image: item.image || '',
        ...(item.size ? { size: item.size } : {}),
        ...(item.color ? { color: item.color } : {})
      })),
      subtotal: order.subtotal,
      shipping: order.shipping,
      vat: order.vat,
      address: order.customerAddress,
      emirate: order.customerEmirate
    })

    debugLog('✅ Admin notification sent for order:', order.orderNumber)

  } catch (error) {
    errorLog('❌ Error sending confirmation emails:', error)
    // Don't throw - email failures shouldn't fail the webhook
  }
}