import '@/components/product/cerabarrier/cerabarrier.css'
import '@/components/editorial/editorial.css'
/**
 * Cart Page Loading State
 * 
 * Renders skeleton UI while cart data is being loaded.
 */
export default function CartLoading() {
  return (
    <div className="cera-page genosys-page min-h-screen bg-[var(--cera-cream-deep)] py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="h-8 bg-[var(--cera-cream-deep)] rounded w-40 mb-8 animate-pulse" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart items */}
          <div className="lg:col-span-2 space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div 
                key={i} 
                className="bg-white rounded-xl p-4 flex gap-4"
              >
                {/* Image */}
                <div className="w-24 h-24 bg-[var(--cera-cream-deep)] rounded-lg animate-pulse flex-shrink-0" />
                
                {/* Content */}
                <div className="flex-1 space-y-2">
                  <div className="h-5 bg-[var(--cera-cream-deep)] rounded w-3/4 animate-pulse" />
                  <div className="h-4 bg-[var(--cera-cream-deep)] rounded w-1/2 animate-pulse" />
                  <div className="flex items-center justify-between mt-4">
                    <div className="h-8 w-24 bg-[var(--cera-cream-deep)] rounded animate-pulse" />
                    <div className="h-6 w-20 bg-[var(--cera-cream-deep)] rounded animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 space-y-4">
              <div className="h-6 bg-[var(--cera-cream-deep)] rounded w-1/2 animate-pulse" />
              <div className="space-y-3">
                <div className="flex justify-between">
                  <div className="h-4 bg-[var(--cera-cream-deep)] rounded w-20 animate-pulse" />
                  <div className="h-4 bg-[var(--cera-cream-deep)] rounded w-16 animate-pulse" />
                </div>
                <div className="flex justify-between">
                  <div className="h-4 bg-[var(--cera-cream-deep)] rounded w-24 animate-pulse" />
                  <div className="h-4 bg-[var(--cera-cream-deep)] rounded w-16 animate-pulse" />
                </div>
                <div className="border-t pt-3 flex justify-between">
                  <div className="h-5 bg-[var(--cera-cream-deep)] rounded w-16 animate-pulse" />
                  <div className="h-5 bg-[var(--cera-cream-deep)] rounded w-20 animate-pulse" />
                </div>
              </div>
              <div className="h-12 bg-[var(--cera-blush-deep)] rounded-lg animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
