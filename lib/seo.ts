import type { Metadata } from 'next'
import type { Product } from '@/types'
import type { Locale } from '@/lib/i18n'
import { buildUrl, SITE_NAME, SITE_URL } from '@/lib/siteConfig'
import { safeJsonParse } from '@/lib/utils'

export const LANGUAGE_NAMES: Record<Locale, string> = {
  en: 'English',
  ar: 'Arabic',
  ru: 'Russian',
}

export function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export function truncateText(value: string, maxLength: number): string {
  const normalized = value.replace(/\s+/g, ' ').trim()
  if (normalized.length <= maxLength) return normalized
  return `${normalized.slice(0, maxLength - 3).trim()}...`
}

export function stripHtml(value: string): string {
  return value
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
}

export function parseStringArray(value?: string | null): string[] {
  if (!value) return []
  const parsed = safeJsonParse<unknown>(value, [])
  if (Array.isArray(parsed)) {
    return parsed.filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
  }
  if (typeof parsed === 'string' && parsed.trim()) {
    return [parsed.trim()]
  }
  return []
}

export function getLocalizedProductName(product: Product, _locale: Locale): string {
  // Brand decision (2026-07-08): product names are NEVER translated - the
  // English name is the product's identity across EN/AR/RU (packaging,
  // invoices, and support all reference the same name). Translated names
  // remain available as SEO alternates (ProductSchema.alternateName) and
  // for search matching (lib/productSearch.ts).
  return product.name
}

export function getLocalizedProductDescription(product: Product, locale: Locale): string {
  if (locale === 'ar' && product.descriptionAr?.trim()) return product.descriptionAr.trim()
  if (locale === 'ru' && product.descriptionRu?.trim()) return product.descriptionRu.trim()
  return product.description
}

/**
 * Canonical URL slug for a product. Always the short numeric identifier
 * (productNumber when present, else the id - legacy products have numeric
 * ids). Using one consistent scheme in canonicals, hreflang, sitemap,
 * schema.org and feeds avoids sending search engines conflicting signals
 * (previously the sitemap used numeric URLs while page canonicals used
 * CUIDs).
 */
export function getCanonicalProductSlug(product: Pick<Product, 'id' | 'productNumber'>): string {
  return product.productNumber?.trim() || product.id
}

export function getLocalizedProductPath(productId: string, locale: Locale): string {
  if (locale === 'ar') return `/ar/products/${productId}`
  if (locale === 'ru') return `/ru/products/${productId}`
  return `/products/${productId}`
}

export function getLocalizedProductUrl(productId: string, locale: Locale): string {
  return buildUrl(getLocalizedProductPath(productId, locale))
}

export function getProductImageUrls(product: Product): string[] {
  const parsedImages = parseStringArray(product.images)
  const images = parsedImages.length > 0 ? parsedImages : [product.image]
  return images.filter(Boolean).map(img => buildUrl(img))
}

export function getProductAlternates(productId: string): Record<string, string> {
  return {
    en: getLocalizedProductUrl(productId, 'en'),
    ar: getLocalizedProductUrl(productId, 'ar'),
    ru: getLocalizedProductUrl(productId, 'ru'),
    'x-default': getLocalizedProductUrl(productId, 'en'),
  }
}

export function formatFeedDate(date?: Date | string | null): string {
  return (date ? new Date(date) : new Date()).toUTCString()
}

export function formatAtomDate(date?: Date | string | null): string {
  return (date ? new Date(date) : new Date()).toISOString()
}

export function siteUrlWithTrailingSlash(): string {
  return SITE_URL.endsWith('/') ? SITE_URL : `${SITE_URL}/`
}

/**
 * SEO Metadata Helper Utility
 * 
 * Centralizes metadata generation for consistent SEO across all locales.
 * Ensures:
 * - Absolute OG image URLs (required for social sharing)
 * - Proper hreflang alternates on every page
 * - Consistent site name across languages
 * - Correct locale codes for OpenGraph
 * - Geo-targeting meta tags for UAE
 */

export type SeoLocale = 'en' | 'ar' | 'ru'

// Locale-specific site names. We use the brand "GENOSYS" everywhere in
// titles / OG metadata. The full legal name (Genosys Middle East FZ-LLC) is
// reserved for /about, /contact, /terms, /privacy-policy bodies and emails.
const SITE_NAMES: Record<SeoLocale, string> = {
  en: 'GENOSYS',
  ar: 'GENOSYS',
  ru: 'GENOSYS',
}

// OpenGraph locale codes (language_COUNTRY format)
const OG_LOCALES: Record<SeoLocale, string> = {
  en: 'en_AE',
  ar: 'ar_AE',
  ru: 'ru_AE',
}

// Default OG image
const DEFAULT_OG_IMAGE = '/images/genosys-products.jpg'
const DEFAULT_OG_IMAGE_ALT: Record<SeoLocale, string> = {
  en: 'GENOSYS Premium Korean Dermacosmetics',
  ar: 'مستحضرات التجميل الكورية المميزة من GENOSYS',
  ru: 'Премиальная корейская дерматокосметика GENOSYS',
}

