import type { CartItem, Product } from '@/types'

type ProductWithCartMetadata = Product & {
  fromBundle?: boolean
  bundleDiscountPercent?: number
}

export function findSelectedStandardCartLine(
  items: CartItem[],
  productId: string,
  selectedColor?: string,
  selectedSize?: string,
): CartItem | undefined {
  const normalizedColor = selectedColor || ''
  const normalizedSize = selectedSize || ''

  return items.find((item) => {
    const product = item.product as ProductWithCartMetadata
    const isBundle =
      item.fromBundle === true ||
      product.fromBundle === true ||
      Number(item.bundleDiscountPercent) > 0 ||
      Number(product.bundleDiscountPercent) > 0

    return (
      item.product.id === productId &&
      (item.selectedColor || '') === normalizedColor &&
      (item.selectedSize || '') === normalizedSize &&
      !isBundle &&
      !item.homecare
    )
  })
}
