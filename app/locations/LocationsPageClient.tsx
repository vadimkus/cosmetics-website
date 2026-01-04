'use client'

import Link from 'next/link'
import { MapPin, ArrowLeft } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'
import { getLocalizedPath } from '@/lib/i18n'
import { usePWAMode } from '@/hooks/usePWAMode'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/components/AuthProvider'

const locations = [
  {
    slug: 'dubai',
    name: 'Dubai',
    nameAr: 'دبي',
    nameRu: 'Дубай',
    description: 'Our office/warehouse is located in Dubai.',
    shippingCost: '45 AED',
    deliveryTime: '1-2 hours, same day (Careem)',
  },
  {
    slug: 'abu-dhabi',
    name: 'Abu Dhabi',
    nameAr: 'أبوظبي',
    nameRu: 'Абу-Даби',
    description: 'Professional Korean dermacosmetics delivered to all areas of Abu Dhabi',
    shippingCost: '70 AED',
    deliveryTime: '48 hours via Quiqup',
  },
  {
    slug: 'sharjah',
    name: 'Sharjah',
    nameAr: 'الشارقة',
    nameRu: 'Шарджа',
    description: 'Quality skincare products and professional training available in Sharjah',
    shippingCost: '70 AED',
    deliveryTime: '1-2 hours, same day (Careem)',
  },
  {
    slug: 'ras-al-khaimah',
    name: 'Ras Al Khaimah',
    nameAr: 'رأس الخيمة',
    nameRu: 'Рас-эль-Хайма',
    description: 'Our office is located in Ras Al Khaimah.',
    shippingCost: '70 AED',
    deliveryTime: '48 hours via Quiqup',
  },
  {
    slug: 'ajman',
    name: 'Ajman',
    nameAr: 'عجمان',
    nameRu: 'Аджман',
    description: 'Reliable delivery of premium Korean dermacosmetics to Ajman',
    shippingCost: '70 AED',
    deliveryTime: '48 hours via Quiqup',
  },
  {
    slug: 'fujairah',
    name: 'Fujairah',
    nameAr: 'الفجيرة',
    nameRu: 'Фуджейра',
    description: 'Quality skincare products delivered across Fujairah',
    shippingCost: '70 AED',
    deliveryTime: '48 hours via Quiqup',
  },
  {
    slug: 'umm-al-quwain',
    name: 'Umm Al Quwain',
    nameAr: 'أم القيوين',
    nameRu: 'Умм-эль-Кайвайн',
    description: 'Premium skincare products delivered across Umm Al Quwain',
    shippingCost: '70 AED',
    deliveryTime: '48 hours via Quiqup',
  },
]

