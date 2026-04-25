import Hero from '@/components/Hero'
import HomeDesktopSections from '@/components/home/HomeDesktopSections'
import BreadcrumbSchema from '@/components/schema/BreadcrumbSchema'
import SpeakableSchema from '@/components/schema/SpeakableSchema'
import ArticleDateSchema from '@/components/schema/ArticleDateSchema'
import GeoFaqSchema, { GENOSYS_FAQ_RU } from '@/components/schema/GeoFaqSchema'
import HomeItemListSchema from '@/components/schema/HomeItemListSchema'
import MobileRedirect from '@/components/MobileRedirect'
import { getHomeData, HOME_CATEGORY_SLUGS } from '@/lib/homeData'
import type { Metadata } from 'next'

// Revalidate every 5 minutes — matches `/` so all three locale homepages
// hit the same cached product data.
export const revalidate = 300

export const metadata: Metadata = {
  title: 'GENOSYS | Официальный дистрибьютор корейской дерматокосметики в ОАЭ',
  description: 'Официальный дистрибьютор профессиональной корейской дерматокосметики GENOSYS в ОАЭ. Премиальные устройства для микронидлинга, продукты для ухода за кожей и косметические процедуры. Бесплатная доставка при заказе свыше 1000 дирхамов. Дубай, Абу-Даби, Шарджа.',
  keywords: [
    'GENOSYS ОАЭ',
    'Корейская дерматокосметика Дубай',
    'Профессиональный уход за кожей ОАЭ',
    'Устройства для микронидлинга Дубай',
    'Корейские продукты красоты ОАЭ',
    'Дистрибьютор GENOSYS ОАЭ',
    'Профессиональный уход за кожей Дубай',
    'Корейская косметика Абу-Даби',
    'Дерматокосметика Шарджа',
    'Косметические устройства ОАЭ',
    'GENOSYS Ближний Восток',
    'Корейский уход за кожей ОАЭ'
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
    title: 'GENOSYS | Официальный дистрибьютор корейской дерматокосметики в ОАЭ',
    description: 'Официальный дистрибьютор профессиональной корейской дерматокосметики GENOSYS в ОАЭ. Премиальные устройства для микронидлинга, продукты для ухода за кожей и косметические процедуры. Бесплатная доставка при заказе свыше 1000 дирхамов.',
    type: 'website',
    url: 'https://genosys.ae/ru',
    siteName: 'GENOSYS',
    images: [
      {
        url: 'https://genosys.ae/images/genosys-products.jpg',
        width: 1200,
        height: 630,
        alt: 'Премиальная корейская дерматокосметика GENOSYS',
      },
    ],
    locale: 'ru_AE',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@genosys_official',
    creator: '@genosys_official',
    title: 'GENOSYS | Официальный дистрибьютор корейской дерматокосметики в ОАЭ',
    description: 'Откройте для себя премиальную корейскую дерматокосметику от GENOSYS. Официальный дистрибьютор в ОАЭ.',
    images: ['https://genosys.ae/images/genosys-products.jpg'],
  },
  alternates: {
    canonical: 'https://genosys.ae/ru',
    languages: {
      'en': 'https://genosys.ae',
      'ar': 'https://genosys.ae/ar',
      'ru': 'https://genosys.ae/ru',
    },
  },
}

export default async function RussianHome() {
  // Same cached payload as `/` — featured products + category tile imagery.
  // Previously this page rendered only <Hero />, which meant RU desktop users
  // (and Google / AI crawlers in Russian) saw ~70% less indexable content than
  // English. Adding <HomeDesktopSections /> brings all three locales to parity.
  const { featured, categoryImages } = await getHomeData()

  return (
    <MobileRedirect to="/ru/products">
      <div className="bg-gradient-to-b from-white to-gray-50 flex-1 flex flex-col" dir="ltr">
        <BreadcrumbSchema
          items={[
            { name: 'Главная', url: '/ru' }
          ]}
        />
        <SpeakableSchema url="/ru" />
        <ArticleDateSchema
          datePublished="2024-01-01T00:00:00.000Z"
          dateModified={new Date().toISOString()}
          url="https://genosys.ae/ru"
        />
        <GeoFaqSchema items={GENOSYS_FAQ_RU} pageUrl="/ru" language="ru" />
        <HomeItemListSchema
          locale="ru"
          featuredCategorySlugs={HOME_CATEGORY_SLUGS}
          featuredProducts={featured}
        />
        <Hero initialLocale="ru" initialDir="ltr" />
        <HomeDesktopSections
          locale="ru"
          dir="ltr"
          featuredProducts={featured}
          categoryImages={categoryImages}
        />
      </div>
    </MobileRedirect>
  )
}



