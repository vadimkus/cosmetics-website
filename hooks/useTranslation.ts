'use client'

import { usePathname } from 'next/navigation'
import { useMemo } from 'react'
import { getLocaleFromPath, type Locale } from '@/lib/i18n'
import enMessages from '@/messages/en.json'
import { warnLog } from '@/lib/logger'
import { useMessagesContext } from '@/components/i18n/MessagesProvider'
import type { UseTranslationReturn, Messages } from '@/types/translations'

/**
 * Client-side translation hook.
 *
 * Before the C1 refactor, this file statically imported all three locale
 * JSON bundles (en.json + ar.json + ru.json ≈ 488 KB) so the hook could
 * pick one at runtime. That shipped every language to every visitor.
 *
 * Now: the active locale's messages arrive via `MessagesProvider`, which
 * the root server layout populates from `lib/messagesServer.ts`. The
 * bundled `enMessages` import below is retained only as a safety net for:
 *   - SSR before Context is in scope
 *   - Test harnesses that forget to wrap with MessagesProvider
 *   - Edge cases where pathname is unknown
 *
 * When the hook falls back to EN outside of a provider it emits a dev
 * warning so the missing provider shows up in console.
 */
export function useTranslation(): UseTranslationReturn {
  const pathname = usePathname()
  const contextValue = useMessagesContext()

  // usePathname() can be null during SSR for non-dynamic routes.
  const effectivePath = pathname ?? (typeof window !== 'undefined' ? window.location.pathname : '/')
  const detectedLocale = getLocaleFromPath(effectivePath)

  const locale: Locale = contextValue?.locale ?? detectedLocale
  const messages: Messages = contextValue?.messages ?? (enMessages as unknown as Messages)

  if (!contextValue && process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
    // Surface missing MessagesProvider in dev only; prod silently falls back to EN.
    warnLog('useTranslation: no MessagesProvider in ancestor tree — using bundled EN fallback.')
  }

  const t: UseTranslationReturn['t'] = useMemo(() => {
    return (key: string, params?: Record<string, string | number>): string => {
      const keys = key.split('.')
      let value: unknown = messages

      for (const k of keys) {
        if (value && typeof value === 'object' && k in value) {
          value = (value as Record<string, unknown>)[k]
        } else {
          value = undefined
          break
        }
      }

      if (typeof value !== 'string') {
        warnLog(`Translation key not found: ${key}`)
        return key
      }

      if (params) {
        return Object.entries(params).reduce(
          (str, [paramKey, paramValue]) =>
            str.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(paramValue)),
          value
        )
      }

      return value
    }
  }, [messages])

  return {
    t,
    locale,
    dir: locale === 'ar' ? 'rtl' : 'ltr',
    messages,
  }
}
