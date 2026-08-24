'use client'

import { Suspense, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { Globe, Check } from 'lucide-react'
import { getLocaleFromPath, switchLocaleHardNav, type Locale } from '@/lib/i18n'

/**
 * Compact language control for the light headers that product and blog pages
 * render instead of the site header.
 *
 * The three site-wide headers all hide themselves on those routes
 * (`lib/simpleHeaderPages.ts`), which left mobile readers with no way to change
 * language once they opened a product or an article — the switcher only existed
 * in the header they had just navigated away from.
 *
 * `LanguageSwitcher` is not reusable here: it is a bare `EN` in green sized for
 * a dense desktop icon row, and it disappears against these bars. This one is a
 * bordered pill with a globe, tall enough to hit with a thumb, and painted in
 * the cera tokens the bars already use.
 *
 * Switching keeps the reader on the same product or article. `getLocalizedPath`
 * only swaps the prefix, and every localized route exists at the same slug.
 */

const LABELS: Record<Locale, string> = {
  en: 'English',
  ru: 'Русский',
  ar: 'العربية',
}

const ORDER: readonly Locale[] = ['en', 'ru', 'ar'] as const

function LocaleSwitchInlineContent({ className = '' }: { className?: string }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const locale = getLocaleFromPath(pathname)
  const [open, setOpen] = useState(false)
  const [switching, setSwitching] = useState(false)
  const isRTL = locale === 'ar'

  const select = (target: Locale) => {
    setOpen(false)
    if (target === locale) return
    setSwitching(true)
    // Hard navigation, matching every other switcher on the site: iOS Safari
    // was dropping client-side locale switches and leaving the old language up.
    switchLocaleHardNav(target, pathname || '/', searchParams?.toString())
  }

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        disabled={switching}
        aria-label="Change language"
        aria-expanded={open}
        aria-haspopup="listbox"
        className="flex h-9 items-center gap-1.5 rounded-full border border-[var(--cera-line)] bg-white px-3 text-[13px] font-semibold tracking-[0.04em] text-[var(--cera-rose-ink)] transition-colors active:bg-[var(--cera-cream-deep)] disabled:opacity-50"
        style={{ WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation' }}
      >
        <Globe className="h-4 w-4" aria-hidden="true" />
        <span>{switching ? '…' : locale.toUpperCase()}</span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} aria-hidden="true" />
          <div
            role="listbox"
            aria-label="Language"
            className={`absolute top-full z-50 mt-2 min-w-[150px] overflow-hidden rounded-2xl border border-[var(--cera-line)] bg-white py-1 shadow-lg ${isRTL ? 'left-0' : 'right-0'}`}
          >
            {ORDER.map(l => (
              <button
                key={l}
                type="button"
                role="option"
                aria-selected={l === locale}
                onClick={() => select(l)}
                dir={l === 'ar' ? 'rtl' : 'ltr'}
                className={`flex w-full items-center justify-between gap-3 px-4 py-2.5 text-[14px] transition-colors active:bg-[var(--cera-cream-deep)] ${
                  l === locale
                    ? 'bg-[var(--cera-cream)] font-semibold text-[var(--cera-rose-ink)]'
                    : 'text-[var(--cera-body)]'
                }`}
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                <span>{LABELS[l]}</span>
                {l === locale && <Check className="h-4 w-4 flex-none" aria-hidden="true" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

/**
 * `useSearchParams` opts the whole route into client rendering unless it sits
 * behind a Suspense boundary, and these bars live on statically generated
 * product and blog pages.
 */
export default function LocaleSwitchInline({ className = '' }: { className?: string }) {
  return (
    <Suspense
      fallback={
        <div
          className={`h-9 w-[74px] rounded-full border border-[var(--cera-line)] bg-white ${className}`}
          aria-hidden="true"
        />
      }
    >
      <LocaleSwitchInlineContent className={className} />
    </Suspense>
  )
}
