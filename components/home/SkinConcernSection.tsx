'use client'

import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowRight,
  Bandage,
  Contrast,
  Droplets,
  Feather,
  Hourglass,
  ShieldCheck,
  Sparkles,
  Sprout,
  Sun,
  type LucideIcon,
} from 'lucide-react'
import { getLocalizedPath, type Locale } from '@/lib/i18n'
import { getConcernVisual } from '@/lib/concernVisuals'

type LocalizedCopy = Record<Locale, string>

export interface SkinConcernCard {
  slug: string
  label: LocalizedCopy
  benefit: LocalizedCopy
  count: number
  icon: LucideIcon
  accent: string
}

export const SKIN_CONCERN_CARDS: SkinConcernCard[] = [
  {
    slug: 'sun-protection',
    label: { en: 'Sun Protection', ru: 'Защита от солнца', ar: 'الحماية من الشمس' },
    benefit: {
      en: 'Daily UV protection built for UAE sun.',
      ru: 'Ежедневная UV-защита для солнца ОАЭ.',
      ar: 'حماية يومية من الأشعة فوق البنفسجية مصممة لشمس الإمارات.',
    },
    count: 5,
    icon: Sun,
    accent: 'text-[#a77a2d] bg-[#fffaf0] border-[#ead8b3]',
  },
  {
    slug: 'acne-treatment',
    label: { en: 'Acne & Blemishes', ru: 'Акне и высыпания', ar: 'حب الشباب والبثور' },
    benefit: {
      en: 'Calm breakouts and fade post-acne marks.',
      ru: 'Успокаивает высыпания и осветляет следы постакне.',
      ar: 'تهدئة البثور وتفتيح آثار حب الشباب.',
    },
    count: 7,
    icon: ShieldCheck,
    accent: 'text-[#3b8b72] bg-[#f1faf6] border-[#cbe5da]',
  },
  {
    slug: 'pigmentation',
    label: { en: 'Pigmentation', ru: 'Пигментация', ar: 'التصبغات' },
    benefit: {
      en: 'Fade dark spots and even out skin tone.',
      ru: 'Осветляет пигментные пятна и выравнивает тон.',
      ar: 'تفتيح البقع الداكنة وتوحيد لون البشرة.',
    },
    count: 5,
    icon: Contrast,
    accent: 'text-[#8a60a8] bg-[#faf6fd] border-[#dfcfe9]',
  },
  {
    slug: 'scars-treatment',
    label: { en: 'Scar Treatment', ru: 'Коррекция рубцов', ar: 'علاج الندبات' },
    benefit: {
      en: 'Smooth scars and refine skin texture.',
      ru: 'Сглаживает рубцы и улучшает текстуру кожи.',
      ar: 'تنعيم الندبات وتحسين ملمس البشرة.',
    },
    count: 6,
    icon: Bandage,
    accent: 'text-[#547ca3] bg-[#f3f8fc] border-[#ccdeeb]',
  },
  {
    slug: 'hair-loss',
    label: { en: 'Hair Loss', ru: 'Выпадение волос', ar: 'تساقط الشعر' },
    benefit: {
      en: 'Stronger roots and a healthier scalp.',
      ru: 'Укрепляет корни и поддерживает здоровье кожи головы.',
      ar: 'جذور أقوى وفروة رأس أكثر صحة.',
    },
    count: 9,
    icon: Sprout,
    accent: 'text-[#438b7b] bg-[#f1faf7] border-[#cae5de]',
  },
  {
    slug: 'anti-aging',
    label: { en: 'Anti-Aging', ru: 'Антивозрастной уход', ar: 'مكافحة الشيخوخة' },
    benefit: {
      en: 'Smooth wrinkles, restore firmness and glow.',
      ru: 'Разглаживает морщины, возвращает упругость и сияние.',
      ar: 'تنعيم التجاعيد واستعادة المرونة والإشراق.',
    },
    count: 9,
    icon: Hourglass,
    accent: 'text-[#b15f75] bg-[#fff5f7] border-[#edced7]',
  },
  {
    slug: 'hydration',
    label: { en: 'Hydration', ru: 'Увлажнение', ar: 'الترطيب' },
    benefit: {
      en: 'Deep hydration that lasts all day.',
      ru: 'Глубокое увлажнение на весь день.',
      ar: 'ترطيب عميق يدوم طوال اليوم.',
    },
    count: 8,
    icon: Droplets,
    accent: 'text-[#557cba] bg-[#f3f7fd] border-[#ccd9ed]',
  },
  {
    slug: 'sensitivity',
    label: { en: 'Sensitive Skin', ru: 'Чувствительная кожа', ar: 'البشرة الحساسة' },
    benefit: {
      en: 'Soothe redness and calm sensitive skin.',
      ru: 'Снимает покраснение и успокаивает чувствительную кожу.',
      ar: 'تهدئة الاحمرار والعناية بالبشرة الحساسة.',
    },
    count: 9,
    icon: Feather,
    accent: 'text-[#a8783d] bg-[#fffaf2] border-[#ead9be]',
  },
]

