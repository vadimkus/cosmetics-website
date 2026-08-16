import '@/components/product/cerabarrier/cerabarrier.css'
import './blog.css'

/**
 * Streamed while the post list is fetched.
 *
 * The shapes here mirror BlogPageClient exactly: hero, rule, the wide latest
 * article, then the three-up grid. A skeleton that does not match the page it
 * precedes reads as a layout shift rather than as loading.
 */
export default function BlogLoading() {
  return (
    <div className="cera-page blog-page min-h-[100dvh]">
      <div className="mx-auto max-w-[1120px] px-4 py-8 md:px-8 md:py-16">
        <div className="blog-skeleton blog-skeleton--line blog-skeleton--line h-3 w-40" />

        <div className="mt-10 md:mt-16">
          <div className="blog-skeleton blog-skeleton--line h-3 w-24" />
          <div className="blog-skeleton mt-5 h-11 w-[min(100%,560px)] md:h-16" />
          <div className="blog-skeleton blog-skeleton--line mt-5 h-4 w-[min(100%,620px)]" />
          <div className="blog-skeleton blog-skeleton--line mt-2.5 h-4 w-[min(100%,480px)]" />
        </div>

        <div className="cera-rule mt-10 md:mt-14" />

        <div className="mt-10 grid gap-7 md:mt-14 lg:grid-cols-12 lg:gap-12">
          <div className="blog-skeleton aspect-square lg:col-span-6" />
          <div className="flex flex-col justify-center lg:col-span-6">
            <div className="blog-skeleton blog-skeleton--line h-3 w-28" />
            <div className="blog-skeleton mt-4 h-8 w-full" />
            <div className="blog-skeleton mt-2.5 h-8 w-3/4" />
            <div className="blog-skeleton blog-skeleton--line mt-5 h-3.5 w-full" />
            <div className="blog-skeleton blog-skeleton--line mt-2 h-3.5 w-5/6" />
          </div>
        </div>

        <div className="mt-14 flex items-center gap-5 md:mt-20">
          <div className="blog-skeleton blog-skeleton--line h-3 w-32" />
          <div className="cera-rule flex-1" />
        </div>

        <div className="mt-9 grid gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i}>
              <div className="blog-skeleton aspect-square w-full" />
              <div className="blog-skeleton blog-skeleton--line mt-5 h-3 w-24" />
              <div className="blog-skeleton mt-3 h-5 w-full" />
              <div className="blog-skeleton mt-2 h-5 w-2/3" />
              <div className="blog-skeleton blog-skeleton--line mt-3.5 h-3.5 w-full" />
              <div className="blog-skeleton blog-skeleton--line mt-2 h-3.5 w-4/5" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
