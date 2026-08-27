'use client'

import { ReactNode, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/auth/AuthProvider'
import { useTranslation } from '@/hooks/useTranslation'
import { getLocalizedPath } from '@/lib/i18n'
import { usePWAMode } from '@/hooks/usePWAMode'

function isPartnerUser(user: { partnerPortalAccess?: boolean } | null | undefined): boolean {
  // Access is assigned manually by admin (partnerPortalAccess toggle),
  // typically for 50%-off clinic accounts. Discount alone is NOT enough.
  return user?.partnerPortalAccess === true
}

/**
 * Gates the /partners area. Only accounts with admin-assigned Partner Portal
 * access may enter. Others see a request note; logged-out users go to /login.
 */
export function PartnerGuard({ children }: { children: ReactNode }) {
  const router = useRouter()
  const { locale } = useTranslation()
  const { user, isLoading: authLoading } = useAuth()
  const { isClient } = usePWAMode()

  useEffect(() => {
    if (isClient && !authLoading && !user) {
      // redirect param routes the partner straight back here after login
      router.push(`${getLocalizedPath('/login', locale)}?redirect=/partner-portal`)
    }
  }, [isClient, authLoading, user, router, locale])

  if (!isClient || authLoading || !user) {
    return (
      <div className="min-h-[100dvh] bg-gray-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-5">
          <Image
            src="/images/genosys-wordmark-transparent.png"
            alt="GENOSYS"
            width={977}
            height={210}
            priority
            className="h-8 w-auto brightness-0 invert"
          />
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-white/20 border-t-red-500" />
        </div>
      </div>
    )
  }

  if (!isPartnerUser(user)) {
    return (
      <div className="min-h-[100dvh] bg-gray-950 flex items-center justify-center px-6">
        <div className="max-w-sm w-full text-center">
          <div className="mb-6 flex flex-col items-center">
            <Image
              src="/images/genosys-wordmark-transparent.png"
              alt="GENOSYS"
              width={977}
              height={210}
              priority
              className="h-8 w-auto brightness-0 invert"
            />
            <span className="block text-[10px] font-semibold tracking-[0.25em] text-red-500 uppercase mt-2">Partner Portal</span>
          </div>
          <div className="bg-white rounded-2xl p-8 shadow-2xl">
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gray-900 flex items-center justify-center">
              <span className="text-2xl text-white">🔒</span>
            </div>
            <h1 className="text-lg font-bold text-gray-900 mb-2">
              {locale === 'ru' ? 'Доступ для партнёров' : locale === 'ar' ? 'وصول الشركاء' : 'Partners only'}
            </h1>
            <p className="text-sm text-gray-500 mb-6">
              {locale === 'ru'
                ? 'Раздел для клиник и салонов-партнёров GENOSYS с ценой −50%. Свяжитесь с нами, чтобы открыть доступ.'
                : locale === 'ar'
                  ? 'قسم مخصص لعيادات وصالونات شركاء GENOSYS بسعر −50٪. تواصل معنا لفتح الوصول.'
                  : 'For GENOSYS partner clinics & salons - order at −50%. Contact us to unlock access.'}
            </p>
            <a
              href="https://wa.me/971585487665?text=Hi%2C%20I%27d%20like%20partner%20clinic%20access%20on%20genosys.ae"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full bg-red-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-700 transition-colors"
            >
              {locale === 'ru' ? 'Запросить доступ' : locale === 'ar' ? 'طلب الوصول' : 'Request Access'}
            </a>
            <button
              onClick={() => router.push(getLocalizedPath('/products', locale))}
              className="mt-3 text-sm text-gray-400 hover:text-gray-600"
            >
              {locale === 'ru' ? 'Вернуться в магазин' : locale === 'ar' ? 'العودة للمتجر' : 'Back to shop'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
