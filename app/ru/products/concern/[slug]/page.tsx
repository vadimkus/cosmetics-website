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
  
  const seo = concern.seo.ru
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
      url: `${baseUrl}/ru/products/concern/${slug}`,
      siteName: 'GENOSYS',
      locale: 'ru_AE',
      images: [{ url: socialImage, width: visual ? 960 : 1200, height: visual ? 720 : 630, alt: seo.h1 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.title,
      description: seo.description,
      images: [socialImage],
    },
    alternates: {
      canonical: `${baseUrl}/ru/products/concern/${slug}`,
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

export default async function RussianConcernPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const concern = getConcernBySlug(slug)
  if (!concern) notFound()
  
  const products = await getConcernProducts(concern.concernKeys, concern.categoryFallbacks)
  const seo = concern.seo.ru
  const faq = concern.faq.ru
  const why = concern.why?.ru
  const routine = concern.routine?.ru

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
    <div className="min-h-screen bg-white">
      <BreadcrumbSchema
        items={[
          { name: 'Главная', url: '/ru' },
          { name: 'Продукция', url: '/ru/products' },
          { name: seo.h1, url: `/ru/products/concern/${slug}` },
        ]}
      />
      {products.length > 0 && (
        <CollectionPageSchema
          name={seo.h1}
          description={seo.description}
          url={`https://genosys.ae/ru/products/concern/${slug}`}
          products={products}
        />
      )}
      <GeoFaqSchema items={faq} pageUrl={`/ru/products/concern/${slug}`} language="ru" />

      <ConcernHero concern={concern} locale="ru" />

      {/* Why Section — Collapsible on mobile */}
      {why && <ConcernWhySection title={why.title} items={why.items} />}

      {/* Protocol PDF Download — collapsible */}
      {concern.protocolPdf && (
        <section className="px-4 pb-8 sm:pb-10">
          <div className="max-w-4xl mx-auto">
            <details className="group">
              <summary className="cursor-pointer list-none flex items-center justify-between py-2 text-lg font-bold text-gray-900 transition-colors">
                Документация
                <svg className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="mt-2">
                <a href={concern.protocolPdf.url} target="_blank" rel="noopener noreferrer"
                  className="group/link block rounded-2xl border border-gray-200 bg-gradient-to-br from-amber-50/40 to-white p-5 sm:p-6 shadow-sm hover:shadow-md hover:border-amber-200 transition-all duration-200">
                  <div className="flex items-center gap-4 sm:gap-5">
                    <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-amber-100 flex items-center justify-center group-hover/link:bg-amber-200 transition-colors">
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 text-amber-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m.75 12l3 3m0 0l3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="text-sm sm:text-base font-semibold text-gray-900 group-hover/link:text-amber-800 transition-colors">{concern.protocolPdf.title.ru}</h3>
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-amber-100 text-amber-700">PDF</span>
                      </div>
                      <p className="text-gray-500 text-xs sm:text-sm leading-relaxed line-clamp-1 sm:line-clamp-none">{concern.protocolPdf.description.ru}</p>
                    </div>
                    <div className="flex-shrink-0 hidden sm:flex items-center gap-1.5 text-sm text-amber-700 font-medium">
                      Скачать
                      <span className="text-gray-400 font-normal text-xs">({concern.protocolPdf.fileSize})</span>
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
                          <span className="text-gray-400 text-sm ml-2">({step.duration})</span>
                        </div>
                        <span className="text-xs text-gray-400 hidden sm:block mr-2 group-open:hidden">{step.summary.slice(0, 60)}…</span>
                        <svg className="w-5 h-5 text-gray-400 group-open:text-primary-500 group-open:rotate-180 transition-all flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </summary>
                      <div className="px-5 pb-5 pt-2 border-t border-gray-100">
                        <p className="text-sm text-gray-600 leading-relaxed mb-3">{step.detail}</p>
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
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
                Рекомендуемые продукты ({products.length})
              </h2>
              <svg className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <ConcernProductGrid products={products} locale="ru" />
          </details>
        </div>
      </section>

      {/* Start Your Routine CTA */}
      <ConcernCTA locale="ru" />

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
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-6">Часто задаваемые вопросы</h2>
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

      <RelatedConcernCards currentSlug={slug} locale="ru" />
      <ConcernStickyBar locale="ru" />
    </div>
  )
}
