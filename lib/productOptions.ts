import { getProductColors, getProductSizes } from '@/data/productConfig'
import type { Product, ProductVariant } from '@/types'

export interface ProductOptionSelection {
  selectedSize: string
  selectedColor: string
}

export interface ProductOption {
  value: string
  label: string
  price?: number
  available: boolean
  isDefault: boolean
  hex?: string
}

export interface ProductOptionModel {
  variants: ProductVariant[]
  sizes: ProductOption[]
  colors: ProductOption[]
  required: {
    size: boolean
    color: boolean
  }
  missingOptionData: boolean
  requiresExplicitSelection: boolean
}

const normalize = (value: unknown) => String(value ?? '').trim()
const optionKey = (value: unknown) => normalize(value).toLocaleLowerCase()

function uniqueOptions(options: ProductOption[]): ProductOption[] {
  const merged = new Map<string, ProductOption>()

  options.forEach((option) => {
    const key = optionKey(option.value)
    if (!key) return
    const existing = merged.get(key)
    if (!existing) {
      merged.set(key, option)
      return
    }
    const preferredPrice = existing.isDefault ? existing.price : option.price
    merged.set(key, {
      ...existing,
      ...option,
      available: existing.available || option.available,
      isDefault: existing.isDefault || option.isDefault,
      ...(preferredPrice !== undefined ? { price: preferredPrice } : {}),
    })
  })

  return Array.from(merged.values())
}

function mergeOptions(primary: ProductOption[], fallback: ProductOption[]): ProductOption[] {
  const merged = new Map<string, ProductOption>()

  ;[...fallback, ...primary].forEach((option) => {
    const key = optionKey(option.value)
    if (!key) return
    merged.set(key, { ...merged.get(key), ...option })
  })

  return Array.from(merged.values())
}

function colorHex(value: string): string | undefined {
  const normalized = value.toLocaleLowerCase()
  if (normalized === 'beige') return '#E6D5B8'
  if (normalized === 'ivory') return '#F5E6D3'
  if (normalized === 'camel') return '#A67C52'
  if (normalized === 'bright') return '#FFF5E6'
  if (normalized === 'natural') return '#E8D5B7'
  return undefined
}

export function extractProductOptions(product: Product): ProductOptionModel {
  const configKey = product.productNumber || product.id
  const variants = (product.variants || [])
    .filter((variant) => normalize(variant.size) || normalize(variant.color))
    .map((variant) => ({
      ...variant,
      size: normalize(variant.size) || null,
      color: normalize(variant.color) || null,
      available: variant.available !== false && product.inStock,
    }))

  const variantSizes = uniqueOptions(
    variants
      .filter((variant) => variant.size)
      .map((variant) => ({
        value: variant.size!,
        label: variant.size!,
        price: Number(variant.price),
        available: variant.available !== false,
        isDefault: variant.isDefault === true,
      })),
  )
  const configSizes = getProductSizes(configKey).map((option) => ({
    value: normalize(option.value),
    label: normalize(option.label || option.value),
    available: option.available !== false && product.inStock,
    isDefault: false,
  }))

  const variantColors = uniqueOptions(
    variants
      .filter((variant) => variant.color)
      .map((variant) => {
        const hex = colorHex(variant.color!)
        return {
          value: variant.color!,
          label: variant.color!,
          price: Number(variant.price),
          available: variant.available !== false,
          isDefault: variant.isDefault === true,
          ...(hex ? { hex } : {}),
        }
      }),
  )
  const configColors = getProductColors(configKey).map((option) => {
    const hex = colorHex(option.value)
    return {
      value: normalize(option.value),
      label: normalize(option.label || option.value),
      available: option.available !== false && product.inStock,
      isDefault: false,
      ...(hex ? { hex } : {}),
    }
  })

  const sizes = mergeOptions(variantSizes, configSizes)
  const colors = mergeOptions(variantColors, configColors)
  const productSignalsVariants = (product.variants || []).some(
    (variant) => normalize(variant.size) || normalize(variant.color),
  )
  const missingOptionData =
    productSignalsVariants && sizes.length === 0 && colors.length === 0

  return {
    variants,
    sizes,
    colors,
    required: {
      size: sizes.length > 1,
      color: colors.length > 1,
    },
    missingOptionData,
    requiresExplicitSelection:
      missingOptionData || sizes.length > 1 || colors.length > 1,
  }
}

export function getInitialProductSelection(product: Product): ProductOptionSelection {
  const model = extractProductOptions(product)
  return {
    selectedSize: model.sizes.length === 1 ? model.sizes[0]!.value : '',
    selectedColor: model.colors.length === 1 ? model.colors[0]!.value : '',
  }
}

export function isProductOptionSelectionRequired(product: Product): boolean {
  return extractProductOptions(product).requiresExplicitSelection
}

export function isOptionAvailable(
  model: ProductOptionModel,
  dimension: 'size' | 'color',
  value: string,
  selection: ProductOptionSelection,
): boolean {
  const normalizedValue = normalize(value)
  const options = dimension === 'size' ? model.sizes : model.colors
  const option = options.find((candidate) => candidate.value === normalizedValue)
  if (!option || !option.available) return false

  const matchingDimension = model.variants.filter((variant) =>
    dimension === 'size'
      ? variant.size === normalizedValue
      : variant.color === normalizedValue,
  )
  if (matchingDimension.length === 0) return option.available

  const otherValue =
    dimension === 'size'
      ? normalize(selection.selectedColor)
      : normalize(selection.selectedSize)
  const otherField = dimension === 'size' ? 'color' : 'size'
  const compatible = otherValue
    ? matchingDimension.filter(
        (variant) => !variant[otherField] || variant[otherField] === otherValue,
      )
    : matchingDimension

  return compatible.some((variant) => variant.available !== false)
}

export function isProductSelectionComplete(
  product: Product,
  selection: ProductOptionSelection,
): boolean {
  const model = extractProductOptions(product)
  if (model.missingOptionData) return false
  if (model.required.size && !normalize(selection.selectedSize)) return false
  if (model.required.color && !normalize(selection.selectedColor)) return false
  if (
    selection.selectedSize &&
    !isOptionAvailable(model, 'size', selection.selectedSize, selection)
  ) {
    return false
  }
  if (
    selection.selectedColor &&
    !isOptionAvailable(model, 'color', selection.selectedColor, selection)
  ) {
    return false
  }
  return true
}

export function getProductOptionKey(
  product: Product,
  selection: ProductOptionSelection,
): string {
  return [
    normalize(product.id),
    normalize(selection.selectedColor),
    normalize(selection.selectedSize),
  ].join('::')
}
