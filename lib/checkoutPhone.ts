/**
 * Checkout phone rule: UAE numbers in any usual form (050 123 4567, +971 50..., 971 50...),
 * or any international number written with its country code (+1 786..., 0044 7700...).
 */

const UAE_PHONE = /^(\+?971|0)(2|3|4|5|6|7|9)\d{7,8}$/
const INTERNATIONAL_PHONE = /^\+[1-9]\d{7,14}$/

export function normalizeCheckoutPhone(raw: string): string {
  const compact = String(raw || '').replace(/[\s\-().]/g, '')
  return compact.startsWith('00') ? `+${compact.slice(2)}` : compact
}

export function isValidCheckoutPhone(raw: string): boolean {
  const phone = normalizeCheckoutPhone(raw)
  if (UAE_PHONE.test(phone)) return true
  // A +971 number must pass the UAE rule; anything else only needs a country code.
  if (phone.startsWith('+971')) return false
  return INTERNATIONAL_PHONE.test(phone)
}
