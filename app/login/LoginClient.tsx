'use client'

/**
 * /login — sign in and create account.
 *
 * Reworked onto the editorial system in Aug 2026, after /cart, /checkout and
 * /success.
 *
 * THE REAL DEFECT HERE WAS NOT THE COLOUR. The page carried two complete and
 * separately maintained implementations of the same form — a mobile branch
 * gated on useIsMobile and a desktop branch — roughly 450 duplicated lines
 * that had drifted apart in ways a user could feel:
 *
 *   - mobile put labels above the fields, desktop was placeholder-only;
 *   - mobile used a hand-rolled consent checkbox, desktop a native one with an
 *     expandable policy box;
 *   - mobile rendered Google's G as a red letter and Apple's button in grey,
 *     desktop used the correct multicolour mark and black;
 *   - mobile disabled the submit button until the privacy box was ticked EVEN
 *     WHEN SIGNING IN, desktop did not.
 *
 * There is now one responsive implementation. Desktop keeps the split brand
 * panel; below lg it simply drops away.
 *
 * ONE DELIBERATE BEHAVIOUR CHANGE: privacy consent is now required for
 * REGISTRATION ONLY, which is what the desktop branch always did. Asking an
 * existing customer to re-consent before they can sign in is friction that
 * collects nothing meaningful — they consented when they registered. Consent
 * remains mandatory to create an account, and the OAuth buttons no longer
 * refuse to run in sign-in mode.
 *
 * Everything else is preserved exactly: the PWA redirect, the Google/Apple
 * OAuth callback handling, the promo-code capture, the safe internal redirect,
 * the partner-portal modal and its separate submit path, the email domain
 * suggestion, and the registration validation order.
 */

import '@/components/product/cerabarrier/cerabarrier.css'
import '@/components/editorial/editorial.css'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Eye, EyeOff, Gift, ChevronDown, Check, X } from 'lucide-react'
import { IconCertified, IconSecureCheckout, IconHeritage } from '@/components/icons/BrandIcons'
import { useAuth } from '@/components/auth/AuthProvider'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation } from '@/hooks/useTranslation'
import { getLocalizedPath } from '@/lib/i18n'
import { EMIRATES } from '@/lib/emirates'
import { usePWAMode } from '@/hooks/usePWAMode'
import EmailDomainSuggestion from '@/components/auth/EmailDomainSuggestion'
import {
  isEmailAddressSyntaxValid,
  normalizeEmailAddress,
  suggestEmailAddressCorrection,
} from '@/lib/emailAddressValidation'
import { getLocalTodayYmd } from '@/lib/validation'
import { ceraSerif } from '@/components/product/cerabarrier/ceraFont'

/** 16px on every control: anything smaller makes iOS Safari zoom on focus. */
const FIELD = 'ed-field !text-[16px]'

