import BreadcrumbSchema from '@/components/schema/BreadcrumbSchema'
import ProductSchema from '@/components/schema/ProductSchema'
import { getLocaleFromPath, type Locale } from '@/lib/i18n'
import { getProductByIdCached } from '@/lib/productsDb'
import { buildUrl } from '@/lib/siteConfig'
import {
  getCanonicalProductSlug,
  getLocalizedProductName,
  getLocalizedProductPath,
  getLocalizedProductUrl,
} from '@/lib/seo'
import { getSeoLandingPage } from '@/lib/seoLandingPages'
import { getSeoLandingPageAr } from '@/lib/seoLandingPagesAr'
import { getSeoLandingPageRu } from '@/lib/seoLandingPagesRu'
import { toJsonLd } from '@/lib/jsonLd'

interface RouteStructuredDataProps {
  pathname: string
}

function productBreadcrumbLabels(locale: Locale) {
  if (locale === 'ar') {
    return { home: 'الرئيسية', products: 'المنتجات' }
  }
  if (locale === 'ru') {
    return { home: 'Главная', products: 'Продукты' }
  }
  return { home: 'Home', products: 'Products' }
}

function getProductIdFromPath(pathname: string): string | null {
  const match = pathname.match(/^\/(?:ar\/|ru\/)?products\/([^/]+)$/)
  return match?.[1] ?? null
}

function getGuideSlugFromPath(pathname: string): string | null {
  // Match EN, AR and RU guide URLs (all three have fully localized bodies).
  const match = pathname.match(/^\/(?:ar\/|ru\/)?guides\/([^/]+)$/)
  return match?.[1] ?? null
}

function getLocalizedGuide(locale: Locale, slug: string) {
  if (locale === 'ar') return getSeoLandingPageAr(slug)
  if (locale === 'ru') return getSeoLandingPageRu(slug)
  return getSeoLandingPage(slug)
}

function guideBreadcrumbLabel(locale: Locale) {
  if (locale === 'ar') return 'الأدلة'
  if (locale === 'ru') return 'Руководства'
  return 'Guides'
}

export default async function RouteStructuredData({ pathname }: RouteStructuredDataProps) {
  const productId = getProductIdFromPath(pathname)

  if (productId) {
    const locale = getLocaleFromPath(pathname)
    const product = await getProductByIdCached(productId)

    if (!product) return null

    const labels = productBreadcrumbLabels(locale)
    const canonicalSlug = getCanonicalProductSlug(product)

    return (
      <>
        <ProductSchema product={product} locale={locale} canonicalUrl={getLocalizedProductUrl(canonicalSlug, locale)} />
        <BreadcrumbSchema
          items={[
            { name: labels.home, url: locale === 'en' ? '/' : `/${locale}` },
            { name: labels.products, url: locale === 'en' ? '/products' : `/${locale}/products` },
            { name: getLocalizedProductName(product, locale), url: getLocalizedProductPath(canonicalSlug, locale) },
          ]}
        />
      </>
    )
  }

  const guideSlug = getGuideSlugFromPath(pathname)
  const guideLocale = getLocaleFromPath(pathname)
  const guide = guideSlug ? getLocalizedGuide(guideLocale, guideSlug) : null

  if (guide) {
    const guidePrefix = guideLocale === 'en' ? '' : `/${guideLocale}`
    const pageUrl = buildUrl(`${guidePrefix}/guides/${guide.slug}`)
    const webPageSchema = {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: guide.h1,
      headline: guide.h1,
      description: guide.description,
      url: pageUrl,
      inLanguage: guideLocale === 'ar' ? 'ar-AE' : guideLocale === 'ru' ? 'ru-AE' : 'en-AE',
      primaryImageOfPage: guide.featuredProducts?.[0]
        ? {
            '@type': 'ImageObject',
            url: buildUrl(guide.featuredProducts[0].image),
          }
        : undefined,
      about: guide.keywords.map(keyword => ({ '@type': 'Thing', name: keyword })),
      publisher: {
        '@type': 'Organization',
        name: 'GENOSYS Middle East FZ-LLC',
        url: buildUrl('/'),
      },
    }

    const faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: guide.faq.map(item => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      })),
    }

    const guideLabels = productBreadcrumbLabels(guideLocale)
    return (
      <>
        <BreadcrumbSchema
          items={[
            { name: guideLabels.home, url: guidePrefix || '/' },
            { name: guideBreadcrumbLabel(guideLocale), url: `${guidePrefix}/guides` },
            { name: guide.h1, url: `${guidePrefix}/guides/${guide.slug}` },
          ]}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: toJsonLd(webPageSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: toJsonLd(faqSchema) }}
        />
      </>
    )
  }

  return null
}
