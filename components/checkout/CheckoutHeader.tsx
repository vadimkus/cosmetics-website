'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { getLocalizedPath } from '@/lib/i18n'

interface CheckoutHeaderProps {
  isPWA: boolean
  isPWAClient: boolean
  isMobileWeb: boolean
  locale: 'en' | 'ar' | 'ru'
  dir: string
  t: (key: string) => string
  user: { name?: string } | null
}

export default function CheckoutHeader({ isPWA, isPWAClient, isMobileWeb, locale, dir, t, user }: CheckoutHeaderProps) {
  const router = useRouter()

  return (
    <>
      {/* PWA / Mobile Web Light Header */}
      {(isPWAClient && isPWA) || isMobileWeb ? (
        <div className={`flex items-center justify-between px-1 py-4 mb-4 border-b border-gray-100 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
          {/* Back to Bag */}
          <Link 
            href={getLocalizedPath('/cart', locale)}
            className={`flex items-center gap-1 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}
          >
            <ArrowLeft className={`w-5 h-5 text-red-600 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
            <span className="text-base text-red-600">{t('common.bag') || 'Bag'}</span>
          </Link>
          
          {/* Page Title */}
          <h1 className="text-lg font-semibold text-gray-900">
            {t('checkout.checkout')}
          </h1>
          
          {/* Profile Icon - green dot only when logged in */}
          <button 
            onClick={() => router.push(getLocalizedPath('/profile', locale))}
            className="min-w-[44px] flex justify-end"
          >
            <div className="relative">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center ${user ? 'bg-red-600' : 'bg-gray-400'}`}>
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

      {/* Navigation Breadcrumb - Hide in PWA mode and mobile web */}
      {!(isPWAClient && isPWA) && !isMobileWeb && (
        <div className={`${dir === 'rtl' ? 'flex justify-end' : ''}`}>
          <nav className={`inline-flex items-baseline gap-1.5 md:gap-2 text-xs md:text-base text-gray-600 mb-1.5 md:mb-4 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`} aria-label="Breadcrumb">
            <span className="hover:text-primary-600 transition-colors">
              <Link href={getLocalizedPath('/', locale)}>{t('checkout.home')}</Link>
            </span>
            <span>/</span>
            <span className="hover:text-primary-600 transition-colors">
              <Link href={getLocalizedPath('/products', locale)}>{t('checkout.products')}</Link>
            </span>
            <span>/</span>
            <span className="hover:text-primary-600 transition-colors">
              <Link href={getLocalizedPath('/cart', locale)}>{t('checkout.cart')}</Link>
            </span>
            <span>/</span>
            <span className="text-gray-900 font-medium">{t('checkout.checkout')}</span>
          </nav>
        </div>
      )}
      
      {/* Back to Cart - Hide in PWA mode and mobile web */}
      {!(isPWAClient && isPWA) && !isMobileWeb && (
        <div className={`mb-4 md:mb-8 ${dir === 'rtl' ? 'flex justify-end' : ''}`}>
          <Link 
            href={getLocalizedPath('/cart', locale)} 
            className={`inline-flex items-center gap-1 text-xs md:text-sm text-primary-600 hover:text-primary-700 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}
          >
            <ArrowLeft className={`h-3 w-3 md:h-4 md:w-4 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
            <span>{t('checkout.backToCart')}</span>
          </Link>
        </div>
      )}
    </>
  )
}
