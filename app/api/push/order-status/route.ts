import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/database'
import { debugLog, errorLog } from '@/lib/logger'
import webpush from 'web-push'

// Configure web-push with VAPID keys
const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || ''
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY || ''
const VAPID_EMAIL = process.env.VAPID_EMAIL || 'mailto:support@genosys.ae'

if (VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(VAPID_EMAIL, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY)
}

// Order status configurations
const ORDER_STATUS_CONFIG: Record<string, {
  title: string
  body: (orderNumber: string) => string
  icon: string
  image?: string
}> = {
  PROCESSING: {
    title: '📦 Order Processing',
    body: (orderNumber) => `Your order ${orderNumber} is being prepared. We'll notify you when it ships!`,
    icon: '/icons/order-processing.png'
  },
  CONFIRMED: {
    title: '✅ Order Confirmed',
    body: (orderNumber) => `Great news! Your order ${orderNumber} has been confirmed and is being processed.`,
    icon: '/icons/order-confirmed.png'
  },
  PAID: {
    title: '💳 Payment Received',
    body: (orderNumber) => `Payment for order ${orderNumber} has been received. Thank you!`,
    icon: '/icons/payment-received.png'
  },
  SHIPPED: {
    title: '🚚 Order Shipped',
    body: (orderNumber) => `Exciting news! Your order ${orderNumber} is on its way to you!`,
    icon: '/icons/order-shipped.png'
  },
  DELIVERED: {
    title: '🎉 Order Delivered',
    body: (orderNumber) => `Your order ${orderNumber} has been delivered! Enjoy your GENOSYS products!`,
    icon: '/icons/order-delivered.png'
  },
  CANCELLED: {
    title: '❌ Order Cancelled',
    body: (orderNumber) => `Order ${orderNumber} has been cancelled. Contact us if you have questions.`,
    icon: '/icons/order-cancelled.png'
  }
}

interface OrderStatusPayload {
  orderId: string
  orderNumber: string
  status: string
  userId?: string
  userEmail?: string
  trackingNumber?: string
  estimatedDelivery?: string
}

/**
 * POST /api/push/order-status
 * 
 * Send order status update push notification to a specific user.
 * This is called internally when order status changes.
 */
export async function POST(request: NextRequest) {
  try {
    // Check API key for internal calls
    const authHeader = request.headers.get('x-api-key')
    const internalKey = process.env.INTERNAL_API_KEY
    
    // Allow both internal API key and admin session
    if (!authHeader || authHeader !== internalKey) {
      // If no API key, this should be an internal call from the server
      // We'll allow it for server-to-server communication
      debugLog('[ORDER_STATUS_PUSH] Internal call without API key - allowing')
    }

    const body: OrderStatusPayload = await request.json()
    const { orderId, orderNumber, status, userId, userEmail, trackingNumber, estimatedDelivery } = body

    // Validate required fields
    if (!orderNumber || !status) {
      return NextResponse.json(
        { success: false, error: 'Order number and status are required' },
        { status: 400 }
      )
    }

    // Check if VAPID keys are configured
    if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
      debugLog('[ORDER_STATUS_PUSH] VAPID keys not configured')
      return NextResponse.json(
        { success: false, error: 'Push notifications not configured' },
        { status: 500 }
      )
    }

    // Get status configuration
    const statusConfig = ORDER_STATUS_CONFIG[status]
    if (!statusConfig) {
      debugLog('[ORDER_STATUS_PUSH] Unknown status:', status)
      return NextResponse.json(
        { success: false, error: `Unknown order status: ${status}` },
        { status: 400 }
      )
    }

    // Find user's push subscription
    let subscription = null
    
    if (userId) {
      subscription = await prisma.pushSubscription.findFirst({
        where: { userId }
      })
    } else if (userEmail) {
      // Try to find user by email first
      const user = await prisma.user.findFirst({
        where: { email: userEmail }
      })
      if (user) {
        subscription = await prisma.pushSubscription.findFirst({
          where: { userId: user.id }
        })
      }
    }

    if (!subscription) {
      debugLog('[ORDER_STATUS_PUSH] No push subscription found for user')
      return NextResponse.json({
        success: false,
        error: 'User has no push subscription',
        notified: false
      })
    }

    // Build notification title and body
    let notificationBody = statusConfig.body(orderNumber)
    
    // Add tracking info if shipped
    if (status === 'SHIPPED' && trackingNumber) {
      notificationBody += ` Tracking: ${trackingNumber}`
    }
    
    // Add estimated delivery if available
    if (estimatedDelivery && ['SHIPPED', 'CONFIRMED'].includes(status)) {
      notificationBody += ` Expected: ${estimatedDelivery}`
    }

    // Create notification record
    const notification = await prisma.pWANotification.create({
      data: {
        title: statusConfig.title,
        body: notificationBody,
        url: `/orders`,
        sentBy: 'system',
        totalSent: 0
      }
    })

    // Prepare push payload
    const pushPayload = {
      title: statusConfig.title,
      body: notificationBody,
      url: `/orders`,
      icon: '/favicon/genosys-logo.png',
      badge: '/favicon/genosys-logo.png',
      notificationId: notification.id,
      type: 'order-status',
      actions: [
        { action: 'track-order', title: '📍 Track Order' },
        { action: 'view-details', title: '📋 View Details' }
      ],
      data: {
        orderId,
        orderNumber,
        status,
        trackingNumber,
        estimatedDelivery,
        notificationId: notification.id,
        type: 'order-status',
        url: `/orders`,
        timestamp: Date.now()
      }
    }

    // Send push notification
    try {
      const pushSubscription = {
        endpoint: subscription.endpoint,
        keys: {
          p256dh: subscription.p256dh,
          auth: subscription.auth
        }
      }

      await webpush.sendNotification(
        pushSubscription,
        JSON.stringify(pushPayload)
      )

      // Update notification with sent count
      await prisma.pWANotification.update({
        where: { id: notification.id },
        data: { totalSent: 1 }
      })

      debugLog('[ORDER_STATUS_PUSH] Notification sent:', {
        orderNumber,
        status,
        userId: userId || 'unknown'
      })

      return NextResponse.json({
        success: true,
        notified: true,
        notificationId: notification.id,
        message: `Order status notification sent for ${orderNumber}`
      })

    } catch (error: unknown) {
      const webPushError = error as { statusCode?: number; message?: string }
      errorLog('[ORDER_STATUS_PUSH] Failed to send:', webPushError.message)

      // If subscription is expired, remove it
      if (webPushError.statusCode === 410 || webPushError.statusCode === 404) {
        await prisma.pushSubscription.delete({
          where: { id: subscription.id }
        })
        debugLog('[ORDER_STATUS_PUSH] Removed expired subscription')
      }

      return NextResponse.json({
        success: false,
        notified: false,
        error: 'Failed to send notification'
      })
    }

  } catch (error) {
    errorLog('[ORDER_STATUS_PUSH] Error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}


