import BreadcrumbSchema from '@/components/schema/BreadcrumbSchema'
import type { Metadata } from 'next'
import LocationsPageClient from './LocationsPageClient'

export const metadata: Metadata = {
  title: 'GENOSYS Locations - Serving All UAE Emirates | Genosys Middle East FZ-LLC',
  description: 'GENOSYS Middle East FZ-LLC delivers professional Korean dermacosmetics to all UAE emirates: Dubai, Abu Dhabi, Sharjah, Ajman, Ras Al Khaimah, Fujairah, and Umm Al Quwain.',
  keywords: [
    'GENOSYS locations UAE',
    'Korean dermacosmetics Dubai',
    'GENOSYS Abu Dhabi',
    'GENOSYS Sharjah',
    'UAE skincare delivery'
  ],
  openGraph: {
    title: 'GENOSYS Locations - Serving All UAE Emirates',
    description: 'GENOSYS Middle East FZ-LLC delivers professional Korean dermacosmetics to all UAE emirates.',
    type: 'website',
    url: 'https://genosys.ae/locations',
    siteName: 'GENOSYS Middle East FZ-LLC',
    locale: 'en_AE',
    images: [
      {
        url: '/images/genosys-products.jpg',
        width: 1200,
        height: 630,
        alt: 'GENOSYS Locations UAE',
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
    title: 'GENOSYS Locations - Serving All UAE Emirates',
    description: 'GENOSYS Middle East FZ-LLC delivers professional Korean dermacosmetics to all UAE emirates.',
    images: ['/images/genosys-products.jpg'],
  },
  alternates: {
    canonical: 'https://genosys.ae/locations',
    languages: {
      'en': 'https://genosys.ae/locations',
      'ar': 'https://genosys.ae/ar/locations',
      'ru': 'https://genosys.ae/ru/locations',
    },
  },
}

export default function LocationsPage() {
  return (
    <>
      <BreadcrumbSchema 
        items={[
          { name: 'Home', url: '/' },
          { name: 'Locations', url: '/locations' }
        ]}
      />
      <LocationsPageClient />
    </>
  )
}

