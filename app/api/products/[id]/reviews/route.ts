import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { errorLog } from '@/lib/logger'
import { findUserByEmail } from '@/lib/userStorageDb'
import { awardReviewBonus } from '@/lib/loyalty'
import { validateReviewMutationAuth } from '@/lib/reviewMutationAuth'

// GET - Fetch reviews for a product
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { searchParams } = new URL(request.url)
    const limit = Number.isNaN(parseInt(searchParams.get('limit') || '10')) ? 10 : parseInt(searchParams.get('limit') || '10')
    const offset = Number.isNaN(parseInt(searchParams.get('offset') || '0')) ? 0 : parseInt(searchParams.get('offset') || '0')
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

    // Star breakdown for the summary bars. Counted over every approved review,
    // not just the page being returned, so the bars stay correct while the
    // shopper pages through the list.
    const byRating = await prisma.productReview.groupBy({
      by: ['rating'],
      where: {
        productId: id,
        approved: true
      },
      _count: {
        rating: true
      }
    })

    const distribution: Record<string, number> = { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0 }
    for (const row of byRating) {
      distribution[String(row.rating)] = row._count.rating
    }

    return NextResponse.json({
      reviews,
      totalCount,
      hasMore: offset + limit < totalCount,
      averageRating: ratingStats._avg.rating || null,
      reviewCount: ratingStats._count.rating || 0,
      distribution
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

    const mutationAuth = await validateReviewMutationAuth(request)
    if (!mutationAuth.valid) {
      return NextResponse.json(
        { error: mutationAuth.error },
        { status: mutationAuth.status }
      )
    }

    const body = await request.json()
    const { email: submittedEmail, rating, title, comment } = body
    // The native app identity comes from its signed JWT. Never trust an email
    // supplied in a mobile request body.
    const email = mutationAuth.mobileEmail || submittedEmail

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

    // GENOSYS Rewards - +50 pts per review, once per user per product
    // (retail track only; idempotent). Never blocks review creation.
    let pointsAwarded = 0
    try {
      pointsAwarded = await awardReviewBonus({
        userId: user.id,
        productId,
        productName: product.name,
      })
    } catch (bonusError) {
      errorLog('Review bonus award failed (review still created):', bonusError)
    }

    return NextResponse.json({
      success: true,
      pointsAwarded,
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

