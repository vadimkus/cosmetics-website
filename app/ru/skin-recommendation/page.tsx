import { Metadata } from 'next'
import SkinRecommendationClient from '@/app/skin-recommendation/SkinRecommendationClient'
import BreadcrumbSchema from '@/components/schema/BreadcrumbSchema'

export const metadata: Metadata = {
  title: 'Персональные рекомендации для кожи | GENOSYS Professional',
  description: 'Откройте для себя идеальные продукты GENOSYS, специально разработанные для ваших уникальных потребностей кожи. Наша система рекомендаций на основе искусственного интеллекта анализирует профиль вашей кожи, чтобы предложить лучшие продукты профессиональной корейской косметики.',
  keywords: ['Рекомендации для кожи', 'Продукты для ухода за кожей', 'GENOSYS', 'Корейский уход за кожей', 'Персонализированные продукты', 'Анализ кожи', 'Рекомендации продуктов'],
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
    title: 'Персональные рекомендации для кожи | GENOSYS Professional',
    description: 'Откройте для себя идеальные продукты GENOSYS, специально разработанные для ваших уникальных потребностей кожи.',
    url: 'https://genosys.ae/ru/skin-recommendation',
    siteName: 'GENOSYS Middle East FZ-LLC',
    locale: 'ru_AE',
    type: 'website',
    images: [
      {
        url: 'https://genosys.ae/images/genosys-products.jpg',
        width: 1200,
        height: 630,
        alt: 'Персонализированные рекомендации по уходу за кожей GENOSYS',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@genosys_official',
    creator: '@genosys_official',
    title: 'Персональные рекомендации для кожи | GENOSYS Professional',
    description: 'Откройте для себя идеальные продукты GENOSYS, специально разработанные для ваших уникальных потребностей кожи.',
    images: ['https://genosys.ae/images/genosys-products.jpg'],
  },
  alternates: {
    canonical: 'https://genosys.ae/ru/skin-recommendation',
    languages: {
      'en': 'https://genosys.ae/skin-recommendation',
      'ar': 'https://genosys.ae/ar/skin-recommendation',
      'ru': 'https://genosys.ae/ru/skin-recommendation',
    },
  },
}

export default function RussianSkinRecommendationPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Главная', url: '/ru' },
          { name: 'Рекомендации для кожи', url: '/ru/skin-recommendation' }
        ]}
      />
      <SkinRecommendationClient />
    </>
  )
}



