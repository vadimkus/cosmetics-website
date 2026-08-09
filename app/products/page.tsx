import type { Metadata } from 'next'
import { Suspense } from 'react'
import { unstable_cache } from 'next/cache'
import ProductsPageClient from './ProductsPageClient'
import ConcernLinkGrid from '@/components/products/ConcernLinkGrid'
import BreadcrumbSchema from '@/components/schema/BreadcrumbSchema'
import ProductsListSchema from '@/components/schema/ProductsListSchema'
import { ProductsErrorBoundary } from '@/components/error-boundaries'
import { getAllProducts } from '@/lib/productsDb'
import type { Product } from '@/types'
import ProductsLoading from './loading'

// Revalidate products every 60 seconds
export const revalidate = 60

// Cached products fetch - revalidates every 60 seconds
const getProducts = unstable_cache(
  async (): Promise<Product[]> => {
    return getAllProducts()
  },
  ['products-list'],
  { revalidate: 60, tags: ['products'] }
)

export const metadata: Metadata = {
  title: 'GENOSYS Products - Professional Korean Dermacosmetics Collection UAE',
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
    title: 'GENOSYS Products - Professional Korean Dermacosmetics Collection UAE',
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
    title: 'GENOSYS Products - Professional Korean Dermacosmetics Collection UAE',
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
  const products = await getProducts()

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
          <ProductsPageClient initialProducts={products} />
        </Suspense>
      </ProductsErrorBoundary>

      {/* Shop by Concern - Hidden on mobile web, visible on desktop (still in DOM for crawlers) */}
      <section className="hidden sm:block bg-primary-50 py-10 px-4 mt-8 border-t border-primary-100">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Shop by Skin Concern</h2>
          <p className="text-gray-500 mb-6">Find the right products for your specific skin needs</p>
          <ConcernLinkGrid locale="en" />
        </div>
      </section>
    </>
  )
}