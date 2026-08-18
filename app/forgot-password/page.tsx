'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react'
import { fetchCsrfToken, getCsrfHeaders, addCsrfToBody } from '@/lib/csrfClient'
import { errorLog } from '@/lib/logger'
import BreadcrumbSchema from '@/components/schema/BreadcrumbSchema'
import PageBreadcrumb from '@/components/PageBreadcrumb'
import { useTranslation } from '@/hooks/useTranslation'
import { getLocalizedPath } from '@/lib/i18n'
import { ceraSerif } from '@/components/product/cerabarrier/ceraFont'
import '@/components/product/cerabarrier/cerabarrier.css'
import '@/components/editorial/editorial.css'

// `.ed-field` sets its horizontal padding in a shorthand that outranks a Tailwind pl-*
// utility, so the leading icon needs the flanked variant rather than extra padding.
// The 16px override is what stops iOS zooming the page on focus.
const FIELD = 'ed-field ed-field--flanked !text-[16px]'

export default function ForgotPasswordClient() {
  const { t, locale, dir } = useTranslation()
  const isRTL = dir === 'rtl'
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      await fetchCsrfToken()

      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getCsrfHeaders() as Record<string, string>
        },
        body: JSON.stringify(addCsrfToBody({ email: email.toLowerCase().trim() }))
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send reset email')
      }

      setSuccess(true)
    } catch (err) {
      errorLog('Forgot password error:', err)
      setError(err instanceof Error ? err.message : t('errors.genericError'))
    } finally {
      setLoading(false)
    }
  }

  const crumbs = [
    { name: t('common.home'), href: getLocalizedPath('/', locale) },
    { name: t('common.login'), href: getLocalizedPath('/login', locale) },
    { name: t('auth.forgotPassword') },
  ]

  const schema = (
    <BreadcrumbSchema
      items={[
        { name: t('common.home'), url: getLocalizedPath('/', locale) },
        { name: t('common.login'), url: getLocalizedPath('/login', locale) },
        { name: t('auth.forgotPassword'), url: getLocalizedPath('/forgot-password', locale) }
      ]}
    />
  )

  const shell = (children: React.ReactNode) => (
    <div className={`cera-page genosys-page ${ceraSerif.variable} flex min-h-[100dvh] flex-col`} dir={dir}>
      {schema}
      <div className="hidden md:block">
        <PageBreadcrumb items={crumbs} />
      </div>
      <div className="flex flex-1 items-center justify-center px-4 py-10 sm:px-6 md:py-16">
        <div className="w-full max-w-[440px]">
          <div className="rounded-[28px] border border-[var(--cera-line)] bg-white p-7 shadow-[0_24px_60px_-40px_rgba(23,20,15,0.45)] md:p-9">
            {children}
          </div>
        </div>
      </div>
    </div>
  )

  if (success) {
    return shell(
      <div className="text-center">
        {/* Green is kept here on purpose: it is the success state, not brand accent. */}
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-green-200 bg-green-50 text-green-700">
          <CheckCircle2 className="h-7 w-7" aria-hidden="true" />
        </span>
        <h1 className="cera-serif mt-6 text-[26px] leading-tight text-[var(--cera-ink)] md:text-[30px]">
          {t('auth.checkYourEmail') || 'Check Your Email'}
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-[var(--cera-body)]">
          {t('auth.resetLinkSent') || 'A password reset link has been sent to'}
        </p>
        <p dir="ltr" className="mt-1 text-[15px] font-semibold text-[var(--cera-ink)]">{email}</p>
        <p className="mt-4 text-[13.5px] leading-relaxed text-[var(--cera-muted)]">
          {t('auth.linkExpiresIn') || 'The password reset link will expire in 30 minutes.'}
        </p>
        <Link
          href={getLocalizedPath('/login', locale)}
          className="ed-cta mt-7 w-full py-3.5 text-[15px]"
        >
          {t('auth.backToLogin') || 'Back to Login'}
        </Link>
      </div>
    )
  }

  return shell(
    <>
      <div className="text-center">
        <span className="ed-mark ed-mark--round ed-mark--tactile mx-auto flex h-14 w-14 items-center justify-center text-[var(--cera-rose-ink)]">
          <Mail className="h-6 w-6" aria-hidden="true" />
        </span>
        <p className="cera-eyebrow mt-5">{t('profile.myAccount')}</p>
        <h1 className="cera-serif mt-2 text-[26px] leading-tight text-[var(--cera-ink)] md:text-[30px]">
          {t('auth.forgotPassword') || 'Forgot Password?'}
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-[var(--cera-body)]">
          {t('auth.forgotPasswordDescription') || "Enter your email address and we'll send you a link to reset your password."}
        </p>
      </div>

      {error && (
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4">
          <p className="text-sm leading-relaxed text-red-700">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-7 space-y-5">
        <div>
          <label htmlFor="email" className="ed-label">
            {t('auth.emailAddress') || 'Email Address'}
          </label>
          <div className="relative">
            <div className={`pointer-events-none absolute inset-y-0 flex items-center ${isRTL ? 'right-0 pr-3.5' : 'left-0 pl-3.5'}`}>
              <Mail className="h-[18px] w-[18px] text-[var(--cera-muted)]" aria-hidden="true" />
            </div>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={FIELD}
              placeholder={t('auth.emailPlaceholder') || 'your.email@example.com'}
              disabled={loading}
              dir="ltr"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`ed-cta w-full py-3.5 text-[15px] disabled:opacity-50 ${isRTL ? 'flex-row-reverse' : ''}`}
        >
          {loading ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" aria-hidden="true" />
              {t('common.sending') || 'Sending...'}
            </>
          ) : (
            t('auth.sendResetLink') || 'Send Reset Link'
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
