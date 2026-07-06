'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { MapPin, ArrowLeft, ArrowRight } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'
import { getLocalizedPath } from '@/lib/i18n'
import { usePWAMode } from '@/hooks/usePWAMode'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/components/auth/AuthProvider'

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
    name: 'Abu Dhabi & Al Ain',
    nameAr: 'أبوظبي والعين',
    nameRu: 'Абу-Даби и Аль-Айн',
    description: 'Official Authorized Reseller available in Abu Dhabi & Al Ain',
    shippingCost: '70 AED',
    deliveryTime: '24 hours via Quiqup',
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

  const getLocationName = (location: typeof locations[0]) => {
    if (locale === 'ar') return location.nameAr
    if (locale === 'ru') return location.nameRu
    return location.name
  }

  return (
    <div className={`bg-gradient-to-b from-gray-50 to-white min-h-screen ${isAppLikeMode ? 'pb-32' : ''}`}>
      {/* PWA / Mobile Web Simple Navigation Header */}
      {isAppLikeMode && (
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
            {locale === 'ar' ? 'المواقع' : locale === 'ru' ? 'Где купить' : 'Locations'}
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
                {locale === 'ar' ? 'المواقع' : locale === 'ru' ? 'Где купить' : 'Locations'}
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

          {/* Page Header.
              App-like (mobile/PWA): compact centered title.
              Desktop: editorial hero (kicker → left headline → subhead + stats)
              to match About / Delivery / Contact / FAQ. */}
          {isAppLikeMode ? (
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                {locale === 'ar' ? 'مواقعنا' : locale === 'ru' ? 'Наши локации' : 'Our Locations'}
              </h1>
              <p className="text-xs text-gray-600 max-w-2xl mx-auto">
                {locale === 'ar' ? 'التوصيل إلى جميع الإمارات السبع' : locale === 'ru' ? 'Доставка во все 7 эмиратов ОАЭ' : 'Delivering to all 7 UAE emirates'}
              </p>
            </div>
          ) : (
            <header className="mb-8 md:mb-12">
              <p className="text-[11px] md:text-xs font-mono uppercase tracking-[0.32em] text-gray-500">
                {locale === 'ar'
                  ? 'أين نصل · الإمارات السبع'
                  : locale === 'ru'
                    ? 'ЗОНА ДОСТАВКИ · 7 ЭМИРАТОВ'
                    : 'WHERE WE DELIVER · 7 EMIRATES'}
              </p>
              <h1 className={`mt-3 max-w-4xl text-3xl md:text-5xl lg:text-[3.4rem] font-semibold leading-[1.05] tracking-tight text-gray-900 ${isRTL ? 'text-right' : ''}`}>
                {locale === 'ar' ? 'مواقعنا' : locale === 'ru' ? 'Наши локации' : 'Our Locations'}
              </h1>
              <p className={`mt-4 max-w-2xl text-base md:text-lg leading-relaxed text-gray-600 ${isRTL ? 'text-right' : ''}`}>
                {locale === 'ar'
                  ? 'التوصيل إلى جميع الإمارات السبع — من مكتبينا في دبي ورأس الخيمة، عبر Careem و Quiqup.'
                  : locale === 'ru'
                    ? 'Доставка во все 7 эмиратов ОАЭ — из наших офисов в Дубае и Рас-эль-Хайме, через Careem и Quiqup.'
                    : 'Delivering to all 7 UAE emirates — from our Dubai and Ras Al Khaimah offices, via Careem and Quiqup.'}
              </p>

              {/* Stats strip — mirrors About / FAQ */}
              <dl className="mt-8 hidden md:grid md:grid-cols-3 gap-px overflow-hidden rounded-2xl border border-gray-200 bg-gray-200">
                <div className="bg-white px-6 py-5">
                  <dt className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.2em] text-gray-500">
                    <MapPin className="h-3.5 w-3.5 text-red-600" />
                    {locale === 'ar' ? 'الإمارات المخدومة' : locale === 'ru' ? 'эмиратов' : 'emirates served'}
                  </dt>
                  <dd className="mt-2 text-3xl font-semibold tracking-tight text-gray-900">7</dd>
                </div>
                <div className="bg-white px-6 py-5">
                  <dt className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.2em] text-gray-500">
                    <ArrowRight className="h-3.5 w-3.5 text-red-600" />
                    {locale === 'ar' ? 'أسرع توصيل' : locale === 'ru' ? 'самая быстрая доставка' : 'fastest delivery'}
                  </dt>
                  <dd className="mt-2 flex items-baseline gap-2 text-3xl font-semibold tracking-tight text-gray-900">
                    <span>1–2h</span>
                    <span className="text-sm font-medium text-gray-500">{locale === 'ar' ? 'دبي' : locale === 'ru' ? 'Дубай' : 'Dubai'}</span>
                  </dd>
                </div>
                <div className="bg-white px-6 py-5">
                  <dt className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.2em] text-gray-500">
                    <MapPin className="h-3.5 w-3.5 text-red-600" />
                    {locale === 'ar' ? 'مكاتبنا' : locale === 'ru' ? 'наши офисы' : 'our offices'}
                  </dt>
                  <dd className="mt-2 flex items-baseline gap-2 text-3xl font-semibold tracking-tight text-gray-900">
                    <span>2</span>
                    <span className="text-sm font-medium text-gray-500">Dubai · RAK</span>
                  </dd>
                </div>
              </dl>
            </header>
          )}

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

          {/* Free-shipping CTA — editorial dark panel, matching About / Delivery
              / Contact / FAQ (replaces the old pink-gradient block). */}
          <section className="relative overflow-hidden rounded-xl md:rounded-3xl bg-gray-950 text-white">
            <span aria-hidden className="pointer-events-none absolute -top-32 -left-20 h-72 w-72 rounded-full bg-red-600/25 blur-3xl" />
            <span aria-hidden className="pointer-events-none absolute -bottom-32 right-0 h-72 w-72 rounded-full bg-red-500/15 blur-3xl" />

            <div className="relative grid gap-8 p-6 md:grid-cols-[1.4fr_1fr] md:items-end md:gap-12 md:p-10">
              <div className={isRTL ? 'text-right' : ''}>
                <p className="text-[11px] font-mono uppercase tracking-[0.32em] text-red-300/90">
                  {locale === 'ar' ? 'شحن مجاني' : locale === 'ru' ? 'БЕСПЛАТНАЯ ДОСТАВКА' : 'FREE SHIPPING'}
                </p>
                <h2 className="mt-3 text-2xl md:text-3xl lg:text-4xl font-semibold tracking-tight leading-[1.1]">
                  {locale === 'ar' ? 'توصيل مجاني للطلبات فوق 1000 درهم.' : locale === 'ru' ? 'Бесплатная доставка от 1000 AED.' : 'Free delivery on orders over 1000 AED.'}
                </h2>
                <p className="mt-3 max-w-md text-sm md:text-base leading-relaxed text-gray-300">
                  {locale === 'ar'
                    ? 'يُطبَّق تلقائيًا عند الدفع، في جميع الإمارات السبع. لا رسوم خفية.'
                    : locale === 'ru'
                      ? 'Применяется автоматически при оформлении заказа, во всех 7 эмиратах. Без скрытых сборов.'
                      : 'Applied automatically at checkout, across all 7 emirates. No hidden fees.'}
                </p>
              </div>

              <div className={`flex flex-col gap-3 sm:flex-row md:flex-col ${isRTL ? 'md:items-end' : 'md:items-stretch'}`}>
                <Link
                  href={getLocalizedPath('/products', locale)}
                  className="group inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-gray-900 transition-all hover:bg-red-500 hover:text-white"
                >
                  {locale === 'ar' ? 'المنتجات' : locale === 'ru' ? 'Продукты' : 'Products'}
                  <ArrowRight className={`h-4 w-4 transition-transform group-hover:translate-x-0.5 ${isRTL ? 'rotate-180 group-hover:-translate-x-0.5 group-hover:translate-x-0' : ''}`} />
                </Link>
                <Link
                  href={getLocalizedPath('/contact', locale)}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:border-white/40 hover:bg-white/10"
                >
                  {locale === 'ar' ? 'اتصل بنا' : locale === 'ru' ? 'Контакты' : 'Contact'}
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

