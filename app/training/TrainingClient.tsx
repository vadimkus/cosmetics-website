'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Download, FileText, Play, ChevronLeft } from 'lucide-react'
import PDFDownloadButton from '@/components/PDFDownloadButton'
import { usePWAMode } from '@/hooks/usePWAMode'
import { useTranslation } from '@/hooks/useTranslation'
import { useAuth } from '@/components/auth/AuthProvider'
import { useRouter } from 'next/navigation'

// Training documents data
const trainingDocuments = [
  {
    id: 'product-catalogue',
    title: 'Product Catalogue 2026',
    size: '39.9 MB',
    href: '/documents/GENOSYS%20Catalogue_2026.pdf',
    type: 'training'
  },
  {
    id: 'home-care-guide',
    title: 'Home Care Guide 2026',
    size: '9.8 MB',
    href: 'https://genosys.ae/documents/Genosys-Home-Care-Guide.pdf',
    type: 'training'
  },
  {
    id: 'professional-manual',
    title: 'Professional Manual 2026',
    size: '10.4 MB',
    href: 'https://genosys.ae/documents/Genosys-Professional-Manual.pdf',
    type: 'training'
  },
  {
    id: 'facial-treatment-homecare',
    title: 'Facial Treatment Homecare 2026',
    size: '8.2 MB',
    href: '/documents/PPT/GENOSYS%20FACIAL%20TREATMENT_Homecare_2025.pdf',
    type: 'training'
  },
  {
    id: 'facial-treatment-pro',
    title: 'Facial Treatment Professional 2026',
    size: '8.2 MB',
    href: '/documents/PPT/GENOSYS%20FACIAL%20TREATMENT_Professional_2025.pdf',
    type: 'training'
  },
  {
    id: 'korean-glass-skin',
    title: 'Korean Glass Skin GENOSYS',
    size: '10 MB',
    href: '/documents/PPT/Achieve%20Korean%20Glass%20Skin%20with%20GENOSYS%20approach_F.pdf',
    type: 'training'
  },
  {
    id: 'bio-meso-pdrn',
    title: 'Bio-Meso PDRN Expert Guide',
    size: '8.9 MB',
    href: '/documents/PPT/Bio-Meso%20PDRN%20Expert_Treatment%20guide_for%20print_S.pdf',
    type: 'training'
  },
  {
    id: 'microneedling-protocols',
    title: 'Microneedling Protocols (Carboxy + Power Solutions)',
    size: '1.2 MB',
    href: '/documents/PPT/GENOSYS_Microneedling_Protocols.pdf',
    type: 'training'
  }
]

