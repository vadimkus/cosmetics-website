/**
 * Blog Page Loading State
 * 
 * Renders skeleton UI while blog posts are being fetched.
 * Uses Suspense boundary for streaming.
 */
export default function BlogLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 md:py-16">
      <div className="container mx-auto px-4">
        {/* Header skeleton */}
        <div className="text-center mb-8 md:mb-12">
          <div className="h-10 bg-gray-200 rounded max-w-md mx-auto mb-4 animate-pulse" />
          <div className="h-6 bg-gray-200 rounded max-w-lg mx-auto animate-pulse" />
        </div>

        {/* Blog posts grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <article 
              key={i} 
              className="bg-white rounded-2xl shadow-sm overflow-hidden"
            >
              {/* Image skeleton */}
              <div className="aspect-[16/9] bg-gray-200 animate-pulse" />
              
              {/* Content skeleton */}
              <div className="p-6">
                {/* Category badge */}
                <div className="h-5 w-20 bg-gray-200 rounded-full mb-3 animate-pulse" />
                
                {/* Title */}
                <div className="h-6 bg-gray-200 rounded mb-2 animate-pulse" />
                <div className="h-6 bg-gray-200 rounded w-2/3 mb-4 animate-pulse" />
                
                {/* Excerpt */}
                <div className="space-y-2 mb-4">
                  <div className="h-4 bg-gray-100 rounded animate-pulse" />
                  <div className="h-4 bg-gray-100 rounded animate-pulse" />
                  <div className="h-4 bg-gray-100 rounded w-3/4 animate-pulse" />
                </div>
                
                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}
