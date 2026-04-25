import FavoritesClient from './FavoritesClient'
import BreadcrumbSchema from '@/components/schema/BreadcrumbSchema'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Favorites - GENOSYS Products | Genosys',
  description: 'View your saved GENOSYS products. Save and organize your preferred skincare products for easy access.',
  keywords: 'GENOSYS favorites, Korean dermacosmetics favorites, professional skincare favorites, saved products, wishlist',
  openGraph: {
    title: 'Favorites - GENOSYS Products',
    description: 'View your saved GENOSYS products. Save and organize your preferred skincare products.',
    type: 'website',
    images: [
      {
        url: '/images/genosys-products.jpg',
        width: 1200,
        height: 630,
        alt: 'GENOSYS Favorites',
      },
    ],
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
    title: 'Favorites - GENOSYS Products',
    description: 'View your saved GENOSYS products.',
    images: ['/images/genosys-products.jpg'],
  },
  alternates: {
    canonical: 'https://genosys.ae/favorites',
    languages: {
      'en': 'https://genosys.ae/favorites',
      'ar': 'https://genosys.ae/ar/favorites',
    },
  },
}

export default function FavoritesPage() {
  return (
    <div className="bg-white min-h-screen">
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Favorites', url: '/favorites' }
        ]}
      />
      <FavoritesClient />
    </div>
  )
}