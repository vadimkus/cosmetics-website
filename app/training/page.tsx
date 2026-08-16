import BreadcrumbSchema from '@/components/schema/BreadcrumbSchema'
import TrainingLibrary from './TrainingLibrary'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Professional Training - GENOSYS Skincare Training',
  description: 'Professional training resources for GENOSYS skincare products. Download training documents, watch video lessons, and master professional techniques for Korean dermacosmetics.',
  keywords: [
    'GENOSYS training',
    'professional skincare training',
    'Korean dermacosmetics training',
    'microneedling training',
    'UAE skincare training'
  ],
  openGraph: {
    title: 'Professional Training - GENOSYS Skincare Training',
    description: 'Professional training resources for GENOSYS skincare products. Download training documents, watch video lessons, and master professional techniques.',
    type: 'website',
    url: 'https://genosys.ae/training',
    siteName: 'GENOSYS',
    locale: 'en_AE',
    images: [
      {
        url: 'https://genosys.ae/images/genosys-products.jpg',
        width: 1200,
        height: 630,
        alt: 'GENOSYS Professional Training',
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
    title: 'Professional Training - GENOSYS Skincare Training',
    description: 'Professional training resources for GENOSYS skincare products. Download training documents, watch video lessons, and master professional techniques.',
    images: ['https://genosys.ae/images/genosys-products.jpg'],
  },
  alternates: {
    canonical: 'https://genosys.ae/training',
    languages: {
      'en': 'https://genosys.ae/training',
      'ar': 'https://genosys.ae/ar/training',
      'ru': 'https://genosys.ae/ru/training',
    },
  },
}

export default function TrainingPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Training', url: '/training' }
        ]}
      />
      <TrainingLibrary />
    </>
  )
}
