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

export default function ResetPasswordClient() {
  const { t, locale, dir } = useTranslation()
  const params = useParams()
  const router = useRouter()
  const token = params?.token as string | undefined
  
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

  // Verifying state
  if (verifying) {
    return (
      <div className="min-h-[100dvh] bg-gray-50 flex flex-col items-center justify-center px-4" dir={dir}>
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-5 animate-pulse">
                <Lock className="w-8 h-8 text-gray-400" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-3">
                {t('auth.verifyingLink') || 'Verifying Reset Link...'}
              </h1>
              <p className="text-gray-600">
                {t('auth.pleaseWait') || 'Please wait while we verify your password reset link.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Invalid token state
  if (!tokenValid) {
    return (
      <div className="min-h-[100dvh] bg-gray-50 flex flex-col" dir={dir}>
        <BreadcrumbSchema 
          items={[
            { name: t('common.home'), url: getLocalizedPath('/', locale) },
            { name: t('common.login'), url: getLocalizedPath('/login', locale) },
            { name: t('auth.resetPassword'), url: getLocalizedPath(`/reset-password/${token || ''}`, locale) }
          ]}
        />
        
        <div className="hidden md:block">
          <PageBreadcrumb
            items={[
              { name: t('common.home'), href: getLocalizedPath('/', locale) },
              { name: t('common.login'), href: getLocalizedPath('/login', locale) },
              { name: t('auth.resetPassword') },
            ]}
          />
        </div>

        <div className="flex-1 flex items-center justify-center px-4 py-8">
          <div className="w-full max-w-md">
            <div className="bg-white rounded-2xl shadow-sm border border-red-100 p-6 md:p-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-5">
                  <XCircle className="w-8 h-8 text-red-600" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-3">
                  {t('auth.invalidResetLink') || 'Invalid Reset Link'}
                </h1>
                <p className="text-gray-600 mb-2">
                  {error || t('auth.linkExpiredMessage') || 'This password reset link is invalid or has expired.'}
                </p>
                <p className="text-sm text-gray-500 mb-6">
                  {t('auth.linksExpireIn30') || 'Password reset links expire after 30 minutes. Please request a new one.'}
                </p>
                <div className="space-y-3">
                  <Link
                    href={getLocalizedPath('/forgot-password', locale)}
                    className="block w-full bg-primary-600 text-white py-3.5 px-4 rounded-xl font-semibold hover:bg-primary-700 transition-colors text-center"
                  >
                    {t('auth.requestNewLink') || 'Request New Reset Link'}
                  </Link>
                  <Link
                    href={getLocalizedPath('/login', locale)}
                    className="block w-full bg-gray-100 text-gray-700 py-3.5 px-4 rounded-xl font-semibold hover:bg-gray-200 transition-colors text-center"
                  >
                    {t('auth.backToLogin') || 'Back to Login'}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Success state
  if (success) {
    return (
      <div className="min-h-[100dvh] bg-gray-50 flex flex-col" dir={dir}>
        <BreadcrumbSchema 
          items={[
            { name: t('common.home'), url: getLocalizedPath('/', locale) },
            { name: t('common.login'), url: getLocalizedPath('/login', locale) },
            { name: t('auth.resetPassword'), url: getLocalizedPath(`/reset-password/${token || ''}`, locale) }
          ]}
        />
        
        <div className="hidden md:block">
          <PageBreadcrumb
            items={[
              { name: t('common.home'), href: getLocalizedPath('/', locale) },
              { name: t('common.login'), href: getLocalizedPath('/login', locale) },
              { name: t('auth.resetPassword') },
            ]}
          />
        </div>

        <div className="flex-1 flex items-center justify-center px-4 py-8">
          <div className="w-full max-w-md">
            <div className="bg-white rounded-2xl shadow-sm border border-green-100 p-6 md:p-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-5">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-3">
                  {t('auth.passwordResetSuccess') || 'Password Reset Successful!'}
                </h1>
                <p className="text-gray-600 mb-2">
                  {t('auth.canNowLogin') || 'Your password has been reset successfully. You can now log in with your new password.'}
                </p>
                <p className="text-sm text-gray-500 mb-6">
                  {t('auth.redirectingToLogin') || 'Redirecting to login page...'}
                </p>
                <Link
                  href={getLocalizedPath('/login', locale)}
                  className="block w-full bg-primary-600 text-white py-3.5 px-4 rounded-xl font-semibold hover:bg-primary-700 transition-colors text-center"
                >
                  {t('auth.goToLogin') || 'Go to Login'}
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
          { name: t('auth.resetPassword'), url: getLocalizedPath(`/reset-password/${token || ''}`, locale) }
        ]}
      />
      
        <div className="hidden md:block">
          <PageBreadcrumb
            items={[
              { name: t('common.home'), href: getLocalizedPath('/', locale) },
              { name: t('common.login'), href: getLocalizedPath('/login', locale) },
              { name: t('auth.resetPassword') },
            ]}
          />
        </div>

      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
            {/* Header */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-50 rounded-full mb-5">
                <KeyRound className="w-8 h-8 text-primary-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {t('auth.createNewPassword') || 'Create New Password'}
              </h1>
              <p className="text-gray-600 text-sm">
                {t('auth.enterNewPasswordBelow') || 'Enter your new password below'}
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
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('auth.newPassword') || 'New Password'}
                </label>
                <div className="relative">
                  <div className={`absolute inset-y-0 ${dir === 'rtl' ? 'right-0 pr-3.5' : 'left-0 pl-3.5'} flex items-center pointer-events-none`}>
                    <Lock className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    id="newPassword"
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={8}
                    className={`w-full ${dir === 'rtl' ? 'pr-11 pl-11' : 'pl-11 pr-11'} py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white`}
                    placeholder={t('auth.minCharactersPlaceholder') || 'At least 8 characters'}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute inset-y-0 ${dir === 'rtl' ? 'left-0 pl-3.5' : 'right-0 pr-3.5'} flex items-center`}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                {newPassword && (
                  <div className="mt-2">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full transition-all ${
                            passwordStrength.score <= 2
                              ? 'bg-red-500'
                              : passwordStrength.score <= 3
                              ? 'bg-yellow-500'
                              : 'bg-green-500'
                          }`}
                          style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                        />
                      </div>
                      <span className={`text-xs ${
                        passwordStrength.score <= 2
                          ? 'text-red-600'
                          : passwordStrength.score <= 3
                          ? 'text-yellow-600'
                          : 'text-green-600'
                      }`}>{passwordStrength.feedback}</span>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('auth.confirmPassword') || 'Confirm Password'}
                </label>
                <div className="relative">
                  <div className={`absolute inset-y-0 ${dir === 'rtl' ? 'right-0 pr-3.5' : 'left-0 pl-3.5'} flex items-center pointer-events-none`}>
                    <Lock className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={8}
                    className={`w-full ${dir === 'rtl' ? 'pr-11 pl-11' : 'pl-11 pr-11'} py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-gray-50 focus:bg-white`}
                    placeholder={t('auth.confirmPasswordPlaceholder') || 'Confirm your new password'}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className={`absolute inset-y-0 ${dir === 'rtl' ? 'left-0 pl-3.5' : 'right-0 pr-3.5'} flex items-center`}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                {confirmPassword && newPassword !== confirmPassword && (
                  <p className="mt-1.5 text-sm text-red-600">{t('auth.passwordsDoNotMatch') || 'Passwords do not match'}</p>
                )}
                {confirmPassword && newPassword === confirmPassword && confirmPassword.length >= 8 && (
                  <p className="mt-1.5 text-sm text-green-600 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    {t('auth.passwordsMatch') || 'Passwords match'}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || newPassword.length < 8 || newPassword !== confirmPassword}
                className="w-full bg-primary-600 text-white py-3.5 px-4 rounded-xl font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {t('auth.resettingPassword') || 'Resetting Password...'}
                  </>
                ) : (
                  t('auth.resetPassword') || 'Reset Password'
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

