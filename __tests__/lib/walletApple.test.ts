import {
  applePassAuthenticationToken,
  applePassFieldModel,
  verifyApplePassAuthenticationToken,
} from '@/lib/wallet/apple'
import type { CanonicalWalletData } from '@/lib/wallet/domain'

const data: CanonicalWalletData = {
  externalId: 'a_opaque',
  provider: 'APPLE',
  locale: 'en',
  revision: 3,
  name: 'Test Customer',
  memberNumber: 'GNS-00123-AE',
  memberSince: new Date('2026-07-08T00:00:00.000Z'),
  tier: 'GOLD',
  multiplier: 1.5,
  points: 1250,
  valueAed: 62.5,
  totalSpent: 6000,
  totalOrders: 12,
  qrValue: 'gwr.opaque.signature',
}

describe('Apple Wallet pass model', () => {
  beforeEach(() => {
    process.env.APPLE_WALLET_AUTH_SECRET = 'apple-pass-auth-secret-with-at-least-32-bytes'
    process.env.NEXT_PUBLIC_SITE_URL = 'https://genosys.ae'
  })

  afterEach(() => {
    delete process.env.APPLE_WALLET_AUTH_SECRET
  })

  it('uses stable constant-time verifiable pass authentication tokens', () => {
    const token = applePassAuthenticationToken(data.externalId)
    expect(token).not.toContain(data.externalId)
    expect(verifyApplePassAuthenticationToken(data.externalId, token)).toBe(true)
    expect(verifyApplePassAuthenticationToken(data.externalId, `${token}x`)).toBe(false)
  })

  it('shows the authoritative points, value, tier and member number', () => {
    const fields = applePassFieldModel(data)
    expect(fields.primary.value).toBe(1250)
    expect(fields.primary.changeMessage).toContain('%@')
    expect(fields.secondary).toEqual(expect.arrayContaining([
      expect.objectContaining({ key: 'value', value: 'AED 62.5' }),
      expect.objectContaining({ key: 'tier', value: 'GOLD' }),
    ]))
    expect(fields.auxiliary).toEqual(expect.arrayContaining([
      expect.objectContaining({ key: 'member', value: 'GNS-00123-AE' }),
      expect.objectContaining({ key: 'rate', value: '1.5x' }),
    ]))
    expect(JSON.stringify(fields)).not.toContain('customer@example.com')
  })
})
