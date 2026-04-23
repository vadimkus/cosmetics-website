import { SITE_URL } from '@/lib/siteConfig'
import type { Product } from '@/types'
import { CATEGORY_PAGES, CONCERN_PAGES } from '@/lib/concernsData'
import { getLocalizedPath } from '@/lib/i18n'
import type { Locale } from '@/lib/i18n'

/**
 * HomeItemListSchema — Server Component (pure JSON-LD emitter)
 *
 * Emits three `ItemList` JSON-LD blobs that mirror the visible homepage rails:
 *   1. Category rail      (6 items — "Shop by category")
 *   2. Concern grid       (8 items — "Shop by skin concern")
 *   3. Featured products  (4 items — "What's popular right now")
 *
 * Why ItemList (not Breadcrumb / CollectionPage):
 *   - The homepage rails are curated index lists, not a hierarchical breadcrumb
 *   - ItemList is the schema.org type Google uses to generate carousels and
 *     site-link previews from a homepage
 *   - AI search crawlers (ChatGPT, Perplexity, Claude) use ItemList to answer
 *     "what categories / concerns / bestsellers does X sell?" with structured
 *     output instead of inference
 *
 * Localized — the URLs and names honor `/ar` / `/ru` prefixes so each locale
 * homepage gets its own ItemList pointing at its own URLs.
 *
 * Price / availability are intentionally omitted from the featured items
 * schema here — full `ProductSchema` lives on the PDP and handles that
 * authoritatively. Duplicating those fields would risk drift.
 */

interface HomeItemListSchemaProps {
  locale: Locale
  /** Same 6 slugs rendered on the homepage category rail, in display order. */
  featuredCategorySlugs: readonly string[]
  /** Featured products rail — usually 4 items. */
  featuredProducts: Product[]
}

function ensureUrl(path: string): string {
  return path.startsWith('http') ? path : `${SITE_URL}${path}`
}

function productImage(p: Product): string | undefined {
  if (p.images) {
    try {
      const arr = JSON.parse(p.images) as string[]
      if (Array.isArray(arr) && arr[0]) return ensureUrl(arr[0])
    } catch {
      /* noop */
    }
  }
  if (p.image) return ensureUrl(p.image)
  return undefined
}

function localizedH1(seo: {
  en: { h1: string }
  ar: { h1: string }
  ru: { h1: string }
}, locale: Locale): string {
  if (locale === 'ar') return seo.ar.h1
  if (locale === 'ru') return seo.ru.h1
  return seo.en.h1
}

function localizedProductName(p: Product, locale: Locale): string {
  if (locale === 'ar' && p.nameAr) return p.nameAr
  if (locale === 'ru' && p.nameRu) return p.nameRu
  return p.name
}

export default function HomeItemListSchema({
  locale,
  featuredCategorySlugs,
  featuredProducts,
}: HomeItemListSchemaProps) {
  // 1. Category rail
  const categoryItems = featuredCategorySlugs
    .map(slug => CATEGORY_PAGES.find(c => c.slug === slug))
    .filter((c): c is (typeof CATEGORY_PAGES)[number] => Boolean(c))
    .map((cat, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: localizedH1(cat.seo, locale),
      url: ensureUrl(getLocalizedPath(`/products/category/${cat.slug}`, locale)),
    }))

  const categoryList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name:
      locale === 'ar'
        ? 'تسوق حسب الفئة — GENOSYS'
        : locale === 'ru'
        ? 'Категории — GENOSYS'
        : 'Shop by category — GENOSYS',
    itemListOrder: 'https://schema.org/ItemListOrderAscending',
    numberOfItems: categoryItems.length,
    itemListElement: categoryItems,
  }

  // 2. Concern grid — always all 8 concerns (matches UI)
  const concernItems = CONCERN_PAGES.map((concern, idx) => ({
    '@type': 'ListItem',
    position: idx + 1,
    name: localizedH1(concern.seo, locale),
    url: ensureUrl(getLocalizedPath(`/products/concern/${concern.slug}`, locale)),
  }))

  const concernList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name:
      locale === 'ar'
        ? 'تسوق حسب مشكلة البشرة — GENOSYS'
        : locale === 'ru'
        ? 'Подбор по задаче кожи — GENOSYS'
        : 'Shop by skin concern — GENOSYS',
    itemListOrder: 'https://schema.org/ItemListOrderAscending',
    numberOfItems: concernItems.length,
    itemListElement: concernItems,
  }

  // 3. Featured products (bestsellers)
  const featuredItems = featuredProducts.slice(0, 4).map((product, idx) => {
    const item: Record<string, unknown> = {
      '@type': 'ListItem',
      position: idx + 1,
      url: ensureUrl(getLocalizedPath(`/products/${product.id}`, locale)),
      item: {
        '@type': 'Product',
        name: localizedProductName(product, locale),
        url: ensureUrl(getLocalizedPath(`/products/${product.id}`, locale)),
      },
    }
    const img = productImage(product)
    if (img) {
      ;(item.item as Record<string, unknown>).image = img
    }
    return item
  })

  const featuredList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name:
      locale === 'ar'
        ? 'الأكثر مبيعاً — GENOSYS'
        : locale === 'ru'
        ? 'Хиты сезона — GENOSYS'
        : 'What\u2019s popular right now — GENOSYS',
    itemListOrder: 'https://schema.org/ItemListOrderAscending',
    numberOfItems: featuredItems.length,
    itemListElement: featuredItems,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(categoryList) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(concernList) }}
      />
      {featuredItems.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(featuredList) }}
        />
      )}
    </>
  )
}
