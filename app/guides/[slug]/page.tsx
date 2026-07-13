import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { buildUrl } from '@/lib/siteConfig'
import { SEO_LANDING_PAGES, getSeoLandingPage } from '@/lib/seoLandingPages'
import GuideArticle from '@/components/guides/GuideArticle'

type GuidePageProps = {
  params: Promise<{ slug: string }>
}

export const revalidate = 86400

// All guide slugs are known at build time; unknown slugs must return a real
// HTTP 404 instead of a streamed 200 (soft 404)
export const dynamicParams = false

export function generateStaticParams() {
  return SEO_LANDING_PAGES.map(page => ({ slug: page.slug }))
}

export async function generateMetadata({ params }: GuidePageProps): Promise<Metadata> {
  const { slug } = await params
  const page = getSeoLandingPage(slug)

  if (!page) {
    // Real HTTP 404 before streaming starts (avoids soft 404)
    notFound()
  }

  const url = buildUrl(`/guides/${page.slug}`)

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
      locale: 'en_AE',
      // og:image intentionally omitted — file-based opengraph-image.tsx
      // renders a per-guide branded title card instead of the shared stock photo.
    },
    twitter: {
      card: 'summary_large_image',
      title: page.title,
      description: page.description,
      // twitter:image comes from the file-based twitter-image.tsx card.
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

export default async function SeoGuidePage({ params }: GuidePageProps) {
  const { slug } = await params
  const page = getSeoLandingPage(slug)

  if (!page) {
    notFound()
  }

  return (
    <GuideArticle
      page={page}
      productsHref="/products"
      contactHref="/contact"
      labels={{
        keyPoints: 'Key points',
        recommendedProducts: 'Relevant GENOSYS products',
        recommendedProductsIntro: 'These products are shown for education and routine planning. Choose according to skin condition, product instructions, and professional guidance where appropriate.',
        nextSteps: 'Recommended next steps',
        quickAnswers: 'Quick answers',
        sources: 'Evidence and safety sources',
        sourceNote: 'Independent references support the general educational guidance. Product-specific claims should be checked against the product label and professional protocol.',
        guidanceTitle: 'Need product guidance?',
        guidanceBody: 'Contact GENOSYS Middle East for product recommendations, professional training, or clinic partnership support in the UAE.',
        shopProducts: 'Shop products',
        contact: 'Contact GENOSYS UAE',
      }}
    />
  )
}
