import CartClient from './CartClient'
import BreadcrumbSchema from '@/components/schema/BreadcrumbSchema'
import { CartErrorBoundary } from '@/components/error-boundaries'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Shopping Cart - GENOSYS Professional Korean Dermacosmetics | Genosys Middle East FZ-LLC',
  description: 'Review your selected GENOSYS professional Korean dermacosmetics products. Secure checkout with professional discounts and UAE delivery.',
  keywords: 'GENOSYS cart, Korean dermacosmetics cart, professional skincare cart, UAE cosmetics shopping, GENOSYS checkout',
  openGraph: {
    title: 'Shopping Cart - GENOSYS Professional Korean Dermacosmetics',
    description: 'Review your selected GENOSYS professional Korean dermacosmetics products. Secure checkout with professional discounts.',
    type: 'website',
    images: [
      {
        url: '/images/genosys-products.jpg',
        width: 1200,
        height: 630,
        alt: 'GENOSYS Shopping Cart',
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
    title: 'Shopping Cart - GENOSYS Professional Korean Dermacosmetics',
    description: 'Review your selected GENOSYS professional Korean dermacosmetics products.',
    images: ['/images/genosys-products.jpg'],
  },
  alternates: {
    canonical: 'https://genosys.ae/cart',
  },
}

export default function CartPage() {
  return (
    <div className="bg-white min-h-[100dvh] cart-page">
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Products', url: '/products' },
          { name: 'Cart', url: '/cart' }
        ]}
      />
      <CartErrorBoundary>
        <CartClient />
      </CartErrorBoundary>
    </div>
  )
}