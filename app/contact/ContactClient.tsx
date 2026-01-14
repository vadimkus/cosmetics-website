'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Phone, Mail, MapPin, FileText, Globe, Instagram, Facebook } from 'lucide-react'
import BreadcrumbSchema from '@/components/BreadcrumbSchema'
import PDFLinkButton from '@/components/PDFLinkButton'
import PWAPageWrapper from '@/components/PWAPageWrapper'
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
          <div className="max-w-4xl mx-auto mb-0 pb-0">

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
            
            <div className="text-center mb-4 md:mb-12">
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-2 md:mb-6">
                {t('navigation.contact')}
              </h1>
            </div>

            {/* Contact Grid - 2 columns on mobile */}
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-6 mb-4 md:mb-12">
              <a 
                href="https://wa.me/971585487665"
                target="_blank"
                rel="noopener noreferrer"
                className="text-center p-3 md:p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Phone className="h-5 w-5 md:h-8 md:w-8 text-green-600 mx-auto mb-1.5 md:mb-4" />
                <h3 className="text-xs md:text-lg font-semibold text-gray-800 mb-0.5 md:mb-2">WhatsApp</h3>
                <span className="text-[10px] md:text-base text-gray-600">+971 58 548 76 65</span>
              </a>

              <a 
                href="mailto:sales@genosys.ae"
                className="text-center p-3 md:p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Mail className="h-5 w-5 md:h-8 md:w-8 text-primary-600 mx-auto mb-1.5 md:mb-4" />
                <h3 className="text-xs md:text-lg font-semibold text-gray-800 mb-0.5 md:mb-2">Email</h3>
                <span className="text-[10px] md:text-base text-gray-600 break-all">sales@genosys.ae</span>
              </a>

              <a 
                href="https://genosys.ae"
                target="_blank"
                rel="noopener noreferrer"
                className="text-center p-3 md:p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Globe className="h-5 w-5 md:h-8 md:w-8 text-blue-600 mx-auto mb-1.5 md:mb-4" />
                <h3 className="text-xs md:text-lg font-semibold text-gray-800 mb-0.5 md:mb-2">{t('common.website')}</h3>
                <span className="text-[10px] md:text-base text-gray-600">genosys.ae</span>
              </a>

              <a 
                href="https://instagram.com/genosys.uae"
                target="_blank"
                rel="noopener noreferrer"
                className="text-center p-3 md:p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Instagram className="h-5 w-5 md:h-8 md:w-8 text-pink-600 mx-auto mb-1.5 md:mb-4" />
                <h3 className="text-xs md:text-lg font-semibold text-gray-800 mb-0.5 md:mb-2">Instagram</h3>
                <span className="text-[10px] md:text-base text-gray-600">@genosys.uae</span>
              </a>

              <a 
                href="https://www.facebook.com/genosys.ae"
                target="_blank"
                rel="noopener noreferrer"
                className="text-center p-3 md:p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Facebook className="h-5 w-5 md:h-8 md:w-8 text-blue-600 mx-auto mb-1.5 md:mb-4" />
                <h3 className="text-xs md:text-lg font-semibold text-gray-800 mb-0.5 md:mb-2">Facebook</h3>
                <span className="text-[10px] md:text-base text-gray-600">genosys.ae</span>
              </a>

              <a 
                href="https://maps.google.com/?q=Cordoba+Residence,+Villa+E02,+Dubai+United+Arab+Emirates"
                target="_blank"
                rel="noopener noreferrer"
                className="text-center p-3 md:p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors col-span-2 lg:col-span-1"
              >
                <MapPin className="h-5 w-5 md:h-8 md:w-8 text-red-600 mx-auto mb-1.5 md:mb-4" />
                <h3 className="text-xs md:text-lg font-semibold text-gray-800 mb-0.5 md:mb-2">{t('common.locations')}</h3>
                <span className="text-[10px] md:text-base text-gray-600">Cordoba Residence, E02, Dubai, UAE</span>
              </a>
            </div>

            {/* Official Distributor Section */}
            <div className="text-center mb-8 md:mb-12 pb-8 md:pb-12">
              <div className="bg-primary-50 rounded-lg px-4 md:px-8 py-4 md:py-8">
                <h2 className="text-base md:text-2xl font-semibold text-gray-800 mb-2 md:mb-4">
                  {locale === 'ar' ? 'الموزع الرسمي في الإمارات' : locale === 'ru' ? 'Официальный дистрибьютор в ОАЭ' : 'Official Distributor in the UAE'}
                </h2>
                <p className="text-gray-600 mb-2 md:mb-4 text-xs md:text-base">
                  {locale === 'ar' ? 'الموزع الرسمي لشركة DTSMG Co., Ltd، كوريا منذ 2019.' : locale === 'ru' ? 'Официальный дистрибьютор DTSMG. Co., Ltd, Корея с 2019 года.' : 'Official distributor of DTSMG. Co., Ltd, Korea since 2019.'}
                </p>
                <p className="text-[10px] md:text-sm text-gray-500 mb-3 md:mb-4">
                  {locale === 'ar' ? 'المنتجات معتمدة في نظام مونتاجي من بلدية دبي.' : locale === 'ru' ? 'Продукция сертифицирована в системе Montaji муниципалитетом Дубая.' : 'Products certified in Montaji System by Dubai Municipality.'}
                </p>
                <div className="flex flex-wrap justify-center gap-2 md:gap-4">
                  <PDFLinkButton
                    href="/documents/commercial-license.pdf"
                    filename="Genosys-Commercial-License-5023192.pdf"
                    download="Genosys-Commercial-License-5023192.pdf"
                    className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium transition-colors text-[10px] md:text-sm touch-manipulation bg-white px-2 py-1 md:px-3 md:py-1.5 rounded-md shadow-sm"
                  >
                    <FileText className="mr-1 h-3 w-3 md:h-4 md:w-4" />
                    {locale === 'ar' ? 'الرخصة' : locale === 'ru' ? 'Лицензия' : 'License'}
                  </PDFLinkButton>
                  <PDFLinkButton
                    href="/documents/genosys-trn-104229886700003.pdf"
                    filename="GENOSYS-TRN-104229886700003.pdf"
                    download="GENOSYS-TRN-104229886700003.pdf"
                    className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium transition-colors text-[10px] md:text-sm touch-manipulation bg-white px-2 py-1 md:px-3 md:py-1.5 rounded-md shadow-sm"
                  >
                    <FileText className="mr-1 h-3 w-3 md:h-4 md:w-4" />
                    TRN
                  </PDFLinkButton>
                  <a
                    href="https://dnbuae.com/duns-number/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium transition-colors text-[10px] md:text-sm touch-manipulation bg-white px-2 py-1 md:px-3 md:py-1.5 rounded-md shadow-sm"
                  >
                    <FileText className="mr-1 h-3 w-3 md:h-4 md:w-4" />
                    D-U-N-S®: 850215607
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PWAPageWrapper>
  )
}

