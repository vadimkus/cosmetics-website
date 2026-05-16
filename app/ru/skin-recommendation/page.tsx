import { Metadata } from 'next'
import SkinRecommendationClient from '@/app/skin-recommendation/SkinRecommendationClient'
import BreadcrumbSchema from '@/components/schema/BreadcrumbSchema'

export const metadata: Metadata = {
  title: 'Персональные рекомендации для кожи | GENOSYS Professional',
  description: 'Подберите средства GENOSYS под ваш тип кожи и основные задачи ухода. Система AI-рекомендаций анализирует профиль кожи и предлагает подходящую профессиональную корейскую дерматокосметику.',
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
    description: 'Подберите средства GENOSYS под ваш тип кожи и основные задачи ухода.',
    url: 'https://genosys.ae/ru/skin-recommendation',
    siteName: 'GENOSYS',
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
    description: 'Подберите средства GENOSYS под ваш тип кожи и основные задачи ухода.',
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



