import { NextRequest, NextResponse, after } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdminAuth } from '@/lib/adminAuth'
import { errorLog } from '@/lib/logger'
import { sanitizeForStorage } from '@/lib/sanitize'
import { announceBlogPost } from '@/lib/blogAnnounce'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const published = searchParams.get('published')
    const limitParam = parseInt(searchParams.get('limit') || '20')
    const limit = Number.isNaN(limitParam) ? 20 : limitParam

    const whereClause = published === 'true' ? { published: true } : {}

    const posts = await prisma.blogPost.findMany({
      where: whereClause,
      orderBy: {
        publishedAt: 'desc',
      },
      take: limit,
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        content: true,
        featuredImage: true,
        authorName: true,
        published: true,
        publishedAt: true,
        views: true,
        createdAt: true,
        updatedAt: true,
        tags: true,
      },
    })

    return NextResponse.json({
      success: true,
      posts: posts.map(post => ({
        ...post,
        publishedAt: post.publishedAt?.toISOString() || null,
        createdAt: post.createdAt.toISOString(),
        updatedAt: post.updatedAt.toISOString(),
      })),
    })
  } catch (error) {
    errorLog('Error fetching blog posts:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  // Require admin authentication
  const auth = await requireAdminAuth(request)
  if (!auth.authorized) {
    return auth.response
  }

  try {
    const { title, slug, excerpt, content, featuredImage, authorName, published, tags } = await request.json()

    if (!title || !slug || !content) {
      return NextResponse.json(
        { error: 'Title, slug, and content are required' },
        { status: 400 }
      )
    }

    const post = await prisma.blogPost.create({
      data: {
        title,
        slug,
        excerpt: excerpt ? sanitizeForStorage(excerpt) : null,
        content: sanitizeForStorage(content),
        featuredImage: featuredImage || null,
        authorName: authorName || null,
        published: published || false,
        publishedAt: published ? new Date() : null,
        tags: tags ? JSON.stringify(tags) : null,
      },
    })

    // Notify subscribers after the response is flushed. Idempotent via the
    // post's `announcedAt` claim, so a re-publish never sends twice.
    if (post.published) {
      const sentBy = auth.user?.email || 'admin'
      after(async () => {
        await announceBlogPost({ slug: post.slug, sentBy }).catch(e =>
          errorLog('[blog/posts POST] announce failed:', e)
        )
      })
    }

    return NextResponse.json({
      success: true,
      post: {
        ...post,
        publishedAt: post.publishedAt?.toISOString() || null,
        createdAt: post.createdAt.toISOString(),
        updatedAt: post.updatedAt.toISOString(),
      },
    })
  } catch (error) {
    errorLog('Error creating blog post:', error)
    
    // Handle unique constraint violation
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return NextResponse.json(
        { error: 'A post with this slug already exists' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

