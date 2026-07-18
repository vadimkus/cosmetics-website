import Image from 'next/image'
import Link from 'next/link'
import type { SeoLandingPage } from '@/lib/seoLandingPages'
import ReadingProgress from '@/components/ui/ReadingProgressV3'

export interface GuideArticleLabels {
  keyPoints: string
  recommendedProducts: string
  recommendedProductsIntro: string
  nextSteps: string
  quickAnswers: string
  sources: string
  sourceNote: string
  guidanceTitle: string
  guidanceBody: string
  shopProducts: string
  contact: string
}

interface GuideArticleProps {
  page: SeoLandingPage
  labels: GuideArticleLabels
  productsHref: string
  contactHref: string
  dir?: 'ltr' | 'rtl'
}

export default function GuideArticle({
  page,
  labels,
  productsHref,
  contactHref,
  dir = 'ltr',
}: GuideArticleProps) {
  const featured = page.featuredProducts || []

  return (
    <div className="min-h-screen bg-white" dir={dir}>
      <ReadingProgress />
      <article className="mx-auto max-w-6xl px-4 py-12 md:py-20">
        <header className={`grid items-center gap-10 ${featured.length > 0 ? 'lg:grid-cols-[1.1fr_0.9fr]' : ''}`}>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-600">
              {page.eyebrow}
            </p>
            <h1 className="mt-3 max-w-4xl text-4xl font-bold tracking-tight text-gray-950 md:text-5xl">
              {page.h1}
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-gray-600">
              {page.intro}
            </p>
          </div>

          {featured.length > 0 && (
            <div className="grid grid-cols-2 gap-3 rounded-3xl bg-gray-50 p-4" aria-label={labels.recommendedProducts}>
              {featured.slice(0, 4).map(product => (
                <Link
                  key={product.href}
                  href={product.href}
                  className="group flex aspect-square min-h-0 flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white"
                  aria-label={product.name}
                >
                  <span className="relative min-h-0 flex-1">
                    <Image
                      src={product.image}
                      alt={product.imageAlt}
                      fill
                      sizes="(max-width: 640px) 45vw, 220px"
                      className="object-contain transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                  </span>
                  <span className="line-clamp-2 px-2 py-2 text-center text-[10px] font-semibold leading-3.5 text-gray-900 sm:text-xs sm:leading-4">
                    {product.name}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </header>

        {page.takeaways && page.takeaways.length > 0 && (
          <section className="mt-12 rounded-3xl border border-primary-100 bg-primary-50 p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-950">{labels.keyPoints}</h2>
            <ul className="mt-5 grid gap-3 md:grid-cols-2">
              {page.takeaways.map(item => (
                <li key={item} className="flex gap-3 leading-7 text-gray-700">
                  <span className="mt-2.5 h-2 w-2 flex-none rounded-full bg-primary-600" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        <div className="mt-12 grid gap-x-10 gap-y-10 md:grid-cols-2">
          {page.sections.map(section => (
            <section key={section.heading} className="border-t border-gray-200 pt-6">
              <h2 className="text-2xl font-semibold text-gray-950">{section.heading}</h2>
              <p className="mt-4 text-base leading-8 text-gray-700">{section.body}</p>
            </section>
          ))}
        </div>

        {featured.length > 0 && (
          <section className="mt-16">
            <h2 className="text-3xl font-bold text-gray-950">{labels.recommendedProducts}</h2>
            <p className="mt-3 max-w-3xl leading-7 text-gray-600">{labels.recommendedProductsIntro}</p>
            <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {featured.map(product => (
                <Link
                  key={product.href}
                  href={product.href}
                  className="group overflow-hidden rounded-2xl border border-gray-200 bg-white transition hover:border-primary-300 hover:shadow-md"
                >
                  <div className="relative aspect-square bg-gray-50">
                    <Image
                      src={product.image}
                      alt={product.imageAlt}
                      fill
                      sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 260px"
                      className="object-contain transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold leading-6 text-gray-950 group-hover:text-primary-700">
                      {product.name}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-gray-600">{product.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className="mt-16">
          <h2 className="text-2xl font-bold text-gray-950">{labels.nextSteps}</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {page.links.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-2xl border border-primary-100 bg-white p-5 transition hover:border-primary-300 hover:shadow-md"
              >
                <span className="font-semibold text-primary-700">{link.label}</span>
                <p className="mt-2 text-sm leading-6 text-gray-600">{link.description}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-12 rounded-3xl bg-primary-50 p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-950">{labels.quickAnswers}</h2>
          <div className="mt-5 space-y-6">
            {page.faq.map(item => (
              <div key={item.question}>
                <h3 className="font-semibold text-gray-950">{item.question}</h3>
                <p className="mt-2 leading-7 text-gray-700">{item.answer}</p>
              </div>
            ))}
          </div>
        </section>

        {page.sources && page.sources.length > 0 && (
          <section className="mt-10 border-t border-gray-200 pt-8">
            <h2 className="text-xl font-bold text-gray-950">{labels.sources}</h2>
            <p className="mt-2 text-sm leading-6 text-gray-600">{labels.sourceNote}</p>
            <ul className="mt-4 space-y-3">
              {page.sources.map(source => (
                <li key={source.href}>
                  <a
                    href={source.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-primary-700 underline decoration-primary-200 underline-offset-4 hover:decoration-primary-600"
                  >
                    {source.label}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="mt-12 rounded-3xl bg-gray-950 p-6 text-white md:p-8">
          <h2 className="text-2xl font-bold">{labels.guidanceTitle}</h2>
          <p className="mt-3 max-w-2xl text-gray-300">{labels.guidanceBody}</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link href={productsHref} className="rounded-full bg-white px-5 py-3 text-center font-semibold text-gray-950">
              {labels.shopProducts}
            </Link>
            <Link href={contactHref} className="rounded-full border border-white/30 px-5 py-3 text-center font-semibold text-white">
              {labels.contact}
            </Link>
          </div>
        </section>
      </article>
    </div>
  )
}
