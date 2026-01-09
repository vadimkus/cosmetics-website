'use client'

import { useState, useMemo, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react'
import { Product } from '@/types'
import { getProductVideoUrl } from '@/data/productConfig'
import { useTranslation } from '@/hooks/useTranslation'

interface ProductImageGalleryProps {
  product: Product
}

export default function ProductImageGallery({ product }: ProductImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [imageError, setImageError] = useState(false)
  const [thumbnailErrors, setThumbnailErrors] = useState<Record<number, boolean>>({})
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const videoUrl = getProductVideoUrl(product.id)
  const { t, dir } = useTranslation()
  
  // Check if this is the Holiday Kit
  const isHolidayKit = product.id === 'cmhf1a6p400000xfa0iu3bw42' || product.productNumber === '54' || product.category === 'kits'
  
  // Generate fixed positions for stars and sparkles
  const holidayElements = useMemo(() => {
    if (!isHolidayKit) return { stars: [], sparkles: [] }
    
    const stars = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: i * 0.3,
      duration: 3 + Math.random() * 2,
    }))
    
    const sparkles = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: i * 0.4,
      duration: 2 + Math.random() * 1.5,
    }))
    
    return { stars, sparkles }
  }, [isHolidayKit])

  const getProductImages = () => {
    if (product.images) {
      try {
        const parsedImages = JSON.parse(product.images)
        return Array.isArray(parsedImages) ? parsedImages : [product.image]
      } catch (error) {
        return [product.image]
      }
    }
    return [product.image]
  }

  const productImages = getProductImages()

  // Lightbox functions
  const openLightbox = (index: number) => {
    setLightboxIndex(index)
    setLightboxOpen(true)
    document.body.style.overflow = 'hidden'
  }

  const closeLightbox = () => {
    setLightboxOpen(false)
    document.body.style.overflow = ''
  }

  const goToPrevious = useCallback(() => {
    setLightboxIndex((prev) => (prev === 0 ? productImages.length - 1 : prev - 1))
  }, [productImages.length])

  const goToNext = useCallback(() => {
    setLightboxIndex((prev) => (prev === productImages.length - 1 ? 0 : prev + 1))
  }, [productImages.length])

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!lightboxOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowLeft') goToPrevious()
      if (e.key === 'ArrowRight') goToNext()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [lightboxOpen, goToPrevious, goToNext])

  // Reset error state when selected image changes
  useEffect(() => {
    setImageError(false)
  }, [selectedImage])

  return (
    <div className="space-y-2 md:space-y-4">
      {/* Main Image or Video */}
      <div 
        className="w-full max-w-xs md:max-w-md mx-auto aspect-square bg-gray-100 rounded-lg overflow-hidden relative cursor-zoom-in group"
        onClick={() => !(product.id === '3' && selectedImage === 2 && videoUrl) && openLightbox(selectedImage)}
      >
        {/* Stock Badge */}
        <div className={`absolute top-2 md:top-3 ${dir === 'rtl' ? 'left-2 md:left-3' : 'right-2 md:right-3'} z-30`}>
          {product.inStock ? (
            <span className={`inline-flex items-center px-2 py-1 md:px-3 md:py-1.5 rounded-full bg-green-500 text-white font-medium text-xs md:text-sm shadow-lg ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
              <span className={`w-1.5 h-1.5 bg-white rounded-full animate-pulse ${dir === 'rtl' ? 'ml-1.5' : 'mr-1.5'}`}></span>
              {t('product.inStock')}
            </span>
          ) : (
            <span className="inline-flex items-center px-3 py-1.5 md:px-4 md:py-2 rounded-lg bg-red-600 text-white font-bold text-sm md:text-base shadow-xl uppercase tracking-wide">
              {t('product.soldOut')}
            </span>
          )}
        </div>
        
        {product.id === '3' && selectedImage === 2 && videoUrl ? (
          <iframe
            className="w-full h-full rounded-lg"
            src={videoUrl}
            title={`${product.name} Video`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        ) : (
          <>
            {imageError ? (
              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                <div className="text-center text-gray-500">
                  <div className="text-4xl mb-2">📷</div>
                  <div className="text-sm">Image not available</div>
                </div>
              </div>
            ) : (
              <>
                <Image
                  src={(() => {
                    const imageSrc = productImages[selectedImage] || product.image
                    if (!imageSrc) return '/images/placeholder.png'
                    // For product 57 (Charming Look), add timestamp-based cache busting
                    // This ensures the new image loads on mobile devices
                    const separator = imageSrc.includes('?') ? '&' : '?'
                    let version = `${product.id}-${imageSrc.split('/').pop()?.replace(/[^a-zA-Z0-9]/g, '') || 'img'}`
                    // Special handling for product 57 to force image refresh
                    if (product.id === 'cmhoyw7d500008o9tdprqkkhb' || product.productNumber === '57') {
                      // Use a fixed version number that changes when image is updated
                      // Update this number when the image file changes
                      version = `v20251108-${version}`
                    }
                    return `${imageSrc}${separator}v=${version}`
                  })()}
                  alt={`${product.name} - GENOSYS Korean dermacosmetics product image ${selectedImage + 1} of ${productImages.length}`}
                  width={600}
                  height={600}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  priority={selectedImage === 0}
                  quality={90}
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                  onError={() => {
                    setImageError(true)
                  }}
                  onLoad={() => {
                    setImageError(false)
                  }}
                />
                {/* Zoom indicator */}
                <div className="absolute bottom-12 md:bottom-14 right-2 md:right-3 bg-black/50 text-white p-1.5 md:p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-20">
                  <ZoomIn className="w-4 h-4 md:w-5 md:h-5" />
                </div>
              </>
            )}
            
            {/* Holiday Star Animation Overlay */}
            {isHolidayKit && (
              <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-lg">
                {holidayElements.stars.map((star) => (
                  <div
                    key={star.id}
                    className="absolute animate-twinkle"
                    style={{
                      left: `${star.left}%`,
                      top: `${star.top}%`,
                      animationDelay: `${star.delay}s`,
                      animationDuration: `${star.duration}s`,
                    }}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      className="text-yellow-400 drop-shadow-lg"
                    >
                      <path
                        d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                        fill="currentColor"
                        stroke="currentColor"
                        strokeWidth="1"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                ))}
                
                {/* Sparkle effects */}
                {holidayElements.sparkles.map((sparkle) => (
                  <div
                    key={`sparkle-${sparkle.id}`}
                    className="absolute animate-sparkle"
                    style={{
                      left: `${sparkle.left}%`,
                      top: `${sparkle.top}%`,
                      animationDelay: `${sparkle.delay}s`,
                      animationDuration: `${sparkle.duration}s`,
                    }}
                  >
                    <div className="w-2 h-2 bg-yellow-300 rounded-full shadow-lg"></div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Thumbnail Navigation */}
      {productImages.length > 1 && (
        <div className="flex gap-1.5 md:gap-2 justify-center">
          {productImages.map((img, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`w-12 h-12 md:w-16 md:h-16 rounded-md md:rounded-lg overflow-hidden border-2 transition-colors ${
                selectedImage === index
                  ? 'border-primary-600'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {thumbnailErrors[index] ? (
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  <span className="text-xs text-gray-400">📷</span>
                </div>
              ) : (
                <Image
                  src={(() => {
                    const imageSrc = img || product.image
                    if (!imageSrc) return '/images/placeholder.png'
                    const separator = imageSrc.includes('?') ? '&' : '?'
                    const version = `${product.id}-${imageSrc.split('/').pop()?.replace(/[^a-zA-Z0-9]/g, '') || 'img'}`
                    return `${imageSrc}${separator}v=${version}`
                  })()}
                  alt={`${product.name} - GENOSYS product thumbnail ${index + 1} of ${productImages.length}`}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                  quality={75}
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                  onError={() => {
                    setThumbnailErrors(prev => ({ ...prev, [index]: true }))
                  }}
                />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div 
          className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center"
          onClick={closeLightbox}
        >
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-10 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
            aria-label="Close lightbox"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          {/* Image Counter */}
          <div className="absolute top-4 left-4 text-white/80 text-sm font-medium">
            {lightboxIndex + 1} / {productImages.length}
          </div>

          {/* Navigation Arrows */}
          {productImages.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
                className="absolute left-2 md:left-4 z-10 p-2 md:p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6 md:w-8 md:h-8 text-white" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); goToNext(); }}
                className="absolute right-2 md:right-4 z-10 p-2 md:p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                aria-label="Next image"
              >
                <ChevronRight className="w-6 h-6 md:w-8 md:h-8 text-white" />
              </button>
            </>
          )}

          {/* Lightbox Image */}
          <div 
            className="relative w-full h-full max-w-4xl max-h-[85vh] mx-4 flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={(() => {
                const imageSrc = productImages[lightboxIndex] || product.image
                if (!imageSrc) return '/images/placeholder.png'
                return imageSrc
              })()}
              alt={`${product.name} - Full size view ${lightboxIndex + 1}`}
              width={1200}
              height={1200}
              className="max-w-full max-h-full object-contain"
              quality={95}
              priority
            />
          </div>

          {/* Thumbnail Strip */}
          {productImages.length > 1 && (
            <div 
              className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 p-2 bg-black/50 rounded-lg"
              onClick={(e) => e.stopPropagation()}
            >
              {productImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setLightboxIndex(index)}
                  className={`w-12 h-12 md:w-16 md:h-16 rounded overflow-hidden border-2 transition-all ${
                    lightboxIndex === index
                      ? 'border-white scale-110'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <Image
                    src={img || product.image}
                    alt={`Thumbnail ${index + 1}`}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
