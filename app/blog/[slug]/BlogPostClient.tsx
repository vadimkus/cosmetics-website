'use client'

import { useIsMobileWeb } from '@/hooks/useIsMobile'
import BlogArticleBar from '@/components/blog/BlogArticleBar'
import { ceraSerif } from '@/components/product/cerabarrier/ceraFont'
import '@/components/product/cerabarrier/cerabarrier.css'
import '@/components/editorial/editorial.css'

interface BlogPostClientProps {
  children: React.ReactNode
}

/**
 * The English article route's body wrapper. The bar itself now lives in
 * `BlogArticleBar`, so `/ar` and `/ru` can use the same one.
 */
export default function BlogPostClient({ children }: BlogPostClientProps) {
  const { isMobile, isClient } = useIsMobileWeb()

  if (!(isClient && isMobile)) {
    return <>{children}</>
  }

  return (
    <div className={`cera-page genosys-page ${ceraSerif.variable} min-h-screen`}>
      <BlogArticleBar />
      {children}
    </div>
  )
}
