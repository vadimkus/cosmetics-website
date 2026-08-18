import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { unstable_cache } from 'next/cache'
import { getConcernBySlug, getAllConcernSlugs } from '@/lib/concernsData'
import { getConcernVisual } from '@/lib/concernVisuals'
import { getProductsByConcern, getProductsByNumbers } from '@/lib/productsDb'
import ConcernProductGrid from '@/components/ConcernProductGrid'
import ConcernHero from '@/components/ConcernHero'
import RelatedConcernCards from '@/components/RelatedConcernCards'
import BreadcrumbSchema from '@/components/schema/BreadcrumbSchema'
import CollectionPageSchema from '@/components/schema/CollectionPageSchema'
import GeoFaqSchema from '@/components/schema/GeoFaqSchema'
import RoutineProductChip from '@/components/RoutineProductChip'
import ConcernWhySection from '@/components/ConcernWhySection'
import ConcernStickyBar from '@/components/ConcernStickyBar'
import ConcernCTA from '@/components/ConcernCTA'
import type { Product } from '@/types'
import { ceraSerif } from '@/components/product/cerabarrier/ceraFont'
import '@/components/product/cerabarrier/cerabarrier.css'
import '@/components/editorial/editorial.css'

export const revalidate = 3600
// Unknown slugs return a genuine 404 (not a soft 404) — matches the EN route.
export const dynamicParams = false

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
  const visual = getConcernVisual(slug)
  const socialImage = visual ? `${baseUrl}${visual.image}` : `${baseUrl}/images/genosys-products.jpg`
  
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
      siteName: 'GENOSYS',
      locale: 'ar_AE',
      images: [{ url: socialImage, width: visual ? 960 : 1200, height: visual ? 720 : 630, alt: seo.h1 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.title,
      description: seo.description,
      images: [socialImage],
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

  const routineNums = new Set<string>()
  if (routine) {
    for (const section of routine) {
      for (const step of section.steps) {
        for (const p of step.products) {
          const m = p.url?.match(/\/products\/(\d+)/)
          if (m?.[1]) routineNums.add(m[1])
        }
      }
    }
  }
  const existingNums = new Set(products.flatMap(p => [String(p.id), String(p.productNumber || '')]))
  const missingNums = Array.from(routineNums).filter(n => !existingNums.has(n))
  const routineProducts = missingNums.length > 0 ? await getProductsByNumbers(missingNums) : []
  const allProducts = [...products, ...routineProducts]

  const productById = new Map<string, Product>()
  for (const p of allProducts) {
    productById.set(String(p.id), p)
    if (p.productNumber) productById.set(String(p.productNumber), p)
  }

  return (
    <div className={`cera-page genosys-page ${ceraSerif.variable} min-h-screen`} dir="rtl">
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

      <ConcernHero concern={concern} locale="ar" />

      {/* Why Section — Collapsible on mobile */}
      {why && <ConcernWhySection title={why.title} items={why.items} />}

      {/* Protocol PDF Download — collapsible */}
      {concern.protocolPdf && (
        <section className="px-4 pb-8 sm:pb-10">
          <div className="max-w-4xl mx-auto">
            <details className="group">
              <summary className="cursor-pointer list-none flex items-center justify-between cera-serif py-2 text-[20px] text-[var(--cera-ink)] transition-colors">
                التوثيق
                <svg className="w-5 h-5 text-[var(--cera-muted)] group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="mt-2">
                <a href={concern.protocolPdf.url} target="_blank" rel="noopener noreferrer"
                  className="group/link block rounded-2xl border border-[var(--cera-line)] bg-white p-5 sm:p-6 shadow-sm hover:shadow-md hover:border-[var(--cera-blush-deep)] transition-all duration-200">
                  <div className="flex items-center gap-4 sm:gap-5">
                    <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[var(--cera-blush)] flex items-center justify-center group-hover/link:bg-[var(--cera-blush-deep)] transition-colors">
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 text-[var(--cera-rose-ink)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m.75 12l3 3m0 0l3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="text-sm sm:text-base font-semibold text-[var(--cera-ink)] group-hover/link:text-[var(--cera-rose-ink)] transition-colors">{concern.protocolPdf.title.ar}</h3>
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-[var(--cera-blush)] text-[var(--cera-rose-ink)]">PDF</span>
                      </div>
                      <p className="text-[var(--cera-muted)] text-xs sm:text-sm leading-relaxed line-clamp-1 sm:line-clamp-none">{concern.protocolPdf.description.ar}</p>
                    </div>
                    <div className="flex-shrink-0 hidden sm:flex items-center gap-1.5 text-sm text-[var(--cera-rose-ink)] font-medium">
                      تحميل
                      <span className="text-[var(--cera-muted)] font-normal text-xs">({concern.protocolPdf.fileSize})</span>
                    </div>
                  </div>
                </a>
              </div>
            </details>
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
                  <h2 className="cera-serif text-[24px] leading-tight text-[var(--cera-ink)] sm:text-[30px]">{section.title}</h2>
                  <p className="text-sm text-[var(--cera-muted)] mt-1">{section.subtitle}</p>
                </div>
                <div className="space-y-3">
                  {section.steps.map((step) => (
                    <details key={step.step} className="bg-white rounded-xl border border-[var(--cera-line)] overflow-hidden group open:border-[var(--cera-blush-deep)] open:ring-1 open:ring-primary-100 transition-all">
                      <summary className="px-5 py-4 cursor-pointer list-none flex items-center gap-3 hover:bg-[var(--cera-cream-deep)] group-open:bg-[var(--cera-blush)]/40 transition-colors">
                        <span className="flex-shrink-0 w-7 h-7 rounded-full bg-[var(--cera-ink)] group-open:bg-[var(--cera-rose)] text-white text-xs font-bold flex items-center justify-center transition-colors">{step.step}</span>
                        <div className="flex-1 min-w-0">
                          <span className="font-medium text-[var(--cera-ink)] group-open:text-[var(--cera-rose-ink)] transition-colors">{step.title}</span>
                          <span className="text-[var(--cera-muted)] text-sm mr-2">({step.duration})</span>
                        </div>
                        <span className="text-xs text-[var(--cera-muted)] hidden sm:block ml-2 group-open:hidden">{step.summary.slice(0, 60)}…</span>
                        <svg className="w-5 h-5 text-[var(--cera-muted)] group-open:text-[var(--cera-rose)] group-open:rotate-180 transition-all flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </summary>
                      <div className="px-5 pb-5 pt-2 border-t border-[var(--cera-line)]">
                        <p className="text-sm text-[var(--cera-body)] leading-relaxed mb-3">{step.detail}</p>
                        <div className="flex flex-wrap gap-2">
                          {step.products.map((p, pi) => {
                            const pid = p.url?.match(/\/products\/(\d+)/)?.[1]
                            return (
                              <RoutineProductChip
                                key={pi}
                                product={pid ? productById.get(pid) ?? null : null}
                                name={p.name}
                                price={p.price}
                                url={p.url}
                              />
                            )
                          })}
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

      {/* Products Grid — collapsible */}
      <section className="py-8 sm:py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <details className="group" open>
            <summary className="cursor-pointer list-none flex items-center justify-between mb-6">
              <h2 className="cera-serif text-[24px] leading-tight text-[var(--cera-ink)] sm:text-[30px]">
                المنتجات الموصى بها ({products.length})
              </h2>
              <svg className="w-5 h-5 text-[var(--cera-muted)] group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <ConcernProductGrid products={products} locale="ar" dir="rtl" />
          </details>
        </div>
      </section>

      {/* Start Your Routine CTA */}
      <ConcernCTA locale="ar" />

      {/* SEO Intro */}
      <section className="px-4 pb-8">
        <div className="max-w-3xl mx-auto">
          <p className="text-sm text-[var(--cera-muted)] leading-relaxed">{seo.intro}</p>
        </div>
      </section>

      {/* FAQ */}
      {faq.length > 0 && (
        <section className="py-8 sm:py-12 px-4 bg-[var(--cera-cream-deep)]">
          <div className="max-w-4xl mx-auto">
            <h2 className="cera-serif mb-6 text-[24px] leading-tight text-[var(--cera-ink)] sm:text-[30px]">الأسئلة الشائعة</h2>
            <div className="space-y-4">
              {faq.map((item, i) => (
                <details key={i} className="bg-white rounded-lg border border-[var(--cera-line)] overflow-hidden group">
                  <summary className="px-6 py-4 cursor-pointer font-medium text-[var(--cera-ink)] hover:bg-[var(--cera-cream-deep)] list-none flex items-center justify-between">
                    {item.question}
                    <svg className="w-5 h-5 text-[var(--cera-muted)] group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="px-6 pb-4 text-[var(--cera-body)] leading-relaxed">{item.answer}</div>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      <RelatedConcernCards currentSlug={slug} locale="ar" />
      <ConcernStickyBar locale="ar" />
    </div>
  )
}
