/**
 * Announces a published blog post to everyone who has opted in: mobile app push,
 * PWA web push, and the newsletter list. Each recipient is written to in their
 * own language.
 *
 * The post is claimed atomically through `blog_posts.announcedAt` before a single
 * message goes out, so editing a live post — or two deploys racing on the same
 * `after()` hook — cannot notify the same person twice.
 *
 * Neither `User` nor `PushSubscription` stores a language, so locale is inferred:
 * the locale on the person's most recent order first, then their newsletter
 * preference, then English. Newsletter subscribers carry their own locale and
 * need no guessing.
 */

import { prisma } from './prisma'
import { debugLog, errorLog } from './logger'
import { SITE_URL } from './siteConfig'
import { buildUnsubscribeUrl } from './newsletter'
import { sendNewsletterCampaignEmail } from './email'
import { sendExpoPushToTokens } from './expoPush'
import {
  NEXT_PUBLIC_VAPID_PUBLIC_KEY as ENV_VAPID_PUBLIC,
  VAPID_PRIVATE_KEY as ENV_VAPID_PRIVATE,
  VAPID_EMAIL as ENV_VAPID_EMAIL,
} from './envValidation'
import webpush from 'web-push'
import {
  LOCALES,
  PUSH_LEAD,
  buildAnnouncementHtml,
  postCopy,
  trimForPush,
  type Locale,
  type PostRow as PostCopyRow,
} from './blogAnnounceCopy'

export { postCopy, buildAnnouncementHtml, type Locale } from './blogAnnounceCopy'

// Matches the newsletter campaign runner: comfortably inside Gmail SMTP burst limits.
const EMAIL_DELAY_MS = 150

export interface AnnounceChannels {
  mobile: boolean
  web: boolean
  newsletter: boolean
}

export interface AnnounceResult {
  slug: string
  skipped?: 'not-found' | 'not-published' | 'already-announced'
  mobile: { sent: number; failed: number; cleaned: number }
  web: { sent: number; failed: number; cleaned: number; notificationId: string | null }
  newsletter: Array<{ locale: Locale; campaignId: string; sent: number; failed: number }>
}

const ALL_CHANNELS: AnnounceChannels = { mobile: true, web: true, newsletter: true }

function emptyResult(slug: string): AnnounceResult {
  return {
    slug,
    mobile: { sent: 0, failed: 0, cleaned: 0 },
    web: { sent: 0, failed: 0, cleaned: 0, notificationId: null },
    newsletter: [],
  }
}

/** What the fan-out needs from a post: the copy fields plus the email hero. */
type PostRow = PostCopyRow & { id: string; featuredImage: string | null }

/**
 * Best-guess language per user id. Most recent order wins, then the newsletter
 * row that shares their email address.
 */
async function resolveUserLocales(userIds: string[]): Promise<Map<string, Locale>> {
  const out = new Map<string, Locale>()
  if (userIds.length === 0) return out

  const isLocale = (v: string | null | undefined): v is Locale => LOCALES.includes(v as Locale)

  const users = await prisma.user.findMany({
    where: { id: { in: userIds } },
    select: { id: true, email: true },
  })
  // Orders join to users by email, not by a foreign key, so the lookup goes
  // through the address rather than the id.
  const idByEmail = new Map(users.map(u => [u.email.toLowerCase(), u.id]))
  const emails = [...idByEmail.keys()]
  if (emails.length === 0) return out

  // Newsletter preference first, then let orders overwrite it: an order locale
  // is what the person actually browsed the shop in.
  const subs = await prisma.newsletterSubscriber.findMany({
    where: { email: { in: emails } },
    select: { email: true, locale: true },
  })
  for (const s of subs) {
    const id = idByEmail.get(s.email.toLowerCase())
    if (id && isLocale(s.locale)) out.set(id, s.locale)
  }

  // Ascending, so later (more recent) orders overwrite earlier ones.
  const orders = await prisma.order.findMany({
    where: { customerEmail: { in: emails } },
    orderBy: { createdAt: 'asc' },
    select: { customerEmail: true, locale: true },
  })
  for (const o of orders) {
    const id = idByEmail.get(o.customerEmail.toLowerCase())
    if (id && isLocale(o.locale)) out.set(id, o.locale)
  }

  return out
}

