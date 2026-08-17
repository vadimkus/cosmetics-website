'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react'
import { fetchCsrfToken, getCsrfHeaders, addCsrfToBody } from '@/lib/csrfClient'
import { errorLog } from '@/lib/logger'
import BreadcrumbSchema from '@/components/schema/BreadcrumbSchema'
import PageBreadcrumb from '@/components/PageBreadcrumb'
import { useTranslation } from '@/hooks/useTranslation'
import { getLocalizedPath } from '@/lib/i18n'

export default function ForgotPasswordClient() {
  const { t, locale, dir } = useTranslation()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      // Fetch CSRF token
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

  // Success state - email sent
  if (success) {
    return (
      <div className="min-h-[100dvh] bg-gray-50 flex flex-col" dir={dir}>
        <BreadcrumbSchema 
          items={[
            { name: t('common.home'), url: getLocalizedPath('/', locale) },
            { name: t('common.login'), url: getLocalizedPath('/login', locale) },
            { name: t('auth.forgotPassword'), url: getLocalizedPath('/forgot-password', locale) }
          ]}
        />
        
        <div className="hidden md:block">
          <PageBreadcrumb
            items={[
              { name: t('common.home'), href: getLocalizedPath('/', locale) },
              { name: t('common.login'), href: getLocalizedPath('/login', locale) },
              { name: t('auth.forgotPassword') },
            ]}
          />
        </div>

        <div className="flex-1 flex items-center justify-center px-4 py-8">
          <div className="w-full max-w-md">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-5">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-3">
                  {t('auth.checkYourEmail') || 'Check Your Email'}
                </h1>
                <p className="text-gray-600 mb-2">
                  {t('auth.resetLinkSent') || 'A password reset link has been sent to'}
                </p>
                <p className="font-semibold text-gray-900 mb-4">{email}</p>
                <p className="text-sm text-gray-500 mb-6">
                  {t('auth.linkExpiresIn') || 'The password reset link will expire in 30 minutes.'}
                </p>
                <Link
                  href={getLocalizedPath('/login', locale)}
                  className="block w-full bg-primary-600 text-white py-3.5 px-4 rounded-xl font-semibold hover:bg-primary-700 transition-colors text-center"
                >
                  {t('auth.backToLogin') || 'Back to Login'}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Main form state
  return (
    <div className="min-h-[100dvh] bg-gray-50 flex flex-col" dir={dir}>
      <BreadcrumbSchema 
        items={[
          { name: t('common.home'), url: getLocalizedPath('/', locale) },
          { name: t('common.login'), url: getLocalizedPath('/login', locale) },
          { name: t('auth.forgotPassword'), url: getLocalizedPath('/forgot-password', locale) }
        ]}
      />
      
        <div className="hidden md:block">
          <PageBreadcrumb
            items={[
              { name: t('common.home'), href: getLocalizedPath('/', locale) },
              { name: t('common.login'), href: getLocalizedPath('/login', locale) },
              { name: t('auth.forgotPassword') },
            ]}
          />
        </div>

      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
            {/* Header */}
            <div className="text-center mb-6">
              <div className="flex items-center justify-center mx-auto mb-4">
                <Image
                  src="/images/Wrong/Wrong.png"
                  alt="Forgot Password"
                  width={80}
                  height={80}
                  className="object-contain"
                />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {t('auth.forgotPassword') || 'Forgot Password?'}
              </h1>
              <p className="text-gray-600 text-sm">
                {t('auth.forgotPasswordDescription') || "Enter your email address and we'll send you a link to reset your password."}
              </p>
            </div>

            {/* Error message */}
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-100 rounded-xl">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('auth.emailAddress') || 'Email Address'}
                </label>
                <div className="relative">
                  <div className={`absolute inset-y-0 ${dir === 'rtl' ? 'right-0 pr-3.5' : 'left-0 pl-3.5'} flex items-center pointer-events-none`}>
                    <Mail className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className={`w-full ${dir === 'rtl' ? 'pr-11 pl-4' : 'pl-11 pr-4'} py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white`}
                    placeholder={t('auth.emailPlaceholder') || 'your.email@example.com'}
                    disabled={loading}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-600 text-white py-3.5 px-4 rounded-xl font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {t('common.sending') || 'Sending...'}
                  </>
                ) : (
                  t('auth.sendResetLink') || 'Send Reset Link'
                )}
              </button>
            </form>

            {/* Back to login link */}
            <div className="mt-6 text-center">
              <Link
                href={getLocalizedPath('/login', locale)}
                className={`inline-flex items-center gap-1.5 text-primary-600 hover:text-primary-700 font-medium text-sm transition-colors ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}
              >
                <ArrowLeft className="w-4 h-4" />
                {t('auth.backToLogin') || 'Back to Login'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

