'use client'

/**
 * Interactive face map - a SECONDARY aid on the skin-concern view.
 *
 * REBUILT 17 Aug 2026 after an audit of /products?categories=skin-concern. What was
 * wrong, and what each fix addresses:
 *
 *  1. WRONG DESIGN SYSTEM. It used text-gray-*, text-primary-* and shadow-xl while the
 *     page around it is on the editorial --cera-* palette with a serif display face, so
 *     it read as a different website. Now on cera tokens and cera-serif throughout.
 *
 *  2. IT LED THE PAGE. The concern cards - which carry imagery, descriptions and live
 *     product counts - sat two screens below it. The cards now lead and this sits under
 *     them, which is the owner decision of 17 Aug.
 *
 *  3. DESKTOP GAVE NOTHING UNTIL HOVER. The result panel was `md:hidden` while idle, so
 *     a desktop visitor got a face, eight faint dots and a void, and the payoff rendered
 *     below the fold. The panel now always occupies its space and shows a resting state.
 *
 *  4. KEYBOARD USERS SAW NOTHING. Zones responded to onMouseEnter but not onFocus, so
 *     you could tab through every hotspot without ever revealing a result. onFocus now
 *     selects, and the zone list is a real radiogroup.
 *
 *  5. MOTION IGNORED prefers-reduced-motion. Eight animate-ping rings plus a framer scan
 *     sweep ran regardless; the global rules in globals.css only cover named classes,
 *     not Tailwind's ping or framer. Both are now gated on useReducedMotion().
 *
 *  6. DUPLICATE NAVIGATION. Its chip list stayed in the DOM on desktop, so the page
 *     carried 16 links to 8 destinations. The chip list is gone - the concern cards
 *     directly above are the canonical set.
 *
 *  7. ARBITRARY ANATOMY. One eye had a hotspot, which read as a blemish rather than a
 *     control, and the left cheek meant pigmentation while the right meant redness for
 *     no stated reason. Zones are now symmetric, and paired zones resolve to the same
 *     concerns so the split is no longer arbitrary.
 *
 *  8. "Hover or tap" ON MOBILE, where hover does not exist. Copy is now device-neutral.
 *
 * The native app has its own face map - do not mirror layout changes there.
 */

import { useId, useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { ArrowRight, ArrowLeft } from 'lucide-react'
import { CONCERN_PAGES } from '@/lib/concernsData'
import { getConcernVisual } from '@/lib/concernVisuals'
import { getLocalizedPath } from '@/lib/i18n'
import type { Locale } from '@/lib/i18n'

interface FaceZone {
  id: string
  /** Hotspot centre, % of image width/height. */
  cx: number
  cy: number
  label: { en: string; ar: string; ru: string }
  /** CONCERN_PAGES slugs shown when this zone is active. */
  concerns: string[]
}

/* Zones are symmetric on purpose. A single hotspot on one eye or one cheek reads as a
   mark on the model's skin rather than a control, and a left/right split that means two
   different things cannot be explained to a customer. Paired zones therefore share an
   id prefix and resolve to the same concerns. */
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
    id: 'eye-left',
    cx: 30, cy: 47,
    label: { en: 'Eye contour', ar: 'محيط العين', ru: 'Контур глаз' },
    concerns: ['anti-aging'],
  },
  {
    id: 'eye-right',
    cx: 71, cy: 47,
    label: { en: 'Eye contour', ar: 'محيط العين', ru: 'Контур глаз' },
    concerns: ['anti-aging'],
  },
  {
    id: 'nose',
    cx: 50, cy: 58,
    label: { en: 'Nose & T-zone', ar: 'الأنف والمنطقة T', ru: 'Нос и Т-зона' },
    concerns: ['acne-treatment'],
  },
  {
    id: 'cheek-left',
    cx: 24, cy: 63,
    label: { en: 'Cheeks', ar: 'الخدود', ru: 'Щёки' },
    concerns: ['pigmentation', 'sensitivity'],
  },
  {
    id: 'cheek-right',
    cx: 76, cy: 63,
    label: { en: 'Cheeks', ar: 'الخدود', ru: 'Щёки' },
    concerns: ['pigmentation', 'sensitivity'],
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
    en: 'Or start from where it shows',
    ar: 'أو ابدئي من موضع الظهور',
    ru: 'Или начните с того, где это заметно',
  },
  title: {
    en: 'Point to the area that bothers you',
    ar: 'أشيري إلى المنطقة التي تزعجك',
    ru: 'Укажите зону, которая вас беспокоит',
  },
  subtitle: {
    en: 'Nine areas, mapped to the same eight concerns as the cards above. Choose one and we will name the protocol for it.',
    ar: 'تسع مناطق، مرتبطة بالمخاوف الثمانية نفسها في البطاقات أعلاه. اختاري واحدة وسنسمّي البروتوكول الخاص بها.',
    ru: 'Девять зон, связанных с теми же восемью задачами, что и карточки выше. Выберите зону - и мы назовём протокол для неё.',
  },
  resting: {
    en: 'Select an area on the face and the matching concern appears here.',
    ar: 'اختاري منطقة على الوجه وسيظهر هنا ما يناسبها.',
    ru: 'Выберите зону на лице - и соответствующая задача появится здесь.',
  },
  explore: { en: 'See the protocol', ar: 'اطّلعي على البروتوكول', ru: 'Смотреть протокол' },
  zoneLabel: { en: 'Selected area', ar: 'المنطقة المحددة', ru: 'Выбранная зона' },
  groupLabel: { en: 'Facial areas', ar: 'مناطق الوجه', ru: 'Зоны лица' },
}

