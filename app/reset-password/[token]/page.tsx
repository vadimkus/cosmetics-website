'use client'

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Lock, ArrowLeft, CheckCircle2, XCircle, Eye, EyeOff, KeyRound } from 'lucide-react'
import { fetchCsrfToken, getCsrfHeaders, addCsrfToBody } from '@/lib/csrfClient'
import { errorLog } from '@/lib/logger'
import BreadcrumbSchema from '@/components/schema/BreadcrumbSchema'
import PageBreadcrumb from '@/components/PageBreadcrumb'
import { useTranslation } from '@/hooks/useTranslation'
import { getLocalizedPath } from '@/lib/i18n'
import '@/components/product/cerabarrier/cerabarrier.css'
import '@/components/editorial/editorial.css'

// Both password fields carry a lock on one flank and the reveal toggle on the other, which
// is what `.ed-field--flanked` exists for: the base class sets horizontal padding in a
// shorthand that outranks a Tailwind pl-*. The 16px override stops iOS zooming on focus.
const FIELD = 'ed-field ed-field--flanked !text-[16px]'

export default function ResetPasswordClient() {
  const { t, locale, dir } = useTranslation()
  const params = useParams()
  const router = useRouter()
  const token = params?.token as string | undefined
  const isRTL = dir === 'rtl'

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [verifying, setVerifying] = useState(true)
  const [tokenValid, setTokenValid] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const redirectTimerRef = useRef<NodeJS.Timeout | null>(null)
  const [passwordStrength, setPasswordStrength] = useState<{
    score: number
    feedback: string
  }>({ score: 0, feedback: '' })

  // Clean up redirect timer on unmount
  useEffect(() => () => { if (redirectTimerRef.current) clearTimeout(redirectTimerRef.current) }, [])

  // Verify token on mount
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setError(t('errors.invalidResetLink'))
        setVerifying(false)
        return
      }

      try {
        const response = await fetch(`/api/auth/reset-password/${token}`)
        const data = await response.json()

        if (data.valid) {
          setTokenValid(true)
        } else {
          setError(data.error || t('errors.invalidOrExpiredToken'))
        }
      } catch (err) {
        errorLog('Token verification error:', err)
        const errorMessage = err instanceof Error ? err.message : 'Failed to verify reset link'
        setError(`Failed to verify reset link: ${errorMessage}`)
      } finally {
        setVerifying(false)
      }
    }

    verifyToken()
  }, [token])

  // Check password strength
  useEffect(() => {
    if (newPassword.length === 0) {
      setPasswordStrength({ score: 0, feedback: '' })
      return
    }

    let score = 0
    let feedback = ''

    if (newPassword.length >= 8) score++
    else feedback = t('auth.minCharacters') || 'At least 8 characters'

    if (/[a-z]/.test(newPassword)) score++
    if (/[A-Z]/.test(newPassword)) score++
    if (/[0-9]/.test(newPassword)) score++
    if (/[^a-zA-Z0-9]/.test(newPassword)) score++

    if (score === 0) feedback = t('auth.minCharacters') || 'At least 8 characters'
    else if (score <= 2) feedback = t('auth.weakPassword') || 'Weak password'
    else if (score <= 3) feedback = t('auth.fairPassword') || 'Fair password'
    else if (score <= 4) feedback = t('auth.goodPassword') || 'Good password'
    else feedback = t('auth.strongPassword') || 'Strong password'

    setPasswordStrength({ score, feedback })
  }, [newPassword, t])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (newPassword.length < 8) {
      setError(t('auth.passwordMinLength') || 'Password must be at least 8 characters long')
      return
    }

    if (newPassword !== confirmPassword) {
      setError(t('auth.passwordsDoNotMatch') || 'Passwords do not match')
      return
    }

    setLoading(true)

    try {
      await fetchCsrfToken()

      const response = await fetch(`/api/auth/reset-password/${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getCsrfHeaders() as Record<string, string>
        },
        body: JSON.stringify(addCsrfToBody({ newPassword }))
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to reset password')
      }

      setSuccess(true)

      redirectTimerRef.current = setTimeout(() => {
        router.push(getLocalizedPath('/login', locale))
      }, 3000)
    } catch (err) {
      errorLog('Reset password error:', err)
      setError(err instanceof Error ? err.message : t('errors.genericError'))
    } finally {
      setLoading(false)
    }
  }

  const crumbs = [
    { name: t('common.home'), href: getLocalizedPath('/', locale) },
    { name: t('common.login'), href: getLocalizedPath('/login', locale) },
    { name: t('auth.resetPassword') },
  ]

  // All four states share the same centred card, so the chrome lives here once.
  const shell = (children: React.ReactNode, { withCrumbs = true } = {}) => (
    <div className={`cera-page genosys-page flex min-h-[100dvh] flex-col`} dir={dir}>
      {withCrumbs && (
        <>
          <BreadcrumbSchema
            items={[
              { name: t('common.home'), url: getLocalizedPath('/', locale) },
              { name: t('common.login'), url: getLocalizedPath('/login', locale) },
              { name: t('auth.resetPassword'), url: getLocalizedPath(`/reset-password/${token || ''}`, locale) }
            ]}
          />
          <div className="hidden md:block">
            <PageBreadcrumb items={crumbs} />
          </div>
        </>
      )}
      <div className="flex flex-1 items-center justify-center px-4 py-10 sm:px-6 md:py-16">
        <div className="w-full max-w-[440px]">
          <div className="rounded-[28px] border border-[var(--cera-line)] bg-white p-7 shadow-[0_24px_60px_-40px_rgba(23,20,15,0.45)] md:p-9">
            {children}
          </div>
        </div>
      </div>
    </div>
  )

  if (verifying) {
    return shell(
      <div className="text-center">
        <span className="mx-auto flex h-14 w-14 animate-pulse items-center justify-center rounded-full border border-[var(--cera-line)] bg-[var(--cera-cream-deep)] text-[var(--cera-muted)]">
          <Lock className="h-6 w-6" aria-hidden="true" />
        </span>
        <h1 className="cera-serif mt-6 text-[26px] leading-tight text-[var(--cera-ink)] md:text-[30px]">
          {t('auth.verifyingLink') || 'Verifying Reset Link...'}
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-[var(--cera-body)]">
          {t('auth.pleaseWait') || 'Please wait while we verify your password reset link.'}
        </p>
      </div>,
      { withCrumbs: false }
    )
  }

  if (!tokenValid) {
    return shell(
      <div className="text-center">
        {/* Red stays: this is a failure state, not brand accent. */}
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-red-200 bg-red-50 text-red-600">
          <XCircle className="h-7 w-7" aria-hidden="true" />
        </span>
        <h1 className="cera-serif mt-6 text-[26px] leading-tight text-[var(--cera-ink)] md:text-[30px]">
          {t('auth.invalidResetLink') || 'Invalid Reset Link'}
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-[var(--cera-body)]">
          {error || t('auth.linkExpiredMessage') || 'This password reset link is invalid or has expired.'}
        </p>
        <p className="mt-3 text-[14px] leading-relaxed text-[var(--cera-muted)]">
          {t('auth.linksExpireIn30') || 'Password reset links expire after 30 minutes. Please request a new one.'}
        </p>
        <div className="mt-7 space-y-3">
          <Link href={getLocalizedPath('/forgot-password', locale)} className="ed-cta w-full py-3.5 text-[15px]">
            {t('auth.requestNewLink') || 'Request New Reset Link'}
          </Link>
          <Link href={getLocalizedPath('/login', locale)} className="ed-ghost w-full py-3.5 text-[15px]">
            {t('auth.backToLogin') || 'Back to Login'}
          </Link>
        </div>
      </div>
    )
  }

  if (success) {
    return shell(
      <div className="text-center">
        {/* Green stays: success state. */}
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-green-200 bg-green-50 text-green-700">
          <CheckCircle2 className="h-7 w-7" aria-hidden="true" />
        </span>
        <h1 className="cera-serif mt-6 text-[26px] leading-tight text-[var(--cera-ink)] md:text-[30px]">
          {t('auth.passwordResetSuccess') || 'Password Reset Successful!'}
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-[var(--cera-body)]">
          {t('auth.canNowLogin') || 'Your password has been reset successfully. You can now log in with your new password.'}
        </p>
        <p className="mt-3 text-[14px] leading-relaxed text-[var(--cera-muted)]">
          {t('auth.redirectingToLogin') || 'Redirecting to login page...'}
        </p>
        <Link href={getLocalizedPath('/login', locale)} className="ed-cta mt-7 w-full py-3.5 text-[15px]">
          {t('auth.goToLogin') || 'Go to Login'}
        </Link>
      </div>
    )
  }

  const strengthBar =
    passwordStrength.score <= 2 ? 'bg-red-500' : passwordStrength.score <= 3 ? 'bg-yellow-500' : 'bg-green-500'
  const strengthText =
    passwordStrength.score <= 2 ? 'text-red-600' : passwordStrength.score <= 3 ? 'text-yellow-700' : 'text-green-700'

  return shell(
    <>
      <div className="text-center">
        <span className="ed-mark ed-mark--round ed-mark--tactile mx-auto flex h-14 w-14 items-center justify-center text-[var(--cera-rose-ink)]">
          <KeyRound className="h-6 w-6" aria-hidden="true" />
        </span>
        <p className="cera-eyebrow mt-5">{t('profile.myAccount')}</p>
        <h1 className="cera-serif mt-2 text-[26px] leading-tight text-[var(--cera-ink)] md:text-[30px]">
          {t('auth.createNewPassword') || 'Create New Password'}
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-[var(--cera-body)]">
          {t('auth.enterNewPasswordBelow') || 'Enter your new password below'}
        </p>
      </div>

      {error && (
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4">
          <p className="text-sm leading-relaxed text-red-700">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-7 space-y-5">
        <div>
          <label htmlFor="newPassword" className="ed-label">
            {t('auth.newPassword') || 'New Password'}
          </label>
          <div className="relative">
            <div className={`pointer-events-none absolute inset-y-0 flex items-center ${isRTL ? 'right-0 pr-3.5' : 'left-0 pl-3.5'}`}>
              <Lock className="h-[18px] w-[18px] text-[var(--cera-muted)]" aria-hidden="true" />
            </div>
            <input
              id="newPassword"
              type={showPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={8}
              className={FIELD}
              placeholder={t('auth.minCharactersPlaceholder') || 'At least 8 characters'}
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? t('login.hidePassword') || 'Hide password' : t('login.showPassword') || 'Show password'}
              className={`absolute inset-y-0 flex items-center text-[var(--cera-muted)] transition-colors hover:text-[var(--cera-ink)] ${isRTL ? 'left-0 pl-3.5' : 'right-0 pr-3.5'}`}
            >
              {showPassword ? <EyeOff className="h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}
            </button>
          </div>
          {newPassword && (
            <div className={`mt-2.5 flex items-center gap-2.5 ${isRTL ? 'flex-row-reverse' : ''}`}>
              {/* The strength scale keeps its own red / amber / green: it grades the
                  password rather than decorating the page. */}
              <div className="h-1.5 flex-1 rounded-full bg-[var(--cera-cream-deep)]">
                <div
                  className={`h-1.5 rounded-full transition-all ${strengthBar}`}
                  style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                />
              </div>
              <span className={`text-xs font-medium ${strengthText}`}>{passwordStrength.feedback}</span>
            </div>
          )}
        </div>

        <div>
          <label htmlFor="confirmPassword" className="ed-label">
            {t('auth.confirmPassword') || 'Confirm Password'}
          </label>
          <div className="relative">
            <div className={`pointer-events-none absolute inset-y-0 flex items-center ${isRTL ? 'right-0 pr-3.5' : 'left-0 pl-3.5'}`}>
              <Lock className="h-[18px] w-[18px] text-[var(--cera-muted)]" aria-hidden="true" />
            </div>
            <input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={8}
              className={FIELD}
              placeholder={t('auth.confirmPasswordPlaceholder') || 'Confirm your new password'}
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              aria-label={showConfirmPassword ? t('login.hidePassword') || 'Hide password' : t('login.showPassword') || 'Show password'}
              className={`absolute inset-y-0 flex items-center text-[var(--cera-muted)] transition-colors hover:text-[var(--cera-ink)] ${isRTL ? 'left-0 pl-3.5' : 'right-0 pr-3.5'}`}
            >
              {showConfirmPassword ? <EyeOff className="h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}
            </button>
          </div>
          {confirmPassword && newPassword !== confirmPassword && (
            <p className="mt-2 text-sm text-red-600">{t('auth.passwordsDoNotMatch') || 'Passwords do not match'}</p>
          )}
          {confirmPassword && newPassword === confirmPassword && confirmPassword.length >= 8 && (
            <p className={`mt-2 flex items-center gap-1.5 text-sm text-green-700 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
              {t('auth.passwordsMatch') || 'Passwords match'}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || newPassword.length < 8 || newPassword !== confirmPassword}
          className={`ed-cta w-full py-3.5 text-[15px] disabled:opacity-50 ${isRTL ? 'flex-row-reverse' : ''}`}
        >
          {loading ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" aria-hidden="true" />
              {t('auth.resettingPassword') || 'Resetting Password...'}
            </>
          ) : (
            t('auth.resetPassword') || 'Reset Password'
          )}
        </button>
      </form>

      <div className="mt-7 text-center">
        <Link
          href={getLocalizedPath('/login', locale)}
          className={`inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--cera-rose-ink)] transition-colors hover:text-[var(--cera-rose)] ${isRTL ? 'flex-row-reverse' : ''}`}
        >
          <ArrowLeft className={`h-4 w-4 ${isRTL ? 'rotate-180' : ''}`} aria-hidden="true" />
          {t('auth.backToLogin') || 'Back to Login'}
        </Link>
      </div>
    </>
  )
}
