'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft, Check, Globe, Loader2 } from 'lucide-react'
import { useAuth } from '@/components/auth/AuthProvider'
import { useTranslation } from '@/hooks/useTranslation'
import { getLocalizedPath, switchLocaleHardNav } from '@/lib/i18n'
import { usePWAMode } from '@/hooks/usePWAMode'
import { ceraSerif } from '@/components/product/cerabarrier/ceraFont'
import '@/components/product/cerabarrier/cerabarrier.css'
import '@/components/editorial/editorial.css'

export default function LanguagePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const { locale, dir } = useTranslation()
  const { isPWA } = usePWAMode()
  const isRTL = dir === 'rtl'
  const [isMobileWeb, setIsMobileWeb] = useState(false)
  
  // Detect mobile web (non-PWA mobile)
  useEffect(() => {
    const checkMobile = () => {
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) && window.innerWidth < 768
      const isPWAMode = window.matchMedia('(display-mode: standalone)').matches || 
                        (window.navigator as Navigator & { standalone?: boolean }).standalone === true
      setIsMobileWeb(isMobile && !isPWAMode)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  
  const isAppLikeMode = isPWA || isMobileWeb

  const fromPage = searchParams?.get('from')

  // Track which specific option the user tapped so we can spin only that
  // card while the locale switch is in flight — previously every card
  // faded to 50% opacity during the transition, which looked like the
  // whole list had been disabled.
  const [switchingTo, setSwitchingTo] = useState<string | null>(null)

  // Native names are self-identifying — Apple's iOS Settings pattern.
  // We dropped the second "Russian" / "Arabic" label line so all three
  // cards render at identical heights.
  const options = [
    { code: 'en', nativeLabel: 'English' },
    { code: 'ru', nativeLabel: 'Русский' },
    { code: 'ar', nativeLabel: 'العربية' },
  ] as const

  const translations = {
    title: locale === 'ar' ? 'اللغة' : locale === 'ru' ? 'Язык' : 'Language',
    back: locale === 'ar' ? 'الحساب' : locale === 'ru' ? 'Аккаунт' : 'Account',
    selectLanguage: locale === 'ar' ? 'اختر لغتك المفضلة' : locale === 'ru' ? 'Выберите ваш язык' : 'Select your preferred language',
    note: locale === 'ar' 
      ? 'سيتم تطبيق تغيير اللغة فوراً على جميع الصفحات.'
      : locale === 'ru' 
        ? 'Изменение языка будет применено сразу ко всем страницам.'
        : 'Language change will be applied immediately to all pages.',
  }

  const handleBack = () => {
    if (fromPage === 'profile') {
      router.push(getLocalizedPath('/profile', locale))
    } else {
      router.back()
    }
  }

  // Hard navigation, not router.replace. MessagesProvider is populated by the root
  // layout, which App Router does not re-render when navigating between routes that
  // share it, so a soft nav leaves this page rendering the previous locale — the very
  // thing the page exists to change. The helper also writes NEXT_LOCALE so the choice
  // persists, which the old implementation never did.
  const handleLanguageChange = async (newLocale: 'en' | 'ar' | 'ru') => {
    if (newLocale === locale || switchingTo) return

    setSwitchingTo(newLocale)
    // No cleanup: the page is about to be replaced by a full navigation, and clearing
    // the flag first would let a second tap fire another one.
    switchLocaleHardNav(newLocale, '/profile/language', 'from=profile')
  }

  const userInitial = user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'

  return (
    <div className={`cera-page genosys-page ${ceraSerif.variable} min-h-screen ${isAppLikeMode ? 'pb-32' : ''}`} dir={dir}>
      {/* Unified nav header */}
      <div className={`mweb-float-sticky-top sticky top-0 z-10 bg-[var(--cera-cream)]/95 backdrop-blur flex items-center justify-between px-5 py-4 border-b border-[var(--cera-line)] ${isRTL ? 'flex-row-reverse' : ''}`}>
        <button
          onClick={handleBack}
          className={`flex items-center gap-1 min-w-[80px] ${isRTL ? 'flex-row-reverse' : ''}`}
        >
          <ArrowLeft className={`w-5 h-5 text-[var(--cera-rose-ink)] ${isRTL ? 'rotate-180' : ''}`} />
          <span className="text-[15px] text-[var(--cera-rose-ink)]">
            {translations.back}
          </span>
        </button>
        <h1 className="text-[17px] font-semibold text-[var(--cera-ink)]">
          {translations.title}
        </h1>
        {/* Profile Icon with green dot */}
        <div className="min-w-[80px] flex justify-end">
          <div className="relative">
            <div className="w-9 h-9 rounded-full bg-[var(--cera-ink)] flex items-center justify-center">
              <span className="text-sm font-semibold text-white">
                {userInitial.toUpperCase()}
              </span>
            </div>
            {/* Green online dot */}
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-[1.5px] border-white" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-5 py-6">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-[var(--cera-line)]">
          {/* Section Header */}
          <div className={`flex items-center gap-3 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="w-10 h-10 rounded-full bg-[var(--cera-blush)] border border-[var(--cera-blush-deep)] flex items-center justify-center">
              <Globe className="w-5 h-5 text-[var(--cera-rose-ink)]" />
            </div>
            <h2 className={`text-lg font-semibold text-[var(--cera-ink)] ${isRTL ? 'text-right' : ''}`}>
              {translations.selectLanguage}
            </h2>
          </div>

          {/* Language Options */}
          <div className="space-y-2">
            {options.map((option) => {
              const isActive = option.code === locale
              const isSwitchingThis = switchingTo === option.code
              const isBusy = Boolean(switchingTo)
              return (
                <button
                  key={option.code}
                  onClick={() => handleLanguageChange(option.code)}
                  disabled={isBusy}
                  aria-current={isActive ? 'true' : undefined}
                  className={`w-full flex items-center justify-between px-4 py-4 rounded-xl transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cera-rose)] focus-visible:ring-offset-2 active:scale-[0.99] ${
                    isActive
                      ? 'bg-[var(--cera-blush)] border-2 border-[var(--cera-rose)]'
                      : 'bg-[var(--cera-cream-deep)] border-2 border-transparent hover:bg-[var(--cera-cream-deep)]'
                  } ${isBusy && !isSwitchingThis ? 'opacity-60' : ''} ${isRTL ? 'flex-row-reverse' : ''}`}
                >
                  <span
                    className={`text-base font-medium ${isActive ? 'text-[var(--cera-rose-ink)]' : 'text-[var(--cera-ink)]'}`}
                    // Each label is rendered in its own script's natural
                    // direction so the Arabic glyphs read RTL even inside
                    // an LTR container, and vice-versa.
                    dir={option.code === 'ar' ? 'rtl' : 'ltr'}
                  >
                    {option.nativeLabel}
                  </span>
                  {isSwitchingThis ? (
                    <Loader2 className="w-6 h-6 text-[var(--cera-rose-ink)] animate-spin" aria-hidden="true" />
                  ) : isActive ? (
                    <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center" aria-hidden="true">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  ) : (
                    // Placeholder keeps row heights identical across states
                    <div className="w-6 h-6" aria-hidden="true" />
                  )}
                </button>
              )
            })}
          </div>

          {/* Note */}
          <p className={`mt-4 text-sm text-[var(--cera-muted)] ${isRTL ? 'text-right' : ''}`}>
            {translations.note}
          </p>
        </div>
      </div>
    </div>
  )
}