function formatProductCount(count: number, locale: Locale): string {
  if (locale === 'ar') return `${count} منتجات`
  if (locale === 'ru') {
    const mod10 = count % 10
    const mod100 = count % 100
    const word =
      mod10 === 1 && mod100 !== 11
        ? 'продукт'
        : mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)
          ? 'продукта'
          : 'продуктов'
    return `${count} ${word}`
  }
  return `${count} ${count === 1 ? 'product' : 'products'}`
}

interface SkinConcernSectionProps {
  locale: Locale
  dir: 'ltr' | 'rtl'
  concernCounts?: Record<string, number> | undefined
}

const SECTION_COPY: Record<
  Locale,
  {
    eyebrow: string
    heading: string
    support: string
    explore: string
    ctaTitle: string
    ctaBody: string
    ctaButton: string
    ctaAria: string
  }
> = {
  en: {
    eyebrow: 'Targeted solutions',
    heading: 'Shop by skin concern',
    support:
      'Pick a concern and we’ll route you to the right products and step-by-step routine — backed by GENOSYS clinical research.',
    explore: 'Explore',
    ctaTitle: 'Not sure where to start?',
    ctaBody: 'Get a personalised routine in under a minute.',
    ctaButton: 'Start free skin analysis',
    ctaAria: 'Start free GENOSYS skin analysis',
  },
  ru: {
    eyebrow: 'Точечные решения',
    heading: 'Уход по потребностям кожи',
    support:
      'Выберите задачу, и мы подберём подходящие продукты и пошаговый уход на основе клинических исследований GENOSYS.',
    explore: 'Смотреть',
    ctaTitle: 'Не знаете, с чего начать?',
    ctaBody: 'Получите персональную программу ухода меньше чем за минуту.',
    ctaButton: 'Начать бесплатный анализ кожи',
    ctaAria: 'Начать бесплатный анализ кожи GENOSYS',
  },
  ar: {
    eyebrow: 'حلول موجهة',
    heading: 'تسوقي حسب احتياجات بشرتك',
    support:
      'اختاري ما يشغل بشرتك وسنرشدك إلى المنتجات والروتين المناسب خطوة بخطوة، بدعم من أبحاث GENOSYS السريرية.',
    explore: 'اكتشفي',
    ctaTitle: 'لستِ متأكدة من أين تبدئين؟',
    ctaBody: 'احصلي على روتين شخصي في أقل من دقيقة.',
    ctaButton: 'ابدئي تحليل البشرة المجاني',
    ctaAria: 'ابدئي تحليل البشرة المجاني من GENOSYS',
  },
}

