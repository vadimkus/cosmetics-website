/**
 * Give a member number to every account that never got one.
 *
 * Until 2 Sep 2026 only the mobile routes assigned member numbers at sign-up.
 * Website registrations, by email, Google or Apple, were created without one,
 * so the app's membership card showed those customers a blank line. The routes
 * now assign on creation; this fills in the accounts created before that.
 *
 * Numbers are handed out in account-creation order, continuing from the
 * highest existing one, so nothing already issued moves. memberSince is set to
 * the account's createdAt, which is when they actually joined. memberTier is
 * left alone; recalcUserStats already keeps it right.
 *
 *   npx tsx --env-file=.env.local scripts/backfill-member-numbers-20260902.ts
 *   npx tsx --env-file=.env.local scripts/backfill-member-numbers-20260902.ts --apply
 */
import { prisma } from '@/lib/prisma'
import { generateMemberNumber } from '@/lib/membership'

const apply = process.argv.includes('--apply')

async function main() {
  const missing = await prisma.user.findMany({
    where: { memberNumber: null },
    orderBy: { createdAt: 'asc' },
    select: { id: true, email: true, createdAt: true, lastLoginSource: true, memberSince: true },
  })
  console.log(`${missing.length} accounts without a member number`)
  if (missing.length === 0) return

  const first = await generateMemberNumber()
  console.log(`next free number: ${first}\n`)

  // Work out the run up front so the dry run shows exactly what --apply does.
  let seq = parseInt(first.match(/GNS-(\d+)-/)![1]!, 10)
  const plan = missing.map((u) => ({
    ...u,
    memberNumber: `GNS-${String(seq++).padStart(5, '0')}-AE`,
  }))

  for (const p of plan) {
    console.log(
      `${p.memberNumber}  ${p.createdAt.toISOString().slice(0, 10)}  ${String(p.lastLoginSource).padEnd(12)} ${p.email}`
    )
  }

  if (!apply) {
    console.log('\ndry run. Re-run with --apply')
    return
  }

  let done = 0
  for (const p of plan) {
    await prisma.user.update({
      where: { id: p.id },
      data: { memberNumber: p.memberNumber, memberSince: p.memberSince ?? p.createdAt },
    })
    done++
  }
  const left = await prisma.user.count({ where: { memberNumber: null } })
  console.log(`\nassigned ${done}. accounts still without a number: ${left}`)
}

main()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
