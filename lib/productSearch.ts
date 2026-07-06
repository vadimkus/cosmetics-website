import type { Product } from '@/types'

/**
 * Lowercase, unicode-normalize, and strip combining marks so accented input
 * matches unaccented catalog text. Covers Latin diacritics (é → e) and
 * Arabic harakat (fatha/damma/kasra etc.).
 */
export function normalizeSearchText(value: unknown): string {
  return String(value ?? '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f\u064B-\u0652]/g, '')
}

function buildHaystack(product: Product): string {
  return [
    product.name,
    product.nameRu,
    product.nameAr,
    product.category,
    product.description,
    product.descriptionRu,
    product.descriptionAr,
  ]
    .map(normalizeSearchText)
    .join(' ')
}

/**
 * Token-based AND matching: every word of the query must appear somewhere in
 * the product's searchable text, so word order doesn't matter
 * ("serum hyaluron" matches "HYALURON SERUM"). Searches EN/RU/AR names and
 * descriptions regardless of the active locale.
 */
export function matchesProductSearch(product: Product, query: string): boolean {
  const tokens = normalizeSearchText(query).split(/\s+/).filter(Boolean)
  if (tokens.length === 0) return true
  const haystack = buildHaystack(product)
  return tokens.every((token) => haystack.includes(token))
}

export function filterProductsBySearch(products: Product[], query: string): Product[] {
  if (!query.trim()) return products
  return products.filter((product) => matchesProductSearch(product, query))
}
