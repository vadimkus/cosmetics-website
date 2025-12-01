import type { Metadata } from 'next'
import Link from 'next/link'
import { MapPin, ArrowLeft } from 'lucide-react'
import BreadcrumbSchema from '@/components/BreadcrumbSchema'

export const metadata: Metadata = {
  title: 'Локации GENOSYS - Обслуживание всех эмиратов ОАЭ | Genosys Middle East FZ-LLC',
  description: 'GENOSYS Middle East FZ-LLC доставляет профессиональную корейскую дерматокосметику во все эмираты ОАЭ: Дубай, Абу-Даби, Шарджа, Аджман, Рас-эль-Хайма, Фуджейра и Умм-эль-Кайвайн.',
  keywords: 'Локации GENOSYS ОАЭ, корейская дерматокосметика Дубай, GENOSYS Абу-Даби, GENOSYS Шарджа, доставка ухода за кожей ОАЭ',
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
    title: 'Локации GENOSYS - Обслуживание всех эмиратов ОАЭ',
    description: 'GENOSYS Middle East FZ-LLC доставляет профессиональную корейскую дерматокосметику во все эмираты ОАЭ.',
    type: 'website',
    images: [
      {
        url: '/images/genosys-products.jpg',
        width: 1200,
        height: 630,
        alt: 'Локации GENOSYS ОАЭ',
      },
    ],
    url: 'https://genosys.ae/ru/locations',
    siteName: 'GENOSYS Middle East FZ-LLC',
    locale: 'ru_AE',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@genosys_official',
    creator: '@genosys_official',
    title: 'Локации GENOSYS - Обслуживание всех эмиратов ОАЭ',
    description: 'GENOSYS Middle East FZ-LLC доставляет профессиональную корейскую дерматокосметику во все эмираты ОАЭ.',
    images: ['/images/genosys-products.jpg'],
  },
  alternates: {
    canonical: 'https://genosys.ae/ru/locations',
    languages: {
      'en': 'https://genosys.ae/locations',
      'ar': 'https://genosys.ae/ar/locations',
      'ru': 'https://genosys.ae/ru/locations',
    },
  },
}

const locations = [
  {
    slug: 'dubai',
    name: 'Дубай',
    description: 'Наш офис/склад находится в Дубае.',
    shippingCost: '45 дирхамов',
    deliveryTime: '1-2 часа, в тот же день (Careem)',
  },
  {
    slug: 'abu-dhabi',
    name: 'Абу-Даби',
    description: 'Профессиональная корейская дерматокосметика доставляется во все районы Абу-Даби',
    shippingCost: '70 дирхамов',
    deliveryTime: '48 часов через Quiqup',
  },
  {
    slug: 'sharjah',
    name: 'Шарджа',
    description: 'Качественные продукты для ухода за кожей и профессиональное обучение доступны в Шардже',
    shippingCost: '70 дирхамов',
    deliveryTime: '1-2 часа, в тот же день (Careem)',
  },
  {
    slug: 'ras-al-khaimah',
    name: 'Рас-эль-Хайма',
    description: 'Наш офис находится в Рас-эль-Хайме.',
    shippingCost: '70 дирхамов',
    deliveryTime: '48 часов через Quiqup',
  },
  {
    slug: 'ajman',
    name: 'Аджман',
    description: 'Надежная доставка премиальной корейской дерматокосметики в Аджман',
    shippingCost: '70 дирхамов',
    deliveryTime: '48 часов через Quiqup',
  },
  {
    slug: 'fujairah',
    name: 'Фуджейра',
    description: 'Качественные продукты для ухода за кожей доставляются по всей Фуджейре',
    shippingCost: '70 дирхамов',
    deliveryTime: '48 часов через Quiqup',
  },
  {
    slug: 'umm-al-quwain',
    name: 'Умм-эль-Кайвайн',
    description: 'Премиальные продукты для ухода за кожей доставляются по всему Умм-эль-Кайвайну',
    shippingCost: '70 дирхамов',
    deliveryTime: '48 часов через Quiqup',
  },
]

