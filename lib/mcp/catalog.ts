/**
 * Catalog shaping for the GENOSYS MCP server (/mcp). Pure functions over Product
 * rows so the tools stay thin and this file stays testable.
 *
 * Prices are what a guest sees on genosys.ae: VAT-inclusive AED from
 * calculateProductPricing(product, null). Never add VAT on top.
 */

import type { Product } from '@/types'
import { calculateProductPricing, generateProductVariants } from '@/lib/pricingEngine'
import { getProductColors } from '@/data/productConfig'
import {
  getProductSearchRelevance,
  matchesProductSearch,
  normalizeSearchText,
} from '@/lib/productSearch'

export const SITE_ORIGIN = 'https://genosys.ae'

export type McpLocale = 'en' | 'ru' | 'ar'

export function asLocale(value: unknown): McpLocale {
  return value === 'ru' || value === 'ar' ? value : 'en'
}

export function productSlug(product: Pick<Product, 'id' | 'productNumber'>): string {
  return product.productNumber?.trim() || product.id
}

export function productUrl(product: Pick<Product, 'id' | 'productNumber'>, locale: McpLocale): string {
  const prefix = locale === 'en' ? '' : `/${locale}`
  return `${SITE_ORIGIN}${prefix}/products/${productSlug(product)}`
}

