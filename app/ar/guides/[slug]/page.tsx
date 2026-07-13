import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { buildUrl } from '@/lib/siteConfig'
import { SEO_LANDING_PAGES_AR, getSeoLandingPageAr } from '@/lib/seoLandingPagesAr'
import GuideArticle from '@/components/guides/GuideArticle'

type GuidePageProps = {
  params: Promise<{ slug: string }>
}

export const revalidate = 86400

// All guide slugs are known at build time; unknown slugs must return a real
// HTTP 404 instead of a streamed 200 (soft 404)
export const dynamicParams = false

export function generateStaticParams() {
  return SEO_LANDING_PAGES_AR.map(page => ({ slug: page.slug }))
}

export async function generateMetadata({ params }: GuidePageProps): Promise<Metadata> {
  const { slug } = await params
  const page = getSeoLandingPageAr(slug)

  if (!page) {
    notFound()
  }

  const url = buildUrl(`/ar/guides/${page.slug}`)

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
      locale: 'ar_AE',
      // Reuse the EN guide title card: satori's bundled font is Latin-only,
      // so a localized card would render Arabic glyphs as tofu boxes.
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

export default async function ArabicSeoGuidePage({ params }: GuidePageProps) {
  const { slug } = await params
  const page = getSeoLandingPageAr(slug)

  if (!page) {
    notFound()
  }

  return (
    <GuideArticle
      page={page}
      productsHref="/ar/products"
      contactHref="/ar/contact"
      dir="rtl"
      labels={{
        keyPoints: 'النقاط الأساسية',
        recommendedProducts: 'منتجات GENOSYS ذات الصلة',
        recommendedProductsIntro: 'تُعرض المنتجات للتثقيف وتخطيط الروتين. اختاري وفق حالة البشرة وتعليمات المنتج وإرشاد المختص عند الحاجة.',
        nextSteps: 'الخطوات التالية الموصى بها',
        quickAnswers: 'إجابات سريعة',
        sources: 'مصادر الأدلة والسلامة',
        sourceNote: 'تدعم المراجع المستقلة الإرشادات التعليمية العامة. يجب مراجعة الادعاءات الخاصة بكل منتج وفق ملصقه والبروتوكول المهني.',
        guidanceTitle: 'هل تحتاجين إلى مساعدة في اختيار المنتجات؟',
        guidanceBody: 'تواصلي مع GENOSYS الشرق الأوسط للحصول على توصيات المنتجات أو التدريب الاحترافي أو دعم شراكة العيادات في الإمارات.',
        shopProducts: 'تسوّق المنتجات',
        contact: 'تواصل مع GENOSYS الإمارات',
      }}
    />
  )
}
