'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Product } from '@/types'
import { getProductVideoUrl } from '@/data/productConfig'

interface ProductImageGalleryProps {
  product: Product
}

export default function ProductImageGallery({ product }: ProductImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const videoUrl = getProductVideoUrl(product.id)

  const getProductImages = () => {
    if (product.images) {
      try {
        const parsedImages = JSON.parse(product.images)
        return Array.isArray(parsedImages) ? parsedImages : [product.image]
      } catch {
        return [product.image]
      }
    }
    return [product.image]
  }

  const productImages = getProductImages()

  return (
    <div className="space-y-4">
      {/* Main Image or Video */}
      <div className="w-full max-w-md mx-auto aspect-square bg-gray-100 rounded-lg overflow-hidden">
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
          <Image
            src={productImages[selectedImage]}
            alt={`${product.name} - Image ${selectedImage + 1}`}
            width={600}
            height={600}
            className="w-full h-full object-cover"
            priority={selectedImage === 0}
          />
        )}
      </div>

      {/* Thumbnail Navigation */}
      {productImages.length > 1 && (
        <div className="flex gap-2 justify-center">
          {productImages.map((img, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                selectedImage === index
                  ? 'border-primary-600'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Image
                src={img}
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