export function absoluteUrl(path: string | null | undefined): string | null {
  if (!path) return null
  if (/^https?:\/\//i.test(path)) return path
  return `${SITE_ORIGIN}${path.startsWith('/') ? '' : '/'}${path}`
}

export function stripHtml(html: string | null | undefined): string {
  return String(html || '')
    .replace(/<(script|style)[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|div|h[1-6]|li|tr)>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n\s*\n+/g, '\n\n')
    .trim()
}

function parseJson<T>(value: unknown): T | null {
  if (value == null || value === '') return null
  if (typeof value !== 'string') return value as T
  try {
    return JSON.parse(value) as T
  } catch {
    return null
  }
}

export function parseList(value: unknown): string[] {
  const parsed = parseJson<unknown>(value)
  if (!Array.isArray(parsed)) return []
  return parsed
    .map((item) => {
      if (typeof item === 'string') return item.trim()
      if (item && typeof item === 'object') {
        const o = item as Record<string, unknown>
        const head = String(o.title ?? o.name ?? o.step ?? '').trim()
        const body = String(o.description ?? o.instruction ?? '').trim()
        return [head, body].filter(Boolean).join(': ')
      }
      return ''
    })
    .filter(Boolean)
}

export function categoriesOf(product: Pick<Product, 'category'>): string[] {
  return String(product.category || '')
    .split(',')
    .map((c) => c.trim())
    .filter(Boolean)
}

export function concernsOf(product: Pick<Product, 'targetConcerns'>): string[] {
  const parsed = parseJson<unknown>(product.targetConcerns)
  return Array.isArray(parsed) ? parsed.map((c) => String(c).trim()).filter(Boolean) : []
}

function localizedDescription(product: Product, locale: McpLocale): string {
  if (locale === 'ru' && product.descriptionRu?.trim()) return product.descriptionRu.trim()
  if (locale === 'ar' && product.descriptionAr?.trim()) return product.descriptionAr.trim()
  return product.description || ''
}

function shortText(text: string, max = 240): string {
  const clean = stripHtml(text).replace(/\s+/g, ' ').trim()
  if (clean.length <= max) return clean
  const cut = clean.slice(0, max)
  const lastStop = Math.max(cut.lastIndexOf('. '), cut.lastIndexOf('! '), cut.lastIndexOf('? '))
  return lastStop > max * 0.5 ? cut.slice(0, lastStop + 1) : `${cut.replace(/\s+\S*$/, '')}…`
}

export interface ProductSummary {
  id: string
  name: string
  category: string[]
  size: string | null
  price_aed: number | null
  original_price_aed: number | null
  discount_percent: number | null
  price_note: string
  in_stock: boolean
  concerns: string[]
  skin_type: string | null
  summary: string
  url: string
  image: string | null
}

export function priceOf(product: Product): Pick<ProductSummary, 'price_aed' | 'original_price_aed' | 'discount_percent'> {
  if (product.isPriceOnRequest) {
    return { price_aed: null, original_price_aed: null, discount_percent: null }
  }
  const pricing = calculateProductPricing(product, null)
  return {
    price_aed: pricing.displayPrice,
    original_price_aed: pricing.hasDiscount && pricing.originalPrice ? pricing.originalPrice : null,
    discount_percent: pricing.hasDiscount ? (pricing.discountPercentage ?? null) : null,
  }
}

export function summarizeProduct(product: Product, locale: McpLocale): ProductSummary {
  const price = priceOf(product)
  return {
    id: productSlug(product),
    name: product.name,
    category: categoriesOf(product),
    size: product.size?.trim() || null,
    ...price,
    price_note: product.isPriceOnRequest
      ? 'Professional product: price on request (contact GENOSYS)'
      : 'AED, includes 5% UAE VAT',
    in_stock: Boolean(product.inStock),
    concerns: concernsOf(product),
    skin_type: product.skinType?.trim() || null,
    summary: shortText(localizedDescription(product, locale)),
    url: productUrl(product, locale),
    image: absoluteUrl(product.image),
  }
}

export interface ProductOption {
  size: string | null
  color: string | null
  label: string
  price_aed: number
  available: boolean
}

/** Sizes and shades a shopper can pick, with the value the bag stores and its label. */
export function productOptions(product: Product): ProductOption[] {
  const fromVariants: ProductOption[] = generateProductVariants(product, null)
    .filter((v) => (v.size && v.size !== 'default') || v.color)
    .map((v) => {
      const size = v.size && v.size !== 'default' ? v.size : null
      const color = v.color || null
      return { size, color, label: [size, color].filter(Boolean).join(' / '), price_aed: v.price, available: Boolean(v.available) }
    })
  if (fromVariants.some((o) => o.color)) return fromVariants

  // Shades configured outside the variants table (e.g. Revita Glow #01 Bright / #02 Natural).
  const basePrice = priceOf(product).price_aed ?? product.price
  const shades = getProductColors(productSlug(product)).map((c) => ({
    size: null,
    color: c.value,
    label: c.label,
    price_aed: basePrice,
    available: Boolean(c.available && product.inStock),
  }))
  return [...fromVariants, ...shades]
}

const optionKey = (value: string) => normalizeSearchText(value).replace(/^#?\d+\s*/, '').replace(/\s+/g, ' ').trim()

/**
 * Match the shopper's size/shade to the product's real options (by value or label,
 * "#01 Bright" or "bright"). Products with shades or sizes need one picked.
 */
export function resolveSelection(
  product: Product,
  size?: string | null,
  color?: string | null
): { ok: true; size: string | null; color: string | null; price_aed: number | null } | { ok: false; error: string } {
  const options = productOptions(product)
  const shades = options.filter((o) => o.color)
  const sizes = options.filter((o) => o.size && !o.color)

  let pickedColor: string | null = null
  if (shades.length) {
    if (!color) return { ok: false, error: `${product.name} comes in ${shades.map((o) => o.label).join(', ')}: pick one.` }
    const want = optionKey(color)
    const hit = shades.find((o) => optionKey(o.color || '') === want || optionKey(o.label) === want)
    if (!hit) return { ok: false, error: `${product.name} has no shade "${color}". Options: ${shades.map((o) => o.label).join(', ')}.` }
    if (!hit.available) return { ok: false, error: `${product.name} ${hit.label} is not available right now.` }
    pickedColor = hit.color
  }

  let pickedSize: string | null = null
  let price: number | null = priceOf(product).price_aed
  if (sizes.length) {
    if (!size) return { ok: false, error: `${product.name} comes in ${sizes.map((o) => o.label).join(', ')}: pick one.` }
    const want = normalizeSearchText(size).replace(/\s+/g, '')
    const hit = sizes.find((o) => normalizeSearchText(o.size || '').replace(/\s+/g, '') === want)
    if (!hit) return { ok: false, error: `${product.name} has no size "${size}". Options: ${sizes.map((o) => o.label).join(', ')}.` }
    if (!hit.available) return { ok: false, error: `${product.name} ${hit.label} is not available right now.` }
    pickedSize = hit.size
    price = hit.price_aed
  }

  return { ok: true, size: pickedSize, color: pickedColor, price_aed: price }
}

export function productDetail(product: Product, locale: McpLocale) {
  const details = parseJson<Record<string, unknown>>(product.productDetails)
  return {
    ...summarizeProduct(product, locale),
    description: stripHtml(localizedDescription(product, locale)),
    key_features: parseList(product.keyFeatures),
    benefits: parseList(product.benefits),
    ingredients_and_actives: parseList(product.ingredients),
    how_to_use: parseList(product.howToUse).length
      ? parseList(product.howToUse)
      : [stripHtml(product.howToUse || product.directions || '')].filter(Boolean),
    usage_time: product.usage?.trim() || null,
    details: details && typeof details === 'object' && !Array.isArray(details) ? details : null,
    options: productOptions(product),
    disclaimer: product.disclaimer?.trim() || null,
    add_to_bag_url: buildBagLink([{ product_id: productSlug(product), quantity: 1 }]),
  }
}

// Plain-language words a shopper types, mapped to the concern tags in the catalog.
const CONCERN_SYNONYMS: Record<string, string[]> = {
  'anti-aging': ['aging', 'ageing', 'wrinkle', 'wrinkles', 'lines', 'firming', 'lifting', 'морщин', 'возраст', 'تجاعيد'],
  hydration: ['dry', 'dryness', 'dehydrated', 'moisture', 'hydrating', 'сух', 'увлажн', 'جفاف', 'ترطيب'],
  sensitivity: ['sensitive', 'redness', 'irritation', 'calming', 'чувствител', 'покраснен', 'حساس'],
  'pore-care': ['pore', 'pores', 'blackheads', 'oily', 'shine', 'пор', 'жирн', 'مسام', 'دهني'],
  brightening: ['dull', 'pigmentation', 'spots', 'melasma', 'glow', 'radiance', 'пигмент', 'сияни', 'تصبغ', 'إشراق'],
  'acne-blemishes': ['acne', 'pimples', 'breakouts', 'blemish', 'blemishes', 'акне', 'прыщ', 'حب الشباب'],
  hair: ['hair', 'scalp', 'shampoo', 'волос', 'кожа головы', 'شعر'],
  'hair-loss': ['hair loss', 'thinning', 'выпаден', 'تساقط'],
  'eye-care': ['eye', 'eyes', 'dark circles', 'puffiness', 'глаз', 'عين'],
  'sun-protection': ['sun', 'spf', 'sunscreen', 'uv', 'солнц', 'شمس'],
  'barrier-repair': ['barrier', 'ceramide', 'барьер'],
}

const STOP_WORDS = new Set([
  'a', 'an', 'and', 'the', 'for', 'with', 'my', 'me', 'i', 'to', 'of', 'in', 'on', 'is', 'that', 'what',
  'which', 'best', 'good', 'need', 'want', 'something', 'product', 'products', 'skin', 'face', 'genosys',
  'для', 'и', 'с', 'на', 'в', 'что', 'кожи', 'кожа', 'лица', 'من', 'في', 'على', 'و', 'لل', 'للبشرة',
])

export function inferConcerns(query: string): string[] {
  const q = normalizeSearchText(query)
  return Object.entries(CONCERN_SYNONYMS)
    .filter(([tag, words]) => q.includes(tag) || words.some((w) => q.includes(normalizeSearchText(w))))
    .map(([tag]) => tag)
}

export interface SearchFilters {
  query?: string | undefined
  category?: string | undefined
  concern?: string | undefined
  skin_type?: string | undefined
  max_price_aed?: number | undefined
  in_stock_only?: boolean | undefined
  limit?: number | undefined
}

function meaningfulTokens(query: string): string[] {
  return normalizeSearchText(query)
    .split(/[\s,.;:!?/()]+/)
    .filter((t) => t.length > 2 && !STOP_WORDS.has(t))
}

function looseScore(product: Product, query: string, concerns: string[]): number {
  const tokens = meaningfulTokens(query)
  const haystack = normalizeSearchText(
    [
      product.name,
      product.nameRu,
      product.nameAr,
      product.category,
      product.description,
      product.descriptionRu,
      product.descriptionAr,
      product.targetConcerns,
      product.skinType,
      product.keyFeatures,
      product.benefits,
    ].join(' ')
  )
  const tokenHits = tokens.filter((t) => haystack.includes(t)).length
  const productConcerns = concernsOf(product)
  const concernHits = concerns.filter((c) => productConcerns.includes(c)).length
  if (tokenHits === 0 && concernHits === 0) return 0
  // What the product IS (name, category) outranks what its description mentions:
  // "serum for dry skin" should put a serum above a box that contains one.
  const names = normalizeSearchText([product.name, product.nameRu, product.nameAr].join(' '))
  const cats = normalizeSearchText(product.category)
  const nameHits = tokens.filter((t) => names.includes(t)).length
  const categoryHits = tokens.filter((t) => cats.includes(t)).length
  return nameHits * 40 + categoryHits * 30 + tokenHits * 10 + concernHits * 25 + Math.min(getProductSearchRelevance(product, query), 1000) / 100
}

export function searchProducts(products: Product[], filters: SearchFilters): Product[] {
  const limit = Math.min(Math.max(filters.limit ?? 8, 1), 25)
  const category = normalizeSearchText(filters.category || '').trim()
  const concern = normalizeSearchText(filters.concern || '').trim()
  const skinType = normalizeSearchText(filters.skin_type || '').trim()

  const pool = products.filter((p) => {
    if (filters.in_stock_only && !p.inStock) return false
    if (category && !categoriesOf(p).some((c) => normalizeSearchText(c).includes(category))) return false
    if (concern) {
      const tags = concernsOf(p).map(normalizeSearchText)
      const wanted = [concern, ...inferConcerns(concern)]
      if (!tags.some((t) => wanted.some((w) => t.includes(w)))) return false
    }
    if (skinType) {
      const st = normalizeSearchText(p.skinType || '')
      if (st && st !== 'all' && !st.includes(skinType)) return false
    }
    if (filters.max_price_aed != null) {
      const { price_aed } = priceOf(p)
      if (price_aed == null || price_aed > filters.max_price_aed) return false
    }
    return true
  })

  const query = (filters.query || '').trim()
  if (!query) return pool.slice(0, limit)

  const concerns = inferConcerns(query)
  const core = meaningfulTokens(query).join(' ') || query
  return pool
    .map((p) => {
      const exact = matchesProductSearch(p, query) || matchesProductSearch(p, core)
      const score = looseScore(p, query, concerns)
      return { p, score: score + (exact ? 60 : 0), exact }
    })
    .filter((x) => x.exact || x.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((x) => x.p)
    .slice(0, limit)
}

export interface BagItem {
  product_id: string
  quantity: number
  size?: string | null | undefined
  color?: string | null | undefined
}

/**
 * One link that puts the items in the shopper's bag on genosys.ae. Each entry is
 * `id|qty|size|color`, entries joined by commas; /add-to-bag parses the same format.
 */
export function buildBagLink(items: BagItem[]): string {
  const encoded = items
    .map((item) => {
      const qty = Math.min(Math.max(Math.round(item.quantity || 1), 1), 20)
      const parts = [item.product_id, String(qty), item.size || '', item.color || '']
      while (parts.length > 2 && !parts[parts.length - 1]) parts.pop()
      return parts.map((part) => part.replace(/[|,]/g, ' ').trim()).join('|')
    })
    .join(',')
  return `${SITE_ORIGIN}/add-to-bag?items=${encodeURIComponent(encoded)}`
}

export function parseBagItems(param: string | null | undefined): BagItem[] {
  if (!param) return []
  return param
    .split(',')
    .slice(0, 20)
    .map((entry) => {
      const [id = '', qty = '1', size = '', color = ''] = entry.split('|').map((part) => part.trim())
      const quantity = Math.min(Math.max(parseInt(qty, 10) || 1, 1), 20)
      return { product_id: id, quantity, size: size || null, color: color || null }
    })
    .filter((item) => /^[A-Za-z0-9_-]{1,64}$/.test(item.product_id))
}
