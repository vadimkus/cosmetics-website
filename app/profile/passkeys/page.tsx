'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useAuth } from '@/components/auth/AuthProvider'
import { useTranslation } from '@/hooks/useTranslation'
import { getLocalizedPath } from '@/lib/i18n'
import PasskeySettings from '@/components/profile/PasskeySettings'

export default function PasskeysPage() {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const { t, locale, dir } = useTranslation()
  const isRTL = locale === 'ar'

  // Get user initial for avatar
  const userInitial = user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) {
    router.push(getLocalizedPath('/pwa-login', locale))
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50" dir={dir}>
      {/* Header */}
      <div 
        className="bg-white border-b border-gray-200 sticky top-0 z-10"
        style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
      >
        <div className={`flex items-center justify-between px-4 h-14 ${isRTL ? 'flex-row-reverse' : ''}`}>
          {/* Back Button */}
          <button 
            onClick={() => router.back()}
            className={`flex items-center gap-1 text-blue-600 font-medium min-w-[80px] ${isRTL ? 'flex-row-reverse justify-end' : ''}`}
          >
            {isRTL ? (
              <ArrowRight className="w-5 h-5" />
            ) : (
              <ArrowLeft className="w-5 h-5" />
            )}
            <span className="text-[17px]">{t('common.back') || 'Back'}</span>
          </button>
          
          {/* Title */}
          <span className="text-[17px] font-semibold text-gray-900">
            {t('login.managePasskeys') || 'Passkeys'}
          </span>
          
          {/* Profile Icon */}
          <div className="min-w-[80px] flex justify-end">
            <div className="relative">
              <div className="w-9 h-9 rounded-full bg-red-600 flex items-center justify-center">
                <span className="text-sm font-semibold text-white">
                  {userInitial.toUpperCase()}
                </span>
              </div>
              {/* Green online dot */}
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
