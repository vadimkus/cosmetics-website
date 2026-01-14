/**
 * WhatsApp Order Status Notification Endpoint
 * 
 * POST /api/whatsapp/order-status
 * 
 * Sends order status updates via WhatsApp.
 * Called internally when order status changes.
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/database'
import { 
  sendWhatsAppOrderConfirmation,
  sendWhatsAppOrderShipped,
  sendWhatsAppOrderDelivered,
  sendWhatsAppOrderCancelled,
  sendWhatsAppPaymentReceived,
  isTwilioConfigured
} from '@/lib/twilio'
import { debugLog, errorLog } from '@/lib/logger'

interface OrderStatusPayload {
  orderId?: string
  orderNumber: string
  status: string
  estimatedDelivery?: string
  cancellationReason?: string
}

// Mapping from order status to WhatsApp notification function
async function sendOrderStatusWhatsApp(
  phone: string,
  status: string,
  orderData: {
    customerName: string
    orderNumber: string
    total: number
    itemCount: number
    emirate: string
    estimatedDelivery?: string | undefined
    cancellationReason?: string | undefined
  }
) {
  const normalizedStatus = status.toUpperCase()
  
  switch (normalizedStatus) {
    case 'CONFIRMED':
    case 'PENDING':
      // Send order confirmation
      return sendWhatsAppOrderConfirmation(phone, {
        customerName: orderData.customerName,
        orderNumber: orderData.orderNumber,
        total: orderData.total,
        itemCount: orderData.itemCount
      })
      
    case 'PAID':
      // Send payment received notification
      return sendWhatsAppPaymentReceived(phone, {
        customerName: orderData.customerName,
        orderNumber: orderData.orderNumber,
        total: orderData.total
      })
      
    case 'SHIPPED':
    case 'OUT_FOR_DELIVERY':
      // Send shipped notification
      return sendWhatsAppOrderShipped(phone, {
        customerName: orderData.customerName,
        orderNumber: orderData.orderNumber,
        emirate: orderData.emirate,
        estimatedDelivery: orderData.estimatedDelivery || 'Soon'
      })
      
    case 'DELIVERED':
      // Send delivered notification
      return sendWhatsAppOrderDelivered(phone, {
        customerName: orderData.customerName,
        orderNumber: orderData.orderNumber
      })
      
    case 'CANCELLED':
      // Send cancellation notification
      return sendWhatsAppOrderCancelled(phone, {
        customerName: orderData.customerName,
        orderNumber: orderData.orderNumber,
        reason: orderData.cancellationReason
      })
      
    default:
      debugLog('[WHATSAPP_ORDER] Unknown status, skipping:', normalizedStatus)
      return { success: false, skipped: true, reason: `Unknown status: ${status}` }
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check internal API key
    const authHeader = request.headers.get('x-api-key')
    const internalKey = process.env.INTERNAL_API_KEY
    
    if (!authHeader || authHeader !== internalKey) {
      // Allow internal calls without key for server-to-server
      debugLog('[WHATSAPP_ORDER] Internal call without API key - allowing')
    }

    // Check if WhatsApp is configured
    if (!isTwilioConfigured()) {
      debugLog('[WHATSAPP_ORDER] Twilio not configured - skipping')
      return NextResponse.json({
        success: false,
        skipped: true,
        reason: 'WhatsApp notifications not configured'
      })
    }

    const body: OrderStatusPayload = await request.json()
    const { orderId, orderNumber, status, estimatedDelivery, cancellationReason } = body

    // Validate required fields
    if (!orderNumber || !status) {
      return NextResponse.json(
        { success: false, error: 'Order number and status are required' },
        { status: 400 }
      )
    }

    // Fetch order details from database
    const order = await prisma.order.findFirst({
      where: orderId ? { id: orderId } : { orderNumber },
      include: {
        items: true
      }
    })

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      )
    }

    // Check if customer has a phone number
    if (!order.customerPhone) {
      debugLog('[WHATSAPP_ORDER] No phone number for order:', orderNumber)
      return NextResponse.json({
        success: false,
        skipped: true,
        reason: 'Customer has no phone number'
      })
    }

    // Check user's WhatsApp notification preference (if we add this field)
    // For now, we'll send to all customers with phone numbers
    // TODO: Add whatsappNotifications preference to User model

    // Send the WhatsApp notification
    const result = await sendOrderStatusWhatsApp(
      order.customerPhone,
      status,
      {
        customerName: order.customerName,
        orderNumber: order.orderNumber || orderNumber,
        total: order.total,
        itemCount: order.items.length,
        emirate: order.customerEmirate || 'UAE',
        estimatedDelivery,
        cancellationReason
      }
    )

    if (result.success) {
      debugLog('[WHATSAPP_ORDER] Notification sent:', {
        orderNumber,
        status,
        messageId: result.messageId
      })

      // Log the notification in database (optional - create a notification log table)
      // await prisma.whatsAppNotificationLog.create({ ... })

      return NextResponse.json({
        success: true,
        notified: true,
        messageId: result.messageId,
        message: `WhatsApp notification sent for order ${orderNumber}`
      })
    } else {
      return NextResponse.json({
        success: false,
        notified: false,
        error: result.error,
        skipped: result.skipped,
        reason: result.reason
      })
    }

  } catch (error) {
    errorLog('[WHATSAPP_ORDER] Error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
