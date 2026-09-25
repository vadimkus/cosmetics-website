import type { Product } from '@/types'

/**
 * Server-side check of the size and colour a customer chose, run by every
 * payment route before an amount is computed.
 *
 * The pricing contract falls back to the default variant when the requested
 * size or colour is unknown, so without this a stale cart (old size label, a
 * display-only size on a simple product, a missing choice on a two-size
 * product) was silently charged at the default price while the order kept the
 * phone's string. This resolves the submitted values to the product's real
 * variant values or rejects the line with a machine-readable code the app can
 * act on.
 */

export type CheckoutSelectionResult =
  | { ok: true; selectedSize: string; selectedColor: string }
  | {
      ok: false
      code: 'OPTION_REQUIRED' | 'OPTION_UNAVAILABLE'
      dimension: 'size' | 'color'
      options: string[]
    }

const PROMO_MARKER = '__PROMO__'

const norm = (value: string) => value.toLowerCase().replace(/\s+/g, '').replace(/[()]/g, '')

function distinct(values: Array<string | null | undefined>): string[] {
  return [...new Set(values.map((v) => (v || '').trim()).filter(Boolean))]
}

function match(requested: string, options: string[]): string | null {
  if (!requested) return null
  const exact = options.find((o) => o === requested)
  if (exact) return exact
  const key = norm(requested)
  return options.find((o) => norm(o) === key) || options.find((o) => key.startsWith(norm(o))) || null
}

/**
 * @param lenient free gifts and promo lines: never reject for a missing
 *   choice, only canonicalise what was sent.
 */
export function resolveCheckoutSelection(
  product: Product,
  rawSize: string,
  rawColor: string,
  { lenient = false }: { lenient?: boolean } = {},
): CheckoutSelectionResult {
  const variants = (product.variants || []).filter((v) => v.size || v.color)
  const sizes = distinct(variants.map((v) => v.size))
  const colors = distinct(variants.map((v) => v.color))

  let selectedSize = ''
  if (rawSize === PROMO_MARKER) {
    selectedSize = PROMO_MARKER
  } else if (sizes.length === 1) {
    selectedSize = sizes[0] ?? ''
  } else if (sizes.length > 1) {
    const found = match(rawSize, sizes)
    if (!found && !lenient) return { ok: false, code: 'OPTION_REQUIRED', dimension: 'size', options: sizes }
    selectedSize = found || ''
  }

  let selectedColor = ''
  if (colors.length === 1) {
    selectedColor = colors[0] ?? ''
  } else if (colors.length > 1) {
    const found = match(rawColor, colors)
    if (!found && !lenient) return { ok: false, code: 'OPTION_REQUIRED', dimension: 'color', options: colors }
    selectedColor = found || ''
  }

  if (!lenient && variants.length > 0 && (selectedSize || selectedColor) && selectedSize !== PROMO_MARKER) {
    const variant = variants.find(
      (v) =>
        (!selectedSize || (v.size || '').trim() === selectedSize) &&
        (!selectedColor || (v.color || '').trim() === selectedColor),
    )
    if (variant && variant.available === false) {
      const dimension = selectedColor && colors.length > 1 ? 'color' : 'size'
      const pool = dimension === 'color' ? colors : sizes
      return { ok: false, code: 'OPTION_UNAVAILABLE', dimension, options: pool }
    }
  }

  return { ok: true, selectedSize, selectedColor }
}

/** JSON body for a rejected line; carries both web (`error`) and mobile (`success`) shapes. */
export function checkoutSelectionError(
  result: Extract<CheckoutSelectionResult, { ok: false }>,
  product: Product,
) {
  const what = result.dimension === 'size' ? 'size' : 'shade'
  const error =
    result.code === 'OPTION_UNAVAILABLE'
      ? `The selected ${what} of ${product.name} is not available. Please choose another.`
      : `Please choose a ${what} for ${product.name}.`
  return {
    success: false,
    error,
    code: result.code,
    productId: product.id,
    productNumber: product.productNumber,
    dimension: result.dimension,
    options: result.options,
  }
}
