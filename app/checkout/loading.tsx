/**
 * Checkout Page Loading State
 */
export default function CheckoutLoading() {
  return (
    <div className="bg-white min-h-screen">
      <div className="container mx-auto px-4 py-4 md:py-8 max-w-3xl">
        {/* Header skeleton */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
          <div className="h-7 w-40 bg-gray-200 rounded animate-pulse" />
        </div>

        {/* Delivery address section */}
        <div className="border rounded-xl p-4 mb-4 space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-gray-200 rounded animate-pulse" />
            <div className="h-5 w-36 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="h-10 w-full bg-gray-100 rounded-lg animate-pulse" />
          <div className="h-10 w-full bg-gray-100 rounded-lg animate-pulse" />
          <div className="h-10 w-full bg-gray-100 rounded-lg animate-pulse" />
        </div>

        {/* Payment method section */}
        <div className="border rounded-xl p-4 mb-4 space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-gray-200 rounded animate-pulse" />
            <div className="h-5 w-36 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="flex gap-3">
            <div className="h-14 flex-1 bg-gray-100 rounded-lg animate-pulse" />
            <div className="h-14 flex-1 bg-gray-100 rounded-lg animate-pulse" />
          </div>
        </div>

        {/* Order summary section */}
        <div className="border rounded-xl p-4 space-y-3">
          <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-16 h-16 bg-gray-100 rounded-lg animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-3/4 bg-gray-100 rounded animate-pulse" />
                <div className="h-3 w-1/3 bg-gray-100 rounded animate-pulse" />
              </div>
              <div className="h-4 w-16 bg-gray-100 rounded animate-pulse" />
            </div>
          ))}
          <div className="border-t pt-3 space-y-2">
            <div className="flex justify-between">
              <div className="h-4 w-20 bg-gray-100 rounded animate-pulse" />
              <div className="h-4 w-20 bg-gray-100 rounded animate-pulse" />
            </div>
            <div className="flex justify-between">
              <div className="h-5 w-16 bg-gray-200 rounded animate-pulse" />
              <div className="h-5 w-24 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        </div>

        {/* Place order button skeleton */}
        <div className="mt-6">
          <div className="h-14 w-full bg-gray-200 rounded-xl animate-pulse" />
        </div>
      </div>
    </div>
  )
}
