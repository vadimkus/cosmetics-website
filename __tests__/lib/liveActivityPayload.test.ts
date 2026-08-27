import {
  ACTIVITY_NAME,
  ATTRIBUTES_TYPE,
  buildActivityPayload,
  buildOrderActivityProps,
  shouldTrackOrder,
} from '@/lib/liveActivityPayload'

/**
 * This payload is a contract with a Swift struct we do not own, and the failure mode when
 * it is wrong is silent: APNs returns 200 and the Lock Screen shows nothing. So the shape
 * is pinned here rather than discovered on a device.
 */
describe('the wire format', () => {
  const order = { orderNumber: '46125502', status: 'SHIPPED', paymentMethod: 'cod' }

  it('nests the props as a JSON string, not as an object', () => {
    const body = buildActivityPayload({ event: 'update', order }) as {
      aps: { 'content-state': { name: string; props: string } }
    }
    const state = body.aps['content-state']

    expect(state.name).toBe(ACTIVITY_NAME)
    // The single most likely mistake: sending the props inline.
    expect(typeof state.props).toBe('string')
    expect(JSON.parse(state.props)).toEqual({
      orderNumber: '46125502',
      orderLabel: 'Order #46125502',
      done: 2,
      status: 'On its way to you',
      steps: ['Confirmed', 'Shipped', 'Delivered'],
      cancelled: false,
    })
  })

  it('names the generic attributes type, not our layout', () => {
    const body = buildActivityPayload({ event: 'start', order, url: 'genosys://x' }) as {
      aps: Record<string, unknown>
    }
    // `OrderActivity` is the name *inside* the content state; the type is the shared one.
    expect(body.aps['attributes-type']).toBe(ATTRIBUTES_TYPE)
    expect(body.aps['attributes-type']).not.toBe(ACTIVITY_NAME)
    expect(body.aps.attributes).toEqual({ url: 'genosys://x' })
  })

  it('carries an alert on start, without which push-to-start shows nothing', () => {
    const body = buildActivityPayload({ event: 'start', order }) as { aps: Record<string, unknown> }
    expect(body.aps.alert).toEqual({ title: '#46125502', body: 'On its way to you' })
  })

  it('sends no attributes on an update', () => {
    const body = buildActivityPayload({ event: 'update', order }) as { aps: Record<string, unknown> }
    expect(body.aps['attributes-type']).toBeUndefined()
    expect(body.aps.attributes).toBeUndefined()
  })

  it('stamps a second-resolution timestamp so stale updates are dropped', () => {
    const body = buildActivityPayload({ event: 'update', order, timestamp: 1750000000 }) as {
      aps: { timestamp: number }
    }
    expect(body.aps.timestamp).toBe(1750000000)
  })

  it('can schedule a finished card off the screen', () => {
    const body = buildActivityPayload({
      event: 'end',
      order: { ...order, status: 'DELIVERED' },
      dismissalDate: 1750003600,
    }) as { aps: Record<string, unknown> }
    expect(body.aps['dismissal-date']).toBe(1750003600)
  })
})

/**
 * The card and the in-app tracker must never disagree, so these mirror the app's
 * `smoke-order-progress.js`. Step one means *accepted*, not paid.
 */
describe('progress, matching the app', () => {
  const cod = (status: string, paymentStatus = 'pending') => ({
    orderNumber: '1',
    status,
    paymentMethod: 'cod',
    paymentStatus,
  })
  const card = (status: string, paymentStatus: string) => ({
    orderNumber: '1',
    status,
    paymentMethod: 'stripe',
    paymentStatus,
  })

  it.each([
    ['PENDING', 0],
    ['CONFIRMED', 1],
    ['PROCESSING', 1],
    ['SHIPPED', 2],
    ['DELIVERED', 3],
  ])('cash on delivery at %s is %i steps in', (status, done) => {
    expect(buildOrderActivityProps(cod(status)).done).toBe(done)
  })

  it('labels the first COD step as acceptance', () => {
    expect(buildOrderActivityProps(cod('CONFIRMED')).steps[0]).toBe('Confirmed')
  })

  it('labels the first prepaid step as payment', () => {
    expect(buildOrderActivityProps(card('PENDING', 'paid')).steps[0]).toBe('Paid')
  })

  it('a failed card payment is no progress', () => {
    expect(buildOrderActivityProps(card('PENDING', 'failed')).done).toBe(0)
  })

  it('a cancelled order empties the bar and says so', () => {
    const props = buildOrderActivityProps({ orderNumber: '1', status: 'CANCELLED' })
    expect(props.done).toBe(0)
    expect(props.cancelled).toBe(true)
    expect(props.status).toBe('This order was cancelled')
  })

  it('translates', () => {
    const ru = buildOrderActivityProps({ ...cod('SHIPPED'), locale: 'ru' })
    expect(ru.steps).toEqual(['Подтверждён', 'Отправлен', 'Доставлен'])
    expect(ru.status).toBe('В пути к вам')

    const ar = buildOrderActivityProps({ ...cod('DELIVERED'), locale: 'ar' })
    expect(ar.status).toBe('تم التوصيل — شكرًا لك')
  })

  it('falls back to English for a locale we do not carry', () => {
    expect(buildOrderActivityProps({ ...cod('SHIPPED'), locale: 'fr' }).steps[1]).toBe('Shipped')
  })
})

