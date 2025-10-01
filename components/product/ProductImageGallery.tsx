'use client'

import { useState } from 'react'
import Image from 'next/image'

interface ProductImageGalleryProps {
  productImages: string[]
  productName: string
}

export default function ProductImageGallery({ productImages, productName }: ProductImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Main Image */}
      <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
        {productImages.length > 0 && productImages[selectedImage] ? (
          <Image
            src={productImages[selectedImage]}
            alt={productName}
            width={600}
            height={600}
            className="w-full h-full object-cover"
            priority
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No image available
          </div>
        )}
      </div>

      {/* Thumbnail Images */}
      {productImages.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {productImages.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 transition-colors ${
                selectedImage === index ? 'border-primary-500' : 'border-transparent'
              }`}
            >
              <Image
                src={image}
                alt={`${productName} ${index + 1}`}
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
