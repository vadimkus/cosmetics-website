'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { imageOptimization, productImageOptimization } from '@/lib/imageOptimization'
import { debugLog } from '@/lib/logger'

interface EnhancedProductImageProps {
  product: {
    id: string
    name: string
    image: string
    images?: string
  }
  variant?: 'gallery' | 'card' | 'thumbnail' | 'mobile'
  className?: string
  priority?: boolean
  quality?: number
  fill?: boolean
  sizes?: string
  onClick?: () => void
  onLoad?: () => void
  onError?: () => void
  enableLazyLoading?: boolean
  enableHover?: boolean
  showLoadingSpinner?: boolean
}

export default function EnhancedProductImage({
  product,
  variant = 'card',
  className,
  priority = false,
  quality = 85,
  fill = false,
  sizes,
  onClick,
  onLoad,
  onError,
  enableLazyLoading = true,
  enableHover = true,
  showLoadingSpinner = true
}: EnhancedProductImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const imageRef = useRef<HTMLDivElement>(null)
  const hoverTimeoutRef = useRef<NodeJS.Timeout>()

  // Get all product images with optimization
  const productImages = productImageOptimization.getAllProductImages(product)
  const currentImageVariants = productImages[currentImageIndex] || productImages[0]

  // Get dimensions based on variant
  const getDimensions = () => {
    switch (variant) {
      case 'gallery':
        return { width: 800, height: 800 }
      case 'card':
        return { width: 400, height: 400 }
      case 'thumbnail':
        return { width: 100, height: 100 }
      case 'mobile':
        return { width: 200, height: 200 }
      default:
        return { width: 400, height: 400 }
    }
  }

  const { width: imgWidth, height: imgHeight } = getDimensions()

  // Generate responsive sizes if not provided
  const responsiveSizes = sizes || imageOptimization.getResponsiveSizes({
    '(max-width: 640px)': variant === 'gallery' ? '100vw' : '50vw',
    '(max-width: 768px)': variant === 'gallery' ? '100vw' : '33vw',
    '(max-width: 1024px)': variant === 'gallery' ? '80vw' : '25vw'
  })

  // Generate blur placeholder
  const blurPlaceholder = imageOptimization.generateBlurPlaceholder(
    Math.min(imgWidth, 20),
    Math.min(imgHeight, 20),
    'f3f4f6'
  )

  // Handle hover for multiple images
  useEffect(() => {
    if (!enableHover || productImages.length <= 1) return

    let interval: NodeJS.Timeout

    if (isHovered) {
      // Cycle through images on hover
      interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % productImages.length)
      }, 800) // Change image every 800ms
    } else {
      // Reset to first image when not hovered
      setCurrentImageIndex(0)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isHovered, productImages.length, enableHover])

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!enableLazyLoading || priority) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Image is in viewport, start loading
            debugLog(`Image entered viewport: ${product.name}`)
            observer.unobserve(entry.target)
          }
        })
      },
      {
        rootMargin: '50px' // Start loading 50px before entering viewport
      }
    )

    if (imageRef.current) {
      observer.observe(imageRef.current)
    }

    return () => observer.disconnect()
  }, [enableLazyLoading, priority, product.name])

  const handleLoad = () => {
    setIsLoading(false)
    onLoad?.()
    debugLog(`Image loaded: ${product.name} (${variant})`)
  }

  const handleError = () => {
    setIsLoading(false)
    setHasError(true)
    onError?.()
    debugLog(`Image error: ${product.name} (${variant})`)
  }

  const handleMouseEnter = () => {
    if (enableHover && productImages.length > 1) {
      // Clear any existing timeout
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current)
      }
      
      // Start hover effect after a short delay
      hoverTimeoutRef.current = setTimeout(() => {
        setIsHovered(true)
      }, 200)
    }
  }

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
    }
    setIsHovered(false)
  }

  // Cleanup timeout
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current)
      }
    }
  }, [])

  if (hasError) {
    return (
      <div 
        ref={imageRef}
        className={cn(
          'bg-gray-100 flex items-center justify-center',
          'border border-gray-200 rounded-lg',
          className
        )}
        style={fill ? {} : { width: imgWidth, height: imgHeight }}
      >
        <div className="text-center text-gray-400">
          <div className="text-2xl mb-1">📷</div>
          <div className="text-xs">No image</div>
        </div>
      </div>
    )
  }

  return (
    <div 
      ref={imageRef}
      className={cn(
        'relative overflow-hidden',
        'transition-transform duration-300',
        enableHover && productImages.length > 1 && 'hover:scale-105',
        onClick && 'cursor-pointer',
        className
      )}
      style={fill ? {} : { width: imgWidth, height: imgHeight }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      {/* Loading spinner */}
      {isLoading && showLoadingSpinner && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
          <div className="w-8 h-8 border-2 border-gray-200 border-t-primary-500 rounded-full animate-spin" />
        </div>
      )}

      {/* Main Image */}
      <Image
        src={currentImageVariants[variant] || currentImageVariants.original}
        alt={`${product.name} - GENOSYS Korean dermacosmetics product image`}
        {...(fill 
          ? { fill: true } 
          : { width: imgWidth, height: imgHeight }
        )}
        className={cn(
          'object-cover transition-opacity duration-300',
          isLoading && 'opacity-0',
          !isLoading && 'opacity-100'
        )}
        priority={priority}
        quality={quality}
        sizes={responsiveSizes}
        placeholder="blur"
        blurDataURL={blurPlaceholder}
        onLoad={handleLoad}
        onError={handleError}
        loading={priority ? 'eager' : 'lazy'}
      />

      {/* Multiple images indicator */}
      {enableHover && productImages.length > 1 && (
        <div className="absolute bottom-2 right-2 flex gap-1">
          {productImages.map((_, index) => (
            <div
              key={index}
              className={cn(
                'w-1.5 h-1.5 rounded-full transition-colors duration-200',
                index === currentImageIndex 
                  ? 'bg-white shadow-md' 
                  : 'bg-white/50'
              )}
            />
          ))}
        </div>
      )}

      {/* Hover overlay for interactivity */}
      {enableHover && onClick && (
        <div className={cn(
          'absolute inset-0 bg-black/0 transition-colors duration-300',
          'hover:bg-black/10'
        )} />
      )}
    </div>
  )
}