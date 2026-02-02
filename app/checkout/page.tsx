import CheckoutClient from './CheckoutClient'
import BreadcrumbSchema from '@/components/BreadcrumbSchema'
import { CheckoutErrorBoundary } from '@/components/error-boundaries'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Secure Checkout - GENOSYS Professional Korean Dermacosmetics | Genosys Middle East FZ-LLC',
  description: 'Complete your GENOSYS professional Korean dermacosmetics order securely. Professional discounts, UAE delivery, and secure payment processing.',
  keywords: 'GENOSYS checkout, Korean dermacosmetics checkout, professional skincare order, UAE cosmetics purchase, secure payment',
  openGraph: {
    title: 'Secure Checkout - GENOSYS Professional Korean Dermacosmetics',
    description: 'Complete your GENOSYS professional Korean dermacosmetics order securely. Professional discounts and UAE delivery.',
    type: 'website',
    images: [
      {
        url: '/images/genosys-products.jpg',
        width: 1200,
        height: 630,
        alt: 'GENOSYS Secure Checkout',
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
    title: 'Secure Checkout - GENOSYS Professional Korean Dermacosmetics',
    description: 'Complete your GENOSYS professional Korean dermacosmetics order securely.',
    images: ['/images/genosys-products.jpg'],
  },
  alternates: {
    canonical: 'https://genosys.ae/checkout',
  },
}

export default function CheckoutPage() {
  return (
    <div className="bg-white checkout-page">
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Products', url: '/products' },
          { name: 'Cart', url: '/cart' },
          { name: 'Checkout', url: '/checkout' }
        ]}
      />
      <CheckoutErrorBoundary>
        <CheckoutClient />
      </CheckoutErrorBoundary>
    </div>
  )
}