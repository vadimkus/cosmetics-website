'use client'

/**
 * Homepage hero.
 *
 * Reworked onto the editorial system in Aug 2026: the display serif, the house
 * eyebrow and the `ed-cta` / `ed-ghost` pair come from editorial.css, so the
 * hero, the rails below it and every brand page now read as one site. What was
 * here before was bold sans on a grey gradient with two outlined red buttons,
 * which matched nothing else on the page.
 *
 * Behaviour is unchanged: the PWA login branch, the login modal, the 3D visual
 * and the store badges all work as they did. Only the styling moved.
 *
 * The mobile block still exists for `?full=true` - MobileRedirect sends phone
 * traffic to /products, but the opt-in full homepage has to hold up.
 */

import '@/components/product/cerabarrier/cerabarrier.css'
import '@/components/editorial/editorial.css'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAnimationStore } from '@/lib/animationStore'
import { useAuth } from './auth/AuthProvider'
import LoginModal from './LoginModal'
import { useState, useMemo, useCallback } from 'react'
import { getLocalizedPath } from '@/lib/i18n'
import type { Locale } from '@/lib/i18n'
import { usePWAMode } from '@/hooks/usePWAMode'
import { useTranslation } from '@/hooks/useTranslation'
import { useRouter } from 'next/navigation'
import DesktopHero3DVisual from '@/components/desktop-experience/DesktopHero3DVisual'

interface HeroProps {
  initialLocale?: Locale
  initialDir?: 'ltr' | 'rtl'
}

/** The three credentials under the hero, as figure + label. */
function heroProof(locale: Locale) {
  if (locale === 'ar') {
    return [
      { value: '+30', label: 'عيادة في الإمارات' },
      { value: 'كوريا', label: 'مستحضرات احترافية' },
      { value: '2019', label: 'الموزّع الرسمي منذ' },
    ]
  }
  if (locale === 'ru') {
    return [
      { value: '30+', label: 'клиник в ОАЭ' },
      { value: 'Корея', label: 'проф. дерматокосметика' },
      { value: '2019', label: 'официальный дистрибьютор с' },
    ]
  }
  return [
    { value: '30+', label: 'UAE clinics' },
    { value: 'Korea', label: 'Pro dermacosmetics' },
    { value: '2019', label: 'Official distributor since' },
  ]
}

/** App Store and Google Play, which are brand assets and stay on ink. */
function StoreBadges({ locale, size = 'default' }: { locale: Locale; size?: 'default' | 'compact' }) {
  const isCompact = size === 'compact'
  return (
    <div className="flex flex-wrap justify-center gap-2.5">
      <a
        href="https://apps.apple.com/ae/app/genosys-uae/id6756648064"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-full bg-[var(--cera-ink)] px-4 py-2 text-white transition-colors hover:bg-black"
        aria-label={
          locale === 'ar'
            ? 'حمّل تطبيق جينوسيس من App Store'
            : locale === 'ru'
              ? 'Скачать приложение GENOSYS в App Store'
              : 'Download GENOSYS on the App Store'
        }
      >
        <svg className={isCompact ? 'h-5 w-5' : 'h-6 w-6'} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
        </svg>
        <span className="flex flex-col leading-tight">
          <span className="text-[10px] font-normal opacity-80">
            {locale === 'ar' ? 'حمّل من' : locale === 'ru' ? 'Загрузите в' : 'Download on the'}
          </span>
          <span className="-mt-0.5 text-[15px] font-semibold">App Store</span>
        </span>
      </a>
      <a
        href="https://play.google.com/store/apps/details?id=ae.genosys.app"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-full bg-[var(--cera-ink)] px-4 py-2 text-white transition-colors hover:bg-black"
        aria-label={
          locale === 'ar'
            ? 'حمّل تطبيق جينوسيس من Google Play'
            : locale === 'ru'
              ? 'Скачать приложение GENOSYS в Google Play'
              : 'Get GENOSYS on Google Play'
        }
      >
        <svg className={isCompact ? 'h-5 w-5' : 'h-6 w-6'} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.199l2.807 1.626a1 1 0 0 1 0 1.732l-2.808 1.626L15.206 12l2.492-2.492zM5.864 2.658L16.8 8.99l-2.302 2.302-8.634-8.634z" />
        </svg>
        <span className="flex flex-col leading-tight">
          <span className="text-[10px] font-normal opacity-80">
            {locale === 'ar' ? 'متوفر على' : locale === 'ru' ? 'Доступно в' : 'GET IT ON'}
          </span>
          <span className="-mt-0.5 text-[15px] font-semibold">Google Play</span>
        </span>
      </a>
    </div>
  )
}

