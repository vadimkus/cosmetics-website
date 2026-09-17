jest.mock('@/lib/database', () => ({
  prisma: {
    user: { findFirst: jest.fn(), update: jest.fn() },
    order: { aggregate: jest.fn() },
    loyaltyTransaction: { aggregate: jest.fn() },
  },
}))

jest.mock('@/lib/wallet/dirty', () => ({
  markWalletPassesDirty: jest.fn(),
}))

import { nextTierInfo } from '@/lib/membership'

describe('nextTierInfo', () => {
  it('keeps a spend-based Silver on the Gold range', () => {
    expect(nextTierInfo('SILVER', 3000)).toEqual({
      nextTier: 'GOLD',
      nextTierAt: 5000,
      progressPercent: 50,
    })
  })

  it('still shows progress when Silver was earned by orders, not spend', () => {
    expect(nextTierInfo('SILVER', 432)).toEqual({
      nextTier: 'GOLD',
      nextTierAt: 5000,
      progressPercent: 9,
    })
  })

  it('never returns a negative percent', () => {
    expect(nextTierInfo('GOLD', 200).progressPercent).toBeGreaterThanOrEqual(0)
  })
})
