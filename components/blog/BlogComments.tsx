'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/auth/AuthProvider'
import { MessageCircle, Send, User, Smile } from 'lucide-react'
import { errorLog } from '@/lib/logger'
import { fetchCsrfToken, getCsrfHeaders, addCsrfToBody } from '@/lib/csrfClient'
import { useTranslation } from '@/hooks/useTranslation'
import { getLocalizedPath } from '@/lib/i18n'

interface Comment {
  id: string
  userName: string
  content: string
  createdAt: string
}

interface BlogCommentsProps {
  postId: string
  initialComments: Comment[]
}

export default function BlogComments({ postId, initialComments }: BlogCommentsProps) {
  const { user } = useAuth()
  const { locale } = useTranslation()
  const [comments, setComments] = useState<Comment[]>(initialComments)
  const [newComment, setNewComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchCsrfToken().catch(err => {
      errorLog('Failed to fetch CSRF token:', err)
    })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      setError('Please log in to leave a comment')
      return
    }

    if (!newComment.trim()) {
      setError('Please enter a comment')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const csrfToken = await fetchCsrfToken()
      if (!csrfToken) {
        throw new Error('Security error: Could not verify request')
      }

      const response = await fetch('/api/blog/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Email': user.email,
          ...getCsrfHeaders() as Record<string, string>,
        },
        body: JSON.stringify(addCsrfToBody({
          postId,
          content: newComment.trim(),
          userEmail: user.email,
        })),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to submit comment')
      }

      const data = await response.json()
      
      // Add new comment to list
      setComments([data.comment, ...comments])
      setNewComment('')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit comment'
      errorLog('Error submitting comment:', err)
      setError(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Comment Form */}
      {user ? (
        <form onSubmit={handleSubmit} className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <div className="bg-[var(--cera-ok-bg)] rounded-full p-3 flex items-center justify-center">
              <Smile className="h-6 w-6 text-[var(--cera-ok)]" />
            </div>
            <div className="flex-1">
              <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                Add a comment as: {user.name}
              </label>
              <textarea
                id="comment"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write your comment..."
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none bg-white text-gray-900 placeholder:text-gray-500"
                required
              />
              {error && (
                <p className="mt-2 text-sm text-red-600">{error}</p>
              )}
              <button
                type="submit"
                disabled={isSubmitting || !newComment.trim()}
                className="mt-4 bg-primary-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Send className="h-4 w-4" />
                {isSubmitting ? 'Submitting...' : 'Post Comment'}
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div className="bg-gray-50 rounded-lg p-6 text-center">
          <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">
            Please log in to leave a comment
          </p>
          <a
            href={getLocalizedPath('/login', locale)}
            className="inline-block bg-primary-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
          >
            Log in
          </a>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-6">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="border-b border-gray-200 pb-6 last:border-0">
              <div className="flex items-start gap-4">
                <div className="bg-primary-100 rounded-full p-2">
                  <User className="h-5 w-5 text-primary-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold text-gray-800">{comment.userName}</span>
                    <span className="text-sm text-gray-500">
                      {new Date(comment.createdAt).toLocaleDateString('en-AE', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <p className="text-gray-700 whitespace-pre-wrap">{comment.content}</p>
                </div>
              </div>
            </div>
          ))
        ) : null}
      </div>
    </div>
  )
}

