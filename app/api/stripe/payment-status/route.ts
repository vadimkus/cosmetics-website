import { NextRequest, NextResponse } from 'next/server'
import { getCheckoutSession } from '@/lib/stripe'
import { prisma } from '@/lib/database'
import { debugLog, errorLog } from '@/lib/logger'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('session_id')
    
    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
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

    // NOTE: All confirmation emails (both customer and admin) are sent by the Stripe webhook handler
    // (/api/webhooks/stripe/route.ts) to avoid duplicate emails due to race conditions.
    // This endpoint is only for checking/updating payment status, NOT for sending emails.
    // The webhook is the single source of truth for email notifications.
    if (paymentStatus === 'paid' && order.paymentStatus !== 'paid') {
      debugLog('ℹ️ Order status changing to paid - emails handled by Stripe webhook for:', order.orderNumber)
    } else if (paymentStatus === 'paid') {
      debugLog('ℹ️ Order already marked as paid:', order.orderNumber)
    }

    // Update order status if it has changed (separate from email sending)
    if (order.paymentStatus !== paymentStatus || order.status !== orderStatus) {
      try {
        const updateData = {
          paymentStatus: paymentStatus,
          status: orderStatus,
          stripePaymentIntentId: session.payment_intent as string || null,
          paidAt: paymentStatus === 'paid' ? new Date() : null,
          updatedAt: new Date()
        }
        
        await prisma.order.update({
          where: { id: order.id },
          data: updateData
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