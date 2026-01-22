import { ProductCardSkeletonGrid } from '@/components/ProductCardSkeleton'

/**
 * Products Page Loading State
 * 
 * Renders skeleton UI while products are being fetched.
 * Uses Suspense boundary for streaming.
 */
export default function ProductsLoading() {
  return (
    <div className="bg-white min-h-screen">
      <div className="container mx-auto px-4 py-4 md:py-8 lg:py-16">
        {/* Header skeleton */}
        <div className="text-center mb-4 md:mb-8">
          <div className="hidden md:flex justify-center mb-3">
            <div className="w-[200px] h-[80px] bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="hidden md:block h-6 bg-gray-200 rounded max-w-2xl mx-auto animate-pulse" />
        </div>

        {/* Search skeleton */}
        <div className="mb-6">
          <div className="h-12 bg-gray-100 rounded-lg animate-pulse" />
        </div>

        {/* Mobile categories skeleton */}
        <div className="md:hidden mb-4">
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <div 
                key={i} 
                className="h-10 w-20 bg-gray-200 rounded-full animate-pulse"
              />
            ))}
          </div>
        </div>

        {/* Products grid */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar skeleton - desktop only */}
          <div className="hidden md:block w-64 flex-shrink-0">
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded animate-pulse" />
              <div className="space-y-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-6 bg-gray-100 rounded animate-pulse" />
                ))}
              </div>
            </div>
          </div>

          {/* Products */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
              <div className="hidden md:block h-10 w-40 bg-gray-200 rounded animate-pulse" />
            </div>
            <ProductCardSkeletonGrid count={12} />
          </div>
        </div>
      </div>
    </div>
  )
}
