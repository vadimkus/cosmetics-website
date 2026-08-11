'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, FlaskConical, Gauge, MousePointer2, Sparkles } from 'lucide-react'
import type { Locale } from '@/lib/i18n'
import { getLocalizedPath } from '@/lib/i18n'
import DesktopExperienceGate from './DesktopExperienceGate'

const SkinLabHeroScene = dynamic(() => import('./SkinLabHeroScene'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full animate-pulse rounded-[2rem] bg-gradient-to-br from-rose-50 via-white to-slate-100" />
  ),
})

interface DesktopSkinLabHeroProps {
  locale: Locale
  dir: 'ltr' | 'rtl'
}

const copy = {
  en: {
    eyebrow: 'GENOSYS Skin Lab · Desktop immersive preview',
    title: 'Dermacosmetics you can explore, not just scroll.',
    body: 'A desktop-first product lab for Korean professional skincare: rotate formulas, inspect packaging, and move from education to purchase without losing the clinical feel.',
    primary: 'Enter the product lab',
    secondary: 'Shop products',
    proof: ['WebGL-first desktop', '3D-ready product system', 'Mobile/PWA unchanged'],
  },
  ru: {
    eyebrow: 'GENOSYS Skin Lab · Иммерсивный desktop-preview',
    title: 'Космецевтика, которую можно изучать, а не просто листать.',
    body: 'Desktop-first лаборатория для корейского профессионального ухода: вращайте продукты, изучайте упаковку и переходите от обучения к покупке без потери клинического ощущения.',
    primary: 'Открыть product lab',
    secondary: 'Каталог продуктов',
    proof: ['WebGL-first desktop', '3D-ready система', 'Mobile/PWA без изменений'],
  },
  ar: {
    eyebrow: 'GENOSYS Skin Lab · تجربة سطح مكتب تفاعلية',
    title: 'مستحضرات يمكنك استكشافها، لا مجرد تصفحها.',
    body: 'مختبر منتجات مخصص لسطح المكتب للعناية الكورية الاحترافية: تدوير المنتج، فحص التغليف، والانتقال من التعليم إلى الشراء بسلاسة.',
    primary: 'افتح مختبر المنتجات',
    secondary: 'تسوق المنتجات',
    proof: ['سطح مكتب WebGL', 'نظام منتجات ثلاثي الأبعاد', 'الموبايل والتطبيق كما هما'],
  },
} satisfies Record<Locale, {
  eyebrow: string
  title: string
  body: string
  primary: string
  secondary: string
  proof: string[]
}>

function StaticFallback() {
  return (
    <div className="relative h-[620px] overflow-hidden rounded-[2rem] border border-rose-100 bg-gradient-to-br from-white via-rose-50 to-slate-100 shadow-2xl">
      <Image
        src="/images/skin_barr/main.jpeg"
        alt="GENOSYS Skin Barrier Protecting Cream"
        fill
        priority
        sizes="50vw"
        className="object-contain p-20"
      />
      <div className="absolute bottom-6 left-6 rounded-2xl border border-white/80 bg-white/80 px-4 py-3 text-sm text-gray-600 shadow-lg backdrop-blur">
        3D preview loads on desktop browsers with WebGL enabled.
      </div>
    </div>
  )
}

export default function DesktopSkinLabHero({ locale, dir }: DesktopSkinLabHeroProps) {
  const text = copy[locale] ?? copy.en
  const productsPath = getLocalizedPath('/products', locale)
  const labPath = getLocalizedPath('/products/27', locale)

  return (
    <DesktopExperienceGate
      className="bg-[#0b0f19] text-white"
      fallback={<StaticFallback />}
    >
      <section className="relative isolate min-h-[calc(100vh-64px)] overflow-hidden px-6 py-10" dir={dir}>
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(248,113,113,0.24),transparent_32%),radial-gradient(circle_at_80%_5%,rgba(255,255,255,0.16),transparent_28%),linear-gradient(135deg,#0b0f19_0%,#111827_48%,#3f0b17_100%)]" />
        <div className="absolute inset-x-0 bottom-0 -z-10 h-48 bg-gradient-to-t from-white to-transparent" />

        <div className="mx-auto grid max-w-7xl grid-cols-[0.9fr_1.1fr] items-center gap-10">
          <div className={dir === 'rtl' ? 'text-right' : 'text-left'}>
            <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-rose-100 backdrop-blur">
              <FlaskConical className="h-4 w-4" />
              {text.eyebrow}
            </div>

            <div className="mb-8 flex items-center gap-4">
              <Image
                src="/images/genosys-logo.png"
                alt="GENOSYS"
                width={156}
                height={56}
                priority
                className="h-12 w-auto rounded-xl bg-white/95 px-4 py-2"
              />
              <div className="h-px flex-1 bg-gradient-to-r from-white/40 to-transparent" />
            </div>

            <h1 className="max-w-3xl text-[72px] font-semibold leading-[0.92] tracking-[-0.055em] text-white">
              {text.title}
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-rose-50/80">
              {text.body}
            </p>

            <div className={`mt-9 flex flex-wrap items-center gap-4 ${dir === 'rtl' ? 'flex-row-reverse justify-end' : ''}`}>
              <Link
                href={labPath}
                className="group inline-flex min-h-[52px] items-center gap-3 rounded-full bg-white px-7 py-4 text-base font-semibold text-gray-950 shadow-2xl shadow-rose-950/30 transition hover:-translate-y-0.5 hover:bg-rose-50"
              >
                <Sparkles className="h-5 w-5 text-primary-600" />
                {text.primary}
                <ArrowRight className={`h-5 w-5 transition group-hover:translate-x-0.5 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
              </Link>
              <Link
                href={productsPath}
                className="inline-flex min-h-[52px] items-center rounded-full border border-white/25 px-7 py-4 text-base font-semibold text-white/90 transition hover:border-white/60 hover:bg-white/10"
              >
                {text.secondary}
              </Link>
            </div>

            <div className="mt-10 grid max-w-xl grid-cols-3 gap-3">
              {text.proof.map((item, index) => (
                <div key={item} className="rounded-2xl border border-white/12 bg-white/[0.07] p-4 backdrop-blur">
                  <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/10">
                    {index === 0 ? <Gauge className="h-4 w-4" /> : <MousePointer2 className="h-4 w-4" />}
                  </div>
                  <p className="text-sm leading-5 text-white/74">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative h-[680px]">
            <div className="absolute inset-0 rounded-[2.5rem] border border-white/10 bg-white/[0.04] shadow-[0_40px_120px_rgba(0,0,0,0.45)] backdrop-blur" />
            <div className="absolute inset-3 overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/10 to-white/[0.02]">
              <SkinLabHeroScene />
            </div>
            <div className="absolute bottom-8 right-8 rounded-2xl border border-white/15 bg-black/25 px-4 py-3 text-xs text-white/72 backdrop-blur">
              Drag the scene · live WebGL prototype
            </div>
          </div>
        </div>
      </section>
    </DesktopExperienceGate>
  )
}
