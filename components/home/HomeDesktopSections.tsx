'use client'

/**
 * HomeDesktopSections — sections rendered BELOW the hero on the homepage.
 *
 * Desktop-only. Mobile users are redirected to `/products` by `MobileRedirect`
 * already, but every section still opts in with `hidden md:block` so SSR /
 * crawlers see them and mobile flashes stay clean.
 *
 * Sections (top → bottom):
 *  1. Category rail           — 6 categories, image tile grid
 *  2. Shop-by-concern grid    — 8 concerns with emoji icon wells
 *  3. Featured products rail  — 4 up, real DB products
 *  4. Why GENOSYS 3-up        — brand credibility
 *  5. Newsletter CTA          — email capture (stubbed — no backend wiring yet)
 */

import Link from 'next/link'
import Image from 'next/image'
import { useMemo, useState } from 'react'
import { ArrowRight, Check, Sparkles, Mail, Lock } from 'lucide-react'
import type { Locale } from '@/lib/i18n'
import { getLocalizedPath } from '@/lib/i18n'
import { CATEGORY_PAGES, CONCERN_PAGES } from '@/lib/concernsData'
import type { Product } from '@/types'
import { useAuth } from '@/components/auth/AuthProvider'
import { canUserSeePrices } from '@/lib/discountUtils'
import {
  IconClinical,
  IconOfficialDistributor,
  IconMadeInKorea,
} from '@/components/icons/BrandIcons'

interface HomeDesktopSectionsProps {
  locale: Locale
  dir: 'ltr' | 'rtl'
  featuredProducts: Product[]
  /**
   * Map of category slug -> product image URL. Computed on the server against
   * the full catalog so every tile on the rail has real imagery, not just the
   * 4 categories that happen to be in featuredProducts.
   */
  categoryImages?: Record<string, string>
}

// Curated category slugs we want to surface on the homepage rail (6 tiles).
// Order is chosen so the rail tells the brand story: treatments → essentials.
const FEATURED_CATEGORY_SLUGS = [
  'microneedling',
  'pro-solution',
  'serum',
  'cream',
  'mask',
  'sun',
] as const

// Small visual helper — each category tile gets a tinted backdrop so the rail
// reads as a deliberate grid even when product imagery is not available yet.
const CATEGORY_ACCENTS: Record<string, { bg: string; ring: string }> = {
  microneedling: { bg: 'from-primary-50 to-white', ring: 'ring-primary-100' },
  'pro-solution': { bg: 'from-purple-50 to-white', ring: 'ring-purple-100' },
  serum: { bg: 'from-emerald-50 to-white', ring: 'ring-emerald-100' },
  cream: { bg: 'from-amber-50 to-white', ring: 'ring-amber-100' },
  mask: { bg: 'from-sky-50 to-white', ring: 'ring-sky-100' },
  sun: { bg: 'from-orange-50 to-white', ring: 'ring-orange-100' },
}

function pickFirstImage(product: Product): string {
  if (product.images) {
    try {
      const arr = JSON.parse(product.images) as string[]
      if (Array.isArray(arr) && arr.length > 0 && arr[0]) return arr[0]
    } catch {
      /* noop */
    }
  }
  return product.image || '/images/placeholder.png'
}

