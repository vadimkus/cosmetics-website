/**
 * Email Utility Functions
 * Helper functions for email operations including locale handling and translations
 */

import { errorLog } from '@/lib/logger'
import { SITE_URL, SOCIAL_LINKS, LEGAL_INFO } from '@/lib/siteConfig'
import type { EmailTranslationSection, LocaleSettings } from './types'
import enMessages from '@/messages/en.json'
import arMessages from '@/messages/ar.json'
import ruMessages from '@/messages/ru.json'

// Logo URL using site URL configuration
export const LOGO_URL = `${SITE_URL}/_next/image?url=%2FLogo%2FFull.png&w=640&q=75`

/**
 * Shared corporate footer for customer transactional emails.
 * Support contact + brand links + legal identity (incl. TRN) so every email
 * carries a consistent, tax-compliant signature. Apple-clean styling.
 *
 * @param locale  'en' | 'ar' | 'ru'
 * @param opts.trackUrl  optional "Track Order" link (order emails only)
 */
export function renderEmailFooter(
  locale: string = 'en',
  opts: { trackUrl?: string } = {}
): string {
  const c =
    locale === 'ar'
      ? { help: 'هل تحتاج مساعدة؟', shop: 'تسوّق', track: 'تتبع الطلب', distributor: 'الموزّع الرسمي في الإمارات', rights: '© 2026 جميع الحقوق محفوظة.' }
      : locale === 'ru'
      ? { help: 'Нужна помощь?', shop: 'Магазин', track: 'Отследить заказ', distributor: 'Официальный дистрибьютор в ОАЭ', rights: '© 2026 Все права защищены.' }
      : { help: 'Need help?', shop: 'Shop', track: 'Track Order', distributor: 'Official Distributor in the UAE', rights: '© 2026 All rights reserved.' }

  const linkStyle = "display:inline-block;font-family:-apple-system,BlinkMacSystemFont,'SF Pro Text','Segoe UI',Roboto,sans-serif;font-size:13px;color:#86868b;text-decoration:none;padding:0 10px;"
  const trackLink = opts.trackUrl
    ? `<span style="color:#d2d2d7;">|</span><a href="${opts.trackUrl}" style="${linkStyle}">${c.track}</a>`
    : ''

  return `
                <tr>
                  <td style="padding-top:48px;"><div style="height:1px;background-color:#e8e8ed;"></div></td>
                </tr>
                <tr>
                  <td style="padding-top:24px;text-align:center;">
                    <div style="font-family:-apple-system,BlinkMacSystemFont,'SF Pro Text','Segoe UI',Roboto,sans-serif;font-size:15px;font-weight:600;color:#1d1d1f;">${c.help}</div>
                    <div style="font-family:-apple-system,BlinkMacSystemFont,'SF Pro Text','Segoe UI',Roboto,sans-serif;font-size:14px;color:#86868b;padding-top:6px;">
                      <a href="${SOCIAL_LINKS.whatsapp}" style="color:#0071e3;text-decoration:none;">WhatsApp</a>
                      &nbsp;·&nbsp;
                      <a href="mailto:${SOCIAL_LINKS.email}" style="color:#0071e3;text-decoration:none;">${SOCIAL_LINKS.email}</a>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="padding-top:20px;text-align:center;">
                    <a href="${SITE_URL}" style="${linkStyle}">${c.shop}</a>
                    <span style="color:#d2d2d7;">|</span>
                    <a href="${SOCIAL_LINKS.instagram}" style="${linkStyle}">Instagram</a>
                    ${trackLink}
                  </td>
                </tr>
                <tr>
                  <td style="padding-top:28px;text-align:center;">
                    <div style="font-family:-apple-system,BlinkMacSystemFont,'SF Pro Text','Segoe UI',Roboto,sans-serif;font-size:12px;color:#86868b;line-height:1.7;">
                      <strong style="color:#6e6e73;font-weight:600;">${LEGAL_INFO.companyName}</strong><br>
                      ${c.distributor}<br>
                      ${LEGAL_INFO.city}<br>
                      TRN: ${LEGAL_INFO.trn}<br><br>
                      ${c.rights}
                    </div>
                  </td>
                </tr>`
}

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
