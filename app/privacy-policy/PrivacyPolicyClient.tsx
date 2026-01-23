'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { ArrowLeft, Shield, Mail, Phone, ExternalLink } from 'lucide-react'
import BreadcrumbSchema from '@/components/BreadcrumbSchema'
import { useTranslation } from '@/hooks/useTranslation'
import { getLocalizedPath } from '@/lib/i18n'
import { usePWAMode } from '@/hooks/usePWAMode'
import { useAuth } from '@/components/AuthProvider'

export default function PrivacyPolicyClient() {
  const { locale, dir } = useTranslation()
  const { isPWA, isClient } = usePWAMode()
  const { user } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const isRTL = dir === 'rtl'
  const fromProfile = searchParams?.get('from') === 'profile'
  const userInitial = user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'
  const [isMobileWeb, setIsMobileWeb] = useState(false)
  
  // Detect mobile web (non-PWA mobile)
  useEffect(() => {
    const checkMobileWeb = () => {
      const isMobile = window.innerWidth < 768
      setIsMobileWeb(isMobile && !isPWA)
    }
    checkMobileWeb()
    window.addEventListener('resize', checkMobileWeb)
    return () => window.removeEventListener('resize', checkMobileWeb)
  }, [isPWA])
  
  // App-like mode: PWA or mobile web
  const isAppLikeMode = (isClient && isPWA) || isMobileWeb
  
  // Date translations
  const lastUpdated = locale === 'ar' ? '13 يناير 2026' : locale === 'ru' ? '13 января 2026' : 'January 13, 2026'
  
  // Section translations
  const translations = {
    title: locale === 'ar' ? 'سياسة الخصوصية' : locale === 'ru' ? 'Политика конфиденциальности' : 'Privacy Policy',
    subtitle: locale === 'ar' ? 'بياناتك، حقوقك' : locale === 'ru' ? 'Ваши данные, ваши права' : 'Your Data, Your Rights',
    lastUpdatedLabel: locale === 'ar' ? 'آخر تحديث:' : locale === 'ru' ? 'Последнее обновление:' : 'Last Updated:',
    
    // Rights section
    rightsTitle: locale === 'ar' ? 'حقوقك في الخصوصية' : locale === 'ru' ? 'Ваши права на конфиденциальность' : 'Your Privacy Rights',
    rightsText: locale === 'ar' 
      ? 'كمستخدم مسجّل، لديك الحق في الوصول إلى معلوماتك الشخصية أو تحديثها أو حذفها. يوضح هذا القسم كيفية تعاملنا مع بياناتك وحقوقك بموجب سياسة الخصوصية.'
      : locale === 'ru' 
        ? 'Как зарегистрированный пользователь, вы имеете право на доступ, обновление или удаление вашей личной информации. В этом разделе описано, как мы обрабатываем ваши данные и ваши права в соответствии с нашей политикой конфиденциальности.'
        : 'As a registered user, you have the right to access, update, or delete your personal information. This section outlines how we handle your data and your rights under our privacy policy.',
    
    // Personal Info section
    personalInfoTitle: locale === 'ar' ? '1. المعلومات الشخصية التي نجمعها' : locale === 'ru' ? '1. Личная информация, которую мы собираем' : '1. Personal Information We Collect',
    accountLabel: locale === 'ar' ? 'معلومات الحساب:' : locale === 'ru' ? 'Информация об аккаунте:' : 'Account Information:',
    accountText: locale === 'ar' ? 'الاسم، البريد الإلكتروني، رقم الهاتف، العنوان' : locale === 'ru' ? 'Имя, email, телефон, адрес' : 'Name, email, phone number, address',
    profileLabel: locale === 'ar' ? 'بيانات الملف الشخصي:' : locale === 'ru' ? 'Данные профиля:' : 'Profile Data:',
    profileText: locale === 'ar' ? 'تاريخ الميلاد، صورة الملف الشخصي، تفضيلات العميل' : locale === 'ru' ? 'День рождения, фото профиля, предпочтения' : 'Birthday, profile picture, customer preferences',
    orderLabel: locale === 'ar' ? 'معلومات الطلبات:' : locale === 'ru' ? 'Информация о заказах:' : 'Order Information:',
    orderText: locale === 'ar' ? 'سجل المشتريات، عناوين الشحن، تفاصيل الدفع' : locale === 'ru' ? 'История покупок, адреса доставки, платежные данные' : 'Purchase history, shipping addresses, payment details',
    usageLabel: locale === 'ar' ? 'بيانات الاستخدام:' : locale === 'ru' ? 'Данные использования:' : 'Usage Data:',
    usageText: locale === 'ar' ? 'تفاعلات الموقع/التطبيق، مشاهدات الصفحات، بيانات الجلسة' : locale === 'ru' ? 'Взаимодействие с сайтом/приложением, просмотры страниц, данные сессии' : 'Website interactions, page views, session data',
    
    // Google Auth section
    googleTitle: locale === 'ar' ? '2. تسجيل الدخول عبر Google' : locale === 'ru' ? '2. Вход через Google (OAuth)' : '2. Google Authentication (OAuth)',
    googleSignInLabel: locale === 'ar' ? 'تسجيل الدخول عبر Google:' : locale === 'ru' ? 'Вход через Google:' : 'Google Sign-In:',
    googleSignInText: locale === 'ar' 
      ? 'عند تسجيل الدخول عبر Google، نستلم معلومات ملفك الأساسية (الاسم، البريد الإلكتروني، صورة الملف) من Google وفقًا لإعدادات الخصوصية في حسابك على Google.'
      : locale === 'ru' 
        ? 'При входе через Google мы получаем вашу основную информацию профиля (имя, email, фото) от Google в соответствии с настройками конфиденциальности вашего аккаунта Google.'
        : 'When you sign in with Google, we receive your basic profile information (name, email, profile picture) from Google according to your Google account privacy settings.',
    googleDataLabel: locale === 'ar' ? 'البيانات التي تتم مشاركتها:' : locale === 'ru' ? 'Передаваемые данные:' : 'Data Shared:',
    googleDataText: locale === 'ar' 
      ? 'نستلم فقط المعلومات التي قمت بجعلها متاحة للعامة في ملفك على Google أو التي وافقت صراحة على مشاركتها أثناء عملية تسجيل الدخول.'
      : locale === 'ru' 
        ? 'Мы получаем только информацию, которую вы сделали публичной в своем профиле Google или на передачу которой вы явно согласились в процессе аутентификации.'
        : 'We only receive information that you have made publicly available in your Google profile or that you explicitly consent to share during the authentication process.',
    
    // Apple Auth section
    appleTitle: locale === 'ar' ? '3. تسجيل الدخول عبر Apple' : locale === 'ru' ? '3. Вход через Apple' : '3. Apple Sign‑In',
    appleSignInLabel: locale === 'ar' ? 'Sign in with Apple:' : locale === 'ru' ? 'Вход через Apple:' : 'Sign in with Apple:',
    appleSignInText: locale === 'ar' 
      ? 'عند تسجيل الدخول عبر Apple، قد نستلم اسمك وعنوان بريدك الإلكتروني (حسب ما تختار مشاركته). وقد توفّر Apple بريدًا إلكترونيًا خاصًا (Private Relay) بدلًا من بريدك الحقيقي.'
      : locale === 'ru' 
        ? 'При входе через Apple мы можем получить ваше имя и email (в зависимости от того, что вы решите передать). Apple может предоставить частный ретранслируемый email вместо вашего реального адреса.'
        : 'When you sign in with Apple, we may receive your name and email address (depending on what you choose to share). Apple may provide a private relay email address instead of your real email address.',
    
    // Contact section
    contactTitle: locale === 'ar' ? '4. تواصل معنا' : locale === 'ru' ? '4. Свяжитесь с нами' : '4. Contact Us',
    contactText: locale === 'ar' 
      ? 'إذا كانت لديك أي أسئلة حول سياسة الخصوصية أو ممارسات البيانات لدينا، يرجى التواصل معنا:'
      : locale === 'ru' 
        ? 'Если у вас есть вопросы о политике конфиденциальности или наших практиках обработки данных, пожалуйста, свяжитесь с нами:'
        : 'If you have any questions about this Privacy Policy or our data practices, please contact us:',
    
    backToHome: locale === 'ar' ? 'الرجوع للرئيسية' : locale === 'ru' ? 'Вернуться на главную' : 'Back to Home',
    home: locale === 'ar' ? 'الرئيسية' : locale === 'ru' ? 'Главная' : 'Home',
    back: locale === 'ar' ? 'الحساب' : locale === 'ru' ? 'Аккаунт' : 'Account',
  }

  const handleBack = () => {
    if (fromProfile) {
      router.push(getLocalizedPath('/profile', locale))
    } else {
      router.push(getLocalizedPath('/products', locale))
    }
  }

  // PWA/Mobile Web Mode - Light header only
  if (isAppLikeMode) {
    return (
      <div className="min-h-screen bg-gray-50 pb-32" dir={dir}>
        {/* PWA/Mobile Web Light Header */}
        <div className={`flex items-center justify-between px-5 py-4 bg-white border-b border-gray-200 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <button 
            onClick={handleBack}
            className={`flex items-center gap-1 min-w-[80px] ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            <ArrowLeft className={`w-5 h-5 text-red-600 ${isRTL ? 'rotate-180' : ''}`} />
            <span className="text-base text-red-600">
              {translations.back}
            </span>
          </button>
          <span className="text-base font-semibold text-gray-900">
            {translations.title}
          </span>
          {/* Profile Icon with green dot */}
          <button 
            onClick={() => router.push(getLocalizedPath('/profile', locale))}
            className="min-w-[80px] flex justify-end"
          >
            <div className="relative">
              <div className="w-9 h-9 rounded-full bg-red-600 flex items-center justify-center">
                <span className="text-sm font-semibold text-white">
                  {userInitial.toUpperCase()}
                </span>
              </div>
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-[1.5px] border-white" />
            </div>
          </button>
        </div>

        {/* Content */}
        <div className="px-5 py-6">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            {/* Last Updated */}
            <p className={`text-sm text-gray-500 mb-4 ${isRTL ? 'text-right' : ''}`}>
              {translations.lastUpdatedLabel} {lastUpdated}
            </p>
            
            {/* Rights Section */}
            <div className={`bg-red-50 p-4 rounded-xl border-l-4 border-red-600 mb-4 ${isRTL ? 'border-l-0 border-r-4' : ''}`}>
              <h2 className={`text-lg font-bold text-red-700 mb-2 ${isRTL ? 'text-right' : ''}`}>{translations.rightsTitle}</h2>
              <p className={`text-sm text-gray-700 leading-relaxed ${isRTL ? 'text-right' : ''}`}>{translations.rightsText}</p>
            </div>

            {/* Personal Info Section */}
            <div className="mb-4">
              <h2 className={`text-lg font-bold text-gray-900 mb-2 ${isRTL ? 'text-right' : ''}`}>{translations.personalInfoTitle}</h2>
              <ul className={`space-y-1 text-sm text-gray-700 ${isRTL ? 'text-right' : ''}`}>
                <li><strong>{translations.accountLabel}</strong> {translations.accountText}</li>
                <li><strong>{translations.profileLabel}</strong> {translations.profileText}</li>
                <li><strong>{translations.orderLabel}</strong> {translations.orderText}</li>
                <li><strong>{translations.usageLabel}</strong> {translations.usageText}</li>
              </ul>
            </div>

            {/* Google Auth Section */}
            <div className="mb-4">
              <h2 className={`text-lg font-bold text-gray-900 mb-2 ${isRTL ? 'text-right' : ''}`}>{translations.googleTitle}</h2>
              <p className={`text-sm text-gray-700 mb-1 ${isRTL ? 'text-right' : ''}`}><strong>{translations.googleSignInLabel}</strong> {translations.googleSignInText}</p>
              <p className={`text-sm text-gray-700 ${isRTL ? 'text-right' : ''}`}><strong>{translations.googleDataLabel}</strong> {translations.googleDataText}</p>
            </div>

            {/* Apple Auth Section */}
            <div className="mb-4">
              <h2 className={`text-lg font-bold text-gray-900 mb-2 ${isRTL ? 'text-right' : ''}`}>{translations.appleTitle}</h2>
              <p className={`text-sm text-gray-700 ${isRTL ? 'text-right' : ''}`}><strong>{translations.appleSignInLabel}</strong> {translations.appleSignInText}</p>
            </div>

            {/* Contact Section */}
            <div>
              <h2 className={`text-lg font-bold text-gray-900 mb-2 ${isRTL ? 'text-right' : ''}`}>{translations.contactTitle}</h2>
              <p className={`text-sm text-gray-700 mb-2 ${isRTL ? 'text-right' : ''}`}>{translations.contactText}</p>
              <div className={`flex flex-col gap-2 text-sm ${isRTL ? 'items-end' : ''}`}>
                <a href="mailto:info@genosys.ae" className="text-red-600 flex items-center gap-2">
                  <Mail className="w-4 h-4" /> info@genosys.ae
                </a>
                <a href="tel:+971585487665" className="text-red-600 flex items-center gap-2">
                  <Phone className="w-4 h-4" /> +971 58 548 7665
                </a>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-4 text-sm text-gray-400">
            <p>© 2026 GENOSYS Middle East FZ-LLC</p>
          </div>
        </div>
      </div>
    )
  }

  // Non-PWA Mode - Full page with decorative elements
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50" dir={dir}>
      <BreadcrumbSchema
        items={[
          { name: translations.home, url: getLocalizedPath('/', locale) },
          { name: translations.title, url: getLocalizedPath('/privacy-policy', locale) },
        ]}
      />

      <div className="container mx-auto px-4 py-8 md:py-12 max-w-5xl">
        {/* Back Button */}
        <Link 
          href={getLocalizedPath('/', locale)}
          className={`inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-6 transition-colors group ${isRTL ? 'flex-row-reverse' : ''}`}
        >
          <ArrowLeft className={`w-4 h-4 group-hover:-translate-x-1 transition-transform ${isRTL ? 'rotate-180' : ''}`} />
          <span>{translations.backToHome}</span>
        </Link>

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-8">
          <div className={`flex items-center gap-4 mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="bg-primary-100 p-4 rounded-xl">
              <Shield className="w-8 h-8 text-primary-600" />
            </div>
            <div className={isRTL ? 'text-right' : ''}>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{translations.title}</h1>
              <p className="text-gray-600 mt-1">{translations.subtitle}</p>
            </div>
          </div>
          <p className={`text-gray-600 text-lg ${isRTL ? 'text-right' : ''}`}>
            {translations.lastUpdatedLabel} <span className="font-semibold">{lastUpdated}</span>
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 space-y-8">
          {/* Rights Highlight Section */}
          <section className={`bg-red-50 p-6 rounded-xl border-l-4 border-red-600 ${isRTL ? 'border-l-0 border-r-4' : ''}`}>
            <h2 className={`text-xl font-bold text-red-700 mb-3 ${isRTL ? 'text-right' : ''}`}>{translations.rightsTitle}</h2>
            <p className={`text-gray-700 leading-relaxed ${isRTL ? 'text-right' : ''}`}>{translations.rightsText}</p>
          </section>

          {/* Section 1: Personal Information */}
          <section className="border-t border-gray-200 pt-8">
            <h2 className={`text-2xl font-bold text-gray-900 mb-4 ${isRTL ? 'text-right' : ''}`}>
              {translations.personalInfoTitle}
            </h2>
            <div className={`space-y-4 text-gray-700 leading-relaxed ${isRTL ? 'text-right' : ''}`}>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div>
                  <span className="font-semibold text-gray-900">{translations.accountLabel}</span>{' '}
                  <span>{translations.accountText}</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-900">{translations.profileLabel}</span>{' '}
                  <span>{translations.profileText}</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-900">{translations.orderLabel}</span>{' '}
                  <span>{translations.orderText}</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-900">{translations.usageLabel}</span>{' '}
                  <span>{translations.usageText}</span>
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: Google Auth */}
          <section className="border-t border-gray-200 pt-8">
            <h2 className={`text-2xl font-bold text-gray-900 mb-4 ${isRTL ? 'text-right' : ''}`}>
              {translations.googleTitle}
            </h2>
            <div className={`space-y-4 text-gray-700 leading-relaxed ${isRTL ? 'text-right' : ''}`}>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 space-y-3">
                <div>
                  <span className="font-semibold text-gray-900">{translations.googleSignInLabel}</span>{' '}
                  <span>{translations.googleSignInText}</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-900">{translations.googleDataLabel}</span>{' '}
                  <span>{translations.googleDataText}</span>
                </div>
                <div className={`flex items-center gap-2 text-sm ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                  <ExternalLink className="w-4 h-4 text-primary-600" />
                  <a 
                    href="https://policies.google.com/privacy" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:underline"
                  >
                    Google Privacy Policy
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: Apple Auth */}
          <section className="border-t border-gray-200 pt-8">
            <h2 className={`text-2xl font-bold text-gray-900 mb-4 ${isRTL ? 'text-right' : ''}`}>
              {translations.appleTitle}
            </h2>
            <div className={`space-y-4 text-gray-700 leading-relaxed ${isRTL ? 'text-right' : ''}`}>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
                <div>
                  <span className="font-semibold text-gray-900">{translations.appleSignInLabel}</span>{' '}
                  <span>{translations.appleSignInText}</span>
                </div>
                <div className={`flex items-center gap-2 text-sm ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                  <ExternalLink className="w-4 h-4 text-primary-600" />
                  <a 
                    href="https://www.apple.com/legal/privacy/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:underline"
                  >
                    Apple Privacy Policy
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* Section 4: Contact */}
          <section className="border-t border-gray-200 pt-8">
            <h2 className={`text-2xl font-bold text-gray-900 mb-4 ${isRTL ? 'text-right' : ''}`}>
              {translations.contactTitle}
            </h2>
            <div className={`space-y-4 text-gray-700 leading-relaxed ${isRTL ? 'text-right' : ''}`}>
              <p>{translations.contactText}</p>
              <div className="bg-gradient-to-r from-primary-50 to-purple-50 rounded-xl p-6 space-y-4">
                <div>
                  <h3 className="font-bold text-gray-900 mb-3">GENOSYS Middle East FZ-LLC</h3>
                  <div className="space-y-2">
                    <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <Mail className="w-5 h-5 text-primary-600 flex-shrink-0" />
                      <a href="mailto:sales@genosys.ae" className="text-primary-600 hover:underline">
                        sales@genosys.ae
                      </a>
                    </div>
                    <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <Phone className="w-5 h-5 text-primary-600 flex-shrink-0" />
                      <a href="tel:+971585487665" className="text-primary-600 hover:underline" dir="ltr">
                        +971 58 548 76 65
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Full Privacy Policy Link */}
          <section className="border-t border-gray-200 pt-8">
            <div className={`bg-blue-50 border border-blue-200 rounded-lg p-4 ${isRTL ? 'text-right' : ''}`}>
              <p className="text-gray-700">
                {locale === 'ar' 
                  ? 'يمكنك مراجعة سياسة الخصوصية الكاملة على موقعنا الإلكتروني.'
                  : locale === 'ru'
                    ? 'Полную политику конфиденциальности можно просмотреть на нашем сайте.'
                    : 'You can review the complete privacy policy on our website.'}
              </p>
            </div>
          </section>
        </div>

        {/* Footer Note */}
        <div className={`mt-8 text-center text-sm text-gray-500 ${isRTL ? 'text-center' : ''}`}>
          <p>© 2026 GENOSYS Middle East FZ-LLC. {locale === 'ar' ? 'جميع الحقوق محفوظة.' : locale === 'ru' ? 'Все права защищены.' : 'All rights reserved.'}</p>
        </div>
      </div>
    </div>
  )
}

