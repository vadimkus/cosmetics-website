/**
 * Mobile Blog Post Detail API - GET /api/mobile/blog/[slug]
 * Returns full blog post content with comments for the native mobile app.
 * Also increments view count.
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sanitizeHtml } from '@/lib/sanitize'
import { errorLog } from '@/lib/logger'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    // Validate API key
    const apiKey = request.headers.get('x-api-key')
    if (apiKey !== process.env.MOBILE_APP_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const locale = request.headers.get('x-locale') || 'en'
    const { slug } = await params

    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 })
    }

    // Fetch post with approved comments
    const post = await prisma.blogPost.findUnique({
      where: {
        slug,
        published: true,
      },
      include: {
        comments: {
          where: { approved: true },
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            userName: true,
            content: true,
            createdAt: true,
          },
        },
      },
    })

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    // Increment view count (non-blocking)
    prisma.blogPost.update({
      where: { id: post.id },
      data: { views: { increment: 1 } },
    }).catch((err: Error) => {
      errorLog('Failed to increment blog view count:', err)
    })

    // Select localized content
    let title = post.title
    let excerpt = post.excerpt || ''
    let content = post.content

    if (locale === 'ar') {
      title = post.titleAr || post.title
      excerpt = post.excerptAr || post.excerpt || ''
      content = post.contentAr || post.content
    } else if (locale === 'ru') {
      title = post.titleRu || post.title
      excerpt = post.excerptRu || post.excerpt || ''
      content = post.contentRu || post.content
    }

    // Remove featured image from content if duplicated
    if (post.featuredImage && content) {
      const escapedPath = post.featuredImage.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      const imgRegex = new RegExp(`<img[^>]*src=["']${escapedPath}["'][^>]*>`, 'gi')
      const divImgRegex = new RegExp(`<div[^>]*>\\s*<img[^>]*src=["']${escapedPath}["'][^>]*>\\s*</div>`, 'gi')
      content = content.replace(divImgRegex, '').replace(imgRegex, '')
    }

    // Sanitize HTML content
    content = sanitizeHtml(content)

    // Parse tags
    let tags: string[] = []
    if (post.tags) {
      try {
        tags = JSON.parse(post.tags)
      } catch {
        // ignore invalid JSON
      }
    }

    return NextResponse.json({
      post: {
        id: post.id,
        title,
        slug: post.slug,
        excerpt,
        content,
        featuredImage: post.featuredImage,
        authorName: post.authorName || 'GENOSYS Team',
        publishedAt: post.publishedAt?.toISOString() || null,
        views: (post.views || 0) + 1, // +1 for current view
        tags,
      },
      comments: post.comments.map((c) => ({
        id: c.id,
        userName: c.userName,
        content: c.content,
        createdAt: c.createdAt.toISOString(),
      })),
      commentCount: post.comments.length,
      locale,
    })
  } catch (error) {
    errorLog('Mobile Blog Post Detail API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
