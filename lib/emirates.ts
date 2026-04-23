/**
 * UAE emirate list — a single source of truth for <select> dropdowns in
 * signup / address / checkout forms.
 *
 * Rules:
 *  - `value` is ALWAYS the English name — this is what gets persisted to the
 *    backend and echoed back in orders / shipping labels. Do not translate.
 *  - `label.{en,ar,ru}` is what's shown to the user in the dropdown.
 *
 * Order follows the emirate roster on the UAE government portal (u.ae):
 *   Abu Dhabi, Dubai, Sharjah, Ajman, Umm Al Quwain, Ras Al Khaimah, Fujairah.
 * We place Dubai first because the majority of our traffic / customers are
 * Dubai-based and the dropdown is read top-down.
 */

import type { Locale } from '@/lib/i18n'

export interface Emirate {
  value: string
  label: {
    en: string
    ar: string
    ru: string
  }
}

export const EMIRATES: readonly Emirate[] = [
  {
    value: 'Dubai',
    label: { en: 'Dubai', ar: 'دبي', ru: 'Дубай' },
  },
  {
    value: 'Abu Dhabi',
    label: { en: 'Abu Dhabi', ar: 'أبوظبي', ru: 'Абу-Даби' },
  },
  {
    value: 'Sharjah',
    label: { en: 'Sharjah', ar: 'الشارقة', ru: 'Шарджа' },
  },
  {
    value: 'Ajman',
    label: { en: 'Ajman', ar: 'عجمان', ru: 'Аджман' },
  },
  {
    value: 'Ras Al Khaimah',
    label: { en: 'Ras Al Khaimah', ar: 'رأس الخيمة', ru: 'Рас-эль-Хайма' },
  },
  {
    value: 'Fujairah',
    label: { en: 'Fujairah', ar: 'الفجيرة', ru: 'Фуджейра' },
  },
  {
    value: 'Umm Al Quwain',
    label: { en: 'Umm Al Quwain', ar: 'أم القيوين', ru: 'Умм-эль-Кайвайн' },
  },
] as const

/** Return the localized display label for an emirate value. */
export function getEmirateLabel(value: string, locale: Locale): string {
  const match = EMIRATES.find(e => e.value === value)
  if (!match) return value
  return match.label[locale] ?? match.label.en
}
