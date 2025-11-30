import type { Metadata } from 'next'
import ProductsPageClient from '../../products/ProductsPageClient'
import BreadcrumbSchema from '@/components/BreadcrumbSchema'

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
        url: '/images/genosys-products.jpg',
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
    images: ['/images/genosys-products.jpg'],
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
    </>
  )
}



