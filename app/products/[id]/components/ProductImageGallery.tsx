'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { Product } from '@/types'
import { useProductImages } from '@/hooks/useProductImages'
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react'

interface ProductImageGalleryProps {
  product: Product
  selectedImage: number
  onImageSelect: (index: number) => void
}

export default function ProductImageGallery({ 
  product, 
  selectedImage, 
  onImageSelect 
}: ProductImageGalleryProps) {
  const { productImages, hasVideo, videoUrl } = useProductImages(product)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  // Open lightbox
  const openLightbox = (index: number) => {
    setLightboxIndex(index)
    setLightboxOpen(true)
    document.body.style.overflow = 'hidden'
  }

  // Close lightbox
  const closeLightbox = () => {
    setLightboxOpen(false)
    document.body.style.overflow = ''
  }

  // Navigate lightbox
  const goToPrevious = useCallback(() => {
    setLightboxIndex((prev) => (prev === 0 ? productImages.length - 1 : prev - 1))
  }, [productImages.length])

  const goToNext = useCallback(() => {
    setLightboxIndex((prev) => (prev === productImages.length - 1 ? 0 : prev + 1))
  }, [productImages.length])

  // Keyboard navigation
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

  return (
    <>
      <div className="space-y-4">
        {/* Main Image - Clickable */}
        <div 
          className="w-full max-w-md mx-auto aspect-square bg-gray-100 rounded-lg overflow-hidden relative cursor-zoom-in group"
          onClick={() => !(hasVideo && selectedImage === 2) && openLightbox(selectedImage)}
        >
          {hasVideo && selectedImage === 2 ? (
            <iframe
              className="w-full h-full rounded-lg"
              src={videoUrl}
              title={`${product.name} Video`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : (
            <>
              <Image
                src={(() => {
                  const imageSrc = productImages[selectedImage] || product.image
                  const separator = imageSrc.includes('?') ? '&' : '?'
                  return `${imageSrc}${separator}v=${product.id}`
                })()}
                alt={`${product.name} - GENOSYS professional Korean dermacosmetics ${product.category || 'skincare'} product`}
                width={600}
                height={600}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                priority
                quality={90}
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
              />
              {/* Zoom indicator */}
              <div className="absolute bottom-3 right-3 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <ZoomIn className="w-5 h-5" />
              </div>
            </>
          )}
        </div>

        {/* Thumbnail Images */}
        {productImages.length > 1 && (
          <div className="flex gap-2 justify-center">
            {productImages.map((image, index) => (
              <button
                key={index}
                onClick={() => onImageSelect(index)}
                className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                  selectedImage === index
                    ? 'border-primary-600'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Image
                  src={image}
                  alt={`${product.name} - GENOSYS product thumbnail view ${index + 1}`}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                  quality={75}
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                />
              </button>
            ))}
          </div>
        )}
      </div>

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
              src={productImages[lightboxIndex] || product.image}
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
              {productImages.map((image, index) => (
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
                    src={image}
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
    </>
  )
}