export default function HomeDesktopSections({
  locale,
  dir,
  featuredProducts,
  categoryImages,
}: HomeDesktopSectionsProps) {
  const isRtl = dir === 'rtl'
  // Pricing on the bestsellers rail mirrors the site-wide auth-gated pattern:
  // guests see a "Login to see price" CTA, logged-in customers without pricing
  // permission see a lock, and approved customers see the price. Keeps the
  // homepage consistent with PDP / category page pricing rules.
  const { user } = useAuth()
  const userCanSeePrices = canUserSeePrices(user)

  // Map featured-category slugs to real CATEGORY_PAGES entries, preserving order.
  const featuredCategories = useMemo(
    () =>
      FEATURED_CATEGORY_SLUGS.map(slug =>
        CATEGORY_PAGES.find(c => c.slug === slug)
      ).filter((c): c is (typeof CATEGORY_PAGES)[number] => Boolean(c)),
    []
  )

  // For each category tile, prefer the server-computed map (covers all 6
  // categories from the full catalog). Fall back to featuredProducts in case
  // the server map was not provided.
  const categoryImageBySlug = useMemo(() => {
    const map: Record<string, string> = { ...(categoryImages ?? {}) }
    featuredCategories.forEach(cat => {
      if (map[cat.slug]) return
      const match = featuredProducts.find(
        p =>
          p.category?.toLowerCase().replace(/\s+/g, '-') === cat.slug ||
          p.category?.toLowerCase() === cat.categoryKey
      )
      if (match) map[cat.slug] = pickFirstImage(match)
    })
    return map
  }, [featuredCategories, featuredProducts, categoryImages])

  return (
    <div className="hidden md:block" dir={dir}>
      {/* ── 1. Category rail ─────────────────────────────────────────────── */}
      <section className="border-t border-gray-100 bg-white py-16 lg:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="mb-10 text-center">
              <p className="text-[11px] tracking-[0.18em] font-semibold text-primary-600 uppercase mb-2">
                {locale === 'ar' ? 'تسوق حسب الفئة' : locale === 'ru' ? 'Категории' : 'Shop by category'}
              </p>
              <h2 className="text-3xl lg:text-[40px] lg:leading-[1.1] font-bold text-gray-900 font-display tracking-tight">
                {locale === 'ar'
                  ? 'مجموعة GENOSYS الاحترافية'
                  : locale === 'ru'
                  ? 'Профессиональная коллекция GENOSYS'
                  : 'The GENOSYS professional range'}
              </h2>
              <p className="mt-3 text-gray-600 max-w-xl mx-auto">
                {locale === 'ar'
                  ? 'من علاجات العيادة إلى العناية اليومية — مصنوعة في كوريا، معتمدة من الإمارات'
                  : locale === 'ru'
                  ? 'От клинических процедур до ежедневного ухода — сделано в Корее, сертифицировано в ОАЭ'
                  : 'From in-clinic treatments to everyday essentials — made in Korea, certified in the UAE.'}
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              {featuredCategories.map(cat => {
                const accent = CATEGORY_ACCENTS[cat.slug] ?? {
                  bg: 'from-gray-50 to-white',
                  ring: 'ring-gray-100',
                }
                const imageSrc = categoryImageBySlug[cat.slug]
                const title =
                  locale === 'ar'
                    ? cat.seo.ar.h1
                    : locale === 'ru'
                    ? cat.seo.ru.h1
                    : cat.seo.en.h1
                return (
                  <Link
                    key={cat.slug}
                    href={getLocalizedPath(`/products/category/${cat.slug}`, locale)}
                    className={`group relative overflow-hidden rounded-2xl border border-gray-200 ring-1 ${accent.ring} bg-gradient-to-br ${accent.bg} p-5 lg:p-6 min-h-[180px] lg:min-h-[220px] flex flex-col justify-between transition-all hover:border-primary-300 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/50 focus-visible:ring-offset-2`}
                  >
                    {imageSrc && (
                      <div className="pointer-events-none absolute -right-6 -bottom-6 w-28 h-28 lg:w-36 lg:h-36 rounded-full overflow-hidden opacity-90 group-hover:scale-105 transition-transform duration-300">
                        <Image
                          src={imageSrc}
                          alt=""
                          width={144}
                          height={144}
                          className="w-full h-full object-cover"
                          aria-hidden="true"
                        />
                      </div>
                    )}
                    <div className="relative z-10">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-white/80 backdrop-blur text-[10px] font-semibold tracking-wider text-gray-600 uppercase border border-gray-200">
                        {locale === 'ar' ? 'فئة' : locale === 'ru' ? 'Категория' : 'Category'}
                      </span>
                      <h3 className={`mt-3 text-lg lg:text-xl font-semibold text-gray-900 tracking-tight ${isRtl ? 'text-right' : ''}`}>
                        {title}
                      </h3>
                    </div>
                    <div className={`relative z-10 flex items-center gap-1.5 text-sm font-semibold text-primary-700 ${isRtl ? 'flex-row-reverse' : ''}`}>
                      <span>{locale === 'ar' ? 'تسوق الآن' : locale === 'ru' ? 'Смотреть' : 'Shop now'}</span>
                      <ArrowRight className={`h-4 w-4 transition-transform group-hover:translate-x-1 ${isRtl ? 'rotate-180 group-hover:-translate-x-1' : ''}`} aria-hidden="true" />
                    </div>
                  </Link>
                )
              })}
            </div>

            <div className="mt-8 text-center">
              <Link
                href={getLocalizedPath('/products', locale)}
                className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-primary-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40 rounded px-2 py-1"
              >
                {locale === 'ar' ? 'استعرض جميع المنتجات' : locale === 'ru' ? 'Посмотреть все продукты' : 'Browse all products'}
                <ArrowRight className={`h-4 w-4 ${isRtl ? 'rotate-180' : ''}`} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. Shop by concern ──────────────────────────────────────────── */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-16 lg:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="mb-10 text-center">
              <p className="text-[11px] tracking-[0.18em] font-semibold text-primary-600 uppercase mb-2">
                {locale === 'ar' ? 'الحلول' : locale === 'ru' ? 'Решения' : 'Targeted solutions'}
              </p>
              <h2 className="text-3xl lg:text-[40px] lg:leading-[1.1] font-bold text-gray-900 font-display tracking-tight">
                {locale === 'ar' ? 'تسوق حسب مشكلة البشرة' : locale === 'ru' ? 'Подбор по задаче кожи' : 'Shop by skin concern'}
              </h2>
              <p className="mt-3 text-gray-600 max-w-xl mx-auto">
                {locale === 'ar'
                  ? 'اختر مخاوفك — سنرشدك إلى الروتين الصحيح'
                  : locale === 'ru'
                  ? 'Выберите задачу — мы подскажем точный уход'
                  : 'Pick your concern — we\u2019ll guide you to the right routine.'}
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
              {CONCERN_PAGES.map(concern => {
                const title =
                  locale === 'ar'
                    ? concern.seo.ar.h1
                    : locale === 'ru'
                    ? concern.seo.ru.h1
                    : concern.seo.en.h1
                return (
                  <Link
                    key={concern.slug}
                    href={getLocalizedPath(`/products/concern/${concern.slug}`, locale)}
                    className="group flex items-center gap-3 p-4 lg:p-5 rounded-xl border border-gray-200 bg-white hover:border-primary-300 hover:shadow-md transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40 focus-visible:ring-offset-2"
                  >
                    <span className="flex h-11 w-11 lg:h-12 lg:w-12 flex-shrink-0 items-center justify-center rounded-xl bg-primary-50 text-2xl lg:text-[26px]" aria-hidden="true">
                      {concern.icon}
                    </span>
                    <div className={`flex-1 min-w-0 ${isRtl ? 'text-right' : ''}`}>
                      <h3 className="text-sm lg:text-base font-semibold text-gray-900 leading-tight group-hover:text-primary-700 transition-colors line-clamp-2">
                        {title}
                      </h3>
                    </div>
                  </Link>
                )
              })}
            </div>

            <div className="mt-8 text-center">
              <Link
                href={getLocalizedPath('/skin-recommendation', locale)}
                className="inline-flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-gray-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40 focus-visible:ring-offset-2"
              >
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                {locale === 'ar' ? 'ابدأ تحليل البشرة المجاني' : locale === 'ru' ? 'Бесплатный анализ кожи' : 'Start free skin analysis'}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. Featured products rail ───────────────────────────────────── */}
      {featuredProducts.length > 0 && (
        <section className="bg-white py-16 lg:py-20 border-t border-gray-100">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className={`mb-10 flex items-end justify-between gap-4 ${isRtl ? 'flex-row-reverse' : ''}`}>
                <div className={isRtl ? 'text-right' : ''}>
                  <p className="text-[11px] tracking-[0.18em] font-semibold text-primary-600 uppercase mb-2">
                    {locale === 'ar' ? 'المفضلة' : locale === 'ru' ? 'Избранное' : 'Bestsellers'}
                  </p>
                  <h2 className="text-3xl lg:text-[40px] lg:leading-[1.1] font-bold text-gray-900 font-display tracking-tight">
                    {locale === 'ar' ? 'الأكثر مبيعاً هذا الموسم' : locale === 'ru' ? 'Хиты сезона' : 'What\u2019s popular right now'}
                  </h2>
                </div>
                <Link
                  href={getLocalizedPath('/products', locale)}
                  className="hidden lg:inline-flex items-center gap-1.5 text-sm font-semibold text-gray-700 hover:text-primary-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40 rounded px-1"
                >
                  {locale === 'ar' ? 'عرض الكل' : locale === 'ru' ? 'Все продукты' : 'View all'}
                  <ArrowRight className={`h-4 w-4 ${isRtl ? 'rotate-180' : ''}`} aria-hidden="true" />
                </Link>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                {featuredProducts.slice(0, 4).map(product => {
                  const imgSrc = pickFirstImage(product)
                  const name =
                    locale === 'ar' && product.nameAr
                      ? product.nameAr
                      : locale === 'ru' && product.nameRu
                      ? product.nameRu
                      : product.name
                  return (
                    <Link
                      key={product.id}
                      href={getLocalizedPath(`/products/${product.id}`, locale)}
                      className="group block rounded-2xl border border-gray-200 bg-white overflow-hidden hover:shadow-lg hover:border-primary-200 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40 focus-visible:ring-offset-2"
                    >
                      <div className="relative aspect-square bg-gray-50 overflow-hidden">
                        <Image
                          src={imgSrc}
                          alt={name}
                          width={400}
                          height={400}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          quality={80}
                        />
                        {product.inStock && (
                          <span className="absolute top-3 left-3 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/90 backdrop-blur text-[10px] font-semibold text-emerald-700 border border-emerald-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
                            {locale === 'ar' ? 'متوفر' : locale === 'ru' ? 'В наличии' : 'In stock'}
                          </span>
                        )}
                      </div>
                      <div className={`p-4 ${isRtl ? 'text-right' : ''}`}>
                        <p className="text-[10px] tracking-wide font-semibold text-gray-500 uppercase mb-1 line-clamp-1">
                          {product.category}
                        </p>
                        <h3 className="text-sm lg:text-base font-semibold text-gray-900 leading-tight line-clamp-2 mb-2 group-hover:text-primary-700 transition-colors">
                          {name}
                        </h3>
                        {/* Auth-gated price block — mirrors ProductCard/ProductPrice */}
                        {product.isPriceOnRequest ? (
                          <p className="text-sm font-semibold text-amber-600">
                            {locale === 'ar'
                              ? 'السعر عند الطلب'
                              : locale === 'ru'
                              ? 'Цена по запросу'
                              : 'Price on request'}
                          </p>
                        ) : userCanSeePrices ? (
                          <p className="text-sm font-semibold text-gray-900">
                            AED {product.price}
                          </p>
                        ) : user ? (
                          <p className="inline-flex items-center gap-1 text-sm font-semibold text-gray-500">
                            <Lock className="h-3.5 w-3.5" aria-hidden="true" />
                            {locale === 'ar'
                              ? 'السعر مقفل'
                              : locale === 'ru'
                              ? 'Цена заблокирована'
                              : 'Price locked'}
                          </p>
                        ) : (
                          <span
                            className={`inline-flex items-center gap-1.5 text-xs font-semibold text-primary-700 border border-primary-200 bg-primary-50 rounded-full px-2.5 py-1 ${isRtl ? 'flex-row-reverse' : ''}`}
                          >
                            <Lock className="h-3 w-3" aria-hidden="true" />
                            {locale === 'ar'
                              ? 'سجّل الدخول لرؤية السعر'
                              : locale === 'ru'
                              ? 'Войдите, чтобы увидеть цену'
                              : 'Login to see price'}
                          </span>
                        )}
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── 4. Why GENOSYS 3-up ─────────────────────────────────────────── */}
      <section className="bg-gradient-to-b from-white to-gray-50 py-16 lg:py-20 border-t border-gray-100">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="mb-10 text-center">
              <p className="text-[11px] tracking-[0.18em] font-semibold text-primary-600 uppercase mb-2">
                {locale === 'ar' ? 'لماذا GENOSYS' : locale === 'ru' ? 'Почему GENOSYS' : 'Why GENOSYS'}
              </p>
              <h2 className="text-3xl lg:text-[40px] lg:leading-[1.1] font-bold text-gray-900 font-display tracking-tight">
                {locale === 'ar'
                  ? 'علم كوري. معتمد في الإمارات.'
                  : locale === 'ru'
                  ? 'Корейская наука. Сертифицировано в ОАЭ.'
                  : 'Korean science. Certified in the UAE.'}
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-6">
              {[
                {
                  icon: <IconClinical className="h-6 w-6 text-primary-600" />,
                  bg: 'bg-primary-50',
                  title: {
                    en: 'Clinical dermacosmetics',
                    ar: 'مستحضرات تجميل طبية',
                    ru: 'Клиническая дермакосметика',
                  },
                  body: {
                    en: 'Formulas used by dermatologists and clinics across Korea, now available to UAE consumers and pros.',
                    ar: 'تركيبات يستخدمها أطباء الجلدية والعيادات في كوريا، والآن متاحة في الإمارات.',
                    ru: 'Формулы, которые применяют дерматологи и клиники в Корее, теперь доступны в ОАЭ.',
                  },
                },
                {
                  icon: <IconOfficialDistributor className="h-6 w-6 text-emerald-600" />,
                  bg: 'bg-emerald-50',
                  title: {
                    en: 'Official UAE distributor',
                    ar: 'الموزع الرسمي في الإمارات',
                    ru: 'Официальный дистрибьютор в ОАЭ',
                  },
                  body: {
                    en: 'TDRA-licensed, VAT-registered, operating in the UAE since 2019. Authentic product guaranteed.',
                    ar: 'مرخّص من هيئة تنظيم الاتصالات، مسجّل للضريبة على القيمة المضافة، نعمل في الإمارات منذ 2019.',
                    ru: 'Лицензия TDRA, регистрация НДС, работаем в ОАЭ с 2019 года. Гарантия оригинальности.',
                  },
                },
                {
                  icon: <IconMadeInKorea className="h-6 w-6 text-blue-600" />,
                  bg: 'bg-blue-50',
                  title: {
                    en: 'Made in South Korea',
                    ar: 'صُنع في كوريا الجنوبية',
                    ru: 'Сделано в Южной Корее',
                  },
                  body: {
                    en: 'Every formula produced in GENOSYS labs, Seoul — with R&D rooted in microneedling and growth-factor research.',
                    ar: 'كل التركيبات تُنتج في مختبرات GENOSYS بسيول — مع بحث وتطوير متخصص في الوخز الدقيق وعوامل النمو.',
                    ru: 'Все формулы производятся в лабораториях GENOSYS в Сеуле — исследования в области микронидлинга и факторов роста.',
                  },
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-gray-200 bg-white p-6 lg:p-7 shadow-sm"
                >
                  <div className={`flex items-center justify-center h-11 w-11 rounded-xl ${item.bg} mb-4`}>
                    {item.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 tracking-tight mb-2">
                    {item.title[locale] ?? item.title.en}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {item.body[locale] ?? item.body.en}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. Newsletter CTA (visual-only, no backend yet) ─────────────── */}
      <HomeNewsletter locale={locale} isRtl={isRtl} />
    </div>
  )
}

function HomeNewsletter({ locale, isRtl }: { locale: Locale; isRtl: boolean }) {
  const [email, setEmail] = useState('')
  const [website, setWebsite] = useState('') // honeypot — bots will fill this; real users won't see it
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const headline = locale === 'ar'
    ? 'انضم إلى عائلة GENOSYS'
    : locale === 'ru'
    ? 'Вступайте в сообщество GENOSYS'
    : 'Join the GENOSYS insiders'

  const description = locale === 'ar'
    ? 'نصائح من الخبراء، إطلاقات جديدة، وعروض حصرية — مباشرةً إلى بريدك الإلكتروني.'
    : locale === 'ru'
    ? 'Советы экспертов, новинки и эксклюзивные предложения — прямо на вашу почту.'
    : 'Expert tips, new launches, and exclusive offers — straight to your inbox.'

  const successMsg = locale === 'ar'
    ? 'شكراً لك! تحقق من بريدك الإلكتروني للتأكيد.'
    : locale === 'ru'
    ? 'Спасибо! Проверьте почту — мы отправили подтверждение.'
    : 'Thanks — check your inbox for a welcome email.'

  const genericError = locale === 'ar'
    ? 'تعذّر الاشتراك الآن. حاول مرة أخرى لاحقاً.'
    : locale === 'ru'
    ? 'Не удалось подписаться. Попробуйте позже.'
    : 'Could not subscribe right now. Please try again later.'

  const invalidEmailMsg = locale === 'ar'
    ? 'يرجى إدخال بريد إلكتروني صالح.'
    : locale === 'ru'
    ? 'Введите действительный email.'
    : 'Please enter a valid email address.'

  const rateLimitMsg = locale === 'ar'
    ? 'محاولات كثيرة. حاول بعد قليل.'
    : locale === 'ru'
    ? 'Слишком много попыток. Попробуйте позже.'
    : 'Too many attempts. Please try again in a few minutes.'

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (status === 'loading') return
    const trimmed = email.trim()
    if (!trimmed) return

    setStatus('loading')
    setErrorMsg('')

    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: trimmed,
          locale,
          source: 'homepage',
          website, // honeypot; server silently accepts if filled
        }),
      })

      if (res.ok) {
        setStatus('success')
        setEmail('')
        return
      }

      if (res.status === 429) {
        setStatus('error')
        setErrorMsg(rateLimitMsg)
        return
      }

      const data = await res.json().catch(() => null)
      setStatus('error')
      setErrorMsg(
        res.status === 400
          ? (typeof data?.error === 'string' ? data.error : invalidEmailMsg)
          : genericError
      )
    } catch {
      setStatus('error')
      setErrorMsg(genericError)
    }
  }

  return (
    <section className="bg-gray-900 text-white py-16 lg:py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-white/10 mb-5">
            <Mail className="h-5 w-5 text-white" aria-hidden="true" />
          </div>
          <h2 className="text-3xl lg:text-[36px] lg:leading-[1.1] font-bold font-display tracking-tight">
            {headline}
          </h2>
          <p className="mt-3 text-gray-300 max-w-xl mx-auto text-sm lg:text-base">
            {description}
          </p>

          {status === 'success' ? (
            <div className="mt-8 inline-flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-400/30 text-emerald-200 px-5 py-3">
              <Check className="h-4 w-4" aria-hidden="true" />
              <span className="text-sm font-semibold">{successMsg}</span>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              noValidate
              className={`mt-8 flex flex-col sm:flex-row gap-3 max-w-lg mx-auto ${isRtl ? 'sm:flex-row-reverse' : ''}`}
            >
              <label htmlFor="home-newsletter-email" className="sr-only">
                {locale === 'ar' ? 'البريد الإلكتروني' : locale === 'ru' ? 'Email' : 'Email address'}
              </label>
              <input
                id="home-newsletter-email"
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder={
                  locale === 'ar' ? 'أدخل بريدك الإلكتروني' : locale === 'ru' ? 'Введите email' : 'Enter your email'
                }
                className={`flex-1 min-w-0 rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-sm text-white placeholder:text-gray-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 disabled:opacity-60 ${isRtl ? 'text-right' : ''}`}
                autoComplete="email"
                disabled={status === 'loading'}
                aria-invalid={status === 'error'}
                aria-describedby={status === 'error' ? 'home-newsletter-error' : undefined}
              />

              {/* Honeypot — off-screen, hidden from a11y tree; only bots fill it. */}
              <input
                type="text"
                name="website"
                value={website}
                onChange={e => setWebsite(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="hidden"
              />

              <button
                type="submit"
                disabled={status === 'loading'}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white text-gray-900 px-5 py-3 font-semibold text-sm hover:bg-gray-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {status === 'loading'
                  ? (locale === 'ar' ? 'جارٍ الإرسال…' : locale === 'ru' ? 'Отправляем…' : 'Subscribing…')
                  : (locale === 'ar' ? 'اشترك' : locale === 'ru' ? 'Подписаться' : 'Subscribe')}
                {status !== 'loading' && (
                  <ArrowRight className={`h-4 w-4 ${isRtl ? 'rotate-180' : ''}`} aria-hidden="true" />
                )}
              </button>
            </form>
          )}

          {status === 'error' && (
            <p id="home-newsletter-error" className="mt-4 text-sm text-red-300" role="alert">
              {errorMsg || genericError}
            </p>
          )}

          <p className="mt-4 text-xs text-gray-400">
            {locale === 'ar'
              ? 'يمكنك إلغاء الاشتراك في أي وقت. نحن نحترم خصوصيتك.'
              : locale === 'ru'
              ? 'Можно отписаться в любой момент. Мы уважаем вашу приватность.'
              : 'Unsubscribe any time. We respect your privacy.'}
          </p>
        </div>
      </div>
    </section>
  )
}
