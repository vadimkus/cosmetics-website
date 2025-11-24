import type { Metadata } from 'next'
import ArabicAboutPageClient from './ArabicAboutPageClient'

export const metadata: Metadata = {
  title: 'من نحن - GENOSYS Middle East FZ-LLC | الموزع الرسمي لمستحضرات التجميل الكورية المهنية',
  description: 'تعرف على شركة GENOSYS الشرق الأوسط FZ-LLC، الموزع الرسمي لشركة DTSMG Co., Ltd كوريا في الإمارات. مستحضرات التجميل الكورية المهنية مع شهادة بلدية دبي.',
  keywords: 'GENOSYS الشرق الأوسط، موزع مستحضرات التجميل الكورية، DTSMG كوريا، معتمد من بلدية دبي، موزع مستحضرات التجميل الإمارات',
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
    title: 'من نحن - GENOSYS Middle East FZ-LLC | الموزع الرسمي لمستحضرات التجميل الكورية المهنية',
    description: 'تعرف على شركة GENOSYS الشرق الأوسط FZ-LLC، الموزع الرسمي لشركة DTSMG Co., Ltd كوريا في الإمارات. مستحضرات التجميل الكورية المهنية مع شهادة بلدية دبي.',
    type: 'website',
    images: [
      {
        url: '/images/genosys-logo.png',
        width: 400,
        height: 400,
        alt: 'شعار GENOSYS Middle East FZ-LLC',
      },
    ],
    url: 'https://genosys.ae/ar/about',
    siteName: 'GENOSYS Middle East FZ-LLC',
    locale: 'ar_AE',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@genosys_official',
    creator: '@genosys_official',
    title: 'من نحن - GENOSYS Middle East FZ-LLC | الموزع الرسمي لمستحضرات التجميل الكورية المهنية',
    description: 'تعرف على شركة GENOSYS الشرق الأوسط FZ-LLC، الموزع الرسمي لشركة DTSMG Co., Ltd كوريا في الإمارات.',
    images: ['/images/genosys-logo.png'],
  },
  alternates: {
    canonical: 'https://genosys.ae/ar/about',
    languages: {
      'en': 'https://genosys.ae/about',
      'ar': 'https://genosys.ae/ar/about',
    },
  },
}

export default function ArabicAboutPage() {
  return <ArabicAboutPageClient />
}

