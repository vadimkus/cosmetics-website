import Image from 'next/image'
import Link from 'next/link'
import { CONCERN_PAGES } from '@/lib/concernsData'
import { getConcernVisual } from '@/lib/concernVisuals'
import { getLocalizedPath } from '@/lib/i18n'

type Locale = 'en' | 'ru' | 'ar'

const SECTION_TITLES: Record<Locale, string> = {
  en: 'Related Skin Concerns',
  ru: 'Связанные проблемы кожи',
  ar: 'مشاكل البشرة ذات الصلة',
}

export default function RelatedConcernCards({
  currentSlug,
  locale,
}: {
  currentSlug: string
  locale: Locale
}) {
  const isRtl = locale === 'ar'
  const related = CONCERN_PAGES.filter(concern => concern.slug !== currentSlug)

  return (
    <section className="px-4 py-8 sm:py-12" data-testid="related-concern-cards">
      <div className="mx-auto max-w-6xl">
        <h2 className={`mb-6 text-xl font-semibold text-gray-900 sm:text-2xl ${isRtl ? 'text-right' : ''}`}>
          {SECTION_TITLES[locale]}
        </h2>
        <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 sm:grid sm:grid-cols-3 sm:overflow-visible sm:pb-0 lg:grid-cols-4">
          {related.map(concern => {
            const visual = getConcernVisual(concern.slug)
            if (!visual) return null

            return (
              <Link
                key={concern.slug}
                href={getLocalizedPath(`/products/concern/${concern.slug}`, locale)}
                className="group relative isolate min-h-[176px] min-w-[220px] flex-shrink-0 snap-start overflow-hidden rounded-[14px] border border-[#e5e2dc] bg-white p-5 shadow-[0_2px_9px_rgba(44,38,29,0.035)] transition-[transform,box-shadow,border-color] hover:-translate-y-0.5 hover:border-[#d8d1c5] hover:shadow-[0_12px_24px_-18px_rgba(45,37,26,0.3)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#a77a2d] focus-visible:ring-offset-2 sm:min-w-0"
              >
                <Image
                  src={visual.image}
                  alt=""
                  fill
                  sizes="(max-width: 639px) 220px, (max-width: 1023px) 33vw, 288px"
                  className={`pointer-events-none -z-20 object-cover transition-transform duration-500 ${
                    isRtl ? '' : 'group-hover:scale-[1.025]'
                  }`}
                  style={{
                    objectPosition: visual.imagePosition,
                    transform: isRtl ? 'scaleX(-1)' : undefined,
                  }}
                  aria-hidden="true"
                />
                <span
                  className={`pointer-events-none absolute inset-0 -z-10 ${
                    isRtl
                      ? 'bg-[linear-gradient(270deg,rgba(255,255,255,0.96)_0%,rgba(255,255,255,0.82)_36%,rgba(255,255,255,0.2)_61%,transparent_74%)]'
                      : 'bg-[linear-gradient(90deg,rgba(255,255,255,0.96)_0%,rgba(255,255,255,0.82)_36%,rgba(255,255,255,0.2)_61%,transparent_74%)]'
                  }`}
                  aria-hidden="true"
                />
                <div className={`max-w-[72%] ${isRtl ? 'ml-auto text-right' : 'text-left'}`}>
                  <span className="text-lg" aria-hidden="true">{concern.icon}</span>
                  <h3
                    className="cera-serif mt-3 text-[18px] leading-tight text-[var(--cera-ink)]"
                  >
                    {concern.seo[locale].h1}
                  </h3>
                  <p className="mt-1.5 line-clamp-2 text-[11px] leading-[1.45] text-[#5f5a53]">
                    {concern.seo[locale].description}
                  </p>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
