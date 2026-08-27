'use client'

import { createContext, useContext, type ReactNode } from 'react'
import type { Locale } from '@/lib/i18n'
import type { Messages } from '@/types/translations'

/**
 * Locale-aware messages delivered from the server layout via React Context.
 *
 * This provider is the client side of the C1 refactor (see
 * docs/SESSION_CHANGES_2026-04-17_MOBILE_UNIFICATION.md). The server loads
 * exactly one locale's messages from `lib/messagesServer.ts` (server-only)
 * and passes them through this provider. Client hooks read from context
 * instead of re-importing every locale JSON bundle.
 *
 * Net effect: the client payload ships ~1/3 of the previous translation
 * data (~124-196 KB instead of ~488 KB).
 */
interface MessagesContextValue {
  messages: Messages
  locale: Locale
}

const MessagesContext = createContext<MessagesContextValue | null>(null)

interface MessagesProviderProps {
  messages: Messages
  locale: Locale
  children: ReactNode
}

export function MessagesProvider({ messages, locale, children }: MessagesProviderProps) {
  return (
    <MessagesContext.Provider value={{ messages, locale }}>
      {children}
    </MessagesContext.Provider>
  )
}

/**
 * Returns the current messages context, or `null` when the component
 * rendering the hook is mounted outside a provider. Callers should treat
 * `null` as a signal to use their own fallback (e.g. `useTranslation`
 * falls back to the bundled EN messages).
 */
export function useMessagesContext(): MessagesContextValue | null {
  return useContext(MessagesContext)
}
