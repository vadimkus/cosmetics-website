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

/**
 * What each status says, in each language.
 *
 * Three fields, because that is the shape iOS actually renders on the Lock Screen:
 * a bold **title** for the event, a **subtitle** for which order it is, and a **body** for
 * what happens next. Cramming all three into one line, as this used to, wastes the
 * structure the platform gives you and reads as one long sentence.
 *
 * No emoji and no exclamation marks. The app icon is already on the notification carrying
 * the brand, a red tick adds nothing next to the word "confirmed", and a company selling
 * professional dermacosmetics does not shout. What it can do is be specific: every body
 * line says what happens next or what the customer can do, rather than celebrating.
 *
 * `{orderNumber}` is the placeholder. It used to be `#{orderNumber}`, where the `#` was
 * silently eaten by the substitution - so every message read "your order 46125502" while
 * the source looked like it said "#46125502". Each language now places the number the way
 * it should: Russian takes № , Arabic takes none, since a leading # in right-to-left text
 * lands on the wrong end of the digits.
 */
interface NotificationContent {
  title: string
  subtitle: string
  body: string
}

const ORDER_STATUS_MESSAGES: Record<OrderStatus, Record<Locale, NotificationContent>> = {
  PENDING: {
    en: {
      title: 'Order received',
      subtitle: 'Order #{orderNumber}',
      body: 'We have it. You will hear from us as soon as it is confirmed.',
    },
    ar: {
      title: 'استلمنا طلبك',
      subtitle: 'الطلب {orderNumber}',
      body: 'وصلنا طلبك، وسنُعلمك فور تأكيده.',
    },
    ru: {
      title: 'Заказ получен',
      subtitle: 'Заказ № {orderNumber}',
      body: 'Заказ у нас. Сообщим, как только подтвердим.',
    },
  },
  CONFIRMED: {
    en: {
      title: 'Order confirmed',
      subtitle: 'Order #{orderNumber}',
      body: 'We are preparing it for dispatch.',
    },
    ar: {
      title: 'تم تأكيد الطلب',
      subtitle: 'الطلب {orderNumber}',
      body: 'نُجهّز طلبك للشحن الآن.',
    },
    ru: {
      title: 'Заказ подтверждён',
      subtitle: 'Заказ № {orderNumber}',
      body: 'Собираем его к отправке.',
    },
  },
  PAID: {
    en: {
      title: 'Payment received',
      subtitle: 'Order #{orderNumber}',
      body: 'Nothing more to do. We are preparing it for dispatch.',
    },
    ar: {
      title: 'تم استلام الدفعة',
      subtitle: 'الطلب {orderNumber}',
      body: 'لا شيء عليك بعد الآن. نُجهّز طلبك للشحن.',
    },
    ru: {
      title: 'Оплата получена',
      subtitle: 'Заказ № {orderNumber}',
      body: 'Больше ничего не нужно - собираем заказ к отправке.',
    },
  },
  SHIPPED: {
    en: {
      title: 'On its way',
      subtitle: 'Order #{orderNumber}',
      body: 'With the courier now. Follow it in the app.',
    },
    ar: {
      title: 'طلبك في الطريق',
      subtitle: 'الطلب {orderNumber}',
      body: 'الطلب مع المندوب. تابِع التوصيل من التطبيق.',
    },
    ru: {
      title: 'Заказ в пути',
      subtitle: 'Заказ № {orderNumber}',
      body: 'Уже у курьера. Следите за доставкой в приложении.',
    },
  },
  DELIVERED: {
    en: {
      title: 'Delivered',
      subtitle: 'Order #{orderNumber}',
      body: 'Enjoy it. We would love to hear how you get on.',
    },
    ar: {
      title: 'تم التوصيل',
      subtitle: 'الطلب {orderNumber}',
      body: 'نتمنى لك تجربة رائعة، ويسعدنا أن نسمع رأيك.',
    },
    ru: {
      title: 'Заказ доставлен',
      subtitle: 'Заказ № {orderNumber}',
      body: 'Пользуйтесь с удовольствием. Будем рады отзыву.',
    },
  },
  CANCELLED: {
    en: {
      title: 'Order cancelled',
      subtitle: 'Order #{orderNumber}',
      body: 'If that was not expected, message us and we will put it right.',
    },
    ar: {
      title: 'تم إلغاء الطلب',
      subtitle: 'الطلب {orderNumber}',
      body: 'إن لم يكن ذلك متوقعاً، راسِلنا وسنتكفّل بالأمر.',
    },
    ru: {
      title: 'Заказ отменён',
      subtitle: 'Заказ № {orderNumber}',
      body: 'Если это неожиданно - напишите нам, и мы всё поправим.',
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
  const fill = (line: string) => line.split('{orderNumber}').join(orderNumber)

  return {
    title: content.title,
    subtitle: fill(content.subtitle),
    body: fill(content.body),
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
    // iOS only; Android ignores it and shows title + body, which still reads correctly
    // because the body never depends on the subtitle to make sense.
    subtitle: content.subtitle,
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
 * Send to many tokens at once and report which tokens are dead.
 *
 * `sendBatchPushNotifications` above counts successes but throws the mapping
 * back to tokens away, so a caller cannot prune stale rows. This one keeps the
 * positional link between a chunk and its tickets - Expo returns tickets in
 * request order - and hands back every token the service rejected as
 * `DeviceNotRegistered` so the caller can clear it.
 */
export async function sendExpoPushToTokens(
  messages: Array<{
    token: string
    title: string
    body: string
    data?: Record<string, unknown>
    channelId?: string
  }>
): Promise<{ sent: number; failed: number; invalidTokens: string[] }> {
  const result = { sent: 0, failed: 0, invalidTokens: [] as string[] }

  const valid = messages.filter(m => {
    if (isValidExpoPushToken(m.token)) return true
    result.failed++
    return false
  })
  if (valid.length === 0) return result

  const chunks = expo.chunkPushNotifications(
    valid.map(m => ({
      to: m.token,
      sound: 'default',
      title: m.title,
      body: m.body,
      data: m.data ?? {},
      priority: 'normal',
      channelId: m.channelId ?? 'default',
    })) as ExpoPushMessage[]
  )

  // chunkPushNotifications preserves order, so walking a cursor through the
  // original array keeps each ticket aligned with the token that produced it.
  let cursor = 0
  for (const chunk of chunks) {
    const slice = valid.slice(cursor, cursor + chunk.length)
    cursor += chunk.length
    try {
      const tickets = await expo.sendPushNotificationsAsync(chunk)
      tickets.forEach((ticket, i) => {
        if (ticket.status === 'ok') {
          result.sent++
          return
        }
        result.failed++
        const token = slice[i]?.token
        const err = (ticket as { details?: { error?: string } }).details?.error
        if (token && err === 'DeviceNotRegistered') result.invalidTokens.push(token)
      })
    } catch (error) {
      result.failed += chunk.length
      errorLog('[EXPO_PUSH] Chunk send failed:', error)
    }
  }

  debugLog(`[EXPO_PUSH] Token batch: ${result.sent} sent, ${result.failed} failed, ${result.invalidTokens.length} dead`)
  return result
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
