import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { errorLog } from '@/lib/logger'
import { validateCsrfToken } from '@/lib/csrf'
import { findUserByEmail } from '@/lib/userStorageDb'

// GET - Fetch reviews for a product
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')
    const approvedOnly = searchParams.get('approved') !== 'false'

    const reviews = await prisma.productReview.findMany({
      where: {
        productId: id,
        ...(approvedOnly && { approved: true })
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit,
      skip: offset,
      select: {
        id: true,
        userId: true,
        userName: true,
        rating: true,
        title: true,
        comment: true,
        helpful: true,
        createdAt: true,
        updatedAt: true
      }
    })

    const totalCount = await prisma.productReview.count({
      where: {
        productId: id,
        ...(approvedOnly && { approved: true })
      }
    })

    // Calculate average rating
    const ratingStats = await prisma.productReview.aggregate({
      where: {
        productId: id,
        approved: true
      },
      _avg: {
        rating: true
      },
      _count: {
        rating: true
      }
    })

    return NextResponse.json({
      reviews,
      totalCount,
      hasMore: offset + limit < totalCount,
      averageRating: ratingStats._avg.rating || null,
      reviewCount: ratingStats._count.rating || 0
    })
  } catch (error) {
    errorLog('Error fetching reviews:', error)
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    )
  }
}

// POST - Create a new review (registered users only)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: productId } = await params

    // CSRF protection
    const csrfCheck = await validateCsrfToken(request)
    if (!csrfCheck.valid) {
      return NextResponse.json(
        { error: csrfCheck.error || 'Invalid CSRF token' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { email, rating, title, comment } = body

    // Validate input
    if (!email || !rating || !comment) {
      return NextResponse.json(
        { error: 'Email, rating, and comment are required' },
        { status: 400 }
      )
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      )
    }

    if (comment.trim().length < 10) {
      return NextResponse.json(
        { error: 'Comment must be at least 10 characters' },
        { status: 400 }
      )
    }

    // Verify user exists and is registered
    const user = await findUserByEmail(email)
    if (!user) {
      return NextResponse.json(
        { error: 'User not found. Please log in to leave a review.' },
        { status: 401 }
      )
    }

    // Check if user already reviewed this product
    const existingReview = await prisma.productReview.findUnique({
      where: {
        productId_userId: {
          productId,
          userId: user.id
        }
      }
    })

    if (existingReview) {
      return NextResponse.json(
        { error: 'You have already reviewed this product. You can edit your existing review.' },
        { status: 400 }
      )
    }

    // Verify product exists
    const product = await prisma.product.findUnique({
      where: { id: productId }
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Create review
    const review = await prisma.productReview.create({
      data: {
        productId,
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        rating,
        title: title?.trim() || null,
        comment: comment.trim(),
        approved: true // Auto-approve for registered users
      }
    })

    // Update product average rating
    const ratingStats = await prisma.productReview.aggregate({
      where: {
        productId,
        approved: true
      },
      _avg: {
        rating: true
      }
    })

    if (ratingStats._avg.rating) {
      await prisma.product.update({
        where: { id: productId },
        data: {
          rating: Math.round(ratingStats._avg.rating * 10) / 10 // Round to 1 decimal
        }
      })
    }

    return NextResponse.json({
      success: true,
      review: {
        id: review.id,
        userName: review.userName,
        rating: review.rating,
        title: review.title,
        comment: review.comment,
        createdAt: review.createdAt
      }
    })
  } catch (error) {
    errorLog('Error creating review:', error)
    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 }
    )
  }
}