/** Expo push to every mobile app user who registered a token. */
async function announceToMobile(post: PostRow, result: AnnounceResult, onlyEmail?: string): Promise<void> {
  const users = await prisma.user.findMany({
    where: {
      expoPushToken: { not: null },
      ...(onlyEmail ? { email: { equals: onlyEmail, mode: 'insensitive' as const } } : {}),
    },
    select: { id: true, expoPushToken: true },
  })
  if (users.length === 0) return

  const locales = await resolveUserLocales(users.map(u => u.id))

  const messages = users.map(u => {
    const locale = locales.get(u.id) ?? 'en'
    const copy = postCopy(post, locale)
    return {
      token: u.expoPushToken!,
      title: `${PUSH_LEAD[locale]}: ${copy.title}`,
      body: trimForPush(copy.excerpt || copy.title),
      data: { type: 'blog_post', slug: post.slug, url: copy.url, locale },
      channelId: 'default',
    }
  })

  const sendResult = await sendExpoPushToTokens(messages)
  result.mobile.sent = sendResult.sent
  result.mobile.failed = sendResult.failed

  if (sendResult.invalidTokens.length > 0) {
    const cleaned = await prisma.user.updateMany({
      where: { expoPushToken: { in: sendResult.invalidTokens } },
      data: { expoPushToken: null },
    })
    result.mobile.cleaned = cleaned.count
  }
}

