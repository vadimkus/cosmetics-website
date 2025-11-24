import type { Locale } from '@/i18n'

export type { Locale }
export type Translations = typeof import('@/messages/en.json')

// Simple i18n utility that works with current structure
export function getTranslations(locale: Locale = 'en') {
  return async () => {
    const messages = await import(`@/messages/${locale}.json`)
    return {
      t: (key: string, params?: Record<string, string | number>) => {
        const keys = key.split('.')
        let value: any = messages.default
        
        for (const k of keys) {
          value = value?.[k]
        }
        
        if (typeof value !== 'string') {
          return key
        }
        
        // Simple parameter replacement
        if (params) {
          return Object.entries(params).reduce(
            (str, [paramKey, paramValue]) => 
              str.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(paramValue)),
            value
          )
        }
        
        return value
      }
    }
  }
}

export function getLocaleFromPath(pathname: string): Locale {
  if (pathname.startsWith('/ar')) {
    return 'ar'
  }
  return 'en'
}

export function getLocalizedPath(pathname: string, locale: Locale): string {
  // Remove existing locale prefix
  let pathWithoutLocale = pathname.replace(/^\/(en|ar)/, '') || '/'
  
  // Handle root path
  if (pathWithoutLocale === '/') {
    return locale === 'ar' ? '/ar' : '/'
  }
  
  // Remove leading slash if present (except for root)
  if (pathWithoutLocale.startsWith('/')) {
    pathWithoutLocale = pathWithoutLocale.substring(1)
  }
  
  if (locale === 'ar') {
    return `/ar/${pathWithoutLocale}`
  }
  
  return `/${pathWithoutLocale}`
}

