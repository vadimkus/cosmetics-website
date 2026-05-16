import BreadcrumbSchema from '@/components/schema/BreadcrumbSchema'
import BrandPageClient from '../../brand/BrandPageClient'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'قصة علامة GENOSYS - نظام إعادة ولادة الجينات',
  description: 'اكتشف GENOSYS، أول علامة تجارية مخصصة للوخز بالإبر الدقيقة في العالم. نظام إعادة ولادة الجينات يجمع بين الوخز بالإبر الدقيقة ومستحضرات التجميل المصممة خصيصاً.',
  keywords: [
    'GENOSYS',
    'نظام إعادة ولادة الجينات',
    'الوخز بالإبر الدقيقة',
    'مستحضرات التجميل الكورية',
    'العناية بالبشرة الاحترافية'
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
    title: 'قصة علامة GENOSYS - نظام إعادة ولادة الجينات',
    description: 'اكتشف GENOSYS، أول علامة تجارية مخصصة للوخز بالإبر الدقيقة في العالم. نظام إعادة ولادة الجينات يجمع بين الوخز بالإبر الدقيقة ومستحضرات التجميل المصممة خصيصاً.',
    type: 'website',
    url: 'https://genosys.ae/ar/brand',
    siteName: 'GENOSYS',
    images: [
      {
        url: 'https://genosys.ae/images/genosys-products.jpg',
        width: 1200,
        height: 630,
        alt: 'GENOSYS مستحضرات التجميل الكورية الاحترافية',
      },
    ],
    locale: 'ar_AE',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@genosys_official',
    creator: '@genosys_official',
    title: 'قصة علامة GENOSYS - نظام إعادة ولادة الجينات',
    description: 'اكتشف GENOSYS، أول علامة تجارية مخصصة للوخز بالإبر الدقيقة في العالم.',
    images: ['https://genosys.ae/images/genosys-products.jpg'],
  },
  alternates: {
    canonical: 'https://genosys.ae/ar/brand',
    languages: {
      'ar': 'https://genosys.ae/ar/brand',
      'en': 'https://genosys.ae/brand',
      'ru': 'https://genosys.ae/ru/brand',
    },
  },
}

export default function ArabicBrandPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'الرئيسية', url: '/ar' },
          { name: 'العلامة التجارية', url: '/ar/brand' }
        ]}
      />
      <BrandPageClient />
    </>
  )
}

