/**
 * Newsletter helpers — token generation, email normalization, and source/locale validation.
 * Kept framework-agnostic so it can be imported from both API routes and server actions.
 */
import crypto from 'crypto'

export type NewsletterLocale = 'en' | 'ar' | 'ru'
export type NewsletterSource = 'homepage' | 'footer' | 'checkout' | 'admin' | 'import'

const ALLOWED_LOCALES: readonly NewsletterLocale[] = ['en', 'ar', 'ru'] as const
const ALLOWED_SOURCES: readonly NewsletterSource[] = ['homepage', 'footer', 'checkout', 'admin', 'import'] as const

// RFC-pragmatic email check — rejects obvious junk, accepts everything Gmail/Outlook will.
// Don't use regex to enforce strict RFC 5322; SMTP will tell us the truth if we try to deliver.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export function normalizeEmail(raw: string): string {
  return String(raw || '').trim().toLowerCase()
}

export function isValidEmail(email: string): boolean {
  if (!email || email.length > 254) return false
  return EMAIL_RE.test(email)
}

export function normalizeLocale(raw: unknown): NewsletterLocale {
  const v = String(raw || '').toLowerCase()
  return (ALLOWED_LOCALES as readonly string[]).includes(v) ? (v as NewsletterLocale) : 'en'
}

export function normalizeSource(raw: unknown): NewsletterSource {
  const v = String(raw || '').toLowerCase()
  return (ALLOWED_SOURCES as readonly string[]).includes(v) ? (v as NewsletterSource) : 'homepage'
}

/**
 * Cryptographically strong, URL-safe token (~32 chars).
 * Used in unsubscribe links: /newsletter/unsubscribe?token=...
 */
export function generateUnsubscribeToken(): string {
  return crypto.randomBytes(24).toString('base64url')
}

/**
 * Build an absolute unsubscribe URL.
 * Accepts siteUrl to avoid importing siteConfig at the top of this file (keeps it env-safe).
 */
export function buildUnsubscribeUrl(siteUrl: string, token: string, locale: NewsletterLocale = 'en'): string {
  const base = siteUrl.replace(/\/+$/, '')
  const path = locale === 'en' ? '/newsletter/unsubscribe' : `/${locale}/newsletter/unsubscribe`
  return `${base}${path}?token=${encodeURIComponent(token)}`
}
