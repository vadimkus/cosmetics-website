import type { Metadata } from 'next'
import BrandPageClient from '../../brand/BrandPageClient'
import BreadcrumbSchema from '@/components/schema/BreadcrumbSchema'

export const metadata: Metadata = {
  title: 'История бренда GENOSYS - Gene Re-Birth System',
  description: 'Откройте для себя GENOSYS — первый в мире бренд, специализирующийся на микронидлинге. Система Gene Re-Birth объединяет микронидлинг и специально разработанную дерматокосметику для более выраженных результатов ухода.',
  keywords: [
    'бренд GENOSYS',
    'Gene Re-Birth System',
    'бренд микронидлинга',
    'корейская дерматокосметика',
    'профессиональный уход за кожей',
    'косметика ОАЭ',
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
    title: 'История бренда GENOSYS - Gene Re-Birth System',
    description: 'Откройте для себя GENOSYS — первый в мире бренд, специализирующийся на микронидлинге. Система Gene Re-Birth объединяет микронидлинг и специально разработанную дерматокосметику.',
    type: 'website',
    url: 'https://genosys.ae/ru/brand',
    siteName: 'GENOSYS',
    images: [
      {
        url: 'https://genosys.ae/images/genosys-products.jpg',
        width: 1200,
        height: 630,
        alt: 'История бренда GENOSYS',
      },
    ],
    locale: 'ru_RU',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@genosys_official',
    creator: '@genosys_official',
    title: 'История бренда GENOSYS - Gene Re-Birth System',
    description: 'Откройте для себя GENOSYS — первый в мире бренд, специализирующийся на микронидлинге.',
    images: ['/images/genosys-products.jpg'],
  },
  alternates: {
    canonical: 'https://genosys.ae/ru/brand',
    languages: {
      'en': 'https://genosys.ae/brand',
      'ar': 'https://genosys.ae/ar/brand',
      'ru': 'https://genosys.ae/ru/brand',
      'x-default': 'https://genosys.ae/brand',
    },
  },
}

export default function RussianBrandPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Главная', url: '/ru' },
          { name: 'Бренд', url: '/ru/brand' }
        ]}
      />
      <BrandPageClient />
    </>
  )
}
