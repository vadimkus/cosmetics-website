import crypto from 'crypto'
import {
  createGoogleSaveUrl,
  googleLoyaltyClass,
  googleLoyaltyObject,
} from '@/lib/wallet/google'
import type { CanonicalWalletData } from '@/lib/wallet/domain'

const data: CanonicalWalletData = {
  externalId: 'g_opaque',
  provider: 'GOOGLE',
  locale: 'ar',
  revision: 2,
  name: 'Test Customer',
  memberNumber: 'GNS-00456-AE',
  memberSince: new Date('2026-07-08T00:00:00.000Z'),
  tier: 'SILVER',
  multiplier: 1.25,
  points: 850,
  valueAed: 42.5,
  totalSpent: 1200,
  totalOrders: 4,
  qrValue: 'gwr.opaque.signature',
}

describe('Google Wallet loyalty pass', () => {
  beforeAll(() => {
    const { privateKey } = crypto.generateKeyPairSync('rsa', { modulusLength: 2048 })
    const credentials = {
      client_email: 'wallet-test@example.iam.gserviceaccount.com',
      private_key: privateKey.export({ type: 'pkcs8', format: 'pem' }).toString(),
    }
    process.env.GOOGLE_WALLET_SERVICE_ACCOUNT_JSON_B64 = Buffer
      .from(JSON.stringify(credentials))
      .toString('base64')
    process.env.GOOGLE_WALLET_ISSUER_ID = '123456789'
    process.env.GOOGLE_WALLET_CLASS_ID = '123456789.genosys_rewards'
    process.env.NEXT_PUBLIC_SITE_URL = 'https://genosys.ae'
  })

  afterAll(() => {
    delete process.env.GOOGLE_WALLET_SERVICE_ACCOUNT_JSON_B64
    delete process.env.GOOGLE_WALLET_ISSUER_ID
    delete process.env.GOOGLE_WALLET_CLASS_ID
  })

  it('builds a localized class and ledger-backed member object', () => {
    const passClass = googleLoyaltyClass()
    const passObject = googleLoyaltyObject(data)
    expect(passClass.id).toBe('123456789.genosys_rewards')
    expect(passClass.localizedProgramName.translatedValues).toEqual(expect.arrayContaining([
      expect.objectContaining({ language: 'ru-RU' }),
      expect.objectContaining({ language: 'ar' }),
    ]))
    expect(passObject.id).toBe('123456789.g_opaque')
    expect(passObject.loyaltyPoints.balance.int).toBe(850)
    expect(passObject.accountId).toBe('GNS-00456-AE')
    expect(passObject.barcode.value).toBe('gwr.opaque.signature')
  })

  it('signs a save URL whose JWT references only the opaque object', () => {
    const url = createGoogleSaveUrl(data.externalId)
    expect(url).toMatch(/^https:\/\/pay\.google\.com\/gp\/v\/save\//)
    const jwt = url.split('/').at(-1)!
    const [, payload] = jwt.split('.')
    const decoded = JSON.parse(Buffer.from(payload!, 'base64url').toString('utf8'))
    expect(decoded.iss).toBe('wallet-test@example.iam.gserviceaccount.com')
    expect(decoded.payload.loyaltyObjects).toEqual([
      { id: '123456789.g_opaque', classId: '123456789.genosys_rewards' },
    ])
    expect(JSON.stringify(decoded)).not.toContain(data.name)
    expect(JSON.stringify(decoded)).not.toContain(data.memberNumber)
  })
})
