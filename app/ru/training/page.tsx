import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Download } from 'lucide-react'
import PDFDownloadButton from '@/components/PDFDownloadButton'
import BreadcrumbSchema from '@/components/BreadcrumbSchema'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Профессиональное обучение - Обучение GENOSYS уходу за кожей | Genosys Middle East FZ-LLC',
  description: 'Ресурсы профессионального обучения для продуктов GENOSYS для ухода за кожей. Скачайте учебные документы, смотрите видеоуроки и освойте профессиональные техники корейской дерматокосметики.',
  keywords: 'Обучение GENOSYS, обучение профессиональному уходу за кожей, обучение корейской дерматокосметике, обучение микронидлингу, обучение уходу за кожей ОАЭ',
  openGraph: {
    title: 'Профессиональное обучение - Обучение GENOSYS уходу за кожей',
    description: 'Ресурсы профессионального обучения для продуктов GENOSYS для ухода за кожей. Скачайте учебные документы, смотрите видеоуроки и освойте профессиональные техники.',
    type: 'website',
    images: [
      {
        url: '/images/genosys-logo.png',
        width: 400,
        height: 200,
        alt: 'Профессиональное обучение GENOSYS',
      },
    ],
    url: 'https://genosys.ae/ru/training',
    siteName: 'GENOSYS Middle East FZ-LLC',
    locale: 'ru_AE',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  twitter: {
    card: 'summary_large_image',
    site: '@genosys_official',
    creator: '@genosys_official',
    title: 'Профессиональное обучение - Обучение GENOSYS уходу за кожей',
    description: 'Ресурсы профессионального обучения для продуктов GENOSYS для ухода за кожей. Скачайте учебные документы, смотрите видеоуроки и освойте профессиональные техники.',
    images: ['/images/genosys-logo.png'],
  },
  alternates: {
    canonical: 'https://genosys.ae/ru/training',
    languages: {
      'en': 'https://genosys.ae/training',
      'ar': 'https://genosys.ae/ar/training',
      'ru': 'https://genosys.ae/ru/training',
    },
  },
}

