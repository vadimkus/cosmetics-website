'use client'

import { useRouter } from 'next/navigation'
import { useTranslation } from '@/hooks/useTranslation'
import { getLocalizedPath } from '@/lib/i18n'
import { useAuth } from '@/components/auth/AuthProvider'
import { useIsMobileWeb } from '@/hooks/useIsMobile'
import { useHideOnScroll } from '@/hooks/useHideOnScroll'
import LocaleSwitchInline from '@/components/LocaleSwitchInline'
import AccountAvatar from '@/components/AccountAvatar'

/**
 * The bar at the top of a blog article on a phone.
 *
 * It lived inside `BlogPostClient`, which only the English route goes through: `/ar` and
 * `/ru` have their own article clients and reached for `PdpLocaleBar` instead, so the same
 * page had one bar in English and a different one in Arabic and Russian - the latter with
 * no account control at all.
 *
 * Nothing here was ever English-only; the back label has always carried all three
 * translations. It just had no way of being used from the other two routes.
 *
 * Mobile only. Desktop keeps the site header.
 */
export default function BlogArticleBar() {
  const { locale, dir } = useTranslation()
  const router = useRouter()
  const { user } = useAuth()
  const { isMobile, isClient } = useIsMobileWeb()
  // Steps aside on the way down and returns on the way up, matching the app's article
  // header. Long-form reading is where a permanent bar costs most.
  const { ref: barRef, hidden: barHidden } = useHideOnScroll<HTMLDivElement>()

  const isRTL = dir === 'rtl'
  // Was `isMobileWeb`, which excludes the installed PWA. `PWAHeader` also hides itself on
  // /blog, so PWA readers were getting no bar at all: no way back to the blog, and no
  // language control. Any narrow viewport gets it.
  if (!(isClient && isMobile)) return null

  return (
    <div
      ref={barRef}
      data-hidden={barHidden}
      className={`blog-article-bar mweb-hide-on-scroll mweb-float-sticky-top sticky top-0 z-50 flex items-center justify-between px-4 py-3 bg-[var(--cera-cream)]/95 border-b border-[var(--cera-line)] backdrop-blur ${
        isRTL ? 'flex-row-reverse' : ''
      }`}
    >
      <button
        onClick={() => router.push(getLocalizedPath('/blog', locale))}
        className={`flex items-center gap-1 min-w-[80px] ${isRTL ? 'flex-row-reverse' : ''}`}
      >
        <svg
          className={`w-5 h-5 text-[var(--cera-rose-ink)] ${isRTL ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        <span className="text-base text-[var(--cera-rose-ink)]">
          {locale === 'ar' ? 'المدونة' : locale === 'ru' ? 'Блог' : 'Blog'}
        </span>
      </button>
      {/* The "Article" label that sat here told the reader nothing they could not see.
          The language control is what this bar was missing. */}
      <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <LocaleSwitchInline />
        <button
          onClick={() => router.push(getLocalizedPath('/profile', locale))}
          className="flex"
          aria-label="Profile"
        >
          <AccountAvatar name={user?.name} signedIn={!!user} />
        </button>
      </div>
    </div>
  )
}
