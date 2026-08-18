import { ceraSerif } from '@/components/product/cerabarrier/ceraFont'
import '@/components/product/cerabarrier/cerabarrier.css'
import '@/components/editorial/editorial.css'
/**
 * Blog Post Loading State
 */
export default function BlogPostLoading() {
  return (
    <div className={`cera-page genosys-page ${ceraSerif.variable} min-h-screen`}>
      <div className="container mx-auto px-4 py-4 md:py-8 max-w-3xl">
        {/* Back link skeleton */}
        <div className="mb-6">
          <div className="h-4 w-20 bg-[var(--cera-cream-deep)] rounded animate-pulse" />
        </div>

        {/* Featured image skeleton */}
        <div className="w-full aspect-[16/9] bg-[var(--cera-cream-deep)] rounded-xl animate-pulse mb-6" />

        {/* Category + date */}
        <div className="flex items-center gap-3 mb-4">
          <div className="h-6 w-20 bg-[var(--cera-cream-deep)] rounded-full animate-pulse" />
          <div className="h-4 w-28 bg-[var(--cera-cream-deep)] rounded animate-pulse" />
        </div>

        {/* Title */}
        <div className="space-y-2 mb-6">
          <div className="h-8 w-full bg-[var(--cera-cream-deep)] rounded animate-pulse" />
          <div className="h-8 w-2/3 bg-[var(--cera-cream-deep)] rounded animate-pulse" />
        </div>

        {/* Content paragraphs */}
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 w-full bg-[var(--cera-cream-deep)] rounded animate-pulse" />
              <div className="h-4 w-full bg-[var(--cera-cream-deep)] rounded animate-pulse" />
              <div className="h-4 w-5/6 bg-[var(--cera-cream-deep)] rounded animate-pulse" />
              <div className="h-4 w-4/6 bg-[var(--cera-cream-deep)] rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
