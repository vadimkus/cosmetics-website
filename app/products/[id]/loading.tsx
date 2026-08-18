import '@/components/product/cerabarrier/cerabarrier.css'
import '@/components/editorial/editorial.css'
/**
 * Product Detail Page Loading State
 * 
 * Renders a skeleton UI matching the product page layout
 * while the product data is being fetched from the database.
 */
export default function ProductDetailLoading() {
  return (
    <div className="cera-page genosys-page min-h-screen">
      <div className="container mx-auto px-4 py-4 md:py-8">
        {/* Back button skeleton */}
        <div className="mb-4">
          <div className="h-5 w-24 bg-[var(--cera-cream-deep)] rounded animate-pulse" />
        </div>

        {/* Main product layout */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
          {/* Image gallery skeleton */}
          <div className="w-full lg:w-1/2">
            {/* Main image */}
            <div className="aspect-square bg-[var(--cera-cream-deep)] rounded-xl animate-pulse" />
            {/* Thumbnail strip */}
            <div className="flex gap-2 mt-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="w-16 h-16 bg-[var(--cera-cream-deep)] rounded-lg animate-pulse" />
              ))}
            </div>
          </div>

          {/* Product info skeleton */}
          <div className="w-full lg:w-1/2 space-y-4">
            {/* Category */}
            <div className="h-4 w-20 bg-[var(--cera-cream-deep)] rounded animate-pulse" />
            {/* Product name */}
            <div className="h-7 w-3/4 bg-[var(--cera-cream-deep)] rounded animate-pulse" />
            {/* Price */}
            <div className="h-8 w-32 bg-[var(--cera-cream-deep)] rounded animate-pulse" />
            {/* Rating */}
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="w-5 h-5 bg-[var(--cera-cream-deep)] rounded animate-pulse" />
              ))}
            </div>
            {/* Size selector */}
            <div className="space-y-2 pt-2">
              <div className="h-4 w-12 bg-[var(--cera-cream-deep)] rounded animate-pulse" />
              <div className="flex gap-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-10 w-20 bg-[var(--cera-cream-deep)] rounded-lg animate-pulse" />
                ))}
              </div>
            </div>
            {/* Quantity + Add to cart */}
            <div className="flex gap-3 pt-2">
              <div className="h-12 w-28 bg-[var(--cera-cream-deep)] rounded-lg animate-pulse" />
              <div className="h-12 flex-1 bg-[var(--cera-cream-deep)] rounded-lg animate-pulse" />
            </div>
            {/* Trust badges */}
            <div className="flex gap-4 pt-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-[var(--cera-cream-deep)] rounded-full animate-pulse" />
                  <div className="h-3 w-16 bg-[var(--cera-cream-deep)] rounded animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Product description / tabs skeleton */}
        <div className="mt-8 lg:mt-12 space-y-4">
          <div className="flex gap-4 border-b pb-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-8 w-24 bg-[var(--cera-cream-deep)] rounded animate-pulse" />
            ))}
          </div>
          <div className="space-y-3 pt-2">
            <div className="h-4 w-full bg-[var(--cera-cream-deep)] rounded animate-pulse" />
            <div className="h-4 w-5/6 bg-[var(--cera-cream-deep)] rounded animate-pulse" />
            <div className="h-4 w-4/6 bg-[var(--cera-cream-deep)] rounded animate-pulse" />
            <div className="h-4 w-full bg-[var(--cera-cream-deep)] rounded animate-pulse" />
            <div className="h-4 w-3/4 bg-[var(--cera-cream-deep)] rounded animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  )
}
