import FavoritesClient from '../../favorites/FavoritesClient'
import BreadcrumbSchema from '@/components/BreadcrumbSchema'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Избранное - Профессиональная корейская дерматокосметика GENOSYS | Genosys Middle East FZ-LLC',
  description: 'Просмотрите ваши избранные продукты профессиональной корейской дерматокосметики GENOSYS. Сохраняйте и организуйте ваши любимые продукты для ухода за кожей для легкого доступа.',
  keywords: 'Избранное GENOSYS, избранное корейской косметики, избранное профессионального ухода за кожей, сохраненные продукты, список желаний',
  openGraph: {
    title: 'Избранное - Профессиональная корейская дерматокосметика GENOSYS',
    description: 'Просмотрите ваши избранные продукты профессиональной корейской дерматокосметики GENOSYS. Сохраняйте и организуйте ваши любимые продукты для ухода за кожей.',
    type: 'website',
    url: 'https://genosys.ae/ru/favorites',
    siteName: 'GENOSYS Middle East FZ-LLC',
    images: [
      {
        url: '/images/genosys-products.jpg',
        width: 1200,
        height: 630,
        alt: 'Избранное GENOSYS',
      },
    ],
    locale: 'ru_AE',
  },
  robots: {
    index: false,
    follow: true,
    googleBot: {
      index: false,
      follow: true,
    },
  },
  twitter: {
    card: 'summary_large_image',
    site: '@genosys_official',
    creator: '@genosys_official',
    title: 'Избранное - Профессиональная корейская дерматокосметика GENOSYS',
    description: 'Просмотрите ваши избранные продукты профессиональной корейской дерматокосметики GENOSYS.',
    images: ['/images/genosys-products.jpg'],
  },
  alternates: {
    canonical: 'https://genosys.ae/ru/favorites',
    languages: {
      'en': 'https://genosys.ae/favorites',
      'ar': 'https://genosys.ae/ar/favorites',
      'ru': 'https://genosys.ae/ru/favorites',
    },
  },
}

export default function RussianFavoritesPage() {
  return (
    <div className="bg-white min-h-screen" dir="ltr">
      <BreadcrumbSchema
        items={[
          { name: 'Главная', url: '/ru' },
          { name: 'Избранное', url: '/ru/favorites' }
        ]}
      />
      <FavoritesClient />
    </div>
  )
}