/** VAPID web push to every PWA subscription, logged as a PWANotification. */
async function announceToWeb(post: PostRow, sentBy: string, result: AnnounceResult): Promise<void> {
  const publicKey = ENV_VAPID_PUBLIC || ''
  const privateKey = ENV_VAPID_PRIVATE || ''
  if (!publicKey || !privateKey) {
    errorLog('[BLOG_ANNOUNCE] VAPID keys missing, skipping web push')
    return
  }
  webpush.setVapidDetails(ENV_VAPID_EMAIL || 'mailto:support@genosys.ae', publicKey, privateKey)

  const subscriptions = await prisma.pushSubscription.findMany()
  if (subscriptions.length === 0) return

  const en = postCopy(post, 'en')
  const ru = postCopy(post, 'ru')
  const ar = postCopy(post, 'ar')

  const notification = await prisma.pWANotification.create({
    data: {
      title: `${PUSH_LEAD.en}: ${en.title}`,
      titleRu: `${PUSH_LEAD.ru}: ${ru.title}`,
      titleAr: `${PUSH_LEAD.ar}: ${ar.title}`,
      body: trimForPush(en.excerpt || en.title),
      bodyRu: trimForPush(ru.excerpt || ru.title),
      bodyAr: trimForPush(ar.excerpt || ar.title),
      url: en.url,
      sentBy,
      totalSent: 0,
    },
  })
  result.web.notificationId = notification.id

  const locales = await resolveUserLocales([...new Set(subscriptions.map(s => s.userId))])
  const dead: string[] = []

  await Promise.allSettled(
    subscriptions.map(async sub => {
      const locale = locales.get(sub.userId) ?? 'en'
      const copy = postCopy(post, locale)
      const payload = {
        title: `${PUSH_LEAD[locale]}: ${copy.title}`,
        body: trimForPush(copy.excerpt || copy.title),
        url: copy.url,
        icon: '/favicon/genosys-logo.png',
        badge: '/favicon/genosys-logo.png',
        ...(post.featuredImage ? { image: post.featuredImage } : {}),
        notificationId: notification.id,
        type: 'general' as const,
        data: { notificationId: notification.id, type: 'blog_post', slug: post.slug, url: copy.url },
      }
      try {
        await webpush.sendNotification(
          { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
          JSON.stringify(payload)
        )
        result.web.sent++
      } catch (error) {
        result.web.failed++
        const status = (error as { statusCode?: number }).statusCode
        if (status === 410 || status === 404) dead.push(sub.endpoint)
      }
    })
  )

  if (dead.length > 0) {
    const cleaned = await prisma.pushSubscription.deleteMany({ where: { endpoint: { in: dead } } })
    result.web.cleaned = cleaned.count
  }

  await prisma.pWANotification.update({
    where: { id: notification.id },
    data: { totalSent: result.web.sent },
  })
}

/**
 * One newsletter campaign per language that actually has subscribers, so each
 * campaign row carries the subject the recipients were sent and the history
 * panel stays readable.
 */
async function announceToNewsletter(post: PostRow, sentBy: string, result: AnnounceResult): Promise<void> {
  for (const locale of LOCALES) {
    const subscribers = await prisma.newsletterSubscriber.findMany({
      where: { isActive: true, locale },
      select: { id: true, email: true, unsubscribeToken: true },
    })
    if (subscribers.length === 0) continue

    const copy = postCopy(post, locale)
    const bodyHtml = buildAnnouncementHtml(copy, post.featuredImage, locale)

    const campaign = await prisma.newsletterCampaign.create({
      data: {
        subject: copy.title,
        // The composer stores its markdown source here; this send is generated,
        // so record what it was generated from instead.
        bodyMarkdown: `[auto] blog announcement — ${post.slug} (${locale})`,
        bodyHtml,
        localeFilter: locale,
        totalRecipients: subscribers.length,
        status: 'sending',
        sentByEmail: sentBy,
        startedAt: new Date(),
      },
    })

    let sent = 0
    let failed = 0
    const errors: Array<{ email: string; error: string }> = []

    for (const sub of subscribers) {
      try {
        const sendResult = await sendNewsletterCampaignEmail({
          to: sub.email,
          subject: copy.title,
          bodyHtml,
          unsubscribeUrl: buildUnsubscribeUrl(SITE_URL, sub.unsubscribeToken, locale),
          locale,
        })
        if (sendResult.success) {
          sent++
          prisma.newsletterSubscriber
            .update({ where: { id: sub.id }, data: { lastSentAt: new Date() } })
            .catch(e => errorLog('[BLOG_ANNOUNCE] lastSentAt update failed:', e))
        } else {
          failed++
          if (errors.length < 50) errors.push({ email: sub.email, error: sendResult.error || 'Unknown error' })
        }
      } catch (e) {
        failed++
        if (errors.length < 50) errors.push({ email: sub.email, error: e instanceof Error ? e.message : 'Unknown error' })
      }
      await new Promise(r => setTimeout(r, EMAIL_DELAY_MS))
    }

    await prisma.newsletterCampaign.update({
      where: { id: campaign.id },
      data: {
        status: sent === 0 && failed > 0 ? 'failed' : 'sent',
        sentCount: sent,
        failedCount: failed,
        completedAt: new Date(),
        errors: errors.length ? JSON.stringify(errors) : null,
      },
    })

    result.newsletter.push({ locale, campaignId: campaign.id, sent, failed })
  }
}

/**
 * Fan out an announcement for one published post.
 *
 * Returns with `skipped` set rather than throwing when there is nothing to do,
 * so callers wired into a publish path stay quiet on re-saves.
 */
export async function announceBlogPost(opts: {
  slug: string
  sentBy?: string
  /** Re-announce a post that already carries an `announcedAt` stamp. */
  force?: boolean
  channels?: Partial<AnnounceChannels>
  /**
   * Restrict the mobile push to one account, for testing a payload without
   * pushing the whole list a second time. Ignored by the other channels.
   */
  onlyEmail?: string
}): Promise<AnnounceResult> {
  const { slug, sentBy = 'system', force = false, onlyEmail } = opts
  const channels = { ...ALL_CHANNELS, ...opts.channels }
  const result = emptyResult(slug)

  const post = await prisma.blogPost.findUnique({
    where: { slug },
    select: {
      id: true,
      slug: true,
      title: true,
      titleRu: true,
      titleAr: true,
      excerpt: true,
      excerptRu: true,
      excerptAr: true,
      featuredImage: true,
      published: true,
      announcedAt: true,
    },
  })

  if (!post) {
    result.skipped = 'not-found'
    return result
  }
  if (!post.published) {
    result.skipped = 'not-published'
    return result
  }

  // Claim the post before sending anything. `updateMany` with the null guard is
  // a single conditional UPDATE, so two concurrent callers cannot both win.
  if (!force) {
    const claim = await prisma.blogPost.updateMany({
      where: { id: post.id, announcedAt: null },
      data: { announcedAt: new Date() },
    })
    if (claim.count === 0) {
      result.skipped = 'already-announced'
      return result
    }
  } else {
    await prisma.blogPost.update({ where: { id: post.id }, data: { announcedAt: new Date() } })
  }

  debugLog('[BLOG_ANNOUNCE] announcing', { slug, channels })

  // Each channel is independent: a dead SMTP box must not cost us the push send.
  if (channels.mobile) {
    await announceToMobile(post, result, onlyEmail).catch(e => errorLog('[BLOG_ANNOUNCE] mobile failed:', e))
  }
  if (channels.web) {
    await announceToWeb(post, sentBy, result).catch(e => errorLog('[BLOG_ANNOUNCE] web push failed:', e))
  }
  if (channels.newsletter) {
    await announceToNewsletter(post, sentBy, result).catch(e => errorLog('[BLOG_ANNOUNCE] newsletter failed:', e))
  }

  debugLog('[BLOG_ANNOUNCE] done', result)
  return result
}
