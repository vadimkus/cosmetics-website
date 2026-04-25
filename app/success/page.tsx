import SuccessClient from './SuccessClient'
import BreadcrumbSchema from '@/components/schema/BreadcrumbSchema'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Order Success - GENOSYS Professional Korean Dermacosmetics | Genosys',
  description: 'Your GENOSYS professional Korean dermacosmetics order has been successfully placed. Thank you for choosing GENOSYS.',
  keywords: 'GENOSYS order success, Korean dermacosmetics order confirmed, professional skincare order, UAE cosmetics purchase success',
  openGraph: {
    title: 'Order Success - GENOSYS Professional Korean Dermacosmetics',
    description: 'Your GENOSYS professional Korean dermacosmetics order has been successfully placed.',
    type: 'website',
    images: [
      {
        url: '/images/genosys-products.jpg',
        width: 1200,
        height: 630,
        alt: 'GENOSYS Order Success',
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
    title: 'Order Success - GENOSYS Professional Korean Dermacosmetics',
    description: 'Your GENOSYS professional Korean dermacosmetics order has been successfully placed.',
    images: ['/images/genosys-products.jpg'],
  },
  alternates: {
    canonical: 'https://genosys.ae/success',
  },
}

export default function SuccessPage() {
  return (
    <>
      <BreadcrumbSchema 
        items={[
          { name: 'Home', url: '/' },
          { name: 'Success', url: '/success' }
        ]}
      />
      <SuccessClient />
    </>
  )
}
