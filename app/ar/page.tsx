import Hero from '@/components/Hero'
import BreadcrumbSchema from '@/components/schema/BreadcrumbSchema'
import SpeakableSchema from '@/components/schema/SpeakableSchema'
import GeoFaqSchema, { GENOSYS_FAQ_AR } from '@/components/schema/GeoFaqSchema'
import MobileRedirect from '@/components/MobileRedirect'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'GENOSYS Middle East FZ-LLC | الموزع الرسمي لمستحضرات التجميل الكورية المهنية في الإمارات',
  description: 'الموزع الرسمي لمستحضرات التجميل الكورية المهنية GENOSYS في الإمارات. أجهزة الوخز بالإبر الدقيقة المميزة ومنتجات العناية بالبشرة وعلاجات التجميل. شحن مجاني لأكثر من 1000 درهم. دبي، أبوظبي، الشارقة.',
  keywords: [
    'GENOSYS الإمارات',
    'مستحضرات التجميل الكورية دبي',
    'العناية بالبشرة المهنية الإمارات',
    'أجهزة الوخز بالإبر الدقيقة دبي',
    'منتجات الجمال الكورية الإمارات',
    'موزع GENOSYS الإمارات',
    'العناية بالبشرة المهنية دبي',
    'مستحضرات التجميل الكورية أبوظبي',
    'مستحضرات التجميل الطبية الشارقة',
    'أجهزة التجميل الإمارات',
    'GENOSYS الشرق الأوسط',
    'العناية بالبشرة الكورية الإمارات'
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
    title: 'GENOSYS Middle East FZ-LLC | الموزع الرسمي لمستحضرات التجميل الكورية المهنية في الإمارات',
    description: 'الموزع الرسمي لمستحضرات التجميل الكورية المهنية GENOSYS في الإمارات. أجهزة الوخز بالإبر الدقيقة المميزة ومنتجات العناية بالبشرة وعلاجات التجميل. شحن مجاني لأكثر من 1000 درهم.',
    type: 'website',
    url: 'https://genosys.ae/ar',
    siteName: 'GENOSYS Middle East FZ-LLC',
    images: [
      {
        url: 'https://genosys.ae/images/genosys-products.jpg',
        width: 1200,
        height: 630,
        alt: 'GENOSYS مستحضرات التجميل الكورية المميزة',
      },
    ],
    locale: 'ar_AE',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@genosys_official',
    creator: '@genosys_official',
    title: 'GENOSYS Middle East FZ-LLC | الموزع الرسمي لمستحضرات التجميل الكورية المهنية في الإمارات',
    description: 'اكتشف مستحضرات التجميل الكورية المميزة من GENOSYS. الموزع الرسمي في الإمارات.',
    images: ['https://genosys.ae/images/genosys-products.jpg'],
  },
  alternates: {
    canonical: 'https://genosys.ae/ar',
    languages: {
      'ar': 'https://genosys.ae/ar',
      'en': 'https://genosys.ae',
      'ru': 'https://genosys.ae/ru',
    },
  },
}

export default function ArabicHome() {
  return (
    <MobileRedirect to="/ar/products">
      <div className="bg-white" dir="rtl">
        <BreadcrumbSchema 
          items={[
            { name: 'الرئيسية', url: '/ar' }
          ]}
        />
        <SpeakableSchema url="/ar" />
        <GeoFaqSchema items={GENOSYS_FAQ_AR} pageUrl="/ar" language="ar" />
        <Hero initialLocale="ar" initialDir="rtl" />
      </div>
    </MobileRedirect>
  )
}
