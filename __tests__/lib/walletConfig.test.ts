import { getWalletCapabilities } from '@/lib/wallet/config'

const WALLET_KEYS = [
  'WALLET_PASSES_ENABLED',
  'APPLE_WALLET_ENABLED',
  'GOOGLE_WALLET_ENABLED',
  'WALLET_INSTALL_SECRET',
  'WALLET_QR_SECRET',
  'APPLE_PASS_TYPE_ID',
  'APPLE_TEAM_ID',
  'APPLE_PASS_CERT_PEM_B64',
  'APPLE_PASS_KEY_PEM_B64',
  'APPLE_WWDR_PEM_B64',
  'APPLE_WALLET_AUTH_SECRET',
  'GOOGLE_WALLET_ISSUER_ID',
  'GOOGLE_WALLET_CLASS_ID',
  'GOOGLE_WALLET_SERVICE_ACCOUNT_JSON_B64',
] as const

describe('wallet provider configuration', () => {
  const previous = new Map<string, string | undefined>()

  beforeEach(() => {
    for (const key of WALLET_KEYS) {
      previous.set(key, process.env[key])
      delete process.env[key]
    }
  })

  afterEach(() => {
    for (const key of WALLET_KEYS) {
      const value = previous.get(key)
      if (value === undefined) delete process.env[key]
      else process.env[key] = value
    }
  })

  it('fails closed when the master switch is off', () => {
    process.env.APPLE_WALLET_ENABLED = 'true'
    process.env.GOOGLE_WALLET_ENABLED = 'true'
    expect(getWalletCapabilities()).toEqual({ enabled: false, apple: false, google: false })
  })

  it('does not report a partially configured provider as ready', () => {
    process.env.WALLET_PASSES_ENABLED = 'true'
    process.env.APPLE_WALLET_ENABLED = 'true'
    process.env.APPLE_PASS_TYPE_ID = 'pass.ae.genosys.rewards'
    expect(getWalletCapabilities()).toEqual({ enabled: true, apple: false, google: false })
  })

  it('reports each fully configured provider independently', () => {
    Object.assign(process.env, {
      WALLET_PASSES_ENABLED: 'true',
      APPLE_WALLET_ENABLED: 'true',
      WALLET_INSTALL_SECRET: 'install',
      WALLET_QR_SECRET: 'qr',
      APPLE_PASS_TYPE_ID: 'pass.ae.genosys.rewards',
      APPLE_TEAM_ID: 'TEAM',
      APPLE_PASS_CERT_PEM_B64: 'cert',
      APPLE_PASS_KEY_PEM_B64: 'key',
      APPLE_WWDR_PEM_B64: 'wwdr',
      APPLE_WALLET_AUTH_SECRET: 'auth',
    })
    expect(getWalletCapabilities()).toEqual({ enabled: true, apple: true, google: false })
  })
})
