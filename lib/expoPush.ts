/**
 * Expo Push Notification Service
 * Sends push notifications to iOS/Android apps via Expo's push notification service.
 *
 * Used for order status updates to mobile app users who have enabled push notifications.
 */

import Expo, { ExpoPushMessage, ExpoPushReceipt } from 'expo-server-sdk'
import { debugLog, errorLog } from './logger'

// Create a new Expo SDK client
const expo = new Expo()

// Order status types
export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'

// Supported locales
export type Locale = 'en' | 'ar' | 'ru'

// Notification content by status and locale
interface NotificationContent {
  title: string
  body: string
  emoji: string
}

// Beautiful notification messages for each order status
const ORDER_STATUS_MESSAGES: Record<OrderStatus, Record<Locale, NotificationContent>> = {
  PENDING: {
    en: {
      title: '🛒 Order Received!',
      body: 'We\'ve received your order #{orderNumber}. We\'ll confirm it shortly.',
      emoji: '🛒',
    },
    ar: {
      title: '🛒 تم استلام طلبك!',
      body: 'لقد استلمنا طلبك رقم #{orderNumber}. سنقوم بتأكيده قريباً.',
      emoji: '🛒',
    },
    ru: {
      title: '🛒 Заказ получен!',
      body: 'Мы получили ваш заказ #{orderNumber}. Скоро подтвердим его.',
      emoji: '🛒',
    },
  },
  CONFIRMED: {
    en: {
      title: '✅ Order Confirmed!',
      body: 'Great news! Your order #{orderNumber} has been confirmed and is being prepared.',
      emoji: '✅',
    },
    ar: {
      title: '✅ تم تأكيد طلبك!',
      body: 'أخبار رائعة! تم تأكيد طلبك رقم #{orderNumber} ويتم تجهيزه الآن.',
      emoji: '✅',
    },
    ru: {
      title: '✅ Заказ подтверждён!',
      body: 'Отличные новости! Ваш заказ #{orderNumber} подтверждён и готовится.',
      emoji: '✅',
    },
  },
  PAID: {
    en: {
      title: '💳 Payment Received!',
      body: 'Thank you! Payment for order #{orderNumber} has been received. Preparing your items now.',
      emoji: '💳',
    },
    ar: {
      title: '💳 تم استلام الدفعة!',
      body: 'شكراً لك! تم استلام الدفعة للطلب رقم #{orderNumber}. جاري تجهيز منتجاتك.',
      emoji: '💳',
    },
    ru: {
      title: '💳 Оплата получена!',
      body: 'Спасибо! Оплата заказа #{orderNumber} получена. Готовим ваши товары.',
      emoji: '💳',
    },
  },
  SHIPPED: {
    en: {
      title: '📦 Order Shipped!',
      body: 'Your order #{orderNumber} is on its way! Track your delivery in the app.',
      emoji: '📦',
    },
    ar: {
      title: '📦 تم شحن طلبك!',
      body: 'طلبك رقم #{orderNumber} في الطريق إليك! تتبع التوصيل عبر التطبيق.',
      emoji: '📦',
    },
    ru: {
      title: '📦 Заказ отправлен!',
      body: 'Ваш заказ #{orderNumber} в пути! Отслеживайте доставку в приложении.',
      emoji: '📦',
    },
  },
  DELIVERED: {
    en: {
      title: '🎉 Order Delivered!',
      body: 'Your order #{orderNumber} has been delivered. Enjoy your GENOSYS products!',
      emoji: '🎉',
    },
    ar: {
      title: '🎉 تم توصيل طلبك!',
      body: 'تم توصيل طلبك رقم #{orderNumber}. استمتع بمنتجات جينوسيس!',
      emoji: '🎉',
    },
    ru: {
      title: '🎉 Заказ доставлен!',
      body: 'Ваш заказ #{orderNumber} доставлен. Наслаждайтесь продуктами GENOSYS!',
      emoji: '🎉',
    },
  },
  CANCELLED: {
    en: {
      title: '❌ Order Cancelled',
      body: 'Your order #{orderNumber} was cancelled. If this wasn\u2019t expected, message us — we\u2019ll make it right.',
      emoji: '❌',
    },
    ar: {
      title: '❌ تم إلغاء الطلب',
      body: 'تم إلغاء طلبك رقم #{orderNumber}. إذا لم يكن ذلك متوقعاً، راسلنا وسنصحح الأمر فوراً.',
      emoji: '❌',
    },
    ru: {
      title: '❌ Заказ отменён',
      body: 'Ваш заказ #{orderNumber} отменён. Если это неожиданно — напишите нам, и мы всё исправим.',
      emoji: '❌',
    },
  },
}

/**
 * Get notification content for a given status and locale
 */
