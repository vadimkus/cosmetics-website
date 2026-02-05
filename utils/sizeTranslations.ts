/**
 * Normalize size values from Russian back to English
 * This handles cases where sizes were stored in Russian in the database
 */
export function normalizeSize(size: string | null | undefined): string {
  if (!size) return ''
  
  let normalized = size
  
  // Russian → English conversions
  // кг → kg
  normalized = normalized.replace(/(\d+)\s*кг\b/gi, '$1kg')
  normalized = normalized.replace(/\bкг\b/gi, 'kg')
  // мл → ml
  normalized = normalized.replace(/(\d+)\s*мл\b/gi, '$1ml')
  normalized = normalized.replace(/\bмл\b/gi, 'ml')
  // г → g (must be after кг to avoid conflicts)
  normalized = normalized.replace(/(\d+)\s*г\b/gi, '$1g')
  normalized = normalized.replace(/\bг\b/gi, 'g')
  // шт., шт → pcs
  normalized = normalized.replace(/(\d+)\s*шт\.?\b/gi, '$1 pcs')
  normalized = normalized.replace(/\bшт\.?\b/gi, 'pcs')
  // устр. → Device
  normalized = normalized.replace(/(\d+)\s*устр\.?\b/gi, '$1 Device')
  normalized = normalized.replace(/\bустр\.?\b/gi, 'Device')
  // набор → kit (for beauty boxes/kits)
  normalized = normalized.replace(/(\d+)\s*набор\b/gi, '$1 kit')
  normalized = normalized.replace(/\bнабор\b/gi, 'kit')
  // уп. → kit (упаковка)
  normalized = normalized.replace(/(\d+)\s*уп\.?\b/gi, '$1 kit')
  normalized = normalized.replace(/\bуп\.?\b/gi, 'kit')
  // box (keep as is, already English)
  
  return normalized
}

/**
 * Translate product size values based on locale
 * First normalizes any Russian text to English, then translates to target locale
 */
export function translateSize(size: string | null | undefined, locale: string, category?: string): string {
  if (!size) return ''
  
  // First normalize to English (handles cases where size was stored in Russian)
  const normalizedSize = normalizeSize(size)
  
  // For Russian locale, translate common size terms and units
  if (locale === 'ru') {
    let translated = normalizedSize
    
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
  
  // For non-Russian locales, return the normalized English version
  return normalizedSize
}

