'use client'

import { useSearchParams } from 'next/navigation'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTranslation } from '@/hooks/useTranslation'
import { usePWAMode } from '@/hooks/usePWAMode'
import { useAuth } from '@/components/AuthProvider'
import { getLocalizedPath } from '@/lib/i18n'

interface PWAPageWrapperProps {
  children: React.ReactNode
  title: string
  defaultBackPath?: string
}

/**
 * PWA Page Wrapper - Wraps pages with back navigation header in PWA mode
 * 
 * Shows a back header at the top when in PWA mode:
 * - Left: < Account (back button)
 * - Center: Page title
 * - Right: Profile icon with green online dot
 */
export default function PWAPageWrapper({ 
  children,
  title, 
  defaultBackPath = '/products' 
}: PWAPageWrapperProps) {
  const { locale, dir } = useTranslation()
  const { isPWA, isClient } = usePWAMode()
  const { user } = useAuth()
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

  const handleProfileClick = () => {
    router.push(getLocalizedPath('/profile', locale))
  }
  
  const backLabel = fromProfile 
    ? (locale === 'ar' ? 'الحساب' : locale === 'ru' ? 'Аккаунт' : 'Account')
    : (locale === 'ar' ? 'الرئيسية' : locale === 'ru' ? 'Главная' : 'Home')
  
  // Show header only in PWA mode
  if (!isClient || !isPWA) {
    return <>{children}</>
  }
  
  return (
    <div className="min-h-screen bg-white pb-32">
      {/* PWA Simple Navigation Header */}
      <div className={`flex items-center justify-between px-5 py-4 bg-white border-b border-gray-100 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <button 
          onClick={handleBack}
          className={`flex items-center gap-1 min-w-[80px] ${isRTL ? 'flex-row-reverse' : ''}`}
        >
          {isRTL ? (
            <ArrowRight className="w-5 h-5 text-red-600" />
          ) : (
            <ArrowLeft className="w-5 h-5 text-red-600" />
          )}
          <span className="text-base text-red-600">
            {backLabel}
          </span>
        </button>
        
        <div className={`flex-1 flex items-center justify-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <span className="text-base font-semibold text-gray-900 text-center">
            {title}
          </span>
        </div>
        
        {/* Profile Icon with green dot */}
        <button 
          onClick={handleProfileClick}
          className="min-w-[80px] flex justify-end"
        >
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center">
              <span className="text-sm font-semibold text-white">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
            {/* Green online dot */}
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />
          </div>
        </button>
      </div>
      
      {/* Page Content */}
      {children}
    </div>
  )
}
