import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { unstable_cache } from 'next/cache'
import { getConcernBySlug, getAllConcernSlugs, CONCERN_PAGES } from '@/lib/concernsData'
import { getProductsByConcern } from '@/lib/productsDb'
import ConcernProductGrid from '@/components/ConcernProductGrid'
import BreadcrumbSchema from '@/components/schema/BreadcrumbSchema'
import CollectionPageSchema from '@/components/schema/CollectionPageSchema'
import GeoFaqSchema from '@/components/schema/GeoFaqSchema'
import type { Product } from '@/types'

export const revalidate = 3600 // Revalidate every hour

// Pre-generate all concern pages at build time
export function generateStaticParams() {
  return getAllConcernSlugs().map(slug => ({ slug }))
}

// Dynamic metadata based on the slug
export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  const concern = getConcernBySlug(slug)
  if (!concern) return {}
  
  const seo = concern.seo.en
  const baseUrl = 'https://genosys.ae'
  
  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
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
      title: seo.title,
      description: seo.description,
      type: 'website',
      url: `${baseUrl}/products/concern/${slug}`,
      siteName: 'GENOSYS Middle East FZ-LLC',
      locale: 'en_AE',
      images: [{
        url: `${baseUrl}/images/genosys-products.jpg`,
        width: 1200,
        height: 630,
        alt: seo.h1,
      }],
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.title,
      description: seo.description,
      images: [`${baseUrl}/images/genosys-products.jpg`],
    },
    alternates: {
      canonical: `${baseUrl}/products/concern/${slug}`,
      languages: {
        'en': `${baseUrl}/products/concern/${slug}`,
        'ar': `${baseUrl}/ar/products/concern/${slug}`,
        'ru': `${baseUrl}/ru/products/concern/${slug}`,
        'x-default': `${baseUrl}/products/concern/${slug}`,
      },
    },
  }
}

// Cached product fetch
const getConcernProducts = unstable_cache(
  async (concernKeys: string[], categoryFallbacks: string[]): Promise<Product[]> => {
    return getProductsByConcern(concernKeys, categoryFallbacks)
  },
  ['concern-products'],
  { revalidate: 3600, tags: ['products'] }
)

export default async function ConcernPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const concern = getConcernBySlug(slug)
  if (!concern) notFound()
  
  const products = await getConcernProducts(concern.concernKeys, concern.categoryFallbacks)
  const seo = concern.seo.en
  const faq = concern.faq.en
  
  // Get related concerns for cross-linking
  const relatedConcerns = concern.relatedConcerns
    .map(s => CONCERN_PAGES.find(c => c.slug === s))
    .filter(Boolean)

  return (
    <div className="min-h-screen bg-white">
      {/* Structured Data */}
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: '/' },
          { name: 'Products', url: '/products' },
          { name: seo.h1, url: `/products/concern/${slug}` },
        ]}
      />
      {products.length > 0 && (
        <CollectionPageSchema
          name={seo.h1}
          description={seo.description}
          url={`https://genosys.ae/products/concern/${slug}`}
          products={products}
        />
      )}
      <GeoFaqSchema items={faq} pageUrl={`/products/concern/${slug}`} language="en" />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-12 sm:py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <nav className="text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:text-gray-700">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/products" className="hover:text-gray-700">Products</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">{seo.h1}</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            {seo.h1}
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {seo.intro}
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-8 sm:py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-6">
            Recommended Products ({products.length})
          </h2>
          <ConcernProductGrid products={products} locale="en" />
        </div>
      </section>

      {/* FAQ Section (visible to users AND structured data for AI) */}
      {faq.length > 0 && (
        <section className="py-8 sm:py-12 px-4 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-6">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {faq.map((item, i) => (
                <details key={i} className="bg-white rounded-lg border border-gray-200 overflow-hidden group">
                  <summary className="px-6 py-4 cursor-pointer font-medium text-gray-900 hover:bg-gray-50 list-none flex items-center justify-between">
                    {item.question}
                    <svg className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="px-6 pb-4 text-gray-600 leading-relaxed">
                    {item.answer}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related Concerns (Cross-linking for SEO) */}
      {relatedConcerns.length > 0 && (
        <section className="py-8 sm:py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-6">
              Related Skin Concerns
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relatedConcerns.map(related => related && (
                <Link
                  key={related.slug}
                  href={`/products/concern/${related.slug}`}
                  className="block p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border border-gray-100"
                >
                  <h3 className="font-semibold text-gray-900 mb-1">{related.seo.en.h1}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2">{related.seo.en.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
