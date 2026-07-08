/**
 * GENOSYS Rewards — one-shot backfill + launch announcement.
 *
 * Usage (run locally, in repo root):
 *   npx tsx scripts/loyalty-backfill-and-launch.ts --backfill          # backfill points/tiers/member numbers (idempotent)
 *   npx tsx scripts/loyalty-backfill-and-launch.ts --test you@x.com    # send sample retail + partner emails to one address
 *   npx tsx scripts/loyalty-backfill-and-launch.ts --send              # mass-send launch emails (retail + partners)
 *   npx tsx scripts/loyalty-backfill-and-launch.ts --send --dry-run    # count recipients without sending
 *
 * Backfill policy (decided 2026-07-08):
 * - Historical points: 1 pt per AED of DELIVERED order total (no retroactive multipliers) → BACKFILL ledger entry
 * - Welcome bonus: +100 points for every retail-track user → WELCOME_BONUS ledger entry
 * - Partners (discount >= 20%): no points, loyaltyPoints reset to 0, stats/tier still refreshed
 * - Member numbers assigned to anyone missing one; memberSince = createdAt when null
 *
 * Send safety: progress log at scripts/.loyalty-launch-sent.json makes re-runs skip
 * already-notified users. Apple relay emails without a contact email are skipped.
 */
import { config } from 'dotenv'
config({ path: '.env.local' })
config({ path: '.env' })

import fs from 'fs'
import path from 'path'

const SENT_LOG = path.join(process.cwd(), 'scripts', '.loyalty-launch-sent.json')
const SEND_DELAY_MS = 300

function loadSentLog(): Set<string> {
  try {
    return new Set(JSON.parse(fs.readFileSync(SENT_LOG, 'utf8')))
  } catch {
    return new Set()
  }
}

function saveSentLog(sent: Set<string>) {
  fs.writeFileSync(SENT_LOG, JSON.stringify([...sent], null, 2))
}

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms))

