import { CartItem, Product } from '@/types'
import { buildPricingContract } from '@/lib/pricingContract'
import { ApiUser, User } from '@/types/user'
import { isBeautyBoxProduct } from '@/lib/mobileDiscountRules'

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

export interface CartLinePayloadPricing {
  price: number
  total: number
  bundleDiscount?: number
}

export interface CartDiscountSummary {
  retailTotal: number
  userDiscountTotal: number
  bundleDiscountTotal: number
  afterVipSubtotal: number
  userDiscountPct: number
  bundleDiscountPct: number
  totalSaved: number
  hasUserDiscount: boolean
  hasBundleDiscount: boolean
  hasAnyDiscount: boolean
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
  const isBundleItem = Boolean(
    !isBeautyBoxProduct(item.product) &&
    item.fromBundle &&
    item.bundleDiscountPercent &&
    item.bundleDiscountPercent > 0
  )

  const contract = buildPricingContract(item.product, user, {
    ...(item.selectedSize ? { selectedSize: item.selectedSize } : {}),
    ...(item.selectedColor ? { selectedColor: item.selectedColor } : {}),
  })
  const contractRetailUnitPrice = contract.originalPrice && contract.originalPrice > contract.displayPrice
    ? contract.originalPrice
    : contract.basePrice
  const contractRetailLineTotal = roundMoney(contractRetailUnitPrice * quantity)
  const contractLineTotal = roundMoney(contract.unitPrice * quantity)

  if (isBundleItem) {
    const retailUnitPrice = getBundleRetailPrice(item.product)
    const bundleDiscountPercentage = Number(item.bundleDiscountPercent || 0) || 0
    const bundleUnitPrice = roundMoney(retailUnitPrice * (1 - bundleDiscountPercentage / 100))
    const retailLineTotal = roundMoney(retailUnitPrice * quantity)
    const bundleLineTotal = roundMoney(bundleUnitPrice * quantity)
    const contractBeatsBundle =
      contract.discountAmount > 0 &&
      (
        contract.unitPrice < bundleUnitPrice ||
        (contract.unitPrice === bundleUnitPrice && contract.discountPercentage >= bundleDiscountPercentage)
      )

    // Bundle Builder and VIP/Black Friday discounts are mutually exclusive.
    // A high-discount customer should receive the better personal discount,
    // not be downgraded to the 20% bundle cap.
    if (contractBeatsBundle) {
      return {
        retailUnitPrice: contractRetailUnitPrice,
        unitPrice: contract.unitPrice,
        quantity,
        retailLineTotal: contractRetailLineTotal,
        lineTotal: contractLineTotal,
        discountAmount: roundMoney(contractRetailLineTotal - contractLineTotal),
        discountPercentage: contract.discountPercentage,
        discountType: contract.discountType,
      }
    }

    return {
      retailUnitPrice,
      unitPrice: bundleUnitPrice,
      quantity,
      retailLineTotal,
      lineTotal: bundleLineTotal,
      discountAmount: roundMoney(retailLineTotal - bundleLineTotal),
      discountPercentage: bundleDiscountPercentage,
      discountType: 'bundle',
    }
  }

  return {
    retailUnitPrice: contractRetailUnitPrice,
    unitPrice: contract.unitPrice,
    quantity,
    retailLineTotal: contractRetailLineTotal,
    lineTotal: contractLineTotal,
    discountAmount: roundMoney(contractRetailLineTotal - contractLineTotal),
    discountPercentage: contract.discountPercentage,
    discountType: contract.discountType,
  }
}

export function getCartTotalPrice(items: CartItem[], user: User | ApiUser | null = null): number {
  return roundMoney(items.reduce((total, item) => total + getCartLinePricing(item, user).lineTotal, 0))
}

export function getCartRetailTotal(items: CartItem[], user: User | ApiUser | null = null): number {
  return roundMoney(items.reduce((total, item) => total + getCartLinePricing(item, user).retailLineTotal, 0))
}

export function getCartLinePayloadPricing(
  item: CartItem,
  user: User | ApiUser | null = null
): CartLinePayloadPricing {
  const pricing = getCartLinePricing(item, user)

  return {
    price: pricing.unitPrice,
    total: pricing.lineTotal,
    ...(pricing.discountType === 'bundle' && pricing.discountPercentage > 0
      ? { bundleDiscount: pricing.discountPercentage }
      : {}),
  }
}

export function getCartDiscountSummary(
  items: CartItem[],
  user: User | ApiUser | null = null
): CartDiscountSummary {
  let retailTotal = 0
  let userDiscountTotal = 0
  let bundleDiscountTotal = 0
  let userDiscountPct = 0
  let bundleDiscountPct = 0

  items.forEach((item) => {
    const pricing = getCartLinePricing(item, user)

    // Beauty Boxes show their built-in discount on the line row. Keeping them out of
    // the cart-level waterfall preserves the existing checkout summary behavior.
    retailTotal += pricing.discountType === 'beauty_box'
      ? pricing.lineTotal
      : pricing.retailLineTotal

    if (pricing.discountType === 'bundle') {
      bundleDiscountTotal += pricing.discountAmount
      if (pricing.discountPercentage > 0) bundleDiscountPct = pricing.discountPercentage
      return
    }

    if (pricing.discountType === 'user' || pricing.discountType === 'black_friday') {
      userDiscountTotal += pricing.discountAmount
      if (pricing.discountPercentage > 0) userDiscountPct = pricing.discountPercentage
    }
  })

  retailTotal = roundMoney(retailTotal)
  userDiscountTotal = roundMoney(userDiscountTotal)
  bundleDiscountTotal = roundMoney(bundleDiscountTotal)
  const totalSaved = roundMoney(userDiscountTotal + bundleDiscountTotal)

  return {
    retailTotal,
    userDiscountTotal,
    bundleDiscountTotal,
    afterVipSubtotal: roundMoney(retailTotal - userDiscountTotal),
    userDiscountPct,
    bundleDiscountPct,
    totalSaved,
    hasUserDiscount: userDiscountTotal > 0,
    hasBundleDiscount: bundleDiscountTotal > 0,
    hasAnyDiscount: totalSaved > 0,
  }
}
