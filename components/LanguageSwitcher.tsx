'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { useState, Suspense } from 'react'
import { getLocaleFromPath, getLocalizedPath, type Locale } from '@/lib/i18n'

function LanguageSwitcherContent() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentLocale = getLocaleFromPath(pathname)
  const isRTL = currentLocale === 'ar'
  const [isOpen, setIsOpen] = useState(false)
  const [isSwitching, setIsSwitching] = useState(false)

  const switchLanguage = (locale: Locale) => {
    setIsOpen(false)
    setIsSwitching(true)

    const newPath = getLocalizedPath(pathname, locale)
    // Preserve query parameters (like ?full=true)
    const queryString = searchParams.toString()
    const fullPath = queryString ? `${newPath}?${queryString}` : newPath

    // Store language preference in cookie to override Accept-Language header
    document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000; SameSite=Lax`

    // Full-page navigation (not router.replace).
    //
    // Mobile installed PWAs on iOS Safari were swallowing the transition:
    // router.replace() inside startTransition would set the cookie but the
    // client-side route change would not complete reliably, leaving the user
    // on the previous locale. A hard navigation guarantees:
    //   - the new cookie is sent on the very next request,
    //   - the service worker passes through (network-first for navigation),
    //   - the document re-renders with the correct locale + dir.
    if (typeof window !== 'undefined') {
      window.location.assign(fullPath)
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isSwitching}
        className="flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Switch language"
      >
        <span className="text-xs font-medium text-green-600">
          {isSwitching ? '...' : (currentLocale === 'ar' ? 'AR' : currentLocale === 'ru' ? 'RU' : 'EN')}
        </span>
      </button>
      
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className={`absolute top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 min-w-[100px] ${
            isRTL 
              ? 'right-0 md:right-0' 
              : 'left-0 md:left-auto md:right-0'
          }`}>
            <button
              onClick={() => switchLanguage('en')}
              className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 transition-colors ${
                currentLocale === 'en' ? 'bg-primary-50 text-primary-600 font-medium' : 'text-gray-900'
              }`}
            >
              English
            </button>
            <button
              onClick={() => switchLanguage('ru')}
              className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 transition-colors ${
                currentLocale === 'ru' ? 'bg-primary-50 text-primary-600 font-medium' : 'text-gray-900'
              }`}
            >
              Русский
            </button>
            <button
              onClick={() => switchLanguage('ar')}
              className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 transition-colors ${
                currentLocale === 'ar' ? 'bg-primary-50 text-primary-600 font-medium' : 'text-gray-900'
              }`}
            >
              العربية
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default function LanguageSwitcher() {
  return (
    <Suspense fallback={<span className="text-xs font-medium text-green-600 px-2 py-1">EN</span>}>
      <LanguageSwitcherContent />
    </Suspense>
  )
}

