import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { errorLog } from '@/lib/logger'
import { buildUrl, SITE_NAME } from '@/lib/siteConfig'
import { escapeXml, formatAtomDate, stripHtml, truncateText } from '@/lib/seo'

export const revalidate = 3600

type AtomPost = {
  title: string
  slug: string
  excerpt: string | null
  content: string
  authorName: string | null
  publishedAt: Date | null
  updatedAt: Date
}

async function getPosts(): Promise<AtomPost[]> {
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
          authorName: true
          publishedAt: true
          updatedAt: true
        }
      }) => Promise<AtomPost[]>
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
      authorName: true,
      publishedAt: true,
      updatedAt: true,
    },
  }) || []
}

export async function GET() {
  try {
    const posts = await getPosts()
    const updated = posts[0]?.updatedAt || new Date()
    const entries = posts.map(post => {
      const url = buildUrl(`/blog/${post.slug}`)
      const summary = truncateText(stripHtml(post.excerpt || post.content), 500)

      return `  <entry>
    <title>${escapeXml(post.title)}</title>
    <link href="${escapeXml(url)}" />
    <id>${escapeXml(url)}</id>
    <updated>${formatAtomDate(post.updatedAt)}</updated>
    <published>${formatAtomDate(post.publishedAt || post.updatedAt)}</published>
    <author><name>${escapeXml(post.authorName || 'GENOSYS Team')}</name></author>
    <summary>${escapeXml(summary)}</summary>
  </entry>`
    })

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${SITE_NAME} Blog</title>
  <subtitle>GENOSYS Korean skincare, dermacosmetics, microneedling, and professional beauty insights for the UAE.</subtitle>
  <link href="${buildUrl('/feed/blog.atom')}" rel="self" />
  <link href="${buildUrl('/blog')}" />
  <id>${buildUrl('/blog')}</id>
  <updated>${formatAtomDate(updated)}</updated>
${entries.join('\n')}
</feed>`

    return new NextResponse(xml, {
      status: 200,
      headers: {
        'Content-Type': 'application/atom+xml; charset=utf-8',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    })
  } catch (error) {
    errorLog('Error generating blog Atom feed:', error)
    return new NextResponse('Error generating blog Atom feed', { status: 500 })
  }
}