export default function LoginClient() {
  const { user, login, register, loginWithGoogle, loginWithApple, isLoading, forceRefreshUser } = useAuth()
  const [isLoginMode, setIsLoginMode] = useState(true)
  const [promoCode, setPromoCode] = useState<string>('')
  const router = useRouter()
  const { t, locale, dir } = useTranslation()
  const { isPWA, isClient: isPWAClient } = usePWAMode()
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
  const [confirmedEmail, setConfirmedEmail] = useState<string | null>(null)
  const normalizedPromo = String(promoCode || '').trim().toUpperCase()
  const maxBirthday = getLocalTodayYmd()

  // Dedicated partner (clinic) login modal — same credentials, lands in the
  // Partner Portal instead of the shop.
  const [showPartnerLogin, setShowPartnerLogin] = useState(false)
  const [partnerForm, setPartnerForm] = useState({ email: '', password: '' })
  const [partnerError, setPartnerError] = useState('')
  const [partnerSubmitting, setPartnerSubmitting] = useState(false)
  const [showPartnerPassword, setShowPartnerPassword] = useState(false)
  const [partnerLoginUsed, setPartnerLoginUsed] = useState(false)

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

      // /login?partner=1 → open the dedicated partner login modal directly
      // (used by the header LoginModal's Partner Access button).
      if (searchParams.get('partner') === '1') {
        setShowPartnerLogin(true)
      }
    }
  }, [router, locale, forceRefreshUser, t])

  // Safe internal post-login redirect (e.g. /login?redirect=/partner-portal
  // set by PartnerGuard or the Partner Access link below).
  const getSafeRedirect = (): string | null => {
    if (typeof window === 'undefined') return null
    const r = new URLSearchParams(window.location.search).get('redirect')
    if (r && r.startsWith('/') && !r.startsWith('//') && !r.includes(':')) return r
    return null
  }

  useEffect(() => {
    if (user) {
      const dest = partnerLoginUsed ? '/partner-portal' : (getSafeRedirect() || '/products')
      router.push(getLocalizedPath(dest, locale))
    }
  }, [user, router, locale, partnerLoginUsed])

  const handlePartnerSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setPartnerError('')
    const email = partnerForm.email.trim()
    if (!email || !partnerForm.password) {
      setPartnerError(locale === 'ru' ? 'Введите email и пароль' : locale === 'ar' ? 'أدخل البريد وكلمة المرور' : 'Enter your email and password')
      return
    }
    setPartnerSubmitting(true)
    setPartnerLoginUsed(true)
    try {
      const success = await login(email, partnerForm.password)
      if (!success) {
        setPartnerLoginUsed(false)
        setPartnerError(
          locale === 'ru'
            ? 'Неверный email или пароль. Используйте данные вашего аккаунта GENOSYS.'
            : locale === 'ar'
              ? 'بريد إلكتروني أو كلمة مرور غير صحيحة. استخدم بيانات حساب GENOSYS الخاص بك.'
              : 'Incorrect email or password. Please use your GENOSYS account credentials.'
        )
      }
      // Success: the user effect above routes straight to /partner-portal.
    } finally {
      setPartnerSubmitting(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (name === 'email') setConfirmedEmail(null)
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
      const normalizedEmail = normalizeEmailAddress(formData.email)
      if (!isEmailAddressSyntaxValid(normalizedEmail)) { setError(t('login.emailInvalid')); return }
      if (suggestEmailAddressCorrection(normalizedEmail) && confirmedEmail !== normalizedEmail) {
        setError(t('login.emailSuggestionRequired'))
        return
      }
      if (!formData.password.trim()) { setError(t('login.passwordRequired')); return }
      if (formData.password.length < 8) { setError(t('login.passwordMinLength')); return }
      if (!formData.phone.trim()) { setError(t('login.phoneRequired')); return }
      if (!formData.address.trim()) { setError(t('login.addressRequired')); return }
      if (!formData.emirate.trim()) { setError(t('login.emirateRequired')); return }
      if (!privacyConsent) { setError(t('login.privacyConsentRequired')); return }

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

  const handleLanguageChange = (newLocale: 'en' | 'ar' | 'ru') => {
    setShowLangDropdown(false)
    router.push(getLocalizedPath('/login', newLocale))
  }

  const currentLangCode = locale === 'ar' ? 'AR' : locale === 'ru' ? 'RU' : 'EN'

  const copy = {
    valuePropTitle: locale === 'ar' ? 'إنشاء حساب — دقيقة واحدة'
      : locale === 'ru' ? 'Создание аккаунта — 1 минута'
      : 'Create account — 1 minute',
    valuePropBody: locale === 'ar' ? 'تتبّع الطلبات، شحن مجاني فوق 1000 درهم، وعروض حصرية للعملاء المحترفين.'
      : locale === 'ru' ? 'Отслеживание заказов, бесплатная доставка от 1000 AED и закрытые цены для профи.'
      : 'Order tracking, free shipping over AED 1,000, and exclusive pricing for pros.',
    partnerPortal: locale === 'ru' ? 'Портал партнёра' : locale === 'ar' ? 'بوابة الشركاء' : 'Partner Portal',
    partnerAccess: locale === 'ru' ? 'Вход для партнёров — клиники' : locale === 'ar' ? 'دخول الشركاء — العيادات' : 'Partner Access — Clinics',
  }

  // ─────────────────────── Partner login modal ────────────────────────
  const partnerLoginModal = showPartnerLogin ? (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[var(--cera-ink)]/75 px-4 backdrop-blur-sm"
      onClick={() => setShowPartnerLogin(false)}
    >
      <div
        className={`w-full max-w-sm rounded-[28px] border border-[var(--cera-line)] bg-white p-7 shadow-2xl ${ceraSerif.variable}`}
        dir={dir}
        onClick={e => e.stopPropagation()}
      >
        <div className="relative mb-1">
          <button
            type="button"
            onClick={() => setShowPartnerLogin(false)}
            className={`absolute top-0 ${isRTL ? 'left-0' : 'right-0'} flex h-8 w-8 items-center justify-center rounded-full text-[var(--cera-muted)] transition-colors hover:bg-[var(--cera-cream-deep)] hover:text-[var(--cera-ink)]`}
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="flex flex-col items-center pt-1">
            <Image
              src="/images/genosys-wordmark-transparent.png"
              alt="GENOSYS"
              width={977}
              height={210}
              className="h-7 w-auto"
            />
            <span className="mt-2 block text-[10px] font-semibold uppercase tracking-[0.25em] text-[var(--cera-rose)]">
              {copy.partnerPortal}
            </span>
          </div>
        </div>

        <h2 className="cera-serif mt-4 text-center text-[22px] leading-tight text-[var(--cera-ink)]">
          {locale === 'ru' ? 'Вход для клиник и салонов' : locale === 'ar' ? 'دخول العيادات والصالونات' : 'Clinic & Salon Login'}
        </h2>
        <p className="mb-5 mt-2 text-center text-[13px] leading-relaxed text-[var(--cera-muted)]">
          {locale === 'ru'
            ? 'Войдите с данными вашего аккаунта GENOSYS. Доступ к порталу предоставляется индивидуально — для подключения напишите на sales@genosys.ae.'
            : locale === 'ar'
              ? 'سجّل الدخول ببيانات حساب GENOSYS الخاص بك. يُمنح الوصول إلى البوابة بشكل فردي — للتفعيل راسلنا على sales@genosys.ae.'
              : 'Sign in with your GENOSYS account credentials. Partner access is assigned individually — to request access, contact sales@genosys.ae.'}
        </p>

        <form onSubmit={handlePartnerSubmit} className="space-y-3">
          <input
            type="email"
            value={partnerForm.email}
            onChange={e => { setPartnerForm(p => ({ ...p, email: e.target.value })); setPartnerError('') }}
            placeholder={locale === 'ru' ? 'Email клиники' : locale === 'ar' ? 'بريد العيادة' : 'Clinic email'}
            autoComplete="email"
            dir="ltr"
            className={FIELD}
          />
          <div className="relative">
            <input
              type={showPartnerPassword ? 'text' : 'password'}
              value={partnerForm.password}
              onChange={e => { setPartnerForm(p => ({ ...p, password: e.target.value })); setPartnerError('') }}
              placeholder={locale === 'ru' ? 'Пароль' : locale === 'ar' ? 'كلمة المرور' : 'Password'}
              autoComplete="current-password"
              dir="ltr"
              className={`${FIELD} ${isRTL ? 'ps-11' : 'pe-11'}`}
            />
            <button
              type="button"
              onClick={() => setShowPartnerPassword(v => !v)}
              className={`absolute top-1/2 -translate-y-1/2 text-[var(--cera-muted)] transition-colors hover:text-[var(--cera-ink)] ${isRTL ? 'left-3' : 'right-3'}`}
              aria-label="Toggle password visibility"
            >
              {showPartnerPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          {partnerError && (
            <p className="text-[13px] font-medium leading-relaxed text-[var(--cera-rose-ink)]">{partnerError}</p>
          )}

          <button
            type="submit"
            disabled={partnerSubmitting || isLoading}
            className="ed-cta w-full py-3.5 text-[15px]"
          >
            {partnerSubmitting
              ? (locale === 'ru' ? 'Входим…' : locale === 'ar' ? 'جارٍ الدخول…' : 'Signing in…')
              : (locale === 'ru' ? 'Войти в портал партнёра' : locale === 'ar' ? 'دخول بوابة الشركاء' : 'Enter Partner Portal')}
          </button>
        </form>

        <a
          href="mailto:sales@genosys.ae?subject=Partner%20Portal%20Access%20Request"
          className="mt-4 block text-center text-[12.5px] text-[var(--cera-muted)] transition-colors hover:text-[var(--cera-rose-ink)]"
        >
          {locale === 'ru'
            ? 'Запросить партнёрский доступ — sales@genosys.ae'
            : locale === 'ar'
              ? 'طلب وصول الشركاء — sales@genosys.ae'
              : 'Request partner access — sales@genosys.ae'}
        </a>
      </div>
    </div>
  ) : null

  const partnerAccessButton = (
    <button
      type="button"
      onClick={() => { setShowPartnerLogin(true); setPartnerError('') }}
      className={`ed-ghost mt-4 w-full py-3 text-[13.5px] uppercase tracking-[0.08em] ${isRTL ? 'flex-row-reverse' : ''}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-[var(--cera-rose)]" aria-hidden="true" />
      {copy.partnerAccess}
    </button>
  )

  // ───────────────────────── Already signed in ─────────────────────────
  if (user) {
    return (
      <div className={`cera-page genosys-page ${ceraSerif.variable} min-h-[100dvh]`} dir={dir}>
        <div className="mx-auto max-w-md px-4 py-16 text-center sm:px-6 md:py-24">
          <span className="ed-mark ed-mark--tactile ed-mark--round mx-auto h-14 w-14" aria-hidden="true">
            <Check className="h-6 w-6" strokeWidth={2} />
          </span>
          <h1 className="cera-serif mt-5 text-[28px] leading-tight text-[var(--cera-ink)] md:text-[36px]">
            {t('login.alreadyLoggedIn')}
          </h1>
          <p className="mt-3 text-[14.5px] text-[var(--cera-muted)]">
            {t('login.loggedInAs')} <span dir="ltr">{user.email}</span>
          </p>
          <Link
            href={getLocalizedPath('/products', locale)}
            className="ed-cta mt-7 px-8 py-3.5 text-[15px]"
          >
            {t('login.continueToProducts')}
          </Link>
        </div>
      </div>
    )
  }

  // ─────────────────────────── Shared pieces ───────────────────────────
  const socialButtons = (
    <div className="space-y-2.5">
      <button
        type="button"
        onClick={() => loginWithGoogle()}
        disabled={isLoading}
        className={`ed-ghost w-full py-3 text-[14.5px] disabled:opacity-50 ${isRTL ? 'flex-row-reverse' : ''}`}
      >
        <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" aria-hidden="true">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
        {t('login.signInWithGoogle')}
      </button>

      <button
        type="button"
        onClick={() => loginWithApple()}
        disabled={isLoading}
        className={`ed-cta w-full py-3 text-[14.5px] disabled:opacity-50 ${isRTL ? 'flex-row-reverse' : ''}`}
      >
        <svg className="h-[18px] w-[18px]" viewBox="0 0 814 1000" aria-hidden="true">
          <path fill="currentColor" d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76.5 0-103.7 40.8-165.9 40.8s-105.6-57-155.5-127C46.7 790.7 0 663 0 541.8c0-194.4 126.4-297.5 250.8-297.5 66.1 0 121.2 43.4 162.7 43.4 39.5 0 101.1-46 176.3-46 28.5 0 130.9 2.6 198.3 99.2zm-234-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z" />
        </svg>
        {t('login.signInWithApple')}
      </button>

      <div className="grid grid-cols-2 gap-2.5">
        <a
          href="https://apps.apple.com/ae/app/genosys-uae/id6756648064"
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t('login.downloadAppApple')}
          className={`ed-ghost py-2.5 text-[12.5px] ${isRTL ? 'flex-row-reverse' : ''}`}
        >
          <svg className="h-4 w-4" viewBox="0 0 814 1000" aria-hidden="true">
            <path fill="currentColor" d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76.5 0-103.7 40.8-165.9 40.8s-105.6-57-155.5-127C46.7 790.7 0 663 0 541.8c0-194.4 126.4-297.5 250.8-297.5 66.1 0 121.2 43.4 162.7 43.4 39.5 0 101.1-46 176.3-46 28.5 0 130.9 2.6 198.3 99.2zm-234-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z" />
          </svg>
          App Store
        </a>
        <a
          href="https://play.google.com/store/apps/details?id=ae.genosys.app"
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t('login.downloadAppGoogle')}
          className={`ed-ghost py-2.5 text-[12.5px] ${isRTL ? 'flex-row-reverse' : ''}`}
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.199l2.807 1.626a1 1 0 0 1 0 1.732l-2.808 1.626L15.206 12l2.492-2.492zM5.864 2.658L16.8 8.99l-2.302 2.302-8.634-8.634z" />
          </svg>
          Google Play
        </a>
      </div>

      <div className="flex items-center gap-4 pt-1">
        <span className="h-px flex-1 bg-[var(--cera-line)]" />
        <span className="text-[12px] lowercase text-[var(--cera-muted)]">{t('login.or')}</span>
        <span className="h-px flex-1 bg-[var(--cera-line)]" />
      </div>
    </div>
  )

  return (
    <div
      className={`cera-page genosys-page ${ceraSerif.variable} lg:grid lg:min-h-[calc(100dvh-64px)] lg:grid-cols-2`}
      dir={dir}
    >
      {/* ─── Brand panel, lg and up ───────────────────────────────────────
          Ink rather than the old grey-to-maroon gradient with blur blobs:
          the editorial system already uses ink for its primary action, so a
          full ink panel reads as the same family rather than a stock SaaS
          hero. */}
      <aside
        className="relative hidden flex-col justify-between overflow-hidden bg-[var(--cera-ink)] p-12 text-white lg:flex xl:p-16"
        aria-hidden="true"
      >
        <div>
          <Image
            src="/images/genosys-wordmark-transparent.png"
            alt="GENOSYS"
            width={977}
            height={210}
            priority
            className="h-11 w-auto brightness-0 invert"
          />
          <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/45">
            {locale === 'ar'
              ? 'الموزع الرسمي في الإمارات'
              : locale === 'ru'
              ? 'Официальный дистрибьютор в ОАЭ'
              : 'Official UAE distributor'}
          </p>
        </div>

        <div className="max-w-md">
          {/* cerabarrier.css sets `.cera-page :where(h1,h2,h3) { color: ink }`
              outside any layer, so it beats Tailwind's layered text-white and
              paints the heading ink-on-ink. The bang is the cheap way out. */}
          <h2 className="cera-serif !text-white text-[40px] leading-[1.08] xl:text-[48px]">
            {locale === 'ar'
              ? 'سجّل دخولك إلى عالم GENOSYS'
              : locale === 'ru'
              ? 'Войдите в мир GENOSYS'
              : 'Sign in to the GENOSYS world.'}
          </h2>
          <p className="mt-5 text-[15.5px] leading-relaxed text-white/65">
            {locale === 'ar'
              ? 'مستحضرات تجميل كورية احترافية، تتبع الطلبات، ومزايا حصرية — من موزّع GENOSYS الرسمي في الإمارات.'
              : locale === 'ru'
              ? 'Профессиональная корейская косметика, отслеживание заказов и эксклюзивные привилегии — от официального дистрибьютора GENOSYS в ОАЭ.'
              : 'Professional Korean dermacosmetics, order tracking, and insider perks — from the official GENOSYS distributor in the UAE.'}
          </p>

          <ul className="mt-9 space-y-3.5">
            {[
              locale === 'ar' ? 'منتجات أصلية 100%' : locale === 'ru' ? '100% оригинальная продукция' : '100% authentic GENOSYS products',
              locale === 'ar' ? 'شحن مجاني للطلبات فوق 1000 درهم' : locale === 'ru' ? 'Бесплатная доставка от 1000 AED' : 'Free shipping on orders over 1000 AED',
              locale === 'ar' ? 'مزايا حصرية للعيادات والمتخصصين' : locale === 'ru' ? 'Эксклюзивные условия для клиник и специалистов' : 'Exclusive pricing for clinics and professionals',
            ].map((line, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-[3px] flex h-[18px] w-[18px] flex-none items-center justify-center rounded-full bg-white/10">
                  <Check className="h-[11px] w-[11px] text-white/80" strokeWidth={3} />
                </span>
                <span className="text-[14.5px] leading-snug text-white/75">{line}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center gap-6 text-[12px] text-white/45">
          <span className="inline-flex items-center gap-1.5">
            <IconCertified className="h-4 w-4" />
            {locale === 'ar' ? 'معتمد TDRA' : locale === 'ru' ? 'TDRA сертифицирован' : 'TDRA certified'}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <IconSecureCheckout className="h-4 w-4" />
            {locale === 'ar' ? 'دفع آمن' : locale === 'ru' ? 'Безопасная оплата' : 'Secure checkout'}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <IconHeritage className="h-4 w-4" />
            {locale === 'ar' ? 'منذ 2019' : locale === 'ru' ? 'С 2019 года' : 'Since 2019'}
          </span>
        </div>
      </aside>

      {/* ─── Form panel ───────────────────────────────────────────────── */}
      <div className="flex flex-col justify-center px-4 py-8 sm:px-6 lg:px-10 lg:py-12 xl:px-16">
        {/* Below lg the brand panel is gone and the site header is bare, so
            the breadcrumb, back link and language switcher live here. */}
        <div className="mb-6 lg:hidden">
          <div className={`flex items-center justify-between gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[13px] text-[var(--cera-muted)]">
              <Link href={getLocalizedPath('/', locale)} className="transition-colors hover:text-[var(--cera-rose-ink)]">
                {t('common.home')}
              </Link>
              <span aria-hidden="true">/</span>
              <span className="text-[var(--cera-ink)]">{t('common.login')}</span>
            </nav>

            <div className="relative">
              <button
                type="button"
                onClick={() => setShowLangDropdown(!showLangDropdown)}
                className="flex items-center gap-1 text-[13px] font-semibold text-[var(--cera-rose-ink)]"
              >
                {currentLangCode}
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
              {showLangDropdown && (
                <div className={`absolute top-full z-50 mt-1.5 min-w-[110px] overflow-hidden rounded-xl border border-[var(--cera-line)] bg-white shadow-lg ${isRTL ? 'left-0' : 'right-0'}`}>
                  {([['en', 'English'], ['ru', 'Русский'], ['ar', 'العربية']] as const).map(([code, label]) => (
                    <button
                      key={code}
                      type="button"
                      onClick={() => handleLanguageChange(code)}
                      className={`block w-full px-4 py-2.5 text-start text-[13.5px] transition-colors hover:bg-[var(--cera-cream)] ${
                        locale === code ? 'bg-[var(--cera-blush)] font-semibold text-[var(--cera-rose-ink)]' : 'text-[var(--cera-body)]'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <Link
            href={getLocalizedPath('/', locale)}
            className={`mt-3 inline-flex items-center gap-1.5 text-[13px] text-[var(--cera-muted)] transition-colors hover:text-[var(--cera-rose-ink)] ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            <ArrowLeft className={`h-3.5 w-3.5 ${isRTL ? 'rotate-180' : ''}`} />
            {t('login.backToHome')}
          </Link>
        </div>

        <div className="mx-auto w-full max-w-[440px]">
          <div className="cera-card p-5 md:p-7">
            {/* Header */}
            <div className="text-center">
              <h1 className="cera-serif text-[26px] leading-tight text-[var(--cera-ink)] md:text-[30px]">
                {isLoginMode ? t('login.professionalLogin') : t('login.professionalAccount')}
              </h1>
              <p className="mt-1.5 text-[13px] text-[var(--cera-muted)]">{t('login.unitedArabEmirates')}</p>
            </div>

            <div className="mt-6 space-y-4">
              {error && (
                <p
                  role="alert"
                  className="rounded-xl border border-[var(--cera-blush-deep)] bg-[var(--cera-blush)] px-3.5 py-2.5 text-[13.5px] leading-relaxed text-[var(--cera-rose-ink)]"
                >
                  {error}
                </p>
              )}

              {!isLoginMode && (
                <div className="rounded-xl border border-[var(--cera-line)] bg-[var(--cera-cream)] px-4 py-3">
                  <p className="text-[10.5px] font-semibold uppercase tracking-[0.1em] text-[var(--cera-rose-ink)]">
                    {copy.valuePropTitle}
                  </p>
                  <p className="mt-1 text-[12.5px] leading-relaxed text-[var(--cera-body)]">{copy.valuePropBody}</p>
                </div>
              )}

              {/* Social sign-in is offered on Sign In only. Create Account is
                  deliberately form-only so users commit to one clear path. */}
              {isLoginMode && socialButtons}

              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLoginMode && normalizedPromo && (
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2.5">
                    <p className="text-[12.5px] font-semibold text-emerald-800">{t('errors.promoApplied')}</p>
                    <p dir="ltr" className="text-[12.5px] text-emerald-700">{normalizedPromo}</p>
                  </div>
                )}

                {!isLoginMode && (
                  <div>
                    <label htmlFor="name" className="ed-label">{t('authScreen.fullNameLabel')} *</label>
                    <input
                      id="name"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder={t('authScreen.fullNamePlaceholder')}
                      className={FIELD}
                      required
                      dir={dir}
                    />
                  </div>
                )}

                <div>
                  <label htmlFor="email" className="ed-label">
                    {t('authScreen.emailLabel') || 'Email'}{isLoginMode ? '' : ' *'}
                  </label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder={t('login.emailAddressPlaceholder')}
                    className={FIELD}
                    required
                    autoComplete="email"
                    dir="ltr"
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
                  <>
                    <div>
                      <label htmlFor="phone" className="ed-label">{t('login.uaePhoneNumber')} *</label>
                      <input
                        id="phone"
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={FIELD}
                        required
                        autoComplete="tel"
                        dir="ltr"
                      />
                    </div>
                    <div>
                      <label htmlFor="address" className="ed-label">{t('login.uaeAddress')} *</label>
                      <input
                        id="address"
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className={FIELD}
                        required
                        autoComplete="street-address"
                        dir={dir}
                      />
                    </div>
                    <div>
                      <label htmlFor="emirate" className="ed-label">{t('login.selectEmirate')} *</label>
                      <select
                        id="emirate"
                        name="emirate"
                        value={formData.emirate}
                        onChange={handleInputChange}
                        className={`${FIELD} ${formData.emirate ? '' : 'text-[var(--cera-muted)]'}`}
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
                    <div>
                      <label htmlFor="birthday" className="ed-label">{t('login.birthday')}</label>
                      <input
                        id="birthday"
                        type="date"
                        name="birthday"
                        value={formData.birthday}
                        onChange={handleInputChange}
                        max={maxBirthday}
                        className={`${FIELD} ${formData.birthday ? '' : 'text-[var(--cera-muted)]'}`}
                      />
                      <p className={`mt-1.5 flex items-center gap-1.5 text-[12px] text-[var(--cera-muted)] ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <Gift className="h-3 w-3 flex-none text-[var(--cera-rose)]" aria-hidden="true" />
                        {t('login.birthdayMessage')}
                      </p>
                    </div>
                  </>
                )}

                <div>
                  <label htmlFor="password" className="ed-label">{t('authScreen.passwordLabel') || 'Password'}</label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder={t('login.passwordPlaceholder')}
                      className={`${FIELD} ${isRTL ? 'ps-11' : 'pe-11'}`}
                      required
                      autoComplete={isLoginMode ? 'current-password' : 'new-password'}
                      dir="ltr"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      className={`absolute top-1/2 -translate-y-1/2 text-[var(--cera-muted)] transition-colors hover:text-[var(--cera-ink)] ${isRTL ? 'left-3.5' : 'right-3.5'}`}
                    >
                      {showPassword ? <EyeOff className="h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}
                    </button>
                  </div>
                </div>

                {isLoginMode && (
                  <div className={isRTL ? 'text-left' : 'text-right'}>
                    <Link
                      href={getLocalizedPath('/forgot-password', locale)}
                      className="text-[13px] font-medium text-[var(--cera-rose-ink)] hover:underline"
                    >
                      {t('login.forgotPassword')}
                    </Link>
                  </div>
                )}

                {/* Consent is required to create an account, and only then. */}
                {!isLoginMode && (
                  <div className="space-y-3">
                    <div className="rounded-xl border border-[var(--cera-line)] bg-[var(--cera-cream)] p-3.5">
                      <div className={`flex items-center justify-between gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <h2 className="text-[13px] font-semibold text-[var(--cera-ink)]">{t('login.privacyPolicy')}</h2>
                        <button
                          type="button"
                          onClick={() => setShowPrivacyPolicy(!showPrivacyPolicy)}
                          className="flex-none text-[12px] font-medium text-[var(--cera-rose-ink)] underline"
                        >
                          {showPrivacyPolicy ? t('login.hideDetails') : t('login.viewDetails')}
                        </button>
                      </div>
                      {showPrivacyPolicy && (
                        <p className="mt-3 max-h-40 overflow-y-auto border-t border-[var(--cera-line)] pt-3 text-[12px] leading-relaxed text-[var(--cera-body)]">
                          {t('login.privacyPolicyDescription')}
                        </p>
                      )}
                    </div>

                    <div className={`flex items-start gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <button
                        type="button"
                        role="checkbox"
                        aria-checked={privacyConsent}
                        onClick={() => setPrivacyConsent(!privacyConsent)}
                        className={`mt-[1px] flex h-[22px] w-[22px] flex-none items-center justify-center rounded-md border transition-colors ${
                          privacyConsent
                            ? 'border-[var(--cera-rose)] bg-[var(--cera-rose)] text-white'
                            : 'border-[var(--cera-line)] bg-white'
                        }`}
                      >
                        {privacyConsent && <Check className="h-3 w-3" strokeWidth={3} />}
                      </button>
                      <p className={`flex-1 text-[12.5px] leading-snug text-[var(--cera-muted)] ${isRTL ? 'text-right' : ''}`}>
                        {t('login.agreeToPrivacy')}{' '}
                        <Link
                          href={getLocalizedPath('/privacy-policy', locale)}
                          className="font-medium text-[var(--cera-rose-ink)] underline"
                        >
                          {t('login.privacyPolicy')}
                        </Link>
                      </p>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading || (!isLoginMode && !privacyConsent)}
                  className="ed-cta w-full py-3.5 text-[15px]"
                >
                  {isLoading
                    ? t('login.pleaseWait')
                    : isLoginMode
                      ? t('login.signIn')
                      : t('login.createProfessionalAccount')}
                </button>
              </form>

              <div className="border-t border-[var(--cera-line)] pt-4 text-center">
                <p className="text-[13px] text-[var(--cera-muted)]">
                  {isLoginMode ? t('login.dontHaveAccount') : t('login.alreadyHaveAccount')}
                </p>
                <button
                  type="button"
                  onClick={toggleMode}
                  className="mt-1 text-[13.5px] font-semibold text-[var(--cera-rose-ink)] hover:underline"
                >
                  {isLoginMode ? t('login.switchToCreate') : t('login.switchToLogin')}
                </button>

                {/* Partner access belongs to sign-in only, never account creation. */}
                {isLoginMode && partnerAccessButton}
              </div>
            </div>
          </div>
        </div>
      </div>

      {partnerLoginModal}
    </div>
  )
}
