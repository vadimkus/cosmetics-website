'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { getLocaleFromPath } from '@/lib/i18n'

export default function LocaleWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const locale = getLocaleFromPath(pathname)
  const dir = locale === 'ar' ? 'rtl' : 'ltr'

  useEffect(() => {
    // Ensure html lang and dir attributes are correct (backup in case script didn't run)
    if (document.documentElement.lang !== locale && document.documentElement.dir !== dir) {
      document.documentElement.lang = locale === 'ar' ? 'ar' : 'en'
      document.documentElement.dir = dir
    }
  }, [locale, dir])

  return <>{children}</>
}

