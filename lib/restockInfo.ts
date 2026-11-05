import { useEffect, useState } from 'react'

/**
 * Temporary restock notes for out-of-stock products, keyed by product id.
 * When a product is out of stock AND listed here, the storefront shows this
 * availability badge instead of the generic "Sold out".
 *
 * An entry is either fixed text, or an arrival date (Dubai calendar day) from
 * which the badge counts down: "Coming in 35 days", then 34 the next day, and
 * "Coming soon" once the date is reached.
 *
 * Remove the entry (and flip the product back to inStock) once restocked.
 */
type FixedNote = { en: string; ru: string; ar: string }
type DatedNote = { availableOn: string }

export const RESTOCK_NOTES: Record<string, FixedNote | DatedNote> = {
  // POWER SOLUTION SWS (8) restocked 2026-07-26 - note removed
  // INTENSIVE BLEMISH BALM CREAM (42) restocked 2026-11-05 - note removed
  // SKIN BARRIER PROTECTING CREAM — out of stock 2026-10-30; 35 days on 2026-11-04
  '27': { availableOn: '2026-12-09' },
}

const DAY_MS = 86_400_000

function utcDay(ymd: string): number {
  const [y = 0, m = 1, d = 1] = ymd.split('-').map(Number)
  return Date.UTC(y, m - 1, d)
}

function dubaiDay(now: number): number {
  return utcDay(new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Dubai' }).format(now))
}

export function daysUntil(availableOn: string, now: number = Date.now()): number {
  return Math.round((utcDay(availableOn) - dubaiDay(now)) / DAY_MS)
}

function countdownText(days: number, locale: string): string {
  if (locale === 'ru') {
    if (days <= 0) return 'Скоро в наличии'
    const form = new Intl.PluralRules('ru').select(days)
    const word = form === 'one' ? 'день' : form === 'few' ? 'дня' : 'дней'
    return `Поступит через ${days} ${word}`
  }
  if (locale === 'ar') {
    if (days <= 0) return 'متوفر قريبًا'
    switch (new Intl.PluralRules('ar').select(days)) {
      case 'one': return 'متوفر خلال يوم واحد'
      case 'two': return 'متوفر خلال يومين'
      case 'few': return `متوفر خلال ${days} أيام`
      case 'many': return `متوفر خلال ${days} يومًا`
      default: return `متوفر خلال ${days} يوم`
    }
  }
  if (days <= 0) return 'Coming soon'
  return `Coming in ${days} ${days === 1 ? 'day' : 'days'}`
}

export function restockNote(productId: string | undefined, locale: string, now: number = Date.now()): string | null {
  if (!productId) return null
  const n = RESTOCK_NOTES[productId]
  if (!n) return null
  if ('availableOn' in n) return countdownText(daysUntil(n.availableOn, now), locale)
  return locale === 'ru' ? n.ru : locale === 'ar' ? n.ar : n.en
}

/**
 * Restock note for a client component. Pages are cached for up to an hour, so
 * the server-rendered count can be from yesterday; after mount the count is
 * recomputed from the visitor's clock. Put `suppressHydrationWarning` on the
 * element that prints it.
 */
export function useRestockNote(productId: string | undefined, locale: string, inStock: boolean): string | null {
  const [now, setNow] = useState<number | null>(null)
  useEffect(() => setNow(Date.now()), [])
  if (inStock) return null
  return restockNote(productId, locale, now ?? undefined)
}