// Product documentation data
const productDocuments = [
  { id: 'cerabarrier-cleanser', title: 'CERABARRIER BIOME GEL CLEANSER', size: '1.4 MB', href: '/documents/PPT/GENOSYS%20CERABARRIER%20BIOME%20GEL%20CLEANSER.pdf', image: '/images/cera/main.jpeg', productId: '66' },
  { id: 'radiance-cream', title: 'MULTI VITA RADIANCE CREAM', size: '2.1 MB', href: '/documents/PPT/GENOSYS%20MULTI%20VITA%20RADIANCE%20CREAM.pdf', image: '/images/radiance/main.jpeg', productId: '31' },
  { id: 'eyecell-zone', title: 'EyeCell EYE ZONE CARE SYSTEM', size: '1.8 MB', href: '/documents/PPT/GENOSYS%20EyeCell%20EYE%20ZONE%20CARE%20SYSTEM.pdf', image: '/images/eye_kit/main.jpeg', productId: '50' },
  { id: 'epi-peeling', title: 'EPI TURNOVER BOOSTING PEELING GEL', size: '3.8 MB', href: '/documents/PPT/GENOSYS%20EPI%20TURNOVER%20BOOSTING%20PEELING%20GEL.pdf', image: '/images/epi/main.jpeg', productId: '12' },
  { id: 'radiance-serum', title: 'MULTI VITA RADIANCE SERUM', size: '1.5 MB', href: '/documents/PPT/GENOSYS%20MULTI%20VITA%20RADIANCE%20SERUM.pdf', image: '/images/radiance_serum/main.jpeg', productId: '21' },
  { id: 'skin-defender', title: 'SKIN DEFENDER LIP & EYE MAKEUP REMOVER', size: '0.7 MB', href: '/documents/PPT/GENOSYS%20SKIN%20DEFENDER%20LIP%20%26%20EYE%20MAKEUP%20REMOVER.pdf', image: '/images/remover/Main2.jpg', productId: '11' },
  { id: 'microbiome-mist', title: 'MICROBIOME ENERGY INFUSING MIST', size: '0.8 MB', href: '/documents/PPT/GENOSYS%20MICROBIOME%20ENERGY%20INFUSING%20MIST.pdf', image: '/images/mist/main2.jpeg', productId: '14' },
  { id: 'skin-rescue', title: 'SKIN RESCUE OVERNIGHT CREAM MASK', size: '1.3 MB', href: '/documents/PPT/GENOSYS%20SKIN%20RESCUE%20OVERNIGHT%20CREAM%20MASK.pdf', image: '/images/overnight/main.jpeg', productId: '34' },
  { id: 'problem-toner', title: 'INTENSIVE PROBLEM CONTROL TONER', size: '1.0 MB', href: '/documents/PPT/GENOSYS%20INTENSIVE%20PROBLEM%20CONTROL%20TONER.pdf', image: '/images/problem/Main.jpg', productId: '15' },
  { id: 'problem-serum', title: 'PROBLEM CONTROL SERUM', size: '2.2 MB', href: '/documents/PPT/GENOSYS%20INTENSIVE%20PROBLEM%20CONTROL%20SERUM.pdf', image: '/images/problems_serum/main.jpeg', productId: '20' },
  { id: 'sun-cream', title: 'ULTRA SHIELD SUN CREAM', size: '0.6 MB', href: '/documents/PPT/GENOSYS%20ULTRA%20SHIELD%20SUN%20CREAM.pdf', image: '/images/ultra/main.jpeg', productId: '39' },
  { id: 'scalp-shampoo', title: 'HR³ MATRIX SCALP SHAMPOO α', size: '2.3 MB', href: '/documents/PPT/GENOSYS%20HR3%20MATRIX%20SCALP%20SHAMPOO%20ALPHA.pdf', image: '/images/Sham.jpg', productId: '44' },
  { id: 'hyaluron-serum', title: 'MOISTURE REPLENISHING HYALURON SERUM', size: '1.9 MB', href: '/documents/PPT/GENOSYS%20MOISTURE%20REPLENISHING%20HYALURON%20SERUM.pdf', image: '/images/hyaluron_serum/main.jpeg', productId: '18' },
  { id: 'hyaluron-cream', title: 'MOISTURE REPLENISHING HYALURON CREAM', size: '2.0 MB', href: '/documents/PPT/GENOSYS%20MOISTURE%20REPLENISHING%20HYALURON%20CREAM.pdf', image: '/images/hyaluron/main.jpeg', productId: '29' },
  { id: 'bb-cushion', title: 'SKIN CARING BLEMISH BALM CUSHION', size: '1.2 MB', href: '/documents/PPT/GENOSYS%20SKIN%20CARING%20BLEMISH%20BALM%20CUSHION.pdf', image: '/images/cushion_2/main.jpeg', productId: '41' },
  { id: 'revita-glow-bb', title: 'REVITA GLOW BLEMISH BALM CREAM', size: '2.0 MB', href: '/documents/PPT/GENOSYS_REVITA_GLOW_BB_CREAM.pdf', image: '/images/revita/main.jpg', productId: '63' },
  { id: 'eye-patch', title: 'EyeCell EYE PEPTIDE GEL PATCH', size: '1.4 MB', href: '/documents/PPT/GENOSYS%20EyeCell%20EYE%20PEPTIDE%20GEL%20PATCH.pdf', image: '/images/patch/main.jpeg', productId: '33' },
  { id: 'bio-ferment', title: 'BIO-FERMENT AGE DEFYING POWDER MASK', size: '2.1 MB', href: '/documents/PPT/GENOSYS%20BIO-FERMENT%20AGE%20DEFYING%20POWDER%20MASK.pdf', image: '/images/BFAD.png', productId: '51' },
  { id: 'hair-gentron', title: 'HAIR GENTRON', size: '1.8 MB', href: '/documents/PPT/HAIR%20GENTRON.pdf', image: '/images/gen.jpg', productId: '48' },
  { id: 'hair-solution', title: 'HR³ MATRIX HAIR SOLUTION α', size: '2.3 MB', href: '/documents/PPT/GENOSYS%20HR3%20MATRIX%20HAIR%20SOLUTION%20ALPHA.pdf', image: '/images/HHR.jpg', productId: '45' },
  { id: 'hair-tonic', title: 'HR³ MATRIX HAIR TONIC α', size: '1.9 MB', href: '/documents/PPT/GENOSYS%20HR3%20MATRIX%20HAIR%20TONIC%20ALPHA.pdf', image: '/images/hair_tonic/main-v2.jpeg', productId: '43' },
  { id: 'scalp-peeling', title: 'HR³ MATRIX SCALP PEELING α', size: '2.1 MB', href: '/documents/PPT/GENOSYS%20HR3%20MATRIX%20SCALP%20PEELING%20ALPHA.pdf', image: '/images/scal.jpg', productId: '46' },
  { id: 'scalp-brush', title: 'HR³ MATRIX SCALP BRUSH', size: '0.4 MB', href: '/documents/PPT/GENOSYS%20HR3%20MATRIX%20SCALP%20BRUSH.pdf', image: '/images/Second/brush.jpg', productId: '61' },
  { id: 'geno-led', title: 'GENO-LED IR II', size: '4.6 MB', href: '/documents/PPT/GENO-LED%20IR%20II_2025.pdf', image: '/images/LEDD.jpg', productId: '49' },
  { id: 'pdrn-mask', title: 'SKIN REBOOT PDRN MASK PACK', size: '1.2 MB', href: '/documents/PPT/GENOSYS%20SKIN%20REBOOT%20PDRN%20MASK%20PACK.pdf', image: '/images/PDRN.png', productId: '52' },
  { id: 'co2-mask', title: 'EZ CO₂ MASK KIT', size: '0.5 MB', href: '/documents/PPT/Genosys%20Ez%20Co2%20Mask.pdf', image: '/images/EZE.jpg', productId: '38' },
  { id: 'microneedle', title: 'Microneedle Roller', size: '1.5 MB', href: '/documents/PPT/Overview%20of%20Microneedling_S.pdf', image: '/images/genosys-microneedling-devices.jpg', productId: '1' },
]

