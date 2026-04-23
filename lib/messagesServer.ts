import 'server-only'

import enMessages from '@/messages/en.json'
import arMessages from '@/messages/ar.json'
import ruMessages from '@/messages/ru.json'
import type { Messages } from '@/types/translations'
import type { Locale } from '@/lib/i18n'

/**
 * Server-only synchronous message loader.
 *
 * Marked with `'server-only'` so any accidental import from a client
 * component fails at build time. This protects the client bundle from
 * receiving all three locale JSON files (~488 KB combined).
 *
 * The loaded messages are passed through `MessagesProvider` to the client
 * as part of the RSC payload, so only the active locale's strings ship.
 */
export function loadMessages(locale: Locale): Messages {
  if (locale === 'ar') return arMessages as unknown as Messages
  if (locale === 'ru') return ruMessages as unknown as Messages
  return enMessages as unknown as Messages
}
