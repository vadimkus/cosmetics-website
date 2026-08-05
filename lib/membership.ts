import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/database'

export const TIER_THRESHOLDS = {
  PLATINUM: { spent: 15000, orders: 25 },
  GOLD:     { spent: 5000,  orders: 10 },
  SILVER:   { spent: 1000,  orders: 3 },
  MEMBER:   { spent: 0,     orders: 0 },
} as const

export type MemberTier = keyof typeof TIER_THRESHOLDS

export function computeTier(totalSpent: number, totalOrders: number): MemberTier {
  if (totalSpent >= TIER_THRESHOLDS.PLATINUM.spent || totalOrders >= TIER_THRESHOLDS.PLATINUM.orders) return 'PLATINUM'
  if (totalSpent >= TIER_THRESHOLDS.GOLD.spent     || totalOrders >= TIER_THRESHOLDS.GOLD.orders)     return 'GOLD'
  if (totalSpent >= TIER_THRESHOLDS.SILVER.spent    || totalOrders >= TIER_THRESHOLDS.SILVER.orders)   return 'SILVER'
  return 'MEMBER'
}

export function nextTierInfo(tier: MemberTier, totalSpent: number) {
  const order: MemberTier[] = ['MEMBER', 'SILVER', 'GOLD', 'PLATINUM']
  const idx = order.indexOf(tier)
  if (idx >= order.length - 1) {
    return { nextTier: null, nextTierAt: 0, progressPercent: 100 }
  }
  const next = order[idx + 1] as MemberTier
  const threshold = TIER_THRESHOLDS[next].spent
  const currentThreshold = TIER_THRESHOLDS[tier].spent
  const range = threshold - currentThreshold
  const progress = Math.min(totalSpent - currentThreshold, range)
  return {
    nextTier: next,
    nextTierAt: threshold,
    progressPercent: range > 0 ? Math.round((progress / range) * 100) : 0,
  }
}

type MembershipDb = Pick<Prisma.TransactionClient, 'user'>

export async function generateMemberNumber(db: MembershipDb = prisma): Promise<string> {
  const lastUser = await db.user.findFirst({
    where: { memberNumber: { not: null } },
    orderBy: { memberNumber: 'desc' },
    select: { memberNumber: true },
  })

  let seq = 1
  if (lastUser?.memberNumber) {
    const match = lastUser.memberNumber.match(/GNS-(\d+)-/)
    if (match?.[1]) seq = parseInt(match[1], 10) + 1
  }

  return `GNS-${String(seq).padStart(5, '0')}-AE`
}

export async function recalcUserStats(userId: string) {
  const agg = await prisma.order.aggregate({
    where: {
      customer: { id: userId },
      status: 'DELIVERED',
    },
    _sum: { total: true },
    _count: true,
  })

  const totalSpent = agg._sum.total ?? 0
  const totalOrders = agg._count ?? 0
  const tier = computeTier(totalSpent, totalOrders)
  // The ledger is authoritative. Lifetime spend cannot reconstruct the balance
  // because redemptions, review/welcome bonuses, reversals and adjustments all
  // move points independently of delivered-order spend.
  const balanceAgg = await prisma.loyaltyTransaction.aggregate({
    where: { userId },
    _sum: { points: true },
  })
  const loyaltyPoints = balanceAgg._sum.points ?? 0

  await prisma.user.update({
    where: { id: userId },
    data: { totalSpent, totalOrders, memberTier: tier, loyaltyPoints },
  })

  return { totalSpent, totalOrders, tier, loyaltyPoints }
}