// Training videos data
const trainingVideos = [
  {
    id: 'bodycell-stretch-mark',
    title: 'Genosys Bodycell Stretch Mark Treatment',
    youtubeId: 'SvjziVjhb8s',
    duration: '15-20 min',
    level: 'Professional'
  },
  {
    id: 'ndcell-neck',
    title: 'Genosys NDcell Neck & Decollete Treatment',
    youtubeId: 'm07q2XRt_OM',
    duration: '18-22 min',
    level: 'Advanced Professional'
  },
  {
    id: 'eyecell-treatment',
    title: 'Genosys EyeCell Treatment',
    youtubeId: 'xH58EZtykZE',
    duration: '16-20 min',
    level: 'Advanced Professional'
  },
  {
    id: 'hr3-matrix',
    title: 'Genosys HR3 Matrix Treatment',
    youtubeId: 'qQRcEvd3Ks4',
    duration: '20-25 min',
    level: 'Advanced Professional'
  },
  {
    id: 'facial-treatment',
    title: 'Facial Treatment',
    youtubeId: 'hMtodh45sME',
    duration: '25-30 min',
    level: 'Professional'
  },
  {
    id: 'ez-co2-mask',
    title: 'How to Use GENOSYS EZ CO₂ Mask Kit',
    youtubeId: 'ZOYtKGNrWJM',
    duration: '1-2 min',
    level: 'Professional'
  }
]

