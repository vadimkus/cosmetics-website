import Image from 'next/image'
import type { Locale } from '@/lib/i18n'
import {
  IconClinical,
  IconOfficialDistributor,
  IconMadeInKorea,
} from '@/components/icons/BrandIcons'

const BACKGROUND_IMAGE = '/images/home/skin_concern/anti-aging.webp'

const COPY = {
  en: {
    eyebrow: 'Why GENOSYS',
    headline: ['Korean science.', 'Certified in the UAE.'],
    support:
      'GENOSYS is a professional Korean dermacosmetics brand. We have been the official UAE distributor since 2019.',
    cards: [
      {
        label: 'Clinical-grade',
        title: 'Used by dermatologists across Korea',
        body: 'The same formulas applied in Korean dermatology clinics - now available to UAE consumers and professionals.',
      },
      {
        label: 'In the UAE since 2019',
        title: 'Official UAE distributor',
        body: 'Certified by Dubai Municipality and VAT-registered. Every product is sourced directly from GENOSYS Korea - never gray-market.',
      },
      {
        label: 'Seoul, Korea',
        title: 'Formulated and produced in GENOSYS labs',
        body: 'Every product is made in our own Seoul facility, with R&D rooted in microneedling and growth-factor research.',
      },
    ],
  },
  ru: {
    eyebrow: 'Почему GENOSYS',
    headline: ['Корейская наука.', 'Сертифицировано в ОАЭ.'],
    support:
      'GENOSYS - профессиональная корейская дерматокосметика. Мы официальный дистрибьютор в ОАЭ с 2019 года.',
    cards: [
      {
        label: 'Клинический класс',
        title: 'Применяется дерматологами в Корее',
        body: 'Те же формулы, что применяются в дерматологических клиниках Кореи - теперь доступны в ОАЭ.',
      },
      {
        label: 'В ОАЭ с 2019',
        title: 'Официальный дистрибьютор в ОАЭ',
        body: 'Сертифицировано муниципалитетом Дубая, регистрация НДС. Каждый продукт поставляется напрямую от GENOSYS Korea - никакого серого импорта.',
      },
      {
        label: 'Сеул, Корея',
        title: 'Разработано и произведено в лабораториях GENOSYS',
        body: 'Каждый продукт производится на собственной фабрике в Сеуле - исследования в области микронидлинга и факторов роста.',
      },
    ],
  },
  ar: {
    eyebrow: 'لماذا GENOSYS',
    headline: ['علم كوري.', 'معتمد في الإمارات.'],
    support:
      'GENOSYS علامة كورية احترافية في مستحضرات التجميل الطبية، ونحن موزعها الرسمي في الإمارات منذ 2019.',
    cards: [
      {
        label: 'بجودة عيادية',
        title: 'يستخدمها أطباء الجلدية في كوريا',
        body: 'نفس التركيبات المستخدمة في عيادات الجلدية الكورية - متاحة الآن للعملاء والمختصين في الإمارات.',
      },
      {
        label: 'في الإمارات منذ 2019',
        title: 'الموزع الرسمي في الإمارات',
        body: 'معتمد من بلدية دبي ومسجّل في ضريبة القيمة المضافة. كل منتج مورّد مباشرة من GENOSYS كوريا - وليس من السوق الموازي.',
      },
      {
        label: 'سيول، كوريا',
        title: 'تركيب وإنتاج في مختبرات GENOSYS',
        body: 'كل منتج مصنوع في مصنعنا الخاص بسيول، مع بحث وتطوير متخصص في الوخز الدقيق وعوامل النمو.',
      },
    ],
  },
} as const

const ICONS = [IconClinical, IconOfficialDistributor, IconMadeInKorea] as const

export default function WhyGenosysSection({
  locale,
  dir,
}: {
  locale: Locale
  dir: 'ltr' | 'rtl'
}) {
  const copy = COPY[locale]
  const isRtl = dir === 'rtl'

  return (
    <section
      className="reveal-on-view home-band home-band--white px-4"
      data-testid="why-genosys-section"
      dir={dir}
    >
      <div className="relative isolate mx-auto max-w-[1200px] overflow-hidden rounded-[24px] border border-[var(--cera-line)] bg-[var(--cera-cream)] px-6 py-10 sm:px-9 sm:py-12 lg:px-14 lg:py-14">
        {/* The portrait bleeds in from the trailing edge at low opacity and is
            mirrored in Arabic, so the face never lands under the copy column. */}
        <div
          className={`pointer-events-none absolute inset-y-0 -z-20 w-[76%] sm:w-[68%] ${
            isRtl ? 'left-0' : 'right-0'
          }`}
          aria-hidden="true"
        >
          <Image
            src={BACKGROUND_IMAGE}
            alt=""
            fill
            sizes="(max-width: 767px) 76vw, 780px"
            className="object-cover"
            style={{
              objectPosition: '76% 68%',
              opacity: 0.3,
              filter: 'saturate(0.2) sepia(0.16) contrast(0.84) brightness(1.12)',
              transform: isRtl ? 'scaleX(-1)' : undefined,
            }}
          />
        </div>
        <span
          className={`pointer-events-none absolute inset-0 -z-10 ${
            isRtl
              ? 'bg-[linear-gradient(270deg,var(--cera-cream)_0%,color-mix(in_srgb,var(--cera-cream)_91%,transparent)_35%,color-mix(in_srgb,var(--cera-cream)_45%,transparent)_62%,transparent_100%)]'
              : 'bg-[linear-gradient(90deg,var(--cera-cream)_0%,color-mix(in_srgb,var(--cera-cream)_91%,transparent)_35%,color-mix(in_srgb,var(--cera-cream)_45%,transparent)_62%,transparent_100%)]'
          }`}
          aria-hidden="true"
        />

        <div className={`grid items-center gap-7 md:grid-cols-12 md:gap-10 ${isRtl ? 'text-right' : 'text-left'}`}>
          <div className="md:col-span-7">
            <p className="cera-eyebrow">{copy.eyebrow}</p>
            <h2 className="cera-serif mt-3 text-[34px] leading-[1.04] sm:text-[42px] lg:text-[50px]">
              <span className="block">{copy.headline[0]}</span>
              <span className="block">{copy.headline[1]}</span>
            </h2>
          </div>
          <p
            className={`max-w-[44ch] text-[15px] leading-relaxed text-[var(--cera-body)] md:col-span-5 ${
              isRtl ? 'md:me-auto' : 'md:ms-auto'
            }`}
          >
            {copy.support}
          </p>
        </div>

        <div className="mt-9 grid grid-cols-1 gap-4 md:grid-cols-3 lg:mt-11">
          {copy.cards.map((card, index) => {
            const Icon = ICONS[index] ?? IconClinical
            return (
              <article
                key={card.label}
                className={`cera-card p-6 sm:p-7 ${isRtl ? 'text-right' : 'text-left'}`}
              >
                <span className="ed-mark ed-mark--tactile h-11 w-11" aria-hidden="true">
                  <Icon className="h-[18px] w-[18px]" strokeWidth={1.55} />
                </span>
                <p className="cera-eyebrow mt-5 text-[10px]">{card.label}</p>
                <h3 className="cera-serif mt-2 text-[19px] leading-tight lg:text-[20px]">{card.title}</h3>
                <p className="mt-3 text-[14px] leading-relaxed text-[var(--cera-muted)]">{card.body}</p>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
