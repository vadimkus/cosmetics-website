'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Eye, EyeOff, Gift, ChevronDown } from 'lucide-react'
import { useAuth } from '@/components/auth/AuthProvider'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation } from '@/hooks/useTranslation'
import { getLocalizedPath } from '@/lib/i18n'
import { usePWAMode } from '@/hooks/usePWAMode'
import { useIsMobile } from '@/hooks/useIsMobile'

export default function LoginClient() {
  const { user, login, register, loginWithGoogle, loginWithApple, isLoading, forceRefreshUser } = useAuth()
  const [isLoginMode, setIsLoginMode] = useState(true)
  const [promoCode, setPromoCode] = useState<string>('')
  const router = useRouter()
  const { t, locale, dir } = useTranslation()
  const { isPWA, isClient: isPWAClient } = usePWAMode()
  const { isMobile, isClient: isMobileClient } = useIsMobile()
  const isRTL = dir === 'rtl'
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    emirate: '',
    birthday: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false)
  const [privacyConsent, setPrivacyConsent] = useState(false)
  const [showLangDropdown, setShowLangDropdown] = useState(false)
  const normalizedPromo = String(promoCode || '').trim().toUpperCase()

  // Redirect PWA users to clean PWA login page
  useEffect(() => {
    if (isPWAClient && isPWA) {
      // Preserve query params when redirecting
      const searchParams = typeof window !== 'undefined' ? window.location.search : ''
      const pwaLoginPath = locale === 'en' ? '/pwa-login' : `/${locale}/pwa-login`
      router.replace(pwaLoginPath + searchParams)
    }
  }, [isPWA, isPWAClient, router, locale])

  // Handle Google OAuth callback
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search)
      const success = searchParams.get('success')
      const email = searchParams.get('email')
      const errorParam = searchParams.get('error')
      const promo = searchParams.get('promo')
      const path = String(window.location.pathname || '')

      if (success === 'google_signin' && email) {
        forceRefreshUser()
          .then(() => {
            setTimeout(() => {
              router.push(getLocalizedPath('/products', locale))
            }, 300)
          })
          .catch(() => {
            router.push(getLocalizedPath('/products', locale))
          })
      } else if (errorParam) {
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
        router.replace(getLocalizedPath('/login', locale))
      } else if (promo || path.endsWith('/signup')) {
        setPromoCode(String(promo || '').trim())
        setIsLoginMode(false)
      }
    }
  }, [router, locale, forceRefreshUser, t])

  useEffect(() => {
    if (user) {
      router.push(getLocalizedPath('/products', locale))
    }
  }, [user, router, locale])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (isLoginMode) {
      const success = await login(formData.email, formData.password)
      if (success) {
        setFormData({ name: '', email: '', password: '', phone: '', address: '', emirate: '', birthday: '' })
      }
    } else {
      if (!formData.name.trim()) { setError(t('login.nameRequired')); return }
      if (!formData.email.trim()) { setError(t('login.emailRequired')); return }
      if (!formData.password.trim()) { setError(t('login.passwordRequired')); return }
      if (formData.password.length < 6) { setError(t('login.passwordMinLength')); return }
      if (!formData.phone.trim()) { setError(t('login.phoneRequired')); return }
      if (!formData.address.trim()) { setError(t('login.addressRequired')); return }
      if (!formData.emirate.trim()) { setError(t('login.emirateRequired')); return }
      if (!privacyConsent) { setError(t('login.privacyConsentRequired')); return }

      const success = await register(formData.name, formData.email, formData.password, formData.phone, formData.address, formData.emirate, formData.birthday, normalizedPromo || '')
      if (success) {
        setFormData({ name: '', email: '', password: '', phone: '', address: '', emirate: '', birthday: '' })
        setPrivacyConsent(false)
      }
    }
  }

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode)
    setError('')
    setFormData({ name: '', email: '', password: '', phone: '', address: '', emirate: '', birthday: '' })
    setPrivacyConsent(false)
    setShowPrivacyPolicy(false)
  }

  const handleLanguageChange = (newLocale: 'en' | 'ar' | 'ru') => {
    setShowLangDropdown(false)
    router.push(getLocalizedPath('/login', newLocale))
  }

  const currentLangCode = locale === 'ar' ? 'AR' : locale === 'ru' ? 'RU' : 'EN'

  // Clean mobile login UI
  if (isMobileClient && isMobile && !user) {
    return (
      <div className={`min-h-screen bg-white flex flex-col ${isRTL ? 'rtl' : 'ltr'}`} dir={dir}>
        {/* Language Selector */}
        <div className={`pt-12 px-6 ${isRTL ? 'text-right' : 'text-left'}`}>
          <div className="relative inline-block">
            <button
              onClick={() => setShowLangDropdown(!showLangDropdown)}
              className="flex items-center gap-1 text-green-600 font-semibold text-sm"
            >
              {currentLangCode}
              <ChevronDown className="w-4 h-4" />
            </button>
            
            {showLangDropdown && (
              <div className={`absolute top-full mt-1 bg-white shadow-lg rounded-lg border overflow-hidden z-50 min-w-[80px] ${isRTL ? 'right-0' : 'left-0'}`}>
                <button
                  onClick={() => handleLanguageChange('en')}
                  className={`w-full px-4 py-2.5 text-sm hover:bg-gray-50 text-left ${locale === 'en' ? 'bg-red-50 text-red-600 font-semibold' : 'text-gray-700'}`}
                >
                  English
                </button>
                <button
                  onClick={() => handleLanguageChange('ru')}
                  className={`w-full px-4 py-2.5 text-sm hover:bg-gray-50 text-left ${locale === 'ru' ? 'bg-red-50 text-red-600 font-semibold' : 'text-gray-700'}`}
                >
                  Русский
                </button>
                <button
                  onClick={() => handleLanguageChange('ar')}
                  className={`w-full px-4 py-2.5 text-sm hover:bg-gray-50 text-left ${locale === 'ar' ? 'bg-red-50 text-red-600 font-semibold' : 'text-gray-700'}`}
                >
                  العربية
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Logo and Header */}
        <div className="flex flex-col items-center mt-6 mb-8 px-6">
          <Image
            src="/Logo/Full.png"
            alt="Genosys"
            width={180}
            height={60}
            priority
            className="w-[180px] h-auto"
          />
          <div className={`flex items-center gap-2 mt-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <span className="text-base">🇦🇪</span>
            <span className="text-gray-600 text-sm">{t('login.unitedArabEmirates')}</span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 px-6 pb-8">
          {/* Social Login Buttons - Toggle Style */}
          <div className={`flex gap-3 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            {/* Google Button */}
            <button
              onClick={() => {
                if (!privacyConsent) {
                  setError(t('login.privacyConsentRequired'))
                  return
                }
                loginWithGoogle()
              }}
              disabled={isLoading}
              className={`flex-1 flex items-center justify-center gap-2 py-3.5 px-4 border border-gray-200 rounded-xl bg-white ${!privacyConsent ? 'opacity-50' : 'hover:bg-gray-50'} transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}
            >
              <span className="text-lg font-bold text-red-500">G</span>
              <span className="text-gray-700 font-medium text-sm">{t('authScreen.googleShort') || 'Google'}</span>
            </button>

            {/* Apple Button */}
            <button
              onClick={() => {
                if (!privacyConsent) {
                  setError(t('login.privacyConsentRequired'))
                  return
                }
                loginWithApple()
              }}
              disabled={isLoading}
              className={`flex-1 flex items-center justify-center gap-2 py-3.5 px-4 bg-gray-500 text-white rounded-xl ${!privacyConsent ? 'opacity-50' : 'hover:bg-gray-600'} transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
              </svg>
              <span className="font-medium text-sm">{t('authScreen.appleShort') || 'Apple'}</span>
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-5">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-gray-400 text-sm lowercase">{t('login.or')}</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm text-center">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name field (only for registration) */}
            {!isLoginMode && (
              <div>
                <label className={`block text-sm font-medium text-gray-700 mb-1.5 ${isRTL ? 'text-right' : ''}`}>
                  {t('login.fullNamePlaceholder')}
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder={t('login.fullNamePlaceholder')}
                  className={`w-full px-4 py-3.5 bg-white text-gray-900 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all placeholder:text-gray-400 ${isRTL ? 'text-right' : ''}`}
                  required={!isLoginMode}
                  dir={dir}
                />
              </div>
            )}

            {/* Email */}
            <div>
              <label className={`block text-sm font-medium text-gray-700 mb-1.5 ${isRTL ? 'text-right' : ''}`}>
                {t('authScreen.emailLabel') || 'Email'}
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder={t('authScreen.emailPlaceholder') || 'Enter your email'}
                className={`w-full px-4 py-3.5 bg-white text-gray-900 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all placeholder:text-gray-400 ${isRTL ? 'text-right' : ''}`}
                required
                dir="ltr"
              />
            </div>

            {/* Password */}
            <div>
              <label className={`block text-sm font-medium text-gray-700 mb-1.5 ${isRTL ? 'text-right' : ''}`}>
                {t('authScreen.passwordLabel') || 'Password'}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder={t('authScreen.passwordPlaceholder') || 'Enter your password'}
                  className={`w-full px-4 py-3.5 bg-white text-gray-900 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all placeholder:text-gray-400 ${isRTL ? 'text-right pr-4 pl-12' : 'pr-12'}`}
                  required
                  dir="ltr"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 ${isRTL ? 'left-4' : 'right-4'}`}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Privacy Consent */}
            <div className={`flex items-start gap-3 py-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <button
                type="button"
                onClick={() => setPrivacyConsent(!privacyConsent)}
                className={`touch-target-exempt flex-shrink-0 mt-0.5 w-[22px] h-[22px] rounded border-[1.5px] flex items-center justify-center transition-all duration-200 ${
                  privacyConsent 
                    ? 'bg-red-600 border-red-600' 
                    : 'bg-white border-gray-300 active:border-gray-400'
                }`}
              >
                {privacyConsent && (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6L5 9L10 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </button>
              <p className={`text-[13px] text-gray-500 flex-1 leading-snug ${isRTL ? 'text-right' : ''}`}>
                {t('authScreen.privacyConsentPrefix') || 'I agree to the'}{' '}
                <Link 
                  href={getLocalizedPath('/privacy-policy', locale)} 
                  className="text-red-600 underline font-medium"
                >
                  {t('authScreen.privacyPolicyLink') || 'Privacy Policy'}
                </Link>{' '}
                {t('authScreen.privacyConsentSuffix') || 'and consent to the collection and use of my personal information as described.'}
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !privacyConsent}
              className={`w-full py-4 font-semibold rounded-xl transition-colors ${
                privacyConsent 
                  ? 'bg-red-600 text-white hover:bg-red-700' 
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              } disabled:opacity-70`}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
              ) : (
                isLoginMode ? t('authScreen.signIn') || 'Sign In' : t('authScreen.createAccount') || 'Sign Up'
              )}
            </button>
          </form>

          {/* Forgot Password (only in login mode) */}
          {isLoginMode && (
            <div className="text-center mt-4">
              <Link
                href={getLocalizedPath('/forgot-password', locale)}
                className="text-red-600 text-sm font-medium"
              >
                {t('login.forgotPassword')}
              </Link>
            </div>
          )}

          {/* Toggle Login/Register */}
          <div className="text-center mt-6">
            <span className="text-gray-500 text-sm block">
              {isLoginMode ? t('authScreen.dontHaveAccount') || "Don't have an account?" : t('authScreen.alreadyHaveAccount') || 'Already have an account?'}
            </span>
            <button
              type="button"
              onClick={toggleMode}
              className="text-red-600 font-semibold text-sm mt-1"
            >
              {isLoginMode ? t('authScreen.signUp') || 'Sign Up' : t('authScreen.signIn') || 'Sign In'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (user) {
    return (
      <div className={`container mx-auto px-3 md:px-4 py-4 md:py-16 ${dir === 'rtl' ? 'text-right' : ''}`} dir={dir}>
        <div className="max-w-md mx-auto text-center py-8 md:py-16">
          <div className="mb-4 md:mb-8">
            <div className="h-14 w-14 md:h-24 md:w-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
              <svg className="h-7 w-7 md:h-12 md:w-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-xl md:text-3xl font-bold text-gray-900 mb-2 md:mb-4">{t('login.alreadyLoggedIn')}</h1>
            <p className="text-gray-600 text-sm md:text-lg mb-4 md:mb-8">
              {t('login.loggedInAs')} {user.email}
            </p>
          </div>
          <Link
            href={getLocalizedPath('/products', locale)}
            className={`inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-2.5 md:px-8 md:py-3 rounded-lg text-sm md:text-base font-semibold hover:bg-primary-700 transition-colors ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}
          >
            {t('login.continueToProducts')}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className={`container mx-auto px-3 md:px-4 py-4 md:py-8 min-h-0 ${dir === 'rtl' ? 'text-right' : ''}`} dir={dir}>
      {/* Navigation Breadcrumb */}
      <nav className={`text-xs md:text-base text-gray-600 mb-2 md:mb-4 ${dir === 'rtl' ? 'text-right' : ''}`} aria-label="Breadcrumb">
        <Link href={getLocalizedPath('/', locale)} className="hover:text-primary-600 transition-colors">{t('common.home')}</Link>
        <span> / </span>
        <span className="text-gray-900 font-medium">{t('common.login')}</span>
      </nav>

      {/* Back to Home */}
      <Link 
        href={getLocalizedPath('/', locale)} 
        className={`inline-flex items-center gap-1 text-xs md:text-sm text-primary-600 hover:text-primary-700 mb-3 md:mb-6 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}
      >
        <ArrowLeft className="h-3 w-3 md:h-4 md:w-4" />
        <span>{t('login.backToHome')}</span>
      </Link>

      <div className="max-w-md mx-auto">
        {/* Login Form Card - Embedded directly */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 md:p-6">
          {/* Header */}
          <div className="mb-4 md:mb-5 text-center">
            <h1 className="text-lg md:text-xl font-bold text-gray-900">
              {isLoginMode ? t('login.professionalLogin') : t('login.professionalAccount')}
            </h1>
            <p className="text-xs md:text-sm text-gray-500 mt-0.5">
              {t('login.unitedArabEmirates')}
            </p>
          </div>

          <div className={`${isLoginMode ? 'space-y-3 md:space-y-4' : 'space-y-2 md:space-y-3'}`}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded-lg text-xs md:text-sm" role="alert">
                {error}
              </div>
            )}

            {/* Google Sign-In Button */}
            <button
              type="button"
              onClick={() => loginWithGoogle()}
              disabled={isLoading}
              className={`w-full flex items-center justify-center gap-2 md:gap-3 bg-white border-2 border-gray-300 text-gray-700 ${isLoginMode ? 'py-2.5 md:py-3' : 'py-2'} rounded-lg font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}
            >
              <svg className="h-4 w-4 md:h-5 md:w-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span className="text-xs md:text-sm">{t('login.signInWithGoogle')}</span>
            </button>

            {/* Apple Sign-In Button */}
            <button
              type="button"
              onClick={() => loginWithApple()}
              disabled={isLoading}
              className={`w-full flex items-center justify-center gap-2 md:gap-3 bg-black text-white ${isLoginMode ? 'py-2.5 md:py-3' : 'py-2'} rounded-lg font-semibold hover:bg-black/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}
            >
              <svg className="h-4 w-4 md:h-5 md:w-5" viewBox="0 0 814 1000" aria-hidden="true">
                <path fill="currentColor" d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76.5 0-103.7 40.8-165.9 40.8s-105.6-57-155.5-127C46.7 790.7 0 663 0 541.8c0-194.4 126.4-297.5 250.8-297.5 66.1 0 121.2 43.4 162.7 43.4 39.5 0 101.1-46 176.3-46 28.5 0 130.9 2.6 198.3 99.2zm-234-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z" />
              </svg>
              <span className="text-xs md:text-sm">{t('login.signInWithApple')}</span>
            </button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-2 text-gray-500">{t('login.or')}</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className={`${isLoginMode ? 'space-y-3 md:space-y-4' : 'space-y-2 md:space-y-3'}`}>
              {/* Promo banner */}
              {!isLoginMode && normalizedPromo && (
                <div className={`bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded-lg text-xs md:text-sm ${dir === 'rtl' ? 'text-right' : ''}`}>
                  <div className="font-semibold">Promo applied</div>
                  <div className="opacity-90">{normalizedPromo}</div>
                </div>
              )}

              {!isLoginMode && (
                <input
                  type="text"
                  name="name"
                  placeholder={t('login.fullNamePlaceholder')}
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-xs md:text-sm bg-white text-gray-900 placeholder:text-gray-400 ${dir === 'rtl' ? 'text-right' : ''}`}
                  required={!isLoginMode}
                />
              )}

              <input
                type="email"
                name="email"
                placeholder={isLoginMode ? t('login.emailAddressPlaceholder') : t('login.emailAddressRequired')}
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-3 ${isLoginMode ? 'py-2.5 md:py-2' : 'py-2'} border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-xs md:text-sm bg-white text-gray-900 placeholder:text-gray-400 ${dir === 'rtl' ? 'text-right' : ''}`}
                required
              />

              {!isLoginMode && (
                <>
                  <input
                    type="tel"
                    name="phone"
                    placeholder={t('login.uaePhoneNumberPlaceholder')}
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-xs md:text-sm bg-white text-gray-900 placeholder:text-gray-400 ${dir === 'rtl' ? 'text-right' : ''}`}
                    required={!isLoginMode}
                  />
                  <input
                    type="text"
                    name="address"
                    placeholder={t('login.uaeAddressPlaceholder')}
                    value={formData.address}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-xs md:text-sm bg-white text-gray-900 placeholder:text-gray-400 ${dir === 'rtl' ? 'text-right' : ''}`}
                    required={!isLoginMode}
                  />
                  <select
                    name="emirate"
                    value={formData.emirate}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-xs md:text-sm bg-white ${formData.emirate ? 'text-gray-900' : 'text-gray-400'} ${dir === 'rtl' ? 'text-right' : ''}`}
                    required={!isLoginMode}
                  >
                    <option value="">{t('login.selectEmirate')}</option>
                    <option value="Dubai">Dubai</option>
                    <option value="Abu Dhabi">Abu Dhabi</option>
                    <option value="Sharjah">Sharjah</option>
                    <option value="Ajman">Ajman</option>
                    <option value="Ras Al Khaimah">Ras Al Khaimah</option>
                    <option value="Fujairah">Fujairah</option>
                    <option value="Umm Al Quwain">Umm Al Quwain</option>
                  </select>
                  <div>
                    <label className={`block text-[10px] md:text-xs font-medium text-gray-600 mb-1 ${dir === 'rtl' ? 'text-right' : ''}`}>
                      {t('login.birthday')}
                    </label>
                    <input
                      type="date"
                      name="birthday"
                      value={formData.birthday}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-xs md:text-sm bg-white ${formData.birthday ? 'text-gray-900' : 'text-gray-400'} ${dir === 'rtl' ? 'text-right' : ''}`}
                    />
                    <p className={`text-[10px] text-gray-500 mt-0.5 flex items-center justify-center gap-1 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                      {t('login.birthdayMessage')} <Gift className="h-3 w-3 text-primary-600" />
                    </p>
                  </div>
                </>
              )}

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder={t('login.passwordPlaceholder')}
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full px-3 ${isLoginMode ? 'py-2.5 md:py-2' : 'py-2'} ${dir === 'rtl' ? 'pl-10' : 'pr-10'} border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-xs md:text-sm bg-white text-gray-900 ${dir === 'rtl' ? 'text-right' : ''}`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute inset-y-0 ${dir === 'rtl' ? 'left-0 pl-3' : 'right-0 pr-3'} flex items-center`}
                >
                  {showPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
                </button>
              </div>

              {/* Forgot Password Link */}
              {isLoginMode && (
                <div className={dir === 'rtl' ? 'text-left' : 'text-right'}>
                  <Link href={getLocalizedPath('/forgot-password', locale)} className="text-xs md:text-sm text-primary-600 hover:text-primary-700 font-medium">
                    {t('login.forgotPassword')}
                  </Link>
                </div>
              )}

              {/* Privacy Policy Section - Registration only */}
              {!isLoginMode && (
                <div className="space-y-2">
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-2.5 overflow-hidden">
                    <div className={`flex items-center justify-between ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                      <h4 className={`font-semibold text-gray-800 text-[11px] ${dir === 'rtl' ? 'text-right' : ''}`}>{t('login.privacyPolicy')}</h4>
                      <button
                        type="button"
                        onClick={() => setShowPrivacyPolicy(!showPrivacyPolicy)}
                        className="text-primary-600 hover:text-primary-700 text-[10px] font-medium underline flex-shrink-0"
                      >
                        {showPrivacyPolicy ? t('login.hideDetails') : t('login.viewDetails')}
                      </button>
                    </div>
                    {showPrivacyPolicy && (
                      <div className="mt-2 pt-2 border-t border-gray-200 h-28 overflow-y-auto">
                        <div className={`text-[9px] text-gray-600 space-y-1.5 pr-1 ${dir === 'rtl' ? 'text-right pl-1 pr-0' : ''}`}>
                          <p>{t('login.privacyPolicyDescription')}</p>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className={`flex items-start gap-2 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                    <input
                      type="checkbox"
                      id="privacy-consent"
                      checked={privacyConsent}
                      onChange={(e) => setPrivacyConsent(e.target.checked)}
                      className="mt-0.5 h-3.5 w-3.5 text-primary-600 focus:ring-primary-500 border-gray-300 rounded flex-shrink-0"
                      required
                    />
                    <label htmlFor="privacy-consent" className={`text-[10px] text-gray-600 leading-tight ${dir === 'rtl' ? 'text-right' : ''}`}>
                      {t('login.agreeToPrivacy')} <span className="text-primary-600 font-medium">{t('login.privacyPolicy')}</span>
                    </label>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full bg-primary-600 text-white ${isLoginMode ? 'py-2.5 md:py-3 text-sm md:text-base' : 'py-2 text-sm'} rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm`}
              >
                {isLoading ? t('login.pleaseWait') : (isLoginMode ? t('login.signIn') : t('login.createProfessionalAccount'))}
              </button>
            </form>

            <div className={`text-center ${isLoginMode ? 'pt-2 md:pt-3' : 'pt-2'} border-t border-gray-100`}>
              <div className={`flex flex-col gap-1 text-xs text-gray-600 ${dir === 'rtl' ? 'text-right' : ''}`}>
                <span>{isLoginMode ? t('login.dontHaveAccount') : t('login.alreadyHaveAccount')}</span>
                <button 
                  onClick={toggleMode}
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  {isLoginMode ? t('login.switchToCreate') : t('login.switchToLogin')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
