'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Clock, Truck, Phone, Mail, Gift, RotateCcw } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'
import { getLocalizedPath } from '@/lib/i18n'
import { usePWAMode } from '@/hooks/usePWAMode'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/components/auth/AuthProvider'

export default function DeliveryPageClient() {
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
            {locale === 'ar' ? 'التوصيل' : locale === 'ru' ? 'Доставка' : 'Delivery'}
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
        <div className="max-w-4xl lg:max-w-6xl mx-auto">
          {/* Navigation Breadcrumb - Hide in PWA and mobile web */}
          {!isAppLikeMode && (
            <nav className="text-xs md:text-base text-gray-600 mb-2 md:mb-4" aria-label="Breadcrumb">
              <Link href={getLocalizedPath('/', locale)} className="hover:text-primary-600 transition-colors">
                {t('common.home') || 'Home'}
              </Link>
              <span> / </span>
              <span className="text-gray-900 font-medium">
                {locale === 'ar' ? 'التوصيل' : locale === 'ru' ? 'Доставка' : 'Delivery'}
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
          <div className="text-center mb-6 md:mb-14">
            <p className="hidden md:block text-xs font-semibold tracking-[0.2em] text-primary-600 uppercase mb-3">
              {locale === 'ar' ? 'الشحن والإرجاع' : locale === 'ru' ? 'Доставка и возврат' : 'Shipping & Returns'}
            </p>
            <h1 className="text-xl md:text-5xl font-bold text-gray-900 mb-2 md:mb-4 tracking-tight">
              {locale === 'ar' ? 'معلومات التوصيل' : locale === 'ru' ? 'Информация о доставке' : 'Delivery Information'}
            </h1>
            <p className="text-sm md:text-lg text-gray-600 max-w-2xl mx-auto">
              {locale === 'ar' ? 'توصيل سريع في جميع أنحاء الإمارات' : locale === 'ru' ? 'Быстрая доставка по ОАЭ' : 'Fast, tracked delivery across the UAE — handled by professional couriers.'}
            </p>

            {/* Desktop stats strip */}
            <dl className="hidden md:grid md:grid-cols-4 gap-px mt-10 bg-gray-200 border border-gray-200 rounded-2xl overflow-hidden">
              <div className="bg-white px-5 py-5 text-center">
                <dt className="text-[11px] font-semibold tracking-wider text-gray-500 uppercase">
                  {locale === 'ar' ? 'دبي' : locale === 'ru' ? 'Дубай' : 'Dubai'}
                </dt>
                <dd className="mt-1 text-xl lg:text-2xl font-bold text-gray-900">
                  {locale === 'ar' ? '1 ساعة' : locale === 'ru' ? '1 час' : '1 hour'}
                </dd>
              </div>
              <div className="bg-white px-5 py-5 text-center">
                <dt className="text-[11px] font-semibold tracking-wider text-gray-500 uppercase">
                  {locale === 'ar' ? 'الإمارات' : locale === 'ru' ? 'ОАЭ' : 'UAE-wide'}
                </dt>
                <dd className="mt-1 text-xl lg:text-2xl font-bold text-gray-900">
                  {locale === 'ar' ? '24-36 س' : locale === 'ru' ? '24-36 ч' : '24–36 hr'}
                </dd>
              </div>
              <div className="bg-white px-5 py-5 text-center">
                <dt className="text-[11px] font-semibold tracking-wider text-gray-500 uppercase">
                  {locale === 'ar' ? 'شحن مجاني' : locale === 'ru' ? 'Беспл. доставка' : 'Free shipping'}
                </dt>
                <dd className="mt-1 text-xl lg:text-2xl font-bold text-emerald-700">
                  1,000 AED+
                </dd>
              </div>
              <div className="bg-white px-5 py-5 text-center">
                <dt className="text-[11px] font-semibold tracking-wider text-gray-500 uppercase">
                  {locale === 'ar' ? 'الإرجاع' : locale === 'ru' ? 'Возврат' : 'Returns'}
                </dt>
                <dd className="mt-1 text-xl lg:text-2xl font-bold text-gray-900">
                  {locale === 'ar' ? '10 أيام' : locale === 'ru' ? '10 дней' : '10 days'}
                </dd>
              </div>
            </dl>
          </div>

          {/* Delivery Time & Partner */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6 mb-4 md:mb-10">
            <div className="bg-white rounded-lg md:rounded-2xl shadow-sm md:shadow-md border border-gray-100 p-3 md:p-7">
              <div className={`flex items-start gap-3 md:gap-4 mb-2 md:mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="hidden md:flex h-11 w-11 rounded-xl bg-primary-50 items-center justify-center flex-shrink-0">
                  <Clock className="h-5 w-5 text-primary-600" aria-hidden="true" />
                </div>
                <Clock className={`md:hidden h-5 w-5 text-gray-700 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                <h2 className="text-sm md:text-lg font-semibold text-gray-900">
                  {locale === 'ar' ? 'وقت التوصيل' : locale === 'ru' ? 'Время доставки' : 'Delivery time'}
                </h2>
              </div>
              <p className="text-xs md:text-base text-gray-600 leading-relaxed md:pl-[60px]">
                <strong className="text-gray-900">{locale === 'ar' ? '1 ساعة في دبي' : locale === 'ru' ? '1 час в Дубае' : '1 hour in Dubai'}</strong>, <strong className="text-gray-900">{locale === 'ar' ? '24-36 ساعة في الإمارات' : locale === 'ru' ? '24-36 часов по ОАЭ' : '24–36 hours across UAE'}</strong>
              </p>
            </div>

            <div className="bg-white rounded-lg md:rounded-2xl shadow-sm md:shadow-md border border-gray-100 p-3 md:p-7">
              <div className={`flex items-start gap-3 md:gap-4 mb-2 md:mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="hidden md:flex h-11 w-11 rounded-xl bg-primary-50 items-center justify-center flex-shrink-0">
                  <Truck className="h-5 w-5 text-primary-600" aria-hidden="true" />
                </div>
                <Truck className={`md:hidden h-5 w-5 text-gray-700 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                <h2 className="text-sm md:text-lg font-semibold text-gray-900">
                  {locale === 'ar' ? 'شريك التوصيل' : locale === 'ru' ? 'Партнер по доставке' : 'Delivery partner'}
                </h2>
              </div>
              <p className="text-xs md:text-base text-gray-600 leading-relaxed md:pl-[60px]">
                <strong className="text-gray-900">Careem / QuipQup</strong> — {locale === 'ar' ? 'مباشرة إلى باب المنزل' : locale === 'ru' ? 'Прямо до двери' : 'direct to your doorstep, with tracking.'}
              </p>
            </div>
          </div>

          {/* Delivery Details */}
          <div className="bg-primary-50 rounded-lg md:rounded-2xl p-3 md:p-8 mb-3 md:mb-10">
            <h2 className="text-sm md:text-xl font-semibold text-gray-900 mb-3 md:mb-6 text-center">
              {locale === 'ar' ? 'تفاصيل التوصيل' : locale === 'ru' ? 'Детали доставки' : 'Delivery details'}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-6 text-xs md:text-base">
              <div className="md:bg-white md:rounded-xl md:px-4 md:py-3"><span className="font-semibold text-gray-800">{locale === 'ar' ? 'المنطقة:' : locale === 'ru' ? 'Регион:' : 'Area:'}</span> {locale === 'ar' ? 'الإمارات' : locale === 'ru' ? 'ОАЭ' : 'UAE'}</div>
              <div className="md:bg-white md:rounded-xl md:px-4 md:py-3"><span className="font-semibold text-gray-800">{locale === 'ar' ? 'الشريك:' : locale === 'ru' ? 'Партнер:' : 'Partner:'}</span> Careem/QuipQup</div>
              <div className="md:bg-white md:rounded-xl md:px-4 md:py-3"><span className="font-semibold text-gray-800">{locale === 'ar' ? 'دبي:' : locale === 'ru' ? 'Дубай:' : 'Dubai:'}</span> {locale === 'ar' ? '1 ساعة' : locale === 'ru' ? '1 час' : '1 hour'}</div>
              <div className="md:bg-white md:rounded-xl md:px-4 md:py-3"><span className="font-semibold text-gray-800">{locale === 'ar' ? 'الإمارات:' : locale === 'ru' ? 'ОАЭ:' : 'UAE:'}</span> {locale === 'ar' ? '24-36 ساعة' : locale === 'ru' ? '24-36 часов' : '24–36 hours'}</div>
            </div>
          </div>

          {/* Free Shipping + Return Policy — stacked on mobile, side-by-side from lg+ */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-6 mb-3 md:mb-10">
            {/* Free Shipping */}
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/70 border border-emerald-100 rounded-lg md:rounded-2xl p-3 md:p-8 flex flex-col">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 md:gap-3 mb-2 md:mb-4">
                  <div className="hidden md:flex h-11 w-11 rounded-xl bg-white items-center justify-center">
                    <Gift className="h-5 w-5 text-emerald-600" aria-hidden="true" />
                  </div>
                  <Gift className="md:hidden h-6 w-6 text-emerald-600" />
                  <h2 className="text-base md:text-2xl font-bold text-gray-900">
                    {locale === 'ar' ? 'شحن مجاني' : locale === 'ru' ? 'Бесплатная доставка' : 'Free shipping'}
                  </h2>
                </div>
                <div className="bg-white rounded-lg md:rounded-xl p-3 md:p-6 max-w-md mx-auto shadow-sm">
                  <div className="text-2xl md:text-4xl font-bold text-emerald-700 mb-1 tracking-tight">1,000 AED+</div>
                  <div className="text-sm md:text-lg font-semibold text-emerald-700 tracking-wide">
                    {locale === 'ar' ? 'توصيل مجاني' : locale === 'ru' ? 'БЕСПЛАТНАЯ ДОСТАВКА' : 'FREE DELIVERY'}
                  </div>
                </div>
                <p className="text-xs md:text-sm text-gray-600 mt-3 md:mt-5">
                  {locale === 'ar' ? 'لا يوجد حد أدنى للطلب، لا رسوم مخفية' : locale === 'ru' ? 'Без минимального заказа, без скрытых комиссий' : 'No hidden fees. Applied automatically at checkout.'}
                </p>
              </div>
            </div>

            {/* Return Policy */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100/70 border border-blue-100 rounded-lg md:rounded-2xl p-3 md:p-8 flex flex-col">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 md:gap-3 mb-2 md:mb-4">
                  <div className="hidden md:flex h-11 w-11 rounded-xl bg-white items-center justify-center">
                    <RotateCcw className="h-5 w-5 text-blue-600" aria-hidden="true" />
                  </div>
                  <RotateCcw className="md:hidden h-6 w-6 text-blue-600" />
                  <h2 className="text-base md:text-2xl font-bold text-gray-900">
                    {locale === 'ar' ? 'سياسة الإرجاع' : locale === 'ru' ? 'Политика возврата' : 'Return policy'}
                  </h2>
                </div>
                <div className="bg-white rounded-lg md:rounded-xl p-3 md:p-6 shadow-sm">
                  <dl className="grid grid-cols-2 gap-2 md:gap-4 text-xs md:text-sm text-left">
                    <div><dt className="font-semibold text-gray-800 inline">{locale === 'ar' ? 'المدة:' : locale === 'ru' ? 'Период:' : 'Period:'}</dt> <dd className="inline text-gray-600">{locale === 'ar' ? '10 أيام' : locale === 'ru' ? '10 дней' : '10 days'}</dd></div>
                    <div><dt className="font-semibold text-gray-800 inline">{locale === 'ar' ? 'الاسترداد:' : locale === 'ru' ? 'Возврат:' : 'Refund:'}</dt> <dd className="inline text-gray-600">{locale === 'ar' ? '3-5 أيام' : locale === 'ru' ? '3-5 дней' : '3–5 days'}</dd></div>
                    <div><dt className="font-semibold text-gray-800 inline">{locale === 'ar' ? 'الحالة:' : locale === 'ru' ? 'Состояние:' : 'Condition:'}</dt> <dd className="inline text-gray-600">{locale === 'ar' ? 'غير مستخدم، تغليف أصلي' : locale === 'ru' ? 'Не использовано, оригинальная упаковка' : 'Unused, original packaging'}</dd></div>
                    <div><dt className="font-semibold text-gray-800 inline">{locale === 'ar' ? 'العملية:' : locale === 'ru' ? 'Процесс:' : 'Process:'}</dt> <dd className="inline text-gray-600">{locale === 'ar' ? 'اتصل بنا' : locale === 'ru' ? 'Свяжитесь с нами' : 'Contact us'}</dd></div>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          {/* Help Section */}
          <div className="bg-white rounded-lg md:rounded-2xl shadow-sm md:shadow-md border border-gray-100 p-3 md:p-8 text-center">
            <h2 className="text-sm md:text-xl font-semibold text-gray-900 mb-1 md:mb-2">
              {locale === 'ar' ? 'تحتاج مساعدة؟' : locale === 'ru' ? 'Нужна помощь?' : 'Need help?'}
            </h2>
            <p className="hidden md:block text-sm text-gray-500 mb-5">
              {locale === 'ar' ? 'فريقنا جاهز للرد على أسئلتك حول الطلبات والتوصيل.' : locale === 'ru' ? 'Мы готовы ответить на вопросы о заказах и доставке.' : 'We\'re ready to answer any question about your order or delivery.'}
            </p>
            <div className="flex flex-row gap-2 md:gap-3 justify-center">
              <a
                href="https://wa.me/971585487665"
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center justify-center bg-green-600 text-white px-3 md:px-6 py-2 md:py-3 rounded-lg md:rounded-xl text-xs md:text-base font-semibold hover:bg-green-700 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}
              >
                <Phone className={`h-4 w-4 md:h-5 md:w-5 ${isRTL ? 'ml-1 md:ml-2' : 'mr-1 md:mr-2'}`} aria-hidden="true" />
                WhatsApp
              </a>
              <a
                href="mailto:sales@genosys.ae"
                className={`inline-flex items-center justify-center bg-primary-600 text-white px-3 md:px-6 py-2 md:py-3 rounded-lg md:rounded-xl text-xs md:text-base font-semibold hover:bg-primary-700 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}
              >
                <Mail className={`h-4 w-4 md:h-5 md:w-5 ${isRTL ? 'ml-1 md:ml-2' : 'mr-1 md:mr-2'}`} aria-hidden="true" />
                Email
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

