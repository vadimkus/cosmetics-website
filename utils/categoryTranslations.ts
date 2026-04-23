/**
 * Translate product category names using a locale message bundle.
 *
 * Refactored in the C1 mobile-bundle pass: previously this module statically
 * imported `en.json`, `ar.json`, and `ru.json` which shipped all three
 * locale bundles to every mobile client. Now callers pass the active
 * `messages` object (obtained from `useTranslation()` which sources it from
 * `MessagesProvider`), so only the current locale's data lives in the
 * client payload.
 */

import type { Messages } from '@/types/translations'

const CATEGORY_KEY_MAP: Record<string, string> = {
  serum: 'serum',
  cleanser: 'cleanser',
  peeling: 'peeling',
  'toner/mist': 'tonerMist',
  toner: 'tonerMist',
  mist: 'tonerMist',
  cream: 'cream',
  mask: 'mask',
  sun: 'sun',
  'cushion bb': 'cushionBb',
  cushion: 'cushionBb',
  'scalp/hair': 'scalpHair',
  scalp: 'scalpHair',
  hair: 'scalpHair',
  'eye care': 'eyeCare',
  eye: 'eyeCare',
  device: 'device',
  'holiday kits': 'holidayKits',
  holiday: 'holidayKits',
  'beauty boxes': 'beautyBoxes',
  'beauty box': 'beautyBoxes',
  microneedling: 'microneedling',
  'pro solution': 'proSolution',
  'pro-solution': 'proSolution',
}

/**
 * @param category - Raw category string from the Product record (e.g. "Serum")
 * @param messages - Active locale message bundle from `useTranslation().messages`
 * @returns Translated category name, or the original string if no mapping exists
 */
export function translateCategory(
  category: string | null | undefined,
  messages: Messages
): string {
  if (!category) return ''

  const normalizedCategory = category.trim().toLowerCase()
  const translationKey = CATEGORY_KEY_MAP[normalizedCategory]
  if (!translationKey) return category

  const productsMessages = (messages as unknown as { products?: Record<string, string> }).products
  const translated = productsMessages?.[translationKey]

  return typeof translated === 'string' && translated ? translated : category
}
