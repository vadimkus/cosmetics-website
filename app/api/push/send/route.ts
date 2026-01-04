import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/database'
import { debugLog, errorLog } from '@/lib/logger'
import { requireAdminAuth } from '@/lib/adminAuth'
import { requireCsrfToken } from '@/lib/csrf'
import webpush from 'web-push'

// Configure web-push with VAPID keys
const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || ''
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY || ''
const VAPID_EMAIL = process.env.VAPID_EMAIL || 'mailto:support@genosys.ae'

if (VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(VAPID_EMAIL, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY)
}

interface PushPayload {
  title: string
  body: string
  url?: string
  icon?: string
  badge?: string
  image?: string
  notificationId?: string
  // Rich notification features
  type?: 'promotion' | 'order-status' | 'cart-reminder' | 'price-drop' | 'back-in-stock' | 'general'
  actions?: Array<{
    action: string
    title: string
    icon?: string
  }>
  data?: Record<string, unknown>
}

/**
 * POST /api/push/send
 * 
 * Admin endpoint to send push notifications to all PWA users.
 * Can optionally link to a promotion for content reuse.
 */
export async function POST(request: NextRequest) {
  // Admin authentication
  const auth = await requireAdminAuth(request)
  if (!auth.authorized) return auth.response

  // CSRF protection
  const csrfCheck = await requireCsrfToken(request)
  if (!csrfCheck.valid) return csrfCheck.response!

  try {
    const body = await request.json()
    const { 
      title, 
      titleRu, 
      titleAr, 
      body: messageBody, 
      bodyRu, 
      bodyAr, 
      url,
      promotionId 
    } = body

    // Validate required fields
    if (!title || !messageBody) {
      return NextResponse.json(
        { success: false, error: 'Title and body are required' },
        { status: 400 }
      )
    }

    // Check if VAPID keys are configured
    if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
      return NextResponse.json(
        { success: false, error: 'Push notifications not configured. VAPID keys missing.' },
        { status: 500 }
      )
    }

    // Create notification record in database
    const notification = await prisma.pWANotification.create({
      data: {
        promotionId: promotionId || null,
        title,
        titleRu: titleRu || null,
        titleAr: titleAr || null,
        body: messageBody,
        bodyRu: bodyRu || null,
        bodyAr: bodyAr || null,
        url: url || '/profile/promo',
        sentBy: auth.user?.email || 'admin',
        totalSent: 0
      }
    })

    // Get all push subscriptions
    const subscriptions = await prisma.pushSubscription.findMany()

    debugLog('[PUSH_SEND] Sending notifications:', {
      notificationId: notification.id,
      totalSubscriptions: subscriptions.length,
      title
    })

    // Determine notification type
    const notificationType = body.type || 'promotion'

    // Define actions based on notification type
    const actionsByType: Record<string, PushPayload['actions']> = {
      'promotion': [
        { action: 'view', title: 'View Offer', icon: '/icons/gift.png' },
        { action: 'shop', title: 'Shop Now', icon: '/icons/cart.png' }
      ],
      'order-status': [
        { action: 'track', title: 'Track Order', icon: '/icons/track.png' },
        { action: 'view', title: 'View Details', icon: '/icons/order.png' }
      ],
      'cart-reminder': [
        { action: 'checkout', title: 'Complete Purchase', icon: '/icons/checkout.png' },
        { action: 'view-cart', title: 'View Cart', icon: '/icons/cart.png' }
      ],
      'price-drop': [
        { action: 'buy-now', title: 'Buy Now', icon: '/icons/sale.png' },
        { action: 'view', title: 'View Product', icon: '/icons/product.png' }
      ],
      'back-in-stock': [
        { action: 'buy-now', title: 'Add to Cart', icon: '/icons/cart.png' },
        { action: 'view', title: 'View Product', icon: '/icons/product.png' }
      ],
      'general': [
        { action: 'view', title: 'View', icon: '/icons/view.png' },
        { action: 'dismiss', title: 'Dismiss', icon: '/icons/close.png' }
      ]
    }

    // Get actions for this notification type (with fallback to general)
    const notificationActions = actionsByType[notificationType] ?? actionsByType['general'] ?? []

    // Prepare push payload with rich notification features
    const pushPayload: PushPayload = {
      title,
      body: messageBody,
      url: url || '/profile/promo',
      icon: '/favicon/genosys-logo.png',
      badge: '/favicon/genosys-logo.png',
      notificationId: notification.id,
      type: notificationType,
      actions: notificationActions,
      data: {
        notificationId: notification.id,
        type: notificationType,
        url: url || '/profile/promo',
        orderId: body.orderId,
        productId: body.productId,
        timestamp: Date.now()
      }
    }

    // Add image if provided
    if (body.image) {
      pushPayload.image = body.image
    }

    // Send push notifications to all subscribers
    let successCount = 0
    let failCount = 0
    const failedEndpoints: string[] = []

    await Promise.allSettled(
      subscriptions.map(async (sub) => {
        try {
          const pushSubscription = {
            endpoint: sub.endpoint,
            keys: {
              p256dh: sub.p256dh,
              auth: sub.auth
            }
          }

          await webpush.sendNotification(
            pushSubscription,
            JSON.stringify(pushPayload)
          )
          successCount++
        } catch (error: any) {
          failCount++
          errorLog(`[PUSH_SEND] Failed to send to ${sub.endpoint.substring(0, 50)}:`, error.message)
          
          // If subscription is expired/invalid (410 Gone or 404), remove it
          if (error.statusCode === 410 || error.statusCode === 404) {
            failedEndpoints.push(sub.endpoint)
          }
        }
      })
    )

    // Clean up expired subscriptions
    if (failedEndpoints.length > 0) {
      await prisma.pushSubscription.deleteMany({
        where: {
          endpoint: { in: failedEndpoints }
        }
      })
      debugLog('[PUSH_SEND] Cleaned up expired subscriptions:', failedEndpoints.length)
    }

    // Update notification with sent count
    await prisma.pWANotification.update({
      where: { id: notification.id },
      data: { totalSent: successCount }
    })

    debugLog('[PUSH_SEND] Notifications sent:', {
      notificationId: notification.id,
      success: successCount,
      failed: failCount,
      cleaned: failedEndpoints.length
    })

    return NextResponse.json({
      success: true,
      message: `Push notification sent to ${successCount} users`,
      notificationId: notification.id,
      stats: {
        total: subscriptions.length,
        success: successCount,
        failed: failCount,
        cleanedUp: failedEndpoints.length
      }
    })

  } catch (error) {
    errorLog('[PUSH_SEND] Error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to send push notification' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/push/send
 * 
 * Get list of sent notifications and subscriber count (admin only)
 */
export async function GET(request: NextRequest) {
  const auth = await requireAdminAuth(request)
  if (!auth.authorized) return auth.response

  try {
    // Get notifications
    const notifications = await prisma.pWANotification.findMany({
      orderBy: { sentAt: 'desc' },
      take: 50,
      include: {
        _count: {
          select: { reads: true }
        }
      }
    })

    // Get total active subscribers count
    const subscribersCount = await prisma.pushSubscription.count()

    return NextResponse.json({
      success: true,
      subscribersCount,
      notifications: notifications.map(n => ({
        ...n,
        readCount: n._count.reads
      }))
    })

  } catch (error) {
    errorLog('[PUSH_SEND] GET error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch notifications' },
      { status: 500 }
    )
  }
}

