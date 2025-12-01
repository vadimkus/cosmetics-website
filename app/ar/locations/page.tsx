import type { Metadata } from 'next'
import ArabicLocationsPageClient from './ArabicLocationsPageClient'

export const metadata: Metadata = {
  title: 'مواقع GENOSYS - خدمة جميع إمارات الإمارات | Genosys Middle East FZ-LLC',
  description: 'GENOSYS الشرق الأوسط FZ-LLC يقدم مستحضرات التجميل الكورية المهنية إلى جميع إمارات الإمارات: دبي، أبوظبي، الشارقة، عجمان، رأس الخيمة، الفجيرة، وأم القيوين.',
  keywords: [
    'مواقع GENOSYS الإمارات',
    'مستحضرات التجميل الكورية دبي',
    'GENOSYS أبوظبي',
    'GENOSYS الشارقة',
    'توصيل العناية بالبشرة الإمارات'
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
    title: 'مواقع GENOSYS - خدمة جميع إمارات الإمارات',
    description: 'GENOSYS الشرق الأوسط FZ-LLC يقدم مستحضرات التجميل الكورية المهنية إلى جميع إمارات الإمارات.',
    type: 'website',
    images: [
      {
        url: '/images/genosys-products.jpg',
        width: 1200,
        height: 630,
        alt: 'مواقع GENOSYS الإمارات',
      },
    ],
    url: 'https://genosys.ae/ar/locations',
    siteName: 'GENOSYS الشرق الأوسط FZ-LLC',
    locale: 'ar_AE',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@genosys_official',
    creator: '@genosys_official',
    title: 'مواقع GENOSYS - خدمة جميع إمارات الإمارات',
    description: 'GENOSYS الشرق الأوسط FZ-LLC يقدم مستحضرات التجميل الكورية المهنية إلى جميع إمارات الإمارات.',
    images: ['/images/genosys-products.jpg'],
  },
  alternates: {
    canonical: 'https://genosys.ae/ar/locations',
    languages: {
      'en': 'https://genosys.ae/locations',
      'ar': 'https://genosys.ae/ar/locations',
      'ru': 'https://genosys.ae/ru/locations',
    },
  },
}

export default function ArabicLocationsPage() {
  return <ArabicLocationsPageClient />
}

