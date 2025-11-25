import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdminAuth } from '@/lib/adminAuth'
import { errorLog } from '@/lib/logger'
import { sanitizeForStorage } from '@/lib/sanitize'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Require admin authentication
  const auth = await requireAdminAuth(request)
  if (!auth.authorized) {
    return auth.response
  }

  try {
    const { id } = await params
    const { title, slug, excerpt, content, featuredImage, authorName, published, publishedAt, tags } = await request.json()

    if (!title || !slug || !content) {
      return NextResponse.json(
        { error: 'Title, slug, and content are required' },
        { status: 400 }
      )
    }

    // Handle tags - can be array or string
    let tagsValue: string | null = null
    if (tags) {
      if (Array.isArray(tags)) {
        tagsValue = JSON.stringify(tags)
      } else if (typeof tags === 'string') {
        // If it's already a JSON string, validate it, otherwise treat as single tag
        try {
          JSON.parse(tags)
          tagsValue = tags
        } catch {
          tagsValue = JSON.stringify([tags])
        }
      }
    }

    const post = await prisma.blogPost.update({
      where: { id },
      data: {
        title,
        slug,
        excerpt: excerpt ? sanitizeForStorage(excerpt) : null,
        content: sanitizeForStorage(content),
        featuredImage: featuredImage || null,
        authorName: authorName || null,
        published: published || false,
        publishedAt: publishedAt ? new Date(publishedAt) : published ? new Date() : null,
        tags: tagsValue,
      },
    })

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
    errorLog('Error updating blog post:', error)
    
    // Handle unique constraint violation
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return NextResponse.json(
        { error: 'A post with this slug already exists' },
        { status: 400 }
      )
    }

    // Handle not found
    if (error instanceof Error && error.message.includes('Record to update does not exist')) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Require admin authentication
  const auth = await requireAdminAuth(request)
  if (!auth.authorized) {
    return auth.response
  }

  try {
    const { id } = await params
    await prisma.blogPost.delete({
      where: { id },
    })

    return NextResponse.json({
      success: true,
      message: 'Post deleted successfully',
    })
  } catch (error) {
    errorLog('Error deleting blog post:', error)
    
    // Handle not found
    if (error instanceof Error && error.message.includes('Record to delete does not exist')) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

