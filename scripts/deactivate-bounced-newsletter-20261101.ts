/**
 * Deactivate newsletter addresses that hard-bounced on the 1 Nov 2026 blog
 * announcement (collagen-drink-myth-what-reaches-your-face). Sets isActive=false
 * and unsubscribedAt; the rows stay for history.
 *
 *   npx tsx --env-file=.env --env-file=.env.local scripts/deactivate-bounced-newsletter-20261101.ts [--apply]
 */
import { prisma } from '../lib/prisma'

const BOUNCED = [
  'hayley@mosskind.com', // 550 5.1.1 no such user
  'vadim-newsletter-test-1776922781@example.com', // test address, example.com has null MX
  'ru-vadim-newsletter-test-1776922781@example.com', // test address, example.com has null MX
]

async function main() {
  const apply = process.argv.includes('--apply')
  const rows = await prisma.newsletterSubscriber.findMany({
    where: { email: { in: BOUNCED, mode: 'insensitive' } },
    select: { id: true, email: true, locale: true, source: true, isActive: true, subscribedAt: true },
  })
  console.log(rows)
  if (!apply) {
    console.log('Dry run. Re-run with --apply.')
    return
  }
  const res = await prisma.newsletterSubscriber.updateMany({
    where: { id: { in: rows.filter((r) => r.isActive).map((r) => r.id) } },
    data: { isActive: false, unsubscribedAt: new Date() },
  })
  console.log('Deactivated:', res.count)
}

main()
  .catch((e) => {
    console.error(e)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
