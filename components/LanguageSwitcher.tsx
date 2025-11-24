'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { getLocaleFromPath, getLocalizedPath, type Locale } from '@/lib/i18n'

export default function LanguageSwitcher() {
  const pathname = usePathname()
  const router = useRouter()
  const currentLocale = getLocaleFromPath(pathname)
  const [isOpen, setIsOpen] = useState(false)

  const switchLanguage = (locale: Locale) => {
    const newPath = getLocalizedPath(pathname, locale)
    router.push(newPath)
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-100 transition-colors"
        aria-label="Switch language"
      >
        <span className="text-xs font-medium text-gray-700">
          {currentLocale === 'ar' ? 'AR' : 'EN'}
        </span>
      </button>
      
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 min-w-[100px]">
            <button
              onClick={() => switchLanguage('en')}
              className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 transition-colors ${
                currentLocale === 'en' ? 'bg-primary-50 text-primary-600 font-medium' : ''
              }`}
            >
              English
            </button>
            <button
              onClick={() => switchLanguage('ar')}
              className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 transition-colors ${
                currentLocale === 'ar' ? 'bg-primary-50 text-primary-600 font-medium' : ''
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

