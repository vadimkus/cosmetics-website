'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import BreadcrumbSchema from '@/components/schema/BreadcrumbSchema'
import { useTranslation } from '@/hooks/useTranslation'
import { getLocalizedPath } from '@/lib/i18n'

export default function GenosysPageClient() {
  const { t, locale, dir } = useTranslation()
  
  return (
    <div className="bg-white min-h-screen" dir={dir}>
      <BreadcrumbSchema 
        items={[
          { name: t('common.home'), url: getLocalizedPath('/', locale) },
          { name: 'GENOSYS Official', url: getLocalizedPath('/genosys', locale) }
        ]}
      />
      <div className="container mx-auto px-4 py-8 md:py-16">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link 
            href={getLocalizedPath('/', locale)}
            className={`inline-flex items-center text-gray-600 hover:text-primary-600 transition-colors mb-6 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}
          >
            <ArrowLeft className={`h-5 w-5 ${dir === 'rtl' ? 'ml-2 rotate-180' : 'mr-2'}`} />
            {t('common.backToHome')}
          </Link>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Genosys Middle East FZ-LLC
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8">
            Official Distributor of DTSMG Co., Ltd Korea
          </p>
        </div>

        <div className="prose prose-lg max-w-none">
          <div className="bg-gray-50 rounded-lg p-6 md:p-8 mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
              About GENOSYS
            </h2>
            <p className="text-gray-700 mb-4 leading-relaxed">
              GENOSYS is the world's first microneedling-dedicated brand, developed by DTSMG Co., Ltd Korea. 
              The brand name "GENOSYS" stands for "Gene Re-Birth System," representing our innovative approach 
              to skincare that combines microneedling technology with specially formulated cosmeceuticals.
            </p>
            <p className="text-gray-700 mb-4 leading-relaxed">
              Our products are designed to work synergistically with microneedling procedures, enhancing 
              the penetration and effectiveness of active ingredients for optimal skincare results.
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 md:p-8 mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
              Our Mission
            </h2>
            <p className="text-gray-700 mb-4 leading-relaxed">
              GENOSYS Middle East FZ-LLC is committed to bringing the highest quality Korean dermacosmetics 
              to the United Arab Emirates. We provide professional-grade skincare solutions that combine 
              cutting-edge technology with proven ingredients.
            </p>
            <p className="text-gray-700 leading-relaxed">
              As the official distributor of DTSMG Co., Ltd Korea, we ensure that all our products meet 
              the highest standards of quality and are certified by Dubai Municipality, guaranteeing 
              safety and efficacy for our customers.
            </p>
          </div>

          <div className="bg-primary-50 rounded-lg p-6 md:p-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
              Why Choose GENOSYS?
            </h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>World's first microneedling-dedicated brand</li>
              <li>Developed by DTSMG Co., Ltd Korea</li>
              <li>Certified by Dubai Municipality</li>
              <li>Professional-grade formulations</li>
              <li>Synergistic product combinations</li>
              <li>Proven results in skincare</li>
            </ul>
          </div>
        </div>
      </div>
      </div>
    </div>
  )
}

