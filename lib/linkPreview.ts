import type { Locale } from '@/i18n'
import type { Product } from '@/types'
import {
  getCanonicalProductSlug,
  getLocalizedProductDescription,
  getLocalizedProductName,
  getLocalizedProductUrl,
  truncateText,
} from '@/lib/seo'

export { isLinkPreviewBot } from '@/lib/linkPreviewBot'

const TITLE_SUFFIX: Record<Locale, string> = {
  en: 'GENOSYS UAE',
  ar: 'GENOSYS الإمارات',
  ru: 'GENOSYS ОАЭ',
}

const TAIL: Record<Locale, string> = {
  en: 'Professional Korean dermacosmetics by GENOSYS. Official distributor in UAE. Free shipping over 1000 AED.',
  ar: 'مستحضرات تجميل كورية احترافية من GENOSYS. الموزع الرسمي في الإمارات. شحن مجاني للطلبات فوق 1000 درهم.',
  ru: 'Профессиональная корейская дермакосметика GENOSYS. Официальный дистрибьютор в ОАЭ. Бесплатная доставка от 1000 AED.',
}

const OG_LOCALE: Record<Locale, string> = { en: 'en_AE', ar: 'ar_AE', ru: 'ru_RU' }

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export function renderProductLinkPreview(product: Product, locale: Locale, origin: string): string {
  const slug = getCanonicalProductSlug(product)
  const name = getLocalizedProductName(product, locale)
  const title = `${name} | ${TITLE_SUFFIX[locale]}`
  const description = `${truncateText(getLocalizedProductDescription(product, locale), 150)} ${TAIL[locale]}`
  const url = getLocalizedProductUrl(slug, locale)
  const prefix = locale === 'en' ? '' : `/${locale}`
  const image = `${origin}${prefix}/products/${slug}/opengraph-image`
  const dir = locale === 'ar' ? 'rtl' : 'ltr'

  const t = escapeHtml(title)
  const d = escapeHtml(description)
  const u = escapeHtml(url)
  const i = escapeHtml(image)

  return `<!doctype html>
<html lang="${locale}" dir="${dir}">
<head>
<meta charset="utf-8">
<title>${t}</title>
<meta name="description" content="${d}">
<link rel="canonical" href="${u}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="GENOSYS">
<meta property="og:locale" content="${OG_LOCALE[locale]}">
<meta property="og:url" content="${u}">
<meta property="og:title" content="${t}">
<meta property="og:description" content="${d}">
<meta property="og:image" content="${i}">
<meta property="og:image:secure_url" content="${i}">
<meta property="og:image:type" content="image/png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${escapeHtml(name)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:site" content="@genosys_official">
<meta name="twitter:title" content="${t}">
<meta name="twitter:description" content="${d}">
<meta name="twitter:image" content="${i}">
<meta property="product:price:amount" content="${product.price}">
<meta property="product:price:currency" content="AED">
<meta property="product:availability" content="${product.inStock ? 'in stock' : 'out of stock'}">
<meta property="product:brand" content="GENOSYS">
</head>
<body><a href="${u}">${t}</a></body>
</html>
`
}
