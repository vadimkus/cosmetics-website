/**
 * Localized copy for blog announcements: the title, excerpt and URL a given
 * language gets, plus the email body built around them.
 *
 * Kept apart from `blogAnnounce.ts` so it stays free of Prisma and the mail and
 * push clients, and can be tested without a database.
 */

import { SITE_URL } from './siteConfig'

export type Locale = 'en' | 'ru' | 'ar'
export const LOCALES: readonly Locale[] = ['en', 'ru', 'ar'] as const

/** "New article" lead-in for the push title, per language. */
export const PUSH_LEAD: Record<Locale, string> = {
  en: 'New article',
  ru: 'Новая статья',
  ar: 'مقال جديد',
}

/** Button label on the newsletter email. */
export const READ_CTA: Record<Locale, string> = {
  en: 'Read the article',
  ru: 'Читать статью',
  ar: 'اقرأ المقال',
}

export interface PostCopy {
  title: string
  excerpt: string
  url: string
}

export interface PostRow {
  title: string
  titleRu: string | null
  titleAr: string | null
  excerpt: string | null
  excerptRu: string | null
  excerptAr: string | null
  slug: string
}

/**
 * Localized title, excerpt and URL. Falls back to English rather than skipping a
 * language: a Russian reader is better served an English headline than silence.
 */
export function postCopy(post: PostRow, locale: Locale): PostCopy {
  const title = (locale === 'ru' ? post.titleRu : locale === 'ar' ? post.titleAr : null) || post.title
  const excerpt = (locale === 'ru' ? post.excerptRu : locale === 'ar' ? post.excerptAr : null) || post.excerpt || ''
  const prefix = locale === 'en' ? '' : `/${locale}`
  return { title, excerpt, url: `${prefix}/blog/${post.slug}` }
}

/** Push bodies are a single line on a lock screen; trim rather than let the OS clip mid-word. */
export function trimForPush(text: string, max = 140): string {
  const clean = text.replace(/\s+/g, ' ').trim()
  if (clean.length <= max) return clean
  const cut = clean.slice(0, max)
  const lastSpace = cut.lastIndexOf(' ')
  return `${(lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).replace(/[,;:.\s]+$/, '')}…`
}

const ESCAPE_MAP: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
}
function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, ch => ESCAPE_MAP[ch] || ch)
}

/**
 * Email body for the announcement. Built directly rather than through
 * `renderNewsletterMarkdown`, which deliberately drops images — and the featured
 * image is most of why a blog announcement gets opened.
 */
export function buildAnnouncementHtml(copy: PostCopy, featuredImage: string | null, locale: Locale): string {
  const dir = locale === 'ar' ? 'rtl' : 'ltr'
  const align = locale === 'ar' ? 'right' : 'left'
  const href = `${SITE_URL}${copy.url}`
  const font = "-apple-system,BlinkMacSystemFont,'SF Pro Text','Segoe UI',Roboto,sans-serif"

  const image = featuredImage
    ? `<a href="${escapeHtml(href)}"><img src="${escapeHtml(`${SITE_URL}${featuredImage}`)}" alt="${escapeHtml(copy.title)}" width="560" style="width:100%; max-width:560px; height:auto; border-radius:14px; display:block; margin:0 0 20px;" /></a>`
    : ''

  const excerpt = copy.excerpt
    ? `<p dir="${dir}" style="font-family:${font}; font-size:15px; color:#1d1d1f; line-height:1.6; margin:12px 0 24px; text-align:${align};">${escapeHtml(copy.excerpt)}</p>`
    : ''

  return `${image}
<h1 dir="${dir}" style="font-family:${font}; font-size:26px; font-weight:600; color:#1d1d1f; letter-spacing:-0.02em; line-height:1.25; margin:0 0 12px; text-align:${align};">${escapeHtml(copy.title)}</h1>
${excerpt}
<p dir="${dir}" style="margin:0; text-align:${align};"><a href="${escapeHtml(href)}" style="display:inline-block; background:#1d1d1f; color:#ffffff; font-family:${font}; font-size:15px; font-weight:600; text-decoration:none; padding:13px 28px; border-radius:999px;">${escapeHtml(READ_CTA[locale])}</a></p>`
}