export default function TrainingClient() {
  const { isPWA, isClient } = usePWAMode()
  const { t, locale, dir } = useTranslation()
  const { user } = useAuth()
  const router = useRouter()
  const isRTL = dir === 'rtl'
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
  
  const isAppLikeMode = (isPWA && isClient) || isMobileWeb

  // User initial for profile icon
  const userInitial = user?.name?.charAt(0) || user?.email?.charAt(0) || 'G'

  // Profile icon click handler
  const handleProfileClick = () => {
    const localePath = locale === 'en' ? '' : `/${locale}`
    router.push(`${localePath}/profile`)
  }

  // Back click handler
  const handleBackClick = () => {
    const localePath = locale === 'en' ? '' : `/${locale}`
    router.push(`${localePath}/products`)
  }

  return (
    <div className={`bg-white min-h-screen ${isAppLikeMode ? 'pb-24' : ''}`}>
      {/* PWA / Mobile Web Light Header */}
      {isAppLikeMode && (
        <div className="sticky top-0 z-50 bg-white border-b border-gray-100 px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Back button */}
            <button
              onClick={handleBackClick}
              className={`flex items-center gap-1 text-gray-600 hover:text-gray-900 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}
            >
              <ChevronLeft className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
              <span className="text-sm font-medium">{t('common.products') || 'Products'}</span>
            </button>
            
            {/* Title */}
            <h1 className="text-base font-semibold text-gray-900">
              {t('training.title') || 'Training'}
            </h1>
            
            {/* Profile icon */}
            <button
              onClick={handleProfileClick}
              className="relative"
            >
              <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white text-sm font-semibold">
                {userInitial}
              </div>
              {/* Green online dot */}
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-[1.5px] border-white" />
            </button>
          </div>
        </div>
      )}

      <div className="container mx-auto px-3 md:px-4 py-4 md:py-16">
        <div className="max-w-4xl lg:max-w-6xl mx-auto">
          {/* Non-PWA/Mobile Navigation */}
          {!isAppLikeMode && (
            <>
              <nav className="text-xs md:text-base text-gray-600 mb-2 md:mb-4" aria-label="Breadcrumb">
                <Link href="/" className="hover:text-primary-600 transition-colors">{t('training.home')}</Link>
                <span> / </span>
                <span className="text-gray-900 font-medium">{t('training.trainingDocuments')}</span>
              </nav>

              <Link href="/" className="inline-flex items-center gap-1 text-xs md:text-sm text-primary-600 hover:text-primary-700 mb-4 md:mb-8">
                <ArrowLeft className="h-3 w-3 md:h-4 md:w-4" />
                <span>{t('training.backToHome')}</span>
              </Link>

              {/* Desktop hero */}
              <div className="hidden md:block text-center mb-10 lg:mb-14">
                <Image
                  src="/images/genosys-logo.png"
                  alt="Genosys Professional Training"
                  width={400}
                  height={200}
                  className="object-contain w-52 lg:w-60 mx-auto mb-5"
                  priority
                />
                <p className="text-xs font-semibold tracking-[0.2em] text-primary-600 uppercase mb-3">
                  {t('training.professionalTraining') || 'Training Library'}
                </p>
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-3 tracking-tight">
                  {t('training.documents') || 'Training Documents'}
                </h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Protocols, product sheets, and video lessons for GENOSYS partners.
                </p>

                <dl className="grid grid-cols-3 gap-px mt-10 bg-gray-200 border border-gray-200 rounded-2xl overflow-hidden max-w-3xl mx-auto">
                  <div className="bg-white px-5 py-5 text-center">
                    <dt className="text-[11px] font-semibold tracking-wider text-gray-500 uppercase">Guides</dt>
                    <dd className="mt-1 text-xl lg:text-2xl font-bold text-gray-900">{trainingDocuments.length}</dd>
                  </div>
                  <div className="bg-white px-5 py-5 text-center">
                    <dt className="text-[11px] font-semibold tracking-wider text-gray-500 uppercase">Product sheets</dt>
                    <dd className="mt-1 text-xl lg:text-2xl font-bold text-gray-900">{productDocuments.length}</dd>
                  </div>
                  <div className="bg-white px-5 py-5 text-center">
                    <dt className="text-[11px] font-semibold tracking-wider text-gray-500 uppercase">Videos</dt>
                    <dd className="mt-1 text-xl lg:text-2xl font-bold text-gray-900">{trainingVideos.length}</dd>
                  </div>
                </dl>
              </div>
            </>
          )}

          {/* Training Documents Section */}
          <div className="bg-white border border-gray-200 rounded-lg md:rounded-2xl shadow-sm md:shadow-md mb-6 md:mb-10">
            <div className="p-3 md:p-8">
              <div className="mb-3 md:mb-6 flex items-center justify-center md:justify-start gap-1.5 md:gap-3">
                <div className="w-6 h-6 md:w-10 md:h-10 bg-emerald-50 rounded-md md:rounded-xl flex items-center justify-center flex-shrink-0">
                  <FileText className="w-3 h-3 md:w-5 md:h-5 text-emerald-600" aria-hidden="true" />
                </div>
                <h3 className="text-sm md:text-xl font-semibold text-gray-900">
                  {t('training.documents') || 'Training Documents'}
                </h3>
                <span className="hidden md:inline-flex text-xs font-medium text-gray-500 bg-gray-100 rounded-full px-2.5 py-1 ml-1">
                  {trainingDocuments.length}
                </span>
              </div>

              <div className="space-y-1.5 md:space-y-0 md:grid md:grid-cols-2 md:gap-3">
                {trainingDocuments.map((doc) => (
                  <div
                    key={doc.id}
                    className="group border border-gray-200 rounded-md md:rounded-xl p-2 md:p-4 hover:border-emerald-300 hover:shadow-md transition-all duration-200 bg-white"
                  >
                    <div className="flex items-center gap-2 md:gap-3">
                      <div className="hidden md:flex w-11 h-11 bg-emerald-50 rounded-lg items-center justify-center overflow-hidden flex-shrink-0 group-hover:bg-emerald-100 transition-colors">
                        <FileText className="h-5 w-5 text-emerald-600" aria-hidden="true" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs md:text-sm font-semibold text-gray-900 truncate">{doc.title}</h4>
                        <p className="text-[10px] md:text-xs text-gray-400">{doc.size}</p>
                      </div>
                      <PDFDownloadButton
                        href={doc.href}
                        filename={doc.title}
                        external={true}
                        className="inline-flex items-center px-2 md:px-3 py-1 md:py-2 bg-emerald-600 text-white rounded-md md:rounded-lg hover:bg-emerald-700 transition-colors text-[10px] md:text-xs font-semibold flex-shrink-0"
                      >
                        <Download className="h-2.5 w-2.5 md:h-3.5 md:w-3.5 mr-0.5 md:mr-1.5" aria-hidden="true" />
                        {isPWA ? t('common.view') || 'View' : 'PDF'}
                      </PDFDownloadButton>
                    </div>
                  </div>
                ))}
              </div>

              {/* Product Documentation Section */}
              <div className="mt-6 md:mt-10">
                <div className="mb-3 md:mb-6 flex items-center justify-center md:justify-start gap-1.5 md:gap-3">
                  <div className="w-6 h-6 md:w-10 md:h-10 bg-red-50 rounded-md md:rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 md:w-5 md:h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                  </div>
                  <h3 className="text-sm md:text-xl font-semibold text-gray-900">
                    {t('training.productDocumentation') || 'Product Documentation'}
                  </h3>
                  <span className="hidden md:inline-flex text-xs font-medium text-gray-500 bg-gray-100 rounded-full px-2.5 py-1 ml-1">
                    {productDocuments.length}
                  </span>
                </div>
                <div className="space-y-1.5 md:space-y-0 md:grid md:grid-cols-2 md:gap-3">
                  {productDocuments.map((doc) => (
                    <div
                      key={doc.id}
                      className="group border border-gray-200 rounded-md md:rounded-xl p-2 md:p-4 hover:border-red-300 hover:shadow-md transition-all duration-200 bg-white"
                    >
                      <div className="flex items-center gap-2 md:gap-3">
                        <div className="w-8 h-8 md:w-12 md:h-12 bg-gray-100 rounded-md md:rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                          <Link href={`/products/${doc.productId}`} aria-label={doc.title}>
                            <Image
                              src={doc.image}
                              alt={doc.title}
                              width={48}
                              height={48}
                              className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                            />
                          </Link>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs md:text-sm font-semibold text-gray-900 truncate">{doc.title}</h4>
                          <p className="text-[10px] md:text-xs text-gray-400">{doc.size}</p>
                        </div>
                        <PDFDownloadButton
                          href={doc.href}
                          filename={doc.title}
                          external={true}
                          className="inline-flex items-center px-2 md:px-3 py-1 md:py-2 bg-primary-600 text-white rounded-md md:rounded-lg hover:bg-primary-700 transition-colors text-[10px] md:text-xs font-semibold flex-shrink-0"
                        >
                          <Download className="h-2.5 w-2.5 md:h-3.5 md:w-3.5 mr-0.5 md:mr-1.5" aria-hidden="true" />
                          {isPWA ? t('common.view') || 'View' : 'PDF'}
                        </PDFDownloadButton>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Training Videos Section */}
          <div className="mt-6 md:mt-16">
            <div className="mb-3 md:mb-8 flex items-center justify-center md:justify-start gap-1.5 md:gap-3">
              <div className="w-6 h-6 md:w-10 md:h-10 bg-red-50 rounded-md md:rounded-xl flex items-center justify-center flex-shrink-0">
                <Play className="w-3 h-3 md:w-5 md:h-5 text-red-600" aria-hidden="true" />
              </div>
              <h3 className="text-sm md:text-xl font-semibold text-gray-900">
                {t('training.videos') || 'Training Videos'}
              </h3>
              <span className="hidden md:inline-flex text-xs font-medium text-gray-500 bg-gray-100 rounded-full px-2.5 py-1 ml-1">
                {trainingVideos.length}
              </span>
            </div>

            <div className="grid gap-4 md:gap-8 md:grid-cols-2">
              {trainingVideos.map((video) => (
                <div
                  key={video.id}
                  className="bg-white rounded-lg md:rounded-2xl shadow-md md:shadow-lg overflow-hidden border border-gray-100"
                >
                  <div className="p-3 md:p-5">
                    <h3 className="text-sm md:text-base lg:text-lg font-semibold text-gray-900 mb-2 md:mb-3">
                      {video.title}
                    </h3>

                    {/* Video Container */}
                    <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                      <iframe
                        className="absolute top-0 left-0 w-full h-full rounded-lg"
                        src={`https://www.youtube.com/embed/${video.youtubeId}`}
                        title={video.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      />
                    </div>

                    {/* Video meta — visible on desktop as pills */}
                    <div className="hidden md:flex mt-4 items-center gap-2 text-xs">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 text-gray-700 rounded-full font-medium">
                        {video.duration}
                      </span>
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-50 text-red-700 rounded-full font-medium">
                        {video.level}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {/* Coming Soon placeholder - hidden on mobile */}
              <div className="hidden md:block bg-gray-50 rounded-2xl p-8 text-center border border-dashed border-gray-300 flex flex-col justify-center">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  More lessons coming soon
                </h3>
                <p className="text-sm text-gray-500">
                  We&apos;re continuously adding new training content. Check back regularly for updates.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

