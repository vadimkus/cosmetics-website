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

export const revalidate = 3600

export function generateStaticParams() {
  return getAllConcernSlugs().map(slug => ({ slug }))
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  const concern = getConcernBySlug(slug)
  if (!concern) return {}
  
  const seo = concern.seo.ar
  const baseUrl = 'https://genosys.ae'
  
  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 },
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      type: 'website',
      url: `${baseUrl}/ar/products/concern/${slug}`,
      siteName: 'GENOSYS الشرق الأوسط FZ-LLC',
      locale: 'ar_AE',
      images: [{ url: `${baseUrl}/images/genosys-products.jpg`, width: 1200, height: 630, alt: seo.h1 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.title,
      description: seo.description,
      images: [`${baseUrl}/images/genosys-products.jpg`],
    },
    alternates: {
      canonical: `${baseUrl}/ar/products/concern/${slug}`,
      languages: {
        'en': `${baseUrl}/products/concern/${slug}`,
        'ar': `${baseUrl}/ar/products/concern/${slug}`,
        'ru': `${baseUrl}/ru/products/concern/${slug}`,
        'x-default': `${baseUrl}/products/concern/${slug}`,
      },
    },
  }
}

const getConcernProducts = unstable_cache(
  async (concernKeys: string[], categoryFallbacks: string[]): Promise<Product[]> => {
    return getProductsByConcern(concernKeys, categoryFallbacks)
  },
  ['concern-products'],
  { revalidate: 3600, tags: ['products'] }
)

