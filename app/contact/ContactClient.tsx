'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Phone, Mail, MapPin, FileText, Globe } from 'lucide-react'
import { Instagram, Facebook } from '@/components/icons/BrandIcons'
import { IconOfficialDistributor } from '@/components/icons/BrandIcons'
import BreadcrumbSchema from '@/components/schema/BreadcrumbSchema'
import PDFLinkButton from '@/components/PDFLinkButton'
import PWAPageWrapper from '@/components/pwa/PWAPageWrapper'
import { useTranslation } from '@/hooks/useTranslation'
import { getLocalizedPath } from '@/lib/i18n'
import { usePWAMode } from '@/hooks/usePWAMode'

export default function ContactClient() {
  const { t, locale, dir } = useTranslation()
  const { isPWA, isClient } = usePWAMode()
  const isRTL = dir === 'rtl'
  const [isMobileWeb, setIsMobileWeb] = useState(false)
  
  useEffect(() => {
    if (isClient) {
      setIsMobileWeb(window.innerWidth < 768 && !isPWA)
    }
  }, [isClient, isPWA])
  
  const isAppLikeMode = (isClient && isPWA) || isMobileWeb
  
  return (
    <PWAPageWrapper 
      title={locale === 'ar' ? 'اتصل بنا' : locale === 'ru' ? 'Контакты' : 'Contact Us'}
    >
      <div className={`bg-white ${isAppLikeMode ? 'pb-32' : ''}`}>
        <BreadcrumbSchema 
          items={[
            { name: t('common.home'), url: getLocalizedPath('/', locale) },
            { name: t('navigation.contact'), url: getLocalizedPath('/contact', locale) }
          ]}
        />
        <div className="container mx-auto px-3 md:px-4 py-4 md:pt-16 pb-0 mb-0">
          <div className="max-w-4xl lg:max-w-6xl mx-auto mb-0 pb-0">

            {/* Navigation Breadcrumb - hide in PWA and mobile web */}
            {!isAppLikeMode && (
              <nav className={`text-xs md:text-base text-gray-600 mb-2 md:mb-4 ${isRTL ? 'text-right' : ''}`} aria-label="Breadcrumb">
                <Link href={getLocalizedPath('/', locale)} className="hover:text-primary-600 transition-colors">{t('common.home')}</Link>
                <span> / </span>
                <span className="text-gray-900 font-medium">{t('navigation.contact')}</span>
              </nav>
            )}
            
            {/* Back to Home - hide in PWA and mobile web */}
            {!isAppLikeMode && (
              <Link href={getLocalizedPath('/', locale)} className={`inline-flex items-center gap-1 text-xs md:text-sm text-primary-600 hover:text-primary-700 mb-4 md:mb-8 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <ArrowLeft className={`h-3 w-3 md:h-4 md:w-4 ${isRTL ? 'rotate-180' : ''}`} />
                <span>{t('common.backToHome')}</span>
              </Link>
            )}

            <div className="text-center mb-4 md:mb-14">
              <p className="hidden md:block text-xs font-semibold tracking-[0.2em] text-primary-600 uppercase mb-3">
                {locale === 'ar' ? 'تحدث إلينا' : locale === 'ru' ? 'Свяжитесь с нами' : 'Get in touch'}
              </p>
              <h1 className="text-2xl md:text-5xl font-bold text-gray-900 mb-2 md:mb-4 tracking-tight">
                {t('navigation.contact')}
              </h1>
              <p className="hidden md:block text-lg text-gray-600 max-w-2xl mx-auto">
                {locale === 'ar' ? 'نحن هنا للإجابة على أسئلتك بشأن المنتجات والطلبات وتوصيات العناية بالبشرة.' : locale === 'ru' ? 'Мы готовы ответить на вопросы о продуктах, заказах и уходе за кожей.' : 'We\'re here for questions about products, orders, and personalised skin advice.'}
              </p>
            </div>

            {/* Contact Grid — richer tiles on md+, same layout below */}
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-5 mb-4 md:mb-12">
              {/* WhatsApp */}
              <a
                href="https://wa.me/971585487665"
                target="_blank"
                rel="noopener noreferrer"
                className="group text-center p-3 md:p-6 bg-gray-50 md:bg-white md:border md:border-gray-200 rounded-lg md:rounded-2xl select-text md:hover:border-green-300 md:hover:shadow-md md:transition-all md:flex md:flex-col md:items-center"
              >
                <span className="md:flex md:h-14 md:w-14 md:rounded-full md:bg-green-50 md:items-center md:justify-center md:mb-3 md:group-hover:bg-green-100 md:transition-colors">
                  <Phone className="h-5 w-5 md:h-6 md:w-6 text-green-600 mx-auto md:mx-0" aria-hidden="true" />
                </span>
                <h3 className="text-xs md:text-base font-semibold text-gray-900 mt-1.5 md:mt-0 mb-0.5 md:mb-1">WhatsApp</h3>
                <p className="text-[10px] md:text-sm text-gray-600 cursor-text" dir="ltr">+971 58 548 76 65</p>
                <span className="hidden md:inline-flex mt-2 text-xs font-medium text-green-700">
                  {locale === 'ar' ? 'أرسل رسالة' : locale === 'ru' ? 'Написать' : 'Message us →'}
                </span>
              </a>

              {/* Email */}
              <a
                href="mailto:sales@genosys.ae"
                className="group text-center p-3 md:p-6 bg-gray-50 md:bg-white md:border md:border-gray-200 rounded-lg md:rounded-2xl select-text md:hover:border-red-300 md:hover:shadow-md md:transition-all md:flex md:flex-col md:items-center"
              >
                <span className="md:flex md:h-14 md:w-14 md:rounded-full md:bg-red-50 md:items-center md:justify-center md:mb-3 md:group-hover:bg-red-100 md:transition-colors">
                  <Mail className="h-5 w-5 md:h-6 md:w-6 text-primary-600 mx-auto md:mx-0" aria-hidden="true" />
                </span>
                <h3 className="text-xs md:text-base font-semibold text-gray-900 mt-1.5 md:mt-0 mb-0.5 md:mb-1">Email</h3>
                <p className="text-[10px] md:text-sm text-gray-600 break-all cursor-text" dir="ltr">sales@genosys.ae</p>
                <span className="hidden md:inline-flex mt-2 text-xs font-medium text-primary-700">
                  {locale === 'ar' ? 'إرسال بريد' : locale === 'ru' ? 'Написать письмо' : 'Send email →'}
                </span>
              </a>

              {/* Website */}
              <a
                href="https://genosys.ae"
                target="_blank"
                rel="noopener noreferrer"
                className="group text-center p-3 md:p-6 bg-gray-50 md:bg-white md:border md:border-gray-200 rounded-lg md:rounded-2xl select-text md:hover:border-blue-300 md:hover:shadow-md md:transition-all md:flex md:flex-col md:items-center"
              >
                <span className="md:flex md:h-14 md:w-14 md:rounded-full md:bg-blue-50 md:items-center md:justify-center md:mb-3 md:group-hover:bg-blue-100 md:transition-colors">
                  <Globe className="h-5 w-5 md:h-6 md:w-6 text-blue-600 mx-auto md:mx-0" aria-hidden="true" />
                </span>
                <h3 className="text-xs md:text-base font-semibold text-gray-900 mt-1.5 md:mt-0 mb-0.5 md:mb-1">{t('common.website')}</h3>
                <p className="text-[10px] md:text-sm text-gray-600 cursor-text" dir="ltr">genosys.ae</p>
                <span className="hidden md:inline-flex mt-2 text-xs font-medium text-blue-700">
                  {locale === 'ar' ? 'زيارة الموقع' : locale === 'ru' ? 'Открыть сайт' : 'Visit site →'}
                </span>
              </a>

              {/* Instagram */}
              <a
                href="https://instagram.com/genosys.uae"
                target="_blank"
                rel="noopener noreferrer"
                className="group text-center p-3 md:p-6 bg-gray-50 md:bg-white md:border md:border-gray-200 rounded-lg md:rounded-2xl select-text md:hover:border-pink-300 md:hover:shadow-md md:transition-all md:flex md:flex-col md:items-center"
              >
                <span className="md:flex md:h-14 md:w-14 md:rounded-full md:bg-pink-50 md:items-center md:justify-center md:mb-3 md:group-hover:bg-pink-100 md:transition-colors">
                  <Instagram className="h-5 w-5 md:h-6 md:w-6 text-pink-600 mx-auto md:mx-0" aria-hidden="true" />
                </span>
                <h3 className="text-xs md:text-base font-semibold text-gray-900 mt-1.5 md:mt-0 mb-0.5 md:mb-1">Instagram</h3>
                <p className="text-[10px] md:text-sm text-gray-600 cursor-text" dir="ltr">@genosys.uae</p>
                <span className="hidden md:inline-flex mt-2 text-xs font-medium text-pink-700">
                  {locale === 'ar' ? 'متابعة' : locale === 'ru' ? 'Подписаться' : 'Follow →'}
                </span>
              </a>

              {/* Facebook */}
              <a
                href="https://www.facebook.com/genosys.ae"
                target="_blank"
                rel="noopener noreferrer"
                className="group text-center p-3 md:p-6 bg-gray-50 md:bg-white md:border md:border-gray-200 rounded-lg md:rounded-2xl select-text md:hover:border-blue-300 md:hover:shadow-md md:transition-all md:flex md:flex-col md:items-center"
              >
                <span className="md:flex md:h-14 md:w-14 md:rounded-full md:bg-blue-50 md:items-center md:justify-center md:mb-3 md:group-hover:bg-blue-100 md:transition-colors">
                  <Facebook className="h-5 w-5 md:h-6 md:w-6 text-blue-600 mx-auto md:mx-0" aria-hidden="true" />
                </span>
                <h3 className="text-xs md:text-base font-semibold text-gray-900 mt-1.5 md:mt-0 mb-0.5 md:mb-1">Facebook</h3>
                <p className="text-[10px] md:text-sm text-gray-600 cursor-text" dir="ltr">genosys.ae</p>
                <span className="hidden md:inline-flex mt-2 text-xs font-medium text-blue-700">
                  {locale === 'ar' ? 'متابعة' : locale === 'ru' ? 'Подписаться' : 'Follow →'}
                </span>
              </a>

              {/* Location */}
              <a
                href="https://maps.google.com/?q=Cordoba+Residence,+Villa+E02,+Dubai+United+Arab+Emirates"
                target="_blank"
                rel="noopener noreferrer"
                className="group text-center p-3 md:p-6 bg-gray-50 md:bg-white md:border md:border-gray-200 rounded-lg md:rounded-2xl select-text col-span-2 lg:col-span-1 md:hover:border-red-300 md:hover:shadow-md md:transition-all md:flex md:flex-col md:items-center"
              >
                <span className="md:flex md:h-14 md:w-14 md:rounded-full md:bg-red-50 md:items-center md:justify-center md:mb-3 md:group-hover:bg-red-100 md:transition-colors">
                  <MapPin className="h-5 w-5 md:h-6 md:w-6 text-red-600 mx-auto md:mx-0" aria-hidden="true" />
                </span>
                <h3 className="text-xs md:text-base font-semibold text-gray-900 mt-1.5 md:mt-0 mb-0.5 md:mb-1">{t('common.locations')}</h3>
                <p className="text-[10px] md:text-sm text-gray-600 cursor-text">Cordoba Residence, E02, Dubai, UAE</p>
                <span className="hidden md:inline-flex mt-2 text-xs font-medium text-red-700">
                  {locale === 'ar' ? 'عرض الخريطة' : locale === 'ru' ? 'Открыть карту' : 'Open in Maps →'}
                </span>
              </a>
            </div>

            {/* Official Distributor Section */}
            <div className="mb-8 md:mb-16 pb-8 md:pb-12">
              <div className="bg-primary-50 md:bg-white md:border md:border-gray-100 rounded-lg md:rounded-2xl px-4 md:px-10 py-4 md:py-10 md:shadow-sm">
                <div className="md:flex md:items-start md:gap-8">
                  {/* Icon + heading */}
                  <div className="md:flex md:items-center md:gap-4 md:flex-shrink-0 md:max-w-xs text-center md:text-left">
                    <div className="hidden md:flex h-12 w-12 rounded-xl bg-primary-50 items-center justify-center flex-shrink-0">
                      <IconOfficialDistributor className="h-6 w-6 text-primary-600" />
                    </div>
                    <div>
                      <h2 className="text-base md:text-xl font-semibold text-gray-900 mb-1 md:mb-1.5">
                        {locale === 'ar' ? 'الموزع الرسمي في الإمارات' : locale === 'ru' ? 'Официальный дистрибьютор в ОАЭ' : 'Official distributor in the UAE'}
                      </h2>
                      <p className="text-gray-600 text-xs md:text-sm mb-2 md:mb-3">
                        {locale === 'ar' ? 'الموزع الرسمي لشركة DTSMG Co., Ltd، كوريا منذ 2019.' : locale === 'ru' ? 'Официальный дистрибьютор DTSMG Co., Ltd (Корея) с 2019 года.' : 'Of DTSMG Co., Ltd, Korea — since 2019.'}
                      </p>
                      <p className="hidden md:block text-xs text-gray-500">
                        {locale === 'ar' ? 'المنتجات معتمدة في نظام مونتاجي من بلدية دبي.' : locale === 'ru' ? 'Продукция сертифицирована в системе Montaji муниципалитетом Дубая.' : 'All products are certified in the Montaji system by Dubai Municipality.'}
                      </p>
                    </div>
                  </div>

                  {/* Docs */}
                  <div className="md:flex-1 md:border-l md:border-gray-200 md:pl-8">
                    <p className="hidden md:block text-[11px] font-semibold tracking-wider text-gray-500 uppercase mb-3">
                      {locale === 'ar' ? 'الوثائق' : locale === 'ru' ? 'Документы' : 'Official documents'}
                    </p>
                    <div className="flex flex-wrap justify-center md:justify-start gap-2 md:gap-2.5">
                      <PDFLinkButton
                        href="/documents/Genosys_License.pdf"
                        filename="Genosys-Commercial-License-5023192.pdf"
                        download="Genosys-Commercial-License-5023192.pdf"
                        className="inline-flex items-center gap-1.5 text-primary-600 hover:text-primary-700 font-medium transition-colors text-[10px] md:text-sm touch-manipulation bg-white md:bg-gray-50 md:hover:bg-white px-2 py-1 md:px-3 md:py-2 rounded-md md:rounded-lg shadow-sm md:shadow-none md:border md:border-gray-200"
                      >
                        <FileText className="h-3 w-3 md:h-4 md:w-4" aria-hidden="true" />
                        {locale === 'ar' ? 'الرخصة' : locale === 'ru' ? 'Лицензия' : 'License'}
                      </PDFLinkButton>
                      <PDFLinkButton
                        href="/documents/genosys-trn-104229886700003.pdf"
                        filename="GENOSYS-TRN-104229886700003.pdf"
                        download="GENOSYS-TRN-104229886700003.pdf"
                        className="inline-flex items-center gap-1.5 text-primary-600 hover:text-primary-700 font-medium transition-colors text-[10px] md:text-sm touch-manipulation bg-white md:bg-gray-50 md:hover:bg-white px-2 py-1 md:px-3 md:py-2 rounded-md md:rounded-lg shadow-sm md:shadow-none md:border md:border-gray-200"
                      >
                        <FileText className="h-3 w-3 md:h-4 md:w-4" aria-hidden="true" />
                        TRN
                      </PDFLinkButton>
                      <PDFLinkButton
                        href="/documents/Genosys_Product_Registration_Montaji.pdf"
                        filename="Genosys_Product_Registration_Montaji.pdf"
                        download="Genosys_Product_Registration_Montaji.pdf"
                        className="inline-flex items-center gap-1.5 text-primary-600 hover:text-primary-700 font-medium transition-colors text-[10px] md:text-sm touch-manipulation bg-white md:bg-gray-50 md:hover:bg-white px-2 py-1 md:px-3 md:py-2 rounded-md md:rounded-lg shadow-sm md:shadow-none md:border md:border-gray-200"
                      >
                        <FileText className="h-3 w-3 md:h-4 md:w-4" aria-hidden="true" />
                        Montaji
                      </PDFLinkButton>
                      <PDFLinkButton
                        href="/documents/TDRA_NOC.pdf"
                        filename="GENOSYS-TDRA-NOC.pdf"
                        download="GENOSYS-TDRA-NOC.pdf"
                        className="inline-flex items-center gap-1.5 text-primary-600 hover:text-primary-700 font-medium transition-colors text-[10px] md:text-sm touch-manipulation bg-white md:bg-gray-50 md:hover:bg-white px-2 py-1 md:px-3 md:py-2 rounded-md md:rounded-lg shadow-sm md:shadow-none md:border md:border-gray-200"
                      >
                        <FileText className="h-3 w-3 md:h-4 md:w-4" aria-hidden="true" />
                        TDRA
                      </PDFLinkButton>
                      <a
                        href="https://dnbuae.com/duns-number/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-primary-600 hover:text-primary-700 font-medium transition-colors text-[10px] md:text-sm touch-manipulation bg-white md:bg-gray-50 md:hover:bg-white px-2 py-1 md:px-3 md:py-2 rounded-md md:rounded-lg shadow-sm md:shadow-none md:border md:border-gray-200"
                      >
                        <FileText className="h-3 w-3 md:h-4 md:w-4" aria-hidden="true" />
                        D-U-N-S®: 850215607
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PWAPageWrapper>
  )
}

