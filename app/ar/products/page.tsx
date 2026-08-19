import type { Metadata } from 'next'
import BreadcrumbSchema from '@/components/schema/BreadcrumbSchema'
import ProductsPageClient from '../../products/ProductsPageClient'
import ConcernShowcase from '@/components/concerns/ConcernShowcase'
import { getConcernCounts } from '@/lib/concernCounts'
import { getProductsListCached } from '@/lib/productsDb'
import { ceraSerif } from '@/components/product/cerabarrier/ceraFont'

// Match the English route's ISR window.
export const revalidate = 60

export const metadata: Metadata = {
  title: 'منتجات GENOSYS - مجموعة مستحضرات التجميل الكورية الاحترافية في الإمارات',
  description: 'تسوق مستحضرات التجميل الكورية الاحترافية من GENOSYS. مجموعة كاملة من رولرات الميكرونيدلينغ، والسيرومات، والكريمات، والأقنعة وحلول العناية بالبشرة. الموزع الرسمي في الإمارات. شحن مجاني للطلبات فوق 1000 درهم.',
  keywords: [
    'منتجات GENOSYS',
    'مستحضرات التجميل الكورية',
    'العناية بالبشرة الاحترافية الإمارات',
    'رولرات الميكرونيدلينغ',
    'منتجات العناية بالبشرة الكورية',
    'أمصال الإمارات',
    'كريمات التجميل دبي',
    'العناية بالبشرة الاحترافية دبي',
    'مستحضرات التجميل الكورية الإمارات'
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
    title: 'منتجات GENOSYS - مجموعة مستحضرات التجميل الكورية الاحترافية في الإمارات',
    description: 'تسوق مستحضرات التجميل الكورية الاحترافية من GENOSYS. مجموعة كاملة من رولرات الميكرونيدلينغ، والسيرومات، والكريمات، والأقنعة وحلول العناية بالبشرة.',
    type: 'website',
    url: 'https://genosys.ae/ar/products',
    images: [
      {
        url: 'https://genosys.ae/images/genosys-products.jpg',
        width: 1200,
        height: 630,
        alt: 'مجموعة منتجات GENOSYS',
      },
    ],
    locale: 'ar_AE',
    siteName: 'GENOSYS',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@genosys_official',
    creator: '@genosys_official',
    title: 'منتجات GENOSYS - مجموعة مستحضرات التجميل الكورية الاحترافية في الإمارات',
    description: 'تسوق مستحضرات التجميل الكورية الاحترافية من GENOSYS. مجموعة كاملة من رولرات الميكرونيدلينغ، والسيرومات، والكريمات، والمزيد.',
    images: ['https://genosys.ae/images/genosys-products.jpg'],
  },
  alternates: {
    canonical: 'https://genosys.ae/ar/products',
    languages: {
      'en': 'https://genosys.ae/products',
      'ar': 'https://genosys.ae/ar/products',
      'ru': 'https://genosys.ae/ru/products',
      'x-default': 'https://genosys.ae/products',
    },
  },
}

export default async function ArabicProductsPage() {
  // Fetched on the server, exactly as the English route does. Leaving this to the
  // browser cost this locale a round trip and broke inbound filter links.
  const products = await getProductsListCached()
  const concernCounts = await getConcernCounts()

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'الرئيسية', url: '/ar' },
          { name: 'المنتجات', url: '/ar/products' },
        ]}
      />
      <ProductsPageClient initialProducts={products} concernCounts={concernCounts} />

      {/* Shop by Concern — the same showcase the homepage runs, wrapped in a
          cera-page shell because this block renders on the server, outside the
          products client component. Hidden below sm; still in the DOM for crawlers. */}
      <section
        data-products-concern-section
        className={`cera-page genosys-page ${ceraSerif.variable} hidden border-t border-[var(--cera-line)] px-4 py-14 sm:block`}
        aria-labelledby="products-concern-heading"
        dir="rtl"
      >
        <ConcernShowcase
          locale="ar"
          dir="rtl"
          concernCounts={concernCounts}
          headingId="products-concern-heading"
        />
      </section>
    </>
  )
}