export default function Hero({ initialLocale = 'en', initialDir = 'ltr' }: HeroProps = {}) {
  const { user } = useAuth()
  const { enabled: animationsEnabled } = useAnimationStore()
  const { isPWA } = usePWAMode()
  const router = useRouter()
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [isLoginMode, setIsLoginMode] = useState(true)

  // Handle login click - redirect to PWA login page if in PWA mode
  const handleLoginClick = useCallback(() => {
    if (isPWA) {
      const loginPath = initialLocale === 'en' ? '/pwa-login' : `/${initialLocale}/pwa-login`
      router.push(loginPath)
    } else {
      setShowLoginModal(true)
    }
  }, [isPWA, initialLocale, router])

  // Messages come from MessagesProvider (populated server-side from the
  // x-pathname header). The `initialLocale` / `initialDir` props are kept
  // for backward compatibility and as a fallback when the provider is out
  // of scope (e.g. template previews, tests).
  const { t, locale: hookLocale, dir: hookDir } = useTranslation()
  const locale = hookLocale ?? initialLocale
  const dir = hookDir ?? initialDir
  const isRtl = dir === 'rtl'

  // Memoize localized paths to ensure stable href values (prevents hydration mismatch)
  const productsPath = useMemo(() => getLocalizedPath('/products', locale), [locale])
  const skinAnalysisPath = useMemo(() => getLocalizedPath('/skin-recommendation', locale), [locale])

  // Memoize translation strings to ensure stable content
  const titleText = useMemo(() => t('hero.title'), [t])
  const titleHighlightText = useMemo(() => t('hero.titleHighlight'), [t])
  const subtitleText = useMemo(() => t('hero.subtitle'), [t])
  const startAnalysisText = useMemo(() => t('hero.startAnalysis'), [t])
  const shopProductsText = useMemo(() => t('hero.shopProducts'), [t])
  const signInToShopText = useMemo(() => t('hero.signInToShop'), [t])
  const socialProofText = useMemo(() => t('hero.socialProof'), [t])

  const eyebrowText =
    locale === 'ar'
      ? 'مستحضرات تجميل كورية احترافية · منذ 2019'
      : locale === 'ru'
        ? 'Корейская профессиональная дерматокосметика · с 2019'
        : 'Trusted Korean dermacosmetics · Since 2019'

  const proof = heroProof(locale)

  return (
    <section className="flex-1 md:pb-14 md:pt-12" dir={dir}>
      <div className="container mx-auto px-3 md:px-4">
        {/* ─────────────────────────── Mobile ─────────────────────────────── */}
        <div className="flex flex-col md:hidden">
          <motion.div
            className="pb-3 pt-4 text-center"
            initial={animationsEnabled ? { opacity: 0, y: 30 } : {}}
            animate={animationsEnabled ? { opacity: 1, y: 0 } : {}}
            transition={animationsEnabled ? { duration: 0.6, ease: 'easeOut' } : {}}
          >
            <p className="cera-eyebrow mb-3">{eyebrowText}</p>
            {/*
              Mobile Hero heading - intentionally an H2 (not H1) so the page
              has a single authoritative H1, which lives in the desktop block
              below. Mobile visitors are redirected to /products by
              MobileRedirect before this matters; keeping H2 here avoids a
              duplicate-H1 signal for crawlers that don't execute the JS
              redirect (mostly AI / LLM crawlers like GPTBot / ClaudeBot).
            */}
            <motion.h2
              className="cera-serif text-[32px] leading-[1.06]"
              initial={animationsEnabled ? { opacity: 0, y: 20 } : {}}
              animate={animationsEnabled ? { opacity: 1, y: 0 } : {}}
              transition={animationsEnabled ? { duration: 0.6, delay: 0.2, ease: 'easeOut' } : {}}
            >
              {titleText}
              <motion.span
                className="text-[var(--cera-rose-ink)]"
                initial={animationsEnabled ? { opacity: 0, scale: 0.8 } : {}}
                animate={animationsEnabled ? { opacity: 1, scale: 1 } : {}}
                transition={animationsEnabled ? { duration: 0.6, delay: 0.4, ease: 'easeOut' } : {}}
              >
                {' '}
                {titleHighlightText}
              </motion.span>
            </motion.h2>
          </motion.div>

          {/* Hero visual - mobile.
              Intentionally a static image (not a <video>) to keep
              mobile LCP fast on 4G. The desktop layout below still
              renders the 12 MB loop video; mobile users generally
              get redirected to /products by <MobileRedirect> anyway,
              so the loop video is unnecessary here and was the
              single biggest mobile payload on this route. */}
          <div className="relative mb-5">
            <div className="cera-stage relative aspect-[16/10] w-full overflow-hidden rounded-[20px]">
              <Image
                src="/images/genosys-video-poster.jpg"
                alt="GENOSYS Korean dermacosmetics hero"
                fill
                priority
                fetchPriority="high"
                sizes="100vw"
                className="object-cover"
              />
            </div>
          </div>

          <div className="px-1 text-center">
            <div className="mb-4 flex justify-center">
              <Image
                src="/images/genosys-logo.png"
                alt="GENOSYS - Official Korean Dermacosmetics Distributor UAE"
                width={120}
                height={48}
                className="h-11 w-auto"
                priority
              />
            </div>

            <p className="mx-auto mb-5 max-w-[46ch] text-[15px] leading-relaxed text-[var(--cera-muted)]">
              {subtitleText}
            </p>

            {/* AI skin analysis is primary; min-height keeps the 44pt touch target. */}
            <div className="mb-4 flex flex-col gap-2.5">
              <Link href={skinAnalysisPath} className="ed-cta min-h-[48px] px-6 py-3 text-[15px]">
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                {startAnalysisText}
              </Link>

              {user ? (
                <Link href={productsPath} className="ed-ghost min-h-[48px] px-6 py-3 text-[15px]">
                  {shopProductsText}
                  <ArrowRight className={`h-4 w-4 ${isRtl ? 'rotate-180' : ''}`} aria-hidden="true" />
                </Link>
              ) : (
                <button onClick={handleLoginClick} className="ed-ghost min-h-[48px] w-full px-6 py-3 text-[15px]">
                  {signInToShopText}
                  <ArrowRight className={`h-4 w-4 ${isRtl ? 'rotate-180' : ''}`} aria-hidden="true" />
                </button>
              )}
            </div>

            <p className="mb-5 text-[12.5px] leading-relaxed text-[var(--cera-muted)]">{socialProofText}</p>

            <StoreBadges locale={locale} size="compact" />
          </div>
        </div>

        {/* ─────────────────────────── Desktop ────────────────────────────── */}
        <div className="hidden text-center md:block">
          <p className="cera-eyebrow mb-4">{eyebrowText}</p>

          <h1 className="cera-serif mx-auto max-w-[18ch] text-[46px] leading-[1.02] lg:text-[64px]">
            {titleText}
            <span className="text-[var(--cera-rose-ink)]"> {titleHighlightText}</span>
          </h1>

          <p className="mx-auto mt-5 max-w-[58ch] text-[16px] leading-relaxed text-[var(--cera-muted)] lg:text-[17px]">
            {subtitleText}
          </p>

          {/* CTAs sit above the visual now. They used to be three screens of
              hero furniture below it, which put the primary action under the
              fold on a laptop. */}
          <div className={`mt-7 flex items-center justify-center gap-3 ${isRtl ? 'flex-row-reverse' : ''}`}>
            <Link href={skinAnalysisPath} className="ed-cta px-7 py-3.5 text-[15px]">
              <Sparkles className="h-[18px] w-[18px]" aria-hidden="true" />
              {startAnalysisText}
            </Link>

            {user ? (
              <Link href={productsPath} className="ed-ghost px-7 py-3.5 text-[15px]">
                {shopProductsText}
                <ArrowRight className={`h-[18px] w-[18px] ${isRtl ? 'rotate-180' : ''}`} aria-hidden="true" />
              </Link>
            ) : (
              <button onClick={handleLoginClick} className="ed-ghost px-7 py-3.5 text-[15px]">
                {signInToShopText}
                <ArrowRight className={`h-[18px] w-[18px] ${isRtl ? 'rotate-180' : ''}`} aria-hidden="true" />
              </button>
            )}
          </div>

          <p className="mt-4 text-[13px] text-[var(--cera-muted)]">{socialProofText}</p>

          {/* Static portrait with the atom field over it. */}
          <div className="mt-10 flex justify-center">
            <DesktopHero3DVisual />
          </div>

          {/* Three credentials as hairline-divided figures, the same device the
              /delivery page uses for its four facts. */}
          <dl className="mx-auto mt-10 flex max-w-3xl items-start justify-center">
            {proof.map((item, i) => (
              <div
                key={item.label}
                className={`px-8 text-center ${i > 0 ? 'border-s border-[var(--cera-line)]' : ''}`}
              >
                <dd className="cera-numeral text-[26px] leading-none text-[var(--cera-ink)]">{item.value}</dd>
                <dt className="mt-2 text-[12.5px] leading-tight text-[var(--cera-muted)]">{item.label}</dt>
              </div>
            ))}
          </dl>

          {/* The badges read as a second channel, not a third CTA. */}
          <div className="mt-10 flex flex-col items-center gap-3">
            <span className="cera-eyebrow">
              {locale === 'ar' ? 'تفضّل التطبيق؟' : locale === 'ru' ? 'Предпочитаете приложение?' : 'Prefer the app?'}
            </span>
            <StoreBadges locale={locale} />
          </div>
        </div>
      </div>

      {/* Login Modal */}
      {showLoginModal && (
        <LoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          isLoginMode={isLoginMode}
          setIsLoginMode={setIsLoginMode}
        />
      )}
    </section>
  )
}
