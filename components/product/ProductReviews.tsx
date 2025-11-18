'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/AuthProvider'
import { Star, Edit2, Trash2 } from 'lucide-react'
import { errorLog } from '@/lib/logger'
import { fetchCsrfToken, getCsrfHeaders, addCsrfToBody } from '@/lib/csrfClient'

interface Review {
  id: string
  userId: string
  userName: string
  rating: number
  title: string | null
  comment: string
  helpful: number
  createdAt: string
}

interface ProductReviewsProps {
  productId: string
}

export default function ProductReviews({ productId }: ProductReviewsProps) {
  const { user } = useAuth()
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingReview, setEditingReview] = useState<Review | null>(null)
  const [formData, setFormData] = useState({
    rating: 5,
    title: '',
    comment: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const [averageRating, setAverageRating] = useState<number | null>(null)
  const [reviewCount, setReviewCount] = useState(0)

  useEffect(() => {
    fetchCsrfToken().catch(err => {
      errorLog('Failed to fetch CSRF token:', err)
    })
    fetchReviews()
  }, [productId])

  const fetchReviews = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/products/${productId}/reviews`)
      const data = await response.json()
      
      if (data.reviews) {
        setReviews(data.reviews)
        setAverageRating(data.averageRating)
        setReviewCount(data.reviewCount)
      }
    } catch (error) {
      errorLog('Error fetching reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      alert('Please log in to leave a review')
      return
    }

    if (formData.comment.trim().length < 10) {
      alert('Please write at least 10 characters')
      return
    }

    try {
      setSubmitting(true)
      const csrfToken = await fetchCsrfToken()
      if (!csrfToken) {
        throw new Error('Security error: Could not verify request')
      }
      
      const url = editingReview
        ? `/api/products/${productId}/reviews/${editingReview.id}`
        : `/api/products/${productId}/reviews`
      
      const method = editingReview ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...getCsrfHeaders() as Record<string, string>
        },
        body: JSON.stringify(addCsrfToBody({
          email: user.email,
          rating: formData.rating,
          title: formData.title,
          comment: formData.comment
        }))
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit review')
      }

      // Reset form and refresh reviews
      setFormData({ rating: 5, title: '', comment: '' })
      setShowForm(false)
      setEditingReview(null)
      await fetchReviews()
    } catch (error) {
      errorLog('Error submitting review:', error)
      alert(error instanceof Error ? error.message : 'Failed to submit review')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete your review?')) return

    try {
      const csrfToken = await fetchCsrfToken()
      if (!csrfToken) {
        throw new Error('Security error: Could not verify request')
      }

      const response = await fetch(
        `/api/products/${productId}/reviews/${reviewId}?email=${encodeURIComponent(user?.email || '')}`,
        {
          method: 'DELETE',
          headers: {
            ...getCsrfHeaders() as Record<string, string>
          }
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete review')
      }

      await fetchReviews()
    } catch (error) {
      errorLog('Error deleting review:', error)
      alert(error instanceof Error ? error.message : 'Failed to delete review')
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const userReview = reviews.find(r => r.userId === user?.id)

  return (
    <div className="mt-12 border-t pt-6 md:pt-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex-1">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Customer Reviews</h2>
          {averageRating && (
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 md:h-5 md:w-5 ${
                      i < Math.floor(averageRating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-base md:text-lg font-semibold">{averageRating.toFixed(1)}</span>
              <span className="text-sm md:text-base text-gray-600">({reviewCount} {reviewCount === 1 ? 'review' : 'reviews'})</span>
            </div>
          )}
        </div>
        {user && !userReview && !showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm md:text-base font-medium whitespace-nowrap"
          >
            Write a Review
          </button>
        )}
      </div>

      {/* Review Form */}
      {(showForm || editingReview) && user && (
        <form onSubmit={handleSubmit} className="mb-8 p-4 md:p-6 bg-gray-50 rounded-lg">
          <h3 className="text-base md:text-lg font-semibold mb-4">
            {editingReview ? 'Edit Your Review' : 'Write a Review'}
          </h3>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rating *
            </label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFormData({ ...formData, rating: star })}
                  className="focus:outline-none touch-manipulation"
                  aria-label={`Rate ${star} star${star !== 1 ? 's' : ''}`}
                >
                  <Star
                    className={`h-7 w-7 md:h-8 md:w-8 ${
                      star <= formData.rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Review Title (Optional)
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white text-gray-900 placeholder:text-gray-500 text-base"
              placeholder="Summarize your experience"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Review *
            </label>
            <textarea
              value={formData.comment}
              onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
              rows={5}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white text-gray-900 placeholder:text-gray-500 text-base resize-y"
              placeholder="Share your experience with this product..."
              required
              minLength={10}
            />
            <p className="text-sm text-gray-500 mt-1">
              Minimum 10 characters ({formData.comment.length}/10)
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <button
              type="submit"
              disabled={submitting || formData.comment.trim().length < 10}
              className="flex-1 sm:flex-none px-6 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm md:text-base touch-manipulation"
            >
              {submitting ? 'Submitting...' : editingReview ? 'Update Review' : 'Submit Review'}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false)
                setEditingReview(null)
                setFormData({ rating: 5, title: '', comment: '' })
              }}
              className="flex-1 sm:flex-none px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium text-sm md:text-base touch-manipulation"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Reviews List */}
      {loading ? (
        <div className="text-center py-8 text-gray-600">Loading reviews...</div>
      ) : reviews.length > 0 && (
        <div className="space-y-4 md:space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="border-b border-gray-200 pb-4 md:pb-6 last:border-b-0">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-900 text-sm md:text-base">{review.userName}</span>
                    <div className="flex items-center flex-shrink-0">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3.5 w-3.5 md:h-4 md:w-4 ${
                            i < review.rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  {review.title && (
                    <h4 className="font-medium text-gray-900 mb-1 text-sm md:text-base">{review.title}</h4>
                  )}
                  <p className="text-xs md:text-sm text-gray-500">{formatDate(review.createdAt)}</p>
                </div>
                {user?.id === review.userId && (
                  <div className="flex gap-1 flex-shrink-0">
                    <button
                      onClick={() => {
                        setEditingReview(review)
                        setFormData({
                          rating: review.rating,
                          title: review.title || '',
                          comment: review.comment
                        })
                        setShowForm(true)
                      }}
                      className="p-2 text-gray-600 hover:text-primary-600 touch-manipulation"
                      title="Edit review"
                      aria-label="Edit review"
                    >
                      <Edit2 className="h-4 w-4 md:h-5 md:w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(review.id)}
                      className="p-2 text-gray-600 hover:text-red-600 touch-manipulation"
                      title="Delete review"
                      aria-label="Delete review"
                    >
                      <Trash2 className="h-4 w-4 md:h-5 md:w-5" />
                    </button>
                  </div>
                )}
              </div>
              <p className="text-gray-700 text-sm md:text-base leading-relaxed break-words">{review.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

