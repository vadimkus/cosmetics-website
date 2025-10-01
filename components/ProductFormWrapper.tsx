'use client'

import dynamic from 'next/dynamic'
import { Suspense } from 'react'

interface Product {
  id: string
  name: string
  price: number
  description: string
  image: string
  images: string | null // JSON array of all images
  category: string
  inStock: boolean
  size?: string | null
  createdAt: string
  updatedAt: string
}

const ProductForm = dynamic(() => import('./ProductForm'), {
  loading: () => (
    <div className="flex items-center justify-center p-8">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-2"></div>
        <p className="text-gray-600 text-sm">Loading form...</p>
      </div>
    </div>
  ),
  ssr: false
})

interface ProductFormWrapperProps {
  product?: Product | null
  onSave: (productData: Partial<Product>) => Promise<boolean>
  onCancel: () => void
}

export default function ProductFormWrapper({ product, onSave, onCancel }: ProductFormWrapperProps) {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-2"></div>
          <p className="text-gray-600 text-sm">Loading form...</p>
        </div>
      </div>
    }>
      <ProductForm product={product || null} onSave={onSave} onCancel={onCancel} />
    </Suspense>
  )
}
