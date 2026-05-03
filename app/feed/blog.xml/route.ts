import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { errorLog } from '@/lib/logger'
import { buildUrl, SITE_NAME } from '@/lib/siteConfig'
import { escapeXml, formatFeedDate, stripHtml, truncateText } from '@/lib/seo'

export const revalidate = 3600

type FeedPost = {
  title: string
  slug: string
  excerpt: string | null
  content: string
  featuredImage: string | null
  authorName: string | null
  publishedAt: Date | null
  updatedAt: Date
}

async function getPosts(): Promise<FeedPost[]> {
  type PrismaWithBlogPost = typeof prisma & {
    blogPost?: {
      findMany: (args: {
        where: { published: boolean }
        orderBy: { publishedAt: 'desc' }
        take: number
        select: {
          title: true
          slug: true
          excerpt: true
          content: true
          featuredImage: true
          authorName: true
          publishedAt: true
          updatedAt: true
        }
      }) => Promise<FeedPost[]>
    }
  }

  const typedPrisma = prisma as PrismaWithBlogPost
  return typedPrisma.blogPost?.findMany({
    where: { published: true },
    orderBy: { publishedAt: 'desc' },
    take: 50,
    select: {
      title: true,
      slug: true,
      excerpt: true,
      content: true,
      featuredImage: true,
      authorName: true,
      publishedAt: true,
      updatedAt: true,
    },
  }) || []
}

export async function GET() {
  try {
    const posts = await getPosts()
    const items = posts.map(post => {
      const url = buildUrl(`/blog/${post.slug}`)
      const description = truncateText(stripHtml(post.excerpt || post.content), 500)
      const enclosure = post.featuredImage
        ? `\n      <media:content url="${escapeXml(buildUrl(post.featuredImage))}" medium="image" />`
        : ''

      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${escapeXml(url)}</link>
      <guid isPermaLink="true">${escapeXml(url)}</guid>
      <description>${escapeXml(description)}</description>
      <author>${escapeXml(post.authorName || 'GENOSYS Team')}</author>
      <pubDate>${formatFeedDate(post.publishedAt || post.updatedAt)}</pubDate>${enclosure}
    </item>`
    })

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>${SITE_NAME} Blog</title>
    <link>${buildUrl('/blog')}</link>
    <description>GENOSYS Korean skincare, dermacosmetics, microneedling, and professional beauty insights for the UAE.</description>
    <language>en-AE</language>
    <lastBuildDate>${formatFeedDate(new Date())}</lastBuildDate>
${items.join('\n')}
  </channel>
</rss>`

    return new NextResponse(xml, {
      status: 200,
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    })
  } catch (error) {
    errorLog('Error generating blog RSS feed:', error)
    return new NextResponse('Error generating blog RSS feed', { status: 500 })
  }
}