export default async function ArabicConcernPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const concern = getConcernBySlug(slug)
  if (!concern) notFound()
  
  const products = await getConcernProducts(concern.concernKeys, concern.categoryFallbacks)
  const seo = concern.seo.ar
  const faq = concern.faq.ar
  const why = concern.why?.ar
  const routine = concern.routine?.ar

  const relatedConcerns = concern.relatedConcerns
    .map(s => CONCERN_PAGES.find(c => c.slug === s))
    .filter(Boolean)

  return (
    <div className="min-h-screen bg-white" dir="rtl">
      <BreadcrumbSchema
        items={[
          { name: 'الرئيسية', url: '/ar' },
          { name: 'المنتجات', url: '/ar/products' },
          { name: seo.h1, url: `/ar/products/concern/${slug}` },
        ]}
      />
      {products.length > 0 && (
        <CollectionPageSchema
          name={seo.h1}
          description={seo.description}
          url={`https://genosys.ae/ar/products/concern/${slug}`}
          products={products}
        />
      )}
      <GeoFaqSchema items={faq} pageUrl={`/ar/products/concern/${slug}`} language="ar" />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-10 sm:py-14 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <nav className="text-sm text-gray-500 mb-4">
            <Link href="/ar" className="hover:text-gray-700">الرئيسية</Link>
            <span className="mx-2">/</span>
            <Link href="/ar/products" className="hover:text-gray-700">المنتجات</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">{seo.h1}</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            {seo.h1}
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            {seo.heroShort || seo.intro}
          </p>
        </div>
      </section>

      {/* Why Section */}
      {why && (
        <section className="px-4 pb-8 sm:pb-10">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 text-center">{why.title}</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {why.items.map((item, i) => (
                <div key={i} className="rounded-xl bg-gray-50 border border-gray-100 p-4 text-center">
                  <span className="text-2xl mb-2 block">{item.icon}</span>
                  <p className="font-semibold text-gray-900 text-sm mb-1">{item.label}</p>
                  <p className="text-xs text-gray-500 leading-relaxed">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Protocol PDF Download */}
      {concern.protocolPdf && (
        <section className="px-4 pb-8 sm:pb-10">
          <div className="max-w-4xl mx-auto">
            <a href={concern.protocolPdf.url} download
              className="group block rounded-2xl border border-gray-200 bg-gradient-to-br from-amber-50/40 to-white p-5 sm:p-6 shadow-sm hover:shadow-md hover:border-amber-200 transition-all duration-200">
              <div className="flex items-center gap-4 sm:gap-5">
                <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-amber-100 flex items-center justify-center group-hover:bg-amber-200 transition-colors">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-amber-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m.75 12l3 3m0 0l3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="text-sm sm:text-base font-semibold text-gray-900 group-hover:text-amber-800 transition-colors">{concern.protocolPdf.title.ar}</h3>
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-amber-100 text-amber-700">PDF</span>
                  </div>
                  <p className="text-gray-500 text-xs sm:text-sm leading-relaxed line-clamp-1 sm:line-clamp-none">{concern.protocolPdf.description.ar}</p>
                </div>
                <div className="flex-shrink-0 hidden sm:flex items-center gap-1.5 text-sm text-amber-700 font-medium">
                  تحميل
                  <span className="text-gray-400 font-normal text-xs">({concern.protocolPdf.fileSize})</span>
                </div>
              </div>
            </a>
          </div>
        </section>
      )}

      {/* Skincare Routine */}
      {routine && routine.length > 0 && (
        <section className="px-4 pb-8 sm:pb-12">
          <div className="max-w-4xl mx-auto">
            {routine.map((section, si) => (
              <div key={si} className={si > 0 ? 'mt-8' : ''}>
                <div className="mb-4">
                  <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">{section.title}</h2>
                  <p className="text-sm text-gray-500 mt-1">{section.subtitle}</p>
                </div>
                <div className="space-y-3">
                  {section.steps.map((step) => (
                    <details key={step.step} className="bg-white rounded-xl border border-gray-200 overflow-hidden group open:border-primary-300 open:ring-1 open:ring-primary-100 transition-all">
                      <summary className="px-5 py-4 cursor-pointer list-none flex items-center gap-3 hover:bg-gray-50 group-open:bg-primary-50/40 transition-colors">
                        <span className="flex-shrink-0 w-7 h-7 rounded-full bg-gray-900 group-open:bg-primary-600 text-white text-xs font-bold flex items-center justify-center transition-colors">{step.step}</span>
                        <div className="flex-1 min-w-0">
                          <span className="font-medium text-gray-900 group-open:text-primary-700 transition-colors">{step.title}</span>
                          <span className="text-gray-400 text-sm mr-2">({step.duration})</span>
                        </div>
                        <span className="text-xs text-gray-400 hidden sm:block ml-2 group-open:hidden">{step.summary.slice(0, 60)}…</span>
                        <svg className="w-5 h-5 text-gray-400 group-open:text-primary-500 group-open:rotate-180 transition-all flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </summary>
                      <div className="px-5 pb-5 pt-2 border-t border-gray-100">
                        <p className="text-sm text-gray-600 leading-relaxed mb-3">{step.detail}</p>
                        <div className="flex flex-wrap gap-2">
                          {step.products.map((p, pi) => (
                            <Link key={pi} href={p.url}
                              className="inline-flex items-center gap-1.5 text-xs bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg px-3 py-2 transition-colors">
                              <span className="font-medium text-gray-800">{p.name}</span>
                              <span className="text-gray-400">·</span>
                              <span className="text-gray-500">{p.price}</span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Products Grid */}
      <section className="py-8 sm:py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-6">
            المنتجات الموصى بها ({products.length})
          </h2>
          <ConcernProductGrid products={products} locale="ar" dir="rtl" />
        </div>
      </section>

      {/* Complete Your Routine — universal essentials */}
      {slug !== 'hair-loss' && (
        <section className="py-8 sm:py-10 px-4 bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 text-center">
              أكملي روتينك
            </h2>
            <p className="text-sm text-gray-500 mb-6 text-center">
              كل روتين فعال للعناية بالبشرة يبدأ بقاعدة نظيفة وينتهي بحماية من الشمس
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4" dir="rtl">
              <Link href="/ar/products/10" className="flex items-start gap-3 p-4 bg-white rounded-xl border border-gray-100 hover:border-primary-200 hover:shadow-sm transition-all">
                <span className="text-2xl flex-shrink-0">🫧</span>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">SNOW O₂ CLEANSER</h3>
                  <p className="text-xs text-gray-500 mt-0.5">غسول فقاعات الأكسجين — لطيف وفعال. استخدميه صباحاً ومساءً.</p>
                  <span className="text-xs text-primary-600 font-medium mt-1 inline-block">330 درهم ←</span>
                </div>
              </Link>
              <Link href="/ar/products/16" className="flex items-start gap-3 p-4 bg-white rounded-xl border border-gray-100 hover:border-primary-200 hover:shadow-sm transition-all">
                <span className="text-2xl flex-shrink-0">💦</span>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">SNOW BOOSTER</h3>
                  <p className="text-xs text-gray-500 mt-0.5">تونر مرطب يحضّر البشرة للسيرومات والمكونات الفعالة.</p>
                  <span className="text-xs text-primary-600 font-medium mt-1 inline-block">260 درهم ←</span>
                </div>
              </Link>
              <Link href="/ar/products/39" className="flex items-start gap-3 p-4 bg-white rounded-xl border border-gray-100 hover:border-primary-200 hover:shadow-sm transition-all">
                <span className="text-2xl flex-shrink-0">☀️</span>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">ULTRA SHIELD SPF 50+</h3>
                  <p className="text-xs text-gray-500 mt-0.5">حماية واسعة النطاق SPF 50+ — ضروري تحت شمس الإمارات. ضعيه كل صباح.</p>
                  <span className="text-xs text-primary-600 font-medium mt-1 inline-block">250 درهم ←</span>
                </div>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* SEO Intro */}
      <section className="px-4 pb-8">
        <div className="max-w-3xl mx-auto">
          <p className="text-sm text-gray-500 leading-relaxed">{seo.intro}</p>
        </div>
      </section>

      {/* FAQ */}
      {faq.length > 0 && (
        <section className="py-8 sm:py-12 px-4 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-6">الأسئلة الشائعة</h2>
            <div className="space-y-4">
              {faq.map((item, i) => (
                <details key={i} className="bg-white rounded-lg border border-gray-200 overflow-hidden group">
                  <summary className="px-6 py-4 cursor-pointer font-medium text-gray-900 hover:bg-gray-50 list-none flex items-center justify-between">
                    {item.question}
                    <svg className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="px-6 pb-4 text-gray-600 leading-relaxed">{item.answer}</div>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related Concerns */}
      {relatedConcerns.length > 0 && (
        <section className="py-8 sm:py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-6">مشاكل البشرة ذات الصلة</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relatedConcerns.map(related => related && (
                <Link key={related.slug} href={`/ar/products/concern/${related.slug}`}
                  className="block p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border border-gray-100">
                  <h3 className="font-semibold text-gray-900 mb-1">{related.seo.ar.h1}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2">{related.seo.ar.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
