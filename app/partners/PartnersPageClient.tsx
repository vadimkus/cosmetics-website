'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Handshake } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'
import { getLocalizedPath } from '@/lib/i18n'
import { usePWAMode } from '@/hooks/usePWAMode'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/components/auth/AuthProvider'
import PartnersList from '@/components/partners/PartnersList'

export default function PartnersPageClient() {
  const { t, locale, dir } = useTranslation()
  const { isPWA } = usePWAMode()
  const router = useRouter()
  const searchParams = useSearchParams()
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
  const fromProfile = searchParams?.get('from') === 'profile'
  const isAppLikeMode = isPWA || isMobileWeb

  return (
    <div className={`bg-white min-h-screen ${isAppLikeMode ? 'pb-32' : ''}`}>
      {/* PWA / Mobile Web Simple Navigation Header */}
      {isAppLikeMode && (
        <div className={`flex items-center justify-between px-5 py-4 bg-white border-b border-gray-100 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <button 
            onClick={() => router.push(getLocalizedPath(fromProfile ? '/profile' : '/products', locale))}
            className={`flex items-center gap-1 min-w-[80px] ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            <svg className={`w-5 h-5 text-red-600 ${isRTL ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-base text-red-600">
              {fromProfile ? (locale === 'ar' ? 'الحساب' : locale === 'ru' ? 'Аккаунт' : 'Account') : (locale === 'ar' ? 'المنتجات' : locale === 'ru' ? 'Продукты' : 'Products')}
            </span>
          </button>
          <span className="text-base font-semibold text-gray-900">
            {locale === 'ar' ? 'الشركاء' : locale === 'ru' ? 'Партнёры' : 'Partners'}
          </span>
          {/* Profile Icon with green dot */}
          <button 
            onClick={() => router.push(getLocalizedPath('/profile', locale))}
            className="min-w-[80px] flex justify-end"
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
      )}

      <div className="container mx-auto px-3 md:px-4 py-4 md:py-16">
        <div className="max-w-6xl mx-auto">
          {/* Navigation Breadcrumb - Hide in PWA and mobile web */}
          {!isAppLikeMode && (
            <nav className="text-xs md:text-base text-gray-600 mb-2 md:mb-4" aria-label="Breadcrumb">
              <Link href={getLocalizedPath('/', locale)} className="hover:text-primary-600 transition-colors">
                {t('common.home') || 'Home'}
              </Link>
              <span> / </span>
              <span className="text-gray-900 font-medium">
                {locale === 'ar' ? 'الشركاء' : locale === 'ru' ? 'Партнёры' : 'Partners'}
              </span>
            </nav>
          )}
          
          {/* Back to Home - Hide in PWA and mobile web */}
          {!isAppLikeMode && (
            <Link href={getLocalizedPath('/', locale)} className={`inline-flex items-center gap-1 text-xs md:text-sm text-primary-600 hover:text-primary-700 mb-4 md:mb-8 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <ArrowLeft className={`h-3 w-3 md:h-4 md:w-4 ${isRTL ? 'rotate-180' : ''}`} />
              <span>{t('common.backToHome') || 'Back to Home'}</span>
            </Link>
          )}

          {/* Header */}
          <div className="text-center mb-4 md:mb-8">
            <div className={`inline-flex items-center justify-center gap-2 mb-2 md:mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="p-2 md:p-3 bg-gradient-to-r from-red-100 to-pink-100 rounded-lg md:rounded-xl">
                <Handshake className="h-4 w-4 md:h-6 md:w-6 text-red-600" />
              </div>
              <h1 className="text-xl md:text-3xl font-bold text-gray-800">
                {locale === 'ar' ? 'شركاؤنا' : locale === 'ru' ? 'Наши партнёры' : 'Our Partners'}
              </h1>
            </div>
            <p className="text-xs md:text-base text-gray-600 px-2">
              {locale === 'ar' 
                ? 'بناء شراكات قوية مع Genosys في جميع أنحاء الإمارات'
                : locale === 'ru'
                  ? 'Развиваем партнёрство Genosys по всем ОАЭ'
                  : 'Building strong Genosys partnerships across United Arab Emirates'}
            </p>
          </div>
          
          {/* Partners List */}
          <PartnersList />

          {/* Call to Action */}
          <div className="mt-6 md:mt-12">
            <div className="bg-gradient-to-r from-primary-50 to-red-50 rounded-lg md:rounded-xl p-4 md:p-8 border border-red-100">
              <h2 className="text-base md:text-2xl font-bold text-gray-800 mb-2 md:mb-4 text-center">
                {locale === 'ar' 
                  ? 'هل تريد أن تصبح شريكًا؟'
                  : locale === 'ru'
                    ? 'Хотите стать партнёром?'
                    : 'Interested in Becoming a Partner?'}
              </h2>
              <p className="text-xs md:text-base text-gray-600 mb-4 md:mb-6 text-center px-2">
                {locale === 'ar'
                  ? 'انضم إلى شبكة شركائنا الموثوقين وساعدنا في تقديم منتجات GENOSYS لمزيد من العملاء'
                  : locale === 'ru'
                    ? 'Присоединяйтесь к нашей сети партнёров и помогите нам доставить продукты GENOSYS большему числу клиентов'
                    : 'Join our network of trusted partners and help us bring GENOSYS products to more customers'}
              </p>
              <div className={`flex flex-col sm:flex-row gap-2 md:gap-4 justify-center ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
                <Link 
                  href={getLocalizedPath('/contact', locale)}
                  className="inline-flex items-center justify-center bg-primary-600 text-white px-4 md:px-6 py-2.5 md:py-3 rounded-lg text-xs md:text-base font-semibold hover:bg-primary-700 transition-colors min-h-[44px] touch-manipulation"
                >
                  {t('common.contact') || 'Contact Us'}
                </Link>
                <Link 
                  href={getLocalizedPath('/products', locale)}
                  className="inline-flex items-center justify-center border-2 border-primary-600 text-primary-600 px-4 md:px-6 py-2.5 md:py-3 rounded-lg text-xs md:text-base font-semibold hover:bg-primary-50 transition-colors min-h-[44px] touch-manipulation"
                >
                  {t('common.products') || 'View Products'}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
