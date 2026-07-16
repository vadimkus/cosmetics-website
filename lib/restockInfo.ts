/**
 * Temporary restock notes for out-of-stock products, keyed by product id.
 * When a product is out of stock AND listed here, the storefront shows this
 * availability badge instead of the generic "Sold out".
 *
 * Remove the entry (and flip the product back to inStock) once restocked.
 */
export const RESTOCK_NOTES: Record<string, { en: string; ru: string; ar: string }> = {
  // POWER SOLUTION SWS — out of stock 2026-07-16, next shipment ~2 weeks
  '8': { en: 'Available in 14 days', ru: 'Поступит через 14 дней', ar: 'متوفر خلال 14 يومًا' },
}

export function restockNote(productId: string | undefined, locale: string): string | null {
  if (!productId) return null
  const n = RESTOCK_NOTES[productId]
  if (!n) return null
  return locale === 'ru' ? n.ru : locale === 'ar' ? n.ar : n.en
}
