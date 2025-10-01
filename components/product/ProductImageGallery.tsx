'use client'

import Image from 'next/image'
import { useState } from 'react'

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

      {/* Thumbnail Gallery */}
      {productImages.length > 1 && (
        <div className="grid grid-cols-4 gap-4">
          {productImages.map((image, index) => (
            <div
              key={index}
              className={`aspect-square rounded-lg overflow-hidden cursor-pointer border-2 ${
                index === selectedImage ? 'border-primary-600' : 'border-gray-200 hover:border-gray-300'
              } transition-colors`}
              onClick={() => setSelectedImage(index)}
            >
              <Image
                src={image}
                alt={`${productName} ${index + 1}`}
                width={100}
                height={100}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}