import type { Metadata } from 'next'
import ProductsPageClient from './ProductsPageClient'
import BreadcrumbSchema from '@/components/BreadcrumbSchema'

export const metadata: Metadata = {
  title: 'GENOSYS Products - Professional Korean Dermacosmetics Collection UAE',
  description: 'Shop GENOSYS professional Korean dermacosmetics. Complete collection of microneedling devices, serums, creams, masks & skincare solutions. Official distributor in UAE. Free shipping over 1000 AED.',
  keywords: [
    'GENOSYS products',
    'Korean dermacosmetics',
    'professional skincare UAE',
    'microneedling devices',
    'Korean skincare products',
    'serums UAE',
    'beauty creams Dubai',
    'professional skincare Dubai',
    'Korean cosmetics UAE'
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
    title: 'GENOSYS Products - Professional Korean Dermacosmetics Collection UAE',
    description: 'Shop GENOSYS professional Korean dermacosmetics. Complete collection of microneedling devices, serums, creams, masks & skincare solutions.',
    type: 'website',
    url: 'https://genosys.ae/products',
    images: [
      {
        url: '/images/genosys-products.jpg',
        width: 1200,
        height: 630,
        alt: 'GENOSYS Products Collection',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@genosys_official',
    creator: '@genosys_official',
    title: 'GENOSYS Products - Professional Korean Dermacosmetics Collection UAE',
    description: 'Shop GENOSYS professional Korean dermacosmetics. Complete collection of microneedling devices, serums, creams, and more.',
    images: ['/images/genosys-products.jpg'],
  },
  alternates: {
    canonical: 'https://genosys.ae/products',
  },
}

export default function ProductsPage() {
  return (
    <>
      <BreadcrumbSchema 
        items={[
          { name: 'Home', url: '/' },
          { name: 'Products', url: '/products' }
        ]}
      />
      <ProductsPageClient />
    </>
  )
}