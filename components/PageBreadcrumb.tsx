'use client'

import Link from 'next/link'
import { ChevronRight, ChevronLeft } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'

/**
 * The one breadcrumb on the site.
 *
 * Before this existed, breadcrumbs rendered at five different left offsets (96,
 * 144, 192, 208 and 360px at a 1440 viewport), three vertical positions, three
 * font sizes and two separators, so the trail visibly jumped as you moved between
 * pages. The geometry here is the one the 44 bespoke product pages already shared,
 * because that was both the dominant standard and the best-looking one:
 *
 *   band  mx-auto w-full max-w-[1200px] px-4 pt-4 sm:px-6 md:pt-8 lg:pt-12
 *   nav   13px, --cera-muted, chevron separator, current crumb in --cera-ink
 *
 * The band is part of the component on purpose. Position is the thing that kept
 * drifting, so callers should not be able to set it — place this as the first
 * child of the page root, above the page's own (often narrower) content
 * container, and the trail lands in the same place on every route.
 *
 * The palette tokens are only defined under `.cera-page` and a handful of
 * page-level stylesheets, so every colour here carries a literal fallback. That
 * lets this render correctly on pages that have not been through the editorial
 * rework yet.
 */

export interface Crumb {
  /** Visible label. Already localised by the caller. */
  name: string
  /** Omit on the last item: the current page is not a link. */
  href?: string
}

interface PageBreadcrumbProps {
  items: Crumb[]
  /**
   * Extra classes for the band, for the rare page that needs to close the gap
   * to a hero directly beneath it. Do not use this to change the left offset.
   */
  className?: string
  /**
   * Render the `<nav>` alone, without the positioning band, for the two places
   * that sit inside an existing flex header row (checkout and login).
   */
  bare?: boolean
}

const MUTED = 'text-[color:var(--cera-muted,#6a625d)]'
const INK = 'text-[color:var(--cera-ink,#17140f)]'
const HOVER = 'hover:text-[color:var(--cera-rose-ink,#97281f)]'

export default function PageBreadcrumb({ items, className = '', bare = false }: PageBreadcrumbProps) {
  const { dir } = useTranslation()
  const isRtl = dir === 'rtl'
  const Separator = isRtl ? ChevronLeft : ChevronRight

  const nav = (
    <nav
      aria-label="Breadcrumb"
      dir={dir}
      className={`flex flex-wrap items-center gap-1.5 text-[13px] ${MUTED} ${bare ? className : ''}`}
    >
      {items.map((item, i) => {
        const isLast = i === items.length - 1
        return (
          <span key={`${item.name}-${i}`} className="flex items-center gap-1.5">
            {i > 0 && <Separator className="h-3.5 w-3.5 flex-none opacity-60" aria-hidden="true" />}
            {isLast || !item.href ? (
              <span className={`${INK} max-w-[200px] truncate font-medium sm:max-w-xs md:max-w-md`} aria-current="page">
                {item.name}
              </span>
            ) : (
              <Link href={item.href} className={`${HOVER} transition-colors`}>
                {item.name}
              </Link>
            )}
          </span>
        )
      })}
    </nav>
  )

  if (bare) return nav

  return (
    <div className={`mx-auto w-full max-w-[1200px] px-4 pt-4 sm:px-6 md:pt-8 lg:pt-12 ${className}`}>{nav}</div>
  )
}
