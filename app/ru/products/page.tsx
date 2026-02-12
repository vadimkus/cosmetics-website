import type { Metadata } from 'next'
import Link from 'next/link'
import ProductsPageClient from '../../products/ProductsPageClient'
import BreadcrumbSchema from '@/components/schema/BreadcrumbSchema'
import { CONCERN_PAGES } from '@/lib/concernsData'

export const metadata: Metadata = {
  title: 'Продукция GENOSYS - Профессиональная корейская дерматокосметика ОАЭ',
  description: 'Магазин профессиональной корейской дерматокосметики GENOSYS. Полная коллекция устройств для микронидлинга, сывороток, кремов, масок и решений для ухода за кожей. Официальный дистрибьютор в ОАЭ. Бесплатная доставка при заказе свыше 1000 дирхамов.',
  keywords: [
    'Продукция GENOSYS',
    'Корейская дерматокосметика',
    'Профессиональный уход за кожей ОАЭ',
    'Устройства для микронидлинга',
    'Корейские продукты для ухода за кожей',
    'Сыворотки ОАЭ',
    'Косметические кремы Дубай',
    'Профессиональный уход за кожей Дубай',
    'Корейская косметика ОАЭ'
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
    title: 'Продукция GENOSYS - Профессиональная корейская дерматокосметика ОАЭ',
    description: 'Магазин профессиональной корейской дерматокосметики GENOSYS. Полная коллекция устройств для микронидлинга, сывороток, кремов, масок и решений для ухода за кожей.',
    type: 'website',
    url: 'https://genosys.ae/ru/products',
    images: [
      {
        url: 'https://genosys.ae/images/genosys-products.jpg',
        width: 1200,
        height: 630,
        alt: 'Коллекция продукции GENOSYS',
      },
    ],
    locale: 'ru_AE',
    siteName: 'GENOSYS Middle East FZ-LLC',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@genosys_official',
    creator: '@genosys_official',
    title: 'Продукция GENOSYS - Профессиональная корейская дерматокосметика ОАЭ',
    description: 'Магазин профессиональной корейской дерматокосметики GENOSYS. Полная коллекция устройств для микронидлинга, сывороток, кремов и многое другое.',
    images: ['https://genosys.ae/images/genosys-products.jpg'],
  },
  alternates: {
    canonical: 'https://genosys.ae/ru/products',
    languages: {
      'en': 'https://genosys.ae/products',
      'ar': 'https://genosys.ae/ar/products',
      'ru': 'https://genosys.ae/ru/products',
    },
  },
}

export default function RussianProductsPage() {
  return (
    <>
      <BreadcrumbSchema 
        items={[
          { name: 'Главная', url: '/ru' },
          { name: 'Продукция', url: '/ru/products' }
        ]}
      />
      <ProductsPageClient />

      <section className="hidden sm:block bg-primary-50 py-10 px-4 mt-8 border-t border-primary-100">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Выбор по проблеме кожи</h2>
          <p className="text-gray-500 mb-6">Найдите подходящие продукты для ваших потребностей</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {CONCERN_PAGES.map(concern => (
              <Link key={concern.slug} href={`/ru/products/concern/${concern.slug}`}
                className="block p-4 bg-white rounded-xl border border-primary-100 hover:border-primary-300 hover:shadow-md transition-all duration-200 group">
                <h3 className="font-semibold text-gray-900 text-sm sm:text-base group-hover:text-primary-600 transition-colors">{concern.seo.ru.h1}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}



