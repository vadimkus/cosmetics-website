jest.mock('@/lib/prisma', () => ({ prisma: {} }))

import { walletContentFingerprint } from '@/lib/wallet/sync'
import type { CanonicalWalletData } from '@/lib/wallet/domain'

const data: CanonicalWalletData = {
  externalId: 'a_opaque',
  provider: 'APPLE',
  locale: 'en',
  status: 'ACTIVE',
  revision: 1,
  name: 'Customer',
  memberNumber: 'GNS-00001-AE',
  memberSince: new Date('2026-07-08T00:00:00.000Z'),
  tier: 'MEMBER',
  multiplier: 1,
  points: 100,
  valueAed: 5,
  totalSpent: 100,
  totalOrders: 1,
  qrValue: 'gwr.opaque.signature',
}

describe('wallet content fingerprint', () => {
  it('ignores provider delivery metadata but changes with customer-visible content', () => {
    const first = walletContentFingerprint(data)
    expect(walletContentFingerprint({ ...data, revision: 99 })).toBe(first)
    expect(walletContentFingerprint({ ...data, qrValue: 'gwr.other.signature' })).toBe(first)
    expect(walletContentFingerprint({ ...data, points: 200, valueAed: 10 })).not.toBe(first)
    expect(walletContentFingerprint({ ...data, status: 'INACTIVE' })).not.toBe(first)
  })
})
