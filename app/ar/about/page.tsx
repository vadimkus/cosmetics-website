import type { Metadata } from 'next'
import BreadcrumbSchema from '@/components/schema/BreadcrumbSchema'
import AboutPageClient from '../../about/AboutPageClient'

export const metadata: Metadata = {
  title: 'من نحن - GENOSYS Middle East FZ-LLC | الموزع الرسمي لمستحضرات التجميل الكورية الاحترافية',
  description: 'تعرف على شركة GENOSYS الشرق الأوسط FZ-LLC، الموزع الرسمي لشركة DTSMG Co., Ltd كوريا في الإمارات. مستحضرات تجميل كورية احترافية معتمدة من بلدية دبي.',
  keywords: [
    'GENOSYS الشرق الأوسط',
    'موزع مستحضرات التجميل الكورية',
    'DTSMG كوريا',
    'معتمد من بلدية دبي',
    'موزع مستحضرات التجميل الإمارات'
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
    title: 'من نحن - GENOSYS Middle East FZ-LLC | الموزع الرسمي لمستحضرات التجميل الكورية الاحترافية',
    description: 'تعرف على شركة GENOSYS الشرق الأوسط FZ-LLC، الموزع الرسمي لشركة DTSMG Co., Ltd كوريا في الإمارات. مستحضرات تجميل كورية احترافية معتمدة من بلدية دبي.',
    type: 'website',
    images: [
      {
        url: 'https://genosys.ae/images/genosys-logo.png',
        width: 400,
        height: 400,
        alt: 'شعار GENOSYS Middle East FZ-LLC',
      },
    ],
    url: 'https://genosys.ae/ar/about',
    siteName: 'GENOSYS',
    locale: 'ar_AE',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@genosys_official',
    creator: '@genosys_official',
    title: 'من نحن - GENOSYS Middle East FZ-LLC | الموزع الرسمي لمستحضرات التجميل الكورية الاحترافية',
    description: 'تعرف على شركة GENOSYS الشرق الأوسط FZ-LLC، الموزع الرسمي لشركة DTSMG Co., Ltd كوريا في الإمارات.',
    images: ['https://genosys.ae/images/genosys-logo.png'],
  },
  alternates: {
    canonical: 'https://genosys.ae/ar/about',
    languages: {
      'en': 'https://genosys.ae/about',
      'ar': 'https://genosys.ae/ar/about',
      'ru': 'https://genosys.ae/ru/about',
      'x-default': 'https://genosys.ae/about',
    },
  },
}

export default function ArabicAboutPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'الرئيسية', url: '/ar' },
          { name: 'من نحن', url: '/ar/about' },
        ]}
      />
      <AboutPageClient />
    </>
  )
}

