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

/**
 * The membership fields every new account gets, whichever door it came in by.
 *
 * For a long time only the three mobile routes set these. Website sign-ups,
 * by email, Google or Apple, were created without a number and nothing ever
 * assigned one later, so a customer who joined on the site and then installed
 * the app saw a membership card with a blank where the number goes. Creation
 * sites should spread this rather than list the fields themselves, so the
 * next route cannot leave them out.
 */
export async function newMemberFields(db: MembershipDb = prisma, now: Date = new Date()) {
  return {
    memberNumber: await generateMemberNumber(db),
    memberSince: now,
    memberTier: 'MEMBER' as MemberTier,
  }
}

/**
 * True when a unique-constraint failure is on memberNumber rather than email.
 *
 * generateMemberNumber reads the highest number and adds one, so two accounts
 * created in the same instant can pick the same value; the unique index then
 * rejects the second. That is a retry, not a duplicate account. Routes that
 * map every P2002 to "email already exists" would otherwise tell the second
 * person their address is taken when it is not.
 */
export function isMemberNumberCollision(error: unknown): boolean {
  if (typeof error !== 'object' || !error) return false
  const e = error as { code?: unknown; meta?: { target?: unknown } }
  if (e.code !== 'P2002') return false
  const target = e.meta?.target
  const fields = Array.isArray(target) ? target.map(String) : typeof target === 'string' ? [target] : []
  return fields.some((f) => f.includes('memberNumber'))
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
