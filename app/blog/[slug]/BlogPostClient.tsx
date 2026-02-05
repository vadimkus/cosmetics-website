'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation } from '@/hooks/useTranslation'
import { getLocalizedPath } from '@/lib/i18n'
import { useAuth } from '@/components/auth/AuthProvider'

interface BlogPostClientProps {
  children: React.ReactNode
}

export default function BlogPostClient({ children }: BlogPostClientProps) {
  const { locale, dir } = useTranslation()
  const router = useRouter()
  const { user } = useAuth()
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
  const isAppLikeMode = isMobileWeb

  if (!isAppLikeMode) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Mobile Header */}
      <div 
        className={`sticky top-0 z-50 flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100 ${isRTL ? 'flex-row-reverse' : ''}`}
        style={{ paddingTop: 'max(env(safe-area-inset-top), 12px)' }}
      >
        <button 
          onClick={() => router.push(getLocalizedPath('/blog', locale))}
          className={`flex items-center gap-1 min-w-[80px] ${isRTL ? 'flex-row-reverse' : ''}`}
        >
          <svg className={`w-5 h-5 text-red-600 ${isRTL ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-base text-red-600">
            {locale === 'ar' ? 'المدونة' : locale === 'ru' ? 'Блог' : 'Blog'}
          </span>
        </button>
        <span className="text-base font-semibold text-gray-900 truncate max-w-[180px]">
          {locale === 'ar' ? 'المقال' : locale === 'ru' ? 'Статья' : 'Article'}
        </span>
        {/* Profile Icon with green dot */}
        <button 
          onClick={() => router.push(getLocalizedPath('/profile', locale))}
          className={`min-w-[80px] flex ${isRTL ? 'justify-start' : 'justify-end'}`}
        >
          <div className="relative">
            <div className="w-9 h-9 rounded-full bg-red-600 flex items-center justify-center">
              <span className="text-sm font-semibold text-white">
                {user?.name?.charAt(0)?.toUpperCase() || 'G'}
              </span>
            </div>
            {user && (
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-[1.5px] border-white" />
            )}
          </div>
        </button>
      </div>
      
      {/* Content */}
      {children}
    </div>
  )
}
