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
  const match = pathname.match(/^\/guides\/([^/]+)$/)
  return match?.[1] ?? null
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
  const guide = guideSlug ? getSeoLandingPage(guideSlug) : null

  if (guide) {
    const pageUrl = buildUrl(`/guides/${guide.slug}`)
    const webPageSchema = {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: guide.h1,
      headline: guide.h1,
      description: guide.description,
      url: pageUrl,
      inLanguage: 'en-AE',
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

    return (
      <>
        <BreadcrumbSchema
          items={[
            { name: 'Home', url: '/' },
            { name: 'Guides', url: '/guides' },
            { name: guide.h1, url: `/guides/${guide.slug}` },
          ]}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema, null, 2) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema, null, 2) }}
        />
      </>
    )
  }

  return null
}
