import type { Metadata } from 'next'
import ProductsPageClient from '../../products/ProductsPageClient'
import BreadcrumbSchema from '@/components/schema/BreadcrumbSchema'
import ConcernShowcase from '@/components/concerns/ConcernShowcase'
import { getConcernCounts } from '@/lib/concernCounts'
import { ceraSerif } from '@/components/product/cerabarrier/ceraFont'

export const metadata: Metadata = {
  title: 'Продукция GENOSYS - Профессиональная корейская дерматокосметика ОАЭ',
  description: 'Магазин профессиональной корейской дерматокосметики GENOSYS. Полная коллекция устройств для микронидлинга, сывороток, кремов, масок и решений для ухода за кожей. Официальный дистрибьютор в ОАЭ. Бесплатная доставка при заказе свыше 1000 дирхамов.',
  keywords: [
    'Продукция GENOSYS',
    'Корейская дерматокосметика',
    'Профессиональный уход за кожей ОАЭ',
    'Устройства для микронидлинга',
    'Корейские продукты для ухода за кожей',
    'Сыворотки ОАЭ',
    'Косметические кремы Дубай',
    'Профессиональный уход за кожей Дубай',
    'Корейская косметика ОАЭ'
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
    title: 'Продукция GENOSYS - Профессиональная корейская дерматокосметика ОАЭ',
    description: 'Магазин профессиональной корейской дерматокосметики GENOSYS. Полная коллекция устройств для микронидлинга, сывороток, кремов, масок и решений для ухода за кожей.',
    type: 'website',
    url: 'https://genosys.ae/ru/products',
    images: [
      {
        url: 'https://genosys.ae/images/genosys-products.jpg',
        width: 1200,
        height: 630,
        alt: 'Коллекция продукции GENOSYS',
      },
    ],
    locale: 'ru_AE',
    siteName: 'GENOSYS',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@genosys_official',
    creator: '@genosys_official',
    title: 'Продукция GENOSYS - Профессиональная корейская дерматокосметика ОАЭ',
    description: 'Магазин профессиональной корейской дерматокосметики GENOSYS. Полная коллекция устройств для микронидлинга, сывороток, кремов и многое другое.',
    images: ['https://genosys.ae/images/genosys-products.jpg'],
  },
  alternates: {
    canonical: 'https://genosys.ae/ru/products',
    languages: {
      'en': 'https://genosys.ae/products',
      'ar': 'https://genosys.ae/ar/products',
      'ru': 'https://genosys.ae/ru/products',
    },
  },
}

export default async function RussianProductsPage() {
  const concernCounts = await getConcernCounts()

  return (
    <>
      <BreadcrumbSchema 
        items={[
          { name: 'Главная', url: '/ru' },
          { name: 'Продукция', url: '/ru/products' }
        ]}
      />
      <ProductsPageClient />

      {/* Shop by Concern — the same showcase the homepage runs, wrapped in a
          cera-page shell because this block renders on the server, outside the
          products client component. Hidden below sm; still in the DOM for crawlers. */}
      <section
        className={`cera-page genosys-page ${ceraSerif.variable} hidden border-t border-[var(--cera-line)] px-4 py-14 sm:block`}
        aria-labelledby="products-concern-heading"
        dir="ltr"
      >
        <ConcernShowcase
          locale="ru"
          dir="ltr"
          concernCounts={concernCounts}
          headingId="products-concern-heading"
        />
      </section>
    </>
  )
}



