'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, MapPin, ShieldCheck, Sparkles } from 'lucide-react'
import PageBreadcrumb from '@/components/PageBreadcrumb'
import { useTranslation } from '@/hooks/useTranslation'
import { getLocalizedPath } from '@/lib/i18n'
import { usePWAMode } from '@/hooks/usePWAMode'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/components/auth/AuthProvider'
import PartnersList from '@/components/partners/PartnersList'
import { partnersData } from '@/lib/partners'
import AccountAvatar from '@/components/AccountAvatar'
import '@/components/product/cerabarrier/cerabarrier.css'
import '@/components/editorial/editorial.css'

export default function PartnersPageClient() {
  const { t, locale, dir } = useTranslation()
  const { isPWA } = usePWAMode()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const [isMobileWeb, setIsMobileWeb] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) && window.innerWidth < 768
      const isPWAMode =
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as Navigator & { standalone?: boolean }).standalone === true
      setIsMobileWeb(isMobile && !isPWAMode)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const isRTL = dir === 'rtl'
  const fromProfile = searchParams?.get('from') === 'profile'
  const isAppLikeMode = isPWA || isMobileWeb

  const partnerCount = partnersData.length
  const certifiedCount = partnersData.filter((p) => p.certificateUrl).length

  const labels = {
    kicker: locale === 'ar' ? 'شبكتنا · الإمارات' : locale === 'ru' ? 'НАША СЕТЬ · ОАЭ' : 'OUR NETWORK · UAE',
    headline:
      locale === 'ar'
        ? 'شركاء GENOSYS الموثوقون'
        : locale === 'ru'
          ? 'Доверенные партнёры GENOSYS'
          : 'The GENOSYS partner network',
    subhead:
      locale === 'ar'
        ? 'صالونات وعيادات وسبا منتقاة بعناية تقدم بروتوكولات GENOSYS الكورية الاحترافية في جميع أنحاء الإمارات منذ عام 2019.'
        : locale === 'ru'
          ? 'Тщательно отобранные салоны, клиники и спа, которые проводят профессиональные корейские протоколы GENOSYS по всем ОАЭ с 2019 года.'
          : 'Hand-picked salons, clinics and spas delivering GENOSYS professional Korean protocols across the Emirates since 2019.',
    statPartners:
      locale === 'ar'
        ? 'شريك ومنشأة'
        : locale === 'ru'
          ? 'партнёров и точек'
          : 'partners & venues',
    statEmirates:
      locale === 'ar'
        ? 'كل الإمارات السبع'
        : locale === 'ru'
          ? 'все семь эмиратов'
          : 'all seven emirates',
    statCertified:
      locale === 'ar'
        ? 'موزعون معتمدون رسميًا'
        : locale === 'ru'
          ? 'официально сертифицированные реселлеры'
          : 'officially certified resellers',
    statSince: locale === 'ar' ? 'منذ' : locale === 'ru' ? 'с' : 'Since',
    ctaTitle:
      locale === 'ar'
        ? 'هل تريد أن تصبح شريكًا لـ GENOSYS؟'
        : locale === 'ru'
          ? 'Хотите стать партнёром GENOSYS?'
          : 'Become a GENOSYS partner.',
    ctaBody:
      locale === 'ar'
        ? 'نتعاون مع صالونات وعيادات وسبا تعطي الأولوية لصحة البشرة والنتائج المثبتة. تواصلوا معنا لمناقشة منتجات الفئة الاحترافية والتدريب والدعم التسويقي.'
        : locale === 'ru'
          ? 'Мы сотрудничаем с салонами, клиниками и спа, которые ставят на первое место здоровье кожи и подтверждённые результаты. Расскажем о профессиональной линейке, обучении и маркетинговой поддержке.'
          : 'We work with salons, clinics and spas that put skin health and proven results first. Talk to us about professional-grade products, training and marketing support.',
    ctaPrimary: t('common.contact') || 'Contact our team',
    ctaSecondary: t('common.products') || 'Explore products',
  }

  return (
    <div className={`cera-page genosys-page min-h-screen ${isAppLikeMode ? 'pb-32' : ''}`}>
      {/* PWA / Mobile Web Simple Navigation Header */}
      {isAppLikeMode && (
        <div className={`flex items-center justify-between px-5 py-4 bg-white border-b border-[var(--cera-line)] ${isRTL ? 'flex-row-reverse' : ''}`}>
          <button
            onClick={() => router.push(getLocalizedPath(fromProfile ? '/profile' : '/products', locale))}
            className={`flex items-center gap-1 min-w-[80px] ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            <svg className={`w-5 h-5 text-[var(--cera-rose-ink)] ${isRTL ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-base text-[var(--cera-rose-ink)]">
              {fromProfile
                ? locale === 'ar'
                  ? 'الحساب'
                  : locale === 'ru'
                    ? 'Аккаунт'
                    : 'Account'
                : locale === 'ar'
                  ? 'المنتجات'
                  : locale === 'ru'
                    ? 'Продукты'
                    : 'Products'}
            </span>
          </button>
          <span className="text-base font-semibold text-[var(--cera-ink)]">
            {locale === 'ar' ? 'الشركاء' : locale === 'ru' ? 'Партнёры' : 'Partners'}
          </span>
          <button
            onClick={() => router.push(getLocalizedPath('/profile', locale))}
            className="min-w-[80px] flex justify-end"
          >
            <AccountAvatar name={user?.name} signedIn={!!user} />
          </button>
        </div>
      )}

      {!isAppLikeMode && (
        <PageBreadcrumb
          items={[
            { name: t('common.home') || 'Home', href: getLocalizedPath('/', locale) },
            { name: locale === 'ar' ? 'الشركاء' : locale === 'ru' ? 'Партнёры' : 'Partners' },
          ]}
        />
      )}

      <div className="container mx-auto px-3 md:px-4 py-4 md:py-12">
        <div className="max-w-6xl mx-auto">
          {!isAppLikeMode && (
            <Link
              href={getLocalizedPath('/', locale)}
              className={`inline-flex items-center gap-1 text-xs md:text-sm text-[var(--cera-body)] hover:text-[var(--cera-ink)] mb-6 md:mb-10 ${isRTL ? 'flex-row-reverse' : ''}`}
            >
              <ArrowLeft className={`h-3 w-3 md:h-4 md:w-4 ${isRTL ? 'rotate-180' : ''}`} />
              <span>{t('common.backToHome') || 'Back to home'}</span>
            </Link>
          )}

          {/* Editorial hero */}
          <header className="mb-8 md:mb-14">
            <p className="text-[11px] md:text-xs font-mono uppercase tracking-[0.32em] text-[var(--cera-muted)]">
              {labels.kicker}
            </p>
            <h1 className="cera-serif mt-3 max-w-4xl text-3xl md:text-5xl lg:text-[3.4rem] leading-[1.05] tracking-tight text-[var(--cera-ink)]">
              {labels.headline}
            </h1>
            <p className="mt-4 max-w-2xl text-base md:text-lg leading-relaxed text-[var(--cera-body)]">
              {labels.subhead}
            </p>

            {/* Stats strip - desktop */}
            <dl className="mt-8 hidden md:grid md:grid-cols-3 gap-px overflow-hidden rounded-2xl border border-[var(--cera-line)] bg-[var(--cera-cream-deep)]">
              <div className="bg-white px-6 py-5">
                <dt className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.2em] text-[var(--cera-muted)]">
                  <Sparkles className="h-3.5 w-3.5 text-[var(--cera-rose-ink)]" />
                  {labels.statPartners}
                </dt>
                <dd className="mt-2 text-3xl font-semibold tracking-tight text-[var(--cera-ink)]">
                  {partnerCount}+
                </dd>
              </div>
              <div className="bg-white px-6 py-5">
                <dt className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.2em] text-[var(--cera-muted)]">
                  <MapPin className="h-3.5 w-3.5 text-[var(--cera-rose-ink)]" />
                  {labels.statEmirates}
                </dt>
                <dd className="mt-2 flex items-baseline gap-2 text-3xl font-semibold tracking-tight text-[var(--cera-ink)]">
                  <span>7</span>
                  <span className="text-sm font-medium text-[var(--cera-muted)]">
                    {locale === 'ar'
                      ? 'تغطية على مستوى الإمارات'
                      : locale === 'ru'
                        ? 'покрытие по всей стране'
                        : 'UAE-wide coverage'}
                  </span>
                </dd>
                <p className="mt-1.5 text-[11px] leading-snug text-[var(--cera-muted)]">
                  {locale === 'ar'
                    ? 'دبي · أبوظبي · الشارقة · عجمان · رأس الخيمة · الفجيرة · أم القيوين'
                    : locale === 'ru'
                      ? 'Дубай · Абу-Даби · Шарджа · Аджман · РАК · Фуджейра · Умм-эль-Кайвайн'
                      : 'Dubai · Abu Dhabi · Sharjah · Ajman · RAK · Fujairah · UAQ'}
                </p>
              </div>
              <div className="bg-white px-6 py-5">
                <dt className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.2em] text-[var(--cera-muted)]">
                  <ShieldCheck className="h-3.5 w-3.5 text-[var(--cera-rose-ink)]" />
                  {labels.statCertified}
                </dt>
                <dd className="mt-2 text-3xl font-semibold tracking-tight text-[var(--cera-ink)]">
                  {certifiedCount}
                  <span className="ml-2 align-middle text-sm font-medium text-[var(--cera-muted)]">
                    {labels.statSince} 2019
                  </span>
                </dd>
              </div>
            </dl>

            {/* Mobile stats - compact pill row */}
            <div className="mt-6 flex flex-wrap gap-2 md:hidden">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--cera-cta)] px-3 py-1 text-[11px] font-semibold text-white">
                <Sparkles className="h-3 w-3" />
                {partnerCount}+ {labels.statPartners}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--cera-cream-deep)] px-3 py-1 text-[11px] font-semibold text-[var(--cera-body)]">
                <MapPin className="h-3 w-3" />
                {locale === 'ar'
                  ? 'كل الإمارات السبع'
                  : locale === 'ru'
                    ? 'Все 7 эмиратов'
                    : 'All 7 emirates'}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--cera-blush)] px-3 py-1 text-[11px] font-semibold text-[var(--cera-rose-ink)] ring-1 ring-inset ring-amber-200">
                <ShieldCheck className="h-3 w-3" />
                {labels.statSince} 2019
              </span>
            </div>
          </header>

          {/* Partners grid + filters */}
          <PartnersList />

          {/* Become a partner CTA - editorial */}
          <section className="relative overflow-hidden rounded-2xl md:rounded-3xl border border-[var(--cera-cta)] bg-[var(--cera-cta)] text-white">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[var(--cera-rose)]/30 blur-3xl"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-[var(--cera-ink)]/20 blur-3xl"
            />
            <div className="relative grid gap-6 px-6 py-8 md:grid-cols-[1.4fr_1fr] md:items-center md:gap-10 md:px-12 md:py-14">
              <div>
                <p className="text-[11px] font-mono uppercase tracking-[0.32em] text-red-300">
                  {locale === 'ar' ? 'دعوة للتعاون' : locale === 'ru' ? 'СОТРУДНИЧЕСТВО' : 'PARTNERSHIP'}
                </p>
                <h2 className="cera-serif mt-3 text-2xl md:text-3xl lg:text-4xl leading-tight tracking-tight">
                  {labels.ctaTitle}
                </h2>
                <p className="mt-4 max-w-xl text-sm md:text-base leading-relaxed text-[var(--cera-blush-deep)]">
                  {labels.ctaBody}
                </p>
              </div>
              <div className={`flex flex-col gap-3 ${isRTL ? 'md:items-end' : 'md:items-start'}`}>
                <Link
                  href={getLocalizedPath('/contact', locale)}
                  className={`group inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-[var(--cera-ink)] transition-all hover:bg-[var(--cera-blush)] hover:text-[var(--cera-rose-ink)] ${isRTL ? 'flex-row-reverse' : ''}`}
                >
                  <span>{labels.ctaPrimary}</span>
                  <ArrowRight
                    className={`h-4 w-4 transition-transform group-hover:translate-x-0.5 ${isRTL ? 'rotate-180 group-hover:-translate-x-0.5 group-hover:translate-x-0' : ''}`}
                  />
                </Link>
                <Link
                  href={getLocalizedPath('/products', locale)}
                  className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition-all hover:border-white/60"
                >
                  {labels.ctaSecondary}
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
