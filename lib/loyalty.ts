/**
 * GENOSYS Rewards — loyalty points engine.
 *
 * Program rules (decided 2026-07-08):
 * - Retail accounts earn 1 point per 1 AED paid (order total), credited on DELIVERED.
 * - Tier multipliers boost earning: MEMBER 1x, SILVER 1.25x, GOLD 1.5x, PLATINUM 2x.
 * - Birthday month: earning doubled on top of the tier multiplier.
 * - 100 points = 5 AED redemption value (redemption ships in Phase 2).
 * - Accounts with a contractual discount >= 20% (CLINIC/VIP partners) are on the
 *   "Professional Partner" track: they keep their pricing but are outside points/tiers.
 * - Every point movement is recorded in the loyalty_transactions ledger;
 *   user.loyaltyPoints is the materialized balance.
 */
import { prisma } from '@/lib/prisma'
import { computeTier, type MemberTier } from '@/lib/membership'
import { debugLog, errorLog } from '@/lib/logger'

export const PARTNER_DISCOUNT_THRESHOLD = 20
export const POINTS_PER_AED = 1
export const POINT_VALUE_AED = 0.05 // 100 points = 5 AED
export const WELCOME_BONUS_POINTS = 100

export const TIER_MULTIPLIERS: Record<MemberTier, number> = {
  MEMBER: 1,
  SILVER: 1.25,
  GOLD: 1.5,
  PLATINUM: 2,
}

export type LoyaltyTrack = 'REWARDS' | 'PARTNER'

export function isPartnerAccount(user: { discountPercentage?: number | null }): boolean {
  return (user.discountPercentage ?? 0) >= PARTNER_DISCOUNT_THRESHOLD
}

export function loyaltyTrackForUser(user: { discountPercentage?: number | null }): LoyaltyTrack {
  return isPartnerAccount(user) ? 'PARTNER' : 'REWARDS'
}

export function isBirthdayMonth(birthday: string | null | undefined, now = new Date()): boolean {
  if (!birthday) return false
  // Stored as YYYY-MM-DD (free-text legacy possible — parse defensively)
  const match = String(birthday).match(/^\d{4}-(\d{2})-\d{2}/)
  if (!match?.[1]) return false
  return parseInt(match[1], 10) === now.getMonth() + 1
}

export function computeOrderPoints(
  orderTotal: number,
  tier: MemberTier,
  birthdayMonth: boolean,
): number {
  if (!Number.isFinite(orderTotal) || orderTotal <= 0) return 0
  const base = orderTotal * POINTS_PER_AED * (TIER_MULTIPLIERS[tier] ?? 1)
  return Math.floor(birthdayMonth ? base * 2 : base)
}

/** Sum of a user's ledger — the authoritative points balance. */
export async function getLedgerBalance(userId: string): Promise<number> {
  const agg = await prisma.loyaltyTransaction.aggregate({
    where: { userId },
    _sum: { points: true },
  })
  return agg._sum.points ?? 0
}

export interface AwardResult {
  awarded: boolean
  points: number
  balance: number
  tier: MemberTier
  previousTier: MemberTier
  tierUpgraded: boolean
  track: LoyaltyTrack
}

/**
 * Award points for a delivered order. Idempotent: the (orderId, type) unique
 * constraint on the ledger guarantees a single ORDER_EARN per order.
 * Also refreshes the user's lifetime stats and tier from delivered orders.
 */
export async function awardPointsForDeliveredOrder(orderId: string): Promise<AwardResult | null> {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: { id: true, orderNumber: true, total: true, customerEmail: true, status: true },
  })
  if (!order) return null

  const user = await prisma.user.findUnique({
    where: { email: order.customerEmail },
    select: {
      id: true,
      email: true,
      birthday: true,
      discountPercentage: true,
      memberTier: true,
      loyaltyPoints: true,
    },
  })
  if (!user) return null

  // Refresh lifetime stats + tier from delivered orders (applies to all tracks)
  const agg = await prisma.order.aggregate({
    where: { customerEmail: order.customerEmail, status: 'DELIVERED' },
    _sum: { total: true },
    _count: true,
  })
  const totalSpent = agg._sum.total ?? 0
  const totalOrders = agg._count ?? 0
  const previousTier = (user.memberTier || 'MEMBER') as MemberTier
  const tier = computeTier(totalSpent, totalOrders)

  const track = loyaltyTrackForUser(user)

  if (track === 'PARTNER') {
    // Partners keep contractual pricing; no points, but keep stats fresh.
    await prisma.user.update({
      where: { id: user.id },
      data: { totalSpent, totalOrders, memberTier: tier },
    })
    return {
      awarded: false,
      points: 0,
      balance: user.loyaltyPoints,
      tier,
      previousTier,
      tierUpgraded: false,
      track,
    }
  }

  // Earn at the tier held BEFORE this order (standard loyalty semantics)
  const points = computeOrderPoints(order.total, previousTier, isBirthdayMonth(user.birthday))

  let awarded = false
  if (points > 0) {
    try {
      await prisma.loyaltyTransaction.create({
        data: {
          userId: user.id,
          points,
          type: 'ORDER_EARN',
          orderId: order.id,
          description: `Order ${order.orderNumber} delivered — AED ${order.total.toFixed(2)}`,
        },
      })
      awarded = true
    } catch (err: unknown) {
      // Unique violation = already awarded for this order; anything else bubbles up
      const code = (err as { code?: string })?.code
      if (code !== 'P2002') {
        errorLog('[loyalty] ledger insert failed:', err)
        throw err
      }
      debugLog(`[loyalty] points already awarded for order ${order.orderNumber}, skipping`)
    }
  }

  const balance = await getLedgerBalance(user.id)

  await prisma.user.update({
    where: { id: user.id },
    data: { totalSpent, totalOrders, memberTier: tier, loyaltyPoints: balance },
  })

  const tierOrder: MemberTier[] = ['MEMBER', 'SILVER', 'GOLD', 'PLATINUM']
  const tierUpgraded = tierOrder.indexOf(tier) > tierOrder.indexOf(previousTier)

  return { awarded, points: awarded ? points : 0, balance, tier, previousTier, tierUpgraded, track }
}
