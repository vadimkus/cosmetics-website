'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTranslation } from '@/hooks/useTranslation'
import { usePWAMode } from '@/hooks/usePWAMode'
import { useAuth } from '@/components/auth/AuthProvider'
import { getLocalizedPath } from '@/lib/i18n'

interface PWAPageWrapperProps {
  children: React.ReactNode
  title: string
  defaultBackPath?: string
}

/**
 * PWA Page Wrapper - Wraps pages with back navigation header in PWA mode and mobile web
 * 
 * Shows a back header at the top when in PWA mode or mobile web:
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
  
  const isRTL = dir === 'rtl'
  const fromProfile = searchParams?.get('from') === 'profile'
  const isAppLikeMode = (isClient && isPWA) || isMobileWeb
  
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
    : (locale === 'ar' ? 'المنتجات' : locale === 'ru' ? 'Товары' : 'Products')
  
  // Show header in PWA mode or mobile web
  if (!isAppLikeMode) {
    return <>{children}</>
  }
  
  return (
    <div className="min-h-screen bg-[var(--cera-cream)] pb-32">
      {/* Unified sticky nav header — matches the profile stack
          (addresses, language, billing, privacy-policy, terms). Sticky
          so the title + back button stay visible while scrolling long
          content (About, FAQ, Contact). */}
      <div className={`mweb-float-sticky-top sticky top-0 z-10 bg-[var(--cera-cream)]/95 backdrop-blur flex items-center justify-between px-5 py-4 border-b border-gray-200 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <button 
          onClick={handleBack}
          className={`flex items-center gap-1 min-w-[80px] ${isRTL ? 'flex-row-reverse' : ''}`}
          aria-label={backLabel}
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
        
        <h1 className="text-base font-semibold text-gray-900 text-center flex-1 truncate px-2">
          {title}
        </h1>
        
        {/* Profile Icon with green dot */}
        <button 
          onClick={handleProfileClick}
          className="min-w-[80px] flex justify-end"
          aria-label="Profile"
        >
          <div className="relative">
            <div className="w-9 h-9 rounded-full bg-red-600 flex items-center justify-center">
              <span className="text-sm font-semibold text-white">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
            {/* Green online dot */}
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-[1.5px] border-white" />
          </div>
        </button>
      </div>
      
      {/* Page Content */}
      {children}
    </div>
  )
}
