import {
  createInstallToken,
  createWalletQrValue,
  normalizeWalletLocale,
  verifyInstallToken,
} from '@/lib/wallet/tokens'

describe('wallet install and QR tokens', () => {
  const installSecret = 'install-secret-that-is-at-least-thirty-two-bytes'
  const qrSecret = 'qr-secret-that-is-at-least-thirty-two-bytes-long'

  beforeEach(() => {
    process.env.WALLET_INSTALL_SECRET = installSecret
    process.env.WALLET_QR_SECRET = qrSecret
  })

  afterEach(() => {
    delete process.env.WALLET_INSTALL_SECRET
    delete process.env.WALLET_QR_SECRET
  })

  it('issues a five-minute token with no user PII', () => {
    const issued = createInstallToken({
      externalId: 'a_opaque',
      provider: 'APPLE',
      locale: 'ru',
      now: 1_000,
    })
    expect(issued.expiresAt.toISOString()).toBe(new Date(1_300_000).toISOString())
    expect(issued.token).not.toContain('@')
    expect(verifyInstallToken(issued.token, 1_299)).toEqual({
      v: 1,
      pass: 'a_opaque',
      provider: 'APPLE',
      locale: 'ru',
      iat: 1_000,
      exp: 1_300,
    })
  })

  it('rejects tampered, expired, and future-issued tokens', () => {
    const { token } = createInstallToken({
      externalId: 'g_opaque',
      provider: 'GOOGLE',
      locale: 'en',
      now: 2_000,
    })
    expect(verifyInstallToken(`${token}x`, 2_001)).toBeNull()
    expect(verifyInstallToken(token, 2_300)).toBeNull()
    expect(verifyInstallToken(token, 1_900)).toBeNull()
  })

  it('normalizes supported locales and creates opaque stable QR values', () => {
    expect(normalizeWalletLocale('ar')).toBe('ar')
    expect(normalizeWalletLocale('fr')).toBe('en')
    expect(createWalletQrValue('a_opaque')).toBe(createWalletQrValue('a_opaque'))
    expect(createWalletQrValue('a_opaque')).toMatch(/^gwr\.[\w-]{32}\.[\w-]{16}$/)
    expect(createWalletQrValue('a_opaque')).not.toContain('a_opaque')
  })
})
