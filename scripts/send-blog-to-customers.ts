/**
 * Sends a blog announcement to people who have actually ordered, rather than
 * only to the newsletter list.
 *
 * The site has ~970 registered accounts but a much smaller newsletter list.
 * Most account holders signed up to shop, not to receive marketing, so this
 * deliberately targets the subset with a real purchase history.
 *
 * Every recipient gets a `newsletter_subscribers` row first. That is not
 * bookkeeping: the campaign template needs an unsubscribe token, so without a
 * row there is no working opt-out link. Anyone already on the list is skipped —
 * they were sent the announcement by `announce-blog-post.ts` already and must
 * not receive it twice.
 *
 *   npx tsx --env-file=.env.local scripts/send-blog-to-customers.ts <slug> --dry-run
 *   npx tsx --env-file=.env.local scripts/send-blog-to-customers.ts <slug>
 *   npx tsx --env-file=.env.local scripts/send-blog-to-customers.ts <slug> --only you@example.com
 */
import { prisma } from '../lib/prisma'
import { buildAnnouncementHtml, postCopy, LOCALES, type Locale } from '../lib/blogAnnounceCopy'
import { sendNewsletterCampaignEmail } from '../lib/email'
import { buildUnsubscribeUrl, generateUnsubscribeToken, isValidEmail, normalizeEmail } from '../lib/newsletter'
import { SITE_URL } from '../lib/siteConfig'

// Matches the newsletter campaign runner: comfortably inside Gmail SMTP bursts.
const SEND_DELAY_MS = 150
// The transactional mailbox is the same Google account. Leave room in the daily
// quota for order confirmations, invoices and password resets.
const MAX_RECIPIENTS = 600

const isLocale = (v: string | null | undefined): v is Locale => LOCALES.includes(v as Locale)

async function main() {
  const args = process.argv.slice(2)
  const slug = args.find(a => !a.startsWith('--') && !a.includes('@'))
  if (!slug) {
    console.error('Usage: send-blog-to-customers.ts <slug> [--dry-run] [--only email]')
    process.exit(1)
  }
  const dryRun = args.includes('--dry-run')
  const onlyIdx = args.indexOf('--only')
  const onlyEmail = onlyIdx === -1 ? undefined : normalizeEmail(args[onlyIdx + 1] || '')

  const post = await prisma.blogPost.findUnique({
    where: { slug },
    select: {
      slug: true,
      title: true,
      titleRu: true,
      titleAr: true,
      excerpt: true,
      excerptRu: true,
      excerptAr: true,
      featuredImage: true,
      published: true,
    },
  })
  if (!post || !post.published) {
    console.error(`No published post with slug "${slug}".`)
    process.exit(1)
  }

  // Every address that has ordered, with the locale of its most recent order.
  // Ascending so later rows overwrite earlier ones.
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'asc' },
    select: { customerEmail: true, locale: true },
  })
  const localeByEmail = new Map<string, Locale>()
  for (const o of orders) {
    const email = normalizeEmail(o.customerEmail)
    if (isValidEmail(email)) localeByEmail.set(email, isLocale(o.locale) ? o.locale : 'en')
  }

  // Skip anyone already on the list, in either state: active subscribers were
  // sent this post already, and anyone who opted out stays out.
  const existing = await prisma.newsletterSubscriber.findMany({ select: { email: true } })
  for (const s of existing) localeByEmail.delete(normalizeEmail(s.email))

  let targets = [...localeByEmail.entries()].map(([email, locale]) => ({ email, locale }))
  if (onlyEmail) targets = targets.filter(t => t.email === onlyEmail)

  const byLocale = targets.reduce<Record<string, number>>((acc, t) => {
    acc[t.locale] = (acc[t.locale] || 0) + 1
    return acc
  }, {})

  console.log(`\n${post.title}`)
  console.log(`  customers to email : ${targets.length}`)
  console.log(`  by locale          : ${Object.entries(byLocale).map(([l, n]) => `${l}=${n}`).join(' ') || 'none'}`)
  console.log(`  already on list    : ${existing.length} (skipped)\n`)

  if (targets.length === 0) {
    console.log('Nobody to send to.')
    return
  }
  if (targets.length > MAX_RECIPIENTS) {
    console.error(`${targets.length} recipients exceeds the ${MAX_RECIPIENTS} cap for one run. Narrow the list or raise the cap deliberately.`)
    process.exit(1)
  }
  if (dryRun) {
    console.log('Dry run — nothing sent, no subscriber rows created.')
    console.log(targets.slice(0, 5).map(t => `  ${t.email} (${t.locale})`).join('\n'))
    if (targets.length > 5) console.log(`  … and ${targets.length - 5} more`)
    return
  }

  for (const locale of LOCALES) {
    const group = targets.filter(t => t.locale === locale)
    if (group.length === 0) continue

    const copy = postCopy(post, locale)
    const bodyHtml = buildAnnouncementHtml(copy, post.featuredImage, locale)

    const campaign = await prisma.newsletterCampaign.create({
      data: {
        subject: copy.title,
        bodyMarkdown: `[auto] blog announcement to customers — ${post.slug} (${locale})`,
        bodyHtml,
        localeFilter: locale,
        sourceFilter: 'import',
        totalRecipients: group.length,
        status: 'sending',
        sentByEmail: 'script',
        startedAt: new Date(),
      },
    })

    let sent = 0
    let failed = 0
    const errors: Array<{ email: string; error: string }> = []

    for (const target of group) {
      try {
        // Create the row before sending: the email is not sendable without the
        // unsubscribe token it carries.
        const subscriber = await prisma.newsletterSubscriber.upsert({
          where: { email: target.email },
          update: {},
          create: {
            email: target.email,
            locale,
            source: 'import',
            unsubscribeToken: generateUnsubscribeToken(),
          },
          select: { id: true, unsubscribeToken: true },
        })

        const result = await sendNewsletterCampaignEmail({
          to: target.email,
          subject: copy.title,
          bodyHtml,
          unsubscribeUrl: buildUnsubscribeUrl(SITE_URL, subscriber.unsubscribeToken, locale),
          locale,
        })

        if (result.success) {
          sent++
          await prisma.newsletterSubscriber
            .update({ where: { id: subscriber.id }, data: { lastSentAt: new Date() } })
            .catch(() => {})
        } else {
          failed++
          if (errors.length < 50) errors.push({ email: target.email, error: result.error || 'Unknown error' })
        }
      } catch (e) {
        failed++
        if (errors.length < 50) errors.push({ email: target.email, error: e instanceof Error ? e.message : 'Unknown error' })
      }

      if ((sent + failed) % 25 === 0) {
        console.log(`  [${locale}] ${sent + failed}/${group.length} — ${sent} sent, ${failed} failed`)
        await prisma.newsletterCampaign
          .update({ where: { id: campaign.id }, data: { sentCount: sent, failedCount: failed } })
          .catch(() => {})
      }

      await new Promise(r => setTimeout(r, SEND_DELAY_MS))
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

    console.log(`  ${locale}: ${sent} sent, ${failed} failed`)
    if (errors.length) console.log(errors.slice(0, 5).map(e => `      ${e.email}: ${e.error}`).join('\n'))
  }
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