interface ConcernFaceMapProps {
  locale: Locale
}

export default function ConcernFaceMap({ locale }: ConcernFaceMapProps) {
  const [activeZoneId, setActiveZoneId] = useState<string | null>(null)
  const isRtl = locale === 'ar'
  const groupId = useId()

  /* Respected for both the hotspot pulse and the scan sweep. Neither is load-bearing:
     the map is fully usable with all motion off. */
  const reduceMotion = useReducedMotion()

  const Arrow = isRtl ? ArrowLeft : ArrowRight

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
    <section className="mt-14 border-t border-[var(--cera-line)] pt-12" aria-labelledby={`${groupId}-heading`}>
      <div className="mx-auto max-w-[1100px]">
        <div className="text-center">
          <p className="cera-eyebrow">{COPY.kicker[locale]}</p>
          <h2 id={`${groupId}-heading`} className="cera-serif mt-3 text-[26px] leading-[1.14] text-[var(--cera-ink)] sm:text-[34px]">
            {COPY.title[locale]}
          </h2>
          <p className="mx-auto mt-3 max-w-[54ch] text-[14.5px] leading-relaxed text-[var(--cera-muted)]">
            {COPY.subtitle[locale]}
          </p>
        </div>

        {/* Face beside the result panel on desktop, stacked on mobile. The panel keeps
            its space in both, so selecting a zone never shifts the layout and the
            answer is never below the fold. */}
        <div className="mt-9 grid grid-cols-1 items-start gap-8 md:grid-cols-[minmax(0,420px)_minmax(0,1fr)] md:gap-12">
          <div className="relative mx-auto w-full max-w-[420px] select-none">
            <div
              className="cera-stage relative overflow-hidden rounded-[28px]"
              style={{ aspectRatio: '4 / 5' }}
            >
              <Image
                src="/images/face-map/face-front.jpg"
                alt=""
                aria-hidden="true"
                fill
                sizes="(max-width: 768px) 92vw, 420px"
                className="object-cover"
              />

              {!reduceMotion && (
                <motion.div
                  initial={{ top: '-8%' }}
                  whileInView={{ top: '108%' }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 1.6, ease: 'easeInOut', delay: 0.3 }}
                  className="pointer-events-none absolute inset-x-0 h-10 opacity-60"
                  style={{
                    background:
                      'linear-gradient(to bottom, transparent, rgba(151,40,31,0.14) 45%, rgba(151,40,31,0.34) 50%, rgba(151,40,31,0.14) 55%, transparent)',
                  }}
                />
              )}

              {/* Radiogroup rather than loose buttons: these are nine choices of one
                  thing, and screen readers should hear them that way. */}
              <div role="radiogroup" aria-label={COPY.groupLabel[locale]}>
                {ZONES.map((zone, i) => {
                  const isActive = zone.id === activeZoneId
                  return (
                    <button
                      key={zone.id}
                      type="button"
                      role="radio"
                      aria-checked={isActive}
                      aria-label={zone.label[locale]}
                      onClick={() => setActiveZoneId(zone.id)}
                      onFocus={() => setActiveZoneId(zone.id)}
                      onMouseEnter={() => setActiveZoneId(zone.id)}
                      className="absolute z-10 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cera-rose)] focus-visible:ring-offset-2"
                      style={{
                        left: `${zone.cx}%`,
                        top: `${zone.cy}%`,
                        touchAction: 'manipulation',
                        WebkitTapHighlightColor: 'transparent',
                      }}
                    >
                      {!reduceMotion && (
                        <span
                          aria-hidden="true"
                          className={`absolute rounded-full animate-ping ${
                            isActive ? 'h-9 w-9 bg-[var(--cera-rose)]/25' : 'h-7 w-7 bg-white/35'
                          }`}
                          style={{ animationDuration: '2.4s', animationDelay: `${i * 0.22}s` }}
                        />
                      )}
                      {/* A ring plus a white halo, so it reads as a control on skin
                          rather than as a mark on the model. */}
                      <span
                        aria-hidden="true"
                        className={`relative rounded-full border-2 shadow-[0_1px_6px_rgba(0,0,0,0.28)] transition-all duration-200 ${
                          isActive
                            ? 'h-5 w-5 border-white bg-[var(--cera-rose)]'
                            : 'h-4 w-4 border-white bg-[var(--cera-rose)]/85'
                        }`}
                      />
                    </button>
                  )
                })}
              </div>

              <AnimatePresence>
                {activeZone && (
                  <div
                    key={activeZone.id}
                    className="pointer-events-none absolute z-20 flex w-0 justify-center"
                    style={{
                      left: `${Math.min(Math.max(activeZone.cx, 22), 78)}%`,
                      top: `calc(${activeZone.cy}% - 42px)`,
                    }}
                  >
                    <motion.span
                      initial={{ opacity: 0, y: 6, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.95 }}
                      transition={{ duration: reduceMotion ? 0 : 0.18 }}
                      className="inline-block whitespace-nowrap rounded-full bg-[var(--cera-cta)]/88 px-3 py-1.5 text-[11px] font-medium text-white shadow-lg backdrop-blur-sm"
                    >
                      {activeZone.label[locale]}
                    </motion.span>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Result panel. Always present, so there is no empty void while idle and no
              layout shift when a zone is chosen. */}
          <div aria-live="polite" className="min-h-[260px]">
            <AnimatePresence mode="wait">
              {activeConcerns.length > 0 ? (
                <motion.div
                  key={activeZone?.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: reduceMotion ? 0 : 0.2 }}
                  className="space-y-3"
                >
                  <p className="cera-eyebrow">
                    {COPY.zoneLabel[locale]} - <span className="text-[var(--cera-ink)]">{activeZone?.label[locale]}</span>
                  </p>
                  {activeConcerns.map(concern => {
                    const seo = seoFor(concern)
                    const visual = getConcernVisual(concern.slug)
                    return (
                      <Link
                        key={concern.slug}
                        href={getLocalizedPath(`/products/concern/${concern.slug}`, locale)}
                        className="cera-card cera-card-hover group block p-5"
                      >
                        <div className={`flex items-start gap-4 ${isRtl ? 'flex-row-reverse text-right' : ''}`}>
                          {visual ? (
                            <div className="relative h-20 w-20 flex-none overflow-hidden rounded-2xl border border-[var(--cera-line)] bg-[var(--cera-cream-deep)]">
                              <Image
                                src={visual.image}
                                alt=""
                                fill
                                sizes="80px"
                                className="object-cover"
                                style={{ objectPosition: visual.imagePosition }}
                                aria-hidden="true"
                              />
                            </div>
                          ) : null}
                          <div className="min-w-0 flex-1">
                            <h3 className="cera-serif text-[19px] leading-snug text-[var(--cera-ink)]">
                              {seo.h1}
                            </h3>
                            {seo.heroShort && (
                              <p className="mt-1.5 line-clamp-2 text-[13.5px] leading-relaxed text-[var(--cera-muted)]">
                                {seo.heroShort}
                              </p>
                            )}
                            <span className="mt-3 inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-[var(--cera-rose-ink)]">
                              {COPY.explore[locale]}
                              <Arrow className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
                            </span>
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </motion.div>
              ) : (
                <motion.p
                  key="resting"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: reduceMotion ? 0 : 0.2 }}
                  className="flex min-h-[260px] items-center justify-center rounded-[24px] border border-dashed border-[var(--cera-line)] bg-white/50 p-8 text-center text-[14px] leading-relaxed text-[var(--cera-muted)]"
                >
                  {COPY.resting[locale]}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
