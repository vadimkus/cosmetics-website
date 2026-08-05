const globalFindFirst = jest.fn()

jest.mock('@/lib/database', () => ({
  prisma: {
    user: {
      findFirst: (...args: unknown[]) => globalFindFirst(...args),
    },
  },
}))

import { generateMemberNumber } from '@/lib/membership'

describe('generateMemberNumber', () => {
  beforeEach(() => {
    globalFindFirst.mockReset()
  })

  it('uses the supplied transaction client instead of opening a global query', async () => {
    const transactionFindFirst = jest.fn().mockResolvedValue({
      memberNumber: 'GNS-00041-AE',
    })
    const transactionClient = {
      user: {
        findFirst: transactionFindFirst,
      },
    }

    await expect(generateMemberNumber(transactionClient as never)).resolves.toBe('GNS-00042-AE')
    expect(transactionFindFirst).toHaveBeenCalledTimes(1)
    expect(globalFindFirst).not.toHaveBeenCalled()
  })

  it('keeps the global client as the default for non-transactional callers', async () => {
    globalFindFirst.mockResolvedValue(null)

    await expect(generateMemberNumber()).resolves.toBe('GNS-00001-AE')
    expect(globalFindFirst).toHaveBeenCalledTimes(1)
  })
})
