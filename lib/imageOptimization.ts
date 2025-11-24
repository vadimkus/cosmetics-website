/**
 * Image Optimization Utilities
 * Provides helpers for optimizing images with WebP/AVIF formats
 */

export interface ImageOptimizationOptions {
  width?: number
  height?: number
  quality?: number
  format?: 'avif' | 'webp' | 'auto'
}

/**
 * Quality presets for different image types
 */
export const ImageQuality = {
  /** High quality for hero images, product galleries */
  HIGH: 90,
  /** Standard quality for product cards, thumbnails */
  STANDARD: 85,
  /** Lower quality for small thumbnails, icons */
  LOW: 75,
  /** Minimum quality for placeholders */
  MINIMUM: 60,
} as const

/**
 * Size presets for responsive images
 */
export const ImageSizes = {
  /** Product card images */
  PRODUCT_CARD: '(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw',
  /** Product gallery main image */
  PRODUCT_GALLERY: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px',
  /** Hero images */
  HERO: '(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1920px',
  /** Blog images */
  BLOG: '(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px',
  /** Thumbnail images */
  THUMBNAIL: '64px',
  /** Logo images */
  LOGO: '(max-width: 768px) 150px, 180px',
} as const

/**
 * Default blur placeholder (1x1 pixel JPEG)
 * This is used as a placeholder while images load
 */
export const DEFAULT_BLUR_DATA_URL = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k='

/**
 * Get optimal image quality based on image type and size
 */
export function getOptimalQuality(
  imageType: 'hero' | 'product' | 'thumbnail' | 'blog' | 'logo',
  isPriority: boolean = false
): number {
  const qualityMap: Record<string, number> = {
    hero: ImageQuality.HIGH,
    product: isPriority ? ImageQuality.HIGH : ImageQuality.STANDARD,
    thumbnail: ImageQuality.LOW,
    blog: ImageQuality.STANDARD,
    logo: ImageQuality.HIGH,
  }

  return qualityMap[imageType] || ImageQuality.STANDARD
}

/**
 * Get optimal sizes attribute based on image type
 */
export function getOptimalSizes(imageType: 'product-card' | 'product-gallery' | 'hero' | 'blog' | 'thumbnail' | 'logo'): string {
  const sizesMap: Record<string, string> = {
    'product-card': ImageSizes.PRODUCT_CARD,
    'product-gallery': ImageSizes.PRODUCT_GALLERY,
    hero: ImageSizes.HERO,
    blog: ImageSizes.BLOG,
    thumbnail: ImageSizes.THUMBNAIL,
    logo: ImageSizes.LOGO,
  }

  return sizesMap[imageType] || ImageSizes.PRODUCT_CARD
}

/**
 * Check if browser supports AVIF format
 */
export function supportsAVIF(): boolean {
  if (typeof window === 'undefined') return false
  
  const canvas = document.createElement('canvas')
  canvas.width = 1
  canvas.height = 1
  
  return canvas.toDataURL('image/avif').indexOf('data:image/avif') === 0
}

/**
 * Check if browser supports WebP format
 */
export function supportsWebP(): boolean {
  if (typeof window === 'undefined') return false
  
  const canvas = document.createElement('canvas')
  canvas.width = 1
  canvas.height = 1
  
  return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0
}

/**
 * Get the best supported format for the current browser
 * Next.js handles this automatically, but this can be used for manual checks
 */
export function getBestSupportedFormat(): 'avif' | 'webp' | 'jpeg' {
  if (supportsAVIF()) return 'avif'
  if (supportsWebP()) return 'webp'
  return 'jpeg'
}

/**
 * Generate cache-busting version string for images
 */
export function generateImageVersion(imagePath: string, productId?: string): string {
  const filename = imagePath.split('/').pop()?.replace(/[^a-zA-Z0-9]/g, '') || 'img'
  return productId ? `${productId}-${filename}` : filename
}

/**
 * Add version query parameter to image URL for cache busting
 */
export function addImageVersion(imageSrc: string, version: string): string {
  const separator = imageSrc.includes('?') ? '&' : '?'
  return `${imageSrc}${separator}v=${version}`
}

