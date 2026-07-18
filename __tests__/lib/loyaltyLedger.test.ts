jest.mock('@/lib/prisma', () => ({
  prisma: {
    loyaltyTransaction: {
      create: jest.fn(),
      findFirst: jest.fn(),
      aggregate: jest.fn(),
    },
    user: {
      update: jest.fn(),
    },
  },
}))
jest.mock('@/lib/membership', () => ({
  computeTier: jest.fn(() => 'MEMBER'),
}))
jest.mock('@/lib/logger', () => ({
  debugLog: jest.fn(),
  errorLog: jest.fn(),
}))

import { recordRedemption, reverseRedemptionForOrder } from '@/lib/loyalty'

const mockPrisma = jest.requireMock('@/lib/prisma').prisma

describe('loyalty redemption ledger lifecycle', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockPrisma.loyaltyTransaction.aggregate.mockResolvedValue({
      _sum: { points: 600 },
    })
    mockPrisma.user.update.mockResolvedValue({})
  })

  it('records a negative redemption and refreshes the materialized balance', async () => {
    mockPrisma.loyaltyTransaction.create.mockResolvedValue({})

    await expect(
      recordRedemption({
        userId: 'user-1',
        orderId: 'order-1',
        orderNumber: 'GENCardW2607180001',
        points: 400,
        amountAed: 20,
      })
    ).resolves.toBe(true)

    expect(mockPrisma.loyaltyTransaction.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        userId: 'user-1',
        orderId: 'order-1',
        type: 'REDEEM',
        points: -400,
      }),
    })
    expect(mockPrisma.user.update).toHaveBeenCalledWith({
      where: { id: 'user-1' },
      data: { loyaltyPoints: 600 },
    })
  })

  it('treats a duplicate redemption as an idempotent no-op', async () => {
    mockPrisma.loyaltyTransaction.create.mockRejectedValue({ code: 'P2002' })

    await expect(
      recordRedemption({
        userId: 'user-1',
        orderId: 'order-1',
        orderNumber: 'GENCardW2607180001',
        points: 400,
        amountAed: 20,
      })
    ).resolves.toBe(false)

    expect(mockPrisma.user.update).toHaveBeenCalled()
  })

  it('returns redeemed points once when an order is cancelled', async () => {
    mockPrisma.loyaltyTransaction.findFirst.mockResolvedValue({
      userId: 'user-1',
      points: -400,
    })
    mockPrisma.loyaltyTransaction.create.mockResolvedValue({})

    await expect(reverseRedemptionForOrder('order-1')).resolves.toBe(true)

    expect(mockPrisma.loyaltyTransaction.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        userId: 'user-1',
        orderId: 'order-1',
        type: 'REDEEM_REVERSAL',
        points: 400,
      }),
    })
  })
})
