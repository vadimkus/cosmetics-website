'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import BreadcrumbSchema from '@/components/schema/BreadcrumbSchema'
import PartnersList from '@/components/partners/PartnersList'
import PartnersSchema from '@/components/schema/PartnersSchema'
import { useTranslation } from '@/hooks/useTranslation'
import { getLocalizedPath } from '@/lib/i18n'

export default function ArabicPartnersPageClient() {
  const { t, locale, dir } = useTranslation()
  
  return (
    <>
      <BreadcrumbSchema 
        items={[
          { name: t('navigation.home'), url: getLocalizedPath('/', locale) },
          { name: t('navigation.partners'), url: getLocalizedPath('/partners', locale) }
        ]}
      />
      <PartnersSchema />
      <div className="bg-white min-h-screen" dir={dir}>
        <div className="container mx-auto px-4 py-8 md:py-16">
          <div className="max-w-6xl mx-auto">
            {/* Navigation Breadcrumb */}
            <nav className="flex flex-col gap-2 text-sm md:text-base text-gray-600 mb-8" aria-label="Breadcrumb">
              {/* Mobile Breadcrumb */}
              <div className="md:hidden flex items-center gap-2">
                <Link 
                  href={getLocalizedPath('/', locale)}
                  className="hover:text-primary-600 transition-colors flex items-center"
                >
                  {t('navigation.home')}
                </Link>
                <span className="flex items-center">/</span>
                <span className="text-gray-900 font-medium flex items-center">
                  {t('navigation.partners')}
                </span>
              </div>
              
              {/* Mobile Back Button */}
              <Link 
                href={getLocalizedPath('/', locale)}
                className="md:hidden flex items-center gap-2 text-primary-600 hover:text-primary-700 transition-colors"
              >
                <ArrowLeft className={`h-4 w-4 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
                <span className="font-medium">{t('common.backToHome')}</span>
              </Link>
              
              {/* Desktop Breadcrumb */}
              <div className="hidden md:flex items-center gap-2">
                <Link 
                  href={getLocalizedPath('/', locale)}
                  className="hover:text-primary-600 transition-colors flex items-center"
                >
                  {t('navigation.home')}
                </Link>
                <span className="flex items-center">/</span>
                <span className="text-gray-900 font-medium flex items-center">
                  {t('navigation.partners')}
                </span>
              </div>
            </nav>
            <div className="text-center mb-4 sm:mb-6 lg:mb-8">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-2 px-2">
                {t('partners.title')}
              </h1>
              <p className="text-sm sm:text-base lg:text-lg text-gray-600 mb-4 px-2">
                {t('partners.subtitle')}
              </p>
            </div>
            
            <PartnersList />

            {/* Call to Action */}
            <div className="mt-6 sm:mt-8 lg:mt-12 text-center">
              <div className="bg-gradient-to-r from-primary-50 to-red-50 rounded-xl p-3 sm:p-4 md:p-6 lg:p-8">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 mb-2 sm:mb-3 lg:mb-4">
                  {t('partners.becomePartner')}
                </h2>
                <p className="text-xs sm:text-sm lg:text-base text-gray-600 mb-3 sm:mb-4 lg:mb-6 px-1">
                  {t('partners.becomePartnerDescription')}
                </p>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 lg:gap-4 justify-center">
                  <Link 
                    href={getLocalizedPath('/contact', locale)}
                    className="inline-flex items-center justify-center bg-primary-600 text-white px-3 sm:px-4 lg:px-6 py-2 sm:py-2.5 lg:py-3 rounded-lg text-xs sm:text-sm lg:text-base font-semibold hover:bg-primary-700 transition-colors w-full sm:w-auto"
                  >
                    {t('partners.contactUs')}
                  </Link>
                  <Link 
                    href={getLocalizedPath('/products', locale)}
                    className="inline-flex items-center justify-center border border-primary-600 text-primary-600 px-3 sm:px-4 lg:px-6 py-2 sm:py-2.5 lg:py-3 rounded-lg text-xs sm:text-sm lg:text-base font-semibold hover:bg-primary-50 transition-colors w-full sm:w-auto"
                  >
                    {t('partners.viewProducts')}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

