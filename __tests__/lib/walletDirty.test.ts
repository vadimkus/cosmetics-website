const updateMany = jest.fn()

jest.mock('@/lib/database', () => ({
  prisma: {
    walletPass: { updateMany: (...args: unknown[]) => updateMany(...args) },
  },
}))
jest.mock('@/lib/logger', () => ({ errorLog: jest.fn() }))

import { deactivateWalletPasses, markWalletPassesDirty } from '@/lib/wallet/dirty'

describe('wallet dirty state', () => {
  beforeEach(() => updateMany.mockReset())

  it('coalesces content updates onto all active provider passes', async () => {
    updateMany.mockResolvedValue({ count: 2 })
    await expect(markWalletPassesDirty('user-1', 'points-redeemed')).resolves.toBe(2)
    expect(updateMany).toHaveBeenCalledWith(expect.objectContaining({
      where: { userId: 'user-1', status: 'ACTIVE' },
      data: expect.objectContaining({
        contentRevision: { increment: 1 },
        retryCount: 0,
        lastError: null,
      }),
    }))
  })

  it('queues a final provider-visible inactive state on account deletion', async () => {
    updateMany.mockResolvedValue({ count: 1 })
    await expect(deactivateWalletPasses('user-1', 'account-anonymized')).resolves.toBe(1)
    expect(updateMany).toHaveBeenCalledWith(expect.objectContaining({
      where: { userId: 'user-1', status: 'ACTIVE' },
      data: expect.objectContaining({
        status: 'INACTIVE',
        contentRevision: { increment: 1 },
      }),
    }))
  })

  it('does not let a wallet outage fail the commerce operation', async () => {
    updateMany.mockRejectedValue(new Error('database unavailable'))
    await expect(markWalletPassesDirty('user-1', 'order-points-awarded')).resolves.toBe(0)
  })
})
