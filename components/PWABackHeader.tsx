'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'
import { usePWAMode } from '@/hooks/usePWAMode'
import { getLocalizedPath } from '@/lib/i18n'

interface PWABackHeaderProps {
  title: string
  icon?: React.ReactNode
  defaultBackPath?: string
}

/**
 * PWA Back Header - Shows proper back navigation for pages accessed from profile
 * 
 * Checks for `from=profile` query parameter and navigates back to profile
 * Otherwise navigates to the specified defaultBackPath
 */
export default function PWABackHeader({ 
  title, 
  icon,
  defaultBackPath = '/products' 
}: PWABackHeaderProps) {
  const { locale, dir } = useTranslation()
  const { isPWA, isClient } = usePWAMode()
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const isRTL = dir === 'rtl'
  const fromProfile = searchParams?.get('from') === 'profile'
  
  // Only show in PWA mode
  if (!isClient || !isPWA) {
    return null
  }
  
  const handleBack = () => {
    if (fromProfile) {
      router.push(getLocalizedPath('/profile', locale))
    } else {
      router.push(getLocalizedPath(defaultBackPath, locale))
    }
  }
  
  const backLabel = fromProfile 
    ? (locale === 'ar' ? 'الحساب' : locale === 'ru' ? 'Аккаунт' : 'Account')
    : (locale === 'ar' ? 'الرئيسية' : locale === 'ru' ? 'Главная' : 'Home')
  
  return (
    <div className={`flex items-center px-4 py-3 border-b border-gray-100 bg-white ${isRTL ? 'flex-row-reverse' : ''}`}>
      <button 
        onClick={handleBack}
        className={`flex items-center gap-1.5 min-w-[80px] ${isRTL ? 'flex-row-reverse' : ''}`}
      >
        {isRTL ? (
          <ArrowRight className="w-5 h-5 text-red-600" />
        ) : (
          <ArrowLeft className="w-5 h-5 text-red-600" />
        )}
        <span className="text-sm font-semibold text-red-600">
          {backLabel}
        </span>
      </button>
      
      <div className={`flex-1 flex items-center justify-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
        {icon}
        <h1 className="text-lg font-semibold text-gray-900">
          {title}
        </h1>
      </div>
      
      <div className="min-w-[80px]" />
    </div>
  )
}

