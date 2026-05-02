'use client'

import dynamic from 'next/dynamic'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Atom, FlaskConical, Orbit, Shield, Sparkles } from 'lucide-react'
import type { Locale } from '@/lib/i18n'
import { getLocalizedPath } from '@/lib/i18n'
import { GENOSYS_UNIVERSE_ZONES } from '@/lib/genosysUniverse'
import DesktopExperienceGate from './DesktopExperienceGate'

const GenosysUniverseScene = dynamic(() => import('./GenosysUniverseScene'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full animate-pulse bg-[radial-gradient(circle_at_55%_45%,rgba(248,113,113,0.2),transparent_34%),linear-gradient(135deg,#05070d,#140712)]" />
  ),
})

interface DesktopGenosysUniverseHubProps {
  locale: Locale
  dir: 'ltr' | 'rtl'
}

const copy = {
  en: {
    eyebrow: 'GENOSYS Universe',
    title: 'Skincare at molecular level.',
    body: 'Enter a clinical dermacosmetics lab where peptides, hydration complexes, barrier lipids and treatment protocols become explorable product worlds.',
    primary: 'Start with Barrier Chamber',
    secondary: 'View classic catalogue',
    live: 'Molecular Skin Lab',
    drag: 'Rotate the molecule core. Use cards to enter a world.',
    stats: ['Molecular view', 'Clinical worlds', 'Stable checkout'],
    mission: 'Current mission',
    missionTitle: 'Rebuild the barrier matrix',
    missionBody: 'The first chamber explains hydration, ceramide-style support and post-procedure comfort before the user reaches the buy controls.',
  },
  ru: {
    eyebrow: 'GENOSYS Universe',
    title: 'Уход на молекулярном уровне.',
    body: 'Войдите в клиническую dermacosmetics lab, где пептиды, гидратация, липидный барьер и протоколы становятся интерактивными мирами продуктов.',
    primary: 'Начать с Barrier Chamber',
    secondary: 'Классический каталог',
    live: 'Molecular Skin Lab',
    drag: 'Вращайте molecular core. Карты открывают миры.',
    stats: ['Molecular view', 'Клинические миры', 'Checkout стабилен'],
    mission: 'Текущая миссия',
    missionTitle: 'Восстановить barrier matrix',
    missionBody: 'Первая комната объясняет гидратацию, поддержку липидного барьера и комфорт после процедур до покупки.',
  },
  ar: {
    eyebrow: 'GENOSYS Universe',
    title: 'العناية بالبشرة على المستوى الجزيئي.',
    body: 'ادخل مختبر ديرماكوزمتكس سريري حيث تتحول الببتيدات والترطيب ودهون حاجز البشرة والبروتوكولات إلى عوالم منتجات تفاعلية.',
    primary: 'ابدأ بغرفة حاجز البشرة',
    secondary: 'الكتالوج الكلاسيكي',
    live: 'Molecular Skin Lab',
    drag: 'حرّك النواة الجزيئية. البطاقات تفتح العوالم.',
    stats: ['عرض جزيئي', 'عوالم سريرية', 'الدفع مستقر'],
    mission: 'المهمة الحالية',
    missionTitle: 'إعادة بناء حاجز البشرة',
    missionBody: 'الغرفة الأولى تشرح الترطيب ودعم حاجز البشرة والراحة بعد الإجراءات قبل الوصول إلى الشراء.',
  },
} satisfies Record<Locale, {
  eyebrow: string
  title: string
  body: string
  primary: string
  secondary: string
  live: string
  drag: string
  stats: string[]
  mission: string
  missionTitle: string
  missionBody: string
}>

function StaticUniverseFallback({ locale }: { locale: Locale }) {
  const text = copy[locale] ?? copy.en

  return (
    <div className="relative h-[720px] overflow-hidden rounded-none bg-[#080b12] px-6 py-10 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_45%,rgba(248,113,113,0.24),transparent_34%),linear-gradient(135deg,#05070d,#140712)]" />
      <div className="relative mx-auto grid h-full max-w-7xl grid-cols-[0.9fr_1.1fr] items-center gap-10">
        <div>
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-rose-100">{text.eyebrow}</p>
          <h1 className="max-w-2xl text-[70px] font-semibold leading-[0.92] tracking-[-0.055em]">{text.title}</h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-rose-50/80">{text.body}</p>
        </div>
        <div className="relative h-[600px]">
          <div className="absolute inset-0 rounded-full bg-rose-500/10 blur-3xl" />
          <Image src="/images/BRR.jpg" alt="GENOSYS Skin Barrier" fill sizes="50vw" className="object-contain p-20" />
        </div>
      </div>
    </div>
  )
}

export default function DesktopGenosysUniverseHub({ locale, dir }: DesktopGenosysUniverseHubProps) {
  const text = copy[locale] ?? copy.en
  const productsPath = getLocalizedPath('/products', locale)
  const barrierPath = getLocalizedPath('/products/27', locale)
  const localizedZones = GENOSYS_UNIVERSE_ZONES.map(zone => ({
    ...zone,
    href: getLocalizedPath(zone.path, locale),
    localizedTitle: zone.title[locale] ?? zone.title.en,
    localizedSubtitle: zone.subtitle[locale] ?? zone.subtitle.en,
    localizedSignal: zone.signal[locale] ?? zone.signal.en,
  }))
  const sceneZones = localizedZones.map(zone => ({
    id: zone.id,
    href: zone.href,
    title: zone.localizedTitle,
    signal: zone.localizedSignal,
    accent: zone.accent,
    scenePosition: zone.scenePosition,
  }))

  return (
    <DesktopExperienceGate
      className="bg-white text-gray-950"
      fallback={<StaticUniverseFallback locale={locale} />}
    >
      <section
        className="relative isolate min-h-[calc(100vh-64px)] overflow-hidden px-6 py-6"
        dir={dir}
        style={{ backgroundColor: '#f8fafc' }}
      >
        <div
          className="absolute inset-0 z-0"
          style={{
            background:
              'radial-gradient(circle at 58% 42%, rgba(248,113,113,0.12), transparent 31%), radial-gradient(circle at 84% 18%, rgba(56,189,248,0.1), transparent 28%), linear-gradient(135deg, #ffffff 0%, #f8fafc 46%, #fff1f2 100%)',
          }}
        />
        <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(255,255,255,0.022)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.022)_1px,transparent_1px)] bg-[size:80px_80px] opacity-20" />
        <div className="absolute inset-0 z-[1] opacity-100">
          <GenosysUniverseScene zones={sceneZones} />
        </div>
        <div
          className="relative mx-auto grid min-h-[calc(100vh-112px)] max-w-7xl grid-cols-[0.72fr_1.28fr] items-center gap-10"
          style={{ zIndex: 50, color: '#111827' }}
        >
          <div
            className={`relative max-w-xl pb-24 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}
            style={{ zIndex: 60, color: '#111827' }}
          >
            <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-red-100 bg-white/80 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-red-600 shadow-sm backdrop-blur-xl">
              <Orbit className="h-4 w-4" />
              {text.eyebrow}
            </div>

            <h1 className="max-w-3xl text-[clamp(3.2rem,6vw,6.25rem)] font-semibold leading-[0.86] tracking-[-0.07em] text-gray-950">
              {text.title}
            </h1>
            <p className="mt-6 max-w-2xl text-[17px] leading-8 text-gray-700">
              {text.body}
            </p>

            <div className={`mt-8 flex flex-wrap items-center gap-4 ${dir === 'rtl' ? 'flex-row-reverse justify-end' : ''}`}>
              <Link
                href={barrierPath}
                className="group inline-flex min-h-[52px] items-center gap-3 rounded-full bg-red-600 px-7 py-4 text-sm font-semibold text-white shadow-2xl shadow-red-200 transition hover:-translate-y-0.5 hover:bg-red-700"
              >
                <Shield className="h-5 w-5 text-primary-600" />
                {text.primary}
                <ArrowRight className={`h-5 w-5 transition group-hover:translate-x-0.5 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
              </Link>
              <Link
                href={productsPath}
                className="inline-flex min-h-[52px] items-center rounded-full border border-gray-300 bg-white/70 px-7 py-4 text-sm font-semibold text-gray-800 shadow-sm backdrop-blur-xl transition hover:border-red-200 hover:bg-white"
              >
                {text.secondary}
              </Link>
            </div>

            <div className="mt-8 grid max-w-xl grid-cols-3 gap-3">
              {text.stats.map((item, index) => (
                <div key={item} className="rounded-2xl border border-gray-200 bg-white/75 p-4 shadow-sm backdrop-blur-xl">
                  <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-red-50 text-red-600">
                    {index === 0 ? <Atom className="h-4 w-4" /> : <FlaskConical className="h-4 w-4" />}
                  </div>
                  <p className="text-sm leading-5 text-gray-700">{item}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-[1.75rem] border border-red-100 bg-white/78 p-5 shadow-sm backdrop-blur-xl">
              <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-red-600">
                <Sparkles className="h-3.5 w-3.5" />
                {text.mission}
              </div>
              <h2 className="mt-3 text-xl font-semibold tracking-[-0.025em] text-gray-950">{text.missionTitle}</h2>
              <p className="mt-2 text-sm leading-6 text-gray-600">{text.missionBody}</p>
            </div>
          </div>

          <div className="relative h-full min-h-[620px]">
            <div className="absolute right-0 top-8 rounded-2xl border border-gray-200 bg-white/65 px-4 py-3 text-xs text-gray-600 shadow-sm backdrop-blur-xl">
              <div className="font-semibold text-gray-950">{text.live}</div>
              <div className="mt-1 text-gray-500">{text.drag}</div>
            </div>
            <div className="absolute bottom-28 right-0 rounded-full border border-gray-200 bg-white/65 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-gray-500 shadow-sm backdrop-blur-xl">
              R3F · WebGL · Desktop
            </div>
          </div>
        </div>

        <div
          className="absolute inset-x-6 bottom-8 mx-auto grid max-w-7xl grid-cols-6 gap-3"
          style={{ zIndex: 70, color: '#111827' }}
        >
          {localizedZones.map((zone, index) => (
            <Link
              key={zone.id}
              href={zone.href}
              className="group relative min-h-[132px] overflow-hidden rounded-[1.65rem] border border-gray-200 bg-white/78 p-4 text-left shadow-sm backdrop-blur-xl transition hover:-translate-y-1 hover:border-red-200 hover:bg-white"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${zone.glow} opacity-0 transition group-hover:opacity-100`} />
              <div className="relative">
                <div className="mb-5 flex items-center justify-between">
                  <div className="h-2 w-10 rounded-full" style={{ backgroundColor: zone.accent }} />
                  <div className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 bg-gray-50 text-[11px] font-semibold text-gray-500">
                    {index + 1}
                  </div>
                </div>
                <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-red-500">{zone.localizedSignal}</div>
                <h2 className="mt-2 text-base font-semibold leading-tight text-gray-950">{zone.localizedTitle}</h2>
                <p className="mt-2 line-clamp-2 text-xs leading-5 text-gray-600">{zone.localizedSubtitle}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </DesktopExperienceGate>
  )
}
