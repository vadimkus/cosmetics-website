import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { buildUrl } from '@/lib/siteConfig'
import { SEO_LANDING_PAGES_RU, getSeoLandingPageRu } from '@/lib/seoLandingPagesRu'
import GuideArticle from '@/components/guides/GuideArticle'

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
        'x-default': buildUrl(`/guides/${page.slug}`),
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
    <GuideArticle
      page={page}
      productsHref="/ru/products"
      contactHref="/ru/contact"
      labels={{
        keyPoints: 'Главное',
        recommendedProducts: 'Подходящие продукты GENOSYS',
        recommendedProductsIntro: 'Продукты показаны для обучения и планирования ухода. Выбирайте их по состоянию кожи, инструкции и рекомендации специалиста, когда она необходима.',
        nextSteps: 'Рекомендуемые следующие шаги',
        quickAnswers: 'Быстрые ответы',
        sources: 'Научные источники и безопасность',
        sourceNote: 'Независимые источники подтверждают общие образовательные рекомендации. Заявления о конкретном продукте следует сверять с этикеткой и профессиональным протоколом.',
        guidanceTitle: 'Нужна помощь с подбором продуктов?',
        guidanceBody: 'Свяжитесь с GENOSYS Middle East для рекомендаций по продуктам, профессионального обучения или партнёрства для клиник в ОАЭ.',
        shopProducts: 'Каталог продуктов',
        contact: 'Связаться с GENOSYS ОАЭ',
      }}
    />
  )
}
