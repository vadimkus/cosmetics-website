import Hero from '@/components/Hero'
import HomeDesktopSections from '@/components/home/HomeDesktopSections'
import BreadcrumbSchema from '@/components/schema/BreadcrumbSchema'
import SpeakableSchema from '@/components/schema/SpeakableSchema'
import ArticleDateSchema from '@/components/schema/ArticleDateSchema'
import GeoFaqSchema, { GENOSYS_FAQ_AR } from '@/components/schema/GeoFaqSchema'
import HomeItemListSchema from '@/components/schema/HomeItemListSchema'
import MobileRedirect from '@/components/MobileRedirect'
import { getHomeData, HOME_CATEGORY_SLUGS } from '@/lib/homeData'
import type { Metadata } from 'next'

// Revalidate every 5 minutes — matches `/` so all three locale homepages
// hit the same cached product data.
export const revalidate = 300

export const metadata: Metadata = {
  title: 'GENOSYS | الموزع الرسمي لمستحضرات التجميل الكورية الاحترافية في الإمارات',
  description: 'الموزع الرسمي لمستحضرات التجميل الكورية الاحترافية GENOSYS في الإمارات. رولرات الميكرونيدلينغ ومنتجات العناية بالبشرة وعلاجات التجميل. شحن مجاني للطلبات فوق 1000 درهم. دبي، أبوظبي، الشارقة.',
  keywords: [
    'GENOSYS الإمارات',
    'مستحضرات التجميل الكورية دبي',
    'العناية بالبشرة الاحترافية الإمارات',
    'رولرات الميكرونيدلينغ دبي',
    'منتجات التجميل الكورية الإمارات',
    'موزع GENOSYS الإمارات',
    'العناية بالبشرة الاحترافية دبي',
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
    title: 'GENOSYS | الموزع الرسمي لمستحضرات التجميل الكورية الاحترافية في الإمارات',
    description: 'الموزع الرسمي لمستحضرات التجميل الكورية الاحترافية GENOSYS في الإمارات. رولرات الميكرونيدلينغ ومنتجات العناية بالبشرة وعلاجات التجميل. شحن مجاني للطلبات فوق 1000 درهم.',
    type: 'website',
    url: 'https://genosys.ae/ar',
    siteName: 'GENOSYS',
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
    title: 'GENOSYS | الموزع الرسمي لمستحضرات التجميل الكورية الاحترافية في الإمارات',
    description: 'اكتشف مستحضرات التجميل الكورية المميزة من GENOSYS. الموزع الرسمي في الإمارات.',
    images: ['https://genosys.ae/images/genosys-products.jpg'],
  },
  alternates: {
    canonical: 'https://genosys.ae/ar',
    languages: {
      'ar': 'https://genosys.ae/ar',
      'en': 'https://genosys.ae',
      'ru': 'https://genosys.ae/ru',
      'x-default': 'https://genosys.ae',
    },
  },
}

export default async function ArabicHome() {
  // Same cached payload as `/` — featured products + category tile imagery.
  const { featured, categoryImages, categoryCounts, concernCounts } = await getHomeData()

  return (
    <MobileRedirect to="/ar/products">
      <div className="bg-gradient-to-b from-white to-gray-50 flex-1 flex flex-col" dir="rtl">
        <BreadcrumbSchema
          items={[
            { name: 'الرئيسية', url: '/ar' }
          ]}
        />
        <SpeakableSchema url="/ar" />
        <ArticleDateSchema
          datePublished="2024-01-01T00:00:00.000Z"
          dateModified={new Date().toISOString()}
          url="https://genosys.ae/ar"
        />
        <GeoFaqSchema items={GENOSYS_FAQ_AR} pageUrl="/ar" language="ar" />
        <HomeItemListSchema
          locale="ar"
          featuredCategorySlugs={HOME_CATEGORY_SLUGS}
          featuredProducts={featured}
        />
        <Hero initialLocale="ar" initialDir="rtl" />
        <HomeDesktopSections
          locale="ar"
          dir="rtl"
          featuredProducts={featured}
          categoryImages={categoryImages}
          categoryCounts={categoryCounts}
          concernCounts={concernCounts}
        />
      </div>
    </MobileRedirect>
  )
}
