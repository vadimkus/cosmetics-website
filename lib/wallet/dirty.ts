import { prisma } from '@/lib/database'
import { errorLog } from '@/lib/logger'

/**
 * Coalesces any number of loyalty/profile changes into one provider sync per
 * pass. A wallet failure must never roll back an order, redemption or review.
 */
export async function markWalletPassesDirty(userId: string, reason: string): Promise<number> {
  try {
    const now = new Date()
    const result = await prisma.walletPass.updateMany({
      where: { userId, status: 'ACTIVE' },
      data: {
        contentRevision: { increment: 1 },
        contentUpdatedAt: now,
        nextSyncAt: now,
        retryCount: 0,
        lastError: null,
      },
    })
    return result.count
  } catch (error) {
    errorLog('[wallet] Could not mark passes dirty:', {
      userId,
      reason,
      error: error instanceof Error ? error.message : 'unknown',
    })
    return 0
  }
}

export async function deactivateWalletPasses(userId: string, reason: string): Promise<number> {
  try {
    const now = new Date()
    const result = await prisma.walletPass.updateMany({
      where: { userId, status: 'ACTIVE' },
      data: {
        status: 'INACTIVE',
        contentRevision: { increment: 1 },
        contentUpdatedAt: now,
        nextSyncAt: now,
        retryCount: 0,
        lastError: null,
      },
    })
    return result.count
  } catch (error) {
    errorLog('[wallet] Could not deactivate passes:', {
      userId,
      reason,
      error: error instanceof Error ? error.message : 'unknown',
    })
    return 0
  }
}
