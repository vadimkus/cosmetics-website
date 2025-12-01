import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Handshake } from 'lucide-react'
import BreadcrumbSchema from '@/components/BreadcrumbSchema'
import PartnersList from '@/components/partners/PartnersList'
import PartnersSchema from '@/components/PartnersSchema'

export const metadata: Metadata = {
  title: 'Партнеры GENOSYS в ОАЭ - Надежные дистрибьюторы корейской дерматокосметики | Genosys Middle East',
  description: 'Откройте для себя сеть надежных партнеров GENOSYS по всему ОАЭ. Дистрибьюторы профессиональной корейской дерматокосметики в Дубае, Абу-Даби, Шардже и других городах. Найдите авторизованных розничных продавцов GENOSYS рядом с вами.',
  keywords: [
    'Партнеры GENOSYS ОАЭ',
    'Дистрибьюторы корейской дерматокосметики Дубай',
    'Авторизованные розничные продавцы GENOSYS',
    'Партнеры профессионального ухода за кожей ОАЭ',
    'Дистрибьюторы корейской красоты',
    'Партнеры дерматокосметики Дубай',
    'Поставщики GENOSYS ОАЭ',
    'Дистрибьюторы корейского ухода за кожей',
    'Партнеры салонов красоты Дубай',
    'Партнеры эстетических клиник ОАЭ'
  ],
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
  openGraph: {
    title: 'Партнеры GENOSYS в ОАЭ - Надежные дистрибьюторы корейской дерматокосметики',
    description: 'Найдите авторизованных партнеров GENOSYS по всему ОАЭ. Дистрибьюторы профессиональной корейской дерматокосметики в Дубае, Абу-Даби, Шардже и всех эмиратах.',
    type: 'website',
    url: 'https://genosys.ae/ru/partners',
    siteName: 'GENOSYS Middle East FZ-LLC',
    images: [
      {
        url: '/images/genosys-products.jpg',
        width: 1200,
        height: 630,
        alt: 'Сеть партнеров GENOSYS в ОАЭ',
      },
    ],
    locale: 'ru_AE',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@genosys_official',
    creator: '@genosys_official',
    title: 'Партнеры GENOSYS в ОАЭ - Надежные дистрибьюторы корейской дерматокосметики',
    description: 'Найдите авторизованных партнеров GENOSYS по всему ОАЭ. Дистрибьюторы профессиональной корейской дерматокосметики.',
    images: ['/images/genosys-products.jpg'],
  },
  alternates: {
    canonical: 'https://genosys.ae/ru/partners',
    languages: {
      'en': 'https://genosys.ae/partners',
      'ar': 'https://genosys.ae/ar/partners',
      'ru': 'https://genosys.ae/ru/partners',
    },
  },
}

export default function RussianPartnersPage() {
  return (
    <>
      <BreadcrumbSchema 
        items={[
          { name: 'Главная', url: '/ru' },
          { name: 'Партнеры', url: '/ru/partners' }
        ]}
      />
      <PartnersSchema />
      <div className="bg-white min-h-screen">
        <div className="container mx-auto px-3 md:px-4 py-4 md:py-16">
          <div className="max-w-6xl mx-auto">
            {/* Navigation Breadcrumb */}
            <nav className="text-xs md:text-base text-gray-600 mb-2 md:mb-4" aria-label="Breadcrumb">
              <Link href="/ru" className="hover:text-primary-600 transition-colors">Главная</Link>
              <span> / </span>
              <span className="text-gray-900 font-medium">Партнеры</span>
            </nav>
            
            {/* Back to Home */}
            <Link href="/ru" className="inline-flex items-center gap-1 text-xs md:text-sm text-primary-600 hover:text-primary-700 mb-4 md:mb-8">
              <ArrowLeft className="h-3 w-3 md:h-4 md:w-4" />
              <span>Вернуться на главную</span>
            </Link>

            {/* Header */}
            <div className="text-center mb-4 md:mb-8">
              <div className="inline-flex items-center justify-center gap-2 mb-2 md:mb-3">
                <div className="p-2 md:p-3 bg-gradient-to-r from-red-100 to-pink-100 rounded-lg md:rounded-xl">
                  <Handshake className="h-4 w-4 md:h-6 md:w-6 text-red-600" />
                </div>
                <h1 className="text-xl md:text-3xl font-bold text-gray-800">
                  Наши партнеры
                </h1>
              </div>
              <p className="text-xs md:text-base text-gray-600 px-2">
                Строим прочные партнерства GENOSYS по всему ОАЭ
              </p>
            </div>
            
            {/* Partners List */}
            <PartnersList />

            {/* Call to Action */}
            <div className="mt-6 md:mt-12">
              <div className="bg-gradient-to-r from-primary-50 to-red-50 rounded-lg md:rounded-xl p-4 md:p-8 border border-red-100">
                <h2 className="text-base md:text-2xl font-bold text-gray-800 mb-2 md:mb-4 text-center">
                  Заинтересованы стать партнером?
                </h2>
                <p className="text-xs md:text-base text-gray-600 mb-4 md:mb-6 text-center px-2">
                  Присоединяйтесь к нашей сети надежных партнеров GENOSYS.
                </p>
                <div className="flex flex-col sm:flex-row gap-2 md:gap-4 justify-center">
                  <Link 
                    href="/ru/contact"
                    className="inline-flex items-center justify-center bg-primary-600 text-white px-4 md:px-6 py-2.5 md:py-3 rounded-lg text-xs md:text-base font-semibold hover:bg-primary-700 transition-colors min-h-[44px] touch-manipulation"
                  >
                    Связаться с нами
                  </Link>
                  <Link 
                    href="/ru/products"
                    className="inline-flex items-center justify-center border-2 border-primary-600 text-primary-600 px-4 md:px-6 py-2.5 md:py-3 rounded-lg text-xs md:text-base font-semibold hover:bg-primary-50 transition-colors min-h-[44px] touch-manipulation"
                  >
                    Посмотреть продукцию
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



