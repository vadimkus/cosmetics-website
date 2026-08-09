import Image from 'next/image'
import Link from 'next/link'
import { CONCERN_PAGES } from '@/lib/concernsData'
import { getConcernVisual } from '@/lib/concernVisuals'
import { getLocalizedPath } from '@/lib/i18n'

type Locale = 'en' | 'ru' | 'ar'

export default function ConcernLinkGrid({ locale }: { locale: Locale }) {
  const isRtl = locale === 'ar'

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4" data-testid="concern-link-grid">
      {CONCERN_PAGES.map(concern => {
        const visual = getConcernVisual(concern.slug)
        if (!visual) return null

        return (
          <Link
            key={concern.slug}
            href={getLocalizedPath(`/products/concern/${concern.slug}`, locale)}
            className="group relative isolate min-h-[156px] overflow-hidden rounded-[14px] border border-[#e5e1d9] bg-white p-4 shadow-[0_2px_8px_rgba(42,35,24,0.035)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#d7c7a8] hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#a77a2d] focus-visible:ring-offset-2"
          >
            <Image
              src={visual.image}
              alt=""
              fill
              sizes="(max-width: 639px) 50vw, 288px"
              className="pointer-events-none -z-20 object-cover transition-transform duration-500 group-hover:scale-[1.025]"
              style={{
                objectPosition: visual.imagePosition,
                transform: isRtl ? 'scaleX(-1)' : undefined,
              }}
              aria-hidden="true"
            />
            <span
              className={`pointer-events-none absolute inset-0 -z-10 ${
                isRtl
                  ? 'bg-[linear-gradient(270deg,rgba(255,255,255,0.96)_0%,rgba(255,255,255,0.83)_38%,rgba(255,255,255,0.18)_65%,transparent_77%)]'
                  : 'bg-[linear-gradient(90deg,rgba(255,255,255,0.96)_0%,rgba(255,255,255,0.83)_38%,rgba(255,255,255,0.18)_65%,transparent_77%)]'
              }`}
              aria-hidden="true"
            />
            <div className={`max-w-[75%] ${isRtl ? 'ml-auto text-right' : 'text-left'}`}>
              <span className="text-base" aria-hidden="true">{concern.icon}</span>
              <h3
                className="mt-2 text-[15px] font-semibold leading-tight text-[#211e19] transition-colors group-hover:text-[#8a6424]"
                style={{ fontFamily: 'Georgia, "Times New Roman", ui-serif, serif' }}
              >
                {concern.seo[locale].h1}
              </h3>
              <p className="mt-1.5 line-clamp-2 text-[10px] leading-relaxed text-[#625d55]">
                {concern.seo[locale].heroShort || concern.seo[locale].description}
              </p>
            </div>
          </Link>
        )
      })}
    </div>
  )
}
