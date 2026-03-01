/**
 * One-time backfill: assign memberNumber, memberSince, and stats to all existing users.
 *
 * Usage:
 *   set -a; source .env.local; set +a; npx tsx scripts/backfill-membership.ts
 */
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

const dbUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL
if (!dbUrl) throw new Error('Set DATABASE_URL or POSTGRES_URL')

const pool = new pg.Pool({ connectionString: dbUrl })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

const TIER_THRESHOLDS = {
  PLATINUM: { spent: 15000, orders: 25 },
  GOLD:     { spent: 5000,  orders: 10 },
  SILVER:   { spent: 1000,  orders: 3 },
  MEMBER:   { spent: 0,     orders: 0 },
} as const

function computeTier(spent: number, orders: number): string {
  if (spent >= TIER_THRESHOLDS.PLATINUM.spent || orders >= TIER_THRESHOLDS.PLATINUM.orders) return 'PLATINUM'
  if (spent >= TIER_THRESHOLDS.GOLD.spent     || orders >= TIER_THRESHOLDS.GOLD.orders)     return 'GOLD'
  if (spent >= TIER_THRESHOLDS.SILVER.spent    || orders >= TIER_THRESHOLDS.SILVER.orders)   return 'SILVER'
  return 'MEMBER'
}

async function main() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'asc' },
    select: { id: true, email: true, createdAt: true, memberNumber: true },
  })

  console.log(`Found ${users.length} users to backfill`)
  let seq = 1

  for (const user of users) {
    if (user.memberNumber) {
      const match = user.memberNumber.match(/GNS-(\d+)-/)
      if (match) {
        const n = parseInt(match[1], 10)
        if (n >= seq) seq = n + 1
      }
      console.log(`  SKIP ${user.email} — already ${user.memberNumber}`)
      continue
    }

    const memberNumber = `GNS-${String(seq).padStart(5, '0')}-AE`
    seq++

    const agg = await prisma.order.aggregate({
      where: {
        customerEmail: user.email,
        status: { notIn: ['CANCELLED', 'REFUNDED'] },
      },
      _sum: { total: true },
      _count: true,
    })

    const totalSpent = agg._sum.total ?? 0
    const totalOrders = agg._count ?? 0
    const tier = computeTier(totalSpent, totalOrders)
    const loyaltyPoints = Math.floor(totalSpent)

    await prisma.user.update({
      where: { id: user.id },
      data: {
        memberNumber,
        memberSince: user.createdAt,
        memberTier: tier,
        totalSpent,
        totalOrders,
        loyaltyPoints,
      },
    })

    console.log(`  ${memberNumber} ${user.email} — tier=${tier} spent=${totalSpent} orders=${totalOrders}`)
  }

  console.log('Backfill complete.')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
