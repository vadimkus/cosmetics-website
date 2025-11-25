'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { getLocaleFromPath } from '@/lib/i18n'

export default function LocaleWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  useEffect(() => {
    // Ensure html lang and dir attributes are correct (backup in case script didn't run)
    // Use pathname consistently - don't use window.location to avoid hydration mismatch
    const effectivePath = pathname ?? '/'
    const currentLocale = getLocaleFromPath(effectivePath)
    const currentDir = currentLocale === 'ar' ? 'rtl' : 'ltr'
    const currentLang = currentLocale === 'ar' ? 'ar' : 'en'
    
    const html = document.documentElement
    if (!html) return
    
    if (html.lang !== currentLang || html.dir !== currentDir) {
      html.lang = currentLang
      html.dir = currentDir
      html.setAttribute('data-locale', currentLang)
      html.setAttribute('data-dir', currentDir)
    }
    
    if (document.body) {
      document.body.setAttribute('dir', currentDir)
      document.body.setAttribute('data-dir', currentDir)
    }
  }, [pathname])

  return <>{children}</>
}

