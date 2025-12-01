/**
 * Translate product category names based on locale
 */

import enMessages from '@/messages/en.json'
import arMessages from '@/messages/ar.json'
import ruMessages from '@/messages/ru.json'

/**
 * Translate category name based on locale
 * @param category - The category name to translate (e.g., "Serum", "Cream", "Mask")
 * @param locale - The locale code ('en', 'ar', 'ru')
 * @returns Translated category name
 */
export function translateCategory(category: string | null | undefined, locale: string): string {
  if (!category) return ''
  
  // Normalize category name (lowercase, trim)
  const normalizedCategory = category.trim().toLowerCase()
  
  // Map category names to translation keys
  const categoryKeyMap: Record<string, string> = {
    'serum': 'serum',
    'cleanser': 'cleanser',
    'peeling': 'peeling',
    'toner/mist': 'tonerMist',
    'toner': 'tonerMist',
    'mist': 'tonerMist',
    'cream': 'cream',
    'mask': 'mask',
    'sun': 'sun',
    'cushion bb': 'cushionBb',
    'cushion': 'cushionBb',
    'scalp/hair': 'scalpHair',
    'scalp': 'scalpHair',
    'hair': 'scalpHair',
    'eye care': 'eyeCare',
    'eye': 'eyeCare',
    'device': 'device',
    'holiday kits': 'holidayKits',
    'holiday': 'holidayKits',
    'beauty boxes': 'beautyBoxes',
    'beauty box': 'beautyBoxes',
    'microneedling': 'microneedling',
    'pro solution': 'proSolution',
    'pro-solution': 'proSolution'
  }
  
  // Get the translation key
  const translationKey = categoryKeyMap[normalizedCategory]
  
  if (!translationKey) {
    // If no mapping found, return original category
    return category
  }
  
  // Get messages based on locale - use products section for category translations
  let productsMessages: Record<string, string> | undefined
  switch (locale) {
    case 'ar':
      productsMessages = arMessages.products as Record<string, string>
      break
    case 'ru':
      productsMessages = ruMessages.products as Record<string, string>
      break
    default:
      productsMessages = enMessages.products as Record<string, string>
  }
  
  // Get translated category
  const translated = productsMessages?.[translationKey]
  
  if (translated && typeof translated === 'string') {
    return translated
  }
  
  // Fallback to original category if translation not found
  return category
}

