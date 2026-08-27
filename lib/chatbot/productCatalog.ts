/**
 * Dynamic product catalog for the chat system prompt.
 *
 * Generated from the database at request time so Genie can never recommend
 * removed products, dead IDs, or stale prices (the failure mode fixed in the
 * 2026-07-06 chat audit). Cached in-memory for 10 minutes per instance; on
 * any failure the caller keeps the static catalog baked into SYSTEM_PROMPT
 * as a fallback.
 */

import { prisma } from '@/lib/prisma'
import { errorLog } from '@/lib/logger'

const CATALOG_TTL_MS = 10 * 60 * 1000
const SITE = 'https://genosys.ae'

/** Markers delimiting the static catalog section inside SYSTEM_PROMPT. */
export const CATALOG_SECTION_START = '## Product Catalog (USE THESE EXACT NAMES, URLS AND IDs!)'
export const CATALOG_SECTION_END = '## Product PDF Documentation'

/** Display order for category groups; unknown categories append after these. */
const CATEGORY_ORDER = [
  'Device',
  'Microneedling',
  'Scalp/Hair',
  'PRO Solution',
  'Cleanser',
  'Peeling',
  'Toner/Mist',
  'Bio Meso',
  'Serum',
  'Cream',
  'Sun',
  'Cushion BB',
  'Eye care',
  'Mask',
  'Beauty Boxes',
]

let cache: { text: string; expiresAt: number } | null = null

function formatPrice(price: number): string {
  const rounded = Math.round(price * 100) / 100
  return rounded.toLocaleString('en-US', { maximumFractionDigits: 2 })
}

/** Composite categories like "Cushion BB, Sun, Cream" group under the first part. */
function groupKey(category: string | null | undefined): string {
  return String(category || 'Other').split(',')[0]?.trim() || 'Other'
}

/**
 * Build the live catalog section (markdown) from the database.
 * Returns null on any failure so the caller can keep the static fallback.
 */
export async function getDynamicCatalogSection(): Promise<string | null> {
  if (cache && Date.now() < cache.expiresAt) return cache.text

  try {
    const products = await prisma.product.findMany({
      where: { isHidden: false, inStock: true },
      select: {
        id: true,
        productNumber: true,
        name: true,
        price: true,
        size: true,
        category: true,
        isPriceOnRequest: true,
      },
      orderBy: { name: 'asc' },
    })

    // A tiny result means something is wrong upstream - keep the static list.
    if (products.length < 10) return null

    const groups = new Map<string, string[]>()
    for (const p of products) {
      // getProductById resolves both productNumber and DB id, so this key
      // always yields a working PDP link and add-to-cart card.
      const key = p.productNumber || p.id
      const priceText = p.isPriceOnRequest
        ? 'Price on request (contact us on WhatsApp)'
        : `AED ${formatPrice(p.price)}`
      const sizeText = p.size ? ` (${p.size})` : ''
      const line = `- [${p.name}](${SITE}/products/${key}){{id:${key}}} - ${priceText}${sizeText}`
      const group = groupKey(p.category)
      if (!groups.has(group)) groups.set(group, [])
      groups.get(group)!.push(line)
    }

    const orderedKeys = [
      ...CATEGORY_ORDER.filter((k) => groups.has(k)),
      ...[...groups.keys()].filter((k) => !CATEGORY_ORDER.includes(k)).sort(),
    ]
    const sections = orderedKeys.map((k) => `### ${k}\n${groups.get(k)!.join('\n')}`)

    const text = `${CATALOG_SECTION_START}
**IMPORTANT: Only recommend products from this list - it is LIVE from our database, so prices and availability are current. Use the EXACT format with product ID for the Add to Cart feature.**

**FORMAT: [Product Name](url){{id:NUMBER}} - PRICE**
The {{id:NUMBER}} part enables customers to add products directly to cart from chat!
Beauty Box prices already include the 15% bundle discount.

${sections.join('\n\n')}

`
    cache = { text, expiresAt: Date.now() + CATALOG_TTL_MS }
    return text
  } catch (error) {
    errorLog('[CHAT] Failed to build dynamic product catalog, using static fallback:', error)
    return null
  }
}

/**
 * Replace the static catalog section in the system prompt with the dynamic one.
 * If the dynamic section is unavailable or the markers are missing, the prompt
 * is returned unchanged (static catalog remains in effect).
 */
export function spliceCatalogSection(systemPrompt: string, dynamicSection: string | null): string {
  if (!dynamicSection) return systemPrompt
  const start = systemPrompt.indexOf(CATALOG_SECTION_START)
  const end = systemPrompt.indexOf(CATALOG_SECTION_END)
  if (start === -1 || end === -1 || end <= start) return systemPrompt
  return systemPrompt.slice(0, start) + dynamicSection + systemPrompt.slice(end)
}
