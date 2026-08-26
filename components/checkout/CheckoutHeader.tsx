'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { getLocalizedPath } from '@/lib/i18n'
import type { ReactNode } from 'react'

interface CheckoutHeaderProps {
  isPWA: boolean
  isPWAClient: boolean
  isMobileWeb: boolean
  locale: 'en' | 'ar' | 'ru'
  dir: string
  t: (key: string) => string
  user: { name?: string } | null
  progress?: ReactNode
}

export default function CheckoutHeader({ isPWA, isPWAClient, isMobileWeb, locale, dir, t, user, progress }: CheckoutHeaderProps) {
  const router = useRouter()

  return (
    <>
      {/* PWA / Mobile Web Light Header */}
      {(isPWAClient && isPWA) || isMobileWeb ? (
        <div className={`mweb-float-sticky-top sticky top-0 z-10 -mx-4 bg-[var(--cera-cream)]/95 backdrop-blur flex items-center justify-between px-5 py-4 mb-4 border-b border-[var(--cera-line)] ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
          {/* Back to Bag */}
          <Link
            href={getLocalizedPath('/cart', locale)}
            className={`flex items-center gap-1 min-w-[80px] ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}
            aria-label={t('common.bag') || 'Bag'}
          >
            <ArrowLeft className={`w-5 h-5 text-[var(--cera-rose-ink)] ${dir === 'rtl' ? 'rotate-180' : ''}`} />
            <span className="text-[15px] text-[var(--cera-rose-ink)]">{t('common.bag') || 'Bag'}</span>
          </Link>

          {/* Page Title */}
          <h1 className="text-[17px] font-semibold text-[var(--cera-ink)] text-center flex-1 truncate px-2">
            {t('checkout.checkout')}
          </h1>

          {/* Profile Icon - green dot only when logged in */}
          <button
            onClick={() => router.push(getLocalizedPath('/profile', locale))}
            className="min-w-[80px] flex justify-end"
            aria-label="Profile"
          >
            <div className="relative">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center ${user ? 'bg-[var(--cera-ink)]' : 'bg-[var(--cera-muted)]'}`}>
                <span className="text-sm font-semibold text-white">
                  {user?.name?.charAt(0)?.toUpperCase() || 'G'}
                </span>
              </div>
              {/* Green online dot - only when logged in */}
              {user && (
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-[1.5px] border-white" />
              )}
            </div>
          </button>
        </div>
      ) : null}

      {progress}

      {/* Back to Cart - Hide in PWA mode and mobile web */}
      {!(isPWAClient && isPWA) && !isMobileWeb && (
        <div className={`mb-4 md:mb-8 ${dir === 'rtl' ? 'flex justify-end' : ''}`}>
          <Link 
            href={getLocalizedPath('/cart', locale)} 
            className={`inline-flex items-center gap-1.5 text-[13px] font-semibold text-[var(--cera-rose-ink)] transition-opacity hover:opacity-70 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}
          >
            <ArrowLeft className={`h-3 w-3 md:h-4 md:w-4 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
            <span>{t('checkout.backToCart')}</span>
          </Link>
        </div>
      )}
    </>
  )
}
