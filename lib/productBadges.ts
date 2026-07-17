/**
 * Single source of truth for "New" badges on genosys.ae + mobile categories API.
 *
 * Rules:
 * - Prefer product-level launch badges (real new SKUs).
 * - Category-level badges only when an entire filter group is newly introduced.
 * - Do NOT badge longstanding lines (Cream, Cleanser) or UI tools (Skin Concern).
 *
 * Update NEW_LAUNCH_PRODUCT_IDS when retiring or adding launch highlights.
 */

/** Product IDs / productNumbers that show a New pill on cards and in pricing badges */
export const NEW_LAUNCH_PRODUCT_IDS: readonly string[] = [
  '63', // REVITA GLOW BLEMISH BALM CREAM
  '66', // CERABARRIER BIOME GEL CLEANSER
]

/**
 * Website category filter IDs (`ProductsPageClient` / `ProductFilters`) that
 * may show a floating New chip. Keep empty unless a whole group is new.
 */
export const NEW_CATEGORY_FILTER_IDS: readonly string[] = []

/**
 * Mobile / DB category display names that may show a New chip via
 * `/api/mobile/categories`. Keep in sync with NEW_CATEGORY_FILTER_IDS intent.
 */
export const NEW_CATEGORY_DISPLAY_NAMES: readonly string[] = []

export function isNewLaunchProduct(
  productId: string | null | undefined,
  productNumber?: string | null,
): boolean {
  const keys = [productNumber, productId].filter(Boolean) as string[]
  return keys.some((k) => NEW_LAUNCH_PRODUCT_IDS.includes(k))
}

export function isNewCategoryFilterId(categoryId: string): boolean {
  return NEW_CATEGORY_FILTER_IDS.includes(categoryId)
}

export function isNewCategoryDisplayName(name: string): boolean {
  return NEW_CATEGORY_DISPLAY_NAMES.includes(name)
}
