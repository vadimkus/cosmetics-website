'use client'

import Link from 'next/link'
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
      <div className="container mx-auto px-3 md:px-4 py-4 md:py-16">
        <div className="max-w-4xl mx-auto">

          {/* Navigation Breadcrumb */}
          <nav className={`flex items-center gap-1 md:gap-2 text-xs md:text-base text-gray-600 mb-4 md:mb-8 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`} aria-label="Breadcrumb">
            <Link 
              href={getLocalizedPath('/', locale)}
              className="hover:text-primary-600 transition-colors"
            >
              {t('navigation.home')}
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">
              {t('navigation.about')}
            </span>
          </nav>

          {/* Header - Compact on mobile */}
          <div className="text-center mb-6 md:mb-12">
            <h1 className={`text-xl md:text-5xl font-bold text-gray-800 mb-3 md:mb-6 ${dir === 'rtl' ? 'text-right' : ''}`}>
              {t('about.companyName')}
            </h1>
            <div className="flex justify-center mb-3 md:mb-6">
              <Logo size="lg" className="justify-center scale-50 md:scale-100" />
            </div>
          </div>

          {/* About & Mission - Stacked on mobile */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-8 mb-6 md:mb-12">
            <div className="bg-white rounded-lg shadow-sm border p-3 md:p-6">
              <h2 className={`text-base md:text-2xl font-semibold text-gray-800 mb-2 md:mb-4 text-center ${dir === 'rtl' ? 'text-right' : ''}`}>
                {t('about.aboutUs')}
              </h2>
              <div className={`space-y-1 md:space-y-4 ${dir === 'rtl' ? 'text-right' : ''}`}>
                <p className="text-xs md:text-base text-gray-600 leading-relaxed">
                  {t('about.aboutUsDescription')}
                </p>
                <p className="text-xs md:text-base text-gray-600 leading-relaxed">
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

            <div className="bg-white rounded-lg shadow-sm border p-3 md:p-6">
              <h2 className={`text-base md:text-2xl font-semibold text-gray-800 mb-2 md:mb-4 text-center ${dir === 'rtl' ? 'text-right' : ''}`}>
                {t('about.ourMission')}
              </h2>
              <p className={`text-xs md:text-base text-gray-600 leading-relaxed ${dir === 'rtl' ? 'text-right' : ''}`}>
                {t('about.missionDescription')}
              </p>
            </div>
          </div>

          {/* Legal Info & Contact Heading */}
          <h2 className={`text-lg md:text-3xl font-bold text-gray-800 mb-3 md:mb-6 text-center ${dir === 'rtl' ? 'text-right' : ''}`}>
            {t('about.legalInformationContact')}
          </h2>
          
          {/* Separate blocks for mobile, grid for desktop */}
          <div className="space-y-3 md:space-y-0 md:grid md:grid-cols-3 md:gap-8 mb-4 md:mb-8">
            {/* Company Details Block */}
            <div className="bg-white rounded-lg shadow-sm border p-3 md:p-6">
              <h3 className={`text-sm md:text-xl font-semibold text-gray-800 mb-2 md:mb-4 pb-1 md:pb-2 border-b border-gray-200 ${dir === 'rtl' ? 'text-right' : ''}`}>
                {t('about.companyDetails')}
              </h3>
              <div className={`space-y-0.5 md:space-y-2 text-gray-600 text-xs md:text-base ${dir === 'rtl' ? 'text-right' : ''}`}>
                <div><span className="font-semibold text-gray-800">{t('about.companyNameLabel')}:</span> {t('about.companyNameValue')}</div>
                <div><span className="font-semibold text-gray-800">{t('about.yearOfIncorporation')}:</span> 2019</div>
                <div><span className="font-semibold text-gray-800">{t('about.commercialLicense')}:</span> <a href="/documents/commercial-license.pdf" download="Genosys-Commercial-License-5023192.pdf" className="text-primary-600 hover:text-primary-700 underline">5023192</a></div>
                <div><span className="font-semibold text-gray-800">TRN:</span> <a href="/documents/genosys-trn-104229886700003.pdf" download="GENOSYS-TRN-104229886700003.pdf" className="text-primary-600 hover:text-primary-700 underline">104229886700003</a></div>
                <div><span className="font-semibold text-gray-800">{t('about.mainOfficeAddress')}:</span> Compass Building, GF, RAK, UAE</div>
                <div><span className="font-semibold text-gray-800">{t('about.dubaiOfficeAddress')}:</span> Cordoba Residence, E02, Knowledge Village</div>
              </div>
            </div>
            
            {/* Contact Block */}
            <div className="bg-white rounded-lg shadow-sm border p-3 md:p-6">
              <h3 className={`text-sm md:text-xl font-semibold text-gray-800 mb-2 md:mb-4 pb-1 md:pb-2 border-b border-gray-200 ${dir === 'rtl' ? 'text-right' : ''}`}>
                {t('about.contactInformation')}
              </h3>
              <div className={`space-y-0.5 md:space-y-2 text-xs md:text-base ${dir === 'rtl' ? 'text-right' : ''}`}>
                <div><span className="font-semibold text-gray-800">{t('about.phone')}/WhatsApp:</span> <a href="tel:+971585487665" className="text-primary-600 hover:text-primary-700">+971 58 548 76 65</a></div>
                <div><span className="font-semibold text-gray-800">{t('about.email')}:</span> <a href="mailto:sales@genosys.ae" className="text-primary-600 hover:text-primary-700">sales@genosys.ae</a></div>
                <div><span className="font-semibold text-gray-800">{t('about.website')}:</span> <a href="https://genosys.ae" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700">genosys.ae</a></div>
                <div><span className="font-semibold text-gray-800">{t('about.instagram')}:</span> <a href="https://www.instagram.com/genosys.uae/" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700">@genosys.uae</a></div>
              </div>
            </div>
            
            {/* Business Block */}
            <div className="bg-white rounded-lg shadow-sm border p-3 md:p-6">
              <h3 className={`text-sm md:text-xl font-semibold text-gray-800 mb-2 md:mb-4 pb-1 md:pb-2 border-b border-gray-200 ${dir === 'rtl' ? 'text-right' : ''}`}>
                {t('about.businessInformation')}
              </h3>
              <div className={`space-y-0.5 md:space-y-2 text-gray-600 text-xs md:text-base ${dir === 'rtl' ? 'text-right' : ''}`}>
                <div><span className="font-semibold text-gray-800">{t('about.officialDistributor')}:</span> DTSMG Co., Ltd, Korea</div>
                <div><span className="font-semibold text-gray-800">{t('about.certification')}:</span> Dubai Municipality</div>
                <div><span className="font-semibold text-gray-800">{t('about.products')}:</span> {t('about.premiumKoreanDermacosmetics')}</div>
                <div><span className="font-semibold text-gray-800">{t('about.serviceArea')}:</span> {t('about.unitedArabEmirates')}</div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className={`bg-white rounded-lg p-4 md:p-8 text-center border ${dir === 'rtl' ? 'text-right' : ''}`}>
            <h2 className="text-lg md:text-3xl font-bold text-gray-800 mb-2 md:mb-4">{t('about.getInTouch')}</h2>
            <p className="text-xs md:text-base text-gray-600 mb-4 md:mb-6">
              {t('about.getInTouchDescription')}
            </p>
            <div className={`flex flex-row gap-2 md:gap-4 justify-center ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
              <Link 
                href={getLocalizedPath('/products', locale)}
                className="bg-primary-600 text-white px-4 md:px-8 py-2 md:py-3 rounded-lg text-xs md:text-base font-semibold hover:bg-primary-700 transition-colors"
              >
                {t('about.viewProducts')}
              </Link>
              <Link 
                href={getLocalizedPath('/contact', locale)}
                className="border border-primary-600 text-primary-600 px-4 md:px-8 py-2 md:py-3 rounded-lg text-xs md:text-base font-semibold hover:bg-primary-50 transition-colors"
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

