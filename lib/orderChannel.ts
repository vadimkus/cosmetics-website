/**
 * Resolve whether an order was placed via the mobile app or the website.
 *
 * The channel is encoded directly in the order number (see lib/orderNumber.ts):
 *   CODM… / GENCardM…  → mobile app   ('M')
 *   CODW… / GENCardW…  → website      ('W')
 * Older web orders use the legacy `GEN` + YYMMDD + counter format (no channel
 * letter) and are treated as website. As a backstop, mobile payment flows also
 * stamp `source: 'mobile_app'` into the order's paymentMetadata.
 */

export type OrderChannel = 'app' | 'website'

export function resolveOrderChannel(input: {
  orderNumber?: string | null
  paymentMetadata?: string | null
}): OrderChannel {
  const orderNumber = String(input.orderNumber || '').trim()

  // 1) Channel letter right after the prefix (COD | GENCard | PART)
  const m = orderNumber.match(/^(?:COD|GENCard|PART)([MW])/i)
  if (m && m[1]) return m[1].toUpperCase() === 'M' ? 'app' : 'website'

  // 2) Backstop: mobile flows tag paymentMetadata.source = 'mobile_app'
  if (input.paymentMetadata) {
    try {
      const meta = JSON.parse(input.paymentMetadata)
      const source = String(meta?.source || '').toLowerCase()
      if (source === 'mobile_app' || source === 'app') return 'app'
      if (source === 'website' || source === 'web') return 'website'
    } catch {
      /* not JSON — ignore */
    }
  }

  // 3) Default: legacy GEN… web format and everything else → website
  return 'website'
}

/** Human label for the admin email (with an icon). */
export function orderChannelLabel(channel: OrderChannel): string {
  return channel === 'app' ? '📱 Mobile App' : '🌐 Website'
}
