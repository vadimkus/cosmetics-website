jest.mock('@/lib/prisma', () => ({ prisma: {} }))
jest.mock('@/lib/membership', () => ({
  computeTier: jest.fn(() => 'MEMBER'),
}))
jest.mock('@/lib/logger', () => ({
  debugLog: jest.fn(),
  errorLog: jest.fn(),
}))

import {
  REDEEM_BLOCK_AED,
  REDEEM_BLOCK_POINTS,
  REDEEM_MAX_ORDER_FRACTION,
  canRedeemPoints,
  computeRedemption,
} from '@/lib/loyalty'

describe('GENOSYS Rewards redemption rules', () => {
  it('uses the configured 100-point / AED 5 blocks and 20% order cap', () => {
    expect(REDEEM_BLOCK_POINTS).toBe(100)
    expect(REDEEM_BLOCK_AED).toBe(5)
    expect(REDEEM_MAX_ORDER_FRACTION).toBe(0.2)
  })

  it('floors a request to whole redemption blocks', () => {
    expect(computeRedemption(199, 1000, 1000)).toEqual({
      points: 100,
      amountAed: 5,
    })
  })

  it('caps redemption by the live points balance', () => {
    expect(computeRedemption(2000, 950, 1000)).toEqual({
      points: 900,
      amountAed: 45,
    })
  })

  it('caps redemption at 20% of the discounted product subtotal', () => {
    // AED 200 subtotal → AED 40 cap → 8 blocks → 800 points.
    expect(computeRedemption(2000, 5000, 200)).toEqual({
      points: 800,
      amountAed: 40,
    })
  })

  it('returns zero when the order cannot support the minimum AED 5 block', () => {
    expect(computeRedemption(100, 100, 24.99)).toEqual({
      points: 0,
      amountAed: 0,
    })
  })

  it('rejects invalid, negative, or unavailable requests', () => {
    expect(computeRedemption(Number.NaN, 1000, 100)).toEqual({ points: 0, amountAed: 0 })
    expect(computeRedemption(-100, 1000, 100)).toEqual({ points: 0, amountAed: 0 })
    expect(computeRedemption(100, 0, 100)).toEqual({ points: 0, amountAed: 0 })
  })

  it('allows standard rewards accounts but not active discounted accounts', () => {
    expect(canRedeemPoints({ discountType: null, discountPercentage: null })).toBe(true)
    expect(canRedeemPoints({ discountType: null, discountPercentage: 15 })).toBe(true)
    expect(canRedeemPoints({ discountType: 'VIP', discountPercentage: 10 })).toBe(false)
    expect(canRedeemPoints({ discountType: 'CLINIC', discountPercentage: 30 })).toBe(false)
  })
})
