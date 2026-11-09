/**
 * Apple Private Relay accounts with orders but no contactEmail, whose real
 * address is on record elsewhere (9 Nov 2026):
 * - Oxana Seregina: typed oksana.seregina@gmail.com at checkout (Stripe
 *   pi_3UKd0nCtEeBBw5M61AWpHXL6 metadata notificationEmail, 28 Sep 2026, the day
 *   relay contact saving shipped).
 * - Irina Marantidi: second account irina.marantidi@gmail.com with the same
 *   phone and name.
 * Only fills an empty contactEmail; never overwrites one.
 *
 *   npx tsx --env-file=.env --env-file=.env.local scripts/backfill-relay-contact-emails-20261109.ts [--apply]
 */
import { prisma } from '../lib/prisma'

const BACKFILL: { relay: string; contactEmail: string; expectName: string }[] = [
  { relay: 'y88v9495fm@privaterelay.appleid.com', contactEmail: 'oksana.seregina@gmail.com', expectName: 'Oxana Seregina' },
  { relay: 'fqf9zsft2r@privaterelay.appleid.com', contactEmail: 'irina.marantidi@gmail.com', expectName: 'Irina Marantidi' },
]

async function main() {
  const apply = process.argv.includes('--apply')
  for (const b of BACKFILL) {
    const user = await prisma.user.findUnique({ where: { email: b.relay }, select: { id: true, name: true, phone: true, contactEmail: true } })
    const other = await prisma.user.findUnique({ where: { email: b.contactEmail }, select: { name: true, phone: true } })
    console.log(b.relay, '|', user?.name, user?.phone, '| contactEmail:', user?.contactEmail, '| other account:', other ?? 'none')
    if (!user) { console.log('  skip: no relay user'); continue }
    if (user.contactEmail) { console.log('  skip: already has contactEmail'); continue }
    if (user.name !== b.expectName) { console.log('  skip: name mismatch'); continue }
    if (apply) {
      await prisma.user.update({ where: { id: user.id }, data: { contactEmail: b.contactEmail } })
      console.log('  saved', b.contactEmail)
    }
  }
  if (!apply) console.log('Dry run. Re-run with --apply.')
}

main()
  .catch((e) => { console.error(e); process.exitCode = 1 })
  .finally(() => prisma.$disconnect())
