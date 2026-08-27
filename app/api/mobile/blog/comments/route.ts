/**
 * Mobile Blog Comments API
 * GET  /api/mobile/blog/comments?postId=xxx - fetch comments for a post
 * POST /api/mobile/blog/comments - submit a comment (requires JWT auth)
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { validateMobileAuth, extractTokenFromHeader } from '@/lib/jwt'
import { findUserByEmail } from '@/lib/userStorageDb'
import { sanitizeText } from '@/lib/sanitize'
import { errorLog, debugLog } from '@/lib/logger'

export async function GET(request: NextRequest) {
  try {
    // Validate API key
    const apiKey = request.headers.get('x-api-key')
    if (apiKey !== process.env.MOBILE_APP_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const postId = searchParams.get('postId')

    if (!postId) {
      return NextResponse.json({ error: 'postId is required' }, { status: 400 })
    }

    const comments = await prisma.blogComment.findMany({
      where: {
        postId,
        approved: true,
      },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        userName: true,
        content: true,
        createdAt: true,
      },
    })

    return NextResponse.json({
      success: true,
      comments: comments.map((c) => ({
        id: c.id,
        userName: c.userName,
        content: c.content,
        createdAt: c.createdAt.toISOString(),
      })),
      total: comments.length,
    })
  } catch (error) {
    errorLog('Mobile blog comments GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Validate API key + JWT token
    const apiKey = request.headers.get('x-api-key')
    const token = extractTokenFromHeader(request.headers.get('authorization'))

    const authResult = validateMobileAuth(apiKey, token)
    if (!authResult.valid) {
      return NextResponse.json(
        { success: false, error: authResult.error },
        { status: authResult.status || 401 }
      )
    }

    if (!authResult.payload?.email) {
      return NextResponse.json(
        { success: false, error: 'Authentication required to comment' },
        { status: 401 }
      )
    }

    // Find user
    const user = await findUserByEmail(authResult.payload.email)
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    const body = await request.json()
    const { postId, content } = body

    if (!postId || !content?.trim()) {
      return NextResponse.json(
        { success: false, error: 'postId and content are required' },
        { status: 400 }
      )
    }

    // Verify post exists
    const post = await prisma.blogPost.findUnique({
      where: { id: postId, published: true },
    })

    if (!post) {
      return NextResponse.json(
        { success: false, error: 'Blog post not found' },
        { status: 404 }
      )
    }

    // Sanitize and create comment
    const sanitizedContent = sanitizeText(content.trim())

    const comment = await prisma.blogComment.create({
      data: {
        postId,
        userId: user.id,
        userName: user.name || 'User',
        userEmail: user.email,
        content: sanitizedContent,
        approved: true, // Auto-approve for registered users
      },
    })

    debugLog(`✅ Blog comment created by ${user.email} on post ${postId}`)

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
    errorLog('Mobile blog comments POST error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