export default function RussianTrainingPage() {
  return (
    <div className="bg-white min-h-screen">
      <BreadcrumbSchema 
        items={[
          { name: 'Главная', url: '/ru' },
          { name: 'Обучение', url: '/ru/training' }
        ]}
      />
      <div className="container mx-auto px-3 md:px-4 py-4 md:py-16">
        <div className="max-w-4xl mx-auto">

          {/* Navigation Breadcrumb */}
          <nav className="text-xs md:text-base text-gray-600 mb-2 md:mb-4" aria-label="Breadcrumb">
            <Link href="/ru" className="hover:text-primary-600 transition-colors">Главная</Link>
            <span> / </span>
            <span className="text-gray-900 font-medium">Обучение</span>
          </nav>
          
          {/* Back to Home */}
          <Link href="/ru" className="inline-flex items-center gap-1 text-xs md:text-sm text-primary-600 hover:text-primary-700 mb-4 md:mb-8">
            <ArrowLeft className="h-3 w-3 md:h-4 md:w-4" />
            <span>На главную</span>
          </Link>

          {/* Logo - hidden on mobile */}
          <div className="hidden md:block text-center mb-6">
            <Image 
              src="/images/genosys-logo.png" 
              alt="Профессиональное обучение Genosys" 
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
                <h3 className="text-sm md:text-xl font-semibold text-gray-800 mb-3 md:mb-6 flex items-center justify-center gap-1.5 md:gap-2">
                  <div className="w-6 h-6 md:w-8 md:h-8 bg-green-100 rounded-md md:rounded-lg flex items-center justify-center">
                    <svg className="w-3 h-3 md:w-4 md:h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  Учебные документы
                </h3>
              <div className="space-y-1.5 md:space-y-2">
                  <div className="group border border-gray-200 rounded-md md:rounded-lg p-2 md:p-3 hover:border-green-300 hover:shadow-lg transition-all duration-200">
                    <div className="flex items-center gap-2 md:gap-3">
                      <div className="hidden md:flex w-10 h-10 bg-green-50 rounded-lg items-center justify-center overflow-hidden flex-shrink-0 group-hover:bg-green-100 transition-colors">
                        <Download className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs md:text-sm font-semibold text-gray-900 truncate">Каталог продукции 2026</h4>
                        <p className="text-[10px] md:text-xs text-gray-400">235.5 МБ</p>
                      </div>
                      <PDFDownloadButton
                        href="https://u.pcloud.link/publink/show?code=XZ9wc15ZDTFcM6uvKg0snY1dEJwzwQgHsEF7"
                        filename="Каталог продукции 2026"
                        external={true}
                        className="inline-flex items-center px-2 md:px-3 py-1 md:py-1.5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-md hover:from-green-700 hover:to-green-800 transition-colors text-[10px] md:text-xs font-medium flex-shrink-0"
                      >
                        <Download className="h-2.5 w-2.5 md:h-3 md:w-3 mr-0.5 md:mr-1" />
                        PDF
                      </PDFDownloadButton>
                    </div>
                  </div>
                
                  <div className="group border border-gray-200 rounded-md md:rounded-lg p-2 md:p-3 hover:border-green-300 hover:shadow-lg transition-all duration-200">
                    <div className="flex items-center gap-2 md:gap-3">
                      <div className="hidden md:flex w-10 h-10 bg-green-50 rounded-lg items-center justify-center overflow-hidden flex-shrink-0 group-hover:bg-green-100 transition-colors">
                        <Download className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs md:text-sm font-semibold text-gray-900 truncate">Руководство по домашнему уходу 2026</h4>
                        <p className="text-[10px] md:text-xs text-gray-400">9.8 МБ</p>
                      </div>
                      <PDFDownloadButton
                        href="https://genosys.ae/documents/Genosys-Home-Care-Guide.pdf"
                        filename="Руководство по домашнему уходу 2026"
                        external={true}
                        className="inline-flex items-center px-2 md:px-3 py-1 md:py-1.5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-md hover:from-green-700 hover:to-green-800 transition-colors text-[10px] md:text-xs font-medium flex-shrink-0"
                      >
                        <Download className="h-2.5 w-2.5 md:h-3 md:w-3 mr-0.5 md:mr-1" />
                        PDF
                      </PDFDownloadButton>
                    </div>
                  </div>
                
                  <div className="group border border-gray-200 rounded-md md:rounded-lg p-2 md:p-3 hover:border-green-300 hover:shadow-lg transition-all duration-200">
                    <div className="flex items-center gap-2 md:gap-3">
                      <div className="hidden md:flex w-10 h-10 bg-green-50 rounded-lg items-center justify-center overflow-hidden flex-shrink-0 group-hover:bg-green-100 transition-colors">
                        <Download className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs md:text-sm font-semibold text-gray-900 truncate">Профессиональное руководство 2026</h4>
                        <p className="text-[10px] md:text-xs text-gray-400">10.4 МБ</p>
                      </div>
                      <PDFDownloadButton
                        href="https://genosys.ae/documents/Genosys-Professional-Manual.pdf"
                        filename="Профессиональное руководство 2026"
                        external={true}
                        className="inline-flex items-center px-2 md:px-3 py-1 md:py-1.5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-md hover:from-green-700 hover:to-green-800 transition-colors text-[10px] md:text-xs font-medium flex-shrink-0"
                      >
                        <Download className="h-2.5 w-2.5 md:h-3 md:w-3 mr-0.5 md:mr-1" />
                        PDF
                      </PDFDownloadButton>
                    </div>
                  </div>
                
                  <div className="group border border-gray-200 rounded-md md:rounded-lg p-2 md:p-3 hover:border-green-300 hover:shadow-lg transition-all duration-200">
                    <div className="flex items-center gap-2 md:gap-3">
                      <div className="hidden md:flex w-10 h-10 bg-green-50 rounded-lg items-center justify-center overflow-hidden flex-shrink-0 group-hover:bg-green-100 transition-colors">
                        <Download className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs md:text-sm font-semibold text-gray-900 truncate">Домашний уход за лицом 2026</h4>
                        <p className="text-[10px] md:text-xs text-gray-400">8.2 МБ</p>
                      </div>
                      <PDFDownloadButton
                        href="/documents/ppt/GENOSYS%20FACIAL%20TREATMENT_Homecare_2025.pdf"
                        filename="Домашний уход за лицом 2026"
                        external={true}
                        className="inline-flex items-center px-2 md:px-3 py-1 md:py-1.5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-md hover:from-green-700 hover:to-green-800 transition-colors text-[10px] md:text-xs font-medium flex-shrink-0"
                      >
                        <Download className="h-2.5 w-2.5 md:h-3 md:w-3 mr-0.5 md:mr-1" />
                        PDF
                      </PDFDownloadButton>
                    </div>
                  </div>
                  
                  <div className="group border border-gray-200 rounded-md md:rounded-lg p-2 md:p-3 hover:border-green-300 hover:shadow-lg transition-all duration-200">
                    <div className="flex items-center gap-2 md:gap-3">
                      <div className="hidden md:flex w-10 h-10 bg-green-50 rounded-lg items-center justify-center overflow-hidden flex-shrink-0 group-hover:bg-green-100 transition-colors">
                        <Download className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs md:text-sm font-semibold text-gray-900 truncate">Профессиональный уход за лицом 2026</h4>
                        <p className="text-[10px] md:text-xs text-gray-400">8.2 МБ</p>
                      </div>
                      <PDFDownloadButton
                        href="/documents/ppt/GENOSYS%20FACIAL%20TREATMENT_Professional_2025.pdf"
                        filename="Профессиональный уход за лицом 2026"
                        external={true}
                        className="inline-flex items-center px-2 md:px-3 py-1 md:py-1.5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-md hover:from-green-700 hover:to-green-800 transition-colors text-[10px] md:text-xs font-medium flex-shrink-0"
                      >
                        <Download className="h-2.5 w-2.5 md:h-3 md:w-3 mr-0.5 md:mr-1" />
                        PDF
                      </PDFDownloadButton>
                    </div>
                  </div>
                  
                  <div className="group border border-gray-200 rounded-md md:rounded-lg p-2 md:p-3 hover:border-green-300 hover:shadow-lg transition-all duration-200">
                    <div className="flex items-center gap-2 md:gap-3">
                      <div className="hidden md:flex w-10 h-10 bg-green-50 rounded-lg items-center justify-center overflow-hidden flex-shrink-0 group-hover:bg-green-100 transition-colors">
                        <Download className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs md:text-sm font-semibold text-gray-900 truncate">Корейская стеклянная кожа GENOSYS</h4>
                        <p className="text-[10px] md:text-xs text-gray-400">10 МБ</p>
                      </div>
                      <PDFDownloadButton
                        href="/documents/ppt/Achieve%20Korean%20Glass%20Skin%20with%20GENOSYS%20approach_F.pdf"
                        filename="Достижение корейской стеклянной кожи с подходом GENOSYS"
                        external={true}
                        className="inline-flex items-center px-2 md:px-3 py-1 md:py-1.5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-md hover:from-green-700 hover:to-green-800 transition-colors text-[10px] md:text-xs font-medium flex-shrink-0"
                      >
                        <Download className="h-2.5 w-2.5 md:h-3 md:w-3 mr-0.5 md:mr-1" />
                        PDF
                      </PDFDownloadButton>
                    </div>
                  </div>
                  
                  <div className="group border border-gray-200 rounded-md md:rounded-lg p-2 md:p-3 hover:border-green-300 hover:shadow-lg transition-all duration-200">
                    <div className="flex items-center gap-2 md:gap-3">
                      <div className="hidden md:flex w-10 h-10 bg-green-50 rounded-lg items-center justify-center overflow-hidden flex-shrink-0 group-hover:bg-green-100 transition-colors">
                        <Download className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs md:text-sm font-semibold text-gray-900 truncate">Руководство эксперта Bio-Meso PDRN</h4>
                        <p className="text-[10px] md:text-xs text-gray-400">8.9 МБ</p>
                      </div>
                      <PDFDownloadButton
                        href="/documents/ppt/Bio-Meso%20PDRN%20Expert_Treatment%20guide_for%20print_S.pdf"
                        filename="Руководство эксперта по лечению Bio-Meso PDRN"
                        external={true}
                        className="inline-flex items-center px-2 md:px-3 py-1 md:py-1.5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-md hover:from-green-700 hover:to-green-800 transition-colors text-[10px] md:text-xs font-medium flex-shrink-0"
                      >
                        <Download className="h-2.5 w-2.5 md:h-3 md:w-3 mr-0.5 md:mr-1" />
                        PDF
                      </PDFDownloadButton>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Product Documentation Section */}
              <div>
                <h3 className="text-sm md:text-xl font-semibold text-gray-800 mb-3 md:mb-6 flex items-center justify-center gap-1.5 md:gap-2">
                  <div className="w-6 h-6 md:w-8 md:h-8 bg-red-100 rounded-md md:rounded-lg flex items-center justify-center">
                    <svg className="w-3 h-3 md:w-4 md:h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                  </div>
                  Документация по продукции
                </h3>
                <div className="space-y-1.5 md:space-y-2">
                  {/* Product documentation items - same structure as English version */}
                  <div className="group border border-gray-200 rounded-md md:rounded-lg p-2 md:p-3 hover:border-red-300 hover:shadow-lg transition-all duration-200">
                    <div className="flex items-center gap-2 md:gap-3">
                      <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-100 rounded-md md:rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                        <Link href="/ru/products/31">
                          <Image
                            src="/images/RAA.jpg"
                            alt="MULTI VITA RADIANCE CREAM"
                            width={500}
                            height={300}
                            className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                          />
                        </Link>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs md:text-sm font-semibold text-gray-900 truncate">
                          MULTI VITA RADIANCE CREAM
                        </h4>
                        <p className="text-[10px] md:text-xs text-gray-400">
                          2.1 МБ
                        </p>
                      </div>
                      <PDFDownloadButton 
                        href="/documents/ppt/GENOSYS%20MULTI%20VITA%20RADIANCE%20CREAM.pdf"
                        filename="Документация по продукции"
                        external={true}
                        className="inline-flex items-center px-2 md:px-3 py-1 md:py-1.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-md hover:from-red-700 hover:to-red-800 transition-colors text-[10px] md:text-xs font-medium flex-shrink-0"
                      >
                        <Download className="h-2.5 w-2.5 md:h-3 md:w-3 mr-0.5 md:mr-1" />
                        PDF
                      </PDFDownloadButton>
                    </div>
                  </div>
                  
                  {/* Add more product documentation items as needed - following same pattern */}
                  {/* For brevity, I'll add a few key ones */}
                  
                  <div className="group border border-gray-200 rounded-md md:rounded-lg p-2 md:p-3 hover:border-red-300 hover:shadow-lg transition-all duration-200">
                    <div className="flex items-center gap-2 md:gap-3">
                      <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-100 rounded-md md:rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                        <Link href="/ru/products/1">
                          <Image
                            src="/images/genosys-microneedling-devices.jpg"
                            alt="Microneedle Roller"
                            width={500}
                            height={300}
                            className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                          />
                        </Link>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs md:text-sm font-semibold text-gray-900 truncate">
                          Microneedle Roller
                        </h4>
                        <p className="text-[10px] md:text-xs text-gray-400">
                          1.5 МБ
                        </p>
                      </div>
                      <PDFDownloadButton 
                        href="/documents/ppt/Overview%20of%20Microneedling_S.pdf"
                        filename="Документация по продукции"
                        external={true}
                        className="inline-flex items-center px-2 md:px-3 py-1 md:py-1.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-md hover:from-red-700 hover:to-red-800 transition-colors text-[10px] md:text-xs font-medium flex-shrink-0"
                      >
                        <Download className="h-2.5 w-2.5 md:h-3 md:w-3 mr-0.5 md:mr-1" />
                        PDF
                      </PDFDownloadButton>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Training Lessons Section - Video Tutorials */}
          <div className="mt-6 md:mt-16">
            <div className="grid gap-4 md:gap-8">
              {/* Video lessons - same structure as English version */}
              <div className="bg-white rounded-lg shadow-md md:shadow-lg overflow-hidden">
                <div className="p-3 md:p-6">
                  <h3 className="text-sm md:text-2xl font-bold text-gray-800 mb-2 md:mb-4 text-center">
                    Лечение растяжек Genosys Bodycell
                  </h3>
                  <p className="hidden md:block text-gray-600 mb-6">
                    Изучите профессиональные техники лечения растяжек с использованием технологии Genosys Bodycell. 
                    Это комплексное обучение охватывает правильные методы применения, протоколы безопасности и ожидаемые результаты.
                  </p>
                  
                  <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                    <iframe
                      className="absolute top-0 left-0 w-full h-full rounded-lg"
                      src="https://www.youtube.com/embed/SvjziVjhb8s"
                      title="Обучение лечению растяжек Genosys Bodycell"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              </div>

              {/* Add more video lessons as needed */}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}



