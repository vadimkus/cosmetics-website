import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { buildUrl } from '@/lib/siteConfig'
import { SEO_LANDING_PAGES_RU, getSeoLandingPageRu } from '@/lib/seoLandingPagesRu'

type GuidePageProps = {
  params: Promise<{ slug: string }>
}

export const revalidate = 86400

// All guide slugs are known at build time; unknown slugs must return a real
// HTTP 404 instead of a streamed 200 (soft 404)
export const dynamicParams = false

export function generateStaticParams() {
  return SEO_LANDING_PAGES_RU.map(page => ({ slug: page.slug }))
}

export async function generateMetadata({ params }: GuidePageProps): Promise<Metadata> {
  const { slug } = await params
  const page = getSeoLandingPageRu(slug)

  if (!page) {
    notFound()
  }

  const url = buildUrl(`/ru/guides/${page.slug}`)

  return {
    title: page.title,
    description: page.description,
    keywords: page.keywords,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      title: page.title,
      description: page.description,
      type: 'article',
      url,
      siteName: 'GENOSYS',
      locale: 'ru_AE',
      // Reuse the EN guide title card: satori's bundled font is Latin-only,
      // so a localized card would render Cyrillic glyphs as tofu boxes.
      images: [
        {
          url: buildUrl(`/guides/${page.slug}/opengraph-image`),
          width: 1200,
          height: 630,
          alt: page.h1,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: page.title,
      description: page.description,
      images: [buildUrl(`/guides/${page.slug}/twitter-image`)],
    },
    alternates: {
      canonical: url,
      languages: {
        en: buildUrl(`/guides/${page.slug}`),
        ar: buildUrl(`/ar/guides/${page.slug}`),
        ru: buildUrl(`/ru/guides/${page.slug}`),
      },
    },
  }
}

export default async function RussianSeoGuidePage({ params }: GuidePageProps) {
  const { slug } = await params
  const page = getSeoLandingPageRu(slug)

  if (!page) {
    notFound()
  }

  return (
    <div className="bg-white min-h-screen">
      <article className="mx-auto max-w-5xl px-4 py-12 md:py-20">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-600">
          {page.eyebrow}
        </p>
        <h1 className="mt-3 max-w-3xl text-4xl font-bold tracking-tight text-gray-950 md:text-5xl">
          {page.h1}
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-gray-600">
          {page.intro}
        </p>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {page.sections.map(section => (
            <section key={section.heading} className="rounded-2xl border border-gray-100 bg-gray-50 p-6">
              <h2 className="text-xl font-semibold text-gray-950">{section.heading}</h2>
              <p className="mt-3 leading-7 text-gray-600">{section.body}</p>
            </section>
          ))}
        </div>

        <section className="mt-12">
          <h2 className="text-2xl font-bold text-gray-950">Рекомендуемые следующие шаги</h2>
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
          <h2 className="text-2xl font-bold text-gray-950">Быстрые ответы</h2>
          <div className="mt-5 space-y-5">
            {page.faq.map(item => (
              <div key={item.question}>
                <h3 className="font-semibold text-gray-950">{item.question}</h3>
                <p className="mt-2 leading-7 text-gray-600">{item.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12 rounded-3xl bg-gray-950 p-6 text-white md:p-8">
          <h2 className="text-2xl font-bold">Нужна помощь с подбором продуктов?</h2>
          <p className="mt-3 max-w-2xl text-gray-300">
            Свяжитесь с GENOSYS Middle East для рекомендаций по продуктам, профессионального обучения или партнёрства для клиник в ОАЭ.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link href="/ru/products" className="rounded-full bg-white px-5 py-3 text-center font-semibold text-gray-950">
              Каталог продуктов
            </Link>
            <Link href="/ru/contact" className="rounded-full border border-white/30 px-5 py-3 text-center font-semibold text-white">
              Связаться с GENOSYS ОАЭ
            </Link>
          </div>
        </section>
      </article>
    </div>
  )
}
