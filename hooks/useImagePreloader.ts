'use client'

import { useCallback, useRef } from 'react'
import { imageOptimization, productImageOptimization } from '@/lib/imageOptimization'
import { debugLog, warnLog } from '@/lib/logger'

interface UseImagePreloaderOptions {
  enabled?: boolean
  priority?: 'high' | 'low'
  maxConcurrent?: number
  delay?: number
}

interface Product {
  id: string
  name: string
  image: string
  images?: string
}

/**
 * Hook for intelligently preloading product images
 */
export const useImagePreloader = (options: UseImagePreloaderOptions = {}) => {
  const {
    enabled = true,
    priority = 'low',
    maxConcurrent = 3,
    delay = 1000
  } = options

  const preloadQueueRef = useRef<string[]>([])
  const preloadingRef = useRef<Set<string>>(new Set())
  const preloadedRef = useRef<Set<string>>(new Set())
  const isProcessingRef = useRef(false)

  /**
   * Process preload queue with concurrency control
   */
  const processPreloadQueue = useCallback(async () => {
    if (isProcessingRef.current || !enabled) return

    isProcessingRef.current = true

    while (preloadQueueRef.current.length > 0 && preloadingRef.current.size < maxConcurrent) {
      const imageUrl = preloadQueueRef.current.shift()
      if (!imageUrl || preloadedRef.current.has(imageUrl) || preloadingRef.current.has(imageUrl)) {
        continue
      }

      preloadingRef.current.add(imageUrl)

      try {
        await imageOptimization.preloadImage(imageUrl, priority)
        preloadedRef.current.add(imageUrl)
        debugLog(`Successfully preloaded: ${imageUrl}`)
      } catch {
        warnLog(`Failed to preload: ${imageUrl}`, error)
      } finally {
        preloadingRef.current.delete(imageUrl)
      }
    }

    isProcessingRef.current = false

    // If there are more images to preload, schedule next batch
    if (preloadQueueRef.current.length > 0) {
      setTimeout(processPreloadQueue, delay)
    }
  }, [enabled, priority, maxConcurrent, delay])

  /**
   * Preload a single image
   */
  const preloadImage = useCallback((url: string) => {
    if (!enabled || !url || preloadedRef.current.has(url) || preloadingRef.current.has(url)) {
      return
    }

    if (!preloadQueueRef.current.includes(url)) {
      preloadQueueRef.current.push(url)
    }

    // Start processing if not already running
    if (!isProcessingRef.current) {
      processPreloadQueue()
    }
  }, [enabled, processPreloadQueue])

  /**
   * Preload multiple product images
   */
  const preloadProductImages = useCallback(
    (products: Product[], variant: 'gallery' | 'card' | 'thumbnail' | 'mobile' = 'card') => {
      if (!enabled) return

      const imageUrls = products.map(product => 
        productImageOptimization.getProductImage(product, variant)
      )

      imageUrls.forEach(url => preloadImage(url))
    },
    [enabled, preloadImage]
  )

  /**
   * Preload critical images immediately
   */
  const preloadCriticalImages = useCallback(async (products: Product[]) => {
    if (!enabled) return

    try {
      await productImageOptimization.preloadCriticalImages(products)
    } catch {
      warnLog('Critical image preload failed:', error)
    }
  }, [enabled])

  /**
   * Preload images for next page (pagination)
   */
  const preloadNextPage = useCallback(
    (products: Product[], currentPage: number, itemsPerPage: number) => {
      if (!enabled) return

      const nextPageStart = (currentPage + 1) * itemsPerPage
      const nextPageProducts = products.slice(nextPageStart, nextPageStart + itemsPerPage)
      
      if (nextPageProducts.length > 0) {
        preloadProductImages(nextPageProducts, 'card')
      }
    },
    [enabled, preloadProductImages]
  )

  /**
   * Clear preload queue and cache
   */
  const clearPreloadCache = useCallback(() => {
    preloadQueueRef.current = []
    preloadingRef.current.clear()
    preloadedRef.current.clear()
    isProcessingRef.current = false
  }, [])

  /**
   * Get preload statistics
   */
  const getPreloadStats = useCallback(() => {
    return {
      queued: preloadQueueRef.current.length,
      preloading: preloadingRef.current.size,
      preloaded: preloadedRef.current.size,
      processing: isProcessingRef.current
    }
  }, [])

  return {
    preloadImage,
    preloadProductImages,
    preloadCriticalImages,
    preloadNextPage,
    clearPreloadCache,
    getPreloadStats
  }
}

/**
 * Hook for smart image preloading based on user behavior
 */
export const useSmartImagePreloader = () => {
  const preloader = useImagePreloader({ 
    enabled: true, 
    priority: 'low',
    maxConcurrent: 2,
    delay: 500
  })

  const hoveredProductsRef = useRef<Set<string>>(new Set())

  /**
   * Preload images when user hovers over product
   */
  const handleProductHover = useCallback((product: Product) => {
    if (hoveredProductsRef.current.has(product.id)) return

    hoveredProductsRef.current.add(product.id)
    
    // Preload gallery version for potential viewing
    const galleryImage = productImageOptimization.getProductImage(product, 'gallery')
    preloader.preloadImage(galleryImage)

    // Preload additional images if available
    try {
      if (product.images) {
        const parsedImages = JSON.parse(product.images)
        if (Array.isArray(parsedImages) && parsedImages.length > 1) {
          const additionalImages = productImageOptimization.getAllProductImages(product)
          additionalImages.slice(1, 3).forEach(imageVariants => {
            preloader.preloadImage(imageVariants.gallery)
          })
        }
      }
    } catch {
      // Ignore JSON parse errors
    }
  }, [preloader])

  /**
   * Preload images based on scroll position
   */
  const handleScrollPreload = useCallback((products: Product[], scrollY: number, windowHeight: number) => {
    const viewportBottom = scrollY + windowHeight
    const preloadDistance = windowHeight * 1.5 // Preload 1.5 screens ahead

    // Find products that will be visible soon
    const productsToPreload = products.filter((_, index) => {
      const estimatedPosition = index * 300 // Estimate 300px per product
      return estimatedPosition > scrollY && estimatedPosition < viewportBottom + preloadDistance
    })

    preloader.preloadProductImages(productsToPreload, 'card')
  }, [preloader])

  return {
    ...preloader,
    handleProductHover,
    handleScrollPreload
  }
}

/**
 * Hook for responsive image loading
 */
export const useResponsiveImages = () => {
  const getOptimalImageVariant = useCallback((screenWidth: number): 'gallery' | 'card' | 'mobile' => {
    if (screenWidth < 640) return 'mobile'
    if (screenWidth < 1024) return 'card'
    return 'gallery'
  }, [])

  const getOptimalQuality = useCallback((screenWidth: number, pixelRatio: number = 1): number => {
    const baseQuality = screenWidth < 640 ? 75 : 85
    return pixelRatio > 1 ? Math.min(baseQuality + 10, 95) : baseQuality
  }, [])

  return {
    getOptimalImageVariant,
    getOptimalQuality
  }
}