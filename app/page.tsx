import Hero from '@/components/Hero'
import HomeDesktopSections from '@/components/home/HomeDesktopSections'
import BreadcrumbSchema from '@/components/schema/BreadcrumbSchema'
import SpeakableSchema from '@/components/schema/SpeakableSchema'
import ArticleDateSchema from '@/components/schema/ArticleDateSchema'
import GeoFaqSchema, { GENOSYS_FAQ_EN } from '@/components/schema/GeoFaqSchema'
import HomeItemListSchema from '@/components/schema/HomeItemListSchema'
import MobileRedirect from '@/components/MobileRedirect'
import { getHomeData, HOME_CATEGORY_SLUGS } from '@/lib/homeData'
import type { Metadata } from 'next'

// Revalidate homepage data every 5 minutes. Featured products rarely change
// and we do not want to hit the DB on every request.
export const revalidate = 300

export const metadata: Metadata = {
  title: 'GENOSYS | Official Korean Dermacosmetics Distributor UAE',
  description: 'Official distributor of GENOSYS professional Korean dermacosmetics in UAE. Premium microneedling devices, skincare products & beauty treatments. Free shipping over 1000 AED. Dubai, Abu Dhabi, Sharjah.',
  keywords: [
    'GENOSYS UAE',
    'Korean dermacosmetics Dubai',
    'professional skincare UAE',
    'microneedling devices Dubai',
    'Korean beauty products UAE',
    'GENOSYS distributor UAE',
    'professional skincare Dubai',
    'Korean cosmetics Abu Dhabi',
    'dermacosmetics Sharjah',
    'beauty devices UAE',
    'GENOSYS Middle East',
    'Korean skincare UAE'
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
    title: 'GENOSYS | Official Korean Dermacosmetics Distributor UAE',
    description: 'Official distributor of GENOSYS professional Korean dermacosmetics in UAE. Premium microneedling devices, skincare products & beauty treatments. Free shipping over 1000 AED.',
    type: 'website',
    url: 'https://genosys.ae',
    siteName: 'GENOSYS',
    images: [
      {
        url: 'https://genosys.ae/images/genosys-products.jpg',
        width: 1200,
        height: 630,
        alt: 'GENOSYS Premium Korean Dermacosmetics',
      },
    ],
    locale: 'en_AE',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@genosys_official',
    creator: '@genosys_official',
    title: 'GENOSYS | Official Korean Dermacosmetics Distributor UAE',
    description: 'Official distributor of GENOSYS professional Korean dermacosmetics in UAE. Premium microneedling devices and skincare products.',
    images: ['https://genosys.ae/images/genosys-products.jpg'],
  },
  alternates: {
    canonical: 'https://genosys.ae',
    languages: {
      'en': 'https://genosys.ae',
      'ar': 'https://genosys.ae/ar',
      'ru': 'https://genosys.ae/ru',
      'x-default': 'https://genosys.ae',
    },
  },
}

export default async function Home() {
  // Fetch homepage data on the server (cached 5min). We intentionally keep
  // this outside MobileRedirect so crawlers still see a rich homepage even
  // when mobile browsers get bounced to /products.
  const { featured, categoryImages, categoryCounts, concernCounts } = await getHomeData()

  return (
    <MobileRedirect to="/products">
      <div className="bg-gradient-to-b from-white to-gray-50 flex-1 flex flex-col" dir="ltr">
        <BreadcrumbSchema
          items={[
            { name: 'Home', url: '/' }
          ]}
        />
        <SpeakableSchema url="/" />
        <ArticleDateSchema
          datePublished="2024-01-01T00:00:00.000Z"
          dateModified={new Date().toISOString()}
          url="https://genosys.ae"
        />
        <GeoFaqSchema items={GENOSYS_FAQ_EN} pageUrl="/" language="en" />
        <HomeItemListSchema
          locale="en"
          featuredCategorySlugs={HOME_CATEGORY_SLUGS}
          featuredProducts={featured}
        />
        <Hero initialLocale="en" initialDir="ltr" />
        <HomeDesktopSections
          locale="en"
          dir="ltr"
          featuredProducts={featured}
          categoryImages={categoryImages}
          categoryCounts={categoryCounts}
          concernCounts={concernCounts}
        />
      </div>
    </MobileRedirect>
  )
}
