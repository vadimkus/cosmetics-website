'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { fetchCsrfToken, getCsrfHeaders, addCsrfToBody } from '@/lib/csrfClient'
import { errorLog } from '@/lib/logger'
import BreadcrumbSchema from '@/components/schema/BreadcrumbSchema'
import { useTranslation } from '@/hooks/useTranslation'
import { getLocalizedPath } from '@/lib/i18n'

export default function ResetPasswordClient() {
  const { t, locale } = useTranslation()
  const params = useParams()
  const router = useRouter()
  const token = params?.token as string | undefined
  
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [verifying, setVerifying] = useState(true)
  const [tokenValid, setTokenValid] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [passwordStrength, setPasswordStrength] = useState<{
    score: number
    feedback: string
  }>({ score: 0, feedback: '' })

  // Verify token on mount
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setError('Invalid reset link')
        setVerifying(false)
        return
      }

      try {
        const response = await fetch(`/api/auth/reset-password/${token}`)
        const data = await response.json()

        if (data.valid) {
          setTokenValid(true)
        } else {
          // Show the actual error message from the API
          setError(data.error || 'Invalid or expired token')
        }
      } catch (err) {
        errorLog('Token verification error:', err)
        // Show more specific error message
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
    else feedback = 'At least 8 characters'

    if (/[a-z]/.test(newPassword)) score++
    if (/[A-Z]/.test(newPassword)) score++
    if (/[0-9]/.test(newPassword)) score++
    if (/[^a-zA-Z0-9]/.test(newPassword)) score++

    if (score === 0) feedback = 'At least 8 characters'
    else if (score <= 2) feedback = 'Weak password'
    else if (score <= 3) feedback = 'Fair password'
    else if (score <= 4) feedback = 'Good password'
    else feedback = 'Strong password'

    setPasswordStrength({ score, feedback })
  }, [newPassword])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validation
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)

    try {
      // Fetch CSRF token
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
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push('/login')
      }, 3000)
    } catch (err) {
      errorLog('Reset password error:', err)
      setError(err instanceof Error ? err.message : 'An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (verifying) {
    return (
      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8">
            <div className="text-center">
              <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Verifying Reset Link...</h2>
              <p className="text-gray-600">Please wait while we verify your password reset link.</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!tokenValid) {
    return (
      <div className="container mx-auto px-4 py-8 md:py-16">
        <BreadcrumbSchema 
          items={[
            { name: t('common.home'), url: getLocalizedPath('/', locale) },
            { name: t('common.login'), url: getLocalizedPath('/login', locale) },
            { name: t('auth.resetPassword'), url: getLocalizedPath(`/reset-password/${token || ''}`, locale) }
          ]}
        />
        {/* Navigation Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm md:text-base text-gray-600 mb-8" aria-label="Breadcrumb">
          <Link
            href="/"
            className="hover:text-primary-600 transition-colors flex items-center"
          >
            Home
          </Link>
          <span className="flex items-center">/</span>
          <Link
            href="/login"
            className="hover:text-primary-600 transition-colors flex items-center"
          >
            Login
          </Link>
          <span className="flex items-center">/</span>
          <span className="text-gray-900 font-medium flex items-center">
            Reset Password
          </span>
        </nav>

        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-lg shadow-lg border border-red-200 p-8">
            <div className="text-center">
              <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Invalid Reset Link</h2>
              <p className="text-gray-600 mb-6">
                {error || 'This password reset link is invalid or has expired.'}
              </p>
              <p className="text-sm text-gray-500 mb-6">
                Password reset links expire after 30 minutes. Please request a new one.
              </p>
              <div className="space-y-3">
                <Link
                  href="/forgot-password"
                  className="block w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-primary-700 transition-colors text-center"
                >
                  Request New Reset Link
                </Link>
                <Link
                  href="/login"
                  className="block w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-200 transition-colors text-center"
                >
                  Back to Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="container mx-auto px-4 py-8 md:py-16">
        <BreadcrumbSchema 
          items={[
            { name: t('common.home'), url: getLocalizedPath('/', locale) },
            { name: t('common.login'), url: getLocalizedPath('/login', locale) },
            { name: t('auth.resetPassword'), url: getLocalizedPath(`/reset-password/${token || ''}`, locale) }
          ]}
        />
        {/* Navigation Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm md:text-base text-gray-600 mb-8" aria-label="Breadcrumb">
          <Link
            href="/"
            className="hover:text-primary-600 transition-colors flex items-center"
          >
            Home
          </Link>
          <span className="flex items-center">/</span>
          <Link
            href="/login"
            className="hover:text-primary-600 transition-colors flex items-center"
          >
            Login
          </Link>
          <span className="flex items-center">/</span>
          <span className="text-gray-900 font-medium flex items-center">
            Reset Password
          </span>
        </nav>

        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-lg shadow-lg border border-green-200 p-8">
            <div className="text-center">
              <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Password Reset Successful!</h2>
              <p className="text-gray-600 mb-6">
                Your password has been reset successfully. You can now log in with your new password.
              </p>
              <p className="text-sm text-gray-500 mb-6">
                Redirecting to login page...
              </p>
              <Link
                href="/login"
                className="block w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-primary-700 transition-colors text-center"
              >
                Go to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      <BreadcrumbSchema 
        items={[
          { name: 'Home', url: '/' },
          { name: 'Login', url: '/login' },
          { name: 'Reset Password', url: `/reset-password/${token || ''}` }
        ]}
      />
      {/* Navigation Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm md:text-base text-gray-600 mb-8" aria-label="Breadcrumb">
        <Link
          href="/"
          className="hover:text-primary-600 transition-colors flex items-center"
        >
          Home
        </Link>
        <span className="flex items-center">/</span>
        <Link
          href="/login"
          className="hover:text-primary-600 transition-colors flex items-center"
        >
          Login
        </Link>
        <span className="flex items-center">/</span>
        <span className="text-gray-900 font-medium flex items-center">
          Reset Password
        </span>
      </nav>

      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8">
          <div className="text-center mb-8">
            <div className="h-16 w-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="h-8 w-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Secret Page</h2>
            <p className="text-gray-600">
              Enter your new password below
            </p>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={8}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="At least 8 characters"
                disabled={loading}
              />
              {newPassword && (
                <div className="mt-2">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          passwordStrength.score <= 2
                            ? 'bg-red-500'
                            : passwordStrength.score <= 3
                            ? 'bg-yellow-500'
                            : 'bg-green-500'
                        }`}
                        style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-600">{passwordStrength.feedback}</span>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={8}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Confirm your new password"
                disabled={loading}
              />
              {confirmPassword && newPassword !== confirmPassword && (
                <p className="mt-1 text-sm text-red-600">Passwords do not match</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || newPassword.length < 8 || newPassword !== confirmPassword}
              className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Resetting Password...' : 'Reset Password'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/login"
              className="text-primary-600 hover:text-primary-700 font-medium text-sm"
            >
              ← Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

