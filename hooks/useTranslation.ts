'use client'

import { usePathname } from 'next/navigation'
import { useMemo } from 'react'
import { getLocaleFromPath } from '@/lib/i18n'
import enMessages from '@/messages/en.json'
import arMessages from '@/messages/ar.json'

export function useTranslation() {
  const pathname = usePathname()
  const locale = getLocaleFromPath(pathname)
  
  const messages = useMemo(() => {
    return locale === 'ar' ? arMessages : enMessages
  }, [locale])

  const t = (key: string, params?: Record<string, string | number>): string => {
    const keys = key.split('.')
    let value: any = messages
    
    for (const k of keys) {
      value = value?.[k]
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
    dir: locale === 'ar' ? 'rtl' : 'ltr'
  }
}

