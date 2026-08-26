'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/components/auth/AuthProvider'
import { Star, Edit2, Trash2, Check, AlertCircle, PenLine } from 'lucide-react'
import { errorLog } from '@/lib/logger'
import { fetchCsrfToken, getCsrfHeaders, addCsrfToBody } from '@/lib/csrfClient'
import { useTranslation } from '@/hooks/useTranslation'
import { getLocalizedPath } from '@/lib/i18n'

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

type Distribution = Record<string, number>

interface ProductReviewsProps {
  productId: string
  /**
   * `editorial` skins the block for the bespoke product pages (60, 61, 63 to
   * 66). Those pages set the `--cera-*` palette and load the serif face, so the
   * variant only has to swap class strings; it renders the same markup and runs
   * the same code as the default. Anywhere else, leave it unset.
   */
  variant?: 'default' | 'editorial'
}

const PAGE_SIZE = 10

/** Class strings that differ between the shared PDP and the bespoke pages.
 *  Keeping them in one map is what stops the JSX below turning into a wall of
 *  ternaries, and makes it obvious that the two variants differ in styling
 *  only. */
const SKINS = {
  default: {
    wrapper: 'mt-12 border-t pt-6 md:pt-8',
    eyebrow: 'hidden',
    heading: 'text-xl md:text-2xl font-bold text-[var(--color-text-primary)]',
    bigScore: 'text-4xl font-bold text-[var(--color-text-primary)]',
    panel: 'rounded-xl border border-[var(--color-border-primary)] bg-[var(--color-bg-primary)] p-5 md:p-6',
    card: 'border-b border-[var(--color-border-primary)] pb-4 md:pb-6 last:border-b-0',
    avatar: 'bg-[var(--color-border-primary)] text-[var(--color-text-secondary)]',
    name: 'font-semibold text-[var(--color-text-primary)]',
    meta: 'text-[var(--color-text-tertiary)]',
    body: 'text-[var(--color-text-secondary)]',
    star: 'text-yellow-400',
    starEmpty: 'text-gray-300',
    bar: 'bg-yellow-400',
    barTrack: 'bg-[var(--color-border-primary)]',
    accent: 'text-primary-700',
    iconBtn: 'text-[var(--color-text-tertiary)] hover:text-primary-600',
    divider: 'sm:border-[var(--color-border-primary)]',
    cta: 'bg-primary-600 text-white hover:bg-primary-700',
    ctaGhost: 'border border-[var(--color-border-secondary)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)]',
    input: 'rounded-md border border-[var(--color-border-secondary)] bg-white text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] focus:ring-2 focus:ring-primary-500',
    formPanel: 'rounded-lg bg-[var(--color-bg-primary)] p-4 md:p-6',
    skeleton: 'bg-[var(--color-border-primary)]',
  },
  editorial: {
    // No top rule or margin: the bespoke pages already wrap this in a padded
    // section, and the extra border was drawing a stray line above the block.
    wrapper: '',
    eyebrow: 'cera-eyebrow',
    heading: 'cera-serif text-[30px] leading-[1.12] sm:text-[40px]',
    bigScore: 'cera-serif cera-numeral text-[52px] text-[var(--cera-ink)]',
    panel: 'cera-card p-6 lg:p-7',
    card: 'cera-card p-5 sm:p-6',
    avatar: 'bg-[var(--cera-blush)] text-[var(--cera-rose-ink)]',
    name: 'cera-serif text-[17px] text-[var(--cera-ink)]',
    meta: 'text-[var(--cera-muted)]',
    body: 'text-[var(--cera-body)]',
    star: 'text-[#d8a24a]',
    starEmpty: 'text-[var(--cera-line)]',
    bar: 'bg-[var(--cera-rose)]',
    barTrack: 'bg-[var(--cera-cream-deep)]',
    accent: 'text-[var(--cera-rose-ink)]',
    iconBtn: 'text-[var(--cera-muted)] hover:text-[var(--cera-rose-ink)]',
    divider: 'sm:border-[var(--cera-line)]',
    cta: 'bg-[var(--cera-ink)] text-white hover:bg-black',
    ctaGhost: 'border border-[var(--cera-line)] text-[var(--cera-body)] hover:border-[var(--cera-rose)]',
    input: 'rounded-2xl border border-[var(--cera-line)] bg-white text-[var(--cera-ink)] placeholder:text-[var(--cera-muted)] focus:ring-2 focus:ring-[var(--cera-rose)]',
    formPanel: 'cera-card p-5 sm:p-6 lg:p-7',
    skeleton: 'bg-[var(--cera-cream-deep)]',
  },
} as const

