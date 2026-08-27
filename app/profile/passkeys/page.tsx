'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useAuth } from '@/components/auth/AuthProvider'
import { useTranslation } from '@/hooks/useTranslation'
import { getLocalizedPath } from '@/lib/i18n'
import PasskeySettings from '@/components/profile/PasskeySettings'
import { ceraSerif } from '@/components/product/cerabarrier/ceraFont'
import '@/components/product/cerabarrier/cerabarrier.css'
import '@/components/editorial/editorial.css'

export default function PasskeysPage() {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const { t, locale, dir } = useTranslation()
  const isRTL = locale === 'ar'

  // Get user initial for avatar
  const userInitial = user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'

  if (isLoading) {
    return (
      <div className={`cera-page genosys-page ${ceraSerif.variable} min-h-screen flex items-center justify-center`}>
        <div className="w-8 h-8 border-4 border-[var(--cera-rose)] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) {
    router.push(getLocalizedPath('/pwa-login', locale))
    return null
  }

  return (
    <div className={`cera-page genosys-page ${ceraSerif.variable} min-h-screen`} dir={dir}>
      {/* Unified nav header */}
      <div
        className="mweb-float-sticky-top sticky top-0 z-10 bg-[var(--cera-cream)]/95 backdrop-blur border-b border-[var(--cera-line)]"
        style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
      >
        <div className={`flex items-center justify-between px-5 py-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <button
            onClick={() => router.back()}
            className={`flex items-center gap-1 min-w-[80px] ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            {isRTL ? (
              <ArrowRight className="w-5 h-5 text-[var(--cera-rose-ink)]" />
            ) : (
              <ArrowLeft className="w-5 h-5 text-[var(--cera-rose-ink)]" />
            )}
            <span className="text-[15px] text-[var(--cera-rose-ink)]">{t('common.back') || 'Back'}</span>
          </button>

          <h1 className="text-[17px] font-semibold text-[var(--cera-ink)]">
            {t('login.managePasskeys') || 'Passkeys'}
          </h1>

          <div className="min-w-[80px] flex justify-end">
            <div className="relative">
              <div className="w-9 h-9 rounded-full bg-[var(--cera-cta)] flex items-center justify-center">
                <span className="text-sm font-semibold text-white">
                  {userInitial.toUpperCase()}
                </span>
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-[1.5px] border-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6">
        <PasskeySettings />
      </div>
    </div>
  )
}
