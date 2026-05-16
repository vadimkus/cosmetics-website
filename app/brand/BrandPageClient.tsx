'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowLeft, ArrowRight, Sparkles, Microscope, Layers, ShieldCheck,
  PlayCircle, Award, FlaskConical, Stethoscope,
} from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'
import { getLocalizedPath } from '@/lib/i18n'
import { usePWAMode } from '@/hooks/usePWAMode'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/components/auth/AuthProvider'

export default function BrandPageClient() {
  const { t, locale, dir } = useTranslation()
  const { isPWA } = usePWAMode()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const [isMobileWeb, setIsMobileWeb] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) && window.innerWidth < 768
      const isPWAMode = window.matchMedia('(display-mode: standalone)').matches ||
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

  // Localized copy lives inline (no i18n keys exist for /brand). Keep all
  // three locales explicit so AR/RU don't fall back to English.
  const copy = {
    kicker: locale === 'ar' ? 'العلامة التجارية · كوريا · منذ 2008' : locale === 'ru' ? 'БРЕНД · КОРЕЯ · С 2008' : 'THE BRAND · KOREA · SINCE 2008',
    headline: locale === 'ar' ? 'نظام إعادة ميلاد الجينات.' : locale === 'ru' ? 'Система перерождения генов.' : 'Gene Re-Birth System.',
    subhead: locale === 'ar'
      ? 'GENOSYS هي أول علامة تجارية في العالم مكرّسة للعلاج بالإبر الدقيقة، تجمع بين الأجهزة والمستحضرات الصيدلية المصممة خصيصاً لتعزيز نتائج العلاج.'
      : locale === 'ru'
        ? 'GENOSYS — первый в мире бренд, посвящённый микронидлингу: роллеры, дерматокосметика, разработанная специально для усиления эффекта процедур.'
        : 'GENOSYS is the world\'s first microneedling-dedicated brand. Devices and cosmeceuticals formulated specifically to amplify treatment results.',
    stats: {
      worldFirst: locale === 'ar' ? 'الأول عالمياً' : locale === 'ru' ? 'мировой первый' : 'world first',
      worldFirstSub: locale === 'ar' ? 'علامة مكرّسة للإبر الدقيقة' : locale === 'ru' ? 'бренд микронидлинга' : 'microneedling-only brand',
      lines: locale === 'ar' ? 'خطوط' : locale === 'ru' ? 'линии' : 'lines',
      linesSub: locale === 'ar' ? 'احترافي · منزلي' : locale === 'ru' ? 'проф. · домашняя' : 'professional · homecare',
      tested: locale === 'ar' ? 'مختبر' : locale === 'ru' ? 'тестов' : 'tested',
      testedSub: locale === 'ar' ? 'دلائل سريرية وجلدية' : locale === 'ru' ? 'клинически и дерматологически' : 'dermatologically · clinically',
      heritage: locale === 'ar' ? 'الإرث' : locale === 'ru' ? 'наследие' : 'heritage',
      heritageSub: locale === 'ar' ? 'سيول، كوريا الجنوبية' : locale === 'ru' ? 'Сеул, Корея' : 'Seoul, South Korea',
    },
    grsKicker: locale === 'ar' ? '01 · مفهوم G.R.S' : locale === 'ru' ? '01 · КОНЦЕПЦИЯ G.R.S' : '01 · THE G.R.S CONCEPT',
    grsTitle: locale === 'ar' ? 'الجينات + إعادة الولادة + النظام.' : locale === 'ru' ? 'Гены + перерождение + система.' : 'Genes + Re-birth + System.',
    grsBody: locale === 'ar'
      ? 'يمر الجلد بعملية شفاء محفّزة عند تنشيط آلية إعادة بناء الكولاجين. يعمل GENOSYS على هذا المسار ذاته من خلال نظام متكامل من ثلاثة عناصر — الأجهزة، والمستحضرات الصيدلية، والبروتوكولات — لاستعادة بشرة أصغر سناً وأكثر صحة.'
      : locale === 'ru'
        ? 'Кожа способна запускать собственный процесс восстановления коллагена. GENOSYS работает с этим механизмом через систему из трёх элементов — роллеры, дерматокосметика и протоколы, — чтобы вернуть коже молодость и здоровье.'
        : 'Skin can trigger its own collagen-rebuilding process. GENOSYS works with that biology through a three-part system — devices, cosmeceuticals, and protocols — to restore younger, healthier skin.',
    pillarsKicker: locale === 'ar' ? '02 · ثلاث ركائز' : locale === 'ru' ? '02 · ТРИ ОПОРЫ' : '02 · THREE PILLARS',
    pillarsTitle: locale === 'ar' ? 'نظام واحد، ثلاث طبقات.' : locale === 'ru' ? 'Одна система. Три слоя.' : 'One system. Three layers.',
    pillarDevices: locale === 'ar' ? 'الأجهزة' : locale === 'ru' ? 'Устройства' : 'Devices',
    pillarDevicesBody: locale === 'ar'
      ? 'مدحلات الإبر الدقيقة وأجهزة العلاج المهنية المصممة لإحداث قنوات دقيقة تنشّط آلية الشفاء الذاتي للجلد.'
      : locale === 'ru'
        ? 'Микронидлинг-роллеры и профессиональные устройства создают микроканалы, активирующие механизм самовосстановления кожи.'
        : 'Microneedling rollers and professional devices create micro-channels that activate the skin\'s self-repair mechanism.',
    pillarFormulas: locale === 'ar' ? 'المستحضرات' : locale === 'ru' ? 'Космецевтика' : 'Cosmeceuticals',
    pillarFormulasBody: locale === 'ar'
      ? 'تركيبات صيدلية بمكونات نشطة قوية مصممة خصيصاً للتطبيق فور الإبر الدقيقة لتعزيز الامتصاص والنتائج.'
      : locale === 'ru'
        ? 'Космецевтика с мощными активными компонентами, разработанная для нанесения сразу после микронидлинга — для глубокого усвоения и видимого результата.'
        : 'Cosmeceutical formulas with potent actives, designed for immediate post-needling application — maximizing absorption and visible results.',
    pillarProtocols: locale === 'ar' ? 'البروتوكولات' : locale === 'ru' ? 'Протоколы' : 'Protocols',
    pillarProtocolsBody: locale === 'ar'
      ? 'بروتوكولات قبل وبعد العلاج طوّرها أطباء الجلد، تربط بين الجلسات الاحترافية والعناية المنزلية اليومية.'
      : locale === 'ru'
        ? 'Протоколы до/после процедур, разработанные дерматологами, связывают кабинетные сессии с ежедневным домашним уходом.'
        : 'Pre and post-treatment protocols, designed by dermatologists, that link in-clinic sessions with daily homecare.',
    proKicker: locale === 'ar' ? '03 · الواقع المهني' : locale === 'ru' ? '03 · В КАБИНЕТЕ' : '03 · IN-CLINIC REALITY',
    proTitle: locale === 'ar' ? 'النتائج التي تشاهدها العيادات.' : locale === 'ru' ? 'Что видят в кабинетах.' : 'What clinics actually see.',
    proBody: locale === 'ar'
      ? 'نتائج بصرية ومستدامة. يعزز الخط الاحترافي فعالية كل علاج، بينما يحافظ خط العناية المنزلية على المكاسب بين الجلسات.'
      : locale === 'ru'
        ? 'Видимые и стойкие результаты. Профессиональная линия усиливает эффективность процедур, а домашняя — закрепляет результат между визитами.'
        : 'Long-lasting, visible results. The professional line amplifies every in-clinic treatment, while the homecare line locks the gains in between sessions.',
    catalogueKicker: locale === 'ar' ? 'الكتالوج' : locale === 'ru' ? 'КАТАЛОГ' : 'THE LINEUP',
    catalogueTitle: locale === 'ar' ? 'مجموعة كاملة لكل خطوة.' : locale === 'ru' ? 'Полная линейка для каждого этапа.' : 'A full lineup for every step.',
    catalogueBody: locale === 'ar'
      ? 'أمصال، كريمات، أقنعة، ومنتجات منزلية وأجهزة احترافية — كلها مصممة للعمل معاً.'
      : locale === 'ru'
        ? 'Сыворотки, кремы, маски, домашние и профессиональные устройства — всё работает вместе.'
        : 'Serums, creams, masks, homecare devices and professional kits — all designed to work together.',
    ctaKicker: locale === 'ar' ? 'اكتشف' : locale === 'ru' ? 'ИЗУЧИТЕ' : 'EXPLORE',
    ctaTitle: locale === 'ar' ? 'شاهدها أثناء العمل.' : locale === 'ru' ? 'Посмотрите в действии.' : 'See it in action.',
    ctaBody: locale === 'ar'
      ? 'تصفّح الكتالوج الكامل أو تعمّق في فيديوهات التدريب لكل بروتوكول.'
      : locale === 'ru'
        ? 'Откройте полный каталог или углубитесь в видеоуроки по каждому протоколу.'
        : 'Browse the full catalogue, or dig into the training videos for every protocol.',
    productsCta: locale === 'ar' ? 'تصفّح المنتجات' : locale === 'ru' ? 'Каталог' : 'Browse products',
    trainingCta: locale === 'ar' ? 'فيديوهات التدريب' : locale === 'ru' ? 'Видеоуроки' : 'Training videos',
    breadcrumb: locale === 'ar' ? 'العلامة التجارية' : locale === 'ru' ? 'Бренд' : 'Brand',
    watchBrand: locale === 'ar' ? 'فيديو العلامة التجارية' : locale === 'ru' ? 'Видео о бренде' : 'Brand film',
    watchTreatment: locale === 'ar' ? 'العلاج المهني' : locale === 'ru' ? 'Профессиональная процедура' : 'Professional treatment',
  }

  const pillars = [
    { icon: Microscope, label: copy.pillarDevices, body: copy.pillarDevicesBody },
    { icon: FlaskConical, label: copy.pillarFormulas, body: copy.pillarFormulasBody },
    { icon: Stethoscope, label: copy.pillarProtocols, body: copy.pillarProtocolsBody },
  ]

  return (
    <div className={`bg-white min-h-screen ${isAppLikeMode ? 'pb-32' : ''}`} dir={dir}>
      {/* PWA / Mobile Web Simple Navigation Header */}
      {isAppLikeMode && (
        <div className={`flex items-center justify-between px-5 py-4 bg-white ${isRTL ? 'flex-row-reverse' : ''}`}>
          <button
            onClick={() => router.push(getLocalizedPath(fromProfile ? '/profile' : '/products', locale))}
            className={`flex items-center gap-1 min-w-[80px] ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            <svg className={`w-5 h-5 text-red-600 ${isRTL ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-base text-red-600">
              {fromProfile ? (locale === 'ar' ? 'الحساب' : locale === 'ru' ? 'Аккаунт' : 'Account') : (locale === 'ar' ? 'المنتجات' : locale === 'ru' ? 'Продукты' : 'Products')}
            </span>
          </button>
          <span className="text-base font-semibold text-gray-900">{copy.breadcrumb}</span>
          <button
            onClick={() => router.push(getLocalizedPath('/profile', locale))}
            className="min-w-[80px] flex justify-end"
          >
            <div className="relative">
              <div className="w-9 h-9 rounded-full bg-red-600 flex items-center justify-center">
                <span className="text-sm font-semibold text-white">
                  {user?.name?.charAt(0)?.toUpperCase() || 'G'}
                </span>
              </div>
              {user && (
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-[1.5px] border-white" />
              )}
            </div>
          </button>
        </div>
      )}

      <div className="container mx-auto px-4 py-4 md:py-12">
        <div className="max-w-6xl mx-auto">
          {!isAppLikeMode && (
            <nav className={`text-xs md:text-sm text-gray-500 mb-2 md:mb-4 ${isRTL ? 'text-right' : ''}`} aria-label="Breadcrumb">
              <Link href={getLocalizedPath('/', locale)} className="hover:text-gray-900 transition-colors">
                {t('common.home') || 'Home'}
              </Link>
              <span className="mx-1.5">/</span>
              <span className="text-gray-900">{copy.breadcrumb}</span>
            </nav>
          )}

          {!isAppLikeMode && (
            <Link href={getLocalizedPath('/', locale)} className={`inline-flex items-center gap-1 text-xs md:text-sm text-gray-600 hover:text-gray-900 mb-6 md:mb-10 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <ArrowLeft className={`h-3 w-3 md:h-4 md:w-4 ${isRTL ? 'rotate-180' : ''}`} />
              <span>{t('common.backToHome') || 'Back to Home'}</span>
            </Link>
          )}

          {/* ── Editorial hero ───────────────────────────────────────────── */}
          <header className="mb-12 md:mb-16">
            <p className="text-[11px] md:text-xs font-mono uppercase tracking-[0.32em] text-gray-500">
              {copy.kicker}
            </p>
            <h1 className={`mt-3 max-w-4xl text-3xl md:text-5xl lg:text-[3.4rem] font-semibold leading-[1.05] tracking-tight text-gray-900 ${isRTL ? 'text-right' : ''}`}>
              {copy.headline}
            </h1>
            <p className={`mt-4 max-w-2xl text-base md:text-lg leading-relaxed text-gray-600 ${isRTL ? 'text-right' : ''}`}>
              {copy.subhead}
            </p>

            {/* Stats strip */}
            <dl className="mt-8 hidden md:grid md:grid-cols-4 gap-px overflow-hidden rounded-2xl border border-gray-200 bg-gray-200">
              <div className="bg-white px-6 py-5">
                <dt className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.2em] text-gray-500">
                  <Award className="h-3.5 w-3.5 text-red-600" />
                  {copy.stats.worldFirst}
                </dt>
                <dd className="mt-2 flex items-baseline gap-2 text-3xl font-semibold tracking-tight text-gray-900">
                  <span>1<sup className="text-base font-medium text-gray-400">st</sup></span>
                  <span className="text-sm font-medium text-gray-500">{copy.stats.worldFirstSub}</span>
                </dd>
              </div>
              <div className="bg-white px-6 py-5">
                <dt className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.2em] text-gray-500">
                  <Layers className="h-3.5 w-3.5 text-red-600" />
                  {copy.stats.lines}
                </dt>
                <dd className="mt-2 flex items-baseline gap-2 text-3xl font-semibold tracking-tight text-gray-900">
                  <span>2</span>
                  <span className="text-sm font-medium text-gray-500">{copy.stats.linesSub}</span>
                </dd>
              </div>
              <div className="bg-white px-6 py-5">
                <dt className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.2em] text-gray-500">
                  <ShieldCheck className="h-3.5 w-3.5 text-red-600" />
                  {copy.stats.tested}
                </dt>
                <dd className="mt-2 flex items-baseline gap-2 text-3xl font-semibold tracking-tight text-gray-900">
                  <span>100%</span>
                  <span className="text-sm font-medium text-gray-500">{copy.stats.testedSub}</span>
                </dd>
              </div>
              <div className="bg-white px-6 py-5">
                <dt className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.2em] text-gray-500">
                  <Sparkles className="h-3.5 w-3.5 text-red-600" />
                  {copy.stats.heritage}
                </dt>
                <dd className="mt-2 flex items-baseline gap-2 text-3xl font-semibold tracking-tight text-gray-900">
                  <span className="text-2xl">🇰🇷</span>
                  <span className="text-sm font-medium text-gray-500">{copy.stats.heritageSub}</span>
                </dd>
              </div>
            </dl>
          </header>

          {/* ── G.R.S Concept + Brand video (asymmetric 5/7 split) ──────── */}
          <section className="mb-12 md:mb-20 grid gap-6 md:grid-cols-12 md:gap-10 md:items-center">
            <div className={`md:col-span-5 ${isRTL ? 'text-right' : ''}`}>
              <p className="text-[11px] font-mono uppercase tracking-[0.28em] text-gray-500">
                {copy.grsKicker}
              </p>
              <h2 className="mt-2 text-2xl md:text-3xl font-semibold tracking-tight text-gray-900 leading-[1.15]">
                {copy.grsTitle}
              </h2>
              <p className="mt-4 text-base leading-relaxed text-gray-700">
                {copy.grsBody}
              </p>

              {/* G · R · S decomposed badges */}
              <div className={`mt-6 flex flex-wrap gap-2 ${isRTL ? 'justify-end' : ''}`}>
                {[
                  { letter: 'G', label: locale === 'ar' ? 'الجينات' : locale === 'ru' ? 'Гены' : 'Genes' },
                  { letter: 'R', label: locale === 'ar' ? 'إعادة الولادة' : locale === 'ru' ? 'Перерождение' : 'Re-birth' },
                  { letter: 'S', label: locale === 'ar' ? 'النظام' : locale === 'ru' ? 'Система' : 'System' },
                ].map((b) => (
                  <span key={b.letter} className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-[11px] font-mono font-bold text-white">{b.letter}</span>
                    <span className="text-gray-700">{b.label}</span>
                  </span>
                ))}
              </div>
            </div>

            <div className="md:col-span-7">
              <figure className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-gray-950 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.45)]">
                <div className="absolute top-3 left-3 z-10 inline-flex items-center gap-1.5 rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-mono uppercase tracking-[0.18em] text-white backdrop-blur">
                  <PlayCircle className="h-3 w-3 text-red-400" />
                  {copy.watchBrand}
                </div>
                <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                  <iframe
                    className="absolute top-0 left-0 w-full h-full"
                    src="https://www.youtube.com/embed/4L9xZc7wAjI"
                    title="GENOSYS Gene Re-Birth System"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
              </figure>
            </div>
          </section>

          {/* ── Three pillars ───────────────────────────────────────────── */}
          <section className="mb-12 md:mb-20">
            <div className={`mb-6 md:mb-8 ${isRTL ? 'text-right' : ''}`}>
              <p className="text-[11px] font-mono uppercase tracking-[0.28em] text-gray-500">
                {copy.pillarsKicker}
              </p>
              <h2 className="mt-2 text-2xl md:text-3xl font-semibold tracking-tight text-gray-900">
                {copy.pillarsTitle}
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-gray-200 bg-gray-200 md:grid-cols-3">
              {pillars.map((p, idx) => {
                const Icon = p.icon
                return (
                  <article key={p.label} className={`group relative bg-white p-6 md:p-8 ${isRTL ? 'text-right' : ''}`}>
                    <span aria-hidden className={`absolute top-0 ${isRTL ? 'right-0' : 'left-0'} h-0.5 w-12 bg-red-600`} />
                    <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-gray-400">
                      {String(idx + 1).padStart(2, '0')}
                    </p>
                    <div className={`mt-3 flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-900">
                        <Icon className="h-5 w-5" strokeWidth={1.75} />
                      </span>
                      <h3 className="text-lg md:text-xl font-semibold tracking-tight text-gray-900">{p.label}</h3>
                    </div>
                    <p className="mt-4 text-sm md:text-[15px] leading-relaxed text-gray-600">
                      {p.body}
                    </p>
                  </article>
                )
              })}
            </div>
          </section>

          {/* ── Professional treatment showcase ────────────────────────── */}
          <section className="mb-12 md:mb-20">
            <div className={`grid gap-6 md:grid-cols-12 md:gap-10 md:items-center`}>
              <div className={`md:col-span-7 order-2 md:order-1`}>
                <figure className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-gray-950 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.45)]">
                  <div className="absolute top-3 left-3 z-10 inline-flex items-center gap-1.5 rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-mono uppercase tracking-[0.18em] text-white backdrop-blur">
                    <PlayCircle className="h-3 w-3 text-red-400" />
                    {copy.watchTreatment}
                  </div>
                  <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                    <iframe
                      className="absolute top-0 left-0 w-full h-full"
                      src="https://www.youtube.com/embed/v-i6CHJfWIg?autoplay=1&loop=1&playlist=v-i6CHJfWIg&mute=1&controls=1&showinfo=0&rel=0&modestbranding=1"
                      title="GENOSYS Professional Treatment"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    />
                  </div>
                </figure>
              </div>
              <div className={`md:col-span-5 order-1 md:order-2 ${isRTL ? 'text-right' : ''}`}>
                <p className="text-[11px] font-mono uppercase tracking-[0.28em] text-gray-500">
                  {copy.proKicker}
                </p>
                <h2 className="mt-2 text-2xl md:text-3xl font-semibold tracking-tight text-gray-900 leading-[1.15]">
                  {copy.proTitle}
                </h2>
                <p className="mt-4 text-base leading-relaxed text-gray-700">
                  {copy.proBody}
                </p>
              </div>
            </div>
          </section>

          {/* ── The lineup (product collage) ───────────────────────────── */}
          <section className="mb-12 md:mb-20">
            <div className={`mb-6 md:mb-8 flex items-end justify-between gap-4 ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
              <div className={isRTL ? 'text-right' : ''}>
                <p className="text-[11px] font-mono uppercase tracking-[0.28em] text-gray-500">
                  {copy.catalogueKicker}
                </p>
                <h2 className="mt-2 text-2xl md:text-3xl font-semibold tracking-tight text-gray-900">
                  {copy.catalogueTitle}
                </h2>
                <p className="mt-3 max-w-xl text-sm md:text-base leading-relaxed text-gray-600">
                  {copy.catalogueBody}
                </p>
              </div>
              <Link
                href={getLocalizedPath('/products', locale)}
                className={`group hidden md:inline-flex items-center gap-1.5 text-sm font-medium text-gray-900 hover:text-red-600 transition-colors flex-shrink-0 ${isRTL ? 'flex-row-reverse' : ''}`}
              >
                {copy.productsCta}
                <ArrowRight className={`h-4 w-4 transition-transform group-hover:translate-x-0.5 ${isRTL ? 'rotate-180 group-hover:-translate-x-0.5 group-hover:translate-x-0' : ''}`} />
              </Link>
            </div>

            <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-gray-50">
              <div className="relative aspect-[16/8] w-full">
                <Image
                  src="/images/genosys-products.jpg"
                  alt="GENOSYS Professional Korean Dermacosmetics — Microneedling Devices and Skincare Solutions"
                  fill
                  sizes="(min-width: 1024px) 1024px, 100vw"
                  className="object-cover"
                  priority
                />
                {/* Subtle vignette to anchor the watermark */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-end justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-white/90 backdrop-blur px-3 py-2">
                      <Image
                        src="/Logo/Full.png"
                        alt="GENOSYS Gene Re-Birth System logo"
                        width={120}
                        height={32}
                        className="h-6 w-auto"
                      />
                    </div>
                    <span className="hidden sm:inline-flex items-center rounded-full bg-white/90 backdrop-blur px-2.5 py-1 text-[10px] font-mono uppercase tracking-[0.18em] text-gray-700">
                      {locale === 'ar' ? 'مختبر سريرياً' : locale === 'ru' ? 'клин. тестировано' : 'dermatologically tested'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ── Closing CTA — dark editorial panel ──────────────────────── */}
          <section className="relative overflow-hidden rounded-xl md:rounded-3xl bg-gray-950 text-white">
            <span aria-hidden className="pointer-events-none absolute -top-32 right-0 h-72 w-72 rounded-full bg-red-600/25 blur-3xl" />
            <span aria-hidden className="pointer-events-none absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-red-500/15 blur-3xl" />

            <div className="relative grid gap-8 p-6 md:grid-cols-[1.4fr_1fr] md:items-end md:gap-12 md:p-10">
              <div className={isRTL ? 'text-right' : ''}>
                <p className="text-[11px] font-mono uppercase tracking-[0.32em] text-red-300/90">
                  {copy.ctaKicker}
                </p>
                <h2 className="mt-3 text-2xl md:text-3xl lg:text-4xl font-semibold tracking-tight leading-[1.1]">
                  {copy.ctaTitle}
                </h2>
                <p className="mt-3 max-w-md text-sm md:text-base leading-relaxed text-gray-300">
                  {copy.ctaBody}
                </p>
              </div>

              <div className={`flex flex-col gap-3 sm:flex-row md:flex-col ${isRTL ? 'md:items-end' : 'md:items-stretch'}`}>
                <Link
                  href={getLocalizedPath('/products', locale)}
                  className="group inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-gray-900 transition-all hover:bg-red-500 hover:text-white"
                >
                  {copy.productsCta}
                  <ArrowRight className={`h-4 w-4 transition-transform group-hover:translate-x-0.5 ${isRTL ? 'rotate-180 group-hover:-translate-x-0.5 group-hover:translate-x-0' : ''}`} />
                </Link>
                <Link
                  href={getLocalizedPath('/training', locale)}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:border-white/40 hover:bg-white/10"
                >
                  <PlayCircle className="h-4 w-4" />
                  {copy.trainingCta}
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
