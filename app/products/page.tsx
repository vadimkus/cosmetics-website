import type { Metadata } from 'next'
import ProductsPageClient from './ProductsPageClient'
import BreadcrumbSchema from '@/components/BreadcrumbSchema'

export const metadata: Metadata = {
  title: 'GENOSYS Products - Professional Korean Dermacosmetics | Genosys Middle East FZ-LLC',
  description: 'Explore our complete collection of professional Korean dermacosmetics. Premium skincare products for professional and home use. Microneedling devices, serums, creams, and more.',
  keywords: 'GENOSYS products, Korean dermacosmetics, professional skincare, microneedling, serums, creams, UAE cosmetics',
  openGraph: {
    title: 'GENOSYS Products - Professional Korean Dermacosmetics',
    description: 'Explore our complete collection of professional Korean dermacosmetics. Premium skincare products for professional and home use.',
    type: 'website',
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
    site: '@genosys_me',
    creator: '@genosys_me',
    title: 'GENOSYS Products - Professional Korean Dermacosmetics',
    description: 'Explore our complete collection of professional Korean dermacosmetics. Premium skincare products for professional and home use.',
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