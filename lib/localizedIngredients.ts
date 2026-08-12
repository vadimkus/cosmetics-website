/**
 * Full INCI fallback for localised ingredient lists.
 *
 * English ingredient lists end with a "Full INCI" entry carrying the complete
 * regulatory declaration. The Arabic and Russian lists in
 * `data/productTranslations*.ts` were authored without it, so those locales used
 * to show every key ingredient except the INCI list itself.
 *
 * The declaration is language-neutral (INCI names are standardised Latin), so it
 * is read from the English product record instead of being duplicated into both
 * locale files. That keeps a regulatory field impossible to drift: update the
 * product and every locale follows.
 */

export interface IngredientItem {
  name?: string
  description?: string
  subList?: string[]
}

const DEFAULT_INCI_LABEL = 'Full INCI'

const FULL_INCI_LABEL: Record<string, string> = {
  en: DEFAULT_INCI_LABEL,
  ar: 'القائمة الكاملة للمكونات (INCI)',
  ru: 'Полный состав (INCI)',
}

/**
 * Kit products declare one INCI list per component, labelled "Full INCI (Gel)"
 * and similar. The qualifier is translated so the two rows stay tellable apart.
 */
const INCI_QUALIFIER: Record<string, Record<string, string>> = {
  ar: { gel: 'الجل', mask: 'القناع', serum: 'السيروم', cream: 'الكريم', powder: 'البودرة' },
  ru: { gel: 'гель', mask: 'маска', serum: 'сыворотка', cream: 'крем', powder: 'пудра' },
}

function localisedInciLabel(englishName: string | undefined, locale: string): string {
  const lang = locale.slice(0, 2)
  const base = FULL_INCI_LABEL[lang] ?? DEFAULT_INCI_LABEL
  const qualifier = englishName?.match(/\(([^)]+)\)\s*$/)?.[1]?.trim()
  if (!qualifier) return base
  const translated = INCI_QUALIFIER[lang]?.[qualifier.toLowerCase()] ?? qualifier
  return `${base} — ${translated}`
}

/** Matches "Full INCI", "INCI", and the Arabic/Russian labels above. */
export function isFullInciEntry(name?: string): boolean {
  if (!name) return false
  return /inci/i.test(name) || /القائمة الكاملة للمكونات/.test(name) || /полный состав/i.test(name)
}

function parseList(raw: string | null | undefined): IngredientItem[] | null {
  if (typeof raw !== 'string' || !raw.trim()) return null
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as IngredientItem[]) : null
  } catch {
    return null
  }
}

/**
 * Appends the English Full INCI entries to a localised ingredients JSON string
 * for every declaration the localised list is missing. Kit products carry one
 * per component, so this appends all of them rather than only the first.
 * Returns `localised` untouched when there is nothing to add, when either side
 * is not a JSON array, or for English.
 */
export function withFullInciFallback(
  localised: string | null | undefined,
  english: string | null | undefined,
  locale: string,
): string | null | undefined {
  if (!localised || locale === 'en') return localised

  const localisedList = parseList(localised)
  const englishList = parseList(english)
  if (!localisedList || !englishList) return localised

  const englishInci = englishList.filter((item) => isFullInciEntry(item.name) && item.description)
  if (!englishInci.length) return localised

  const present = new Set(
    localisedList.filter((item) => isFullInciEntry(item.name)).map((item) => item.description?.trim()),
  )
  const missing = englishInci.filter((item) => !present.has(item.description?.trim()))
  if (!missing.length) return localised

  return JSON.stringify([
    ...localisedList,
    ...missing.map((item) => ({ name: localisedInciLabel(item.name, locale), description: item.description })),
  ])
}
