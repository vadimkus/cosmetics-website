/**
 * Mobile Blog API - GET /api/mobile/blog
 * Returns blog posts for the native mobile app.
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // Validate API key
    const apiKey = request.headers.get('x-api-key')
    if (apiKey !== process.env.MOBILE_APP_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const locale = request.headers.get('x-locale') || 'en'
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const skip = (page - 1) * limit

    const [posts, total] = await Promise.all([
      prisma.blogPost.findMany({
        where: { published: true },
        orderBy: { publishedAt: 'desc' },
        skip,
        take: limit,
        select: {
          id: true,
          title: true,
          titleRu: true,
          titleAr: true,
          slug: true,
          excerpt: true,
          excerptRu: true,
          excerptAr: true,
          featuredImage: true,
          authorName: true,
          publishedAt: true,
          views: true,
        },
      }),
      prisma.blogPost.count({ where: { published: true } }),
    ])

    // Format posts with locale-aware content (AR was previously omitted, so
    // Arabic app users saw English titles/excerpts in the blog list).
    const localizedTitle = (post: (typeof posts)[number]) =>
      locale === 'ru' ? (post.titleRu || post.title)
      : locale === 'ar' ? (post.titleAr || post.title)
      : post.title
    const localizedExcerpt = (post: (typeof posts)[number]) =>
      locale === 'ru' ? (post.excerptRu || post.excerpt)
      : locale === 'ar' ? (post.excerptAr || post.excerpt)
      : post.excerpt

    const formattedPosts = posts.map((post) => ({
      id: post.id,
      title: localizedTitle(post),
      slug: post.slug,
      excerpt: localizedExcerpt(post),
      featuredImage: post.featuredImage,
      authorName: post.authorName,
      publishedAt: post.publishedAt?.toISOString() || null,
      views: post.views || 0,
    }))

    return NextResponse.json({
      posts: formattedPosts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Mobile Blog API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
