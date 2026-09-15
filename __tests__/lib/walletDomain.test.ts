const userFindUnique = jest.fn()
const walletPassUpsert = jest.fn()

jest.mock('@/lib/prisma', () => ({
  prisma: {
    user: { findUnique: (...args: unknown[]) => userFindUnique(...args) },
    walletPass: { upsert: (...args: unknown[]) => walletPassUpsert(...args) },
  },
}))

import { issueWalletInstallLink, WalletRequestError } from '@/lib/wallet/domain'
import { verifyInstallToken } from '@/lib/wallet/tokens'

describe('wallet issuance domain', () => {
  beforeEach(() => {
    userFindUnique.mockReset()
    walletPassUpsert.mockReset()
    Object.assign(process.env, {
      WALLET_PASSES_ENABLED: 'true',
      APPLE_WALLET_ENABLED: 'true',
      WALLET_INSTALL_SECRET: 'install-secret-that-is-at-least-thirty-two-bytes',
      WALLET_QR_SECRET: 'qr-secret-that-is-at-least-thirty-two-bytes-long',
      APPLE_PASS_TYPE_ID: 'pass.ae.genosys.rewards',
      APPLE_TEAM_ID: 'TEAM',
      APPLE_PASS_CERT_PEM_B64: 'cert',
      APPLE_PASS_KEY_PEM_B64: 'key',
      APPLE_WWDR_PEM_B64: 'wwdr',
      APPLE_WALLET_AUTH_SECRET: 'apple-pass-auth-secret-with-at-least-32-bytes',
      NEXT_PUBLIC_SITE_URL: 'https://genosys.ae',
    })
  })

  afterEach(() => {
    for (const key of [
      'WALLET_PASSES_ENABLED',
      'APPLE_WALLET_ENABLED',
      'WALLET_INSTALL_SECRET',
      'WALLET_QR_SECRET',
      'APPLE_PASS_TYPE_ID',
      'APPLE_TEAM_ID',
      'APPLE_PASS_CERT_PEM_B64',
      'APPLE_PASS_KEY_PEM_B64',
      'APPLE_WWDR_PEM_B64',
      'APPLE_WALLET_AUTH_SECRET',
    ]) delete process.env[key]
  })

  it('returns a signed opaque URL for an eligible retail member', async () => {
    userFindUnique.mockResolvedValue({
      id: 'database-user-id',
      memberNumber: 'GNS-00001-AE',
      discountType: null,
      discountPercentage: null,
    })
    walletPassUpsert.mockResolvedValue({ externalId: 'a_opaque' })
    const result = await issueWalletInstallLink({
      userId: 'database-user-id',
      provider: 'APPLE',
      locale: 'ru',
    })
    expect(result.installUrl).not.toContain('database-user-id')
    expect(result.installUrl).not.toContain('GNS-00001-AE')
    const token = new URL(result.installUrl).searchParams.get('token')!
    expect(verifyInstallToken(token)).toEqual(expect.objectContaining({
      pass: 'a_opaque',
      provider: 'APPLE',
      locale: 'ru',
    }))
  })

  it('rejects partner accounts before creating a pass', async () => {
    userFindUnique.mockResolvedValue({
      id: 'partner',
      memberNumber: 'GNS-00002-AE',
      discountType: 'CLINIC',
      discountPercentage: 50,
    })
    await expect(issueWalletInstallLink({
      userId: 'partner',
      provider: 'APPLE',
      locale: 'en',
    })).rejects.toMatchObject<Partial<WalletRequestError>>({
      code: 'INELIGIBLE_ACCOUNT',
      status: 403,
    })
    expect(walletPassUpsert).not.toHaveBeenCalled()
  })
})
