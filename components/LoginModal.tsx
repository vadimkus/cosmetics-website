'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { X, Eye, EyeOff, Gift, Fingerprint } from 'lucide-react'
import { useAuth } from './auth/AuthProvider'
import Link from 'next/link'
import { useTranslation } from '@/hooks/useTranslation'
import { getLocalizedPath } from '@/lib/i18n'
import { EMIRATES } from '@/lib/emirates'
import { usePasskey } from '@/hooks/usePasskey'
import EmailDomainSuggestion from '@/components/auth/EmailDomainSuggestion'
import {
  isEmailAddressSyntaxValid,
  normalizeEmailAddress,
  suggestEmailAddressCorrection,
} from '@/lib/emailAddressValidation'
import { getLocalTodayYmd } from '@/lib/validation'

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  isLoginMode: boolean
  setIsLoginMode: (mode: boolean) => void
  promoCode?: string
}

export default function LoginModal({ isOpen, onClose, isLoginMode, setIsLoginMode, promoCode }: LoginModalProps) {
  const { login, register, loginWithGoogle, loginWithApple, isLoading, forceRefreshUser } = useAuth()
  const { t, locale, dir } = useTranslation()
  const maxBirthday = getLocalTodayYmd()
  const { 
    isPlatformAuthenticatorAvailable, 
    checkPasskeyExists, 
    loginWithPasskey,
    isLoading: isPasskeyLoading,
    error: passkeyError,
    clearError: clearPasskeyError
  } = usePasskey()
  
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
  const [hasPasskey, setHasPasskey] = useState(false)
  const [confirmedEmail, setConfirmedEmail] = useState<string | null>(null)
  const normalizedPromo = String(promoCode || '').trim().toUpperCase()
  const modalRef = useRef<HTMLDivElement>(null)
  const firstInputRef = useRef<HTMLInputElement>(null)
  const lastInputRef = useRef<HTMLInputElement>(null)
  const emailCheckTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Focus management for accessibility
  useEffect(() => {
    if (isOpen && firstInputRef.current) {
      firstInputRef.current.focus()
    }
  }, [isOpen])

  // Check if user has passkeys when email changes (in login mode)
  useEffect(() => {
    if (!isLoginMode || !isPlatformAuthenticatorAvailable) {
      setHasPasskey(false)
      return
    }

    // Clear previous timeout
    if (emailCheckTimeoutRef.current) {
      clearTimeout(emailCheckTimeoutRef.current)
    }

    const email = formData.email.trim()
    if (!email || !email.includes('@')) {
      setHasPasskey(false)
      return
    }

    // Debounce the check
    emailCheckTimeoutRef.current = setTimeout(async () => {
      const exists = await checkPasskeyExists(email)
      setHasPasskey(exists)
    }, 500)

    return () => {
      if (emailCheckTimeoutRef.current) {
        clearTimeout(emailCheckTimeoutRef.current)
      }
    }
  }, [formData.email, isLoginMode, isPlatformAuthenticatorAvailable, checkPasskeyExists])

  // Handle passkey login
  const handlePasskeyLogin = useCallback(async () => {
    clearPasskeyError()
    setError('')
    
    const result = await loginWithPasskey(formData.email)
    if (result && result.user) {
      await forceRefreshUser()
      onClose()
      setFormData({ name: '', email: '', password: '', phone: '', address: '', emirate: '', birthday: '' })
    } else if (passkeyError) {
      setError(passkeyError)
    }
  }, [formData.email, loginWithPasskey, forceRefreshUser, onClose, passkeyError, clearPasskeyError])

  // Handle escape key and focus trap
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return

      if (e.key === 'Escape') {
        onClose()
        return
      }

      if (e.key === 'Tab') {
        const focusableElements = modalRef.current?.querySelectorAll(
          'input, button, [tabindex]:not([tabindex="-1"])'
        ) as NodeListOf<HTMLElement>

        if (!focusableElements.length) return

        const firstElement = focusableElements[0]
        const lastElement = focusableElements[focusableElements.length - 1]

        if (e.shiftKey) {
          if (document.activeElement === firstElement && lastElement) {
            e.preventDefault()
            lastElement.focus()
          }
        } else {
          if (document.activeElement === lastElement && firstElement) {
            e.preventDefault()
            firstElement.focus()
          }
        }
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
    
    return undefined
  }, [isOpen, onClose])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    if (name === 'email') setConfirmedEmail(null)
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (isLoginMode) {
      const success = await login(formData.email, formData.password)
      if (success) {
        onClose()
        setFormData({ name: '', email: '', password: '', phone: '', address: '', emirate: '', birthday: '' })
      }
    } else {
      if (!formData.name.trim()) {
        setError(t('login.nameRequired'))
        return
      }
      if (!formData.email.trim()) {
        setError(t('login.emailRequired'))
        return
      }
      const normalizedEmail = normalizeEmailAddress(formData.email)
      if (!isEmailAddressSyntaxValid(normalizedEmail)) {
        setError(t('login.emailInvalid'))
        return
      }
      if (suggestEmailAddressCorrection(normalizedEmail) && confirmedEmail !== normalizedEmail) {
        setError(t('login.emailSuggestionRequired'))
        return
      }
      if (!formData.password.trim()) {
        setError(t('login.passwordRequired'))
        return
      }
      if (formData.password.length < 8) {
        setError(t('login.passwordMinLength'))
        return
      }
      if (!formData.phone.trim()) {
        setError(t('login.phoneRequired'))
        return
      }
      if (!formData.address.trim()) {
        setError(t('login.addressRequired'))
        return
      }
      if (!formData.emirate.trim()) {
        setError(t('login.emirateRequired'))
        return
      }
      if (!privacyConsent) {
        setError(t('login.privacyConsentRequired'))
        return
      }

      const success = await register(
        formData.name,
        normalizedEmail,
        formData.password,
        formData.phone,
        formData.address,
        formData.emirate,
        formData.birthday,
        normalizedPromo || '',
        confirmedEmail === normalizedEmail
      )
      if (success) {
        onClose()
        setFormData({ name: '', email: '', password: '', phone: '', address: '', emirate: '', birthday: '' })
        setPrivacyConsent(false)
      }
    }
  }


  const toggleMode = () => {
    setIsLoginMode(!isLoginMode)
    setError('')
    setConfirmedEmail(null)
    setFormData({ name: '', email: '', password: '', phone: '', address: '', emirate: '', birthday: '' })
    setPrivacyConsent(false)
    setShowPrivacyPolicy(false)
  }

  if (!isOpen || typeof document === 'undefined') return null

  return createPortal(
    <div 
      className="fixed inset-0 modal-overlay-heavy flex items-center justify-center z-[10000] p-3 md:p-4"
      style={{ zIndex: 10000 }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      dir={dir}
    >
      <div 
        ref={modalRef}
        className={`modal-surface-vibrancy p-5 md:p-7 max-w-sm md:max-w-md w-full max-h-[88vh] overflow-y-auto ${dir === 'rtl' ? 'text-right' : ''}`}
      >
        {/* Header */}
        <div className="relative mb-4 md:mb-5">
          <button
            onClick={onClose}
            className={`absolute top-0 ${dir === 'rtl' ? 'left-0' : 'right-0'} text-gray-400 hover:text-gray-600 p-1 touch-manipulation transition-colors`}
            aria-label={t('common.close')}
          >
            <X className="h-5 w-5 md:h-6 md:w-6" aria-hidden="true" />
          </button>
          <h2 id="modal-title" className="text-lg md:text-xl font-bold text-gray-900 text-center pr-6 tracking-tight">
            {isLoginMode ? t('login.professionalLogin') : t('login.professionalAccount')}
          </h2>
          <p className="text-xs md:text-sm text-gray-500 mt-1 text-center">
            {t('login.unitedArabEmirates')}
          </p>
        </div>

        <div className="space-y-3 md:space-y-4">
          {error && (
            <div id="error-message" className="bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded-lg text-xs md:text-sm" role="alert">
              {error}
            </div>
          )}

          {/* Value-prop strip for Create Account - keeps the modal clean and
              brand-led while the user fills the form (no auth shortcuts or
              app-store CTAs to distract them from registering). */}
          {!isLoginMode && (
            <div className={`rounded-lg border border-primary-100 bg-primary-50/60 px-3.5 py-2.5 ${dir === 'rtl' ? 'text-right' : ''}`}>
              <p className="text-[10.5px] font-semibold uppercase tracking-wider text-primary-700">
                {locale === 'ar'
                  ? 'إنشاء حساب - دقيقة واحدة'
                  : locale === 'ru'
                  ? 'Создание аккаунта - 1 минута'
                  : 'Create account - 1 minute'}
              </p>
              <p className="mt-1 text-[11px] md:text-xs text-gray-700 leading-relaxed">
                {locale === 'ar'
                  ? 'تتبّع الطلبات، شحن مجاني فوق 1000 درهم، وعروض حصرية للعملاء المحترفين.'
                  : locale === 'ru'
                  ? 'Отслеживание заказов, бесплатная доставка от 1000 AED и закрытые цены для профи.'
                  : 'Order tracking, free shipping over AED 1,000, and exclusive pricing for pros.'}
              </p>
            </div>
          )}

          {/* Social + app-store buttons - only on Sign In. Create Account is
              form-only so users commit to one clear path. */}
          {isLoginMode && (
            <>
              {/* Google Sign-In Button */}
              <button
                type="button"
                onClick={() => loginWithGoogle()}
                disabled={isLoading}
                className={`w-full flex items-center justify-center gap-2 md:gap-3 bg-surface border border-border-primary text-text-primary py-2.5 md:py-3 rounded-system font-semibold hover:bg-surface-secondary transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed elevation-1 hover:elevation-2 min-h-[44px] ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}
              >
                <svg className="h-4 w-4 md:h-5 md:w-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span className="text-xs md:text-sm">{t('login.signInWithGoogle')}</span>
              </button>

              {/* Apple Sign-In Button */}
              <button
                type="button"
                onClick={() => loginWithApple()}
                disabled={isLoading}
                className={`w-full flex items-center justify-center gap-2 md:gap-3 bg-black text-white py-2.5 md:py-3 rounded-system font-semibold hover:bg-black/90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed elevation-2 hover:elevation-3 min-h-[44px] ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}
              >
                <svg className="h-4 w-4 md:h-5 md:w-5" viewBox="0 0 814 1000" aria-hidden="true">
                  <path
                    fill="currentColor"
                    d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76.5 0-103.7 40.8-165.9 40.8s-105.6-57-155.5-127C46.7 790.7 0 663 0 541.8c0-194.4 126.4-297.5 250.8-297.5 66.1 0 121.2 43.4 162.7 43.4 39.5 0 101.1-46 176.3-46 28.5 0 130.9 2.6 198.3 99.2zm-234-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z"
                  />
                </svg>
                <span className="text-xs md:text-sm">{t('login.signInWithApple')}</span>
              </button>

              {/* Download App Store Button */}
              <a
                href="https://apps.apple.com/ae/app/genosys-uae/id6756648064"
                target="_blank"
                rel="noopener noreferrer"
                className={`w-full flex items-center justify-center gap-2 md:gap-3 bg-black text-white py-2 rounded-system font-semibold hover:bg-black/90 transition-all duration-200 elevation-2 hover:elevation-3 min-h-[44px] ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}
              >
                <svg className="h-4 w-4 md:h-5 md:w-5" viewBox="0 0 814 1000" aria-hidden="true">
                  <path
                    fill="currentColor"
                    d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76.5 0-103.7 40.8-165.9 40.8s-105.6-57-155.5-127C46.7 790.7 0 663 0 541.8c0-194.4 126.4-297.5 250.8-297.5 66.1 0 121.2 43.4 162.7 43.4 39.5 0 101.1-46 176.3-46 28.5 0 130.9 2.6 198.3 99.2zm-234-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z"
                  />
                </svg>
                <span className="text-xs md:text-sm">{t('login.downloadAppApple')}</span>
              </a>

              {/* Download Google Play Button */}
              <a
                href="https://play.google.com/store/apps/details?id=ae.genosys.app"
                target="_blank"
                rel="noopener noreferrer"
                className={`w-full flex items-center justify-center gap-2 md:gap-3 bg-black text-white py-2 rounded-system font-semibold hover:bg-black/90 transition-all duration-200 elevation-2 hover:elevation-3 min-h-[44px] ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}
              >
                <svg className="h-4 w-4 md:h-5 md:w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.199l2.807 1.626a1 1 0 0 1 0 1.732l-2.808 1.626L15.206 12l2.492-2.492zM5.864 2.658L16.8 8.99l-2.302 2.302-8.634-8.634z"/>
                </svg>
                <span className="text-xs md:text-sm">{t('login.downloadAppGoogle')}</span>
              </a>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-white px-2 text-gray-500">{t('login.or')}</span>
                </div>
              </div>
            </>
          )}

          <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
            {/* Passkey Login Button - Shows when user has a passkey and device supports it */}
            {isLoginMode && hasPasskey && isPlatformAuthenticatorAvailable && (
              <button
                type="button"
                onClick={handlePasskeyLogin}
                disabled={isLoading || isPasskeyLoading}
                className={`w-full flex items-center justify-center gap-2 md:gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2.5 md:py-3 rounded-system font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed elevation-2 hover:elevation-3 min-h-[44px] ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}
              >
                <Fingerprint className="h-5 w-5" aria-hidden="true" />
                <span className="text-xs md:text-sm">
                  {isPasskeyLoading ? t('login.pleaseWait') : (t('login.signInWithPasskey') || 'Sign in with Face ID / Touch ID')}
                </span>
              </button>
            )}
            {/* Promo banner (when opening via /signup?promo=XXXX) */}
            {!isLoginMode && normalizedPromo ? (
              <div className={`bg-[var(--cera-ok-bg)] border border-[var(--cera-ok-line)] text-[var(--cera-ok)] px-3 py-2 rounded-lg text-xs md:text-sm ${dir === 'rtl' ? 'text-right' : ''}`}>
                <div className="font-semibold">
                  {locale === 'ar'
                    ? 'تم تطبيق العرض'
                    : locale === 'ru'
                    ? 'Промокод применён'
                    : 'Promo applied'}
                </div>
                <div className="opacity-90">{normalizedPromo}</div>
              </div>
            ) : null}
            {!isLoginMode && (
              <div>
                <label htmlFor="name" className="sr-only">{t('login.fullName')}</label>
                <input
                  ref={firstInputRef}
                  type="text"
                  id="name"
                  name="name"
                  placeholder={t('login.fullNamePlaceholder')}
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2.5 md:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-xs md:text-sm bg-white text-gray-900 placeholder:text-gray-400 transition-shadow ${dir === 'rtl' ? 'text-right' : ''}`}
                  required={!isLoginMode}
                  aria-describedby={error && !isLoginMode ? "error-message" : undefined}
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="sr-only">{t('login.emailAddress')}</label>
              <input
                ref={!isLoginMode ? undefined : firstInputRef}
                type="email"
                id="email"
                name="email"
                placeholder={isLoginMode ? t('login.emailAddressPlaceholder') : t('login.emailAddressRequired')}
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-3 py-2.5 md:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-xs md:text-sm bg-white text-gray-900 placeholder:text-gray-400 transition-shadow ${dir === 'rtl' ? 'text-right' : ''}`}
                required
                aria-describedby={error ? "error-message" : undefined}
              />
              {!isLoginMode && (
                <EmailDomainSuggestion
                  email={formData.email}
                  confirmedEmail={confirmedEmail}
                  message={t('login.emailDidYouMean')}
                  useSuggestionLabel={t('login.useSuggestedEmail')}
                  keepEnteredLabel={t('login.keepEnteredEmail')}
                  onUseSuggestion={(email) => {
                    setFormData((prev) => ({ ...prev, email }))
                    setConfirmedEmail(null)
                    setError('')
                  }}
                  onKeepEntered={setConfirmedEmail}
                />
              )}
            </div>

            {!isLoginMode && (
              <div>
                <label htmlFor="phone" className="sr-only">{t('login.uaePhoneNumber')}</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  placeholder={t('login.uaePhoneNumberPlaceholder')}
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2.5 md:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-xs md:text-sm bg-white text-gray-900 placeholder:text-gray-400 transition-shadow ${dir === 'rtl' ? 'text-right' : ''}`}
                  required={!isLoginMode}
                  aria-describedby={error && !isLoginMode ? "error-message" : undefined}
                />
              </div>
            )}

            {!isLoginMode && (
              <div>
                <label htmlFor="address" className="sr-only">{t('login.uaeAddress')}</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  placeholder={t('login.uaeAddressPlaceholder')}
                  value={formData.address}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2.5 md:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-xs md:text-sm bg-white text-gray-900 placeholder:text-gray-400 transition-shadow ${dir === 'rtl' ? 'text-right' : ''}`}
                  required={!isLoginMode}
                  aria-describedby={error && !isLoginMode ? "error-message" : undefined}
                />
              </div>
            )}

            {!isLoginMode && (
              <div>
                <label htmlFor="emirate" className="sr-only">{t('login.emirate')}</label>
                <select
                  id="emirate"
                  name="emirate"
                  value={formData.emirate}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2.5 md:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-xs md:text-sm bg-white ${formData.emirate ? 'text-gray-900' : 'text-gray-400'} transition-shadow ${dir === 'rtl' ? 'text-right' : ''}`}
                  required={!isLoginMode}
                  aria-describedby={error && !isLoginMode ? "error-message" : undefined}
                >
                  <option value="">{t('login.selectEmirate')}</option>
                  {EMIRATES.map(e => (
                    <option key={e.value} value={e.value}>
                      {e.label[locale] ?? e.label.en}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {!isLoginMode && (
              <div>
                <label htmlFor="birthday" className={`block text-[10px] md:text-xs font-medium text-gray-600 mb-1 ${dir === 'rtl' ? 'text-right' : ''}`}>
                  {t('login.birthday')}
                </label>
                <input
                  type="date"
                  id="birthday"
                  name="birthday"
                  value={formData.birthday}
                  onChange={handleInputChange}
                  max={maxBirthday}
                  className={`w-full px-3 py-2.5 md:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-xs md:text-sm bg-white ${formData.birthday ? 'text-gray-900' : 'text-gray-400'} transition-shadow ${dir === 'rtl' ? 'text-right' : ''}`}
                  aria-describedby={error && !isLoginMode ? "error-message" : undefined}
                />
                <p className={`text-[10px] text-gray-500 mt-0.5 flex items-center justify-center gap-1 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                  {t('login.birthdayMessage')} <Gift className="h-3 w-3 text-primary-600" />
                </p>
              </div>
            )}

            <div className="relative">
              <label htmlFor="password" className="sr-only">{t('login.password')}</label>
              <input
                ref={lastInputRef}
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder={t('login.passwordPlaceholder')}
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full px-3 py-2.5 md:py-2 ${dir === 'rtl' ? 'pl-10' : 'pr-10'} border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-xs md:text-sm bg-white text-gray-900 transition-shadow ${dir === 'rtl' ? 'text-right' : ''}`}
                required
                aria-describedby={error ? "error-message" : undefined}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute inset-y-0 ${dir === 'rtl' ? 'left-0 pl-3' : 'right-0 pr-3'} flex items-center touch-manipulation`}
                aria-label={showPassword ? t('login.hidePassword') : t('login.showPassword')}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400" aria-hidden="true" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" aria-hidden="true" />
                )}
              </button>
            </div>

            {/* Forgot Password Link - Only show in login mode */}
            {isLoginMode && (
              <div className={dir === 'rtl' ? 'text-left' : 'text-right'}>
                <Link
                  href={getLocalizedPath('/forgot-password', locale)}
                  onClick={onClose}
                  className="text-xs md:text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  {t('login.forgotPassword')}
                </Link>
              </div>
            )}

            {/* Privacy Policy Section - Only show for registration */}
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
                    <div 
                      className="mt-2 pt-2 border-t border-gray-200 h-28 overflow-y-auto"
                      style={{ WebkitOverflowScrolling: 'touch' }}
                    >
                      <div className={`text-[9px] text-gray-600 space-y-1.5 pr-1 ${dir === 'rtl' ? 'text-right pl-1 pr-0' : ''}`}>
                        <p>{t('login.privacyPolicyDescription')}</p>
                        <div>
                          <p className="font-semibold">1. {t('login.personalInformationProcessed')}</p>
                          <p>{t('login.privacyPolicyContent1')}</p>
                        </div>
                        <div>
                          <p className="font-semibold">1.1. {t('login.authenticationMethods')}</p>
                          <p>{t('login.authenticationMethodsDescription')}</p>
                        </div>
                        <div>
                          <p className="font-semibold">1.2. {t('login.googleAuthentication')}</p>
                          <p>{t('login.googleAuthenticationDescription')}</p>
                          <p className="mt-1">{t('login.googleDataShared')}</p>
                          <p className="mt-1">{t('login.googlePrivacyPolicy')}</p>
                          <p className="mt-1">{t('login.googleDataUsage')}</p>
                          <p className="mt-1">{t('login.googleAccountLinking')}</p>
                          <p className="mt-1">{t('login.googleDataControl')}</p>
                          <p className="mt-1">{t('login.googleAlternative')}</p>
                        </div>
                        <div>
                          <p className="font-semibold">2. {t('login.purposeOfProcessing')}</p>
                          <p>{t('login.purposeDescription')}</p>
                        </div>
                        <div>
                          <p className="font-semibold">3. {t('login.retentionPeriod')}</p>
                          <p>{t('login.retentionDescription')}</p>
                        </div>
                        <div>
                          <p className="font-semibold">4. {t('login.rightToRefuse')}</p>
                          <p>{t('login.rightToRefuseDescription')}</p>
                        </div>
                        <div className="p-1.5 bg-amber-50 border border-amber-200 rounded text-amber-800">
                          <p><strong>{t('login.important')}</strong> {t('login.importantMessage')}</p>
                        </div>
                        <p className="text-primary-600 font-medium">{t('login.privacyContact')}</p>
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
                    {t('login.agreeToPrivacy')}{' '}
                    <span className="text-primary-600 font-medium">{t('login.privacyPolicy')}</span>
                  </label>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary-600 text-white py-2.5 md:py-3 text-sm md:text-base rounded-system font-semibold hover:bg-primary-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-primary hover:shadow-primary-lg min-h-[44px]"
            >
              {isLoading ? t('login.pleaseWait') : (isLoginMode ? t('login.signIn') : t('login.createProfessionalAccount'))}
            </button>
          </form>

          <div className="text-center pt-2 md:pt-3 border-t border-gray-100">
            <div className={`flex flex-col gap-1 text-xs text-gray-600 ${dir === 'rtl' ? 'text-right' : ''}`}>
              <span>{isLoginMode ? t('login.dontHaveAccount') : t('login.alreadyHaveAccount')}</span>
              <button 
                onClick={toggleMode}
                className="text-primary-600 hover:text-primary-700 font-medium"
                aria-label={isLoginMode ? t('login.switchToCreate') : t('login.switchToLogin')}
              >
                {isLoginMode ? t('login.switchToCreate') : t('login.switchToLogin')}
              </button>
            </div>
            {/* Partner access (clinics & salons) - dedicated login on /login */}
            {isLoginMode && (
              <Link
                href={`${getLocalizedPath('/login', locale)}?partner=1`}
                onClick={onClose}
                className={`mt-3 w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-black text-white py-3 rounded-lg font-bold text-xs uppercase tracking-wide transition-colors ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}
              >
                <span className="w-2 h-2 rounded-full bg-red-500" />
                {locale === 'ru' ? 'Вход для партнёров - клиники' : locale === 'ar' ? 'دخول الشركاء - العيادات' : 'Partner Access - Clinics'}
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}