export default function SkinConcernSection({
  locale,
  dir,
  concernCounts,
}: SkinConcernSectionProps) {
  const isRtl = dir === 'rtl'
  const copy = SECTION_COPY[locale]

  return (
    <section
      className="reveal-on-view border-y border-[#eeeae3] bg-[#fffefa] py-14 lg:py-[74px]"
      aria-labelledby="skin-concern-heading"
      data-testid="skin-concern-section"
      dir={dir}
    >
      <div className="mx-auto max-w-[1180px] px-5 sm:px-8 lg:px-[42px]">
        <div
          className={`concern-header mb-9 grid items-end gap-7 ${
            isRtl ? 'text-right' : 'text-left'
          }`}
        >
          <div className="concern-title-column">
            <p className="mb-2.5 text-[9px] font-semibold uppercase tracking-[0.23em] text-[#9c742e]">
              {copy.eyebrow}
            </p>
            <h2
              id="skin-concern-heading"
              className="concern-title max-w-[390px] text-[39px] font-normal leading-[0.99] tracking-[-0.032em] text-[#181714]"
              style={{ fontFamily: 'Georgia, "Times New Roman", ui-serif, serif' }}
            >
              {copy.heading}
            </h2>
            <span
              className={`mt-3.5 block h-px w-10 bg-[#b59457] ${isRtl ? 'mr-0' : 'ml-0'}`}
              aria-hidden="true"
            />
          </div>
          <p
            className={`concern-support max-w-[410px] text-[13px] leading-[1.6] text-[#5e5a54] ${
              isRtl ? 'concern-support-rtl' : 'concern-support-ltr'
            }`}
          >
            {copy.support}
          </p>
        </div>

        <div className="concern-grid grid grid-cols-1 gap-3 sm:grid-cols-2">
          {SKIN_CONCERN_CARDS.map((concern) => {
            const Icon = concern.icon
            const count = concernCounts?.[concern.slug] ?? concern.count
            const visual = getConcernVisual(concern.slug)
            if (!visual) return null

            return (
              <Link
                key={concern.slug}
                href={getLocalizedPath(`/products/concern/${concern.slug}`, locale)}
                aria-label={`${concern.label[locale]}, ${formatProductCount(count, locale)}`}
                className={`concern-card group relative isolate flex overflow-hidden rounded-[13px] border border-[#e5e2dc] bg-white p-4 shadow-[0_2px_9px_rgba(44,38,29,0.035)] transition-[transform,box-shadow,border-color] duration-500 hover:-translate-y-1 hover:border-[#d8d1c5] hover:shadow-[0_15px_30px_-19px_rgba(45,37,26,0.3)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#a77a2d] focus-visible:ring-offset-3 motion-reduce:transform-none motion-reduce:transition-none ${
                  isRtl ? 'text-right' : 'text-left'
                }`}
              >
                <Image
                  src={visual.image}
                  alt=""
                  fill
                  sizes="(max-width: 639px) 100vw, (max-width: 959px) 50vw, 320px"
                  className={`pointer-events-none -z-20 object-cover transition-transform duration-700 motion-reduce:transition-none ${
                    isRtl ? 'concern-image-rtl' : 'group-hover:scale-[1.035]'
                  }`}
                  style={{ objectPosition: visual.imagePosition }}
                  aria-hidden="true"
                />
                <span
                  className={`pointer-events-none absolute inset-0 -z-10 ${
                    isRtl
                      ? 'bg-[linear-gradient(270deg,rgba(255,255,255,0.92)_0%,rgba(255,255,255,0.68)_27%,rgba(255,255,255,0.2)_43%,transparent_56%)]'
                      : 'bg-[linear-gradient(90deg,rgba(255,255,255,0.92)_0%,rgba(255,255,255,0.68)_27%,rgba(255,255,255,0.2)_43%,transparent_56%)]'
                  }`}
                  aria-hidden="true"
                />
                <span
                  className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[28%] bg-[linear-gradient(0deg,rgba(255,255,255,0.2)_0%,transparent_100%)]"
                  aria-hidden="true"
                />

                <div className="flex w-full flex-col">
                  <div
                    className={`flex items-start justify-between gap-3 ${
                      isRtl ? 'flex-row-reverse' : ''
                    }`}
                  >
                    <span
                      className={`inline-flex h-8 w-8 items-center justify-center rounded-full border shadow-[0_1px_4px_rgba(39,34,26,0.035)] ${concern.accent}`}
                      aria-hidden="true"
                    >
                      <Icon className="h-[15px] w-[15px]" strokeWidth={1.65} />
                    </span>
                    <span className="rounded-full border border-[#e9e5dd] bg-white/90 px-2 py-0.5 text-[9px] font-medium text-[#68635c] shadow-[0_1px_4px_rgba(30,25,18,0.04)]">
                      {formatProductCount(count, locale)}
                    </span>
                  </div>

                  <h3
                    className="mt-3 max-w-[76%] text-[17px] font-semibold leading-tight tracking-[-0.012em] text-[#1d1b18] lg:text-[18px]"
                    style={{ fontFamily: 'Georgia, "Times New Roman", ui-serif, serif' }}
                  >
                    {concern.label[locale]}
                  </h3>
                  <p className="mt-1 max-w-[69%] text-[11px] leading-[1.42] text-[#5f5a53] lg:text-[12px]">
                    {concern.benefit[locale]}
                  </p>

                  <span
                    className={`mt-auto flex items-center gap-1.5 pt-3 text-[10px] font-semibold text-[#98712d] ${
                      isRtl ? 'flex-row-reverse justify-end' : ''
                    }`}
                  >
                    {copy.explore}
                    <ArrowRight
                      className={`h-3 w-3 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none ${
                        isRtl ? 'rotate-180 group-hover:-translate-x-1' : ''
                      }`}
                      aria-hidden="true"
                    />
                  </span>
                </div>
              </Link>
            )
          })}
        </div>

        <div className="mt-4 rounded-[13px] border border-[#e5e1d9] bg-white p-3 shadow-[0_3px_12px_rgba(52,42,25,0.03)] sm:px-4 sm:py-3.5">
          <div
            className={`flex flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:justify-between ${
              isRtl ? 'sm:flex-row-reverse' : ''
            }`}
          >
            <div
              className={`flex items-center gap-3.5 px-1 ${
                isRtl ? 'flex-row-reverse text-right' : 'text-left'
              }`}
            >
              <span
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#e7dcc6] bg-[#fffdf8] text-[#a77a2d]"
                aria-hidden="true"
              >
                <Sparkles className="h-4 w-4" strokeWidth={1.5} />
              </span>
              <span>
                <span
                  className="block text-[16px] font-medium text-[#24211d]"
                  style={{ fontFamily: 'Georgia, "Times New Roman", ui-serif, serif' }}
                >
                  {copy.ctaTitle}
                </span>
                <span className="mt-0.5 block text-[11px] text-[#6b665e] sm:text-[12px]">
                  {copy.ctaBody}
                </span>
              </span>
            </div>
            <Link
              href={getLocalizedPath('/skin-recommendation', locale)}
              aria-label={copy.ctaAria}
              className={`inline-flex min-h-11 items-center justify-center gap-4 rounded-[5px] bg-[#171614] px-7 py-2.5 text-[10px] font-semibold uppercase tracking-[0.13em] text-[#f0dfbd] shadow-[0_4px_12px_rgba(20,18,15,0.14)] transition-[background-color,transform,box-shadow] hover:-translate-y-0.5 hover:bg-black hover:shadow-[0_7px_18px_rgba(20,18,15,0.2)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#a77a2d] focus-visible:ring-offset-2 motion-reduce:transform-none motion-reduce:transition-none sm:min-w-[286px] ${
                isRtl ? 'flex-row-reverse' : ''
              }`}
            >
              {copy.ctaButton}
              <ArrowRight className={`h-4 w-4 ${isRtl ? 'rotate-180' : ''}`} aria-hidden="true" />
            </Link>
          </div>
        </div>
        <style>{`
          [data-testid='skin-concern-section'] .concern-card {
            min-height: 198px;
          }

          [data-testid='skin-concern-section'] .concern-image-rtl {
            transform: scaleX(-1);
          }

          [data-testid='skin-concern-section'] .group:hover .concern-image-rtl {
            transform: scaleX(-1.035) scaleY(1.035);
          }

          @media (min-width: 960px) {
            [data-testid='skin-concern-section'] .concern-header {
              grid-template-columns: repeat(12, minmax(0, 1fr));
              margin-bottom: 2.5rem;
            }

            [data-testid='skin-concern-section'] .concern-title-column {
              grid-column: span 7 / span 7;
            }

            [data-testid='skin-concern-section'] .concern-title {
              font-size: 48px;
            }

            [data-testid='skin-concern-section'] .concern-support {
              grid-column: span 5 / span 5;
              font-size: 14px;
            }

            [data-testid='skin-concern-section'] .concern-support-ltr {
              margin-left: auto;
            }

            [data-testid='skin-concern-section'] .concern-support-rtl {
              margin-right: auto;
            }

            [data-testid='skin-concern-section'] .concern-grid {
              grid-template-columns: repeat(4, minmax(0, 1fr));
              gap: 13px;
            }

            [data-testid='skin-concern-section'] .concern-card {
              min-height: 174px;
            }
          }

          @media (min-width: 1024px) {
            [data-testid='skin-concern-section'] .concern-card {
              min-height: 198px;
            }
          }
        `}</style>
      </div>
    </section>
  )
}
