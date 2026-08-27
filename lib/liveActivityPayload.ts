/**
 * The APNs payload for the Lock Screen order card.
 *
 * The shape here is not ours to choose. `expo-widgets` renders every Live Activity
 * through one generic Swift type:
 *
 *   struct LiveActivityAttributes: ActivityAttributes {
 *     var url: String?
 *     struct ContentState { var name: String; var props: String }
 *   }
 *
 * So `content-state` carries the *name* of the layout and its props **as a JSON string**,
 * not as a nested object. Sending the props inline is the single most likely way to get a
 * push that APNs accepts with a 200 and that displays nothing at all, because ActivityKit
 * fails to decode and says so to no one.
 *
 * `attributes-type` is likewise `LiveActivityAttributes` — the generic type — and not the
 * name of our layout. `OrderActivity` is the *name* field inside the content state.
 */

export const ACTIVITY_NAME = 'OrderActivity'
export const ATTRIBUTES_TYPE = 'LiveActivityAttributes'

/** Mirrors `OrderActivityProps` in the app's `widgets/OrderActivity.tsx`. */
export type OrderActivityProps = {
  orderNumber: string
  done: number
  status: string
  steps: [string, string, string]
  cancelled?: boolean
  /**
   * The delivery promise, already translated. Absent before the order is accepted and
   * once it is delivered or cancelled — see `etaFor`.
   */
  eta?: string
}

export type ActivityLocale = 'en' | 'ar' | 'ru'

/**
 * The same strings the app puts in `i18n/messages/*.json` under `ordersDetail`.
 *
 * Duplicated rather than shared because the two live in different repositories and the
 * card must read identically whichever side started it. The step labels are the existing
 * status labels; only the first one changes with the payment method.
 */
type StringKey =
  | 'paid'
  | 'confirmed'
  | 'shipped'
  | 'delivered'
  | 'awaiting'
  | 'preparing'
  | 'onItsWay'
  | 'complete'
  | 'cancelled'
  | 'etaDubai'
  | 'etaOther'

const STRINGS: Record<ActivityLocale, Record<StringKey, string>> = {
  en: {
    paid: 'Paid',
    confirmed: 'Confirmed',
    shipped: 'Shipped',
    delivered: 'Delivered',
    awaiting: 'Waiting to be confirmed',
    preparing: 'We are preparing your order',
    onItsWay: 'On its way to you',
    complete: 'Delivered — thank you',
    cancelled: 'This order was cancelled',
    etaDubai: 'Arriving within 1–2 hours',
    etaOther: 'Arriving within 24–36 hours',
  },
  ru: {
    paid: 'Оплачено',
    confirmed: 'Подтверждён',
    shipped: 'Отправлен',
    delivered: 'Доставлен',
    awaiting: 'Ожидает подтверждения',
    preparing: 'Собираем ваш заказ',
    onItsWay: 'В пути к вам',
    complete: 'Доставлен — спасибо',
    cancelled: 'Заказ отменён',
    etaDubai: 'Доставим за 1–2 часа',
    etaOther: 'Доставим за 24–36 часов',
  },
  ar: {
    paid: 'تم الدفع',
    confirmed: 'تم التأكيد',
    shipped: 'تم الشحن',
    delivered: 'تم التوصيل',
    awaiting: 'في انتظار التأكيد',
    preparing: 'نُجهّز طلبك',
    onItsWay: 'في طريقه إليك',
    complete: 'تم التوصيل — شكرًا لك',
    cancelled: 'تم إلغاء هذا الطلب',
    etaDubai: 'يصل خلال 1–2 ساعة',
    etaOther: 'يصل خلال 24–36 ساعة',
  },
}

/**
 * How far along a status is, on the same 0-3 scale the app uses.
 *
 * CONFIRMED and PROCESSING share a rung: the server's ladder has five and the card has
 * three stops, and both of those mean accepted but not yet with a courier.
 */
const RANK: Record<string, number> = {
  pending: 0,
  confirmed: 1,
  processing: 1,
  paid: 1,
  shipped: 2,
  out_for_delivery: 2,
  delivered: 3,
  completed: 3,
}

export type OrderForActivity = {
  orderNumber: string
  status: string
  paymentMethod?: string | null
  paymentStatus?: string | null
  locale?: string | null
  /** Decides which delivery promise applies. Without it, no promise is printed. */
  customerEmirate?: string | null
}

