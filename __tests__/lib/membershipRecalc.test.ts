jest.mock('@/lib/database', () => ({
  prisma: {
    order: {
      aggregate: jest.fn(),
    },
    loyaltyTransaction: {
      aggregate: jest.fn(),
    },
    user: {
      update: jest.fn(),
    },
  },
}))

import { recalcUserStats } from '@/lib/membership'

const mockPrisma = jest.requireMock('@/lib/database').prisma

describe('recalcUserStats', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockPrisma.order.aggregate.mockResolvedValue({
      _sum: { total: 1000 },
      _count: 2,
    })
    mockPrisma.loyaltyTransaction.aggregate.mockResolvedValue({
      _sum: { points: 350 },
    })
    mockPrisma.user.update.mockResolvedValue({})
  })

  it('uses the loyalty ledger balance instead of reconstructing points from spend', async () => {
    const result = await recalcUserStats('user-1')

    expect(result.loyaltyPoints).toBe(350)
    expect(mockPrisma.user.update).toHaveBeenCalledWith({
      where: { id: 'user-1' },
      data: expect.objectContaining({
        totalSpent: 1000,
        totalOrders: 2,
        loyaltyPoints: 350,
      }),
    })
  })
})
