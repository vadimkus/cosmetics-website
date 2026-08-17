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
  /**
   * Kept on the type because the concern pages read it, but no longer used on
   * the homepage tile. Eight concerns each carried their own colour — gold,
   * green, purple, blue, teal, pink — with no rule a reader could infer from
   * them, the same problem /contact had with its six channel tiles. The icon
   * already distinguishes the concerns; the colour was only noise.
   */
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
      className="reveal-on-view home-band px-4"
      aria-labelledby="skin-concern-heading"
      data-testid="skin-concern-section"
      dir={dir}
    >
      <div className="mx-auto max-w-[1200px]">
        <div
          className={`mb-9 grid items-end gap-7 lg:mb-11 lg:grid-cols-12 ${
            isRtl ? 'text-right' : 'text-left'
          }`}
        >
          <div className="lg:col-span-7">
            <p className="cera-eyebrow mb-2.5">{copy.eyebrow}</p>
            <h2
              id="skin-concern-heading"
              className="cera-serif max-w-[16ch] text-[30px] leading-[1.05] sm:text-[38px] lg:text-[46px]"
            >
              {copy.heading}
            </h2>
          </div>
          <p
            className={`max-w-[44ch] text-[14px] leading-relaxed text-[var(--cera-muted)] lg:col-span-5 ${
              isRtl ? 'lg:me-auto' : 'lg:ms-auto'
            }`}
          >
            {copy.support}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
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
                className={`home-tile home-concern-card group relative isolate flex p-4 ${
                  isRtl ? 'text-right' : 'text-left'
                }`}
              >
                <Image
                  src={visual.image}
                  alt=""
                  fill
                  sizes="(max-width: 639px) 100vw, (max-width: 959px) 50vw, 320px"
                  className="home-tile__image home-tile__image--mirrored pointer-events-none -z-20 object-cover"
                  style={{ objectPosition: visual.imagePosition }}
                  aria-hidden="true"
                />
                <span className="home-tile__wash pointer-events-none absolute inset-0 -z-10" aria-hidden="true" />

                <div className="flex w-full flex-col">
                  <div className={`flex items-start justify-between gap-3 ${isRtl ? 'flex-row-reverse' : ''}`}>
                    <span className="ed-mark ed-mark--tactile ed-mark--round h-9 w-9" aria-hidden="true">
                      <Icon className="h-4 w-4" strokeWidth={1.65} />
                    </span>
                    <span className="rounded-full border border-[var(--cera-line)] bg-white/90 px-2.5 py-0.5 text-[10px] font-medium text-[var(--cera-muted)]">
                      {formatProductCount(count, locale)}
                    </span>
                  </div>

                  <h3 className="cera-serif mt-3.5 max-w-[76%] text-[18px] leading-tight text-[var(--cera-ink)] lg:text-[19px]">
                    {concern.label[locale]}
                  </h3>
                  <p className="mt-1.5 max-w-[70%] text-[12px] leading-[1.45] text-[var(--cera-muted)]">
                    {concern.benefit[locale]}
                  </p>

                  <span
                    className={`mt-auto flex items-center gap-1.5 pt-3 text-[11px] font-semibold text-[var(--cera-rose-ink)] ${
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

        <div className="ed-row mt-3 p-4 sm:px-5 sm:py-4">
          <div
            className={`flex flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:justify-between ${
              isRtl ? 'sm:flex-row-reverse' : ''
            }`}
          >
            <div className={`flex items-center gap-3.5 ${isRtl ? 'flex-row-reverse text-right' : 'text-left'}`}>
              <span className="ed-mark ed-mark--tactile ed-mark--round h-11 w-11" aria-hidden="true">
                <Sparkles className="h-[18px] w-[18px]" strokeWidth={1.5} />
              </span>
              <span>
                <span className="cera-serif block text-[18px] leading-tight text-[var(--cera-ink)]">
                  {copy.ctaTitle}
                </span>
                <span className="mt-1 block text-[12.5px] text-[var(--cera-muted)]">{copy.ctaBody}</span>
              </span>
            </div>
            <Link
              href={getLocalizedPath('/skin-recommendation', locale)}
              aria-label={copy.ctaAria}
              className={`ed-cta min-h-11 px-7 py-3 text-[14px] sm:min-w-[286px] ${isRtl ? 'flex-row-reverse' : ''}`}
            >
              {copy.ctaButton}
              <ArrowRight className={`h-4 w-4 ${isRtl ? 'rotate-180' : ''}`} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
