'use client'

import { Product } from '@/types'
import { Truck, Shield, Star } from 'lucide-react'

interface ProductDetailsProps {
  product: Product
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  return (
    <div className="space-y-6">
      {/* Product Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          {product.name}
        </h1>
        
        {/* Rating */}
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
          <span className="text-sm text-gray-600">(4.8/5)</span>
        </div>
      </div>

      {/* Size Display (if applicable) */}
      {product.size && (
        <div className="text-sm font-medium text-gray-700">
          Size: {product.size}
        </div>
      )}

      {/* Category Badge */}
      <div className="flex items-center gap-2">
        <span className="inline-block bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-xs font-medium">
          {product.category.replace(/,/g, ', ')}
        </span>
        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
          product.inStock 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {product.inStock ? 'In Stock' : 'Out of Stock'}
        </span>
      </div>
    </div>
  )
}



