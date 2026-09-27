// `\b` is ASCII-only in JS regex, so it never matched after a Cyrillic word and
// "1 набор" reached English visitors unchanged. Every rule here ends on
// "not followed by a letter or digit" with the `u` flag instead.
const END = '(?![\\p{L}\\p{N}])'
const rule = (source: string) => new RegExp(source + END, 'giu')

/**
 * Normalize size values from Russian back to English
 * This handles cases where sizes were stored in Russian in the database
 */
export function normalizeSize(size: string | null | undefined): string {
  if (!size) return ''

  return size
    // кг before г
    .replace(rule('(\\d+)\\s*кг'), '$1kg')
    .replace(rule('(\\d+)\\s*мл'), '$1ml')
    .replace(rule('(\\d+)\\s*г'), '$1g')
    .replace(rule('(\\d+)\\s*шт\\.?'), '$1 pcs')
    .replace(rule('(\\d+)\\s*устр\\.?'), '$1 Device')
    .replace(rule('(\\d+)\\s*набор'), '$1 kit')
    .replace(rule('(\\d+)\\s*уп\\.?'), '$1 kit')
    .replace(rule('(\\d+)\\s*коробка'), '$1 box')
}

/**
 * Translate product size values based on locale
 * First normalizes any Russian text to English, then translates to target locale
 */
export function translateSize(size: string | null | undefined, locale: string, _category?: string): string {
  if (!size) return ''

  const normalizedSize = normalizeSize(size)
  if (locale !== 'ru') return normalizedSize

  return normalizedSize
    // kg before g
    .replace(rule('(\\d+)\\s*kg'), '$1кг')
    .replace(rule('(\\d+)\\s*ml'), '$1мл')
    .replace(rule('(\\d+)\\s*mm'), '$1мм')
    .replace(rule('(\\d+)\\s*g'), '$1г')
    .replace(rule('(\\d+)\\s*(?:pcs|pc|ea)'), '$1шт')
    .replace(rule('(\\d+)\\s+ampoules?'), '$1 ампулы')
    .replace(rule('(\\d+)\\s+sheets?'), '$1 шт.')
    .replace(rule('(\\d+)\\s+Device'), '$1 устр.')
    // A kit or set is a набор whatever the category; "уп." read as a carton.
    .replace(rule('(\\d+)\\s+(?:kit|set)'), '$1 набор')
    .replace(rule('(\\d+)\\s+box'), '$1 коробка')
}
