import type { Product } from '@/types'

export const ORDER_ITEM_IMAGE_FALLBACK = '/images/genosys-logo-transparent.png'

/**
 * Order records must use the server-side catalog image, never a client/cart
 * snapshot. Carts can survive image migrations and otherwise reintroduce a
 * deleted path into new order emails.
 */
export function canonicalOrderItemImage(
  product: Pick<Product, 'image'> | null | undefined,
): string {
  const image = String(product?.image || '').trim()
  return image || ORDER_ITEM_IMAGE_FALLBACK
}
