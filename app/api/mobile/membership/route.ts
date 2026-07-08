import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/database'
import { validateMobileAuth, extractTokenFromHeader } from '@/lib/jwt'
import { debugLog, errorLog } from '@/lib/logger'
import { computeTier, nextTierInfo, type MemberTier } from '@/lib/membership'
import { loyaltyTrackForUser, getLedgerBalance, TIER_MULTIPLIERS, POINT_VALUE_AED } from '@/lib/loyalty'

export async function GET(request: NextRequest) {
  const startTime = Date.now()

  try {
    const apiKey = request.headers.get('x-api-key')
    const authHeader = request.headers.get('Authorization')
    const token = extractTokenFromHeader(authHeader)
    const auth = validateMobileAuth(apiKey, token)

    if (!auth.valid || !auth.payload) {
      return NextResponse.json(
        { success: false, error: auth.error || 'Authentication required' },
        { status: auth.status || 401 },
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: auth.payload.userId },
      select: {
        id: true,
        name: true,
        email: true,
        memberNumber: true,
        memberTier: true,
        memberSince: true,
        totalSpent: true,
        totalOrders: true,
        loyaltyPoints: true,
        createdAt: true,
        discountType: true,
        discountPercentage: true,
      },
    })

    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 })
    }

    const track = loyaltyTrackForUser(user)

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
        user: {
          name: user.name,
          email: user.email,
        },
      })
    }

    const orderAgg = await prisma.order.aggregate({
      where: {
        customerEmail: user.email,
        status: 'DELIVERED',
      },
      _sum: { total: true },
      _count: true,
    })

    const totalSpent = orderAgg._sum.total ?? 0
    const totalOrders = orderAgg._count ?? 0
    const tier = computeTier(totalSpent, totalOrders)
    const loyaltyPoints = await getLedgerBalance(user.id)

    if (
      tier !== user.memberTier ||
      Math.abs(totalSpent - user.totalSpent) > 0.01 ||
      totalOrders !== user.totalOrders ||
      loyaltyPoints !== user.loyaltyPoints
    ) {
      await prisma.user.update({
        where: { id: user.id },
        data: { memberTier: tier, totalSpent, totalOrders, loyaltyPoints },
      })
    }

    const tierProgress = nextTierInfo(tier as MemberTier, totalSpent)

    const duration = Date.now() - startTime
    debugLog(`[MEMBERSHIP] Fetched for ${user.email} in ${duration}ms`)

    return NextResponse.json({
      success: true,
      track,
      memberNumber: user.memberNumber,
      memberSince: user.memberSince || user.createdAt,
      tier,
      multiplier: TIER_MULTIPLIERS[tier],
      points: {
        balance: loyaltyPoints,
        valueAed: Math.round(loyaltyPoints * POINT_VALUE_AED * 100) / 100,
      },
      tierProgress: {
        currentSpent: Math.round(totalSpent * 100) / 100,
        nextTierAt: tierProgress.nextTierAt,
        nextTier: tierProgress.nextTier,
        progressPercent: tierProgress.progressPercent,
      },
      stats: {
        totalOrders,
        totalSpent: Math.round(totalSpent * 100) / 100,
        loyaltyPoints,
      },
      user: {
        name: user.name,
        email: user.email,
      },
    })
  } catch (error) {
    const duration = Date.now() - startTime
    errorLog('[MEMBERSHIP] Error:', {
      error: error instanceof Error ? error.message : 'Unknown',
      duration: `${duration}ms`,
    })
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST() {
  return NextResponse.json({ success: false, error: 'Method not allowed' }, { status: 405 })
}
