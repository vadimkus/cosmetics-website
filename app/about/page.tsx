import type { Metadata } from 'next'
import AboutPageClient from './AboutPageClient'

export const metadata: Metadata = {
  title: 'About GENOSYS Middle East FZ-LLC - Official Korean Dermacosmetics Distributor',
  description: 'Learn about GENOSYS Middle East FZ-LLC, the official distributor of DTSMG Co., Ltd Korea in the UAE. Professional Korean dermacosmetics with Dubai Municipality certification.',
  keywords: 'GENOSYS Middle East, Korean dermacosmetics distributor, DTSMG Korea, Dubai Municipality certified, UAE cosmetics distributor',
  openGraph: {
    title: 'About GENOSYS Middle East FZ-LLC - Official Korean Dermacosmetics Distributor',
    description: 'Learn about GENOSYS Middle East FZ-LLC, the official distributor of DTSMG Co., Ltd Korea in the UAE. Professional Korean dermacosmetics with Dubai Municipality certification.',
    type: 'website',
    url: 'https://genosys.ae/about',
    siteName: 'GENOSYS Middle East FZ-LLC',
    locale: 'en_AE',
    images: [
      {
        url: '/images/genosys-logo.png',
        width: 400,
        height: 400,
        alt: 'GENOSYS Middle East FZ-LLC Logo',
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
    title: 'About GENOSYS Middle East FZ-LLC - Official Korean Dermacosmetics Distributor',
    description: 'Learn about GENOSYS Middle East FZ-LLC, the official distributor of DTSMG Co., Ltd Korea in the UAE.',
    images: ['/images/genosys-logo.png'],
  },
  alternates: {
    canonical: 'https://genosys.ae/about',
    languages: {
      'en': 'https://genosys.ae/about',
      'ar': 'https://genosys.ae/ar/about',
      'ru': 'https://genosys.ae/ru/about',
    },
  },
}

export default function AboutPage() {
  return <AboutPageClient />
}
