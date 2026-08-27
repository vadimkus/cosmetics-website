import type { Metadata } from 'next'
import { Suspense } from 'react'
import ProductsPageClient from './ProductsPageClient'
import ConcernShowcase from '@/components/concerns/ConcernShowcase'
import { getConcernCounts } from '@/lib/concernCounts'
import { ceraSerif } from '@/components/product/cerabarrier/ceraFont'
import BreadcrumbSchema from '@/components/schema/BreadcrumbSchema'
import ProductsListSchema from '@/components/schema/ProductsListSchema'
import { ProductsErrorBoundary } from '@/components/error-boundaries'
import { getProductsListCached } from '@/lib/productsDb'
import ProductsLoading from './loading'

// Revalidate products every 60 seconds
export const revalidate = 60

export const metadata: Metadata = {
  title: 'GENOSYS Products - Korean Dermacosmetics UAE',
  description: 'Shop GENOSYS professional Korean dermacosmetics. Complete collection of microneedling devices, serums, creams, masks & skincare solutions. Official distributor in UAE. Free shipping over 1000 AED.',
  keywords: [
    'GENOSYS products',
    'Korean dermacosmetics',
    'professional skincare UAE',
    'microneedling devices',
    'Korean skincare products',
    'serums UAE',
    'beauty creams Dubai',
    'professional skincare Dubai',
    'Korean cosmetics UAE'
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
    title: 'GENOSYS Products - Korean Dermacosmetics UAE',
    description: 'Shop GENOSYS professional Korean dermacosmetics. Complete collection of microneedling devices, serums, creams, masks & skincare solutions.',
    type: 'website',
    url: 'https://genosys.ae/products',
    siteName: 'GENOSYS',
    locale: 'en_AE',
    images: [
      {
        url: 'https://genosys.ae/images/genosys-products.jpg',
        width: 1200,
        height: 630,
        alt: 'GENOSYS Products Collection',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@genosys_official',
    creator: '@genosys_official',
    title: 'GENOSYS Products - Korean Dermacosmetics UAE',
    description: 'Shop GENOSYS professional Korean dermacosmetics. Complete collection of microneedling devices, serums, creams, and more.',
    images: ['https://genosys.ae/images/genosys-products.jpg'],
  },
  alternates: {
    canonical: 'https://genosys.ae/products',
    languages: {
      'en': 'https://genosys.ae/products',
      'ar': 'https://genosys.ae/ar/products',
      'ru': 'https://genosys.ae/ru/products',
      'x-default': 'https://genosys.ae/products',
    },
  },
}

/**
 * ProductsPage - Server Component with Streaming
 * 
 * Fetches products on the server and passes them to the client component.
 * Uses Suspense for streaming to improve initial load time.
 */
export default async function ProductsPage() {
  // Fetch products on the server (cached for 60 seconds)
  const products = await getProductsListCached()
  const concernCounts = await getConcernCounts()

  return (
    <>
      <BreadcrumbSchema 
        items={[
          { name: 'Home', url: '/' },
          { name: 'Products', url: '/products' }
        ]}
      />
      {/* CollectionPage + ItemList JSON-LD so the /products listing is
          eligible for Google's product-list rich results (category/concern
          pages already have their own CollectionPageSchema). */}
      <ProductsListSchema products={products} />
      <ProductsErrorBoundary>
        <Suspense fallback={<ProductsLoading />}>
          <ProductsPageClient initialProducts={products} concernCounts={concernCounts} />
        </Suspense>
      </ProductsErrorBoundary>

      {/* Shop by Concern - the same showcase the homepage runs, wrapped in a
          cera-page shell because this block renders on the server, outside the
          products client component. Hidden below sm; still in the DOM for crawlers. */}
      <section
        data-products-concern-section
        className={`cera-page genosys-page ${ceraSerif.variable} hidden border-t border-[var(--cera-line)] px-4 py-14 sm:block`}
        aria-labelledby="products-concern-heading"
        dir="ltr"
      >
        <ConcernShowcase
          locale="en"
          dir="ltr"
          concernCounts={concernCounts}
          headingId="products-concern-heading"
        />
      </section>
    </>
  )
}