function getNotificationContent(
  status: OrderStatus,
  orderNumber: string,
  locale: Locale = 'en'
): NotificationContent {
  const messages = ORDER_STATUS_MESSAGES[status]
  const content = messages[locale] || messages.en

  return {
    title: content.title,
    body: content.body.replace('#{orderNumber}', orderNumber),
    emoji: content.emoji,
  }
}

/**
 * Check if a push token is valid Expo format
 */
export function isValidExpoPushToken(token: string | null | undefined): token is string {
  return !!token && Expo.isExpoPushToken(token)
}

/**
 * Send a push notification for order status update
 */
export async function sendOrderStatusPushNotification(params: {
  expoPushToken: string
  orderNumber: string
  status: OrderStatus
  orderId: string
  locale?: Locale
}): Promise<{ success: boolean; ticketId?: string; error?: string }> {
  const { expoPushToken, orderNumber, status, orderId, locale = 'en' } = params

  // Validate token
  if (!isValidExpoPushToken(expoPushToken)) {
    debugLog(`[EXPO_PUSH] Invalid token format: ${String(expoPushToken).substring(0, 20)}...`)
    return { success: false, error: 'Invalid Expo push token format' }
  }

  // Get notification content
  const content = getNotificationContent(status, orderNumber, locale)

  // Build the push message
  const message: ExpoPushMessage = {
    to: expoPushToken,
    sound: 'default',
    title: content.title,
    body: content.body,
    data: {
      type: 'order_status',
      orderId,
      orderNumber,
      status,
    },
    badge: 1,
    // iOS specific - critical notifications for important updates
    priority: 'high',
    // Android specific - notification channel
    channelId: 'orders',
  }

  try {
    // Send the notification
    const tickets = await expo.sendPushNotificationsAsync([message])
    const ticket = tickets[0]
    if (!ticket) {
      return { success: false, error: 'No ticket returned from Expo' }
    }

    if (ticket.status === 'ok') {
      debugLog(`[EXPO_PUSH] ✅ Notification sent for order ${orderNumber} (status: ${status})`)
      return { success: true, ticketId: ticket.id }
    } else {
      // Handle errors
      const errorDetails = (ticket as { message?: string; details?: { error?: string } }).message || 'Unknown error'
      errorLog(`[EXPO_PUSH] ❌ Failed to send notification:`, errorDetails)
      
      // Check for specific error types
      if ((ticket as { details?: { error?: string } }).details?.error === 'DeviceNotRegistered') {
        // Token is no longer valid - should be removed from database
        return { success: false, error: 'DeviceNotRegistered' }
      }
      
      return { success: false, error: errorDetails }
    }
  } catch (error) {
    errorLog('[EXPO_PUSH] ❌ Exception sending notification:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

/**
 * Send push notifications to multiple tokens (batch)
 * Useful for sending to all devices of a user or promotional notifications
 */
export async function sendBatchPushNotifications(
  messages: ExpoPushMessage[]
): Promise<{ successful: number; failed: number; errors: string[] }> {
  // Filter to valid tokens only
  const validMessages = messages.filter((msg) => {
    const token = Array.isArray(msg.to) ? msg.to[0] : msg.to
    return isValidExpoPushToken(token)
  })

  if (validMessages.length === 0) {
    return { successful: 0, failed: messages.length, errors: ['No valid tokens'] }
  }

  // Chunk messages (Expo recommends max 100 per request)
  const chunks = expo.chunkPushNotifications(validMessages)
  const results = { successful: 0, failed: 0, errors: [] as string[] }

  for (const chunk of chunks) {
    try {
      const tickets = await expo.sendPushNotificationsAsync(chunk)
      
      tickets.forEach((ticket) => {
        if (ticket.status === 'ok') {
          results.successful++
        } else {
          results.failed++
          const errorMsg = (ticket as { message?: string }).message || 'Unknown error'
          if (!results.errors.includes(errorMsg)) {
            results.errors.push(errorMsg)
          }
        }
      })
    } catch (error) {
      results.failed += chunk.length
      const errorMsg = error instanceof Error ? error.message : 'Unknown error'
      if (!results.errors.includes(errorMsg)) {
        results.errors.push(errorMsg)
      }
    }
  }

  debugLog(`[EXPO_PUSH] Batch send complete: ${results.successful} successful, ${results.failed} failed`)
  return results
}

/**
 * Check receipts for sent notifications (for debugging delivery issues)
 * Call this after a delay (e.g., 15 minutes) to verify delivery
 */
export async function checkPushReceipts(
  ticketIds: string[]
): Promise<Record<string, ExpoPushReceipt>> {
  const receiptIdChunks = expo.chunkPushNotificationReceiptIds(ticketIds)
  const allReceipts: Record<string, ExpoPushReceipt> = {}

  for (const chunk of receiptIdChunks) {
    try {
      const receipts = await expo.getPushNotificationReceiptsAsync(chunk)
      Object.assign(allReceipts, receipts)
    } catch (error) {
      errorLog('[EXPO_PUSH] Error fetching receipts:', error)
    }
  }

  return allReceipts
}
