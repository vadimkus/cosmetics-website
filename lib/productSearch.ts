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

function productNameValues(product: Product): string[] {
  return [product.name, product.nameRu, product.nameAr]
    .map(normalizeSearchText)
    .filter(Boolean)
}

function buildHaystack(product: Product): string {
  // Variant colors/sizes make shade and size queries work ("beige cushion",
  // "0.25mm roller", "600ml cleanser") - those values never appear in the
  // product name or description.
  const variantTerms = (product.variants ?? []).flatMap((v) => [v.color, v.size])
  return [
    product.name,
    product.nameRu,
    product.nameAr,
    product.category,
    product.description,
    product.descriptionRu,
    product.descriptionAr,
    product.size,
    ...variantTerms,
  ]
    .map(normalizeSearchText)
    .join(' ')
}

function queryTokens(query: string): string[] {
  return normalizeSearchText(query).split(/\s+/).filter(Boolean)
}

/**
 * Token-based AND matching: every word of the query must appear somewhere in
 * the product's searchable text, so word order doesn't matter
 * ("serum hyaluron" matches "HYALURON SERUM"). Searches EN/RU/AR names and
 * descriptions regardless of the active locale.
 */
export function matchesProductSearch(product: Product, query: string): boolean {
  const tokens = queryTokens(query)
  if (tokens.length === 0) return true
  const haystack = buildHaystack(product)
  return tokens.every((token) => haystack.includes(token))
}

/**
 * Relevance score for product search.
 *
 * Product-name matches intentionally outweigh category/description matches.
 * This prevents a bundle that merely mentions "hyaluron" in its description
 * from appearing above HYALURON CREAM or HYALURON SERUM.
 */
export function getProductSearchRelevance(product: Product, query: string): number {
  const normalizedQuery = normalizeSearchText(query).trim()
  const tokens = queryTokens(query)
  if (!normalizedQuery || tokens.length === 0) return 0

  const names = productNameValues(product)
  const category = normalizeSearchText(product.category)
  const descriptions = [
    product.description,
    product.descriptionRu,
    product.descriptionAr,
  ].map(normalizeSearchText)

  let score = 0

  for (const name of names) {
    if (name === normalizedQuery) score = Math.max(score, 1000)
    if (name.startsWith(normalizedQuery)) score = Math.max(score, 900)
    if (name.includes(normalizedQuery)) score = Math.max(score, 800)
    if (tokens.every(token => name.includes(token))) score = Math.max(score, 700)
    score += tokens.filter(token => name.includes(token)).length * 50
  }

  if (category.includes(normalizedQuery)) score += 100
  score += descriptions.reduce(
    (total, description) =>
      total + tokens.filter(token => description.includes(token)).length * 5,
    0
  )

  return score
}

export function sortProductsBySearchRelevance(
  products: Product[],
  query: string
): Product[] {
  return [...products].sort(
    (a, b) => getProductSearchRelevance(b, query) - getProductSearchRelevance(a, query)
  )
}

export function filterProductsBySearch(products: Product[], query: string): Product[] {
  if (!query.trim()) return products
  return sortProductsBySearchRelevance(
    products.filter(product => matchesProductSearch(product, query)),
    query
  )
}