/**
 * The delivery promise, or nothing.
 *
 * Three rules, and each one is there to stop the card saying something we have not
 * agreed to:
 *
 * 1. **Dubai only gets the hours.** One to two hours is the Careem service inside Dubai.
 *    Everywhere else is 24 to 36. Printing the Dubai window nationwide would promise
 *    an Al Ain customer something no courier is going to do.
 * 2. **Nothing before we accept.** While an order is still waiting to be confirmed we
 *    have not taken it on, and the courier clock has not started. A window there is a
 *    promise made by a form, not by us.
 * 3. **Nothing once it is over.** Delivered or cancelled, an estimate is noise.
 *
 * The wording matches what the customer already read at checkout, deliberately: the card
 * restates the promise, it does not invent a second one.
 */
function etaFor(
  emirate: string | null | undefined,
  done: number,
  cancelled: boolean,
  s: Record<StringKey, string>
): string | undefined {
  if (cancelled || done < 1 || done >= 3) return undefined
  const name = String(emirate || '').trim().toLowerCase()
  if (!name) return undefined
  return name === 'dubai' ? s.etaDubai : s.etaOther
}

const isCod = (order: OrderForActivity) => {
  const m = String(order.paymentMethod || '').toLowerCase()
  return m === 'cod' || m === 'cash' || m === 'cash_on_delivery' || m === 'partner_cod'
}

const rankOf = (order: OrderForActivity) =>
  RANK[String(order.status || '').trim().toLowerCase().replace(/\s+/g, '_')] ?? 0

const isCancelled = (order: OrderForActivity) => {
  const s = String(order.status || '').toLowerCase()
  return s === 'cancelled' || s === 'canceled' || s === 'deleted'
}

/**
 * Turn an order into the card's props.
 *
 * Must agree with `buildOrderActivityState` in the app, or the card will change wording
 * depending on whether the app or the server last touched it. The rule that matters is the
 * first step: it means *accepted*, not paid, because cash on delivery settles at the door
 * and a bar keyed on payment would sit empty until the courier knocked.
 */
export function buildOrderActivityProps(order: OrderForActivity): OrderActivityProps {
  const locale = (['en', 'ar', 'ru'] as const).includes(order.locale as ActivityLocale)
    ? (order.locale as ActivityLocale)
    : 'en'
  const s = STRINGS[locale]

  const cancelled = isCancelled(order)
  const cod = isCod(order)
  const rank = rankOf(order)
  const settled = String(order.paymentStatus || '').toLowerCase() === 'paid'

  const accepted = cod ? rank >= 1 : settled || rank >= 1
  const flags = cancelled ? [false, false, false] : [accepted, rank >= 2, rank >= 3]
  const done = flags.filter(Boolean).length

  // The step being worked on decides the sentence under the bar.
  const open = flags.findIndex(f => !f)
  const running = open === 0 ? s.awaiting : open === 1 ? s.preparing : s.onItsWay
  const status = cancelled ? s.cancelled : done === 3 ? s.complete : running

  const eta = etaFor(order.customerEmirate, done, cancelled, s)

  return {
    orderNumber: String(order.orderNumber),
    done,
    status,
    steps: [cod ? s.confirmed : s.paid, s.shipped, s.delivered],
    cancelled,
    // Omitted rather than sent empty: the widget hides the line when the key is absent.
    ...(eta ? { eta } : {}),
  }
}

export type ActivityEvent = 'start' | 'update' | 'end'

/**
 * The full APNs body.
 *
 * `timestamp` is seconds, and ActivityKit uses it to drop updates that arrive out of
 * order — a later push with an earlier timestamp is ignored rather than applied.
 */
export function buildActivityPayload(params: {
  event: ActivityEvent
  order: OrderForActivity
  /** Deep link for a tap, stored in the static attributes. Start events only. */
  url?: string
  /** Seconds. Defaults to now. */
  timestamp?: number
  /** When to take a finished card off the screen. End events only. */
  dismissalDate?: number
}): Record<string, unknown> {
  const props = buildOrderActivityProps(params.order)

  const aps: Record<string, unknown> = {
    timestamp: params.timestamp ?? Math.floor(Date.now() / 1000),
    event: params.event,
    'content-state': {
      name: ACTIVITY_NAME,
      // A JSON *string*. See the note at the top of this file.
      props: JSON.stringify(props),
    },
  }

  if (params.event === 'start') {
    aps['attributes-type'] = ATTRIBUTES_TYPE
    aps.attributes = { url: params.url ?? null }
    // Required for push-to-start: without an alert iOS will not surface the new activity.
    aps.alert = {
      title: `#${props.orderNumber}`,
      body: props.status,
    }
  }

  if (params.event === 'end' && params.dismissalDate) {
    aps['dismissal-date'] = params.dismissalDate
  }

  return { aps }
}

/** Whether an order still has something to show. */
export function shouldTrackOrder(order: OrderForActivity): boolean {
  return !isCancelled(order) && rankOf(order) < 3
}
