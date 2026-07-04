'use client'

/**
 * Interactive Face Map — "Tap where it bothers you"
 *
 * Premium entry point for the Skin Concern category: a studio portrait with
 * pulsing hotspots on facial zones. Hovering/tapping a zone reveals the
 * matching GENOSYS concern(s) with direct links to the concern landing pages.
 *
 * - Pure CSS/framer-motion (no new deps), works on touch + mouse + keyboard
 * - Fully localized (EN/AR/RU) with RTL support
 * - Falls back gracefully: the classic concern grid stays below this section
 */

import { useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { CONCERN_PAGES } from '@/lib/concernsData'
import { getLocalizedPath } from '@/lib/i18n'
import type { Locale } from '@/lib/i18n'

interface FaceZone {
  id: string
  /** Hotspot center, % of image width/height */
  cx: number
  cy: number
  label: { en: string; ar: string; ru: string }
  /** CONCERN_PAGES slugs shown when this zone is active */
  concerns: string[]
}

const ZONES: FaceZone[] = [
  {
    id: 'scalp',
    cx: 50, cy: 11,
    label: { en: 'Scalp & hairline', ar: 'فروة الرأس وخط الشعر', ru: 'Кожа головы и линия роста волос' },
    concerns: ['hair-loss'],
  },
  {
    id: 'forehead',
    cx: 50, cy: 30,
    label: { en: 'Forehead', ar: 'الجبهة', ru: 'Лоб' },
    concerns: ['anti-aging', 'sun-protection'],
  },
  {
    id: 'eyes',
    cx: 71, cy: 47,
    label: { en: 'Eye contour', ar: 'محيط العين', ru: 'Контур глаз' },
    concerns: ['anti-aging'],
  },
  {
    id: 'cheek-left',
    cx: 26, cy: 62,
    label: { en: 'Cheek — spots', ar: 'الخد — تصبغات', ru: 'Щека — пигментация' },
    concerns: ['pigmentation'],
  },
  {
    id: 'nose',
    cx: 50, cy: 58,
    label: { en: 'Nose & T-zone', ar: 'الأنف والمنطقة T', ru: 'Нос и Т-зона' },
    concerns: ['acne-treatment'],
  },
  {
    id: 'cheek-right',
    cx: 74, cy: 62,
    label: { en: 'Cheek — redness', ar: 'الخد — احمرار', ru: 'Щека — покраснение' },
    concerns: ['sensitivity'],
  },
  {
    id: 'mouth',
    cx: 50, cy: 78,
    label: { en: 'Lips & smile lines', ar: 'الشفاه وخطوط الابتسامة', ru: 'Губы и носогубные линии' },
    concerns: ['hydration'],
  },
  {
    id: 'chin',
    cx: 50, cy: 90,
    label: { en: 'Chin & jawline', ar: 'الذقن وخط الفك', ru: 'Подбородок и линия челюсти' },
    concerns: ['scars-treatment', 'acne-treatment'],
  },
]

const COPY = {
  kicker: {
    en: 'INTERACTIVE SKIN MAP',
    ar: 'خريطة البشرة التفاعلية',
    ru: 'ИНТЕРАКТИВНАЯ КАРТА КОЖИ',
  },
  title: {
    en: 'Tap where it bothers you',
    ar: 'اضغطي على المنطقة التي تزعجك',
    ru: 'Нажмите на зону, которая вас беспокоит',
  },
  subtitle: {
    en: 'Every zone tells a story. Select one to see the professional Korean protocol for it.',
    ar: 'كل منطقة تروي قصة. اختاري منطقة لعرض البروتوكول الكوري الاحترافي الخاص بها.',
    ru: 'Каждая зона расскажет свою историю. Выберите зону — и увидите профессиональный корейский протокол для неё.',
  },
  hint: {
    en: 'Hover or tap a point on the face',
    ar: 'مرّري المؤشر أو اضغطي على نقطة على الوجه',
    ru: 'Наведите курсор или нажмите на точку на лице',
  },
  explore: { en: 'Explore protocol', ar: 'اكتشفي البروتوكول', ru: 'Смотреть протокол' },
  zoneLabel: { en: 'Selected zone', ar: 'المنطقة المحددة', ru: 'Выбранная зона' },
}

interface ConcernFaceMapProps {
  locale: Locale
}

export default function ConcernFaceMap({ locale }: ConcernFaceMapProps) {
  const [activeZoneId, setActiveZoneId] = useState<string | null>(null)
  const panelRef = useRef<HTMLDivElement | null>(null)
  const isRTL = locale === 'ar'

  const selectZone = (zoneId: string, viaTap: boolean) => {
    setActiveZoneId(zoneId)
    // On small screens the result panel sits below the face — bring it into
    // view after a tap so the selection visibly "answers" the user.
    if (viaTap && typeof window !== 'undefined' && window.innerWidth < 768) {
      requestAnimationFrame(() => {
        panelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      })
    }
  }

  const activeZone = useMemo(
    () => ZONES.find(z => z.id === activeZoneId) || null,
    [activeZoneId]
  )

  const activeConcerns = useMemo(() => {
    if (!activeZone) return []
    return activeZone.concerns
      .map(slug => CONCERN_PAGES.find(c => c.slug === slug))
      .filter((c): c is (typeof CONCERN_PAGES)[number] => Boolean(c))
  }, [activeZone])

  const seoFor = (concern: (typeof CONCERN_PAGES)[number]) =>
    locale === 'ar' ? concern.seo.ar : locale === 'ru' ? concern.seo.ru : concern.seo.en

  return (
    <div className="mb-10" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="text-center mb-6">
        <span className="inline-block text-[11px] font-bold tracking-[0.2em] text-primary-600 mb-2">
          {COPY.kicker[locale]}
        </span>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
          {COPY.title[locale]}
        </h2>
        <p className="text-sm text-gray-500 mt-2 max-w-xl mx-auto">
          {COPY.subtitle[locale]}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 md:gap-10 items-start max-w-4xl mx-auto">
        {/* ==== Face with hotspots ==== */}
        <div className="relative mx-auto w-full max-w-sm select-none">
          <div className="relative rounded-3xl overflow-hidden shadow-xl ring-1 ring-black/5" style={{ aspectRatio: '4 / 5' }}>
            <Image
              src="/images/face-map/face-front.jpg"
              alt="Interactive skin concern face map"
              fill
              sizes="(max-width: 768px) 100vw, 384px"
              className="object-cover"
              priority={false}
            />

            {/* One-time scan sweep for the "AI analysis" feel */}
            <motion.div
              initial={{ top: '-8%' }}
              whileInView={{ top: '108%' }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 1.6, ease: 'easeInOut', delay: 0.3 }}
              className="pointer-events-none absolute left-0 right-0 h-10 opacity-70"
              style={{
                background:
                  'linear-gradient(to bottom, transparent, rgba(220,38,38,0.18) 45%, rgba(220,38,38,0.45) 50%, rgba(220,38,38,0.18) 55%, transparent)',
              }}
            />

            {/* Hotspots */}
            {ZONES.map((zone, i) => {
              const isActive = zone.id === activeZoneId
              return (
                <button
                  key={zone.id}
                  type="button"
                  aria-label={zone.label[locale]}
                  aria-pressed={isActive}
                  onClick={() => selectZone(zone.id, true)}
                  onMouseEnter={() => selectZone(zone.id, false)}
                  className="absolute -translate-x-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 z-10"
                  style={{ left: `${zone.cx}%`, top: `${zone.cy}%`, touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent' }}
                >
                  {/* pulse ring */}
                  <motion.span
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 1.2 + i * 0.12 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <span
                      className={`absolute rounded-full ${isActive ? 'w-9 h-9 bg-primary-500/25' : 'w-7 h-7 bg-white/30'} animate-ping`}
                      style={{ animationDuration: '2.2s', animationDelay: `${i * 0.25}s` }}
                    />
                    <span
                      className={`relative rounded-full border-2 transition-all duration-200 shadow-md ${
                        isActive
                          ? 'w-5 h-5 bg-primary-600 border-white'
                          : 'w-4 h-4 bg-white/85 border-primary-600'
                      }`}
                    />
                  </motion.span>
                </button>
              )
            })}

            {/* Zone label chip above the active dot (outer div owns position,
                inner motion.span owns the animation so transforms don't clash) */}
            <AnimatePresence>
              {activeZone && (
                <div
                  key={activeZone.id}
                  className="pointer-events-none absolute z-20 flex justify-center w-0"
                  style={{
                    left: `${Math.min(Math.max(activeZone.cx, 22), 78)}%`,
                    top: `calc(${activeZone.cy}% - 42px)`,
                  }}
                >
                  <motion.span
                    initial={{ opacity: 0, y: 6, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.95 }}
                    transition={{ duration: 0.18 }}
                    className="inline-block whitespace-nowrap rounded-full bg-gray-900/85 text-white text-[11px] font-medium px-3 py-1.5 backdrop-blur-sm shadow-lg"
                  >
                    {activeZone.label[locale]}
                  </motion.span>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ==== Result panel ==== */}
        <div ref={panelRef} className="min-h-[280px] scroll-mt-24">
          <AnimatePresence mode="wait">
            {activeConcerns.length > 0 ? (
              <motion.div
                key={activeZone?.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  {COPY.zoneLabel[locale]} — <span className="text-gray-700">{activeZone?.label[locale]}</span>
                </p>
                {activeConcerns.map(concern => {
                  const seo = seoFor(concern)
                  return (
                    <Link
                      key={concern.slug}
                      href={getLocalizedPath(`/products/concern/${concern.slug}`, locale)}
                      className="group block rounded-2xl border border-gray-100 bg-white p-5 shadow-sm hover:shadow-lg hover:border-primary-300 transition-all duration-200"
                    >
                      <div className="flex items-start gap-4">
                        {concern.icon && <span className="text-3xl leading-none mt-0.5">{concern.icon}</span>}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors leading-snug">
                            {seo.h1}
                          </h3>
                          {seo.heroShort && (
                            <p className="text-xs text-gray-500 mt-1.5 line-clamp-2 leading-relaxed">{seo.heroShort}</p>
                          )}
                          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 mt-3 group-hover:gap-2.5 transition-all">
                            {COPY.explore[locale]}
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d={isRTL ? 'M19 12H5m0 0l7 7m-7-7l7-7' : 'M5 12h14m0 0l-7-7m7 7l-7 7'} />
                            </svg>
                          </span>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </motion.div>
            ) : (
              <motion.div
                key="hint"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full"
              >
                <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50/60 p-6 text-center">
                  <span className="text-2xl block mb-2" aria-hidden>👆</span>
                  <p className="text-sm text-gray-500">{COPY.hint[locale]}</p>
                </div>

                {/* Quick chips — every concern reachable without the map */}
                <div className="mt-5 flex flex-wrap gap-2 justify-center">
                  {CONCERN_PAGES.map(concern => {
                    const seo = seoFor(concern)
                    return (
                      <Link
                        key={concern.slug}
                        href={getLocalizedPath(`/products/concern/${concern.slug}`, locale)}
                        className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:border-primary-300 hover:text-primary-600 transition-colors"
                      >
                        {concern.icon && <span aria-hidden>{concern.icon}</span>}
                        {seo.h1}
                      </Link>
                    )
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
