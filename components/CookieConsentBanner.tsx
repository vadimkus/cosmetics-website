'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getConsent, setConsent } from '@/lib/consent'
import { useTranslation } from '@/hooks/useTranslation'
import { getLocalizedPath } from '@/lib/i18n'

/**
 * Lightweight, non-blocking cookie-consent bar. Shows once until the visitor
 * accepts or declines; the choice is persisted and replayed into Google
 * Consent Mode (see lib/consent.ts + the default-denied block in layout.tsx).
 * Analytics stays cookieless/denied until "Accept".
 */
export default function CookieConsentBanner() {
  const { locale, dir } = useTranslation()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Only decide visibility on the client, after mount, to avoid hydration
    // mismatch and to read localStorage safely.
    if (getConsent() === null) setVisible(true)
  }, [])

  if (!visible) return null

  const isRtl = dir === 'rtl'
  const t = {
    text:
      locale === 'ar'
        ? 'نستخدم ملفات تعريف الارتباط لتحليل استخدام الموقع وتحسين تجربتك. يمكنك القبول أو الرفض.'
        : locale === 'ru'
        ? 'Мы используем файлы cookie для аналитики и улучшения сайта. Вы можете принять или отклонить.'
        : 'We use cookies for analytics to understand site usage and improve your experience. You can accept or decline.',
    privacy:
      locale === 'ar' ? 'سياسة الخصوصية' : locale === 'ru' ? 'Политика конфиденциальности' : 'Privacy Policy',
    accept: locale === 'ar' ? 'قبول' : locale === 'ru' ? 'Принять' : 'Accept',
    decline: locale === 'ar' ? 'رفض' : locale === 'ru' ? 'Отклонить' : 'Decline',
  }

  const choose = (value: 'accepted' | 'declined') => {
    setConsent(value)
    setVisible(false)
  }

  /* On mobile the tab bar floats clear of the bottom edge, so this sits above
     it as a matching inset card rather than running under it. From md up the
     tab bar is gone and this returns to a full-width strip. */
  return (
    <div
      role="dialog"
      aria-label={t.privacy}
      dir={dir}
      className="fixed z-[60] inset-x-[var(--mweb-chrome-inset)] bottom-[var(--mobile-nav-height)] rounded-[var(--mweb-chrome-radius)] border border-[var(--cera-line,#e9e1de)] bg-white/95 backdrop-blur px-4 py-3 shadow-[var(--mweb-chrome-shadow)] print:hidden md:inset-x-0 md:bottom-0 md:rounded-none md:border-0 md:border-t md:shadow-[0_-4px_20px_-8px_rgba(0,0,0,0.15)]"
    >
      <div
        className={`container mx-auto flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between ${isRtl ? 'sm:flex-row-reverse text-right' : ''}`}
      >
        <p className="text-sm text-[var(--cera-body,#3c3733)] leading-relaxed max-w-2xl">
          {t.text}{' '}
          <Link
            href={getLocalizedPath('/privacy-policy', locale)}
            className="font-semibold text-[var(--cera-rose-ink,#97281f)] underline hover:text-[var(--cera-rose-ink,#97281f)]"
          >
            {t.privacy}
          </Link>
        </p>
        <div className={`flex items-center gap-2 flex-shrink-0 ${isRtl ? 'flex-row-reverse' : ''}`}>
          <button
            type="button"
            onClick={() => choose('declined')}
            className="rounded-full border border-[var(--cera-line,#e9e1de)] px-4 py-2 text-sm font-semibold text-[var(--cera-body,#3c3733)] hover:bg-[var(--cera-cream-deep,#f2eceb)] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40"
          >
            {t.decline}
          </button>
          <button
            type="button"
            onClick={() => choose('accepted')}
            className="rounded-full bg-[var(--cera-ink,#17140f)] px-5 py-2 text-sm font-semibold text-white hover:bg-[var(--cera-rose-ink,#97281f)] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
          >
            {t.accept}
          </button>
        </div>
      </div>
    </div>
  )
}