export default function RussianLocationsPage() {
  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen">
      <BreadcrumbSchema 
        items={[
          { name: 'Главная', url: '/ru' },
          { name: 'Локации', url: '/ru/locations' }
        ]}
      />
      
      <div className="container mx-auto px-3 md:px-4 py-4 md:py-16">
        <div className="max-w-6xl mx-auto">
          {/* Navigation Breadcrumb */}
          <nav className="text-xs md:text-base text-gray-600 mb-2 md:mb-4" aria-label="Breadcrumb">
            <Link href="/ru" className="hover:text-primary-600 transition-colors">Главная</Link>
            <span> / </span>
            <span className="text-gray-900 font-medium">Локации</span>
          </nav>
          
          {/* Back to Home */}
          <Link href="/ru" className="inline-flex items-center gap-1 text-xs md:text-sm text-primary-600 hover:text-primary-700 mb-4 md:mb-8">
            <ArrowLeft className="h-3 w-3 md:h-4 md:w-4" />
            <span>Вернуться на главную</span>
          </Link>

          {/* Page Header */}
          <div className="text-center mb-6 md:mb-12">
            <div className="hidden md:inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-6">
              <MapPin className="h-8 w-8 text-primary-600" />
            </div>
            <h1 className="text-2xl md:text-5xl font-bold text-gray-800 mb-2 md:mb-4">
              Наши локации
            </h1>
            <p className="text-xs md:text-lg text-gray-600 max-w-2xl mx-auto">
              Доставка во все 7 эмиратов ОАЭ
            </p>
          </div>

          {/* Locations Grid */}
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-6 mb-6 md:mb-12">
            {locations.map((location) => (
              <Link
                key={location.slug}
                href={`/ru/locations/${location.slug}`}
                className="bg-white border border-gray-200 rounded-lg md:rounded-xl p-3 md:p-6 hover:shadow-md transition-all duration-200 group"
              >
                <div className="flex flex-col md:flex-row md:items-start gap-2 md:gap-4">
                  <div className="hidden md:flex bg-primary-100 rounded-full p-3 group-hover:bg-primary-600 transition-colors">
                    <MapPin className="h-6 w-6 text-primary-600 group-hover:text-white transition-colors" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5 mb-1 md:mb-2">
                      <MapPin className="h-3 w-3 md:hidden text-primary-600" />
                      <h2 className="text-sm md:text-xl font-semibold text-gray-800 group-hover:text-primary-600 transition-colors">
                        {location.name}
                      </h2>
                    </div>
                    <p className="hidden md:block text-gray-600 text-sm mb-3">
                      {location.description}
                    </p>
                    <div className="flex flex-col gap-0.5 md:gap-1 text-[10px] md:text-xs text-gray-500">
                      <span className="font-medium"><span className="text-gray-700">{location.shippingCost}</span></span>
                      <span className="text-gray-600 line-clamp-1">{location.deliveryTime}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* General Information */}
          <div className="bg-gradient-to-r from-primary-50 to-red-50 rounded-lg md:rounded-xl p-4 md:p-8 border border-primary-100 shadow-sm">
            <div className="text-center">
              <h2 className="text-lg md:text-2xl font-bold text-gray-800 mb-2 md:mb-3">
                Доступна бесплатная доставка
              </h2>
              <p className="text-xs md:text-base text-gray-600 mb-4 md:mb-6 max-w-xl mx-auto">
                Заказы свыше 1000 дирхамов мы доставляем бесплатно по всем эмиратам ОАЭ.
              </p>
              <div className="flex flex-row gap-3 justify-center">
                <Link
                  href="/ru/products"
                  className="bg-primary-600 text-white px-4 md:px-8 py-2 md:py-3 rounded-lg text-xs md:text-base font-semibold hover:bg-primary-700 transition-colors text-center shadow-md flex items-center justify-center"
                >
                  Продукция
                </Link>
                <Link
                  href="/ru/contact"
                  className="border border-primary-600 text-primary-600 px-4 md:px-8 py-2 md:py-3 rounded-lg text-xs md:text-base font-semibold hover:bg-white transition-colors text-center shadow-md flex items-center justify-center"
                >
                  Контакты
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}



