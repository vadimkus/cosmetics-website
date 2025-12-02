'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useState, Suspense } from 'react'
import { getLocaleFromPath, getLocalizedPath, type Locale } from '@/lib/i18n'

function LanguageSwitcherContent() {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentLocale = getLocaleFromPath(pathname)
  const [isOpen, setIsOpen] = useState(false)

  const switchLanguage = (locale: Locale) => {
    const newPath = getLocalizedPath(pathname, locale)
    // Preserve query parameters (like ?full=true)
    const queryString = searchParams.toString()
    const fullPath = queryString ? `${newPath}?${queryString}` : newPath
    
    // Store language preference in cookie to override Accept-Language header
    document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000; SameSite=Lax`
    
    // Use replace instead of push to avoid adding to history
    // This ensures the language switch feels more natural
    router.replace(fullPath)
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-100 transition-colors"
        aria-label="Switch language"
      >
        <span className="text-xs font-medium text-green-600">
          {currentLocale === 'ar' ? 'AR' : currentLocale === 'ru' ? 'RU' : 'EN'}
        </span>
      </button>
      
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 md:left-auto md:right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 min-w-[100px]">
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

