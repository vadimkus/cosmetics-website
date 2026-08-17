'use client'

/**
 * Homepage wrapper around the shared concern showcase.
 *
 * The header, tiles and CTA now live in components/concerns/ConcernShowcase so
 * that /products renders the identical block instead of its own older grid.
 * All this file adds is the homepage band and the scroll-reveal hook.
 *
 * SKIN_CONCERN_CARDS is re-exported because HomeDesktopSections and the tests
 * import it from here.
 */

import ConcernShowcase, { SKIN_CONCERN_CARDS } from '@/components/concerns/ConcernShowcase'
import type { Locale } from '@/lib/i18n'

export { SKIN_CONCERN_CARDS }
export type { SkinConcernCard } from '@/components/concerns/ConcernShowcase'

interface SkinConcernSectionProps {
  locale: Locale
  dir: 'ltr' | 'rtl'
  concernCounts?: Record<string, number> | undefined
}

export default function SkinConcernSection({
  locale,
  dir,
  concernCounts,
}: SkinConcernSectionProps) {
  return (
    <section
      className="reveal-on-view home-band px-4"
      aria-labelledby="skin-concern-heading"
      data-testid="skin-concern-section"
      dir={dir}
    >
      <ConcernShowcase locale={locale} dir={dir} concernCounts={concernCounts} />
    </section>
  )
}
