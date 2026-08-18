import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { unstable_cache } from 'next/cache'
import { getCategoryBySlug, getAllCategorySlugs } from '@/lib/concernsData'
import { getProductsByCategory } from '@/lib/productsDb'
import ConcernProductGrid from '@/components/ConcernProductGrid'
import BreadcrumbSchema from '@/components/schema/BreadcrumbSchema'
import CollectionPageSchema from '@/components/schema/CollectionPageSchema'
import type { Product } from '@/types'
import { ceraSerif } from '@/components/product/cerabarrier/ceraFont'
import '@/components/product/cerabarrier/cerabarrier.css'
import '@/components/editorial/editorial.css'

export const revalidate = 3600
// Unknown slugs return a genuine 404 (not a soft 404) — matches the EN route.
export const dynamicParams = false

export function generateStaticParams() {
  return getAllCategorySlugs().map(slug => ({ slug }))
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  const category = getCategoryBySlug(slug)
  if (!category) return {}
  
  const seo = category.seo.ar
  const baseUrl = 'https://genosys.ae'
  
  return {
    title: seo.title,
    description: seo.description,
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 },
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      type: 'website',
      url: `${baseUrl}/ar/products/category/${slug}`,
      siteName: 'GENOSYS',
      locale: 'ar_AE',
      images: [{ url: `${baseUrl}/images/genosys-products.jpg`, width: 1200, height: 630, alt: seo.h1 }],
    },
    alternates: {
      canonical: `${baseUrl}/ar/products/category/${slug}`,
      languages: {
        'en': `${baseUrl}/products/category/${slug}`,
        'ar': `${baseUrl}/ar/products/category/${slug}`,
        'ru': `${baseUrl}/ru/products/category/${slug}`,
        'x-default': `${baseUrl}/products/category/${slug}`,
      },
    },
  }
}

const getCategoryProducts = unstable_cache(
  async (categoryKey: string): Promise<Product[]> => {
    return getProductsByCategory(categoryKey)
  },
  ['category-products'],
  { revalidate: 3600, tags: ['products'] }
)

export default async function ArabicCategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const category = getCategoryBySlug(slug)
  if (!category) notFound()
  
  const products = await getCategoryProducts(category.categoryKey)
  // Empty category = thin content (Soft 404). Return a real 404 instead.
  if (products.length === 0) notFound()
  const seo = category.seo.ar

  return (
    <div className={`cera-page genosys-page ${ceraSerif.variable} min-h-screen`} dir="rtl">
      <BreadcrumbSchema
        items={[
          { name: 'الرئيسية', url: '/ar' },
          { name: 'المنتجات', url: '/ar/products' },
          { name: seo.h1, url: `/ar/products/category/${slug}` },
        ]}
      />
      {products.length > 0 && (
        <CollectionPageSchema
          name={seo.h1}
          description={seo.description}
          url={`https://genosys.ae/ar/products/category/${slug}`}
          products={products}
        />
      )}

      <section className="px-4 py-12 sm:py-16">
        <div className="max-w-6xl mx-auto text-center">
          <nav className="text-sm text-[var(--cera-muted)] mb-4">
            <Link href="/ar" className="hover:text-[var(--cera-body)]">الرئيسية</Link>
            <span className="mx-2">/</span>
            <Link href="/ar/products" className="hover:text-[var(--cera-body)]">المنتجات</Link>
            <span className="mx-2">/</span>
            <span className="text-[var(--cera-ink)]">{seo.h1}</span>
          </nav>
          <h1 className="cera-serif mb-4 text-[34px] leading-[1.08] text-[var(--cera-ink)] sm:text-[42px] lg:text-[52px]">{seo.h1}</h1>
          <p className="text-lg text-[var(--cera-body)] max-w-3xl mx-auto leading-relaxed">{seo.description}</p>
        </div>
      </section>

      <section className="py-8 sm:py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="cera-serif mb-6 text-[24px] leading-tight text-[var(--cera-ink)] sm:text-[30px]">{seo.h1} ({products.length})</h2>
          <ConcernProductGrid products={products} locale="ar" dir="rtl" />
        </div>
      </section>

      <section className="py-6 px-4">
        <div className="max-w-6xl mx-auto">
          <Link href="/ar/products" className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium">
            <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            تصفح جميع المنتجات
          </Link>
        </div>
      </section>
    </div>
  )
}
