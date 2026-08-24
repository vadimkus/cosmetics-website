'use client'

import { useRouter } from 'next/navigation'
import { useTranslation } from '@/hooks/useTranslation'
import { getLocalizedPath } from '@/lib/i18n'
import { useAuth } from '@/components/auth/AuthProvider'
import { useIsMobileWeb } from '@/hooks/useIsMobile'
import LocaleSwitchInline from '@/components/LocaleSwitchInline'
import { ceraSerif } from '@/components/product/cerabarrier/ceraFont'
import '@/components/product/cerabarrier/cerabarrier.css'
import '@/components/editorial/editorial.css'

interface BlogPostClientProps {
  children: React.ReactNode
}

export default function BlogPostClient({ children }: BlogPostClientProps) {
  const { locale, dir } = useTranslation()
  const router = useRouter()
  const { user } = useAuth()
  const { isMobile, isClient } = useIsMobileWeb()

  const isRTL = dir === 'rtl'
  // Was `isMobileWeb`, which excludes the installed PWA. `PWAHeader` also hides
  // itself on /blog, so PWA readers were getting no bar at all: no way back to
  // the blog, and no language control. Any narrow viewport gets it now.
  const isAppLikeMode = isClient && isMobile

  if (!isAppLikeMode) {
    return <>{children}</>
  }

  return (
    <div className={`cera-page genosys-page ${ceraSerif.variable} min-h-screen`}>
      {/* Mobile Header */}
      <div 
        className={`sticky top-0 z-50 flex items-center justify-between px-4 py-3 bg-white border-b border-[var(--cera-line)] ${isRTL ? 'flex-row-reverse' : ''}`}
        style={{ paddingTop: 'max(env(safe-area-inset-top), 12px)' }}
      >
        <button 
          onClick={() => router.push(getLocalizedPath('/blog', locale))}
          className={`flex items-center gap-1 min-w-[80px] ${isRTL ? 'flex-row-reverse' : ''}`}
        >
          <svg className={`w-5 h-5 text-[var(--cera-rose-ink)] ${isRTL ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-base text-[var(--cera-rose-ink)]">
            {locale === 'ar' ? 'المدونة' : locale === 'ru' ? 'Блог' : 'Blog'}
          </span>
        </button>
        {/* The "Article" label that sat here told the reader nothing they could
            not see. The language control is what this bar was missing. */}
        <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <LocaleSwitchInline />
        {/* Profile Icon with green dot */}
        <button 
          onClick={() => router.push(getLocalizedPath('/profile', locale))}
          className="flex"
        >
          <div className="relative">
            <div className="w-9 h-9 rounded-full bg-[var(--cera-ink)] flex items-center justify-center">
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
      </div>
      
      {/* Content */}
      {children}
    </div>
  )
}
