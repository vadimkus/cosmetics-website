import { prisma } from '@/lib/prisma'
import { errorLog } from '@/lib/logger'
import { renderTitleOgImage, renderFallbackOgImage, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/ogImages'

export const alt = 'GENOSYS Blog'
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

// ISR: CDN-cache the rendered card (see /products/[id]/opengraph-image.tsx)
export const revalidate = 3600

// Only used for posts WITHOUT a featured image — generateMetadata's explicit
// openGraph.images (the featured photo) overrides this file-based card.
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  try {
    type PrismaClientWithBlogPost = typeof prisma & {
      blogPost?: {
        findUnique: (args: {
          where: { slug: string; published: boolean }
          select: { title: true; excerpt: true }
        }) => Promise<{ title: string; excerpt: string | null } | null>
      }
    }
    const typedPrisma = prisma as PrismaClientWithBlogPost
    const post = await typedPrisma.blogPost?.findUnique({
      where: { slug, published: true },
      select: { title: true, excerpt: true },
    })

    if (!post) return renderFallbackOgImage(size)
    return renderTitleOgImage({
      title: post.title,
      subtitle: post.excerpt || undefined,
      size,
      locale: 'en',
    })
  } catch (error) {
    errorLog('Error rendering blog OG image:', error)
    return renderFallbackOgImage(size)
  }
}
