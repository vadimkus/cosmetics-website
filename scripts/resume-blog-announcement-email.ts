/**
 * Finish a blog announcement email that stopped part-way, without writing to
 * anyone twice.
 *
 * Recipients are active newsletter subscribers whose `lastSentAt` is empty or
 * earlier than `--since` (the start of the interrupted run). Everyone who got
 * the first run has a later stamp and is skipped. Sends through one pooled SMTP
 * session and stops after three consecutive failures.
 *
 * Dry run:
 *   npx tsx --env-file=.env.local scripts/resume-blog-announcement-email.ts <slug> --since 2026-09-26T12:01:58Z
 * Send:
 *   npx tsx --env-file=.env.local scripts/resume-blog-announcement-email.ts <slug> --since 2026-09-26T12:01:58Z --apply
 */
import { prisma } from '../lib/prisma'
import { SITE_URL } from '../lib/siteConfig'
import { buildUnsubscribeUrl } from '../lib/newsletter'
import { createBulkMailer, sendNewsletterCampaignEmail } from '../lib/email'
import { LOCALES, buildAnnouncementHtml, postCopy } from '../lib/blogAnnounceCopy'

const EMAIL_DELAY_MS = 150
const MAX_CONSECUTIVE_FAILURES = 3

async function main() {
  const [slug] = process.argv.slice(2).filter(a => !a.startsWith('--'))
  const sinceArg = process.argv[process.argv.indexOf('--since') + 1]
  const apply = process.argv.includes('--apply')
  if (!slug || !process.argv.includes('--since') || !sinceArg) {
    throw new Error('Usage: resume-blog-announcement-email.ts <slug> --since <ISO time> [--apply]')
  }
  const since = new Date(sinceArg)
  if (Number.isNaN(since.getTime())) throw new Error(`Invalid --since: ${sinceArg}`)

  const post = await prisma.blogPost.findUnique({
    where: { slug },
    select: {
      slug: true, title: true, titleRu: true, titleAr: true,
      excerpt: true, excerptRu: true, excerptAr: true,
      featuredImage: true, published: true, announcedAt: true,
    },
  })
  if (!post) throw new Error(`Post not found: ${slug}`)
  if (!post.published) throw new Error(`Post is not published: ${slug}`)

  const plan = []
  for (const locale of LOCALES) {
    const subscribers = await prisma.newsletterSubscriber.findMany({
      where: { isActive: true, locale, OR: [{ lastSentAt: null }, { lastSentAt: { lt: since } }] },
      select: { id: true, email: true, unsubscribeToken: true },
      orderBy: { id: 'asc' },
    })
    const alreadySent = await prisma.newsletterSubscriber.count({
      where: { isActive: true, locale, lastSentAt: { gte: since } },
    })
    plan.push({ locale, subscribers, alreadySent })
    console.log(`[${locale}] to send: ${subscribers.length} · already received since ${since.toISOString()}: ${alreadySent} · subject: ${postCopy(post, locale).title}`)
  }

  if (!apply) {
    console.log('Dry run — pass --apply to send.')
    return
  }

  const mailer = createBulkMailer()
  let consecutiveFailures = 0
  try {
    for (const { locale, subscribers } of plan) {
      if (subscribers.length === 0) continue
      if (consecutiveFailures >= MAX_CONSECUTIVE_FAILURES) break

      const copy = postCopy(post, locale)
      const bodyHtml = buildAnnouncementHtml(copy, post.featuredImage, locale)
      const campaign = await prisma.newsletterCampaign.create({
        data: {
          subject: copy.title,
          bodyMarkdown: `[auto] blog announcement resume - ${post.slug} (${locale}), recipients not sent since ${since.toISOString()}`,
          bodyHtml,
          localeFilter: locale,
          totalRecipients: subscribers.length,
          status: 'sending',
          sentByEmail: 'script',
          startedAt: new Date(),
        },
      })

      let sent = 0
      let failed = 0
      const errors: Array<{ email: string; error: string }> = []
      for (const sub of subscribers) {
        if (consecutiveFailures >= MAX_CONSECUTIVE_FAILURES) {
          errors.push({ email: '*', error: `Stopped after ${MAX_CONSECUTIVE_FAILURES} consecutive failures; ${subscribers.length - sent - failed} not attempted` })
          break
        }
        const result = await sendNewsletterCampaignEmail({
          to: sub.email,
          subject: copy.title,
          bodyHtml,
          unsubscribeUrl: buildUnsubscribeUrl(SITE_URL, sub.unsubscribeToken, locale),
          locale,
          mailer,
        })
        if (result.success) {
          sent++
          consecutiveFailures = 0
          await prisma.newsletterSubscriber.update({ where: { id: sub.id }, data: { lastSentAt: new Date() } })
        } else {
          failed++
          consecutiveFailures++
          if (errors.length < 50) errors.push({ email: sub.email, error: result.error || 'Unknown error' })
          console.log(`[${locale}] failed ${sub.email}: ${result.error}`)
        }
        if ((sent + failed) % 25 === 0) console.log(`[${locale}] ${sent + failed}/${subscribers.length} (sent ${sent}, failed ${failed})`)
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
      console.log(`[${locale}] campaign ${campaign.id}: sent ${sent}, failed ${failed}`)
    }
  } finally {
    mailer.close()
  }
}

main()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
