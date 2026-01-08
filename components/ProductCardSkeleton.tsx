'use client'

import { memo } from 'react'
import { cn } from '@/lib/utils'

interface ProductCardSkeletonProps {
  className?: string
}

/**
 * Skeleton loader that matches the exact structure of ProductCard
 * for seamless loading states with no layout shift
 */
const ProductCardSkeleton = memo(function ProductCardSkeleton({ className }: ProductCardSkeletonProps) {
  return (
    <div 
      className={cn(
        "bg-white rounded-lg shadow-md overflow-hidden flex flex-col animate-pulse",
        className
      )}
      aria-hidden="true"
      role="presentation"
    >
      {/* Image placeholder */}
      <div className="relative overflow-hidden">
        <div className="w-full h-24 sm:h-32 md:h-40 lg:h-48 bg-gray-200" />
        {/* Favorite button placeholder */}
        <div className="absolute top-2 right-2 w-10 h-10 bg-gray-300 rounded-full" />
      </div>
      
      {/* Content area */}
      <div className="p-3 md:p-4 flex flex-col flex-1">
        {/* Category */}
        <div className="mb-2">
          <div className="h-4 w-20 bg-gray-200 rounded" />
        </div>
        
        {/* Product name */}
        <div className="mb-2 space-y-1">
          <div className="h-5 w-full bg-gray-200 rounded" />
          <div className="h-5 w-3/4 bg-gray-200 rounded" />
        </div>
        
        {/* Size and stock badges */}
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <div className="h-6 w-16 bg-gray-200 rounded-md" />
          <div className="h-6 w-14 bg-gray-200 rounded-full" />
        </div>
        
        {/* Description lines */}
        <div className="space-y-1 mb-3 md:mb-4">
          <div className="h-3 w-full bg-gray-200 rounded" />
          <div className="h-3 w-5/6 bg-gray-200 rounded" />
          <div className="h-3 w-4/6 bg-gray-200 rounded hidden md:block" />
        </div>
        
        {/* Price section */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-2">
            <div className="space-y-1">
              <div className="h-5 w-24 bg-gray-200 rounded" />
              <div className="h-3 w-16 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
        
        {/* Button placeholder */}
        <div className="mt-auto">
          <div className="h-9 md:h-10 w-full bg-gray-300 rounded-lg" />
        </div>
      </div>
    </div>
  )
})

/**
 * Grid of skeleton cards for loading states
 */
export function ProductCardSkeletonGrid({ count = 8, className }: { count?: number; className?: string }) {
  return (
    <div className={cn(
      "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6",
      className
    )}>
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  )
}

export default ProductCardSkeleton