export default function ProductReviews({ productId, variant = 'default' }: ProductReviewsProps) {
  const { user } = useAuth()
  const { t, locale, dir } = useTranslation()
  // The wrapper carries dir, so every flex row and logical property below
  // mirrors on its own. Adding flex-row-reverse here would flip them back to
  // LTR, which is what used to put the Arabic avatar on the wrong side.
  const editorial = variant === 'editorial'
  const s = SKINS[variant]

  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingReview, setEditingReview] = useState<Review | null>(null)
  const [formData, setFormData] = useState({ rating: 5, title: '', comment: '' })
  const [hoverRating, setHoverRating] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [averageRating, setAverageRating] = useState<number | null>(null)
  const [reviewCount, setReviewCount] = useState(0)
  const [distribution, setDistribution] = useState<Distribution | null>(null)
  /** Inline banner. Replaces the alert() calls, which were the only thing on
   *  these pages that could interrupt a shopper with a browser chrome dialog. */
  const [notice, setNotice] = useState<{ kind: 'success' | 'error'; text: string } | null>(null)
  /** Id of the review showing its inline delete confirmation, replacing confirm(). */
  const [confirmingDelete, setConfirmingDelete] = useState<string | null>(null)

  const loadReviews = useCallback(
    async (offset = 0) => {
      try {
        if (offset === 0) setLoading(true)
        else setLoadingMore(true)
        const response = await fetch(
          `/api/products/${productId}/reviews?limit=${PAGE_SIZE}&offset=${offset}`
        )
        const data = await response.json()
        if (data.reviews) {
          // Appending on paging, replacing on refresh, so submitting a review
          // does not silently drop pages the shopper already loaded.
          setReviews(prev => (offset === 0 ? data.reviews : [...prev, ...data.reviews]))
          setAverageRating(data.averageRating)
          setReviewCount(data.reviewCount)
          setDistribution(data.distribution ?? null)
          setHasMore(Boolean(data.hasMore))
        }
      } catch (error) {
        errorLog('Error fetching reviews:', error)
      } finally {
        setLoading(false)
        setLoadingMore(false)
      }
    },
    [productId]
  )

  useEffect(() => {
    fetchCsrfToken().catch(err => errorLog('Failed to fetch CSRF token:', err))
    loadReviews(0)
  }, [loadReviews])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setNotice(null)

    if (!user) {
      setNotice({ kind: 'error', text: t('product.pleaseLoginToReview') })
      return
    }
    if (formData.comment.trim().length < 10) {
      setNotice({ kind: 'error', text: t('product.writeAtLeast10Characters') })
      return
    }

    const wasEditing = Boolean(editingReview)

    try {
      setSubmitting(true)
      const csrfToken = await fetchCsrfToken()
      if (!csrfToken) throw new Error('Security error: Could not verify request')

      const url = editingReview
        ? `/api/products/${productId}/reviews/${editingReview.id}`
        : `/api/products/${productId}/reviews`

      const response = await fetch(url, {
        method: editingReview ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(getCsrfHeaders() as Record<string, string>),
        },
        body: JSON.stringify(
          addCsrfToBody({
            email: user.email,
            rating: formData.rating,
            title: formData.title,
            comment: formData.comment,
          })
        ),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || t('product.failedToSubmitReview'))

      setFormData({ rating: 5, title: '', comment: '' })
      setShowForm(false)
      setEditingReview(null)
      // The points award is the reason many shoppers write the review at all,
      // so confirm it landed rather than closing the form in silence.
      const points = Number(data.pointsAwarded) || 0
      setNotice({
        kind: 'success',
        text: wasEditing
          ? t('product.reviewUpdated')
          : points > 0
            ? `${t('product.reviewPublished')} ${t('product.reviewPointsAdded', { points: String(points) })}`
            : t('product.reviewPublished'),
      })
      await loadReviews(0)
    } catch (error) {
      errorLog('Error submitting review:', error)
      setNotice({
        kind: 'error',
        text: error instanceof Error ? error.message : t('product.failedToSubmitReview'),
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (reviewId: string) => {
    setConfirmingDelete(null)
    setNotice(null)
    try {
      const csrfToken = await fetchCsrfToken()
      if (!csrfToken) throw new Error('Security error: Could not verify request')

      const response = await fetch(
        `/api/products/${productId}/reviews/${reviewId}?email=${encodeURIComponent(user?.email || '')}`,
        { method: 'DELETE', headers: { ...(getCsrfHeaders() as Record<string, string>) } }
      )
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || t('product.failedToDeleteReview'))
      }
      setNotice({ kind: 'success', text: t('product.reviewDeleted') })
      await loadReviews(0)
    } catch (error) {
      errorLog('Error deleting review:', error)
      setNotice({
        kind: 'error',
        text: error instanceof Error ? error.message : t('product.failedToDeleteReview'),
      })
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString(locale === 'ar' ? 'ar-AE' : locale === 'ru' ? 'ru-RU' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const userReview = reviews.find(r => r.userId === user?.id)
  const formOpen = showForm || Boolean(editingReview)
  /** Logged in, has not reviewed this product yet, form not already open. */
  const canWrite = Boolean(user) && !userReview && !formOpen
  /** Logged out: still invite, but the CTA has to go through login first. */
  const canInvite = !user && !formOpen

  const bars = useMemo(() => {
    if (!distribution || reviewCount === 0) return []
    return [5, 4, 3, 2, 1].map(stars => {
      const count = distribution[String(stars)] ?? 0
      return { stars, count, pct: Math.round((count / reviewCount) * 100) }
    })
  }, [distribution, reviewCount])

  const stars = (value: number, size: string) => (
    <span className="flex" aria-hidden="true">
      {[0, 1, 2, 3, 4].map(i => (
        <Star
          key={i}
          className={`${size} ${i < Math.round(value) ? `fill-current ${s.star}` : s.starEmpty}`}
        />
      ))}
    </span>
  )

  const writeButton = (label: string, onClick?: () => void, href?: string) => {
    const className = `inline-flex min-h-[44px] items-center justify-center rounded-full px-6 text-sm font-semibold transition-colors touch-manipulation ${s.cta}`
    return href ? (
      <Link href={href} className={className}>
        {label}
      </Link>
    ) : (
      <button type="button" onClick={onClick} className={className}>
        {label}
      </button>
    )
  }

  return (
    <div className={s.wrapper} dir={dir}>
      {/* ── Heading ─────────────────────────────────────────────────────── */}
      <div className={editorial ? 'text-center' : ''}>
        {/* The eyebrow carries the count rather than the word "reviews", which
            the heading underneath already says. */}
        {reviewCount > 0 ? (
          <p className={s.eyebrow}>
            {reviewCount} {reviewCount === 1 ? t('product.review') : t('product.reviews')}
          </p>
        ) : null}
        <h2 className={`${s.heading} ${editorial && reviewCount > 0 ? 'mt-3' : editorial ? '' : 'mb-2'}`}>
          {t('product.customerReviews')}
        </h2>
      </div>

      {/* ── Inline notice ───────────────────────────────────────────────── */}
      {notice ? (
        <div
          role="status"
          className={`mt-5 flex items-start gap-2.5 rounded-2xl border p-4 text-sm ${
            notice.kind === 'success'
              ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
              : 'border-red-200 bg-red-50 text-red-700'
          }`}
        >
          {notice.kind === 'success' ? (
            <Check className="mt-0.5 h-4 w-4 flex-none" />
          ) : (
            <AlertCircle className="mt-0.5 h-4 w-4 flex-none" />
          )}
          <span>{notice.text}</span>
        </div>
      ) : null}

      {/* ── Summary: score, stars, star breakdown ───────────────────────── */}
      {!loading && reviewCount > 0 && averageRating ? (
        <div className={`mt-7 ${s.panel} ${editorial ? 'mx-auto max-w-[760px]' : ''}`}>
          <div
            className="flex flex-col gap-6 sm:flex-row sm:items-center"
          >
            <div className={`flex-none ${editorial ? 'text-center sm:text-start' : ''}`}>
              <p className={s.bigScore}>{averageRating.toFixed(1)}</p>
              <div className="mt-2 flex items-center gap-2">
                {stars(averageRating, 'h-4 w-4')}
                <span className={`text-[13px] ${s.meta}`}>
                  {reviewCount} {reviewCount === 1 ? t('product.review') : t('product.reviews')}
                </span>
              </div>
            </div>

            {/* The breakdown is what turns a bare average into something a
                shopper can judge: four 5s and a 1 is not the same 4.2 as five
                straight 4s. */}
            <div
              className={`min-w-0 flex-1 space-y-1.5 sm:border-s sm:ps-6 ${s.divider}`}
              aria-label={t('product.ratingBreakdown')}
            >
              {bars.map(bar => (
                <div
                  key={bar.stars}
                  className="flex items-center gap-2.5"
                >
                  <span
                    className={`flex w-8 flex-none items-center justify-end gap-1 text-[12px] tabular-nums ${s.meta}`}
                  >
                    {bar.stars}
                    <Star className={`h-3 w-3 fill-current ${s.star}`} aria-hidden="true" />
                  </span>
                  <span className={`h-1.5 min-w-0 flex-1 overflow-hidden rounded-full ${s.barTrack}`}>
                    <span
                      className={`block h-full rounded-full ${s.bar}`}
                      style={{ width: `${bar.pct}%` }}
                    />
                  </span>
                  <span className={`w-6 flex-none text-end text-[12px] tabular-nums ${s.meta}`}>
                    {bar.count}
                  </span>
                </div>
              ))}
            </div>

            {canWrite ? (
              <div
                className={`flex flex-none flex-col items-center gap-1.5 ${
                  editorial ? '' : 'sm:items-end'
                }`}
              >
                {writeButton(t('product.writeReview'), () => setShowForm(true))}
                <span className={`text-[11px] font-medium ${s.accent}`}>
                  {t('product.reviewBonusHint', { points: '50' })}
                </span>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}

      {/* ── Form ────────────────────────────────────────────────────────── */}
      {(showForm || editingReview) && user && (
        <form onSubmit={handleSubmit} className={`mt-7 ${s.formPanel}`}>
          <h3 className={editorial ? 'cera-serif text-[22px]' : 'text-base font-semibold md:text-lg'}>
            {editingReview ? t('product.editReview') : t('product.writeReview')}
          </h3>

          <div className="mt-5">
            <label className={`block text-sm font-medium ${s.meta}`}>{t('product.rating')} *</label>
            <div
              className="mt-1 flex"
              onMouseLeave={() => setHoverRating(0)}
            >
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFormData({ ...formData, rating: star })}
                  onMouseEnter={() => setHoverRating(star)}
                  onFocus={() => setHoverRating(star)}
                  onBlur={() => setHoverRating(0)}
                  className="flex min-h-[44px] min-w-[44px] items-center justify-center focus:outline-none touch-manipulation"
                  aria-label={`${t('product.rating')} ${star}`}
                  aria-pressed={formData.rating === star}
                >
                  <Star
                    className={`h-7 w-7 transition-transform md:h-8 md:w-8 ${
                      star <= (hoverRating || formData.rating)
                        ? `fill-current ${s.star} ${star === hoverRating ? 'scale-110' : ''}`
                        : s.starEmpty
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <label className={`block text-sm font-medium ${s.meta}`}>{t('product.reviewTitle')}</label>
            <input
              type="text"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              className={`mt-1.5 w-full px-4 py-2.5 text-base focus:outline-none ${s.input}`}
              placeholder={t('product.reviewTitlePlaceholder')}
              dir={dir}
            />
          </div>

          <div className="mt-4">
            <label className={`block text-sm font-medium ${s.meta}`}>{t('product.yourReview')} *</label>
            <textarea
              value={formData.comment}
              onChange={e => setFormData({ ...formData, comment: e.target.value })}
              rows={5}
              className={`mt-1.5 w-full resize-y px-4 py-2.5 text-base focus:outline-none ${s.input}`}
              placeholder={t('product.yourReviewPlaceholder')}
              required
              minLength={10}
              dir={dir}
            />
            <p className={`mt-1.5 text-sm ${s.meta}`}>
              {t('product.minimumCharacters')} ({formData.comment.length}/10)
            </p>
          </div>

          <div className="mt-5 flex flex-col gap-2 sm:flex-row">
            <button
              type="submit"
              disabled={submitting || formData.comment.trim().length < 10}
              className={`inline-flex min-h-[44px] flex-1 items-center justify-center rounded-full px-6 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none touch-manipulation ${s.cta}`}
            >
              {submitting
                ? t('product.submitting')
                : editingReview
                  ? t('product.updateReview')
                  : t('product.submitReview')}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false)
                setEditingReview(null)
                setFormData({ rating: 5, title: '', comment: '' })
              }}
              className={`inline-flex min-h-[44px] flex-1 items-center justify-center rounded-full px-6 text-sm font-semibold transition-colors sm:flex-none touch-manipulation ${s.ctaGhost}`}
            >
              {t('product.cancel')}
            </button>
          </div>
        </form>
      )}

      {/* ── Loading skeleton ────────────────────────────────────────────── */}
      {loading ? (
        <div className="mt-7 space-y-3" aria-live="polite" aria-busy="true">
          <span className="sr-only">{t('product.loadingReviews')}</span>
          {[0, 1].map(i => (
            <div key={i} className={`${s.panel} animate-pulse`}>
              <div className={`h-3 w-32 rounded-full ${s.skeleton}`} />
              <div className={`mt-3 h-3 w-full rounded-full ${s.skeleton}`} />
              <div className={`mt-2 h-3 w-4/5 rounded-full ${s.skeleton}`} />
            </div>
          ))}
        </div>
      ) : null}

      {/* ── Empty state ─────────────────────────────────────────────────── */}
      {!loading && reviews.length === 0 && !showForm && (
        <div
          className={`mt-7 text-center ${s.panel} ${
            editorial ? 'mx-auto max-w-[560px] lg:p-10' : 'py-10'
          }`}
        >
          {/* Deliberately not five grey stars: an empty rating row reads as a
              zero score on a product that simply has not been reviewed yet. */}
          <span
            className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full ${s.avatar}`}
            aria-hidden="true"
          >
            <PenLine className="h-5 w-5" />
          </span>
          <p className={`mt-4 ${editorial ? 'cera-serif text-[22px] sm:text-[26px]' : 'font-semibold text-[var(--color-text-primary)]'}`}>
            {t('product.noReviewsYet')}
          </p>
          <p className={`mx-auto mt-2 max-w-[42ch] text-sm ${s.meta}`}>{t('product.beFirstToReview')}</p>
          <div className="mt-5">
            {user
              ? writeButton(t('product.writeReview'), () => setShowForm(true))
              : writeButton(t('product.loginToReview'), undefined, getLocalizedPath('/login', locale))}
          </div>
          <p className={`mt-3 text-xs font-medium ${s.accent}`}>
            {t('product.reviewBonusHint', { points: '50' })}
          </p>
        </div>
      )}

      {/* ── List ────────────────────────────────────────────────────────── */}
      {!loading && reviews.length > 0 ? (
        <>
          <div className={`mt-6 ${editorial ? 'space-y-4' : 'space-y-4 md:space-y-6'}`}>
            {reviews.map(review => {
              const mine = user?.id === review.userId
              return (
                <article key={review.id} className={s.card}>
                  <div className="flex items-start gap-3">
                    {/* Initial instead of a stock avatar: real identity, no
                        placeholder face, and it reads at any size. */}
                    <span
                      className={`flex h-10 w-10 flex-none items-center justify-center rounded-full text-sm font-semibold uppercase ${s.avatar}`}
                      aria-hidden="true"
                    >
                      {review.userName?.trim().charAt(0) || '?'}
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                        <span className={s.name}>{review.userName}</span>
                        {stars(review.rating, 'h-3.5 w-3.5')}
                        <span className={`text-xs ${s.meta}`}>{formatDate(review.createdAt)}</span>
                      </div>
                      {review.title ? (
                        <h4 className={`mt-1.5 ${editorial ? 'cera-serif text-[18px]' : 'font-medium text-[var(--color-text-primary)]'}`}>
                          {review.title}
                        </h4>
                      ) : null}
                      <p className={`mt-1.5 break-words text-[15px] leading-relaxed ${s.body}`}>
                        {review.comment}
                      </p>
                    </div>

                    {mine ? (
                      <div className="flex flex-none gap-1">
                        <button
                          onClick={() => {
                            setEditingReview(review)
                            setFormData({
                              rating: review.rating,
                              title: review.title || '',
                              comment: review.comment,
                            })
                            setShowForm(true)
                            setConfirmingDelete(null)
                          }}
                          className={`flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full ${s.iconBtn} touch-manipulation`}
                          title={t('product.editReviewButton')}
                          aria-label={t('product.editReviewButton')}
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setConfirmingDelete(review.id)}
                          className={`flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full ${s.iconBtn} hover:!text-red-600 touch-manipulation`}
                          title={t('product.deleteReviewButton')}
                          aria-label={t('product.deleteReviewButton')}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ) : null}
                  </div>

                  {/* Confirmation lives in the card rather than in a browser
                      dialog, so the shopper can still see what they are about
                      to delete. */}
                  {confirmingDelete === review.id ? (
                    <div
                      className="mt-4 flex flex-wrap items-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-3.5 text-sm text-red-700"
                    >
                      <span className="min-w-0 flex-1">{t('product.confirmDeleteReview')}</span>
                      <button
                        type="button"
                        onClick={() => handleDelete(review.id)}
                        className="inline-flex min-h-[40px] items-center rounded-full bg-red-600 px-4 text-xs font-semibold text-white hover:bg-red-700"
                      >
                        {t('product.confirmDelete')}
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmingDelete(null)}
                        className="inline-flex min-h-[40px] items-center rounded-full border border-red-200 bg-white px-4 text-xs font-semibold text-red-700 hover:bg-red-100"
                      >
                        {t('product.cancel')}
                      </button>
                    </div>
                  ) : null}
                </article>
              )
            })}
          </div>

          {/* Older reviews were unreachable before: the endpoint pages at 10 and
              nothing ever asked for page two. */}
          {hasMore ? (
            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => loadReviews(reviews.length)}
                disabled={loadingMore}
                className={`inline-flex min-h-[44px] items-center justify-center rounded-full px-6 text-sm font-semibold transition-colors disabled:opacity-50 ${s.ctaGhost}`}
              >
                {loadingMore ? t('product.loadingReviews') : t('product.showMoreReviews')}
              </button>
            </div>
          ) : null}

          {/* Writing is offered under the list too, so a shopper who has just
              read every review does not have to scroll back up to act on it. */}
          {canWrite || canInvite ? (
            <div className="mt-8 text-center">
              {canWrite
                ? writeButton(t('product.writeReview'), () => setShowForm(true))
                : writeButton(
                    t('product.loginToReview'),
                    undefined,
                    getLocalizedPath('/login', locale)
                  )}
              <p className={`mt-2 text-xs font-medium ${s.accent}`}>
                {t('product.reviewBonusHint', { points: '50' })}
              </p>
            </div>
          ) : null}
        </>
      ) : null}
    </div>
  )
}
