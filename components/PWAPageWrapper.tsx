'use client'

import { useSearchParams } from 'next/navigation'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTranslation } from '@/hooks/useTranslation'
import { usePWAMode } from '@/hooks/usePWAMode'
import { getLocalizedPath } from '@/lib/i18n'

interface PWAPageWrapperProps {
  children: React.ReactNode
  title: string
  icon?: React.ReactNode
  defaultBackPath?: string
}

/**
 * PWA Page Wrapper - Wraps pages with back navigation header in PWA mode
 * 
 * Shows a back header at the top when in PWA mode
 * Checks for `from=profile` query parameter to navigate back to profile
 */
export default function PWAPageWrapper({ 
  children,
  title, 
  icon,
  defaultBackPath = '/products' 
}: PWAPageWrapperProps) {
  const { locale, dir } = useTranslation()
  const { isPWA, isClient } = usePWAMode()
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const isRTL = dir === 'rtl'
  const fromProfile = searchParams?.get('from') === 'profile'
  
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
  
  // Show header only in PWA mode
  if (!isClient || !isPWA) {
    return <>{children}</>
  }
  
  return (
    <div className="pb-32">
      {/* PWA Back Header */}
      <div className={`flex items-center px-4 py-3 border-b border-gray-100 bg-white sticky top-0 z-20 ${isRTL ? 'flex-row-reverse' : ''}`}
        style={{ marginTop: 'calc(env(safe-area-inset-top, 0px) + 80px)' }}
      >
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
      
      {/* Page Content */}
      {children}
    </div>
  )
}

