import Image from 'next/image'
import Link from 'next/link'
import { getConcernVisual } from '@/lib/concernVisuals'
import type { ConcernPage } from '@/lib/concernsData'
import { getLocalizedPath } from '@/lib/i18n'

type Locale = 'en' | 'ru' | 'ar'

const HERO_COPY = {
  en: {
    home: 'Home',
    products: 'Products',
    concerns: 'Skin Concerns',
    allConcerns: 'View All Skin Concerns',
  },
  ru: {
    home: 'Главная',
    products: 'Продукция',
    concerns: 'Проблемы кожи',
    allConcerns: 'Все проблемы кожи',
  },
  ar: {
    home: 'الرئيسية',
    products: 'المنتجات',
    concerns: 'مشاكل البشرة',
    allConcerns: 'عرض جميع مشاكل البشرة',
  },
} as const

export default function ConcernHero({
  concern,
  locale,
}: {
  concern: ConcernPage
  locale: Locale
}) {
  const visual = getConcernVisual(concern.slug)
  const seo = concern.seo[locale]
  const copy = HERO_COPY[locale]
  const isRtl = locale === 'ar'

  if (!visual) return null

  return (
    <section
      className="bg-[#fffefa] px-4 py-8 sm:py-10"
      data-testid="concern-hero"
      data-concern-slug={concern.slug}
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <div className="relative isolate mx-auto min-h-[340px] max-w-6xl overflow-hidden rounded-[18px] border border-[#e5e1d9] bg-white shadow-[0_8px_28px_-22px_rgba(43,35,24,0.3)] sm:min-h-[360px]">
        <Image
          src={visual.image}
          alt=""
          fill
          priority
          sizes="(max-width: 767px) 100vw, 1152px"
          className="pointer-events-none -z-20 object-cover"
          style={{
            objectPosition: visual.imagePosition,
            transform: isRtl ? 'scaleX(-1)' : undefined,
          }}
          aria-hidden="true"
        />
        <span
          className={`pointer-events-none absolute inset-0 -z-10 ${
            isRtl
              ? 'bg-[linear-gradient(270deg,rgba(255,255,255,0.98)_0%,rgba(255,255,255,0.91)_36%,rgba(255,255,255,0.58)_53%,rgba(255,255,255,0.08)_70%,transparent_78%)]'
              : 'bg-[linear-gradient(90deg,rgba(255,255,255,0.98)_0%,rgba(255,255,255,0.91)_36%,rgba(255,255,255,0.58)_53%,rgba(255,255,255,0.08)_70%,transparent_78%)]'
          }`}
          aria-hidden="true"
        />

        <div
          className={`relative z-10 flex min-h-[340px] max-w-[760px] flex-col justify-center px-6 py-8 sm:min-h-[360px] sm:px-10 lg:px-14 ${
            isRtl ? 'mr-auto items-end text-right' : 'items-start text-left'
          }`}
        >
          <nav className="hidden text-xs text-[#766f65] sm:flex sm:items-center sm:gap-2">
            <Link href={getLocalizedPath('/', locale)} className="hover:text-[#9c742e]">
              {copy.home}
            </Link>
            <span aria-hidden="true">/</span>
            <Link href={getLocalizedPath('/products', locale)} className="hover:text-[#9c742e]">
              {copy.products}
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-[#29251f]">{seo.h1}</span>
          </nav>

          <p className="mt-0 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#9c742e] sm:mt-6">
            {copy.concerns}
          </p>
          <h1
            className="mt-3 max-w-[640px] text-[34px] font-semibold leading-[1.02] tracking-[-0.03em] text-[#1c1915] sm:text-[44px] lg:text-[52px]"
            style={{ fontFamily: 'Georgia, "Times New Roman", ui-serif, serif' }}
          >
            {seo.h1}
          </h1>
          <span className="mt-4 block h-px w-10 bg-[#b59457]" aria-hidden="true" />
          <p className="mt-4 max-w-[82%] text-[14px] leading-relaxed text-[#5f5a53] sm:max-w-[620px] sm:text-[16px]">
            {seo.heroShort || seo.intro}
          </p>
          <Link
            href={getLocalizedPath('/products?categories=skin-concern', locale)}
            className="mt-5 inline-flex min-h-11 items-center text-[12px] font-semibold text-[#98712d] transition-colors hover:text-[#6f501c] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#a77a2d] focus-visible:ring-offset-2"
          >
            {copy.allConcerns}
          </Link>
        </div>
      </div>
    </section>
  )
}
