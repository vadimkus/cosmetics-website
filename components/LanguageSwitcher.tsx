'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { useState, Suspense } from 'react'
import { getLocaleFromPath, switchLocaleHardNav, type Locale } from '@/lib/i18n'

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
    switchLocaleHardNav(locale, pathname, searchParams.toString())
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={isSwitching}
        className="flex items-center gap-1 px-2 py-1 rounded hover:bg-[var(--cera-cream-deep)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/50"
        aria-label="Switch language"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        {/* `primary-600` is rose-ink, the same value the menu below already
            used for the selected language and the same one the product and
            blog switcher uses. The green it replaces was #16a34a, which is
            3.30:1 on white: this is small text, so it was failing AA. */}
        <span className="text-xs font-medium text-primary-600">
          {isSwitching ? '...' : (currentLocale === 'ar' ? 'AR' : currentLocale === 'ru' ? 'RU' : 'EN')}
        </span>
      </button>
      
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div
            role="listbox"
            aria-label="Language"
            className={`absolute top-full mt-1 bg-white border border-[var(--cera-line)] rounded-lg shadow-lg z-20 min-w-[100px] ${
            isRTL 
              ? 'right-0 md:right-0' 
              : 'left-0 md:left-auto md:right-0'
          }`}>
            <button
              type="button"
              role="option"
              aria-selected={currentLocale === 'en'}
              onClick={() => switchLanguage('en')}
              className={`w-full text-left px-3 py-2 text-sm hover:bg-[var(--cera-cream)] transition-colors ${
                currentLocale === 'en' ? 'bg-primary-50 text-primary-600 font-medium' : 'text-[var(--cera-body)]'
              }`}
            >
              English
            </button>
            <button
              type="button"
              role="option"
              aria-selected={currentLocale === 'ru'}
              onClick={() => switchLanguage('ru')}
              className={`w-full text-left px-3 py-2 text-sm hover:bg-[var(--cera-cream)] transition-colors ${
                currentLocale === 'ru' ? 'bg-primary-50 text-primary-600 font-medium' : 'text-[var(--cera-body)]'
              }`}
            >
              Русский
            </button>
            <button
              type="button"
              role="option"
              aria-selected={currentLocale === 'ar'}
              onClick={() => switchLanguage('ar')}
              className={`w-full text-right px-3 py-2 text-sm hover:bg-[var(--cera-cream)] transition-colors ${
                currentLocale === 'ar' ? 'bg-primary-50 text-primary-600 font-medium' : 'text-[var(--cera-body)]'
              }`}
              dir="rtl"
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
    <Suspense fallback={<span className="text-xs font-medium text-primary-600 px-2 py-1">EN</span>}>
      <LanguageSwitcherContent />
    </Suspense>
  )
}

