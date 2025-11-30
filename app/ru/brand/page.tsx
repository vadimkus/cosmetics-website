import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft } from 'lucide-react'
import BreadcrumbSchema from '@/components/BreadcrumbSchema'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'История бренда GENOSYS - Система регенерации генов',
  description: 'Откройте для себя GENOSYS, первый в мире бренд, специализирующийся на микронидлинге. Система регенерации генов объединяет микронидлинг и специально разработанную косметику.',
  keywords: 'GENOSYS, система регенерации генов, микронидлинг, корейская косметика, профессиональный уход за кожей',
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
    title: 'История бренда GENOSYS - Система регенерации генов',
    description: 'Откройте для себя GENOSYS, первый в мире бренд, специализирующийся на микронидлинге. Система регенерации генов объединяет микронидлинг и специально разработанную косметику.',
    type: 'website',
    url: 'https://genosys.ae/ru/brand',
    siteName: 'GENOSYS Middle East FZ-LLC',
    images: [
      {
        url: '/images/genosys-products.jpg',
        width: 1200,
        height: 630,
        alt: 'Профессиональная корейская дерматокосметика GENOSYS',
      },
    ],
    locale: 'ru_AE',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@genosys_official',
    creator: '@genosys_official',
    title: 'История бренда GENOSYS - Система регенерации генов',
    description: 'Откройте для себя GENOSYS, первый в мире бренд, специализирующийся на микронидлинге.',
    images: ['/images/genosys-products.jpg'],
  },
  alternates: {
    canonical: 'https://genosys.ae/ru/brand',
    languages: {
      'en': 'https://genosys.ae/brand',
      'ar': 'https://genosys.ae/ar/brand',
      'ru': 'https://genosys.ae/ru/brand',
    },
  },
}

export default function RussianBrandPage() {
  return (
    <div className="bg-white min-h-screen" dir="ltr">
      <BreadcrumbSchema 
        items={[
          { name: 'Главная', url: '/ru' },
          { name: 'Бренд', url: '/ru/brand' }
        ]}
      />
      <div className="container mx-auto px-3 md:px-4 py-4 md:py-16">
        <div className="max-w-4xl mx-auto">
          {/* Navigation Breadcrumb */}
          <nav className="text-xs md:text-base text-gray-600 mb-2 md:mb-4" aria-label="Breadcrumb">
            <Link href="/ru" className="hover:text-primary-600 transition-colors">Главная</Link>
            <span> / </span>
            <span className="text-gray-900 font-medium">Бренд</span>
          </nav>
          
          {/* Back to Home */}
          <Link href="/ru" className="inline-flex items-center gap-1 text-xs md:text-sm text-primary-600 hover:text-primary-700 mb-4 md:mb-8">
            <ArrowLeft className="h-3 w-3 md:h-4 md:w-4" />
            <span>Вернуться на главную</span>
          </Link>

          <div className="text-center mb-6 md:mb-12">
            <h1 className="text-xl md:text-5xl font-bold text-gray-800 mb-3 md:mb-6">
              Система регенерации генов GENOSYS
            </h1>
            <p className="text-xs md:text-xl text-gray-600 max-w-2xl mx-auto mb-4 md:mb-8 leading-relaxed">
              GENOSYS — первый в мире бренд, специализирующийся на микронидлинге, созданный путем объединения микронидлинга и специально разработанной косметики для лечения микронидлингом для улучшения эффектов ухода за кожей.
            </p>
            
            {/* Video Section */}
            <div className="max-w-4xl mx-auto mb-4 md:mb-8">
              <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                <iframe
                  className="absolute top-0 left-0 w-full h-full rounded-lg shadow-lg"
                  src="https://www.youtube.com/embed/4L9xZc7wAjI"
                  title="Система регенерации генов GENOSYS"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
            
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-3 md:p-8 mb-4 md:mb-8">
            <p className="text-gray-600 leading-relaxed text-xs md:text-lg text-center mb-4 md:mb-8">
              С дружественными к коже формулами и мощными активными ингредиентами, линии GENOSYS для домашнего/профессионального ухода не только обеспечивают видимые долгосрочные результаты, но и повышают эффективность профессиональных процедур.
            </p>
            
            {/* Video Section */}
            <div className="max-w-4xl mx-auto">
              <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                <iframe
                  className="absolute top-0 left-0 w-full h-full rounded-lg shadow-lg"
                  src="https://www.youtube.com/embed/v-i6CHJfWIg?autoplay=1&loop=1&playlist=v-i6CHJfWIg&mute=1&controls=0&showinfo=0&rel=0&modestbranding=1"
                  title="Профессиональное лечение GENOSYS"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                ></iframe>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-3 md:p-8">
            <div className="text-center">
              <div className="mt-3 md:mt-6">
                <Image
                  src="/Logo/Full.png"
                  alt="GENOSYS Система регенерации генов - Логотип бренда профессиональной корейской дерматокосметики"
                  width={200}
                  height={100}
                  className="mx-auto scale-75 md:scale-100"
                />
              </div>
              <div className="mt-3 md:mt-6">
                <Image
                  src="/images/genosys-products.jpg"
                  alt="Коллекция профессиональных продуктов для ухода за кожей GENOSYS - Устройства для микронидлинга и решения для ухода за кожей"
                  width={800}
                  height={600}
                  className="rounded-lg shadow-md mx-auto"
                  priority
                />
              </div>
              <p className="text-gray-500 text-[10px] md:text-base mt-2 md:mt-4">
                Линия профессионального ухода за кожей GENOSYS — продукты, протестированные дерматологами.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}



