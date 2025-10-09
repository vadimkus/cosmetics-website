import { useMemo } from 'react'
import { Product } from '@/types'
import { getProductPrice, getProductSizes, getProductColors } from '@/data/productConfig'

export interface UseProductPricingReturn {
  basePrice: number
  currentPrice: number
  availableSizes: Array<{ value: string; label: string; price: number }>
  availableColors: Array<{ value: string; label: string; hex?: string }>
  hasVariants: boolean
  getPriceForSize: (size: string) => number
  getPriceForColor: (color: string) => number
}

export const useProductPricing = (
  product: Product,
  selectedSize?: string,
  selectedColor?: string
): UseProductPricingReturn => {
  const rawSizes = useMemo(() => getProductSizes(product.id), [product.id])
  const rawColors = useMemo(() => getProductColors(product.id), [product.id])
  
  const availableSizes = useMemo(() => {
    return rawSizes.map(size => ({
      value: size.value,
      label: size.label,
      price: getProductPrice(product.id, size.value)
    }))
  }, [rawSizes, product.id])
  
  const availableColors = useMemo(() => {
    return rawColors.map(color => ({
      value: color.value,
      label: color.label
    }))
  }, [rawColors])
  
  const hasVariants = useMemo(() => {
    return availableSizes.length > 0 || availableColors.length > 0
  }, [availableSizes, availableColors])

  const basePrice = useMemo(() => {
    return product.price || 0
  }, [product.price])

  const currentPrice = useMemo(() => {
    if (selectedSize || selectedColor) {
      return getProductPrice(product.id, selectedSize, selectedColor)
    }
    return basePrice
  }, [product.id, selectedSize, selectedColor, basePrice])

  const getPriceForSize = (size: string): number => {
    return getProductPrice(product.id, size)
  }

  const getPriceForColor = (color: string): number => {
    return getProductPrice(product.id, undefined, color)
  }

  return {
    basePrice,
    currentPrice,
    availableSizes,
    availableColors,
    hasVariants,
    getPriceForSize,
    getPriceForColor
  }
}