export default function LocationsPageClient() {
  const { t, locale, dir } = useTranslation()
  const { isPWA } = usePWAMode()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()

  const isRTL = dir === 'rtl'
  const fromProfile = searchParams?.get('from') === 'profile'

  const getLocationName = (location: typeof locations[0]) => {
    if (locale === 'ar') return location.nameAr
    if (locale === 'ru') return location.nameRu
    return location.name
  }

  return (
    <div className={`bg-gradient-to-b from-gray-50 to-white min-h-screen ${isPWA ? 'pb-32' : ''}`}>
      {/* PWA Simple Navigation Header */}
      {isPWA && (
        <div className={`flex items-center justify-between px-5 py-4 bg-white ${isRTL ? 'flex-row-reverse' : ''}`}>
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
            {locale === 'ar' ? 'المواقع' : locale === 'ru' ? 'Локации' : 'Locations'}
          </span>
          {/* Profile Icon with green dot */}
          <button 
            onClick={() => router.push(getLocalizedPath('/profile', locale))}
            className="min-w-[80px] flex justify-end"
          >
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center">
                <span className="text-sm font-semibold text-white">
                  {user?.name?.charAt(0)?.toUpperCase() || 'G'}
                </span>
              </div>
              {user && (
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />
              )}
            </div>
          </button>
        </div>
      )}
      
      <div className="container mx-auto px-3 md:px-4 py-4 md:py-16">
        <div className="max-w-6xl mx-auto">
          {/* Navigation Breadcrumb - Hide in PWA */}
          {!isPWA && (
            <nav className="text-xs md:text-base text-gray-600 mb-2 md:mb-4" aria-label="Breadcrumb">
              <Link href={getLocalizedPath('/', locale)} className="hover:text-primary-600 transition-colors">
                {t('common.home') || 'Home'}
              </Link>
              <span> / </span>
              <span className="text-gray-900 font-medium">
                {locale === 'ar' ? 'المواقع' : locale === 'ru' ? 'Локации' : 'Locations'}
              </span>
            </nav>
          )}
          
          {/* Back to Home - Hide in PWA */}
          {!isPWA && (
            <Link href={getLocalizedPath('/', locale)} className={`inline-flex items-center gap-1 text-xs md:text-sm text-primary-600 hover:text-primary-700 mb-4 md:mb-8 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <ArrowLeft className={`h-3 w-3 md:h-4 md:w-4 ${isRTL ? 'rotate-180' : ''}`} />
              <span>{t('common.backToHome') || 'Back to Home'}</span>
            </Link>
          )}

          {/* Page Header */}
          <div className="text-center mb-6 md:mb-12">
            {!isPWA && (
              <div className="hidden md:inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-6">
                <MapPin className="h-8 w-8 text-primary-600" />
              </div>
            )}
            <h1 className="text-2xl md:text-5xl font-bold text-gray-800 mb-2 md:mb-4">
              {locale === 'ar' ? 'مواقعنا' : locale === 'ru' ? 'Наши локации' : 'Our Locations'}
            </h1>
            <p className="text-xs md:text-lg text-gray-600 max-w-2xl mx-auto">
              {locale === 'ar' ? 'التوصيل إلى جميع الإمارات السبع' : locale === 'ru' ? 'Доставка во все 7 эмиратов ОАЭ' : 'Delivering to all 7 UAE emirates'}
            </p>
          </div>

          {/* Locations Grid */}
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-6 mb-6 md:mb-12">
            {locations.map((location) => (
              <Link
                key={location.slug}
                href={getLocalizedPath(`/locations/${location.slug}`, locale)}
                className="bg-white border border-gray-200 rounded-lg md:rounded-xl p-3 md:p-6 hover:shadow-md transition-all duration-200 group"
              >
                <div className="flex flex-col md:flex-row md:items-start gap-2 md:gap-4">
                  <div className="hidden md:flex bg-primary-100 rounded-full p-3 group-hover:bg-primary-600 transition-colors">
                    <MapPin className="h-6 w-6 text-primary-600 group-hover:text-white transition-colors" />
                  </div>
                  <div className="flex-1">
                    <div className={`flex items-center gap-1.5 mb-1 md:mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <MapPin className="h-3 w-3 md:hidden text-primary-600" />
                      <h2 className="text-sm md:text-xl font-semibold text-gray-800 group-hover:text-primary-600 transition-colors">
                        {getLocationName(location)}
                      </h2>
                    </div>
                    <p className="hidden md:block text-gray-600 text-sm mb-3">
                      {location.description}
                    </p>
                    <div className="flex flex-col gap-0.5 md:gap-1 text-[10px] md:text-xs text-gray-500">
                      <span className="font-medium"><span className="text-gray-700">{location.shippingCost}</span></span>
                      <span className="text-gray-600 line-clamp-1">{location.deliveryTime}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* General Information */}
          <div className="bg-gradient-to-r from-primary-50 to-red-50 rounded-lg md:rounded-xl p-4 md:p-8 border border-primary-100 shadow-sm">
            <div className="text-center">
              <h2 className="text-lg md:text-2xl font-bold text-gray-800 mb-2 md:mb-3">
                {locale === 'ar' ? 'شحن مجاني متاح' : locale === 'ru' ? 'Бесплатная доставка' : 'Free Shipping Available'}
              </h2>
              <p className="text-xs md:text-base text-gray-600 mb-4 md:mb-6 max-w-xl mx-auto">
                {locale === 'ar' 
                  ? 'الطلبات فوق 1000 درهم تحصل على شحن مجاني في جميع أنحاء الإمارات'
                  : locale === 'ru'
                    ? 'Заказы от 1000 AED доставляются бесплатно по всем ОАЭ'
                    : 'Orders over 1000 AED qualify for free shipping across all UAE emirates.'}
              </p>
              <div className="flex flex-row gap-3 justify-center">
                <Link
                  href={getLocalizedPath('/products', locale)}
                  className="bg-primary-600 text-white px-4 md:px-8 py-2 md:py-3 rounded-lg text-xs md:text-base font-semibold hover:bg-primary-700 transition-colors text-center shadow-md flex items-center justify-center"
                >
                  {locale === 'ar' ? 'المنتجات' : locale === 'ru' ? 'Продукты' : 'Products'}
                </Link>
                <Link
                  href={getLocalizedPath('/contact', locale)}
                  className="border border-primary-600 text-primary-600 px-4 md:px-8 py-2 md:py-3 rounded-lg text-xs md:text-base font-semibold hover:bg-white transition-colors text-center shadow-md flex items-center justify-center"
                >
                  {locale === 'ar' ? 'اتصل بنا' : locale === 'ru' ? 'Контакты' : 'Contact'}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

