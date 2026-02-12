/**
 * Orders Page Loading State
 */
export default function OrdersLoading() {
  return (
    <div className="bg-white min-h-screen">
      <div className="container mx-auto px-4 py-4 md:py-8 max-w-4xl">
        {/* Header skeleton */}
        <div className="mb-6">
          <div className="h-7 w-32 bg-gray-200 rounded animate-pulse" />
        </div>

        {/* Order cards */}
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="border rounded-xl p-4 space-y-3">
              {/* Order header */}
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <div className="h-5 w-40 bg-gray-200 rounded animate-pulse" />
                  <div className="h-3 w-28 bg-gray-100 rounded animate-pulse" />
                </div>
                <div className="h-6 w-20 bg-gray-200 rounded-full animate-pulse" />
              </div>
              {/* Order items */}
              <div className="flex gap-3">
                {Array.from({ length: 2 }).map((_, j) => (
                  <div key={j} className="w-14 h-14 bg-gray-100 rounded-lg animate-pulse" />
                ))}
              </div>
              {/* Order total */}
              <div className="flex justify-between items-center border-t pt-3">
                <div className="h-4 w-20 bg-gray-100 rounded animate-pulse" />
                <div className="h-5 w-24 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