/**
 * Get localized site name
 */
export function getLocalizedSiteName(locale: SeoLocale = 'en'): string {
  return SITE_NAMES[locale] || SITE_NAME
}

/**
 * Build absolute URL from a path
 */
export function buildAbsoluteUrl(path: string): string {
  return buildUrl(path)
}

/**
 * Build canonical URL and hreflang alternates for any path.
 * 
 * @param pagePath - The page path without locale prefix (e.g., "/products", "/about")
 * @param locale - The current page locale
 */
export function buildAlternates(pagePath: string, locale: SeoLocale = 'en'): Metadata['alternates'] {
  // Normalize path: ensure it starts with / and doesn't end with /
  const normalizedPath = pagePath === '/' || pagePath === '' 
    ? '' 
    : (pagePath.startsWith('/') ? pagePath : `/${pagePath}`)
  
  const enUrl = `${SITE_URL}${normalizedPath || '/'}`
  const arUrl = `${SITE_URL}/ar${normalizedPath}`
  const ruUrl = `${SITE_URL}/ru${normalizedPath}`
  
  // Canonical URL for current locale
  let canonical: string
  switch (locale) {
    case 'ar':
      canonical = arUrl
      break
    case 'ru':
      canonical = ruUrl
      break
    default:
      canonical = enUrl
  }

  return {
    canonical,
    languages: {
      'en': enUrl,
      'ar': arUrl,
      'ru': ruUrl,
      'x-default': enUrl,
    },
  }
}

/**
 * Build OG images with absolute URLs.
 * Always returns absolute URLs (required by OpenGraph spec).
 * 
 * @param locale - Current locale for alt text
 * @param customImage - Optional custom image path (can be relative)
 * @param customAlt - Optional custom alt text
 */
export function buildOgImages(
  locale: SeoLocale = 'en',
  customImage?: string,
  customAlt?: string
): { url: string; width: number; height: number; alt: string }[] {
  const imagePath = customImage || DEFAULT_OG_IMAGE
  const imageUrl = buildAbsoluteUrl(imagePath)
  const alt = customAlt || DEFAULT_OG_IMAGE_ALT[locale] || DEFAULT_OG_IMAGE_ALT.en

  return [
    {
      url: imageUrl,
      width: 1200,
      height: 630,
      alt,
    },
  ]
}

/**
 * Generate complete page metadata for any locale.
 * 
 * Provides a consistent metadata structure across all pages and languages.
 * Use overrides to customize specific fields per page.
 * 
 * @param locale - Page locale
 * @param pagePath - Path without locale prefix (e.g., "/products")
 * @param config - Page-specific metadata configuration
 */
export function generatePageMetadata(
  locale: SeoLocale,
  pagePath: string,
  config: {
    title: string
    description: string
    keywords?: string[]
    ogImage?: string
    ogImageAlt?: string
    ogType?: 'website' | 'article'
    noIndex?: boolean
    additionalMeta?: Record<string, string>
  }
): Metadata {
  const siteName = getLocalizedSiteName(locale)
  const ogLocale = OG_LOCALES[locale]
  const alternates = buildAlternates(pagePath, locale)
  const ogImages = buildOgImages(locale, config.ogImage, config.ogImageAlt)

  // Build the current page URL
  let currentUrl: string
  switch (locale) {
    case 'ar':
      currentUrl = `${SITE_URL}/ar${pagePath === '/' ? '' : pagePath}`
      break
    case 'ru':
      currentUrl = `${SITE_URL}/ru${pagePath === '/' ? '' : pagePath}`
      break
    default:
      currentUrl = `${SITE_URL}${pagePath || '/'}`
  }

  const metadata: Metadata = {
    title: config.title,
    description: config.description,
    keywords: config.keywords,
    authors: [{ name: siteName }],
    creator: siteName,
    publisher: siteName,
    robots: config.noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large' as const,
            'max-snippet': -1,
          },
        },
    alternates,
    openGraph: {
      title: config.title,
      description: config.description,
      type: config.ogType || 'website',
      url: currentUrl,
      siteName,
      images: ogImages,
      locale: ogLocale,
      countryName: 'United Arab Emirates',
    },
    twitter: {
      card: 'summary_large_image',
      site: '@genosys_official',
      creator: '@genosys_official',
      title: config.title,
      description: config.description,
      images: ogImages.map(img => ({
        url: img.url,
        alt: img.alt,
      })),
    },
  }

  // Add any additional meta tags
  if (config.additionalMeta) {
    metadata.other = config.additionalMeta
  }

  return metadata
}

/**
 * Geo-targeting meta tags for UAE
 * Add to root layout or page-specific metadata via `other` field
 */
export const GEO_META_TAGS = {
  'geo.region': 'AE-DU',
  'geo.placename': 'Dubai',
  'geo.position': '25.2048;55.2708',
  'ICBM': '25.2048, 55.2708',
}
