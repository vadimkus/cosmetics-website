/**
 * Locale-aware pluralization helper.
 *
 * Uses the browser's Intl.PluralRules to pick the correct CLDR plural category
 * for a given count and locale, then resolves the matching form via the provided
 * resolver. Resolver is called lazily for only the categories the runtime
 * actually needs, which prevents missing-translation warnings in locales that
 * don't use (e.g.) `few`/`many`.
 *
 * CLDR categories:
 *   - en: one, other
 *   - ru: one, few, many, other
 *   - ar: zero, one, two, few, many, other
 *
 * Usage:
 *   plural(cartCount, locale, cat => t(`pwaProfile.item${cap(cat)}`))
 *
 * Or via a forms object (for ad-hoc cases):
 *   pluralFrom(count, locale, { one: 'товар', few: 'товара', many: 'товаров' })
 */

export type PluralCategory = 'zero' | 'one' | 'two' | 'few' | 'many' | 'other'

export type PluralForms = Partial<Record<PluralCategory, string>>

const CACHE = new Map<string, Intl.PluralRules>()

function getRules(locale: string): Intl.PluralRules {
  const cached = CACHE.get(locale)
  if (cached) return cached
  const rules = new Intl.PluralRules(locale)
  CACHE.set(locale, rules)
  return rules
}

/**
 * Lazy resolver version — only calls `resolve` for categories the runtime
 * actually needs. Falls back through `other` → `one` on misses.
 */
export function plural(
  count: number,
  locale: string,
  resolve: (category: PluralCategory) => string | undefined
): string {
  let picked: PluralCategory = 'other'
  try {
    picked = getRules(locale).select(count) as PluralCategory
  } catch {
    // Intl.PluralRules not available — use fallback.
  }
  const primary = resolve(picked)
  if (primary && !looksLikeMissingKey(primary)) return primary
  const other = resolve('other')
  if (other && !looksLikeMissingKey(other)) return other
  const one = resolve('one')
  if (one && !looksLikeMissingKey(one)) return one
  return primary ?? other ?? one ?? ''
}

/**
 * Forms-object convenience API for cases where you already have the strings in
 * hand (e.g. non-i18n code or tests).
 */
export function pluralFrom(
  count: number,
  locale: string,
  forms: PluralForms
): string {
  let picked: PluralCategory = 'other'
  try {
    picked = getRules(locale).select(count) as PluralCategory
  } catch {
    // fall through
  }
  return forms[picked] ?? forms.other ?? forms.one ?? Object.values(forms)[0] ?? ''
}

// Heuristic for detecting useTranslation's "key not found" fallback, which
// returns the key path itself (e.g. "pwaProfile.itemTwo"). Looks for at least
// one dot and no whitespace.
function looksLikeMissingKey(value: string): boolean {
  return /^[a-z][a-zA-Z0-9_]*(\.[a-zA-Z0-9_]+)+$/.test(value)
}
