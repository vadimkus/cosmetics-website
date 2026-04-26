import { CartItem, Product } from '@/types'
import { buildPricingContract } from '@/lib/pricingContract'
import { ApiUser, User } from '@/types/user'

export type CartDiscountType = 'none' | 'bundle' | 'black_friday' | 'beauty_box' | 'user'

export interface CartLinePricing {
  retailUnitPrice: number
  unitPrice: number
  quantity: number
  retailLineTotal: number
  lineTotal: number
  discountAmount: number
  discountPercentage: number
  discountType: CartDiscountType
}

function roundMoney(value: number): number {
  return Math.round((Number(value) || 0) * 100) / 100
}

function getBundleRetailPrice(product: Product): number {
  return Number(product?.price || 0) || 0
}

export function getCartLinePricing(
  item: CartItem,
  user: User | ApiUser | null = null
): CartLinePricing {
  const quantity = item.quantity || 1
  const isBundleItem = Boolean(item.fromBundle && item.bundleDiscountPercent && item.bundleDiscountPercent > 0)

  if (isBundleItem) {
    const retailUnitPrice = getBundleRetailPrice(item.product)
    const discountPercentage = Number(item.bundleDiscountPercent || 0) || 0
    const unitPrice = roundMoney(retailUnitPrice * (1 - discountPercentage / 100))
    const retailLineTotal = roundMoney(retailUnitPrice * quantity)
    const lineTotal = roundMoney(unitPrice * quantity)

    return {
      retailUnitPrice,
      unitPrice,
      quantity,
      retailLineTotal,
      lineTotal,
      discountAmount: roundMoney(retailLineTotal - lineTotal),
      discountPercentage,
      discountType: 'bundle',
    }
  }

  const contract = buildPricingContract(item.product, user, {
    ...(item.selectedSize ? { selectedSize: item.selectedSize } : {}),
    ...(item.selectedColor ? { selectedColor: item.selectedColor } : {}),
  })
  const retailUnitPrice = contract.originalPrice && contract.originalPrice > contract.displayPrice
    ? contract.originalPrice
    : contract.basePrice
  const retailLineTotal = roundMoney(retailUnitPrice * quantity)
  const lineTotal = roundMoney(contract.unitPrice * quantity)

  return {
    retailUnitPrice,
    unitPrice: contract.unitPrice,
    quantity,
    retailLineTotal,
    lineTotal,
    discountAmount: roundMoney(retailLineTotal - lineTotal),
    discountPercentage: contract.discountPercentage,
    discountType: contract.discountType,
  }
}

export function getCartTotalPrice(items: CartItem[], user: User | ApiUser | null = null): number {
  return roundMoney(items.reduce((total, item) => total + getCartLinePricing(item, user).lineTotal, 0))
}
