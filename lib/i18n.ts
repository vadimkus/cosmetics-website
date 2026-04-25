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
        let value: unknown = messages.default
        
        for (const k of keys) {
          if (value && typeof value === 'object' && k in value) {
            value = (value as Record<string, unknown>)[k]
          } else {
            value = undefined
            break
          }
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
  if (pathname.startsWith('/ru')) {
    return 'ru'
  }
  return 'en'
}

/**
 * Switch the active locale by setting the NEXT_LOCALE cookie and performing a
 * full-page navigation to the localised path.
 *
 * Soft client-side routing has been observed to fail intermittently on iOS
 * Safari (mobile web AND installed PWAs): the cookie is set but the route
 * change does not complete, leaving the user on the previous locale. A hard
 * navigation guarantees:
 *   - the new cookie is sent on the very next request,
 *   - the service worker passes through (network-first for navigation),
 *   - the document re-renders with the correct locale + dir.
 *
 * Use this helper from every language switcher (desktop, mobile web, PWA) so
 * the behaviour stays consistent.
 */
export function switchLocaleHardNav(
  targetLocale: Locale,
  currentPathname: string,
  searchParamsString?: string
): void {
  if (typeof window === 'undefined') return

  const localizedPath = getLocalizedPath(currentPathname || '/', targetLocale)
  const fullPath = searchParamsString
    ? `${localizedPath}?${searchParamsString}`
    : localizedPath

  // Persist preference so the middleware/server uses it on the next request.
  if (typeof document !== 'undefined') {
    document.cookie = `NEXT_LOCALE=${targetLocale}; path=/; max-age=31536000; SameSite=Lax`
  }

  window.location.assign(fullPath)
}

export function getLocalizedPath(pathname: string, locale: Locale): string {
  // Remove existing locale prefix
  let pathWithoutLocale = pathname.replace(/^\/(en|ar|ru)/, '') || '/'
  
  // Handle root path
  if (pathWithoutLocale === '/') {
    if (locale === 'ar') return '/ar'
    if (locale === 'ru') return '/ru'
    return '/'
  }
  
  // Remove leading slash if present (except for root)
  if (pathWithoutLocale.startsWith('/')) {
    pathWithoutLocale = pathWithoutLocale.substring(1)
  }
  
  if (locale === 'ar') {
    return `/ar/${pathWithoutLocale}`
  }
  if (locale === 'ru') {
    return `/ru/${pathWithoutLocale}`
  }
  
  return `/${pathWithoutLocale}`
}

