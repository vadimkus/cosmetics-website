import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireCsrfToken } from '@/lib/csrf'
import { requireBodySizeLimit, getSizeLimitForContentType } from '@/lib/requestSizeLimit'
import { errorLog } from '@/lib/logger'
import { findUserByEmail } from '@/lib/userStorageDb'

export async function POST(request: NextRequest) {
  // CSRF protection
  const csrfCheck = await requireCsrfToken(request)
  if (!csrfCheck.valid) {
    return csrfCheck.response!
  }

  // Request body size limit check
  const sizeLimit = getSizeLimitForContentType(request)
  const sizeCheck = requireBodySizeLimit(request, sizeLimit)
  if (!sizeCheck.valid) {
    return sizeCheck.response!
  }

  try {
    const body = await request.json()
    const { postId, content, userEmail: bodyUserEmail } = body

    if (!postId || !content) {
      return NextResponse.json(
        { error: 'Post ID and content are required' },
        { status: 400 }
      )
    }

    // Get user email from request body or headers
    const userEmail = bodyUserEmail || request.headers.get('x-user-email')
    
    if (!userEmail) {
      return NextResponse.json(
        { error: 'Authentication required. Please log in to comment.' },
        { status: 401 }
      )
    }

    const user = await findUserByEmail(userEmail)
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found. Please log in to comment.' },
        { status: 401 }
      )
    }

    // Verify post exists
    const post = await prisma.blogPost.findUnique({
      where: { id: postId },
    })

    if (!post) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      )
    }

    // Create comment
    const comment = await prisma.blogComment.create({
      data: {
        postId,
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        content: content.trim(),
        approved: true, // Auto-approve for registered users
      },
    })

    return NextResponse.json({
      success: true,
      comment: {
        id: comment.id,
        userName: comment.userName,
        content: comment.content,
        createdAt: comment.createdAt.toISOString(),
      },
    })
  } catch (error) {
    errorLog('Error creating blog comment:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const postId = searchParams.get('postId')

    if (!postId) {
      return NextResponse.json(
        { error: 'Post ID is required' },
        { status: 400 }
      )
    }

    const comments = await prisma.blogComment.findMany({
      where: {
        postId,
        approved: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        userName: true,
        content: true,
        createdAt: true,
      },
    })

    return NextResponse.json({
      success: true,
      comments: comments.map(comment => ({
        ...comment,
        createdAt: comment.createdAt.toISOString(),
      })),
    })
  } catch (error) {
    errorLog('Error fetching blog comments:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

