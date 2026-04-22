import FavoritesClient from '../../favorites/FavoritesClient'
import BreadcrumbSchema from '@/components/schema/BreadcrumbSchema'
import { getRecommendedForEmptyFavorites } from '../../favorites/recommended'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'المفضلة - مستحضرات التجميل الكورية المهنية GENOSYS | Genosys Middle East FZ-LLC',
  description: 'عرض منتجات مستحضرات التجميل الكورية المهنية GENOSYS المفضلة لديك. احفظ ونظم منتجات العناية بالبشرة المفضلة لديك للوصول السهل.',
  keywords: 'مفضلات GENOSYS، مفضلات مستحضرات التجميل الكورية، مفضلات العناية بالبشرة المهنية، المنتجات المحفوظة، قائمة الأمنيات',
  openGraph: {
    title: 'المفضلة - مستحضرات التجميل الكورية المهنية GENOSYS',
    description: 'عرض منتجات مستحضرات التجميل الكورية المهنية GENOSYS المفضلة لديك. احفظ ونظم منتجات العناية بالبشرة المفضلة لديك.',
    type: 'website',
    url: 'https://genosys.ae/ar/favorites',
    siteName: 'GENOSYS Middle East FZ-LLC',
    images: [
      {
        url: '/images/genosys-products.jpg',
        width: 1200,
        height: 630,
        alt: 'مفضلات GENOSYS',
      },
    ],
    locale: 'ar_AE',
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
    title: 'المفضلة - مستحضرات التجميل الكورية المهنية GENOSYS',
    description: 'عرض منتجات مستحضرات التجميل الكورية المهنية GENOSYS المفضلة لديك.',
    images: ['/images/genosys-products.jpg'],
  },
  alternates: {
    canonical: 'https://genosys.ae/ar/favorites',
    languages: {
      'en': 'https://genosys.ae/favorites',
      'ar': 'https://genosys.ae/ar/favorites',
    },
  },
}

export default async function ArabicFavoritesPage() {
  const recommendedProducts = await getRecommendedForEmptyFavorites()

  return (
    <div className="bg-white min-h-screen" dir="rtl">
      <BreadcrumbSchema
        items={[
          { name: 'الرئيسية', url: '/ar' },
          { name: 'المفضلة', url: '/ar/favorites' }
        ]}
      />
      <FavoritesClient recommendedProducts={recommendedProducts} />
    </div>
  )
}

