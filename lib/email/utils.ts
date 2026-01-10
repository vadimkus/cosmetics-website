/**
 * Email Utility Functions
 * Helper functions for email operations including locale handling and translations
 */

import { errorLog } from '@/lib/logger'
import { SITE_URL } from '@/lib/siteConfig'
import type { EmailTranslationSection, LocaleSettings } from './types'

// Logo URL using site URL configuration
export const LOGO_URL = `${SITE_URL}/_next/image?url=%2FLogo%2FFull.png&w=640&q=75`

/**
 * Load email translations for a given locale and section
 */
export function loadEmailTranslations(locale: string, section: EmailTranslationSection): Record<string, string> {
  try {
    let messages: { default?: { orderEmail?: Record<string, Record<string, string>> }; orderEmail?: Record<string, Record<string, string>> }
    if (locale === 'ar') {
      messages = require('@/messages/ar.json')
    } else if (locale === 'ru') {
      messages = require('@/messages/ru.json')
    } else {
      messages = require('@/messages/en.json')
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
    const enMessages = require('@/messages/en.json')
    return enMessages.default?.orderEmail?.[section] || enMessages.orderEmail?.[section] || {}
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
 * Get track order URL
 */
export function getTrackOrderUrl(orderNumber: string): string {
  return `${SITE_URL}/track/${orderNumber}`
}
