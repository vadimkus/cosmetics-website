import BreadcrumbSchema from '@/components/schema/BreadcrumbSchema'
import type { Metadata } from 'next'
import BrandPageClient from './BrandPageClient'

export const metadata: Metadata = {
  title: 'GENOSYS Brand Story - Gene Re-Birth System',
  description: 'Discover GENOSYS, the world\'s first microneedling-dedicated brand. Gene Re-Birth System combines microneedling with specially formulated cosmeceuticals for optimal skincare results.',
  keywords: 'GENOSYS brand, Gene Re-Birth System, microneedling brand, Korean dermacosmetics, professional skincare, UAE cosmetics',
  openGraph: {
    title: 'GENOSYS Brand Story - Gene Re-Birth System',
    description: 'Discover GENOSYS, the world\'s first microneedling-dedicated brand. Gene Re-Birth System combines microneedling with specially formulated cosmeceuticals.',
    type: 'website',
    url: 'https://genosys.ae/brand',
    siteName: 'GENOSYS',
    locale: 'en_AE',
    images: [
      {
        url: 'https://genosys.ae/images/genosys-products.jpg',
        width: 1200,
        height: 630,
        alt: 'GENOSYS Brand - Gene Re-Birth System',
      },
    ],
  },
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
  twitter: {
    card: 'summary_large_image',
    site: '@genosys_official',
    creator: '@genosys_official',
    title: 'GENOSYS Brand Story - Gene Re-Birth System',
    description: 'Discover GENOSYS, the world\'s first microneedling-dedicated brand. Gene Re-Birth System combines microneedling with specially formulated cosmeceuticals.',
    images: ['https://genosys.ae/images/genosys-products.jpg'],
  },
  alternates: {
    canonical: 'https://genosys.ae/brand',
    languages: {
      'en': 'https://genosys.ae/brand',
      'ar': 'https://genosys.ae/ar/brand',
      'ru': 'https://genosys.ae/ru/brand',
      'x-default': 'https://genosys.ae/brand',
    },
  },
}

export default function BrandPage() {
  return (
    <>
      <BreadcrumbSchema 
        items={[
          { name: 'Home', url: '/' },
          { name: 'Brand', url: '/brand' }
        ]}
      />
      <BrandPageClient />
    </>
  )
}