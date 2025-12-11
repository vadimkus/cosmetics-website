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

    // Send payment confirmation email for successful payments
    if (paymentStatus === 'paid') {
      try {
        const { sendEmail, generateStripePaymentConfirmationHTML } = await import('@/lib/email')
        
        // Get customer details from Stripe session
        const customerName = session.customer_details?.name || order.customerName || 'Customer'
        const customerEmail = session.customer_email || order.customerEmail
        const customerPhone = session.customer_details?.phone || order.customerPhone || 'N/A'
        
        // Get delivery info from session custom fields if available
        let emirate = 'N/A'
        let address = 'N/A'
        
        if (session.custom_fields && session.custom_fields.length > 0) {
          const emirateField = session.custom_fields.find(field => field.key === 'emirate')
          const addressField = session.custom_fields.find(field => field.key === 'address')
          
          emirate = emirateField?.dropdown?.value || emirate
          address = addressField?.text?.value || address
        }

        // Prepare order data for email template
        const orderData = {
          orderNumber: order.orderNumber,
          customerName,
          customerEmail,
          customerPhone,
          customerAddress: address,
          emirate,
          items: order.items.map(item => ({
            name: item.productName,
            quantity: item.quantity,
            price: item.price,
            total: item.price * item.quantity,
            size: item.size || '',
            color: item.color || ''
          })),
          subtotal: order.total, // Simplified for now
          shippingCost: 0,
          vatAmount: 0,
          total: order.total
        }

        // Generate email HTML
        const emailHTML = generateStripePaymentConfirmationHTML(orderData)
        const subject = `Payment Confirmed - Order #${order.orderNumber}`

        // Send the email
        const emailResult = await sendEmail(customerEmail, subject, emailHTML)
        
        if (emailResult.success) {
          debugLog('✅ Stripe payment confirmation email sent successfully:', {
            orderId: order.orderNumber,
            customerEmail,
            messageId: emailResult.messageId
          })
        } else {
          errorLog('❌ Failed to send Stripe payment confirmation email:', emailResult.error)
        }
      } catch (emailError) {
        errorLog('❌ Error sending Stripe payment confirmation email:', emailError)
        // Don't fail the entire request if email fails
      }
      
      // Send admin notification for new paid order
      try {
        const { sendAdminNewOrderNotification } = await import('@/lib/email')
        
        const adminOrderData = {
          orderNumber: order.orderNumber,
          customerName: order.customerName,
          customerEmail: order.customerEmail,
          customerPhone: order.customerPhone,
          total: order.total,
          itemCount: order.items.length,
          items: order.items.map(item => ({
            productName: item.productName,
            quantity: item.quantity,
            price: item.price,
            image: item.image || '',
            size: item.size || '',
            color: item.color || ''
          })),
          subtotal: order.subtotal,
          shipping: order.shipping,
          vat: order.vat,
          address: order.customerAddress
        }
        
        await sendAdminNewOrderNotification(adminOrderData)
        debugLog('✅ Admin notification sent for paid order:', order.orderNumber)
        
      } catch (adminError) {
        errorLog('❌ Failed to send admin notification:', adminError)
      }
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