import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { verifySessionToken } from '@/lib/jwt'
import { errorLog } from '@/lib/logger'
import { computeTier, nextTierInfo, type MemberTier } from '@/lib/membership'
import {
  loyaltyTrackForUser,
  getLedgerBalance,
  TIER_MULTIPLIERS,
  POINT_VALUE_AED,
  REDEEM_BLOCK_POINTS,
  REDEEM_BLOCK_AED,
  REDEEM_MAX_ORDER_FRACTION,
  canRedeemPoints,
} from '@/lib/loyalty'

/**
 * GET /api/user/membership — GENOSYS Rewards status for the website profile.
 * Session-cookie auth (same pattern as /api/user/profile).
 */
export async function GET() {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('genosys_session')
    if (!sessionCookie?.value) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 })
    }
    const session = verifySessionToken(sessionCookie.value)
    if (!session?.email) {
      return NextResponse.json({ success: false, error: 'Invalid session' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.email },
      select: {
        id: true,
        name: true,
        email: true,
        memberNumber: true,
        memberTier: true,
        memberSince: true,
        createdAt: true,
        totalSpent: true,
        totalOrders: true,
        loyaltyPoints: true,
        discountType: true,
        discountPercentage: true,
      },
    })
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 })
    }

    const track = loyaltyTrackForUser(user)
    const redemptionRules = {
      blockPoints: REDEEM_BLOCK_POINTS,
      blockAed: REDEEM_BLOCK_AED,
      maxOrderFraction: REDEEM_MAX_ORDER_FRACTION,
    }

    if (track === 'PARTNER') {
      return NextResponse.json({
        success: true,
        track,
        memberNumber: user.memberNumber,
        memberSince: user.memberSince || user.createdAt,
        partner: {
          discountType: user.discountType,
          discountPercentage: user.discountPercentage,
        },
        redemption: {
          ...redemptionRules,
          eligible: false,
          reason: 'PARTNER_PRICING',
        },
      })
    }

    // Refresh stats from delivered orders (cheap aggregate, keeps profile accurate)
    const agg = await prisma.order.aggregate({
      where: { customerEmail: user.email, status: 'DELIVERED' },
      _sum: { total: true },
      _count: true,
    })
    const totalSpent = agg._sum.total ?? 0
    const totalOrders = agg._count ?? 0
    const tier = computeTier(totalSpent, totalOrders)
    const balance = await getLedgerBalance(user.id)
    const redemptionEligible = canRedeemPoints(user)

    if (
      tier !== user.memberTier ||
      Math.abs(totalSpent - user.totalSpent) > 0.01 ||
      totalOrders !== user.totalOrders ||
      balance !== user.loyaltyPoints
    ) {
      await prisma.user.update({
        where: { id: user.id },
        data: { memberTier: tier, totalSpent, totalOrders, loyaltyPoints: balance },
      })
    }

    const progress = nextTierInfo(tier as MemberTier, totalSpent)

    return NextResponse.json({
      success: true,
      track,
      memberNumber: user.memberNumber,
      memberSince: user.memberSince || user.createdAt,
      tier,
      multiplier: TIER_MULTIPLIERS[tier],
      points: {
        balance,
        valueAed: Math.round(balance * POINT_VALUE_AED * 100) / 100,
      },
      redemption: {
        ...redemptionRules,
        eligible: redemptionEligible,
        reason: redemptionEligible ? null : 'ACCOUNT_DISCOUNT',
      },
      tierProgress: {
        currentSpent: Math.round(totalSpent * 100) / 100,
        nextTier: progress.nextTier,
        nextTierAt: progress.nextTierAt,
        progressPercent: progress.progressPercent,
      },
      stats: {
        totalOrders,
        totalSpent: Math.round(totalSpent * 100) / 100,
      },
    })
  } catch (error) {
    errorLog('[USER_MEMBERSHIP] Error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
