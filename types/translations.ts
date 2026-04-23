/**
 * Type definitions for translation messages
 * Provides type safety for translation keys and parameters
 */

import type enMessages from '@/messages/en.json'

// Type for all message files (they should have the same structure)
// Note: ar.json and ru.json are expected to have the same structure as en.json
export type Messages = typeof enMessages

// Type for locale
export type Locale = 'en' | 'ru' | 'ar'

// Type for translation function
export type TranslationFunction = (
  key: string,
  params?: Record<string, string | number>
) => string

// Type for useTranslation hook return value
export interface UseTranslationReturn {
  t: TranslationFunction
  locale: Locale
  dir: 'ltr' | 'rtl'
  /**
   * Raw message bundle for the current locale. Exposed so utility helpers
   * (e.g. `translateCategory`) can do their own lookups without
   * re-importing the JSON bundles.
   */
  messages: Messages
}

// Helper type to extract nested keys from an object type
type NestedKeys<T> = T extends object
  ? {
      [K in keyof T]: K extends string
        ? T[K] extends object
          ? `${K}.${NestedKeys<T[K]>}`
          : K
        : never
    }[keyof T]
  : never

// Type for valid translation keys (for better autocomplete)
export type TranslationKey = NestedKeys<Messages>

// Type-safe translation function (for future use with stricter typing)
export interface TypedTranslationFunction {
  (key: TranslationKey, params?: Record<string, string | number>): string
}

