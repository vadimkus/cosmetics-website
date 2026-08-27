import { prisma } from '@/lib/prisma'
import { debugLog, errorLog } from '@/lib/logger'
import { isApnsConfigured, sendOrderActivity } from '@/lib/apnsLiveActivity'
import { shouldTrackOrder, type OrderForActivity } from '@/lib/liveActivityPayload'

/**
 * Keep an order's Lock Screen card in step with its status.
 *
 * Called from wherever a status changes. It decides between the three events itself, so
 * callers do not have to reason about ActivityKit:
 *
 *   - no card yet, order still moving  -> **start**, on the user's push-to-start token
 *   - card exists, order still moving  -> **update**, on that order's own token
 *   - order delivered or cancelled     -> **end**, showing the final state briefly
 *
 * The two tokens are not interchangeable, and using the wrong one returns
 * `DeviceTokenNotForTopic` from Apple without explaining itself, so which is used where is
 * decided here once rather than at each call site.
 */
export async function syncOrderLiveActivity(params: {
  orderId: string
  status: string
}): Promise<void> {
  if (!isApnsConfigured()) return

  const order = await prisma.order.findUnique({
    where: { id: params.orderId },
    select: {
      orderNumber: true,
      customerEmail: true,
      paymentMethod: true,
      paymentStatus: true,
      locale: true,
      customerEmirate: true,
      liveActivityToken: true,
    },
  })
  if (!order) return

  const forActivity: OrderForActivity = {
    orderNumber: order.orderNumber,
    status: params.status,
    paymentMethod: order.paymentMethod,
    paymentStatus: order.paymentStatus,
    locale: order.locale,
    customerEmirate: order.customerEmirate,
  }

  const finished = !shouldTrackOrder(forActivity)

  // A card that already exists is updated or ended on its own token.
  if (order.liveActivityToken) {
    const result = await sendOrderActivity({
      token: order.liveActivityToken,
      event: finished ? 'end' : 'update',
      order: forActivity,
      // Leave the finished state up for a few minutes rather than snatching it away.
      ...(finished ? { dismissalDate: Math.floor(Date.now() / 1000) + 15 * 60 } : {}),
    })

    // Once ended, or once Apple says the token is dead, stop holding it.
    if (finished || result.gone) {
      await prisma.order
        .update({ where: { id: params.orderId }, data: { liveActivityToken: null } })
        .catch(error => errorLog('[LIVE_ACTIVITY] could not clear token:', error))
    }
    return
  }

  // Nothing to end if there was never a card.
  if (finished) return

  const user = await prisma.user.findUnique({
    where: { email: order.customerEmail },
    select: { id: true, liveActivityStartToken: true },
  })
  if (!user?.liveActivityStartToken) {
    debugLog('[LIVE_ACTIVITY] no push-to-start token for', order.customerEmail)
    return
  }

  const result = await sendOrderActivity({
    token: user.liveActivityStartToken,
    event: 'start',
    order: forActivity,
    url: `genosys://profile/orders/${params.orderId}`,
  })

  if (result.gone) {
    await prisma.user
      .update({ where: { id: user.id }, data: { liveActivityStartToken: null } })
      .catch(error => errorLog('[LIVE_ACTIVITY] could not clear start token:', error))
  }
}
