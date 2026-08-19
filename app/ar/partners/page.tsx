import type { Metadata } from 'next'
import BreadcrumbSchema from '@/components/schema/BreadcrumbSchema'
import ArabicPartnersPageClient from './ArabicPartnersPageClient'

export const metadata: Metadata = {
  title: 'شركاء GENOSYS في الإمارات - موزعو مستحضرات التجميل الكورية الموثوقون',
  description: 'اكتشف شبكة شركاء GENOSYS الموثوقين في جميع أنحاء الإمارات. موزعو مستحضرات التجميل الكورية الاحترافية في دبي وأبوظبي والشارقة والمزيد. ابحث عن شركاء GENOSYS المعتمدين بالقرب منك.',
  keywords: [
    'شركاء GENOSYS الإمارات',
    'موزعو مستحضرات التجميل الكورية دبي',
    'تجار GENOSYS المعتمدون',
    'شركاء العناية بالبشرة الاحترافية الإمارات',
    'موزعو الجمال الكوريون',
    'شركاء مستحضرات التجميل الطبية دبي',
    'موزعو GENOSYS الإمارات',
    'موزعو العناية بالبشرة الكورية',
    'شركاء صالونات التجميل دبي',
    'شركاء عيادات التجميل الإمارات'
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
    title: 'شركاء GENOSYS في الإمارات - موزعو مستحضرات التجميل الكورية الموثوقون',
    description: 'ابحث عن شركاء GENOSYS المعتمدين في جميع أنحاء الإمارات. موزعو مستحضرات التجميل الكورية الاحترافية في دبي وأبوظبي والشارقة وجميع الإمارات.',
    type: 'website',
    url: 'https://genosys.ae/ar/partners',
    siteName: 'GENOSYS',
    images: [
      {
        url: 'https://genosys.ae/images/genosys-products.jpg',
        width: 1200,
        height: 630,
        alt: 'شبكة شركاء GENOSYS في الإمارات',
      },
    ],
    locale: 'ar_AE',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@genosys_official',
    creator: '@genosys_official',
    title: 'شركاء GENOSYS في الإمارات - موزعو مستحضرات التجميل الكورية الموثوقون',
    description: 'ابحث عن شركاء GENOSYS المعتمدين في جميع أنحاء الإمارات. موزعو مستحضرات التجميل الكورية الاحترافية.',
    images: ['https://genosys.ae/images/genosys-products.jpg'],
  },
  alternates: {
    canonical: 'https://genosys.ae/ar/partners',
    languages: {
      'ar': 'https://genosys.ae/ar/partners',
      'en': 'https://genosys.ae/partners',
      'ru': 'https://genosys.ae/ru/partners',
      'x-default': 'https://genosys.ae/partners',
    },
  },
}

export default function ArabicPartnersPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'الرئيسية', url: '/ar' },
          { name: 'الشركاء', url: '/ar/partners' },
        ]}
      />
      <ArabicPartnersPageClient />
    </>
  )
}
