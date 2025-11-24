'use client'

import { createContext, useContext, ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { getLocaleFromPath, type Locale } from '@/lib/i18n'

interface LocaleContextType {
  locale: Locale
  dir: 'ltr' | 'rtl'
}

const LocaleContext = createContext<LocaleContextType>({
  locale: 'en',
  dir: 'ltr'
})

export function LocaleProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const locale = getLocaleFromPath(pathname)
  const dir = locale === 'ar' ? 'rtl' : 'ltr'

  return (
    <LocaleContext.Provider value={{ locale, dir }}>
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocale() {
  return useContext(LocaleContext)
}

