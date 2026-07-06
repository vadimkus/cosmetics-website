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

  return (
    <div
      role="dialog"
      aria-label={t.privacy}
      dir={dir}
      className="fixed inset-x-0 bottom-0 z-[60] border-t border-gray-200 bg-white/95 backdrop-blur px-4 py-3 shadow-[0_-4px_20px_-8px_rgba(0,0,0,0.15)] print:hidden"
    >
      <div
        className={`container mx-auto flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between ${isRtl ? 'sm:flex-row-reverse text-right' : ''}`}
      >
        <p className="text-sm text-gray-700 leading-relaxed max-w-2xl">
          {t.text}{' '}
          <Link
            href={getLocalizedPath('/privacy-policy', locale)}
            className="font-semibold text-primary-700 underline hover:text-primary-800"
          >
            {t.privacy}
          </Link>
        </p>
        <div className={`flex items-center gap-2 flex-shrink-0 ${isRtl ? 'flex-row-reverse' : ''}`}>
          <button
            type="button"
            onClick={() => choose('declined')}
            className="rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40"
          >
            {t.decline}
          </button>
          <button
            type="button"
            onClick={() => choose('accepted')}
            className="rounded-full bg-gray-900 px-5 py-2 text-sm font-semibold text-white hover:bg-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
          >
            {t.accept}
          </button>
        </div>
      </div>
    </div>
  )
}
