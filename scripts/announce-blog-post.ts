/**
 * Announces a published blog post to mobile app push, PWA web push and the
 * newsletter list, each in the recipient's own language.
 *
 * Posts created through the admin panel announce themselves. Posts created by a
 * `scripts/create-*-blog.ts` script do not, because those scripts only write the
 * row — run this afterwards.
 *
 * Safe to re-run: the post carries an `announcedAt` stamp and a second run exits
 * without sending. `--force` overrides that and will notify everyone again.
 *
 *   npx tsx --env-file=.env.local scripts/announce-blog-post.ts <slug>
 *   npx tsx --env-file=.env.local scripts/announce-blog-post.ts <slug> --dry-run
 *   npx tsx --env-file=.env.local scripts/announce-blog-post.ts <slug> --mobile --web
 *   npx tsx --env-file=.env.local scripts/announce-blog-post.ts <slug> --force
 */
import { prisma } from '../lib/prisma'
import { announceBlogPost, postCopy, type Locale } from '../lib/blogAnnounce'

const LOCALES: Locale[] = ['en', 'ru', 'ar']

async function main() {
  const args = process.argv.slice(2)
  const slug = args.find(a => !a.startsWith('--'))
  if (!slug) {
    console.error('Usage: announce-blog-post.ts <slug> [--dry-run] [--force] [--mobile] [--web] [--newsletter]')
    process.exit(1)
  }

  const dryRun = args.includes('--dry-run')
  const force = args.includes('--force')

  // Test a payload against one device without pushing the whole list again.
  const onlyIdx = args.indexOf('--only')
  const onlyEmail = onlyIdx === -1 ? undefined : args[onlyIdx + 1]
  if (onlyIdx !== -1 && !onlyEmail) {
    console.error('--only needs an email address')
    process.exit(1)
  }

  // Naming any channel flag opts into exactly those; naming none sends to all.
  const picked = {
    mobile: args.includes('--mobile'),
    web: args.includes('--web'),
    newsletter: args.includes('--newsletter'),
  }
  // `--only` targets a single mobile device, so it implies the mobile channel.
  if (onlyEmail) picked.mobile = true
  const channels = Object.values(picked).some(Boolean) ? picked : undefined

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
    console.error(`No post with slug "${slug}".`)
    process.exit(1)
  }

  const [mobile, web, subs] = await Promise.all([
    prisma.user.count({ where: { expoPushToken: { not: null } } }),
    prisma.pushSubscription.count(),
    prisma.newsletterSubscriber.groupBy({ by: ['locale'], where: { isActive: true }, _count: true }),
  ])

  console.log(`\n${post.title}`)
  console.log(`  published    : ${post.published}`)
  console.log(`  announcedAt  : ${post.announcedAt?.toISOString() ?? 'never'}`)
  console.log(`  audience     : ${onlyEmail ? `${onlyEmail} only` : `${mobile} mobile · ${web} web push · ${subs.map(s => `${s.locale}=${s._count}`).join(' ')} email`}`)
  console.log(`  channels     : ${channels ? Object.entries(channels).filter(([, v]) => v).map(([k]) => k).join(', ') : 'all'}\n`)

  for (const locale of LOCALES) {
    const copy = postCopy(post, locale)
    console.log(`  [${locale}] ${copy.title}`)
    console.log(`        ${copy.url}`)
  }

  if (dryRun) {
    console.log('\nDry run — nothing sent.')
    return
  }
  if (post.announcedAt && !force) {
    console.log('\nAlready announced. Pass --force to send again.')
    return
  }

  console.log('\nSending…')
  const result = await announceBlogPost({
    slug,
    sentBy: 'script',
    force,
    ...(channels ? { channels } : {}),
    ...(onlyEmail ? { onlyEmail } : {}),
  })

  if (result.skipped) {
    console.log(`Skipped: ${result.skipped}`)
    return
  }

  console.log(`  mobile push  : ${result.mobile.sent} sent, ${result.mobile.failed} failed, ${result.mobile.cleaned} dead tokens cleared`)
  console.log(`  web push     : ${result.web.sent} sent, ${result.web.failed} failed, ${result.web.cleaned} dead subscriptions removed`)
  for (const c of result.newsletter) {
    console.log(`  email (${c.locale})  : ${c.sent} sent, ${c.failed} failed`)
  }
  if (result.newsletter.length === 0) console.log('  email        : no active subscribers')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
