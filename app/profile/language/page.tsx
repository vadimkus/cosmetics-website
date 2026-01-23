'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft, Check, Globe } from 'lucide-react'
import { useAuth } from '@/components/AuthProvider'
import { useTranslation } from '@/hooks/useTranslation'
import { getLocalizedPath } from '@/lib/i18n'
import { usePWAMode } from '@/hooks/usePWAMode'

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

  const [saving, setSaving] = useState(false)

  // Language options with native names
  const options = [
    { code: 'en', label: 'English', nativeLabel: 'English' },
    { code: 'ru', label: 'Russian', nativeLabel: 'Русский' },
    { code: 'ar', label: 'Arabic', nativeLabel: 'العربية' },
  ]

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

  const handleLanguageChange = async (newLocale: string) => {
    if (newLocale === locale || saving) return

    setSaving(true)
    try {
      // Navigate to the same page but with new locale
      // Use getLocalizedPath to handle EN (no prefix) vs AR/RU (with prefix)
      const basePath = getLocalizedPath('/profile/language', newLocale as 'en' | 'ar' | 'ru')
      const newPath = `${basePath}?from=profile`
      // Use replace instead of push to avoid history issues when switching languages
      router.replace(newPath)
    } finally {
      setSaving(false)
    }
  }

  const userInitial = user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'

  return (
    <div className={`min-h-screen bg-gray-50 ${isAppLikeMode ? 'pb-32' : ''}`} dir={dir}>
      {/* Header */}
      <div className={`flex items-center justify-between px-5 py-4 bg-white border-b border-gray-200 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <button 
          onClick={handleBack}
          className={`flex items-center gap-1 min-w-[80px] ${isRTL ? 'flex-row-reverse' : ''}`}
        >
          <ArrowLeft className={`w-5 h-5 text-red-600 ${isRTL ? 'rotate-180' : ''}`} />
          <span className="text-base text-red-600">
            {translations.back}
          </span>
        </button>
        <span className="text-base font-semibold text-gray-900">
          {translations.title}
        </span>
        {/* Profile Icon with green dot */}
        <div className="min-w-[80px] flex justify-end">
          <div className="relative">
            <div className="w-9 h-9 rounded-full bg-red-600 flex items-center justify-center">
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
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          {/* Section Header */}
          <div className={`flex items-center gap-3 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="w-10 h-10 rounded-full bg-red-50 border border-red-200 flex items-center justify-center">
              <Globe className="w-5 h-5 text-red-600" />
            </div>
            <h2 className={`text-lg font-semibold text-gray-900 ${isRTL ? 'text-right' : ''}`}>
              {translations.selectLanguage}
            </h2>
          </div>

          {/* Language Options */}
          <div className="space-y-2">
            {options.map((option) => {
              const isActive = option.code === locale
              return (
                <button
                  key={option.code}
                  onClick={() => handleLanguageChange(option.code)}
                  disabled={saving}
                  className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all ${
                    isActive 
                      ? 'bg-red-50 border-2 border-red-500' 
                      : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                  } ${saving ? 'opacity-50' : ''} ${isRTL ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`flex flex-col ${isRTL ? 'items-end' : 'items-start'}`}>
                    <span className={`text-base font-medium ${isActive ? 'text-red-600' : 'text-gray-900'}`}>
                      {option.nativeLabel}
                    </span>
                    {option.code !== 'en' && (
                      <span className="text-sm text-gray-500">
                        {option.label}
                      </span>
                    )}
                  </div>
                  {isActive && (
                    <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </button>
              )
            })}
          </div>

          {/* Note */}
          <p className={`mt-4 text-sm text-gray-500 ${isRTL ? 'text-right' : ''}`}>
            {translations.note}
          </p>
        </div>
      </div>
    </div>
  )
}

