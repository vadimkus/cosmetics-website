'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Download, FileText, Play, ChevronLeft } from 'lucide-react'
import PDFDownloadButton from '@/components/PDFDownloadButton'
import { usePWAMode } from '@/hooks/usePWAMode'
import { useTranslation } from '@/hooks/useTranslation'
import { useAuth } from '@/components/AuthProvider'
import { useRouter } from 'next/navigation'

// Training documents data
const trainingDocuments = [
  {
    id: 'product-catalogue',
    title: 'Product Catalogue 2026',
    size: '235.5 MB',
    href: 'https://u.pcloud.link/publink/show?code=XZ9wc15ZDTFcM6uvKg0snY1dEJwzwQgHsEF7',
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
    href: '/documents/ppt/GENOSYS%20FACIAL%20TREATMENT_Homecare_2025.pdf',
    type: 'training'
  },
  {
    id: 'facial-treatment-pro',
    title: 'Facial Treatment Professional 2026',
    size: '8.2 MB',
    href: '/documents/ppt/GENOSYS%20FACIAL%20TREATMENT_Professional_2025.pdf',
    type: 'training'
  },
  {
    id: 'korean-glass-skin',
    title: 'Korean Glass Skin GENOSYS',
    size: '10 MB',
    href: '/documents/ppt/Achieve%20Korean%20Glass%20Skin%20with%20GENOSYS%20approach_F.pdf',
    type: 'training'
  },
  {
    id: 'bio-meso-pdrn',
    title: 'Bio-Meso PDRN Expert Guide',
    size: '8.9 MB',
    href: '/documents/ppt/Bio-Meso%20PDRN%20Expert_Treatment%20guide_for%20print_S.pdf',
    type: 'training'
  }
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
  }
]

export default function TrainingClient() {
  const { isPWA, isClient } = usePWAMode()
  const { t, locale, dir } = useTranslation()
  const { user } = useAuth()
  const router = useRouter()
  const isRTL = dir === 'rtl'

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
    <div className={`bg-white min-h-screen ${isPWA ? 'pb-24' : ''}`}>
      {/* PWA Light Header */}
      {isPWA && isClient && (
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
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
            </button>
          </div>
        </div>
      )}

      <div className="container mx-auto px-3 md:px-4 py-4 md:py-16">
        <div className="max-w-4xl mx-auto">
          {/* Non-PWA Navigation */}
          {!isPWA && (
            <>
              <nav className="text-xs md:text-base text-gray-600 mb-2 md:mb-4" aria-label="Breadcrumb">
                <Link href="/" className="hover:text-primary-600 transition-colors">Home</Link>
                <span> / </span>
                <span className="text-gray-900 font-medium">Training</span>
              </nav>
              
              <Link href="/" className="inline-flex items-center gap-1 text-xs md:text-sm text-primary-600 hover:text-primary-700 mb-4 md:mb-8">
                <ArrowLeft className="h-3 w-3 md:h-4 md:w-4" />
                <span>Back to Home</span>
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
            </>
          )}

          {/* Training Documents Section */}
          <div className="bg-white border border-gray-200 rounded-lg md:rounded-xl shadow-sm mb-6 md:mb-12">
            <div className="p-3 md:p-8">
              <h3 className="text-sm md:text-xl font-semibold text-gray-800 mb-3 md:mb-6 flex items-center justify-center gap-1.5 md:gap-2">
                <div className="w-6 h-6 md:w-8 md:h-8 bg-green-100 rounded-md md:rounded-lg flex items-center justify-center">
                  <FileText className="w-3 h-3 md:w-4 md:h-4 text-green-600" />
                </div>
                {t('training.documents') || 'Training Documents'}
              </h3>
              
              <div className="space-y-1.5 md:space-y-2">
                {trainingDocuments.map((doc) => (
                  <div 
                    key={doc.id}
                    className="group border border-gray-200 rounded-md md:rounded-lg p-2 md:p-3 hover:border-green-300 hover:shadow-lg transition-all duration-200"
                  >
                    <div className="flex items-center gap-2 md:gap-3">
                      <div className="hidden md:flex w-10 h-10 bg-green-50 rounded-lg items-center justify-center overflow-hidden flex-shrink-0 group-hover:bg-green-100 transition-colors">
                        <Download className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs md:text-sm font-semibold text-gray-900 truncate">{doc.title}</h4>
                        <p className="text-[10px] md:text-xs text-gray-400">{doc.size}</p>
                      </div>
                      <PDFDownloadButton
                        href={doc.href}
                        filename={doc.title}
                        external={true}
                        className="inline-flex items-center px-2 md:px-3 py-1 md:py-1.5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-md hover:from-green-700 hover:to-green-800 transition-colors text-[10px] md:text-xs font-medium flex-shrink-0"
                      >
                        <Download className="h-2.5 w-2.5 md:h-3 md:w-3 mr-0.5 md:mr-1" />
                        {isPWA ? t('common.view') || 'View' : 'PDF'}
                      </PDFDownloadButton>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Training Videos Section */}
          <div className="mt-6 md:mt-16">
            <h3 className="text-sm md:text-xl font-semibold text-gray-800 mb-3 md:mb-6 flex items-center justify-center gap-1.5 md:gap-2">
              <div className="w-6 h-6 md:w-8 md:h-8 bg-red-100 rounded-md md:rounded-lg flex items-center justify-center">
                <Play className="w-3 h-3 md:w-4 md:h-4 text-red-600" />
              </div>
              {t('training.videos') || 'Training Videos'}
            </h3>
            
            <div className="grid gap-4 md:gap-8">
              {trainingVideos.map((video) => (
                <div 
                  key={video.id}
                  className="bg-white rounded-lg shadow-md md:shadow-lg overflow-hidden"
                >
                  <div className="p-3 md:p-6">
                    <h3 className="text-sm md:text-2xl font-bold text-gray-800 mb-2 md:mb-4 text-center">
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
                    
                    {/* Video details - hidden on mobile */}
                    <div className="hidden md:flex mt-4 justify-center gap-6 text-sm text-gray-500">
                      <span>Duration: {video.duration}</span>
                      <span>Level: {video.level}</span>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Coming Soon placeholder - hidden on mobile */}
              <div className="hidden md:block bg-gray-50 rounded-lg p-8 text-center">
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  More Training Lessons Coming Soon
                </h3>
                <p className="text-base text-gray-500">
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

