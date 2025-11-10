'use client'

import Image from 'next/image'
import { Product } from '@/types'
import { useProductImages } from '@/hooks/useProductImages'

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

  return (
    <div className="space-y-4">
      <div className="w-full max-w-md mx-auto aspect-square bg-gray-100 rounded-lg overflow-hidden">
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
          <Image
            src={(() => {
              const imageSrc = productImages[selectedImage] || product.image
              // Add cache-busting query parameter based on product ID to ensure fresh image
              const separator = imageSrc.includes('?') ? '&' : '?'
              // Use product ID as version to ensure consistency across renders
              return `${imageSrc}${separator}v=${product.id}`
            })()}
            alt={product.name}
            width={600}
            height={600}
            className="w-full h-full object-cover"
            priority
          />
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
                alt={`${product.name} ${index + 1}`}
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