/**
 * The one thing on the card that is a commitment rather than a report. The same rules are
 * pinned in the app's `scripts/smoke-order-progress.js`, because a card that promises one
 * window when the app touches it and another when the server does is worse than a card
 * that promises nothing.
 */
describe('the delivery promise', () => {
  const at = (customerEmirate: string, status: string, locale?: string) =>
    buildOrderActivityProps({
      orderNumber: '1',
      status,
      paymentMethod: 'cod',
      customerEmirate,
      ...(locale ? { locale } : {}),
    })

  it('gives Dubai the hours it is actually promised', () => {
    expect(at('Dubai', 'CONFIRMED').eta).toBe('Arriving in Dubai within 1–2 hours')
    expect(at('dubai', 'SHIPPED').eta).toBe('Arriving in Dubai within 1–2 hours')
  })

  /**
   * Naming the destination is what makes two different windows read as fair rather than
   * arbitrary. A customer in Ajman should see why theirs says a day and a half.
   */
  it('does not promise the rest of the country a Dubai courier', () => {
    expect(at('Abu Dhabi', 'CONFIRMED').eta).toBe('Arriving in Abu Dhabi within 24–36 hours')
    expect(at('Sharjah', 'SHIPPED').eta).toBe('Arriving in Sharjah within 24–36 hours')
    expect(at('Ras Al-Khaimah', 'CONFIRMED').eta).toBe(
      'Arriving in Ras Al Khaimah within 24–36 hours'
    )
    expect(at('umm al quwain', 'CONFIRMED').eta).toBe(
      'Arriving in Umm Al Quwain within 24–36 hours'
    )
  })

  it('falls back to what was entered for a place we do not translate', () => {
    expect(at('Al Ain', 'CONFIRMED').eta).toBe('Arriving in Al Ain within 24–36 hours')
  })

  it('leaves no placeholder unfilled', () => {
    for (const emirate of ['Dubai', 'Sharjah', 'Al Ain']) {
      for (const locale of ['en', 'ru', 'ar']) {
        expect(at(emirate, 'CONFIRMED', locale).eta).not.toContain('{place}')
      }
    }
  })

  it.each([
    ['before we have accepted it', 'PENDING'],
    ['once it has arrived', 'DELIVERED'],
    ['once it is cancelled', 'CANCELLED'],
  ])('promises nothing %s', (_why, status) => {
    expect(at('Dubai', status).eta).toBeUndefined()
  })

  it('promises nothing when we do not know where it is going', () => {
    expect(buildOrderActivityProps({ orderNumber: '1', status: 'CONFIRMED' }).eta).toBeUndefined()
    expect(at('   ', 'CONFIRMED').eta).toBeUndefined()
  })

  /**
   * Each language phrases this its own way. Russian leads with the place and a colon
   * rather than "в {place}", which would need the accusative — Шарджа becomes Шарджу —
   * and a format string cannot decline a noun.
   */
  it('translates the place as well as the window', () => {
    expect(at('Dubai', 'CONFIRMED', 'ru').eta).toBe('Дубай: доставим за 1–2 часа')
    expect(at('Dubai', 'CONFIRMED', 'ar').eta).toBe('دبي: يصل خلال 1–2 ساعة')
    expect(at('Sharjah', 'CONFIRMED', 'ru').eta).toBe('Шарджа: доставим за 24–36 часов')
    expect(at('Sharjah', 'CONFIRMED', 'ar').eta).toBe('الشارقة: يصل خلال 24–36 ساعة')
  })

  it('is left out of the payload rather than sent empty', () => {
    const body = buildActivityPayload({ event: 'update', order: at2('PENDING') })
    const state = (body as { aps: { 'content-state': { props: string } } }).aps['content-state']
    expect(JSON.parse(state.props)).not.toHaveProperty('eta')
  })

  const at2 = (status: string) => ({
    orderNumber: '1',
    status,
    paymentMethod: 'cod',
    customerEmirate: 'Dubai',
  })
})

describe('the order number', () => {
  const at = (locale: string) =>
    buildOrderActivityProps({ orderNumber: '46125502', status: 'CONFIRMED', locale })

  it('reads as a sentence rather than a bare code', () => {
    expect(at('en').orderLabel).toBe('Order #46125502')
    expect(at('ru').orderLabel).toBe('Заказ №46125502')
  })

  /** A leading # in right-to-left text lands on the wrong end of the digits. */
  it('takes neither a hash nor a № in Arabic', () => {
    expect(at('ar').orderLabel).toBe('الطلب 46125502')
    expect(at('ar').orderLabel).not.toContain('#')
  })

  it('keeps the raw number too, for the push alert', () => {
    expect(at('en').orderNumber).toBe('46125502')
  })
})

describe('what gets a card', () => {
  it('an order on its way does', () => {
    expect(shouldTrackOrder({ orderNumber: '1', status: 'SHIPPED' })).toBe(true)
  })
  it('a delivered one does not', () => {
    expect(shouldTrackOrder({ orderNumber: '1', status: 'DELIVERED' })).toBe(false)
  })
  it('a cancelled one does not', () => {
    expect(shouldTrackOrder({ orderNumber: '1', status: 'CANCELLED' })).toBe(false)
  })
})
