import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { errorLog } from '@/lib/logger'
import { findUserByEmail } from '@/lib/userStorageDb'
import { validateReviewMutationAuth } from '@/lib/reviewMutationAuth'

// PUT - Update review
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; reviewId: string }> }
) {
  try {
    const { id: productId, reviewId } = await params

    const mutationAuth = await validateReviewMutationAuth(request)
    if (!mutationAuth.valid) {
      return NextResponse.json(
        { error: mutationAuth.error },
        { status: mutationAuth.status }
      )
    }

    const body = await request.json()
    const { email: submittedEmail, rating, title, comment } = body
    const email = mutationAuth.mobileEmail || submittedEmail

    const user = await findUserByEmail(email)
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 401 }
      )
    }

    const review = await prisma.productReview.findUnique({
      where: { id: reviewId }
    })

    if (!review || review.userId !== user.id) {
      return NextResponse.json(
        { error: 'Review not found or unauthorized' },
        { status: 404 }
      )
    }

    // Validate rating if provided
    if (rating !== undefined && (rating < 1 || rating > 5)) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      )
    }

    // Validate comment if provided
    if (comment !== undefined && comment.trim().length < 10) {
      return NextResponse.json(
        { error: 'Comment must be at least 10 characters' },
        { status: 400 }
      )
    }

    const updatedReview = await prisma.productReview.update({
      where: { id: reviewId },
      data: {
        rating: rating !== undefined ? rating : review.rating,
        title: title !== undefined ? (title.trim() || null) : review.title,
        comment: comment !== undefined ? comment.trim() : review.comment
      }
    })

    // Recalculate product rating
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
          rating: Math.round(ratingStats._avg.rating * 10) / 10
        }
      })
    }

    return NextResponse.json({ success: true, review: updatedReview })
  } catch (error) {
    errorLog('Error updating review:', error)
    return NextResponse.json(
      { error: 'Failed to update review' },
      { status: 500 }
    )
  }
}

// DELETE - Delete review
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; reviewId: string }> }
) {
  try {
    const { id: productId, reviewId } = await params

    const mutationAuth = await validateReviewMutationAuth(request)
    if (!mutationAuth.valid) {
      return NextResponse.json(
        { error: mutationAuth.error },
        { status: mutationAuth.status }
      )
    }

    const { searchParams } = new URL(request.url)
    const email = mutationAuth.mobileEmail || searchParams.get('email')

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    const user = await findUserByEmail(email)
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 401 }
      )
    }

    const review = await prisma.productReview.findUnique({
      where: { id: reviewId }
    })

    if (!review || review.userId !== user.id) {
      return NextResponse.json(
        { error: 'Review not found or unauthorized' },
        { status: 404 }
      )
    }

    await prisma.productReview.delete({
      where: { id: reviewId }
    })

    // Recalculate product rating
    const ratingStats = await prisma.productReview.aggregate({
      where: {
        productId,
        approved: true
      },
      _avg: {
        rating: true
      }
    })

    await prisma.product.update({
      where: { id: productId },
      data: {
        rating: ratingStats._avg.rating 
          ? Math.round(ratingStats._avg.rating * 10) / 10 
          : 5.0 // Default if no reviews
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    errorLog('Error deleting review:', error)
    return NextResponse.json(
      { error: 'Failed to delete review' },
      { status: 500 }
    )
  }
}

