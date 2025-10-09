import { useState, useCallback, useMemo } from 'react'
import { Product } from '@/types'
import { getProductSizes, getProductColors, hasProductVariants, getProductPrice } from '@/data/productConfig'

export interface UseProductVariantsReturn {
  selectedSize: string
  selectedColor: string
  availableSizes: Array<{ value: string; label: string; price: number }>
  availableColors: Array<{ value: string; label: string; hex?: string }>
  hasSizeVariants: boolean
  hasColorVariants: boolean
  hasVariants: boolean
  setSelectedSize: (size: string) => void
  setSelectedColor: (color: string) => void
  resetVariants: () => void
}

export const useProductVariants = (product: Product): UseProductVariantsReturn => {
  const rawSizes = getProductSizes(product.id)
  const rawColors = getProductColors(product.id)
  
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
  
  const hasSizeVariants = availableSizes.length > 0
  const hasColorVariants = availableColors.length > 0
  const hasVariants = hasProductVariants(product.id)

  // Initialize with first available options or defaults
  const [selectedSize, setSelectedSize] = useState(() => {
    return availableSizes.length > 0 ? availableSizes[0]?.value || 'default' : 'default'
  })

  const [selectedColor, setSelectedColor] = useState(() => {
    return availableColors.length > 0 ? availableColors[0]?.value || 'default' : 'default'
  })

  const handleSetSelectedSize = useCallback((size: string) => {
    setSelectedSize(size)
  }, [])

  const handleSetSelectedColor = useCallback((color: string) => {
    setSelectedColor(color)
  }, [])

  const resetVariants = useCallback(() => {
    setSelectedSize(availableSizes.length > 0 ? availableSizes[0]?.value || 'default' : 'default')
    setSelectedColor(availableColors.length > 0 ? availableColors[0]?.value || 'default' : 'default')
  }, [availableSizes, availableColors])

  return {
    selectedSize,
    selectedColor,
    availableSizes,
    availableColors,
    hasSizeVariants,
    hasColorVariants,
    hasVariants,
    setSelectedSize: handleSetSelectedSize,
    setSelectedColor: handleSetSelectedColor,
    resetVariants
  }
}
