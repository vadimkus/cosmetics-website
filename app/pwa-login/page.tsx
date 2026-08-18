'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Eye, EyeOff, ChevronDown, Heart } from 'lucide-react'
import { useAuth } from '@/components/auth/AuthProvider'
import { useTranslation } from '@/hooks/useTranslation'
import { usePWAMode } from '@/hooks/usePWAMode'
import { getLocalizedPath } from '@/lib/i18n'
import { EMIRATES } from '@/lib/emirates'
import { safeSessionStorageRemoveItem } from '@/lib/browserStorage'
import EmailDomainSuggestion from '@/components/auth/EmailDomainSuggestion'
import {
  isEmailAddressSyntaxValid,
  normalizeEmailAddress,
  suggestEmailAddressCorrection,
} from '@/lib/emailAddressValidation'
import { ceraSerif } from '@/components/product/cerabarrier/ceraFont'
import '@/components/product/cerabarrier/cerabarrier.css'
import '@/components/editorial/editorial.css'

export default function PWALoginPage() {
  const router = useRouter()
  const { login, register, loginWithGoogle, loginWithApple, isLoading, user } = useAuth()
  const { t, locale, dir } = useTranslation()
  const { isPWA } = usePWAMode()
  const isRTL = dir === 'rtl'

  const [isLoginMode, setIsLoginMode] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [emirate, setEmirate] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [privacyConsent, setPrivacyConsent] = useState(false)
  const [error, setError] = useState('')
  const [showLangDropdown, setShowLangDropdown] = useState(false)
  const [confirmedEmail, setConfirmedEmail] = useState<string | null>(null)

  // Clear splash flag when login page mounts (ensures clean state)
  // This is a safeguard for iOS PWA where sessionStorage can persist
  useEffect(() => {
    safeSessionStorageRemoveItem('pwa_splash_shown')
  }, [])

  // Handle OAuth error query params
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search)
      const errorParam = searchParams.get('error')
      
      if (errorParam) {
        const errorMessages: Record<string, string> = {
          apple_rate_limit: t('login.appleRateLimit'),
          apple_not_configured: t('login.appleNotConfigured'),
          apple_oauth_failed: t('login.appleOAuthFailed'),
          rate_limit: t('login.googleRateLimit'),
          oauth_failed: t('login.googleOAuthFailed'),
          internal_error: t('login.googleInternalError'),
        }
        const errorMessage = errorMessages[errorParam] || t('login.googleGenericError')
        setError(errorMessage)
        // Clean up URL
        const cleanPath = locale === 'en' ? '/pwa-login' : `/${locale}/pwa-login`
        router.replace(cleanPath)
      }
    }
  }, [locale, router, t])

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.replace(getLocalizedPath('/products', locale))
    }
  }, [user, router, locale])

  // Redirect to regular login if not PWA (on client only)
  useEffect(() => {
    // Give time for PWA detection to complete
    const timer = setTimeout(() => {
      if (typeof window !== 'undefined' && !isPWA) {
        router.replace(getLocalizedPath('/login', locale))
      }
    }, 100)
    return () => clearTimeout(timer)
  }, [isPWA, router, locale])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!privacyConsent) {
      setError(t('authScreen.privacyRequiredMessage'))
      return
    }

    if (!email || !password) {
      setError(t('login.fillAllFields'))
      return
    }

    try {
      if (isLoginMode) {
        const success = await login(email, password)
        if (success) {
          router.replace(getLocalizedPath('/products', locale))
        } else {
          setError(t('authScreen.invalidCredentials'))
        }
      } else {
        if (!name || !phone.trim() || !address.trim() || !emirate.trim()) {
          setError(t('login.fillAllFields'))
          return
        }
        const normalizedEmail = normalizeEmailAddress(email)
        if (!isEmailAddressSyntaxValid(normalizedEmail)) {
          setError(t('login.emailInvalid'))
          return
        }
        if (suggestEmailAddressCorrection(normalizedEmail) && confirmedEmail !== normalizedEmail) {
          setError(t('login.emailSuggestionRequired'))
          return
        }
        const success = await register(
          name,
          normalizedEmail,
          password,
          phone,
          address,
          emirate,
          '',
          '',
          confirmedEmail === normalizedEmail
        )
        if (success) {
          router.replace(getLocalizedPath('/products', locale))
        } else {
          setError(t('authScreen.registrationFailed'))
        }
      }
    } catch {
      setError(t('common.error'))
    }
  }

  const handleGoogleLogin = async () => {
    if (!privacyConsent) {
      setError(t('authScreen.privacyRequiredMessage'))
      return
    }
    try {
      await loginWithGoogle()
    } catch {
      setError(t('login.googleAuthFailed'))
    }
  }

  const handleAppleLogin = async () => {
    if (!privacyConsent) {
      setError(t('authScreen.privacyRequiredMessage'))
      return
    }
    try {
      await loginWithApple()
    } catch {
      setError(t('login.appleAuthFailed'))
    }
  }

  const handleLanguageChange = (newLocale: string) => {
    setShowLangDropdown(false)
    const newPath = newLocale === 'en' ? '/pwa-login' : `/${newLocale}/pwa-login`
    router.push(newPath)
  }

  const currentLangCode = locale === 'ar' ? 'AR' : locale === 'ru' ? 'RU' : 'EN'

  return (
    <div className={`cera-page genosys-page ${ceraSerif.variable} min-h-screen flex flex-col ${isRTL ? 'rtl' : 'ltr'}`} dir={dir}>
      {/* Language Selector */}
      <div className={`pt-12 px-6 ${isRTL ? 'text-right' : 'text-left'}`}>
        <div className="relative inline-block">
          <button
            onClick={() => setShowLangDropdown(!showLangDropdown)}
            className="flex items-center gap-1 text-green-600 font-medium text-sm"
          >
            {currentLangCode}
            <ChevronDown className="w-4 h-4" />
          </button>
          
          {showLangDropdown && (
            <div className={`absolute top-full mt-1 bg-white shadow-lg rounded-lg border overflow-hidden z-50 ${isRTL ? 'right-0' : 'left-0'}`}>
              <button
                onClick={() => handleLanguageChange('en')}
                className={`w-full px-4 py-2 text-sm hover:bg-[var(--cera-cream-deep)] ${locale === 'en' ? 'bg-green-50 text-green-600' : ''}`}
              >
                EN
              </button>
              <button
                onClick={() => handleLanguageChange('ar')}
                className={`w-full px-4 py-2 text-sm hover:bg-[var(--cera-cream-deep)] ${locale === 'ar' ? 'bg-green-50 text-green-600' : ''}`}
              >
                AR
              </button>
              <button
                onClick={() => handleLanguageChange('ru')}
                className={`w-full px-4 py-2 text-sm hover:bg-[var(--cera-cream-deep)] ${locale === 'ru' ? 'bg-green-50 text-green-600' : ''}`}
              >
                RU
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Logo and Header */}
      <div className="flex flex-col items-center mt-4 mb-6 px-6">
        <Image
          src="/Logo/Full.png"
          alt="Genosys"
          width={200}
          height={70}
          priority
          className="w-[200px] h-auto"
        />
        <div className={`flex items-center gap-1.5 mt-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <span className="text-lg">🇦🇪</span>
          <span className="text-[var(--cera-body)] text-sm">{t('authScreen.uaeLine')}</span>
          <Heart className="w-3 h-3 text-red-500 fill-red-500" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 pb-8">
        {/* Social Login Buttons */}
        <div className={`flex gap-3 mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
          {/* Google Button */}
          <button
            onClick={handleGoogleLogin}
            disabled={isLoading || !privacyConsent}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 border border-[var(--cera-line)] rounded-xl ${!privacyConsent ? 'opacity-50' : 'hover:bg-[var(--cera-cream-deep)]'} transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            <div className="w-5 h-5 flex items-center justify-center">
              <span className="text-lg font-bold bg-gradient-to-r from-blue-500 via-green-500 via-yellow-500 to-red-500 bg-clip-text text-transparent">G</span>
            </div>
            <span className="text-[var(--cera-body)] font-medium">{t('authScreen.googleShort')}</span>
          </button>

          {/* Apple Button */}
          <button
            onClick={handleAppleLogin}
            disabled={isLoading || !privacyConsent}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-black text-white rounded-xl ${!privacyConsent ? 'opacity-50' : 'hover:bg-[var(--cera-ink)]'} transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
            </svg>
            <span className="font-medium">{t('authScreen.appleShort')}</span>
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-[var(--cera-cream-deep)]" />
          <span className="text-[var(--cera-muted)] text-sm">{t('authScreen.or')}</span>
          <div className="flex-1 h-px bg-[var(--cera-cream-deep)]" />
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-[var(--cera-blush)] border border-[var(--cera-blush-deep)] rounded-xl text-[var(--cera-rose-ink)] text-sm text-center">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name field (only for registration) */}
          {!isLoginMode && (
            <div>
              <label className={`block text-sm font-medium text-[var(--cera-body)] mb-1.5 ${isRTL ? 'text-right' : ''}`}>
                {t('authScreen.fullNameLabel')}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t('authScreen.fullNamePlaceholder')}
                className={`w-full px-4 py-3 bg-white text-[var(--cera-ink)] border border-[var(--cera-line)] rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all placeholder:text-[var(--cera-muted)] ${isRTL ? 'text-right' : ''}`}
                style={{ WebkitTextFillColor: '#111827', opacity: 1 }}
                dir={dir}
              />
            </div>
          )}

          {/* Email */}
          <div>
            <label className={`block text-sm font-medium text-[var(--cera-body)] mb-1.5 ${isRTL ? 'text-right' : ''}`}>
              {t('authScreen.emailLabel')}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                setConfirmedEmail(null)
                setError('')
              }}
              placeholder={t('authScreen.emailPlaceholder')}
              className={`w-full px-4 py-3 bg-white text-[var(--cera-ink)] border border-[var(--cera-line)] rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all placeholder:text-[var(--cera-muted)] ${isRTL ? 'text-right' : ''}`}
              style={{ WebkitTextFillColor: '#111827', opacity: 1 }}
              dir="ltr"
            />
            {!isLoginMode && (
              <EmailDomainSuggestion
                email={email}
                confirmedEmail={confirmedEmail}
                message={t('login.emailDidYouMean')}
                useSuggestionLabel={t('login.useSuggestedEmail')}
                keepEnteredLabel={t('login.keepEnteredEmail')}
                onUseSuggestion={(suggestedEmail) => {
                  setEmail(suggestedEmail)
                  setConfirmedEmail(null)
                  setError('')
                }}
                onKeepEntered={setConfirmedEmail}
              />
            )}
          </div>

          {/* Phone, Address, Emirate (only for registration) */}
          {!isLoginMode && (
            <>
              <div>
                <label className={`block text-sm font-medium text-[var(--cera-body)] mb-1.5 ${isRTL ? 'text-right' : ''}`}>
                  {t('login.uaePhoneNumber')} *
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={t('login.uaePhoneNumberPlaceholder')}
                  className={`w-full px-4 py-3 bg-white text-[var(--cera-ink)] border border-[var(--cera-line)] rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all placeholder:text-[var(--cera-muted)] ${isRTL ? 'text-right' : ''}`}
                  style={{ WebkitTextFillColor: '#111827', opacity: 1 }}
                  dir="ltr"
                  required
                />
              </div>
              <div>
                <label className={`block text-sm font-medium text-[var(--cera-body)] mb-1.5 ${isRTL ? 'text-right' : ''}`}>
                  {t('login.uaeAddress')} *
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder={t('login.uaeAddressPlaceholder')}
                  className={`w-full px-4 py-3 bg-white text-[var(--cera-ink)] border border-[var(--cera-line)] rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all placeholder:text-[var(--cera-muted)] ${isRTL ? 'text-right' : ''}`}
                  style={{ WebkitTextFillColor: '#111827', opacity: 1 }}
                  dir={dir}
                  required
                />
              </div>
              <div>
                <label className={`block text-sm font-medium text-[var(--cera-body)] mb-1.5 ${isRTL ? 'text-right' : ''}`}>
                  {t('login.selectEmirate')} *
                </label>
                <select
                  value={emirate}
                  onChange={(e) => setEmirate(e.target.value)}
                  className={`w-full px-4 py-3 bg-white border border-[var(--cera-line)] rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all ${emirate ? 'text-[var(--cera-ink)]' : 'text-[var(--cera-muted)]'} ${isRTL ? 'text-right' : ''}`}
                  required
                >
                  <option value="">{t('login.selectEmirate')}</option>
                  {EMIRATES.map(e => (
                    <option key={e.value} value={e.value}>
                      {e.label[locale] ?? e.label.en}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          {/* Password */}
          <div>
            <label className={`block text-sm font-medium text-[var(--cera-body)] mb-1.5 ${isRTL ? 'text-right' : ''}`}>
              {t('authScreen.passwordLabel')}
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('authScreen.passwordPlaceholder')}
                className={`w-full px-4 py-3 bg-white text-[var(--cera-ink)] border border-[var(--cera-line)] rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all placeholder:text-[var(--cera-muted)] ${isRTL ? 'text-right pr-4 pl-12' : 'pr-12'}`}
                style={{ WebkitTextFillColor: '#111827', opacity: 1 }}
                dir="ltr"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute top-1/2 -translate-y-1/2 text-[var(--cera-muted)] hover:text-[var(--cera-body)] ${isRTL ? 'left-4' : 'right-4'}`}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Privacy Consent */}
          <div className={`flex items-start gap-3 py-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <button
              type="button"
              onClick={() => setPrivacyConsent(!privacyConsent)}
              className={`touch-target-exempt flex-shrink-0 mt-0.5 w-[22px] h-[22px] rounded border-[1.5px] flex items-center justify-center transition-all duration-200 ${
                privacyConsent 
                  ? 'bg-[var(--cera-ink)] border-red-600' 
                  : 'bg-white border-[var(--cera-line)] active:border-[var(--cera-blush-deep)]'
              }`}
            >
              {privacyConsent && (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6L5 9L10 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </button>
            <p className={`text-[13px] text-[var(--cera-muted)] flex-1 leading-snug ${isRTL ? 'text-right' : ''}`}>
              {t('authScreen.privacyConsentPrefix')}{' '}
              <Link 
                href={getLocalizedPath('/privacy-policy', locale)} 
                className="text-[var(--cera-rose-ink)] underline font-medium"
              >
                {t('authScreen.privacyPolicyLink')}
              </Link>{' '}
              {t('authScreen.privacyConsentSuffix')}
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-[var(--cera-ink)] text-white font-semibold rounded-xl hover:bg-[var(--cera-rose-ink)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
            ) : (
              isLoginMode ? t('authScreen.signIn') : t('authScreen.createAccount')
            )}
          </button>
        </form>

        {/* Forgot Password (only in login mode) */}
        {isLoginMode && (
          <div className="text-center mt-4">
            <Link
              href={getLocalizedPath('/forgot-password', locale)}
              className="text-[var(--cera-rose-ink)] text-sm font-medium"
            >
              {t('login.forgotPassword')}
            </Link>
          </div>
        )}

        {/* Toggle Login/Register */}
        <div className="text-center mt-6">
          <span className="text-[var(--cera-muted)] text-sm block">
            {isLoginMode ? t('authScreen.dontHaveAccount') : t('authScreen.alreadyHaveAccount')}
          </span>
          <button
            type="button"
            onClick={() => {
              setIsLoginMode(!isLoginMode)
              setError('')
              setConfirmedEmail(null)
            }}
            className="text-[var(--cera-rose-ink)] font-semibold text-sm mt-1"
          >
            {isLoginMode ? t('authScreen.signUp') : t('authScreen.signIn')}
          </button>
        </div>
      </div>
    </div>
  )
}

