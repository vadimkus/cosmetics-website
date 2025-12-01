/**
 * Translate product size values based on locale
 */

export function translateSize(size: string | null | undefined, locale: string, category?: string): string {
  if (!size) return ''
  
  // For Russian locale, translate common size terms and units
  if (locale === 'ru') {
    let translated = size
    
    // Replace units - match after numbers (with or without spaces)
    // kg → кг (must be before g to avoid conflicts)
    translated = translated.replace(/(\d+)\s*kg\b/gi, '$1кг')
    translated = translated.replace(/\bkg\b/gi, 'кг')
    // ml → мл
    translated = translated.replace(/(\d+)\s*ml\b/gi, '$1мл')
    translated = translated.replace(/\bml\b/gi, 'мл')
    // g → г (after kg to avoid conflicts)
    translated = translated.replace(/(\d+)\s*g\b/gi, '$1г')
    translated = translated.replace(/\bg\b/gi, 'г')
    // pcs → шт
    translated = translated.replace(/(\d+)\s*pcs\b/gi, '$1шт')
    translated = translated.replace(/\bpcs\b/gi, 'шт')
    // ea → шт (alternative abbreviation)
    translated = translated.replace(/(\d+)\s*ea\b/gi, '$1шт')
    translated = translated.replace(/\bea\b/gi, 'шт')
    // sheets → шт. (plural)
    translated = translated.replace(/(\d+)\s+sheets\b/gi, '$1 шт.')
    translated = translated.replace(/\bsheets\b/gi, 'шт.')
    // sheet → шт. (singular)
    translated = translated.replace(/(\d+)\s+sheet\b/gi, '$1 шт.')
    translated = translated.replace(/\bsheet\b/gi, 'шт.')
    // Device → устр.
    translated = translated.replace(/(\d+)\s+Device\b/gi, '$1 устр.')
    translated = translated.replace(/\bDevice\b/gi, 'устр.')
    
    // For beauty boxes, use "набор" instead of "уп."
    if (category === 'Beauty Boxes') {
      translated = translated.replace(/(\d+)\s+kit\b/gi, '$1 набор')
      translated = translated.replace(/\bkit\b/gi, 'набор')
    } else {
      // For other products, replace "kit" with "уп." (упаковка) - case insensitive
      translated = translated.replace(/(\d+)\s+kit\b/gi, '$1 уп.')
      translated = translated.replace(/\bkit\b/gi, 'уп.')
    }
    
    return translated
  }
  
  return size
}

