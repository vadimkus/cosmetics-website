/**
 * Website ↔ MoySklad address mapping.
 *
 * Agreed website canonical form (Aug 2026):
 *   `Street, City, UAE`  e.g. `Binghatti Jasmine 218, Dubai, UAE`
 *
 * MoySklad structured `*AddressFull` already has country + city fields.
 * Putting city/UAE into `street` makes the UI show:
 *   `UAE, Dubai, Binghatti Jasmine 218, Dubai, UAE`
 *
 * Rule: street = street-only; city = emirate; country = UAE; addInfo empty.
 */

const EMIRATES = [
  'Abu Dhabi',
  'Dubai',
  'Sharjah',
  'Ajman',
  'Ras Al Khaimah',
  'Umm Al Quwain',
  'Fujairah',
] as const

function isCountryToken(part: string): boolean {
  return /^(uae|u\.a\.e\.?|united arab emirates|оаэ)$/i.test(part.trim())
}

function isEmirateToken(part: string): boolean {
  const key = part.trim().toLowerCase().replace(/\s+/g, ' ')
  return EMIRATES.some((e) => e.toLowerCase() === key) || key === 'rak'
}

/**
 * Extract street-only text for MoySklad `shipmentAddressFull.street` /
 * `actualAddressFull.street` from a website canonical address.
 */
export function streetForMoySklad(
  customerAddress: string | undefined,
  customerEmirate?: string | undefined,
): string {
  let s = String(customerAddress || '')
    .replace(/\s+/g, ' ')
    .trim()
  if (!s) return ''

  s = s.replace(/\s*,\s*/g, ', ').replace(/^,+|,+$/g, '').trim()
  let parts = s.split(',').map((p) => p.trim()).filter(Boolean)

  // Drop trailing country / emirate tokens (and postal 00000 noise).
  while (parts.length) {
    const last = parts[parts.length - 1]!
    if (isCountryToken(last) || isEmirateToken(last) || /^00000$/.test(last)) {
      parts.pop()
      continue
    }
    break
  }

  // If emirate still appears as a trailing segment equal to customerEmirate, drop it.
  const em = String(customerEmirate || '').trim()
  if (em && parts.length) {
    const last = parts[parts.length - 1]!
    if (last.toLowerCase() === em.toLowerCase()) parts.pop()
  }

  return parts.join(', ').trim()
}

/** Structured MoySklad address fragment (no addInfo — avoids street duplication). */
export function buildMoySkladAddressFull(
  customerAddress: string | undefined,
  customerEmirate: string | undefined,
  countryEntityMeta: { meta: { href: string; type: string; mediaType: string } },
): {
  country: { meta: { href: string; type: string; mediaType: string } }
  city?: string
  street?: string
} {
  const street = streetForMoySklad(customerAddress, customerEmirate)
  const city = String(customerEmirate || '').trim()
  return {
    country: countryEntityMeta,
    ...(city ? { city } : {}),
    ...(street ? { street } : {}),
  }
}
