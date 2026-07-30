'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Download } from 'lucide-react'
import PDFDownloadButton from '@/components/PDFDownloadButton'
import BreadcrumbSchema from '@/components/schema/BreadcrumbSchema'
import { useTranslation } from '@/hooks/useTranslation'
import { getLocalizedPath } from '@/lib/i18n'

export default function ArabicTrainingPageClient() {
  const { t, locale, dir } = useTranslation()

  return (
    <div className="bg-white min-h-screen" dir={dir}>
      <BreadcrumbSchema 
        items={[
          { name: t('navigation.home'), url: getLocalizedPath('/', locale) },
          { name: t('navigation.training'), url: getLocalizedPath('/training', locale) }
        ]}
      />
      <div className="container mx-auto px-3 md:px-4 py-4 md:py-16">
        <div className="max-w-4xl mx-auto">

          {/* Navigation Breadcrumb */}
          <nav className="text-xs md:text-base text-gray-600 mb-2 md:mb-4" aria-label="Breadcrumb">
            <Link href={getLocalizedPath('/', locale)} className="hover:text-primary-600 transition-colors">{t('navigation.home')}</Link>
            <span> / </span>
            <span className="text-gray-900 font-medium">{t('navigation.training')}</span>
          </nav>
          
          {/* Back to Home */}
          <Link href={getLocalizedPath('/', locale)} className="inline-flex items-center gap-1 text-xs md:text-sm text-primary-600 hover:text-primary-700 mb-4 md:mb-8">
            <ArrowLeft className={`h-3 w-3 md:h-4 md:w-4 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
            <span>{t('common.backToHome')}</span>
          </Link>

          {/* Logo - hidden on mobile */}
          <div className="hidden md:block text-center mb-6">
            <Image 
              src="/images/genosys-logo.png" 
              alt="Genosys Professional Training" 
              width={400} 
              height={200} 
              className="object-contain w-64 mx-auto"
              priority
            />
          </div>

          {/* Download Documents Section */}
          <div className="bg-white border border-gray-200 rounded-lg md:rounded-xl shadow-sm mb-6 md:mb-12">
            <div className="p-3 md:p-8">
              
              {/* Training Documents Section */}
              <div className="mb-4 md:mb-8">
                <h3 className={`text-sm md:text-xl font-semibold text-gray-800 mb-3 md:mb-6 flex items-center justify-center gap-1.5 md:gap-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                  <div className="w-6 h-6 md:w-8 md:h-8 bg-green-100 rounded-md md:rounded-lg flex items-center justify-center">
                    <svg className="w-3 h-3 md:w-4 md:h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  {t('training.trainingDocuments')}
                </h3>
              <div className="space-y-1.5 md:space-y-2">
                  <div className="group border border-gray-200 rounded-md md:rounded-lg p-2 md:p-3 hover:border-green-300 hover:shadow-lg transition-all duration-200">
                    <div className={`flex items-center gap-2 md:gap-3 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                      <div className="w-8 h-8 md:w-10 md:h-10 bg-green-50 rounded-md md:rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0 group-hover:bg-green-100 transition-colors">
                        <Download className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs md:text-sm font-semibold text-gray-900 truncate">
                        {t('training.productCatalogue')}
                      </h4>
                        <p className="text-[10px] md:text-xs text-gray-400">
                        39.9 MB
                      </p>
                      </div>
                      <PDFDownloadButton
                        href="https://genosys.ae/documents/GENOSYS%20Catalogue_2026.pdf"
                        filename="Product Catalogue 2026"
                        external={true}
                        className={`inline-flex items-center px-2 md:px-3 py-1 md:py-1.5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-md hover:from-green-700 hover:to-green-800 transition-colors text-[10px] md:text-xs font-medium flex-shrink-0 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}
                      >
                        <Download className={`h-2.5 w-2.5 md:h-3 md:w-3 ${dir === 'rtl' ? 'ml-1' : 'mr-1'}`} />
                        {t('training.viewPdf')}
                      </PDFDownloadButton>
                    </div>
                  </div>
                
                  <div className="group border border-gray-200 rounded-md md:rounded-lg p-2 md:p-3 hover:border-green-300 hover:shadow-lg transition-all duration-200">
                    <div className={`flex items-center gap-2 md:gap-3 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                      <div className="w-8 h-8 md:w-10 md:h-10 bg-green-50 rounded-md md:rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0 group-hover:bg-green-100 transition-colors">
                        <Download className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs md:text-sm font-semibold text-gray-900 truncate">
                        {t('training.homeCareGuide')}
                      </h4>
                        <p className="text-[10px] md:text-xs text-gray-400">
                        9.8 MB
                      </p>
                      </div>
                      <PDFDownloadButton
                        href="https://genosys.ae/documents/Genosys-Home-Care-Guide.pdf"
                        filename="Home Care Guide 2026"
                        external={true}
                        className={`inline-flex items-center px-2 md:px-3 py-1 md:py-1.5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-md hover:from-green-700 hover:to-green-800 transition-colors text-[10px] md:text-xs font-medium flex-shrink-0 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}
                      >
                        <Download className={`h-2.5 w-2.5 md:h-3 md:w-3 ${dir === 'rtl' ? 'ml-1' : 'mr-1'}`} />
                        {t('training.viewPdf')}
                      </PDFDownloadButton>
                    </div>
                  </div>
                
                  <div className="group border border-gray-200 rounded-md md:rounded-lg p-2 md:p-3 hover:border-green-300 hover:shadow-lg transition-all duration-200">
                    <div className={`flex items-center gap-2 md:gap-3 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                      <div className="w-8 h-8 md:w-10 md:h-10 bg-green-50 rounded-md md:rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0 group-hover:bg-green-100 transition-colors">
                        <Download className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs md:text-sm font-semibold text-gray-900 truncate">
                        {t('training.professionalManual')}
                      </h4>
                        <p className="text-[10px] md:text-xs text-gray-400">
                        10.4 MB
                      </p>
                      </div>
                      <PDFDownloadButton
                        href="https://genosys.ae/documents/Genosys-Professional-Manual.pdf"
                        filename="Professional Manual 2026"
                        external={true}
                        className={`inline-flex items-center px-2 md:px-3 py-1 md:py-1.5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-md hover:from-green-700 hover:to-green-800 transition-colors text-[10px] md:text-xs font-medium flex-shrink-0 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}
                      >
                        <Download className={`h-2.5 w-2.5 md:h-3 md:w-3 ${dir === 'rtl' ? 'ml-1' : 'mr-1'}`} />
                        {t('training.viewPdf')}
                      </PDFDownloadButton>
                    </div>
                  </div>
                
                  <div className="group border border-gray-200 rounded-md md:rounded-lg p-2 md:p-3 hover:border-green-300 hover:shadow-lg transition-all duration-200">
                    <div className={`flex items-center gap-2 md:gap-3 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                      <div className="w-8 h-8 md:w-10 md:h-10 bg-green-50 rounded-md md:rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0 group-hover:bg-green-100 transition-colors">
                        <Download className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs md:text-sm font-semibold text-gray-900 truncate">
                          {t('training.facialTreatmentHomecare')}
                        </h4>
                        <p className="text-[10px] md:text-xs text-gray-400">
                        8.2 MB
                      </p>
                      </div>
                      <PDFDownloadButton
                        href="/documents/PPT/GENOSYS%20FACIAL%20TREATMENT_Homecare_2025.pdf"
                        filename="Facial Treatment Homecare 2026"
                        external={true}
                        className={`inline-flex items-center px-2 md:px-3 py-1 md:py-1.5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-md hover:from-green-700 hover:to-green-800 transition-colors text-[10px] md:text-xs font-medium flex-shrink-0 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}
                      >
                        <Download className={`h-2.5 w-2.5 md:h-3 md:w-3 ${dir === 'rtl' ? 'ml-1' : 'mr-1'}`} />
                        {t('training.viewPdf')}
                      </PDFDownloadButton>
                    </div>
                  </div>
                  
                  <div className="group border border-gray-200 rounded-md md:rounded-lg p-2 md:p-3 hover:border-green-300 hover:shadow-lg transition-all duration-200">
                    <div className={`flex items-center gap-2 md:gap-3 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                      <div className="w-8 h-8 md:w-10 md:h-10 bg-green-50 rounded-md md:rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0 group-hover:bg-green-100 transition-colors">
                        <Download className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs md:text-sm font-semibold text-gray-900 truncate">
                          {t('training.facialTreatmentProfessional')}
                        </h4>
                        <p className="text-[10px] md:text-xs text-gray-400">
                          8.2 MB
                        </p>
                      </div>
                      <PDFDownloadButton
                        href="/documents/PPT/GENOSYS%20FACIAL%20TREATMENT_Professional_2025.pdf"
                        filename="Facial Treatment Professional 2026"
                        external={true}
                        className={`inline-flex items-center px-2 md:px-3 py-1 md:py-1.5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-md hover:from-green-700 hover:to-green-800 transition-colors text-[10px] md:text-xs font-medium flex-shrink-0 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}
                      >
                        <Download className={`h-2.5 w-2.5 md:h-3 md:w-3 ${dir === 'rtl' ? 'ml-1' : 'mr-1'}`} />
                        {t('training.viewPdf')}
                      </PDFDownloadButton>
                    </div>
                  </div>
                  
                  <div className="group border border-gray-200 rounded-md md:rounded-lg p-2 md:p-3 hover:border-green-300 hover:shadow-lg transition-all duration-200">
                    <div className={`flex items-center gap-2 md:gap-3 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                      <div className="w-8 h-8 md:w-10 md:h-10 bg-green-50 rounded-md md:rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0 group-hover:bg-green-100 transition-colors">
                        <Download className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs md:text-sm font-semibold text-gray-900 truncate">
                          {t('training.achieveKoreanGlassSkin')}
                        </h4>
                        <p className="text-[10px] md:text-xs text-gray-400">
                          10 MB
                        </p>
                      </div>
                      <PDFDownloadButton
                        href="/documents/PPT/Achieve%20Korean%20Glass%20Skin%20with%20GENOSYS%20approach_F.pdf"
                        filename="Achieve Korean Glass Skin with GENOSYS approach"
                        external={true}
                        className={`inline-flex items-center px-2 md:px-3 py-1 md:py-1.5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-md hover:from-green-700 hover:to-green-800 transition-colors text-[10px] md:text-xs font-medium flex-shrink-0 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}
                      >
                        <Download className={`h-2.5 w-2.5 md:h-3 md:w-3 ${dir === 'rtl' ? 'ml-1' : 'mr-1'}`} />
                        {t('training.viewPdf')}
                      </PDFDownloadButton>
                    </div>
                  </div>
                  
                  <div className="group border border-gray-200 rounded-md md:rounded-lg p-2 md:p-3 hover:border-green-300 hover:shadow-lg transition-all duration-200">
                    <div className={`flex items-center gap-2 md:gap-3 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                      <div className="w-8 h-8 md:w-10 md:h-10 bg-green-50 rounded-md md:rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0 group-hover:bg-green-100 transition-colors">
                        <Download className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs md:text-sm font-semibold text-gray-900 truncate">
                          {t('training.bioMesoPdrnGuide')}
                        </h4>
                        <p className="text-[10px] md:text-xs text-gray-400">
                          8.9 MB
                        </p>
                      </div>
                      <PDFDownloadButton
                        href="/documents/PPT/Bio-Meso%20PDRN%20Expert_Treatment%20guide_for%20print_S.pdf"
                        filename="Bio-Meso PDRN Expert Treatment Guide"
                        external={true}
                        className={`inline-flex items-center px-2 md:px-3 py-1 md:py-1.5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-md hover:from-green-700 hover:to-green-800 transition-colors text-[10px] md:text-xs font-medium flex-shrink-0 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}
                      >
                        <Download className={`h-2.5 w-2.5 md:h-3 md:w-3 ${dir === 'rtl' ? 'ml-1' : 'mr-1'}`} />
                        {t('training.viewPdf')}
                      </PDFDownloadButton>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Product Documentation Section */}
              <div>
                <h3 className={`text-xl font-semibold text-gray-800 mb-6 flex items-center justify-center gap-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                  <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                  </div>
                  {t('training.productDocumentation')}
                </h3>
                <div className="space-y-1.5 md:space-y-2">
                  {/* Product documentation items - keeping product names in English as they are brand names */}
                  {[
                    { id: 66, image: '/images/cera/main.jpeg', name: 'CERABARRIER BIOME GEL CLEANSER', size: '1.4 MB', href: '/documents/PPT/GENOSYS%20CERABARRIER%20BIOME%20GEL%20CLEANSER.pdf' },
                    { id: 31, image: '/images/radiance/main.jpeg', name: 'MULTI VITA RADIANCE CREAM', size: '2.1 MB', href: '/documents/PPT/GENOSYS%20MULTI%20VITA%20RADIANCE%20CREAM.pdf' },
                    { id: 50, image: '/images/EYEZ.jpg', name: 'EyeCell EYE ZONE CARE SYSTEM', size: '1.8 MB', href: '/documents/PPT/GENOSYS%20EyeCell%20EYE%20ZONE%20CARE%20SYSTEM.pdf' },
                    { id: 12, image: '/images/epi/main.jpeg', name: 'EPI TURNOVER BOOSTING PEELING GEL', size: '3.8 MB', href: '/documents/PPT/GENOSYS%20EPI%20TURNOVER%20BOOSTING%20PEELING%20GEL.pdf' },
                    { id: 21, image: '/images/radiance_serum/main.jpeg', name: 'MULTI VITA RADIANCE SERUM', size: '1.5 MB', href: '/documents/PPT/GENOSYS%20MULTI%20VITA%20RADIANCE%20SERUM.pdf' },
                    { id: 11, image: '/images/remover/Main2.jpg', name: 'SKIN DEFENDER LIP & EYE MAKEUP REMOVER', size: '0.7 MB', href: '/documents/PPT/GENOSYS%20SKIN%20DEFENDER%20LIP%20%26%20EYE%20MAKEUP%20REMOVER.pdf' },
                    { id: 14, image: '/images/mist/main2.jpeg', name: 'MICROBIOME ENERGY INFUSING MIST', size: '0.8 MB', href: '/documents/PPT/GENOSYS%20MICROBIOME%20ENERGY%20INFUSING%20MIST.pdf' },
                    { id: 34, image: '/images/overnight/main.jpeg', name: 'SKIN RESCUE OVERNIGHT CREAM MASK', size: '1.3 MB', href: '/documents/PPT/GENOSYS%20SKIN%20RESCUE%20OVERNIGHT%20CREAM%20MASK.pdf' },
                    { id: 15, image: '/images/problem/Main.jpg', name: 'INTENSIVE PROBLEM CONTROL TONER', size: '1.0 MB', href: '/documents/PPT/GENOSYS%20INTENSIVE%20PROBLEM%20CONTROL%20TONER.pdf' },
                    { id: 20, image: '/images/PRSS.jpg', name: 'PROBLEM CONTROL SERUM', size: '2.2 MB', href: '/documents/PPT/GENOSYS%20INTENSIVE%20PROBLEM%20CONTROL%20SERUM.pdf' },
                    { id: 39, image: '/images/ultra/main.jpeg', name: 'ULTRA SHIELD SUN CREAM', size: '0.6 MB', href: '/documents/PPT/GENOSYS%20ULTRA%20SHIELD%20SUN%20CREAM.pdf' },
                    { id: 44, image: '/images/Sham.jpg', name: 'HR³ MATRIX SCALP SHAMPOO α', size: '2.3 MB', href: '/documents/PPT/GENOSYS%20HR3%20MATRIX%20SCALP%20SHAMPOO%20ALPHA.pdf' },
                    { id: 18, image: '/images/hyaluron_serum/main.jpeg', name: 'MOISTURE REPLENISHING HYALURON SERUM', size: '1.9 MB', href: '/documents/PPT/GENOSYS%20MOISTURE%20REPLENISHING%20HYALURON%20SERUM.pdf' },
                    { id: 29, image: '/images/hyaluron/main.jpeg', name: 'MOISTURE REPLENISHING HYALURON CREAM', size: '2.0 MB', href: '/documents/PPT/GENOSYS%20MOISTURE%20REPLENISHING%20HYALURON%20CREAM.pdf' },
                    { id: 41, image: '/images/cushion/main.jpeg', name: 'SKIN CARING BLEMISH BALM CUSHION', size: '1.2 MB', href: '/documents/PPT/GENOSYS%20SKIN%20CARING%20BLEMISH%20BALM%20CUSHION.pdf' },
                    { id: 63, image: '/images/revita/main.jpg', name: 'REVITA GLOW BLEMISH BALM CREAM', size: '2.0 MB', href: '/documents/PPT/GENOSYS_REVITA_GLOW_BB_CREAM.pdf' },
                    { id: 33, image: '/images/Patch.jpg', name: 'EyeCell EYE PEPTIDE GEL PATCH', size: '1.4 MB', href: '/documents/PPT/GENOSYS%20EyeCell%20EYE%20PEPTIDE%20GEL%20PATCH.pdf' },
                    { id: 51, image: '/images/BFAD.png', name: 'BIO-FERMENT AGE DEFYING POWDER MASK', size: '2.1 MB', href: '/documents/PPT/GENOSYS%20BIO-FERMENT%20AGE%20DEFYING%20POWDER%20MASK.pdf' },
                    { id: 48, image: '/images/gen.jpg', name: 'HAIR GENTRON', size: '1.8 MB', href: '/documents/PPT/HAIR%20GENTRON.pdf' },
                    { id: 45, image: '/images/HHR.jpg', name: 'HR³ MATRIX HAIR SOLUTION α', size: '2.3 MB', href: '/documents/PPT/GENOSYS%20HR3%20MATRIX%20HAIR%20SOLUTION%20ALPHA.pdf' },
                    { id: 43, image: '/images/HT.jpg', name: 'HR³ MATRIX HAIR TONIC α', size: '1.9 MB', href: '/documents/PPT/GENOSYS%20HR3%20MATRIX%20HAIR%20TONIC%20ALPHA.pdf' },
                    { id: 46, image: '/images/scal.jpg', name: 'HR³ MATRIX SCALP PEELING α', size: '2.1 MB', href: '/documents/PPT/GENOSYS%20HR3%20MATRIX%20SCALP%20PEELING%20ALPHA.pdf' },
                    { id: 61, image: '/images/Second/brush.jpg', name: 'HR³ MATRIX SCALP BRUSH', size: '0.4 MB', href: '/documents/PPT/GENOSYS%20HR3%20MATRIX%20SCALP%20BRUSH.pdf' },
                    { id: 49, image: '/images/LEDD.jpg', name: 'GENO-LED IR II', size: '4.6 MB', href: '/documents/PPT/GENO-LED%20IR%20II_2025.pdf' },
                    { id: 52, image: '/images/PDRN.png', name: 'SKIN REBOOT PDRN MASK PACK', size: '1.2 MB', href: '/documents/PPT/GENOSYS%20SKIN%20REBOOT%20PDRN%20MASK%20PACK.pdf' },
                    { id: 38, image: '/images/EZE.jpg', name: 'EZ CO₂ MASK KIT', size: '0.5 MB', href: '/documents/PPT/Genosys%20Ez%20Co2%20Mask.pdf' },
                    { id: 1, image: '/images/genosys-microneedling-devices.jpg', name: 'Microneedle Roller', size: '1.5 MB', href: '/documents/PPT/Overview%20of%20Microneedling_S.pdf' },
                  ].map((product) => (
                    <div key={product.id} className="group border border-gray-200 rounded-lg p-3 hover:border-red-300 hover:shadow-lg transition-all duration-200">
                      <div className={`flex items-center gap-2 md:gap-3 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                          <Link href={getLocalizedPath(`/products/${product.id}`, locale)}>
                            <Image
                              src={product.image}
                              alt={product.name}
                              width={500}
                              height={300} 
                              className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                            />
                          </Link>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs md:text-sm font-semibold text-gray-900 truncate">
                            {product.name}
                          </h4>
                          <p className="text-[10px] md:text-xs text-gray-400">
                            {product.size}
                          </p>
                        </div>
                        <PDFDownloadButton 
                          href={product.href}
                          filename="Product Documentation"
                          external={true}
                          className={`inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-md hover:from-red-700 hover:to-red-800 transition-colors text-[10px] md:text-xs font-medium flex-shrink-0 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}
                        >
                          <Download className={`h-2.5 w-2.5 md:h-3 md:w-3 ${dir === 'rtl' ? 'ml-1' : 'mr-1'}`} />
                          {t('training.viewPdf')}
                        </PDFDownloadButton>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Training Lessons Section */}
          <div className="mt-16">
            <div className="grid gap-8">
              {/* Genosys Bodycell Stretch Mark Treatment Lesson */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-6">
                  <h3 className={`text-2xl font-bold text-gray-800 mb-4 text-center ${dir === 'rtl' ? 'text-right' : ''}`}>
                    Genosys Bodycell Stretch Mark Treatment
                  </h3>
                  <p className={`text-gray-600 mb-6 ${dir === 'rtl' ? 'text-right' : ''}`}>
                    تعلم التقنيات المهنية لعلاج علامات التمدد باستخدام تقنية Genosys Bodycell. يغطي هذا التدريب الشامل طرق التطبيق الصحيحة وبروتوكولات السلامة والنتائج المتوقعة.
                  </p>
                  
                  <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                    <iframe
                      className="absolute top-0 left-0 w-full h-full rounded-lg"
                      src="https://www.youtube.com/embed/SvjziVjhb8s"
                      title="Genosys Bodycell Stretch Mark Treatment Training"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    ></iframe>
                  </div>
                  
                  <div className={`mt-6 grid md:grid-cols-2 gap-6 ${dir === 'rtl' ? 'text-right' : ''}`}>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">{t('training.whatYoullLearn')}</h4>
                      <ul className="text-gray-600 space-y-1">
                        <li>• تقنيات تطبيق المنتج الصحيحة</li>
                        <li>• بروتوكولات السلامة والاحتياطات</li>
                        <li>• مدة العلاج والتكرار</li>
                        <li>• النتائج المتوقعة والجدول الزمني</li>
                        <li>• أفضل ممارسات استشارة العملاء</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">{t('training.lessonDetails')}</h4>
                      <ul className="text-gray-600 space-y-1">
                        <li>• {t('training.duration')} 15-20 {locale === 'ar' ? 'دقيقة' : 'minutes'}</li>
                        <li>• {t('training.level')}: {t('training.professional')}</li>
                        <li>• {t('training.category')}: {t('training.bodyTreatments')}</li>
                        <li>• {t('training.certification')}: {t('training.availableUponCompletion')}</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Genosys NDcell Neck & Decollete Treatment Lesson */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-6">
                  <h3 className={`text-2xl font-bold text-gray-800 mb-4 text-center ${dir === 'rtl' ? 'text-right' : ''}`}>
                    Genosys NDcell Neck & Decollete Treatment
                  </h3>
                  <p className={`text-gray-600 mb-6 ${dir === 'rtl' ? 'text-right' : ''}`}>
                    أتقن التقنيات المتخصصة لعلاج منطقة الرقبة والصدر الحساسة باستخدام تقنية Genosys NDcell. يغطي هذا التدريب المتقدم طرق التطبيق الصحيحة واعتبارات السلامة وتحقيق النتائج المثلى لهذه المنطقة الحساسة.
                  </p>
                  
                  <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                    <iframe
                      className="absolute top-0 left-0 w-full h-full rounded-lg"
                      src="https://www.youtube.com/embed/m07q2XRt_OM"
                      title="Genosys NDcell Neck & Decollete Treatment Training"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    ></iframe>
                  </div>
                  
                  <div className={`mt-6 grid md:grid-cols-2 gap-6 ${dir === 'rtl' ? 'text-right' : ''}`}>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">{t('training.whatYoullLearn')}</h4>
                      <ul className="text-gray-600 space-y-1">
                        <li>• تقنيات الرقبة والصدر المتخصصة</li>
                        <li>• التعامل الصحيح مع مناطق الجلد الحساسة</li>
                        <li>• بروتوكولات العلاج والتوقيت</li>
                        <li>• وضعية العميل والراحة</li>
                        <li>• تعليمات العناية بعد العلاج</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">{t('training.lessonDetails')}</h4>
                      <ul className="text-gray-600 space-y-1">
                        <li>• {t('training.duration')} 18-22 {locale === 'ar' ? 'دقيقة' : 'minutes'}</li>
                        <li>• {t('training.level')}: {t('training.advancedProfessional')}</li>
                        <li>• {t('training.category')}: {t('training.specializedTreatments')}</li>
                        <li>• {t('training.certification')}: {t('training.availableUponCompletion')}</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Genosys EyeCell Treatment Lesson */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-6">
                  <h3 className={`text-2xl font-bold text-gray-800 mb-4 text-center ${dir === 'rtl' ? 'text-right' : ''}`}>
                    Genosys EyeCell Treatment
                  </h3>
                  <p className={`text-gray-600 mb-6 ${dir === 'rtl' ? 'text-right' : ''}`}>
                    تعلم التقنيات الدقيقة لعلاج منطقة العين الحساسة باستخدام تقنية Genosys EyeCell. يغطي هذا التدريب المتخصص طرق التطبيق الآمنة وبروتوكولات راحة العميل وتحقيق النتائج المثلى لمنطقة العين الحساسة.
                  </p>
                  
                  <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                    <iframe
                      className="absolute top-0 left-0 w-full h-full rounded-lg"
                      src="https://www.youtube.com/embed/xH58EZtykZE"
                      title="Genosys EyeCell Treatment Training"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    ></iframe>
                  </div>
                  
                  <div className={`mt-6 grid md:grid-cols-2 gap-6 ${dir === 'rtl' ? 'text-right' : ''}`}>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">{t('training.whatYoullLearn')}</h4>
                      <ul className="text-gray-600 space-y-1">
                        <li>• تقنيات علاج منطقة العين الدقيقة</li>
                        <li>• بروتوكولات السلامة لمنطقة العين الحساسة</li>
                        <li>• وضعية العميل وحماية العين</li>
                        <li>• شدة العلاج والمدة</li>
                        <li>• العناية بعد العلاج والتوصيات</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">{t('training.lessonDetails')}</h4>
                      <ul className="text-gray-600 space-y-1">
                        <li>• {t('training.duration')} 16-20 {locale === 'ar' ? 'دقيقة' : 'minutes'}</li>
                        <li>• {t('training.level')}: {t('training.advancedProfessional')}</li>
                        <li>• {t('training.category')}: {t('training.specializedEyeTreatments')}</li>
                        <li>• {t('training.certification')}: {t('training.availableUponCompletion')}</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Genosys HR3 Matrix Treatment Lesson */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-6">
                  <h3 className={`text-2xl font-bold text-gray-800 mb-4 text-center ${dir === 'rtl' ? 'text-right' : ''}`}>
                    Genosys HR3 Matrix Treatment
                  </h3>
                  <p className={`text-gray-600 mb-6 ${dir === 'rtl' ? 'text-right' : ''}`}>
                    أتقن تقنيات علاج HR3 Matrix المتقدمة باستخدام تقنية Genosys. يغطي هذا التدريب الشامل طرق تطبيق المصفوفة وبروتوكولات العلاج وتحقيق النتائج المثلى لتجديد البشرة وتعزيز المصفوفة.
                  </p>
                  
                  <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                    <iframe
                      className="absolute top-0 left-0 w-full h-full rounded-lg"
                      src="https://www.youtube.com/embed/qQRcEvd3Ks4"
                      title="Genosys HR3 Matrix Treatment Training"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    ></iframe>
                  </div>
                  
                  <div className={`mt-6 grid md:grid-cols-2 gap-6 ${dir === 'rtl' ? 'text-right' : ''}`}>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">{t('training.whatYoullLearn')}</h4>
                      <ul className="text-gray-600 space-y-1">
                        <li>• تقنيات تطبيق HR3 Matrix</li>
                        <li>• بروتوكولات العلاج والتوقيت</li>
                        <li>• تحضير البشرة والتقييم</li>
                        <li>• استشارة العميل والتوقعات</li>
                        <li>• العناية بعد العلاج والمتابعة</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">{t('training.lessonDetails')}</h4>
                      <ul className="text-gray-600 space-y-1">
                        <li>• {t('training.duration')} 20-25 {locale === 'ar' ? 'دقيقة' : 'minutes'}</li>
                        <li>• {t('training.level')}: {t('training.advancedProfessional')}</li>
                        <li>• {t('training.category')}: {t('training.matrixTreatments')}</li>
                        <li>• {t('training.certification')}: {t('training.availableUponCompletion')}</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Facial Treatment Lesson */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-6">
                  <h3 className={`text-2xl font-bold text-gray-800 mb-4 text-center ${dir === 'rtl' ? 'text-right' : ''}`}>
                    Facial Treatment
                  </h3>
                  <p className={`text-gray-600 mb-6 ${dir === 'rtl' ? 'text-right' : ''}`}>
                    تعلم تقنيات علاج الوجه الشاملة باستخدام منتجات وبروتوكولات Genosys. يغطي هذا التدريب الأساسي إجراءات الوجه الكاملة وتسلسل تطبيق المنتج وتحقيق النتائج المثلى لأنواع البشرة المختلفة والمشاكل.
                  </p>
                  
                  <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                    <iframe
                      className="absolute top-0 left-0 w-full h-full rounded-lg"
                      src="https://www.youtube.com/embed/hMtodh45sME"
                      title="Facial Treatment Training"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    ></iframe>
                  </div>
                  
                  <div className={`mt-6 grid md:grid-cols-2 gap-6 ${dir === 'rtl' ? 'text-right' : ''}`}>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">{t('training.whatYoullLearn')}</h4>
                      <ul className="text-gray-600 space-y-1">
                        <li>• بروتوكولات علاج الوجه الكاملة</li>
                        <li>• تسلسل تطبيق المنتج</li>
                        <li>• تحليل البشرة والتقييم</li>
                        <li>• تقنيات استشارة العميل</li>
                        <li>• طرق تخصيص العلاج</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">{t('training.lessonDetails')}</h4>
                      <ul className="text-gray-600 space-y-1">
                        <li>• {t('training.duration')} 25-30 {locale === 'ar' ? 'دقيقة' : 'minutes'}</li>
                        <li>• {t('training.level')}: {t('training.professional')}</li>
                        <li>• {t('training.category')}: {t('training.facialTreatments')}</li>
                        <li>• {t('training.certification')}: {t('training.availableUponCompletion')}</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* How to use Genosys Snow 02 Cleanser Lesson */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-6">
                  <h3 className={`text-2xl font-bold text-gray-800 mb-4 text-center ${dir === 'rtl' ? 'text-right' : ''}`}>
                    How to use Genosys Snow 02 Cleanser
                  </h3>
                  <p className={`text-gray-600 mb-6 ${dir === 'rtl' ? 'text-right' : ''}`}>
                    أتقن التقنيات الصحيحة لاستخدام Genosys Snow 02 Cleanser بفعالية. يغطي هذا التدريب التفصيلي طرق التطبيق الصحيحة والتوقيت وتحقيق نتائج التنظيف المثلى لأنواع البشرة والحالات المختلفة.
                  </p>
                  
                  <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                    <iframe
                      className="absolute top-0 left-0 w-full h-full rounded-lg"
                      src="https://www.youtube.com/embed/SWY0f2gSzl8"
                      title="How to use Genosys Snow 02 Cleanser Training"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    ></iframe>
                  </div>
                  
                  <div className={`mt-6 grid md:grid-cols-2 gap-6 ${dir === 'rtl' ? 'text-right' : ''}`}>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">{t('training.whatYoullLearn')}</h4>
                      <ul className="text-gray-600 space-y-1">
                        <li>• تطبيق Snow 02 Cleanser الصحيح</li>
                        <li>• التوقيت والمدة الصحيحة</li>
                        <li>• اعتبارات نوع البشرة</li>
                        <li>• فوائد المنتج والنتائج</li>
                        <li>• التكامل مع العلاجات الأخرى</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">{t('training.lessonDetails')}</h4>
                      <ul className="text-gray-600 space-y-1">
                        <li>• {t('training.duration')} 12-15 {locale === 'ar' ? 'دقيقة' : 'minutes'}</li>
                        <li>• {t('training.level')}: {t('training.professional')}</li>
                        <li>• {t('training.category')}: {t('training.productUsage')}</li>
                        <li>• {t('training.certification')}: {t('training.availableUponCompletion')}</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* GENOSYS HR3 MATRIX Lesson */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-6">
                  <h3 className={`text-2xl font-bold text-gray-800 mb-4 text-center ${dir === 'rtl' ? 'text-right' : ''}`}>
                    GENOSYS HR3 MATRIX
                  </h3>
                  <p className={`text-gray-600 mb-6 ${dir === 'rtl' ? 'text-right' : ''}`}>
                    تدريب متقدم على تقنية وتقنيات تطبيق GENOSYS HR3 MATRIX. يغطي هذا الدرس الشامل بروتوكولات علاج المصفوفة وطرق التطبيق المتقدمة وتحقيق النتائج المثلى لتجديد البشرة وتعزيز المصفوفة.
                  </p>
                  
                  <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                    <iframe
                      className="absolute top-0 left-0 w-full h-full rounded-lg"
                      src="https://www.youtube.com/embed/pM8qIUNdORY"
                      title="GENOSYS HR3 MATRIX Training"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    ></iframe>
                  </div>
                  
                  <div className={`mt-6 grid md:grid-cols-2 gap-6 ${dir === 'rtl' ? 'text-right' : ''}`}>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">{t('training.whatYoullLearn')}</h4>
                      <ul className="text-gray-600 space-y-1">
                        <li>• تقنيات HR3 MATRIX المتقدمة</li>
                        <li>• بروتوكولات علاج المصفوفة</li>
                        <li>• تقييم البشرة والتحضير</li>
                        <li>• طرق تخصيص العلاج</li>
                        <li>• استراتيجيات تحسين النتائج</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">{t('training.lessonDetails')}</h4>
                      <ul className="text-gray-600 space-y-1">
                        <li>• {t('training.duration')} 22-28 {locale === 'ar' ? 'دقيقة' : 'minutes'}</li>
                        <li>• {t('training.level')}: {t('training.advancedProfessional')}</li>
                        <li>• {t('training.category')}: {t('training.matrixTreatments')}</li>
                        <li>• {t('training.certification')}: {t('training.availableUponCompletion')}</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* GENOSYS HR3 MATRIX HAIR SOLUTION ALPHA Lesson */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-6">
                  <h3 className={`text-2xl font-bold text-gray-800 mb-4 text-center ${dir === 'rtl' ? 'text-right' : ''}`}>
                    GENOSYS HR3 MATRIX HAIR SOLUTION ALPHA
                  </h3>
                  <p className={`text-gray-600 mb-6 ${dir === 'rtl' ? 'text-right' : ''}`}>
                    تدريب متخصص على GENOSYS HR3 MATRIX HAIR SOLUTION ALPHA لبروتوكولات علاج الشعر المتقدمة. يغطي هذا الدرس الشامل تقنيات علاج مصفوفة الشعر وتحضير فروة الرأس وتحقيق النتائج المثلى لاستعادة الشعر وتعزيزه.
                  </p>
                  
                  <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                    <iframe
                      className="absolute top-0 left-0 w-full h-full rounded-lg"
                      src="https://www.youtube.com/embed/ZVg5mBVStSw"
                      title="GENOSYS HR3 MATRIX HAIR SOLUTION ALPHA Training"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    ></iframe>
                  </div>
                  
                  <div className={`mt-6 grid md:grid-cols-2 gap-6 ${dir === 'rtl' ? 'text-right' : ''}`}>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">{t('training.whatYoullLearn')}</h4>
                      <ul className="text-gray-600 space-y-1">
                        <li>• بروتوكولات علاج مصفوفة الشعر</li>
                        <li>• تقنيات تحضير فروة الرأس</li>
                        <li>• طرق تطبيق محلول ALPHA</li>
                        <li>• إجراءات استعادة الشعر</li>
                        <li>• تخصيص العلاج لأنواع الشعر</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">{t('training.lessonDetails')}</h4>
                      <ul className="text-gray-600 space-y-1">
                        <li>• {t('training.duration')} 24-30 {locale === 'ar' ? 'دقيقة' : 'minutes'}</li>
                        <li>• {t('training.level')}: {t('training.advancedProfessional')}</li>
                        <li>• {t('training.category')}: {t('training.hairTreatments')}</li>
                        <li>• {t('training.certification')}: {t('training.availableUponCompletion')}</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Eye Cell Treatment - Eye zone treatment with Eye Roller 0.25mm Lesson */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-6">
                  <h3 className={`text-2xl font-bold text-gray-800 mb-4 text-center ${dir === 'rtl' ? 'text-right' : ''}`}>
                    Eye Cell Treatment - Eye zone treatment with Eye Roller 0.25mm
                  </h3>
                  <p className={`text-gray-600 mb-6 ${dir === 'rtl' ? 'text-right' : ''}`}>
                    تدريب متخصص على علاج Eye Cell باستخدام Eye Roller 0.25mm لعلاجات منطقة العين الدقيقة. يغطي هذا الدرس التفصيلي تقنيات الأسطوانة الصحيحة وبروتوكولات سلامة منطقة العين وتحقيق النتائج المثلى لمنطقة العين الحساسة.
                  </p>
                  
                  <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                    <iframe
                      className="absolute top-0 left-0 w-full h-full rounded-lg"
                      src="https://www.youtube.com/embed/zTOnPRnMy8k"
                      title="Eye Cell Treatment - Eye zone treatment with Eye Roller 0.25mm Training"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    ></iframe>
                  </div>
                  
                  <div className={`mt-6 grid md:grid-cols-2 gap-6 ${dir === 'rtl' ? 'text-right' : ''}`}>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">{t('training.whatYoullLearn')}</h4>
                      <ul className="text-gray-600 space-y-1">
                        <li>• تقنيات تطبيق Eye Roller 0.25mm</li>
                        <li>• بروتوكولات علاج منطقة العين</li>
                        <li>• إجراءات السلامة لمنطقة العين الحساسة</li>
                        <li>• ضغط الأسطوانة والحركة الصحيحة</li>
                        <li>• العناية بعد العلاج لمنطقة العين</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">{t('training.lessonDetails')}</h4>
                      <ul className="text-gray-600 space-y-1">
                        <li>• {t('training.duration')} 14-18 {locale === 'ar' ? 'دقيقة' : 'minutes'}</li>
                        <li>• {t('training.level')}: {t('training.professional')}</li>
                        <li>• {t('training.category')}: {t('training.eyeTreatments')}</li>
                        <li>• {t('training.certification')}: {t('training.availableUponCompletion')}</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Genosys HAIRGEN BOOSTER Treatment Lesson */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-6">
                  <h3 className={`text-2xl font-bold text-gray-800 mb-4 text-center ${dir === 'rtl' ? 'text-right' : ''}`}>
                    Genosys HAIRGEN BOOSTER Treatment
                  </h3>
                  <p className={`text-gray-600 mb-6 ${dir === 'rtl' ? 'text-right' : ''}`}>
                    أتقن تقنيات علاج الشعر المتقدمة باستخدام تقنية Genosys HAIRGEN BOOSTER. يغطي هذا التدريب الشامل بروتوكولات استعادة الشعر وطرق تحضير فروة الرأس وتحقيق النتائج المثلى لنمو الشعر وتعزيزه.
                  </p>
                  
                  <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                    <iframe
                      className="absolute top-0 left-0 w-full h-full rounded-lg"
                      src="https://www.youtube.com/embed/dsS-d8HahQA"
                      title="Genosys HAIRGEN BOOSTER Treatment Training"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    ></iframe>
                  </div>
                  
                  <div className={`mt-6 grid md:grid-cols-2 gap-6 ${dir === 'rtl' ? 'text-right' : ''}`}>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">{t('training.whatYoullLearn')}</h4>
                      <ul className="text-gray-600 space-y-1">
                        <li>• بروتوكولات علاج الشعر المتقدمة</li>
                        <li>• تقنيات تحضير وتقييم فروة الرأس</li>
                        <li>• طرق تطبيق HAIRGEN BOOSTER</li>
                        <li>• إجراءات تحفيز نمو الشعر</li>
                        <li>• تخصيص العلاج لأنواع الشعر المختلفة</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">{t('training.lessonDetails')}</h4>
                      <ul className="text-gray-600 space-y-1">
                        <li>• {t('training.duration')} 20-25 {locale === 'ar' ? 'دقيقة' : 'minutes'}</li>
                        <li>• {t('training.level')}: {t('training.advancedProfessional')}</li>
                        <li>• {t('training.category')}: {t('training.hairTreatments')}</li>
                        <li>• {t('training.certification')}: {t('training.availableUponCompletion')}</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* HR3 MATRIX Anti Hair Loss Treatment Lesson */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-6">
                  <h3 className={`text-2xl font-bold text-gray-800 mb-4 text-center ${dir === 'rtl' ? 'text-right' : ''}`}>
                    HR3 MATRIX Anti Hair Loss Treatment
                  </h3>
                  <p className={`text-gray-600 mb-6 ${dir === 'rtl' ? 'text-right' : ''}`}>
                    تعلم التقنيات المتخصصة لعلاج تساقط الشعر باستخدام تقنية HR3 MATRIX. يغطي هذا التدريب المتقدم بروتوكولات مكافحة تساقط الشعر وطرق علاج فروة الرأس وتحقيق النتائج المثلى لاستعادة الشعر ومنع المزيد من التساقط.
                  </p>
                  
                  <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                    <iframe
                      className="absolute top-0 left-0 w-full h-full rounded-lg"
                      src="https://www.youtube.com/embed/XwOIRrizmF4"
                      title="HR3 MATRIX Anti Hair Loss Treatment Training"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    ></iframe>
                  </div>
                  
                  <div className={`mt-6 grid md:grid-cols-2 gap-6 ${dir === 'rtl' ? 'text-right' : ''}`}>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">{t('training.whatYoullLearn')}</h4>
                      <ul className="text-gray-600 space-y-1">
                        <li>• بروتوكولات علاج مكافحة تساقط الشعر</li>
                        <li>• تقنيات تطبيق HR3 MATRIX</li>
                        <li>• طرق تقييم وتحضير فروة الرأس</li>
                        <li>• استراتيجيات منع تساقط الشعر</li>
                        <li>• تخصيص العلاج لأنواع تساقط الشعر المختلفة</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">{t('training.lessonDetails')}</h4>
                      <ul className="text-gray-600 space-y-1">
                        <li>• {t('training.duration')} 18-22 {locale === 'ar' ? 'دقيقة' : 'minutes'}</li>
                        <li>• {t('training.level')}: {t('training.advancedProfessional')}</li>
                        <li>• {t('training.category')}: {t('training.hairLossTreatments')}</li>
                        <li>• {t('training.certification')}: {t('training.availableUponCompletion')}</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Placeholder for future lessons - hidden on mobile */}
              <div className="hidden md:block bg-gray-50 rounded-lg p-8 text-center">
                <h3 className={`text-xl font-semibold text-gray-600 mb-2 ${dir === 'rtl' ? 'text-right' : ''}`}>
                  {t('training.moreLessonsComingSoon')}
                </h3>
                <p className={`text-gray-500 ${dir === 'rtl' ? 'text-right' : ''}`}>
                  {t('training.checkBackRegularly')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

