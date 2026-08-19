import type { Locale } from '@/lib/i18n'

/**
 * Studio slides that exist in more than one language.
 *
 * The problem this solves: a claim slide is a picture of text. On the Arabic and Russian
 * pages every word around it is translated and the slide is still in English, which is the
 * one part of the page a customer cannot read. Translating the slides fixes that, but the
 * gallery comes from a single `images` field on one product row, so there is nowhere in
 * the database to put a second language.
 *
 * So the database keeps one canonical path and the swap happens at render:
 *
 *     /images/cera_o/s1.jpeg   +  ru   ->  /images/cera_o/ru/s1.jpeg
 *
 * The localized file sits in a `<locale>` subfolder beside the default under the same
 * filename. Nothing about the product record changes when a language is added, and
 * English is unaffected.
 *
 * WHY AN EXPLICIT FILE LIST rather than probing for the file. This runs in the browser
 * and during SSR, where a filesystem check is not available; guessing a path and letting
 * it 404 would put broken images on the page and noise in the logs. Listing the files
 * means an unlisted slide silently keeps the English version, which is the safe failure.
 *
 * TO ADD A LANGUAGE: drop the files into `<folder>/<locale>/` under the same names, then
 * add the locale here. There is no database work and no cache key to bump, because the
 * record never mentions the localized path.
 *
 * NOT COVERED: the mobile app reads `images` straight from the API, which returns the
 * canonical paths, so the app still shows the English slides. Fixing that means running
 * the same mapping in the mobile product routes.
 */
const LOCALIZED_SLIDES: Record<string, Partial<Record<Locale, readonly string[]>>> = {
  // Product 66, CERABARRIER BIOME GEL CLEANSER. Main.jpeg is a packshot with no text on
  // it, so it is deliberately absent from both languages: there is nothing to translate
  // and shipping a second identical file would only cost a download.
  '/images/cera_o': {
    ru: ['s1.jpeg', 's2.jpeg', 's3.jpeg', 's4.jpeg', 's5.jpeg', 's6.jpeg', 's7.jpeg'],
    ar: ['s1.jpeg', 's2.jpeg', 's3.jpeg', 's4.jpeg', 's5.jpeg', 's6.jpeg', 's7.jpeg'],
  },
}

/**
 * Web passes a bare 'ru'; the mobile app sends an `x-locale` header that may be a full
 * tag such as 'ru-RU'. Both have to resolve to the same folder.
 */
function normalizeLocale(locale: string | undefined): Locale | null {
  if (!locale) return null
  const base = locale.toLowerCase().split(/[-_]/)[0]
  return base === 'ru' || base === 'ar' ? base : null
}

/**
 * The localized variant of `src` for `locale`, or `src` unchanged when no translated file
 * is registered. Safe to call on every image path, including ones with no localization.
 */
export function localizeProductImage(src: string, locale: string | undefined): string {
  if (!src) return src

  const normalized = normalizeLocale(locale)
  if (!normalized) return src

  const lastSlash = src.lastIndexOf('/')
  if (lastSlash < 0) return src

  const folder = src.slice(0, lastSlash)
  const file = src.slice(lastSlash + 1)

  const files = LOCALIZED_SLIDES[folder]?.[normalized]
  if (!files || !files.includes(file)) return src

  return `${folder}/${normalized}/${file}`
}

/**
 * Same mapping over a JSON-encoded `images` column, returned in the same shape. The
 * mobile routes hand this column through untouched, so they can localize without having
 * to parse and re-encode it themselves.
 */
export function localizeProductImagesJson(
  imagesJson: string | null | undefined,
  locale: string | undefined
): string | null {
  if (!imagesJson) return imagesJson ?? null
  if (!normalizeLocale(locale)) return imagesJson

  try {
    const parsed = JSON.parse(imagesJson)
    if (!Array.isArray(parsed)) return imagesJson
    return JSON.stringify(parsed.map((src: unknown) =>
      typeof src === 'string' ? localizeProductImage(src, locale) : src
    ))
  } catch {
    // A malformed column is a pre-existing problem; do not turn it into a new one.
    return imagesJson
  }
}

/** Convenience for galleries. Preserves order and length. */
export function localizeProductImages(list: readonly string[], locale: string | undefined): string[] {
  return list.map(src => localizeProductImage(src, locale))
}

/** Exposed for tests and for a future admin view of which sets are translated. */
export function getLocalizedSlideManifest() {
  return LOCALIZED_SLIDES
}
