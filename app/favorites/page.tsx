import FavoritesClient from './FavoritesClient'
import BreadcrumbSchema from '@/components/BreadcrumbSchema'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My Favorites - GENOSYS Professional Korean Dermacosmetics | Genosys Middle East FZ-LLC',
  description: 'View your favorite GENOSYS professional Korean dermacosmetics products. Save and organize your preferred skincare products for easy access.',
  keywords: 'GENOSYS favorites, Korean dermacosmetics favorites, professional skincare favorites, saved products, wishlist',
  openGraph: {
    title: 'My Favorites - GENOSYS Professional Korean Dermacosmetics',
    description: 'View your favorite GENOSYS professional Korean dermacosmetics products. Save and organize your preferred skincare products.',
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
  twitter: {
    card: 'summary_large_image',
    site: '@genosys_me',
    creator: '@genosys_me',
    title: 'My Favorites - GENOSYS Professional Korean Dermacosmetics',
    description: 'View your favorite GENOSYS professional Korean dermacosmetics products.',
    images: ['/images/genosys-products.jpg'],
  },
  alternates: {
    canonical: 'https://genosys.ae/favorites',
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