import { useMemo } from 'react'
import { Product } from '@/types'
import { getProductImages } from '@/data/productConfig'

export interface UseProductImagesReturn {
  productImages: string[]
  hasVideo: boolean
  videoUrl: string | undefined
  getImageByIndex: (index: number) => string | null
  getThumbnailByIndex: (index: number) => string | null
}

export const useProductImages = (product: Product): UseProductImagesReturn => {
  const productImages = useMemo(() => {
    // First try to get images from config
    const configImages = getProductImages(product.id)
    if (configImages.length > 0) {
      return configImages
    }

    // Fallback to parsing product.images JSON
    if (product.images) {
      try {
        const parsedImages = JSON.parse(product.images)
        return Array.isArray(parsedImages) ? parsedImages : [product.image]
      } catch {
        return [product.image]
      }
    }

    return [product.image]
  }, [product.id, product.images, product.image])

  const hasVideo = useMemo(() => {
    // Check if product has video (e.g., product ID 3)
    return product.id === '3'
  }, [product.id])

  const videoUrl = useMemo(() => {
    if (hasVideo) {
      return 'https://www.youtube.com/embed/7VTkWKkYKwA'
    }
    return undefined
  }, [hasVideo])

  const getImageByIndex = (index: number): string | null => {
    return productImages[index] || null
  }

  const getThumbnailByIndex = (index: number): string | null => {
    return productImages[index] || null
  }

  return {
    productImages,
    hasVideo,
    videoUrl,
    getImageByIndex,
    getThumbnailByIndex
  }
}
