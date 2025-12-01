'use client'

import { usePathname } from 'next/navigation'
import { useMemo } from 'react'
import { getLocaleFromPath } from '@/lib/i18n'
import enMessages from '@/messages/en.json'
import arMessages from '@/messages/ar.json'
import ruMessages from '@/messages/ru.json'

export function useTranslation() {
  const pathname = usePathname()
  
  // usePathname() can be null during SSR, but Next.js ensures it's available during hydration
  // To avoid hydration mismatch, we need to ensure consistent behavior
  // If pathname is null (SSR), we'll use window.location.pathname as fallback (only available client-side)
  // This ensures server renders with default, client hydrates with actual path
  const effectivePath = pathname ?? (typeof window !== 'undefined' ? window.location.pathname : '/')
  const locale = getLocaleFromPath(effectivePath)
  
  const messages = useMemo(() => {
    if (locale === 'ar') return arMessages
    if (locale === 'ru') return ruMessages
    return enMessages
  }, [locale])

  const t = (key: string, params?: Record<string, string | number>): string => {
    const keys = key.split('.')
    let value: unknown = messages
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = (value as Record<string, unknown>)[k]
      } else {
        value = undefined
        break
      }
    }
    
    if (typeof value !== 'string') {
      console.warn(`Translation key not found: ${key}`)
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

  return {
    t,
    locale,
    dir: locale === 'ar' ? 'rtl' : 'ltr' // Russian uses LTR like English
  }
}
