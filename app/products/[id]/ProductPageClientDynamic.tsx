'use client'

import dynamic from 'next/dynamic'
import { Product } from '@/types'

interface ProductPageClientProps {
  product: Product
}

// Dynamically import the optimized component with loading fallback
const ProductPageClientOptimized = dynamic(
  () => import('./ProductPageClientOptimized'),
  {
    loading: () => (
      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="aspect-square bg-gray-200 rounded-lg"></div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              <div className="h-12 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    ),
    ssr: false // Disable SSR for this component to improve performance
  }
)

export default function ProductPageClientDynamic({ product }: ProductPageClientProps) {
  return <ProductPageClientOptimized product={product} />
}