async function main() {
  const { prisma } = await import('../lib/prisma')
  const { computeTier } = await import('../lib/membership')
  const { isPartnerAccount, WELCOME_BONUS_POINTS } = await import('../lib/loyalty')
  const { sendLoyaltyLaunchEmail, sendLoyaltyPartnerLaunchEmail } = await import('../lib/email/loyalty')
  const { getPreferredEmail, isApplePrivateRelayEmail } = await import('../lib/emailHelpers')

  const args = process.argv.slice(2)
  const doBackfill = args.includes('--backfill')
  const doSend = args.includes('--send')
  const dryRun = args.includes('--dry-run')
  const testIdx = args.indexOf('--test')
  const testEmail = testIdx >= 0 ? args[testIdx + 1] : null

  // ─── TEST SEND ───────────────────────────────────────────────────────
  if (testEmail) {
    console.log(`Sending sample emails to ${testEmail}...`)
    const r1 = await sendLoyaltyLaunchEmail({
      customerName: 'Vadim Sagatdinov',
      customerEmail: testEmail,
      memberNumber: 'GNS-00001-AE',
      tier: 'GOLD',
      points: 5347,
      welcomeBonus: WELCOME_BONUS_POINTS,
    })
    console.log('  retail launch email:', r1.success ? 'sent' : `FAILED: ${r1.error}`)
    await sleep(1500)
    const r2 = await sendLoyaltyPartnerLaunchEmail({
      customerName: 'Vadim Sagatdinov',
      customerEmail: testEmail,
      discountPercentage: 50,
    })
    console.log('  partner launch email:', r2.success ? 'sent' : `FAILED: ${r2.error}`)
    await prisma.$disconnect()
    return
  }

  // ─── BACKFILL ────────────────────────────────────────────────────────
  if (doBackfill) {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        memberNumber: true,
        memberSince: true,
        discountPercentage: true,
      },
      orderBy: { createdAt: 'asc' },
    })
    console.log(`Backfilling ${users.length} users...`)

    // Member number sequence: continue from the current max
    let seq = 1
    const maxUser = await prisma.user.findFirst({
      where: { memberNumber: { not: null } },
      orderBy: { memberNumber: 'desc' },
      select: { memberNumber: true },
    })
    const m = maxUser?.memberNumber?.match(/GNS-(\d+)-/)
    if (m?.[1]) seq = parseInt(m[1], 10) + 1

    let numbersAssigned = 0
    let retailBackfilled = 0
    let partnersSkipped = 0
    let pointsIssued = 0

    for (const user of users) {
      // 1. Member number + memberSince
      const patch: Record<string, unknown> = {}
      if (!user.memberNumber) {
        patch.memberNumber = `GNS-${String(seq++).padStart(5, '0')}-AE`
        numbersAssigned++
      }
      if (!user.memberSince) patch.memberSince = user.createdAt

      // 2. Lifetime stats from delivered orders
      const agg = await prisma.order.aggregate({
        where: { customerEmail: user.email, status: 'DELIVERED' },
        _sum: { total: true },
        _count: true,
      })
      const totalSpent = agg._sum.total ?? 0
      const totalOrders = agg._count ?? 0
      const tier = computeTier(totalSpent, totalOrders)
      patch.totalSpent = totalSpent
      patch.totalOrders = totalOrders
      patch.memberTier = tier

      if (isPartnerAccount(user)) {
        // Partners: outside the points program
        patch.loyaltyPoints = 0
        partnersSkipped++
        await prisma.user.update({ where: { id: user.id }, data: patch })
        continue
      }

      // 3. Ledger backfill (idempotent per user)
      const existing = await prisma.loyaltyTransaction.findMany({
        where: { userId: user.id, type: { in: ['BACKFILL', 'WELCOME_BONUS'] } },
        select: { type: true },
      })
      const hasBackfill = existing.some(e => e.type === 'BACKFILL')
      const hasWelcome = existing.some(e => e.type === 'WELCOME_BONUS')

      const historicalPoints = Math.floor(totalSpent)
      if (!hasBackfill && historicalPoints > 0) {
        await prisma.loyaltyTransaction.create({
          data: {
            userId: user.id,
            points: historicalPoints,
            type: 'BACKFILL',
            description: `Order history credit — ${totalOrders} delivered orders, AED ${totalSpent.toFixed(2)}`,
          },
        })
        pointsIssued += historicalPoints
      }
      if (!hasWelcome) {
        await prisma.loyaltyTransaction.create({
          data: {
            userId: user.id,
            points: WELCOME_BONUS_POINTS,
            type: 'WELCOME_BONUS',
            description: 'GENOSYS Rewards launch welcome bonus',
          },
        })
        pointsIssued += WELCOME_BONUS_POINTS
      }

      const balanceAgg = await prisma.loyaltyTransaction.aggregate({
        where: { userId: user.id },
        _sum: { points: true },
      })
      patch.loyaltyPoints = balanceAgg._sum.points ?? 0

      await prisma.user.update({ where: { id: user.id }, data: patch })
      retailBackfilled++
      if (retailBackfilled % 100 === 0) console.log(`  ...${retailBackfilled} retail users done`)
    }

    console.log('Backfill complete:')
    console.log(`  member numbers assigned: ${numbersAssigned}`)
    console.log(`  retail users backfilled: ${retailBackfilled}`)
    console.log(`  partner accounts (no points): ${partnersSkipped}`)
    console.log(`  total points issued: ${pointsIssued.toLocaleString()}`)
  }

  // ─── MASS SEND ───────────────────────────────────────────────────────
  if (doSend) {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        contactEmail: true,
        name: true,
        memberNumber: true,
        memberTier: true,
        loyaltyPoints: true,
        discountType: true,
        discountPercentage: true,
      },
      orderBy: { createdAt: 'asc' },
    })

    const sent = loadSentLog()
    let retailCount = 0
    let partnerCount = 0
    let skipped = 0
    let failed = 0

    const queue = users.filter(u => !sent.has(u.email))
    console.log(`${users.length} users total, ${sent.size} already sent, ${queue.length} to process${dryRun ? ' (dry run)' : ''}`)

    for (const user of queue) {
      const emailTo = getPreferredEmail(user)
      if (isApplePrivateRelayEmail(emailTo)) {
        skipped++
        sent.add(user.email)
        continue
      }

      const partner = isPartnerAccount(user)
      if (dryRun) {
        partner ? partnerCount++ : retailCount++
        continue
      }

      try {
        const result = partner
          ? await sendLoyaltyPartnerLaunchEmail({
              customerName: user.name,
              customerEmail: emailTo,
              discountPercentage: user.discountPercentage ?? 0,
            })
          : await sendLoyaltyLaunchEmail({
              customerName: user.name,
              customerEmail: emailTo,
              memberNumber: user.memberNumber,
              tier: (user.memberTier || 'MEMBER') as 'MEMBER' | 'SILVER' | 'GOLD' | 'PLATINUM',
              points: user.loyaltyPoints,
              welcomeBonus: WELCOME_BONUS_POINTS,
            })

        if (result.success) {
          partner ? partnerCount++ : retailCount++
          sent.add(user.email)
        } else {
          failed++
          console.error(`  FAILED ${emailTo}: ${result.error}`)
        }
      } catch (e) {
        failed++
        console.error(`  EXCEPTION ${emailTo}:`, e instanceof Error ? e.message : e)
      }

      if ((retailCount + partnerCount) % 25 === 0) saveSentLog(sent)
      await sleep(SEND_DELAY_MS)
    }

    if (!dryRun) saveSentLog(sent)
    console.log('Send complete:')
    console.log(`  retail emails: ${retailCount}`)
    console.log(`  partner emails: ${partnerCount}`)
    console.log(`  skipped (Apple relay/no email): ${skipped}`)
    console.log(`  failed: ${failed}`)
  }

  if (!doBackfill && !doSend && !testEmail) {
    console.log('Nothing to do. Use --backfill, --test <email>, or --send [--dry-run]')
  }

  await prisma.$disconnect()
}

main().catch(e => {
  console.error('Fatal:', e)
  process.exit(1)
})
