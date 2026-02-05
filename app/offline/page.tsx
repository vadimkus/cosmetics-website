import OfflineClient from './OfflineClient'
import BreadcrumbSchema from '@/components/schema/BreadcrumbSchema'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Offline Mode - GENOSYS Professional Korean Dermacosmetics | Genosys Middle East FZ-LLC',
  description: 'You are currently offline. GENOSYS website is available in offline mode. Browse cached content and reconnect when internet is available.',
  keywords: 'GENOSYS offline, Korean dermacosmetics offline, professional skincare offline, offline mode, cached content',
  openGraph: {
    title: 'Offline Mode - GENOSYS Professional Korean Dermacosmetics',
    description: 'You are currently offline. GENOSYS website is available in offline mode.',
    type: 'website',
    images: [
      {
        url: '/images/genosys-products.jpg',
        width: 1200,
        height: 630,
        alt: 'GENOSYS Offline Mode',
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
    title: 'Offline Mode - GENOSYS Professional Korean Dermacosmetics',
    description: 'You are currently offline. GENOSYS website is available in offline mode.',
    images: ['/images/genosys-products.jpg'],
  },
  alternates: {
    canonical: 'https://genosys.ae/offline',
  },
}

export default function OfflinePage() {
  return (
    <>
      <BreadcrumbSchema 
        items={[
          { name: 'Home', url: '/' },
          { name: 'Offline', url: '/offline' }
        ]}
      />
      <OfflineClient />
    </>
  )
}
