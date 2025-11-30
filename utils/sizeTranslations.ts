/**
 * Translate product size values based on locale
 */

export function translateSize(size: string | null | undefined, locale: string, category?: string): string {
  if (!size) return ''
  
  // For Russian locale, translate common size terms
  if (locale === 'ru') {
    // For beauty boxes, use "набор" instead of "уп."
    if (category === 'Beauty Boxes') {
      return size.replace(/\bKit\b/gi, 'набор')
    }
    // For other products, replace "Kit" with "уп." (упаковка) - case insensitive
    return size.replace(/\bKit\b/gi, 'уп.')
  }
  
  return size
}

