import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Download } from 'lucide-react'
import PDFDownloadButton from '@/components/PDFDownloadButton'
import BreadcrumbSchema from '@/components/schema/BreadcrumbSchema'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Профессиональное обучение - Обучение GENOSYS уходу за кожей | Genosys Middle East FZ-LLC',
  description: 'Ресурсы профессионального обучения для продуктов GENOSYS для ухода за кожей. Скачайте учебные документы, смотрите видеоуроки и освойте профессиональные техники корейской дерматокосметики.',
  keywords: [
    'Обучение GENOSYS',
    'обучение профессиональному уходу за кожей',
    'обучение корейской дерматокосметике',
    'обучение микронидлингу',
    'обучение уходу за кожей ОАЭ'
  ],
  openGraph: {
    title: 'Профессиональное обучение - Обучение GENOSYS уходу за кожей',
    description: 'Ресурсы профессионального обучения для продуктов GENOSYS для ухода за кожей. Скачайте учебные документы, смотрите видеоуроки и освойте профессиональные техники.',
    type: 'website',
    images: [
      {
        url: 'https://genosys.ae/images/genosys-logo.png',
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
    images: ['https://genosys.ae/images/genosys-logo.png'],
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
    <div className="bg-white min-h-screen pb-8">
      <BreadcrumbSchema 
        items={[
          { name: 'Главная', url: '/ru' },
          { name: 'Обучение', url: '/ru/training' }
        ]}
      />
      <div className="container mx-auto px-3 md:px-4 py-4 md:py-16 pb-8">
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
                  <div className="group border border-gray-200 rounded-md md:rounded-lg p-2 md:p-3 hover:border-red-300 hover:shadow-lg transition-all duration-200">
                    <div className="flex items-center gap-2 md:gap-3">
                      <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-100 rounded-md md:rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                        <Link href="/ru/products/31">
                          <Image
                            src="/images/RAA.jpg"
                            alt="MULTI VITA RADIANCE CREAM"
                            width={500}
                            height={300} className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
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
                  
                  <div className="group border border-gray-200 rounded-md md:rounded-lg p-2 md:p-3 hover:border-red-300 hover:shadow-lg transition-all duration-200">
                    <div className="flex items-center gap-2 md:gap-3">
                      <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-100 rounded-md md:rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                        <Link href="/ru/products/50">
                          <Image
                            src="/images/EYEZ.jpg"
                            alt="EyeCell EYE ZONE CARE SYSTEM"
                            width={500}
                            height={300} className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                          />
                        </Link>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs md:text-sm font-semibold text-gray-900 truncate">
                          EyeCell СИСТЕМА УХОДА ЗА ЗОНОЙ ГЛАЗ
                        </h4>
                        <p className="text-[10px] md:text-xs text-gray-400">
                          1.8 МБ
                        </p>
                      </div>
                      <PDFDownloadButton 
                        href="/documents/ppt/GENOSYS%20EyeCell%20EYE%20ZONE%20CARE%20SYSTEM.pdf"
                        filename="Документация по продукции"
                        external={true}
                        className="inline-flex items-center px-2 md:px-3 py-1 md:py-1.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-md hover:from-red-700 hover:to-red-800 transition-colors text-[10px] md:text-xs font-medium flex-shrink-0"
                      >
                        <Download className="h-2.5 w-2.5 md:h-3 md:w-3 mr-0.5 md:mr-1" />
                        PDF
                      </PDFDownloadButton>
                    </div>
                  </div>
                  
                  {/* EPI TURNOVER BOOSTING PEELING GEL */}
                  <div className="group border border-gray-200 rounded-md md:rounded-lg p-2 md:p-3 hover:border-red-300 hover:shadow-lg transition-all duration-200">
                    <div className="flex items-center gap-2 md:gap-3">
                      <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-100 rounded-md md:rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                        <Link href="/ru/products/12">
                          <Image
                            src="/images/EPI.jpg"
                            alt="EPI TURNOVER BOOSTING PEELING GEL"
                            width={500}
                            height={300} className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                          />
                        </Link>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs md:text-sm font-semibold text-gray-900 truncate">
                          EPI ПИЛИНГ-ГЕЛЬ УСИЛИВАЮЩИЙ ОБНОВЛЕНИЕ
                        </h4>
                        <p className="text-[10px] md:text-xs text-gray-400">
                          3.8 МБ
                        </p>
                      </div>
                      <PDFDownloadButton 
                        href="/documents/ppt/GENOSYS%20EPI%20TURNOVER%20BOOSTING%20PEELING%20GEL.pdf"
                        filename="Документация по продукции"
                        external={true}
                        className="inline-flex items-center px-2 md:px-3 py-1 md:py-1.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-md hover:from-red-700 hover:to-red-800 transition-colors text-[10px] md:text-xs font-medium flex-shrink-0"
                      >
                        <Download className="h-2.5 w-2.5 md:h-3 md:w-3 mr-0.5 md:mr-1" />
                        PDF
                      </PDFDownloadButton>
                    </div>
                  </div>
                  
                  {/* MULTI VITA RADIANCE SERUM */}
                  <div className="group border border-gray-200 rounded-md md:rounded-lg p-2 md:p-3 hover:border-red-300 hover:shadow-lg transition-all duration-200">
                    <div className="flex items-center gap-2 md:gap-3">
                      <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-100 rounded-md md:rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                        <Link href="/ru/products/21">
                          <Image
                            src="/images/RADS.jpg"
                            alt="MULTI VITA RADIANCE SERUM"
                            width={500}
                            height={300} className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                          />
                        </Link>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs md:text-sm font-semibold text-gray-900 truncate">
                          MULTI VITA RADIANCE СЫВОРОТКА
                        </h4>
                        <p className="text-[10px] md:text-xs text-gray-400">
                          1.5 МБ
                        </p>
                      </div>
                      <PDFDownloadButton 
                        href="/documents/ppt/GENOSYS%20MULTI%20VITA%20RADIANCE%20SERUM.pdf"
                        filename="Документация по продукции"
                        external={true}
                        className="inline-flex items-center px-2 md:px-3 py-1 md:py-1.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-md hover:from-red-700 hover:to-red-800 transition-colors text-[10px] md:text-xs font-medium flex-shrink-0"
                      >
                        <Download className="h-2.5 w-2.5 md:h-3 md:w-3 mr-0.5 md:mr-1" />
                        PDF
                      </PDFDownloadButton>
                    </div>
                  </div>
                  
                  {/* SKIN DEFENDER LIP & EYE MAKEUP REMOVER */}
                  <div className="group border border-gray-200 rounded-md md:rounded-lg p-2 md:p-3 hover:border-red-300 hover:shadow-lg transition-all duration-200">
                    <div className="flex items-center gap-2 md:gap-3">
                      <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-100 rounded-md md:rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                        <Link href="/ru/products/11">
                          <Image
                            src="/images/DEF.jpg"
                            alt="SKIN DEFENDER LIP & EYE MAKEUP REMOVER"
                            width={500}
                            height={300} className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                          />
                        </Link>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs md:text-sm font-semibold text-gray-900 truncate">
                          SKIN DEFENDER СРЕДСТВО ДЛЯ СНЯТИЯ МАКИЯЖА С ГУБ И ГЛАЗ
                        </h4>
                        <p className="text-[10px] md:text-xs text-gray-400">
                          0.7 МБ
                        </p>
                      </div>
                      <PDFDownloadButton 
                        href="/documents/ppt/GENOSYS%20SKIN%20DEFENDER%20LIP%20%26%20EYE%20MAKEUP%20REMOVER.pdf"
                        filename="Документация по продукции"
                        external={true}
                        className="inline-flex items-center px-2 md:px-3 py-1 md:py-1.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-md hover:from-red-700 hover:to-red-800 transition-colors text-[10px] md:text-xs font-medium flex-shrink-0"
                      >
                        <Download className="h-2.5 w-2.5 md:h-3 md:w-3 mr-0.5 md:mr-1" />
                        PDF
                      </PDFDownloadButton>
                    </div>
                  </div>
                  
                  {/* MICROBIOME ENERGY INFUSING MIST */}
                  <div className="group border border-gray-200 rounded-md md:rounded-lg p-2 md:p-3 hover:border-red-300 hover:shadow-lg transition-all duration-200">
                    <div className="flex items-center gap-2 md:gap-3">
                      <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-100 rounded-md md:rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                        <Link href="/ru/products/14">
                          <Image
                            src="/images/mist.jpg"
                            alt="MICROBIOME ENERGY INFUSING MIST"
                            width={500}
                            height={300} className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                          />
                        </Link>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs md:text-sm font-semibold text-gray-900 truncate">
                          MICROBIOME ЭНЕРГЕТИЧЕСКИЙ МИСТ
                        </h4>
                        <p className="text-[10px] md:text-xs text-gray-400">
                          0.8 МБ
                        </p>
                      </div>
                      <PDFDownloadButton 
                        href="/documents/ppt/GENOSYS%20MICROBIOME%20ENERGY%20INFUSING%20MIST.pdf"
                        filename="Документация по продукции"
                        external={true}
                        className="inline-flex items-center px-2 md:px-3 py-1 md:py-1.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-md hover:from-red-700 hover:to-red-800 transition-colors text-[10px] md:text-xs font-medium flex-shrink-0"
                      >
                        <Download className="h-2.5 w-2.5 md:h-3 md:w-3 mr-0.5 md:mr-1" />
                        PDF
                      </PDFDownloadButton>
                    </div>
                  </div>
                  
                  {/* SKIN RESCUE OVERNIGHT CREAM MASK */}
                  <div className="group border border-gray-200 rounded-md md:rounded-lg p-2 md:p-3 hover:border-red-300 hover:shadow-lg transition-all duration-200">
                    <div className="flex items-center gap-2 md:gap-3">
                      <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-100 rounded-md md:rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                        <Link href="/ru/products/34">
                          <Image
                            src="/images/SKIN.jpg"
                            alt="SKIN RESCUE OVERNIGHT CREAM MASK"
                            width={500}
                            height={300} className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                          />
                        </Link>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs md:text-sm font-semibold text-gray-900 truncate">
                          SKIN RESCUE НОЧНАЯ КРЕМ-МАСКА
                        </h4>
                        <p className="text-[10px] md:text-xs text-gray-400">
                          1.3 МБ
                        </p>
                      </div>
                      <PDFDownloadButton 
                        href="/documents/ppt/GENOSYS%20SKIN%20RESCUE%20OVERNIGHT%20CREAM%20MASK.pdf"
                        filename="Документация по продукции"
                        external={true}
                        className="inline-flex items-center px-2 md:px-3 py-1 md:py-1.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-md hover:from-red-700 hover:to-red-800 transition-colors text-[10px] md:text-xs font-medium flex-shrink-0"
                      >
                        <Download className="h-2.5 w-2.5 md:h-3 md:w-3 mr-0.5 md:mr-1" />
                        PDF
                      </PDFDownloadButton>
                    </div>
                  </div>
                  
                  {/* INTENSIVE PROBLEM CONTROL TONER */}
                  <div className="group border border-gray-200 rounded-md md:rounded-lg p-2 md:p-3 hover:border-red-300 hover:shadow-lg transition-all duration-200">
                    <div className="flex items-center gap-2 md:gap-3">
                      <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-100 rounded-md md:rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                        <Link href="/ru/products/15">
                          <Image
                            src="/images/PRS.jpg"
                            alt="INTENSIVE PROBLEM CONTROL TONER"
                            width={500}
                            height={300} className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                          />
                        </Link>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs md:text-sm font-semibold text-gray-900 truncate">
                          ИНТЕНСИВНЫЙ ТОНИК ДЛЯ КОНТРОЛЯ ПРОБЛЕМ
                        </h4>
                        <p className="text-[10px] md:text-xs text-gray-400">
                          1.0 МБ
                        </p>
                      </div>
                      <PDFDownloadButton 
                        href="/documents/ppt/GENOSYS%20INTENSIVE%20PROBLEM%20CONTROL%20TONER.pdf"
                        filename="Документация по продукции"
                        external={true}
                        className="inline-flex items-center px-2 md:px-3 py-1 md:py-1.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-md hover:from-red-700 hover:to-red-800 transition-colors text-[10px] md:text-xs font-medium flex-shrink-0"
                      >
                        <Download className="h-2.5 w-2.5 md:h-3 md:w-3 mr-0.5 md:mr-1" />
                        PDF
                      </PDFDownloadButton>
                    </div>
                  </div>
                  
                  {/* ULTRA SHIELD SUN CREAM */}
                  <div className="group border border-gray-200 rounded-md md:rounded-lg p-2 md:p-3 hover:border-red-300 hover:shadow-lg transition-all duration-200">
                    <div className="flex items-center gap-2 md:gap-3">
                      <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-100 rounded-md md:rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                        <Link href="/ru/products/39">
                          <Image
                            src="/images/SPF50.jpg"
                            alt="ULTRA SHIELD SUN CREAM"
                            width={500}
                            height={300} className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                          />
                        </Link>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs md:text-sm font-semibold text-gray-900 truncate">
                          ULTRA SHIELD СОЛНЦЕЗАЩИТНЫЙ КРЕМ
                        </h4>
                        <p className="text-[10px] md:text-xs text-gray-400">
                          0.6 МБ
                        </p>
                      </div>
                      <PDFDownloadButton 
                        href="/documents/ppt/GENOSYS%20ULTRA%20SHIELD%20SUN%20CREAM.pdf"
                        filename="Документация по продукции"
                        external={true}
                        className="inline-flex items-center px-2 md:px-3 py-1 md:py-1.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-md hover:from-red-700 hover:to-red-800 transition-colors text-[10px] md:text-xs font-medium flex-shrink-0"
                      >
                        <Download className="h-2.5 w-2.5 md:h-3 md:w-3 mr-0.5 md:mr-1" />
                        PDF
                      </PDFDownloadButton>
                    </div>
                  </div>
                  
                  {/* HR³ MATRIX SCALP SHAMPOO α */}
                  <div className="group border border-gray-200 rounded-md md:rounded-lg p-2 md:p-3 hover:border-red-300 hover:shadow-lg transition-all duration-200">
                    <div className="flex items-center gap-2 md:gap-3">
                      <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-100 rounded-md md:rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                        <Link href="/ru/products/44">
                          <Image
                            src="/images/Sham.jpg"
                            alt="HR³ MATRIX SCALP SHAMPOO α"
                            width={500}
                            height={300} className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                          />
                        </Link>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs md:text-sm font-semibold text-gray-900 truncate">
                          HR³ MATRIX ШАМПУНЬ ДЛЯ КОЖИ ГОЛОВЫ α
                        </h4>
                        <p className="text-[10px] md:text-xs text-gray-400">
                          2.3 МБ
                        </p>
                      </div>
                      <PDFDownloadButton 
                        href="/documents/ppt/GENOSYS%20HR3%20MATRIX%20SCALP%20SHAMPOO%20ALPHA.pdf"
                        filename="Документация по продукции"
                        external={true}
                        className="inline-flex items-center px-2 md:px-3 py-1 md:py-1.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-md hover:from-red-700 hover:to-red-800 transition-colors text-[10px] md:text-xs font-medium flex-shrink-0"
                      >
                        <Download className="h-2.5 w-2.5 md:h-3 md:w-3 mr-0.5 md:mr-1" />
                        PDF
                      </PDFDownloadButton>
                    </div>
                  </div>
                  
                  {/* MOISTURE REPLENISHING HYALURON SERUM */}
                  <div className="group border border-gray-200 rounded-md md:rounded-lg p-2 md:p-3 hover:border-red-300 hover:shadow-lg transition-all duration-200">
                    <div className="flex items-center gap-2 md:gap-3">
                      <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-100 rounded-md md:rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                        <Link href="/ru/products/18">
                          <Image
                            src="/images/HRS.jpg"
                            alt="MOISTURE REPLENISHING HYALURON SERUM"
                            width={500}
                            height={300} className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                          />
                        </Link>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs md:text-sm font-semibold text-gray-900 truncate">
                          УВЛАЖНЯЮЩАЯ ГИАЛУРОНОВАЯ СЫВОРОТКА
                        </h4>
                        <p className="text-[10px] md:text-xs text-gray-400">
                          1.9 МБ
                        </p>
                      </div>
                      <PDFDownloadButton 
                        href="/documents/ppt/GENOSYS%20MOISTURE%20REPLENISHING%20HYALURON%20SERUM.pdf"
                        filename="Документация по продукции"
                        external={true}
                        className="inline-flex items-center px-2 md:px-3 py-1 md:py-1.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-md hover:from-red-700 hover:to-red-800 transition-colors text-[10px] md:text-xs font-medium flex-shrink-0"
                      >
                        <Download className="h-2.5 w-2.5 md:h-3 md:w-3 mr-0.5 md:mr-1" />
                        PDF
                      </PDFDownloadButton>
                    </div>
                  </div>
                  
                  {/* MOISTURE REPLENISHING HYALURON CREAM */}
                  <div className="group border border-gray-200 rounded-md md:rounded-lg p-2 md:p-3 hover:border-red-300 hover:shadow-lg transition-all duration-200">
                    <div className="flex items-center gap-2 md:gap-3">
                      <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-100 rounded-md md:rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                        <Link href="/ru/products/29">
                          <Image
                            src="/images/HER.jpg"
                            alt="MOISTURE REPLENISHING HYALURON CREAM"
                            width={500}
                            height={300} className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                          />
                        </Link>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs md:text-sm font-semibold text-gray-900 truncate">
                          УВЛАЖНЯЮЩИЙ ГИАЛУРОНОВЫЙ КРЕМ
                        </h4>
                        <p className="text-[10px] md:text-xs text-gray-400">
                          2.0 МБ
                        </p>
                      </div>
                      <PDFDownloadButton 
                        href="/documents/ppt/GENOSYS%20MOISTURE%20REPLENISHING%20HYALURON%20CREAM.pdf"
                        filename="Документация по продукции"
                        external={true}
                        className="inline-flex items-center px-2 md:px-3 py-1 md:py-1.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-md hover:from-red-700 hover:to-red-800 transition-colors text-[10px] md:text-xs font-medium flex-shrink-0"
                      >
                        <Download className="h-2.5 w-2.5 md:h-3 md:w-3 mr-0.5 md:mr-1" />
                        PDF
                      </PDFDownloadButton>
                    </div>
                  </div>
                  
                  {/* SKIN CARING BLEMISH BALM CUSHION */}
                  <div className="group border border-gray-200 rounded-md md:rounded-lg p-2 md:p-3 hover:border-red-300 hover:shadow-lg transition-all duration-200">
                    <div className="flex items-center gap-2 md:gap-3">
                      <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-100 rounded-md md:rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                        <Link href="/ru/products/41">
                          <Image
                            src="/images/BBC.jpg"
                            alt="SKIN CARING BLEMISH BALM CUSHION"
                            width={500}
                            height={300} className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                          />
                        </Link>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs md:text-sm font-semibold text-gray-900 truncate">
                          SKIN CARING ПОДУШКА ДЛЯ УСТРАНЕНИЯ НЕДОСТАТКОВ
                        </h4>
                        <p className="text-[10px] md:text-xs text-gray-400">
                          1.2 МБ
                        </p>
                      </div>
                      <PDFDownloadButton 
                        href="/documents/ppt/GENOSYS%20SKIN%20CARING%20BLEMISH%20BALM%20CUSHION.pdf"
                        filename="Документация по продукции"
                        external={true}
                        className="inline-flex items-center px-2 md:px-3 py-1 md:py-1.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-md hover:from-red-700 hover:to-red-800 transition-colors text-[10px] md:text-xs font-medium flex-shrink-0"
                      >
                        <Download className="h-2.5 w-2.5 md:h-3 md:w-3 mr-0.5 md:mr-1" />
                        PDF
                      </PDFDownloadButton>
                    </div>
                  </div>
                  
                  {/* REVITA GLOW BLEMISH BALM CREAM */}
                  <div className="group border border-gray-200 rounded-md md:rounded-lg p-2 md:p-3 hover:border-red-300 hover:shadow-lg transition-all duration-200">
                    <div className="flex items-center gap-2 md:gap-3">
                      <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-100 rounded-md md:rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                        <Link href="/ru/products/62">
                          <Image
                            src="/images/REVITA_GLOW_BB_CREAM_01_BRIGHT.png"
                            alt="REVITA GLOW BLEMISH BALM CREAM"
                            width={500}
                            height={300} className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                          />
                        </Link>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs md:text-sm font-semibold text-gray-900 truncate">
                          REVITA GLOW BB КРЕМ
                        </h4>
                        <p className="text-[10px] md:text-xs text-gray-400">
                          2.0 МБ
                        </p>
                      </div>
                      <PDFDownloadButton 
                        href="/documents/ppt/GENOSYS_REVITA_GLOW_BB_CREAM.pdf"
                        filename="Документация по продукции"
                        external={true}
                        className="inline-flex items-center px-2 md:px-3 py-1 md:py-1.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-md hover:from-red-700 hover:to-red-800 transition-colors text-[10px] md:text-xs font-medium flex-shrink-0"
                      >
                        <Download className="h-2.5 w-2.5 md:h-3 md:w-3 mr-0.5 md:mr-1" />
                        PDF
                      </PDFDownloadButton>
                    </div>
                  </div>
                  
                  {/* EyeCell EYE PEPTIDE GEL PATCH */}
                  <div className="group border border-gray-200 rounded-md md:rounded-lg p-2 md:p-3 hover:border-red-300 hover:shadow-lg transition-all duration-200">
                    <div className="flex items-center gap-2 md:gap-3">
                      <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-100 rounded-md md:rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                        <Link href="/ru/products/33">
                          <Image
                            src="/images/Patch.jpg"
                            alt="EyeCell EYE PEPTIDE GEL PATCH"
                            width={500}
                            height={300} className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                          />
                        </Link>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs md:text-sm font-semibold text-gray-900 truncate">
                          EyeCell ПЕПТИДНЫЕ ГЕЛЕВЫЕ ПАТЧИ ДЛЯ ГЛАЗ
                        </h4>
                        <p className="text-[10px] md:text-xs text-gray-400">
                          1.4 МБ
                        </p>
                      </div>
                      <PDFDownloadButton 
                        href="/documents/ppt/GENOSYS%20EyeCell%20EYE%20PEPTIDE%20GEL%20PATCH.pdf"
                        filename="Документация по продукции"
                        external={true}
                        className="inline-flex items-center px-2 md:px-3 py-1 md:py-1.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-md hover:from-red-700 hover:to-red-800 transition-colors text-[10px] md:text-xs font-medium flex-shrink-0"
                      >
                        <Download className="h-2.5 w-2.5 md:h-3 md:w-3 mr-0.5 md:mr-1" />
                        PDF
                      </PDFDownloadButton>
                    </div>
                  </div>
                  
                  {/* BIO-FERMENT AGE DEFYING POWDER MASK */}
                  <div className="group border border-gray-200 rounded-md md:rounded-lg p-2 md:p-3 hover:border-red-300 hover:shadow-lg transition-all duration-200">
                    <div className="flex items-center gap-2 md:gap-3">
                      <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-100 rounded-md md:rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                        <Link href="/ru/products/51">
                          <Image
                            src="/images/BFAD.png"
                            alt="BIO-FERMENT AGE DEFYING POWDER MASK"
                            width={500}
                            height={300} className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                          />
                        </Link>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs md:text-sm font-semibold text-gray-900 truncate">
                          BIO-FERMENT ОМОЛАЖИВАЮЩАЯ ПОРОШКОВАЯ МАСКА
                        </h4>
                        <p className="text-[10px] md:text-xs text-gray-400">
                          2.1 МБ
                        </p>
                      </div>
                      <PDFDownloadButton 
                        href="/documents/ppt/GENOSYS%20BIO-FERMENT%20AGE%20DEFYING%20POWDER%20MASK.pdf"
                        filename="Документация по продукции"
                        external={true}
                        className="inline-flex items-center px-2 md:px-3 py-1 md:py-1.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-md hover:from-red-700 hover:to-red-800 transition-colors text-[10px] md:text-xs font-medium flex-shrink-0"
                      >
                        <Download className="h-2.5 w-2.5 md:h-3 md:w-3 mr-0.5 md:mr-1" />
                        PDF
                      </PDFDownloadButton>
                    </div>
                  </div>
                  
                  {/* HAIR GENTRON */}
                  <div className="group border border-gray-200 rounded-md md:rounded-lg p-2 md:p-3 hover:border-red-300 hover:shadow-lg transition-all duration-200">
                    <div className="flex items-center gap-2 md:gap-3">
                      <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-100 rounded-md md:rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                        <Link href="/ru/products/48">
                          <Image
                            src="/images/gen.jpg"
                            alt="HAIR GENTRON"
                            width={500}
                            height={300} className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                          />
                        </Link>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs md:text-sm font-semibold text-gray-900 truncate">
                          HAIR GENTRON
                        </h4>
                        <p className="text-[10px] md:text-xs text-gray-400">
                          1.8 МБ
                        </p>
                      </div>
                      <PDFDownloadButton 
                        href="/documents/ppt/HAIR%20GENTRON.pdf"
                        filename="Документация по продукции"
                        external={true}
                        className="inline-flex items-center px-2 md:px-3 py-1 md:py-1.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-md hover:from-red-700 hover:to-red-800 transition-colors text-[10px] md:text-xs font-medium flex-shrink-0"
                      >
                        <Download className="h-2.5 w-2.5 md:h-3 md:w-3 mr-0.5 md:mr-1" />
                        PDF
                      </PDFDownloadButton>
                    </div>
                  </div>
                  
                  {/* HR³ MATRIX HAIR SOLUTION α */}
                  <div className="group border border-gray-200 rounded-md md:rounded-lg p-2 md:p-3 hover:border-red-300 hover:shadow-lg transition-all duration-200">
                    <div className="flex items-center gap-2 md:gap-3">
                      <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-100 rounded-md md:rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                        <Link href="/ru/products/45">
                          <Image
                            src="/images/HHR.jpg"
                            alt="HR³ MATRIX HAIR SOLUTION α"
                            width={500}
                            height={300} className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                          />
                        </Link>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs md:text-sm font-semibold text-gray-900 truncate">
                          HR³ MATRIX РЕШЕНИЕ ДЛЯ ВОЛОС α
                        </h4>
                        <p className="text-[10px] md:text-xs text-gray-400">
                          2.3 МБ
                        </p>
                      </div>
                      <PDFDownloadButton 
                        href="/documents/ppt/GENOSYS%20HR3%20MATRIX%20HAIR%20SOLUTION%20ALPHA.pdf"
                        filename="Документация по продукции"
                        external={true}
                        className="inline-flex items-center px-2 md:px-3 py-1 md:py-1.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-md hover:from-red-700 hover:to-red-800 transition-colors text-[10px] md:text-xs font-medium flex-shrink-0"
                      >
                        <Download className="h-2.5 w-2.5 md:h-3 md:w-3 mr-0.5 md:mr-1" />
                        PDF
                      </PDFDownloadButton>
                    </div>
                  </div>
                  
                  {/* HR³ MATRIX HAIR TONIC α */}
                  <div className="group border border-gray-200 rounded-md md:rounded-lg p-2 md:p-3 hover:border-red-300 hover:shadow-lg transition-all duration-200">
                    <div className="flex items-center gap-2 md:gap-3">
                      <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-100 rounded-md md:rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                        <Link href="/ru/products/43">
                          <Image
                            src="/images/HT.jpg"
                            alt="HR³ MATRIX HAIR TONIC α"
                            width={500}
                            height={300} className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                          />
                        </Link>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs md:text-sm font-semibold text-gray-900 truncate">
                          HR³ MATRIX ТОНИК ДЛЯ ВОЛОС α
                        </h4>
                        <p className="text-[10px] md:text-xs text-gray-400">
                          1.9 МБ
                        </p>
                      </div>
                      <PDFDownloadButton 
                        href="/documents/ppt/GENOSYS%20HR3%20MATRIX%20HAIR%20TONIC%20ALPHA.pdf"
                        filename="Документация по продукции"
                        external={true}
                        className="inline-flex items-center px-2 md:px-3 py-1 md:py-1.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-md hover:from-red-700 hover:to-red-800 transition-colors text-[10px] md:text-xs font-medium flex-shrink-0"
                      >
                        <Download className="h-2.5 w-2.5 md:h-3 md:w-3 mr-0.5 md:mr-1" />
                        PDF
                      </PDFDownloadButton>
                    </div>
                  </div>
                  
                  {/* HR³ MATRIX SCALP PEELING α */}
                  <div className="group border border-gray-200 rounded-md md:rounded-lg p-2 md:p-3 hover:border-red-300 hover:shadow-lg transition-all duration-200">
                    <div className="flex items-center gap-2 md:gap-3">
                      <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-100 rounded-md md:rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                        <Link href="/ru/products/46">
                          <Image
                            src="/images/scal.jpg"
                            alt="HR³ MATRIX SCALP PEELING α"
                            width={500}
                            height={300} className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                          />
                        </Link>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs md:text-sm font-semibold text-gray-900 truncate">
                          HR³ MATRIX ПИЛИНГ ДЛЯ КОЖИ ГОЛОВЫ α
                        </h4>
                        <p className="text-[10px] md:text-xs text-gray-400">
                          2.1 МБ
                        </p>
                      </div>
                      <PDFDownloadButton 
                        href="/documents/ppt/GENOSYS%20HR3%20MATRIX%20SCALP%20PEELING%20ALPHA.pdf"
                        filename="Документация по продукции"
                        external={true}
                        className="inline-flex items-center px-2 md:px-3 py-1 md:py-1.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-md hover:from-red-700 hover:to-red-800 transition-colors text-[10px] md:text-xs font-medium flex-shrink-0"
                      >
                        <Download className="h-2.5 w-2.5 md:h-3 md:w-3 mr-0.5 md:mr-1" />
                        PDF
                      </PDFDownloadButton>
                    </div>
                  </div>
                  
                  {/* GENO-LED IR II */}
                  <div className="group border border-gray-200 rounded-md md:rounded-lg p-2 md:p-3 hover:border-red-300 hover:shadow-lg transition-all duration-200">
                    <div className="flex items-center gap-2 md:gap-3">
                      <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-100 rounded-md md:rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                        <Link href="/ru/products/49">
                          <Image
                            src="/images/LEDD.jpg"
                            alt="GENO-LED IR II"
                            width={500}
                            height={300} className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                          />
                        </Link>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs md:text-sm font-semibold text-gray-900 truncate">
                          GENO-LED IR II
                        </h4>
                        <p className="text-[10px] md:text-xs text-gray-400">
                          4.6 МБ
                        </p>
                      </div>
                      <PDFDownloadButton 
                        href="/documents/ppt/GENO-LED%20IR%20II_2025.pdf"
                        filename="Документация по продукции"
                        external={true}
                        className="inline-flex items-center px-2 md:px-3 py-1 md:py-1.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-md hover:from-red-700 hover:to-red-800 transition-colors text-[10px] md:text-xs font-medium flex-shrink-0"
                      >
                        <Download className="h-2.5 w-2.5 md:h-3 md:w-3 mr-0.5 md:mr-1" />
                        PDF
                      </PDFDownloadButton>
                    </div>
                  </div>
                  
                  {/* SKIN REBOOT PDRN MASK PACK */}
                  <div className="group border border-gray-200 rounded-md md:rounded-lg p-2 md:p-3 hover:border-red-300 hover:shadow-lg transition-all duration-200">
                    <div className="flex items-center gap-2 md:gap-3">
                      <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-100 rounded-md md:rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                        <Link href="/ru/products/52">
                          <Image
                            src="/images/PDRN.png"
                            alt="SKIN REBOOT PDRN MASK PACK"
                            width={500}
                            height={300} className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                          />
                        </Link>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs md:text-sm font-semibold text-gray-900 truncate">
                          SKIN REBOOT МАСКА PDRN
                        </h4>
                        <p className="text-[10px] md:text-xs text-gray-400">
                          1.2 МБ
                        </p>
                      </div>
                      <PDFDownloadButton 
                        href="/documents/ppt/GENOSYS%20SKIN%20REBOOT%20PDRN%20MASK%20PACK.pdf"
                        filename="Документация по продукции"
                        external={true}
                        className="inline-flex items-center px-2 md:px-3 py-1 md:py-1.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-md hover:from-red-700 hover:to-red-800 transition-colors text-[10px] md:text-xs font-medium flex-shrink-0"
                      >
                        <Download className="h-2.5 w-2.5 md:h-3 md:w-3 mr-0.5 md:mr-1" />
                        PDF
                      </PDFDownloadButton>
                    </div>
                  </div>
                  
                  {/* EZ CO₂ MASK KIT */}
                  <div className="group border border-gray-200 rounded-md md:rounded-lg p-2 md:p-3 hover:border-red-300 hover:shadow-lg transition-all duration-200">
                    <div className="flex items-center gap-2 md:gap-3">
                      <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-100 rounded-md md:rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                        <Link href="/ru/products/38">
                          <Image
                            src="/images/EZE.jpg"
                            alt="EZ CO₂ MASK KIT"
                            width={500}
                            height={300} className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                          />
                        </Link>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs md:text-sm font-semibold text-gray-900 truncate">
                          EZ CO₂ НАБОР МАСОК
                        </h4>
                        <p className="text-[10px] md:text-xs text-gray-400">
                          0.5 МБ
                        </p>
                      </div>
                      <PDFDownloadButton 
                        href="/documents/ppt/Genosys%20Ez%20Co2%20Mask.pdf"
                        filename="Документация по продукции"
                        external={true}
                        className="inline-flex items-center px-2 md:px-3 py-1 md:py-1.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-md hover:from-red-700 hover:to-red-800 transition-colors text-[10px] md:text-xs font-medium flex-shrink-0"
                      >
                        <Download className="h-2.5 w-2.5 md:h-3 md:w-3 mr-0.5 md:mr-1" />
                        PDF
                      </PDFDownloadButton>
                    </div>
                  </div>
                  
                  {/* Microneedle Roller */}
                  <div className="group border border-gray-200 rounded-md md:rounded-lg p-2 md:p-3 hover:border-red-300 hover:shadow-lg transition-all duration-200">
                    <div className="flex items-center gap-2 md:gap-3">
                      <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-100 rounded-md md:rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                        <Link href="/ru/products/1">
                          <Image
                            src="/images/genosys-microneedling-devices.jpg"
                            alt="Microneedle Roller"
                            width={500}
                            height={300} className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                          />
                        </Link>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs md:text-sm font-semibold text-gray-900 truncate">
                          Микроиглы Роллер
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
              {/* Genosys Bodycell Stretch Mark Treatment Lesson */}
              <div className="bg-white rounded-lg shadow-md md:shadow-lg overflow-hidden">
                <div className="p-3 md:p-6">
                  <h3 className="text-sm md:text-2xl font-bold text-gray-800 mb-2 md:mb-4 text-center">
                    Лечение растяжек Genosys Bodycell
                  </h3>
                  <p className="hidden md:block text-gray-600 mb-6">
                    Изучите профессиональные техники лечения растяжек с использованием технологии Genosys Bodycell. 
                    Это комплексное обучение охватывает правильные методы применения, протоколы безопасности и ожидаемые результаты.
                  </p>
                  
                  {/* Video Container */}
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
                  
                  {/* Lesson Details */}
                  <div className="hidden md:grid mt-6 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Что вы изучите:</h4>
                      <ul className="text-gray-600 space-y-1">
                        <li>• Правильные техники применения продукта</li>
                        <li>• Протоколы безопасности и меры предосторожности</li>
                        <li>• Продолжительность и частота лечения</li>
                        <li>• Ожидаемые результаты и временные рамки</li>
                        <li>• Лучшие практики консультации клиентов</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Детали урока:</h4>
                      <ul className="text-gray-600 space-y-1">
                        <li>• Продолжительность: 15-20 минут</li>
                        <li>• Уровень: Профессиональный</li>
                        <li>• Категория: Процедуры для тела</li>
                        <li>• Сертификация: Доступна по завершении</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Genosys NDcell Neck & Decollete Treatment Lesson */}
              <div className="bg-white rounded-lg shadow-md md:shadow-lg overflow-hidden">
                <div className="p-3 md:p-6">
                  <h3 className="text-sm md:text-2xl font-bold text-gray-800 mb-2 md:mb-4 text-center">
                    Лечение шеи и декольте Genosys NDcell
                  </h3>
                  <p className="hidden md:block text-gray-600 mb-6">
                    Освойте специализированные техники лечения деликатной области шеи и декольте с использованием технологии Genosys NDcell. 
                    Это продвинутое обучение охватывает правильные методы применения, соображения безопасности и достижение оптимальных результатов для этой чувствительной области.
                  </p>
                  
                  {/* Video Container */}
                  <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                    <iframe
                      className="absolute top-0 left-0 w-full h-full rounded-lg"
                      src="https://www.youtube.com/embed/m07q2XRt_OM"
                      title="Обучение лечению шеи и декольте Genosys NDcell"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    ></iframe>
                  </div>
                  
                  {/* Lesson Details */}
                  <div className="hidden md:grid mt-6 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Что вы изучите:</h4>
                      <ul className="text-gray-600 space-y-1">
                        <li>• Специализированные техники для шеи и декольте</li>
                        <li>• Правильная работа с чувствительными участками кожи</li>
                        <li>• Протоколы и время лечения</li>
                        <li>• Позиционирование и комфорт клиента</li>
                        <li>• Инструкции по уходу после процедуры</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Детали урока:</h4>
                      <ul className="text-gray-600 space-y-1">
                        <li>• Продолжительность: 18-22 минуты</li>
                        <li>• Уровень: Продвинутый профессиональный</li>
                        <li>• Категория: Специализированные процедуры</li>
                        <li>• Сертификация: Доступна по завершении</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Genosys EyeCell Treatment Lesson */}
              <div className="bg-white rounded-lg shadow-md md:shadow-lg overflow-hidden">
                <div className="p-3 md:p-6">
                  <h3 className="text-sm md:text-2xl font-bold text-gray-800 mb-2 md:mb-4 text-center">
                    Процедура Genosys EyeCell
                  </h3>
                  <p className="hidden md:block text-gray-600 mb-6">
                    Изучите точные техники лечения деликатной области глаз с использованием технологии Genosys EyeCell. 
                    Это специализированное обучение охватывает безопасные методы применения, протоколы комфорта клиента и достижение оптимальных результатов для чувствительной периорбитальной области.
                  </p>
                  
                  {/* Video Container */}
                  <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                    <iframe
                      className="absolute top-0 left-0 w-full h-full rounded-lg"
                      src="https://www.youtube.com/embed/xH58EZtykZE"
                      title="Обучение процедуре Genosys EyeCell"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    ></iframe>
                  </div>
                  
                  {/* Lesson Details */}
                  <div className="hidden md:grid mt-6 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Что вы изучите:</h4>
                      <ul className="text-gray-600 space-y-1">
                        <li>• Точные техники лечения области глаз</li>
                        <li>• Протоколы безопасности для чувствительной области глаз</li>
                        <li>• Позиционирование клиента и защита глаз</li>
                        <li>• Интенсивность и продолжительность процедуры</li>
                        <li>• Уход и рекомендации после процедуры</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Детали урока:</h4>
                      <ul className="text-gray-600 space-y-1">
                        <li>• Продолжительность: 16-20 минут</li>
                        <li>• Уровень: Продвинутый профессиональный</li>
                        <li>• Категория: Специализированные процедуры для глаз</li>
                        <li>• Сертификация: Доступна по завершении</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Genosys HR3 Matrix Treatment Lesson */}
              <div className="bg-white rounded-lg shadow-md md:shadow-lg overflow-hidden">
                <div className="p-3 md:p-6">
                  <h3 className="text-sm md:text-2xl font-bold text-gray-800 mb-2 md:mb-4 text-center">
                    Процедура Genosys HR3 Matrix
                  </h3>
                  <p className="hidden md:block text-gray-600 mb-6">
                    Освойте продвинутые техники процедуры HR3 Matrix с использованием технологии Genosys. 
                    Это комплексное обучение охватывает методы применения матрикса, протоколы лечения и достижение оптимальных результатов для омоложения кожи и улучшения матрикса.
                  </p>
                  
                  {/* Video Container */}
                  <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                    <iframe
                      className="absolute top-0 left-0 w-full h-full rounded-lg"
                      src="https://www.youtube.com/embed/qQRcEvd3Ks4"
                      title="Обучение процедуре Genosys HR3 Matrix"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    ></iframe>
                  </div>
                  
                  {/* Lesson Details */}
                  <div className="hidden md:grid mt-6 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Что вы изучите:</h4>
                      <ul className="text-gray-600 space-y-1">
                        <li>• Техники применения HR3 Matrix</li>
                        <li>• Протоколы и время лечения</li>
                        <li>• Подготовка и оценка кожи</li>
                        <li>• Консультация клиента и ожидания</li>
                        <li>• Уход и наблюдение после процедуры</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Детали урока:</h4>
                      <ul className="text-gray-600 space-y-1">
                        <li>• Продолжительность: 20-25 минут</li>
                        <li>• Уровень: Продвинутый профессиональный</li>
                        <li>• Категория: Матричные процедуры</li>
                        <li>• Сертификация: Доступна по завершении</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Facial Treatment Lesson */}
              <div className="bg-white rounded-lg shadow-md md:shadow-lg overflow-hidden">
                <div className="p-3 md:p-6">
                  <h3 className="text-sm md:text-2xl font-bold text-gray-800 mb-2 md:mb-4 text-center">
                    Процедуры для лица
                  </h3>
                  <p className="hidden md:block text-gray-600 mb-6">
                    Изучите комплексные техники процедур для лица с использованием продуктов и протоколов Genosys. 
                    Это базовое обучение охватывает полные процедуры для лица, последовательности применения продуктов и достижение оптимальных результатов для различных типов кожи и проблем.
                  </p>
                  
                  {/* Video Container */}
                  <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                    <iframe
                      className="absolute top-0 left-0 w-full h-full rounded-lg"
                      src="https://www.youtube.com/embed/hMtodh45sME"
                      title="Обучение процедурам для лица"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    ></iframe>
                  </div>
                  
                  {/* Lesson Details */}
                  <div className="hidden md:grid mt-6 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Что вы изучите:</h4>
                      <ul className="text-gray-600 space-y-1">
                        <li>• Полные протоколы процедур для лица</li>
                        <li>• Последовательности применения продуктов</li>
                        <li>• Анализ и оценка кожи</li>
                        <li>• Техники консультации клиента</li>
                        <li>• Методы персонализации процедур</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Детали урока:</h4>
                      <ul className="text-gray-600 space-y-1">
                        <li>• Продолжительность: 25-30 минут</li>
                        <li>• Уровень: Профессиональный</li>
                        <li>• Категория: Процедуры для лица</li>
                        <li>• Сертификация: Доступна по завершении</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* How to use Genosys Snow 02 Cleanser Lesson */}
              <div className="bg-white rounded-lg shadow-md md:shadow-lg overflow-hidden">
                <div className="p-3 md:p-6">
                  <h3 className="text-sm md:text-2xl font-bold text-gray-800 mb-2 md:mb-4 text-center">
                    Как использовать Genosys Snow 02 Cleanser
                  </h3>
                  <p className="hidden md:block text-gray-600 mb-6">
                    Освойте правильные техники эффективного использования Genosys Snow 02 Cleanser. 
                    Это детальное обучение охватывает правильные методы применения, время и достижение оптимальных результатов очищения для различных типов кожи и состояний.
                  </p>
                  
                  {/* Video Container */}
                  <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                    <iframe
                      className="absolute top-0 left-0 w-full h-full rounded-lg"
                      src="https://www.youtube.com/embed/SWY0f2gSzl8"
                      title="Обучение использованию Genosys Snow 02 Cleanser"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    ></iframe>
                  </div>
                  
                  {/* Lesson Details */}
                  <div className="hidden md:grid mt-6 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Что вы изучите:</h4>
                      <ul className="text-gray-600 space-y-1">
                        <li>• Правильное применение Snow 02 Cleanser</li>
                        <li>• Правильное время и продолжительность</li>
                        <li>• Особенности типов кожи</li>
                        <li>• Преимущества продукта и результаты</li>
                        <li>• Интеграция с другими процедурами</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Детали урока:</h4>
                      <ul className="text-gray-600 space-y-1">
                        <li>• Продолжительность: 12-15 минут</li>
                        <li>• Уровень: Профессиональный</li>
                        <li>• Категория: Использование продуктов</li>
                        <li>• Сертификация: Доступна по завершении</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* GENOSYS HR3 MATRIX Lesson */}
              <div className="bg-white rounded-lg shadow-md md:shadow-lg overflow-hidden">
                <div className="p-3 md:p-6">
                  <h3 className="text-sm md:text-2xl font-bold text-gray-800 mb-2 md:mb-4 text-center">
                    GENOSYS HR3 MATRIX
                  </h3>
                  <p className="hidden md:block text-gray-600 mb-6">
                    Продвинутое обучение технологии GENOSYS HR3 MATRIX и техникам применения. 
                    Этот комплексный урок охватывает протоколы матричного лечения, продвинутые методы применения и достижение оптимальных результатов для омоложения кожи и улучшения матрикса.
                  </p>
                  
                  {/* Video Container */}
                  <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                    <iframe
                      className="absolute top-0 left-0 w-full h-full rounded-lg"
                      src="https://www.youtube.com/embed/pM8qIUNdORY"
                      title="Обучение GENOSYS HR3 MATRIX"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    ></iframe>
                  </div>
                  
                  {/* Lesson Details */}
                  <div className="hidden md:grid mt-6 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Что вы изучите:</h4>
                      <ul className="text-gray-600 space-y-1">
                        <li>• Продвинутые техники HR3 MATRIX</li>
                        <li>• Протоколы матричного лечения</li>
                        <li>• Оценка и подготовка кожи</li>
                        <li>• Методы персонализации лечения</li>
                        <li>• Стратегии оптимизации результатов</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Детали урока:</h4>
                      <ul className="text-gray-600 space-y-1">
                        <li>• Продолжительность: 22-28 минут</li>
                        <li>• Уровень: Продвинутый профессиональный</li>
                        <li>• Категория: Матричные процедуры</li>
                        <li>• Сертификация: Доступна по завершении</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Placeholder for future lessons - hidden on mobile */}
              <div className="hidden md:block bg-gray-50 rounded-lg p-8 text-center">
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  Скоро появятся новые обучающие уроки
                </h3>
                <p className="text-base text-gray-500">
                  Мы постоянно добавляем новый обучающий контент. Регулярно проверяйте обновления.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}



