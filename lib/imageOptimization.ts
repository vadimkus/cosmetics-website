/**
 * Advanced Image Optimization Utilities
 * Enhanced features for GENOSYS cosmetics product images
 */

import { debugLog, warnLog } from '@/lib/logger'

// Image format detection and optimization
export const imageOptimization = {
  /**
   * Generate optimized image URL with Next.js Image Optimization API
   */
  getOptimizedUrl: (
    src: string,
    options: {
      width?: number
      height?: number
      quality?: number
      format?: 'webp' | 'avif' | 'auto'
    } = {}
  ): string => {
    if (!src) return '/images/placeholder.png'
    
    const { width = 800, height, quality = 85, format = 'auto' } = options
    
    // If external URL, return as-is (Next.js handles optimization)
    if (src.startsWith('http')) {
      return src
    }
    
    // For local images, add optimization parameters
    const params = new URLSearchParams()
    params.set('w', width.toString())
    if (height) params.set('h', height.toString())
    params.set('q', quality.toString())
    if (format !== 'auto') params.set('f', format)
    
    const separator = src.includes('?') ? '&' : '?'
    return `${src}${separator}${params.toString()}`
  },

  /**
   * Generate responsive image sizes string
   */
  getResponsiveSizes: (breakpoints: { [key: string]: string } = {}): string => {
    const defaultBreakpoints = {
      '(max-width: 640px)': '100vw',
      '(max-width: 768px)': '50vw',
      '(max-width: 1024px)': '33vw',
      ...breakpoints
    }
    
    const sizeEntries = Object.entries(defaultBreakpoints)
    
    if (sizeEntries.length === 0) {
      return '100vw'
    }
    
    const mediaQueries = sizeEntries.slice(0, -1).map(([media, size]) => `${media} ${size}`)
    const defaultSize = sizeEntries[sizeEntries.length - 1]?.[1] || '100vw'
    
    return [...mediaQueries, defaultSize].join(', ')
  },

  /**
   * Generate blur placeholder data URL
   */
  generateBlurPlaceholder: (
    width: number = 8,
    height: number = 8,
    color: string = 'f3f4f6'
  ): string => {
    // Create a minimal SVG blur placeholder
    const svg = `
      <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#${color}"/>
        <rect width="100%" height="100%" fill="url(#grad)" opacity="0.3"/>
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#ffffff;stop-opacity:0.2" />
            <stop offset="100%" style="stop-color:#000000;stop-opacity:0.1" />
          </linearGradient>
        </defs>
      </svg>
    `
    
    return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`
  },

  /**
   * Preload critical images
   */
  preloadImage: (src: string, priority: 'high' | 'low' = 'low'): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined') {
        resolve()
        return
      }

      // Check if image is already loaded
      const existingImg = document.querySelector(`img[src="${src}"]`) as HTMLImageElement
      if (existingImg && existingImg.complete) {
        resolve()
        return
      }

      // Create preload link
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'image'
      link.href = src
      link.fetchPriority = priority
      
      link.onload = () => {
        debugLog(`Preloaded image: ${src}`)
        resolve()
      }
      
      link.onerror = (error) => {
        warnLog(`Failed to preload image: ${src}`, error)
        reject(error)
      }

      document.head.appendChild(link)
    })
  },

  /**
   * Lazy load images with Intersection Observer
   */
  setupLazyLoading: (
    selector: string = 'img[data-src]',
    options: IntersectionObserverInit = {}
  ): () => void => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      return () => {}
    }

    const defaultOptions: IntersectionObserverInit = {
      root: null,
      rootMargin: '50px',
      threshold: 0.1,
      ...options
    }

    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement
          const src = img.dataset.src
          
          if (src) {
            img.src = src
            img.removeAttribute('data-src')
            imageObserver.unobserve(img)
            
            debugLog(`Lazy loaded image: ${src}`)
          }
        }
      })
    }, defaultOptions)

    // Observe all images with data-src attribute
    const images = document.querySelectorAll(selector)
    images.forEach((img) => imageObserver.observe(img))

    // Return cleanup function
    return () => {
      imageObserver.disconnect()
    }
  },

  /**
   * Calculate optimal image dimensions for product photos
   */
  calculateOptimalDimensions: (
    originalWidth: number,
    originalHeight: number,
    maxWidth: number = 800,
    maxHeight: number = 800
  ): { width: number; height: number } => {
    const aspectRatio = originalWidth / originalHeight
    
    let width = originalWidth
    let height = originalHeight
    
    // Scale down if exceeds max dimensions
    if (width > maxWidth) {
      width = maxWidth
      height = width / aspectRatio
    }
    
    if (height > maxHeight) {
      height = maxHeight
      width = height * aspectRatio
    }
    
    return {
      width: Math.round(width),
      height: Math.round(height)
    }
  },

  /**
   * Generate product image variants for different use cases
   */
  generateProductImageVariants: (baseSrc: string, productId: string) => {
    const addVersionParam = (src: string) => {
      const separator = src.includes('?') ? '&' : '?'
      const version = `${productId}-${src.split('/').pop()?.replace(/[^a-zA-Z0-9]/g, '') || 'img'}`
      return `${src}${separator}v=${version}`
    }

    return {
      // High quality for gallery main view
      gallery: imageOptimization.getOptimizedUrl(addVersionParam(baseSrc), {
        width: 800,
        height: 800,
        quality: 90,
        format: 'auto'
      }),
      
      // Medium quality for product cards
      card: imageOptimization.getOptimizedUrl(addVersionParam(baseSrc), {
        width: 400,
        height: 400,
        quality: 85,
        format: 'auto'
      }),
      
      // Thumbnails for image gallery navigation
      thumbnail: imageOptimization.getOptimizedUrl(addVersionParam(baseSrc), {
        width: 100,
        height: 100,
        quality: 75,
        format: 'auto'
      }),
      
      // Small for mobile lists
      mobile: imageOptimization.getOptimizedUrl(addVersionParam(baseSrc), {
        width: 200,
        height: 200,
        quality: 80,
        format: 'auto'
      }),
      
      // Original with version for cache busting
      original: addVersionParam(baseSrc)
    }
  },

  /**
   * Performance monitoring for images
   */
  monitorImagePerformance: () => {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
      return
    }

    const perfObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      
      entries.forEach((entry) => {
        if (entry.entryType === 'resource' && entry.name.match(/\.(jpg|jpeg|png|webp|avif)$/i)) {
          const resourceEntry = entry as PerformanceResourceTiming
          
          debugLog('Image Performance:', {
            url: entry.name,
            loadTime: resourceEntry.responseEnd - resourceEntry.startTime,
            size: resourceEntry.transferSize || 'Unknown',
            cached: resourceEntry.transferSize === 0
          })
        }
      })
    })

    perfObserver.observe({ entryTypes: ['resource'] })

    return () => perfObserver.disconnect()
  }
}

/**
 * Product-specific image optimization
 */
export const productImageOptimization = {
  /**
   * Get optimized product image with fallbacks
   */
  getProductImage: (
    product: { id: string; image: string; images?: string; name?: string },
    variant: 'gallery' | 'card' | 'thumbnail' | 'mobile' = 'card'
  ): string => {
    let imageSrc = product.image
    
    // Try to get first image from images JSON if available
    if (product.images) {
      try {
        const parsedImages = JSON.parse(product.images)
        if (Array.isArray(parsedImages) && parsedImages.length > 0) {
          imageSrc = parsedImages[0]
        }
      } catch {
        // Fall back to product.image
      }
    }
    
    if (!imageSrc) {
      return '/images/placeholder.png'
    }
    
    return imageOptimization.generateProductImageVariants(imageSrc, product.id)[variant]
  },

  /**
   * Get all product images with optimization
   */
  getAllProductImages: (product: { id: string; image: string; images?: string }) => {
    let images = [product.image]
    
    if (product.images) {
      try {
        const parsedImages = JSON.parse(product.images)
        images = Array.isArray(parsedImages) ? parsedImages : [product.image]
      } catch {
        // Fall back to single image
      }
    }
    
    return images.map((img) => 
      imageOptimization.generateProductImageVariants(img || product.image, product.id)
    )
  },

  /**
   * Preload critical product images
   */
  preloadCriticalImages: async (products: Array<{ id: string; image: string; images?: string; name?: string }>) => {
    // Preload first 3 product images for better perceived performance
    const criticalProducts = products.slice(0, 3)
    
    const preloadPromises = criticalProducts.map((product) => {
      const imageSrc = productImageOptimization.getProductImage(product, 'card')
      return imageOptimization.preloadImage(imageSrc, 'high')
    })
    
    try {
      await Promise.all(preloadPromises)
      debugLog('Critical product images preloaded')
    } catch (error) {
      warnLog('Some critical images failed to preload:', error)
    }
  }
}

/**
 * Image format detection and fallback
 */
export const formatDetection = {
  /**
   * Check browser support for modern image formats
   */
  checkFormatSupport: async (): Promise<{
    webp: boolean
    avif: boolean
  }> => {
    if (typeof window === 'undefined') {
      return { webp: false, avif: false }
    }

    const checkWebP = (): Promise<boolean> => {
      return new Promise((resolve) => {
        const webP = new Image()
        webP.onload = webP.onerror = () => {
          resolve(webP.height === 2)
        }
        webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA'
      })
    }

    const checkAVIF = (): Promise<boolean> => {
      return new Promise((resolve) => {
        const avif = new Image()
        avif.onload = avif.onerror = () => {
          resolve(avif.height === 2)
        }
        avif.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEAwgMg8f8D///8WfhwB8+ErK42A='
      })
    }

    const [webp, avif] = await Promise.all([checkWebP(), checkAVIF()])
    
    return { webp, avif }
  }
}