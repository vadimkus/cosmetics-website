/**
 * Email Utility Functions
 * Helper functions for email operations including locale handling and translations
 */

import { errorLog } from '@/lib/logger'
import { SITE_URL } from '@/lib/siteConfig'
import type { EmailTranslationSection, LocaleSettings } from './types'
import enMessages from '@/messages/en.json'
import arMessages from '@/messages/ar.json'
import ruMessages from '@/messages/ru.json'

// Logo URL using site URL configuration
export const LOGO_URL = `${SITE_URL}/_next/image?url=%2FLogo%2FFull.png&w=640&q=75`

/**
 * Load email translations for a given locale and section
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function loadEmailTranslations(locale: string, section: EmailTranslationSection): Record<string, any> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let messages: any
    if (locale === 'ar') {
      messages = arMessages
    } else if (locale === 'ru') {
      messages = ruMessages
    } else {
      messages = enMessages
    }
    
    const translations = messages.default?.orderEmail?.[section] || messages.orderEmail?.[section]
    if (translations) {
      return translations
    }
  } catch (error) {
    errorLog(`Failed to load ${section} translations for locale ${locale}:`, error)
  }
  
  // Fallback to English
  try {
    return (enMessages as Record<string, any>).default?.orderEmail?.[section] || (enMessages as Record<string, any>).orderEmail?.[section] || {}
  } catch {
    return {}
  }
}

/**
 * Get RTL and text alignment settings for a locale
 */
export function getLocaleSettings(locale: string): LocaleSettings {
  const isRTL = locale === 'ar'
  return {
    isRTL,
    dir: isRTL ? 'rtl' : 'ltr',
    textAlign: isRTL ? 'right' : 'left',
    textAlignReverse: isRTL ? 'left' : 'right',
    dateLocale: locale === 'ar' ? 'ar-AE' : locale === 'ru' ? 'ru-RU' : 'en-AE'
  }
}

/**
 * Format currency for email display
 */
export function formatEmailCurrency(amount: number, locale: string = 'en'): string {
  return new Intl.NumberFormat(locale === 'ar' ? 'ar-AE' : locale === 'ru' ? 'ru-RU' : 'en-AE', {
    style: 'currency',
    currency: 'AED',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amount)
}

/**
 * Format date for email display
 */
export function formatEmailDate(date: Date, locale: string = 'en'): string {
  const { dateLocale } = getLocaleSettings(locale)
  return date.toLocaleDateString(dateLocale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

/**
 * Get products URL for a locale
 */
export function getProductsUrl(locale: string): string {
  return locale === 'en' ? `${SITE_URL}/products` : `${SITE_URL}/${locale}/products`
}

/**
 * Get track order URL (locale-aware)
 */
export function getTrackOrderUrl(orderNumber: string, locale: string = 'en'): string {
  return locale === 'en' ? `${SITE_URL}/track/${orderNumber}` : `${SITE_URL}/${locale}/track/${orderNumber}`
}
