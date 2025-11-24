'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import Logo from '@/components/Logo'
import BreadcrumbSchema from '@/components/BreadcrumbSchema'
import { useTranslation } from '@/hooks/useTranslation'
import { getLocalizedPath } from '@/lib/i18n'

export default function ArabicAboutPageClient() {
  const { t, locale, dir } = useTranslation()

  return (
    <div className="bg-white min-h-screen" dir={dir}>
      <BreadcrumbSchema 
        items={[
          { name: t('navigation.home'), url: getLocalizedPath('/', locale) },
          { name: t('navigation.about'), url: getLocalizedPath('/about', locale) }
        ]}
      />
      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="max-w-4xl mx-auto">

          {/* Navigation Breadcrumb */}
          <nav className={`flex flex-col gap-2 text-sm md:text-base text-gray-600 mb-8 ${dir === 'rtl' ? 'text-right' : ''}`} aria-label="Breadcrumb">
            {/* Mobile Breadcrumb */}
            <div className={`md:hidden flex items-center gap-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
              <Link 
                href={getLocalizedPath('/', locale)}
                className="hover:text-primary-600 transition-colors flex items-center"
              >
                {t('navigation.home')}
              </Link>
              <span className="flex items-center">/</span>
              <span className="text-gray-900 font-medium flex items-center">
                {t('navigation.about')}
              </span>
            </div>
            
            {/* Mobile Back Button */}
            <Link 
              href={getLocalizedPath('/', locale)}
              className={`md:hidden flex items-center gap-2 text-primary-600 hover:text-primary-700 transition-colors ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}
            >
              <ArrowLeft className={`h-4 w-4 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
              <span className="font-medium">{t('common.backToHome')}</span>
            </Link>
            
            {/* Desktop Breadcrumb */}
            <div className={`hidden md:flex items-center gap-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
              <Link 
                href={getLocalizedPath('/', locale)}
                className="hover:text-primary-600 transition-colors flex items-center"
              >
                {t('navigation.home')}
              </Link>
              <span className="flex items-center">/</span>
              <span className="text-gray-900 font-medium flex items-center">
                {t('navigation.about')}
              </span>
            </div>
          </nav>

          <div className="text-center mb-12">
            <h1 className={`text-4xl md:text-5xl font-bold text-gray-800 mb-6 ${dir === 'rtl' ? 'text-right' : ''}`}>
              {t('about.companyName')}
            </h1>
            <div className="flex justify-center mb-6">
              <Logo size="lg" className="justify-center" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className={`text-2xl font-semibold text-gray-800 mb-4 text-center ${dir === 'rtl' ? 'text-right' : ''}`}>
                {t('about.aboutUs')}
              </h2>
              <div className={`space-y-4 ${dir === 'rtl' ? 'text-right' : ''}`}>
                <p className="text-gray-600 leading-relaxed">
                  {t('about.aboutUsDescription')}
                </p>
                <p className="text-gray-600 leading-relaxed">
                  {t('about.productsDescription')}{' '}
                  <a 
                    href="https://www.dm.gov.ae/" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className={`text-primary-600 hover:text-primary-700 underline ${dir === 'rtl' ? 'mr-1' : 'ml-1'}`}
                  >
                    {t('about.dubaiMunicipality')}
                  </a>.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className={`text-2xl font-semibold text-gray-800 mb-4 text-center ${dir === 'rtl' ? 'text-right' : ''}`}>
                {t('about.ourMission')}
              </h2>
              <p className={`text-gray-600 leading-relaxed ${dir === 'rtl' ? 'text-right' : ''}`}>
                {t('about.missionDescription')}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-8 mb-8">
            <h2 className={`text-3xl font-bold text-gray-800 mb-8 text-center ${dir === 'rtl' ? 'text-right' : ''}`}>
              {t('about.legalInformationContact')}
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Company Details */}
              <div className="lg:col-span-1">
                <h3 className={`text-xl font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-200 ${dir === 'rtl' ? 'text-right' : ''}`}>
                  {t('about.companyDetails')}
                </h3>
                <div className={`space-y-4 text-gray-600 ${dir === 'rtl' ? 'text-right' : ''}`}>
                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-800 text-sm uppercase tracking-wide">{t('about.companyNameLabel')}</span>
                    <span className="mt-1">{t('about.companyNameValue')}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-800 text-sm uppercase tracking-wide">{t('about.yearOfIncorporation')}</span>
                    <span className="mt-1">2019</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-800 text-sm uppercase tracking-wide">{t('about.commercialLicense')}</span>
                    <a 
                      href="/documents/commercial-license.pdf" 
                      download="Genosys-Commercial-License-5023192.pdf" 
                      className="text-primary-600 hover:text-primary-700 underline mt-1 break-all"
                    >
                      5023192
                    </a>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-800 text-sm uppercase tracking-wide">TRN</span>
                    <a 
                      href="/documents/genosys-trn-104229886700003.pdf" 
                      download="GENOSYS-TRN-104229886700003.pdf" 
                      className="text-primary-600 hover:text-primary-700 underline mt-1 break-all"
                    >
                      104229886700003
                    </a>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-800 text-sm uppercase tracking-wide">{t('about.mainOfficeAddress')}</span>
                    <span className="mt-1 break-words">
                      MBAM0014 Compass Building, Al Shohada Road<br />
                      AL Hamra Industrial Zone-FZ<br />
                      {t('about.rasAlKhaimahUAE')}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-800 text-sm uppercase tracking-wide">{t('about.dubaiOfficeAddress')}</span>
                    <span className="mt-1 break-words">
                      Cordoba Residence, Villa E02<br />
                      {t('about.dubaiUAE')}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Contact Information */}
              <div className="lg:col-span-1">
                <h3 className={`text-xl font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-200 ${dir === 'rtl' ? 'text-right' : ''}`}>
                  {t('about.contactInformation')}
                </h3>
                <div className={`space-y-4 text-gray-600 ${dir === 'rtl' ? 'text-right' : ''}`}>
                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-800 text-sm uppercase tracking-wide">{t('about.phone')}</span>
                    <a href="tel:+971585487665" className="text-primary-600 hover:text-primary-700 mt-1 break-all">+971 58 548 76 65</a>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-800 text-sm uppercase tracking-wide">{t('about.email')}</span>
                    <a href="mailto:sales@genosys.ae" className="text-primary-600 hover:text-primary-700 mt-1 break-all">sales@genosys.ae</a>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-800 text-sm uppercase tracking-wide">{t('about.website')}</span>
                    <a 
                      href="https://genosys.ae" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-primary-600 hover:text-primary-700 mt-1 break-all"
                    >
                      https://genosys.ae
                    </a>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-800 text-sm uppercase tracking-wide">{t('about.instagram')}</span>
                    <a 
                      href="https://www.instagram.com/genosys.uae/" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-primary-600 hover:text-primary-700 mt-1 break-all"
                    >
                      @genosys.uae
                    </a>
                  </div>
                </div>
              </div>
              
              {/* Business Information */}
              <div className="lg:col-span-1">
                <h3 className={`text-xl font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-200 ${dir === 'rtl' ? 'text-right' : ''}`}>
                  {t('about.businessInformation')}
                </h3>
                <div className={`space-y-4 text-gray-600 ${dir === 'rtl' ? 'text-right' : ''}`}>
                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-800 text-sm uppercase tracking-wide">{t('about.officialDistributor')}</span>
                    <span className="mt-1 break-words">DTSMG Co., Ltd, Korea</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-800 text-sm uppercase tracking-wide">{t('about.certification')}</span>
                    <span className="mt-1 break-words">
                      {t('about.montajiSystem')}{' '}
                      <a 
                        href="https://www.dm.gov.ae/" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-primary-600 hover:text-primary-700 underline"
                      >
                        {t('about.dubaiMunicipality')}
                      </a>
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-800 text-sm uppercase tracking-wide">{t('about.products')}</span>
                    <span className="mt-1 break-words">{t('about.premiumKoreanDermacosmetics')}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-800 text-sm uppercase tracking-wide">{t('about.serviceArea')}</span>
                    <span className="mt-1 break-words">{t('about.unitedArabEmirates')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={`bg-white rounded-lg p-8 text-center border ${dir === 'rtl' ? 'text-right' : ''}`}>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">{t('about.getInTouch')}</h2>
            <p className="text-gray-600 mb-6 break-words">
              {t('about.getInTouchDescription')}
            </p>
            <div className={`flex flex-col sm:flex-row gap-4 justify-center ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
              <Link 
                href={getLocalizedPath('/products', locale)}
                className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
              >
                {t('about.viewProducts')}
              </Link>
              <Link 
                href={getLocalizedPath('/contact', locale)}
                className="border border-primary-600 text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
              >
                {t('about.contactUs')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

