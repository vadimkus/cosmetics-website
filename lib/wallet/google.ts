import crypto from 'crypto'
import { GoogleAuth } from 'google-auth-library'
import type { CanonicalWalletData } from '@/lib/wallet/domain'
import { walletSiteOrigin } from '@/lib/wallet/config'

const WALLET_SCOPE = 'https://www.googleapis.com/auth/wallet_object.issuer'
const API = 'https://walletobjects.googleapis.com/walletobjects/v1'

type ServiceAccount = {
  client_email: string
  private_key: string
  project_id?: string
}

const localized = (en: string, ru: string, ar: string) => ({
  defaultValue: { language: 'en-US', value: en },
  translatedValues: [
    { language: 'ru-RU', value: ru },
    { language: 'ar', value: ar },
  ],
})

function serviceAccount(): ServiceAccount {
  const encoded = process.env.GOOGLE_WALLET_SERVICE_ACCOUNT_JSON_B64
  if (!encoded) throw new Error('Missing GOOGLE_WALLET_SERVICE_ACCOUNT_JSON_B64')
  const parsed = JSON.parse(Buffer.from(encoded, 'base64').toString('utf8')) as Partial<ServiceAccount>
  if (!parsed.client_email || !parsed.private_key) {
    throw new Error('Google Wallet service account is missing client_email/private_key')
  }
  return parsed as ServiceAccount
}

function walletIdentity() {
  const issuerId = process.env.GOOGLE_WALLET_ISSUER_ID
  const classId = process.env.GOOGLE_WALLET_CLASS_ID
  if (!issuerId || !classId) throw new Error('Google Wallet issuer/class is incomplete')
  if (!classId.startsWith(`${issuerId}.`)) {
    throw new Error('GOOGLE_WALLET_CLASS_ID must begin with GOOGLE_WALLET_ISSUER_ID')
  }
  return { issuerId, classId }
}

function googleObjectId(externalId: string): string {
  return `${walletIdentity().issuerId}.${externalId}`
}

export function googleLoyaltyClass() {
  const { classId } = walletIdentity()
  return {
    id: classId,
    issuerName: 'GENOSYS Middle East FZ-LLC',
    localizedIssuerName: localized(
      'GENOSYS Middle East',
      'GENOSYS Middle East',
      'GENOSYS الشرق الأوسط',
    ),
    programName: 'GENOSYS Rewards',
    localizedProgramName: localized(
      'GENOSYS Rewards',
      'GENOSYS Rewards',
      'مكافآت GENOSYS',
    ),
    programLogo: {
      sourceUri: { uri: `${walletSiteOrigin()}/icon-512x512.png` },
      contentDescription: localized('GENOSYS logo', 'Логотип GENOSYS', 'شعار GENOSYS'),
    },
    hexBackgroundColor: '#F8F5F1',
    accountNameLabel: 'Member',
    localizedAccountNameLabel: localized('Member', 'Участник', 'العضو'),
    accountIdLabel: 'Member number',
    localizedAccountIdLabel: localized('Member number', 'Номер участника', 'رقم العضوية'),
    reviewStatus: 'UNDER_REVIEW',
    homepageUri: {
      uri: `${walletSiteOrigin()}/profile`,
      description: 'GENOSYS account',
      localizedDescription: localized('GENOSYS account', 'Аккаунт GENOSYS', 'حساب GENOSYS'),
    },
  }
}

export function googleLoyaltyObject(data: CanonicalWalletData) {
  return {
    id: googleObjectId(data.externalId),
    classId: walletIdentity().classId,
    state: 'ACTIVE',
    accountName: data.name,
    accountId: data.memberNumber,
    loyaltyPoints: {
      label: 'Points',
      localizedLabel: localized('Points', 'Баллы', 'النقاط'),
      balance: { int: data.points },
    },
    barcode: {
      type: 'QR_CODE',
      value: data.qrValue,
      alternateText: data.memberNumber,
    },
    textModulesData: [
      {
        id: 'membership',
        header: 'Membership details',
        localizedHeader: localized('Membership details', 'Данные участника', 'بيانات العضوية'),
        body: `${data.tier} · AED ${data.valueAed.toLocaleString('en-AE', { maximumFractionDigits: 2 })} · ${data.multiplier}x · ${data.memberSince.toISOString().slice(0, 10)}`,
      },
      {
        id: 'redemption',
        header: 'How rewards work',
        localizedHeader: localized('How rewards work', 'Как работают бонусы', 'آلية المكافآت'),
        body: '100 points = AED 5 off. Redeem securely at checkout on GENOSYS.',
        localizedBody: localized(
          '100 points = AED 5 off. Redeem securely at checkout on GENOSYS.',
          '100 баллов = скидка 5 AED. Используйте баллы при оформлении заказа GENOSYS.',
          'كل 100 نقطة تساوي خصماً قدره 5 دراهم. استخدمها بأمان عند إتمام طلب GENOSYS.',
        ),
      },
    ],
    linksModuleData: {
      uris: [
        {
          id: 'account',
          uri: `${walletSiteOrigin()}/profile`,
          description: 'Open GENOSYS account',
          localizedDescription: localized(
            'Open GENOSYS account',
            'Открыть аккаунт GENOSYS',
            'فتح حساب GENOSYS',
          ),
        },
      ],
    },
  }
}

async function googleClient() {
  const auth = new GoogleAuth({
    credentials: serviceAccount(),
    scopes: [WALLET_SCOPE],
  })
  return auth.getClient()
}

function isNotFound(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false
  const candidate = error as { response?: { status?: number }; code?: number }
  return candidate.response?.status === 404 || candidate.code === 404
}

export async function ensureGoogleLoyaltyClass(): Promise<void> {
  const client = await googleClient()
  const model = googleLoyaltyClass()
  try {
    await client.request({ url: `${API}/loyaltyClass/${encodeURIComponent(model.id)}` })
  } catch (error) {
    if (!isNotFound(error)) throw error
    await client.request({ url: `${API}/loyaltyClass`, method: 'POST', data: model })
  }
}

export async function upsertGoogleLoyaltyObject(data: CanonicalWalletData): Promise<string> {
  await ensureGoogleLoyaltyClass()
  const client = await googleClient()
  const model = googleLoyaltyObject(data)
  try {
    await client.request({
      url: `${API}/loyaltyObject/${encodeURIComponent(model.id)}`,
      method: 'PATCH',
      data: model,
    })
  } catch (error) {
    if (!isNotFound(error)) throw error
    await client.request({ url: `${API}/loyaltyObject`, method: 'POST', data: model })
  }
  return model.id
}

export async function deactivateGoogleLoyaltyObject(externalId: string): Promise<void> {
  const client = await googleClient()
  const id = googleObjectId(externalId)
  await client.request({
    url: `${API}/loyaltyObject/${encodeURIComponent(id)}`,
    method: 'PATCH',
    data: { state: 'INACTIVE' },
  })
}

export function createGoogleSaveUrl(externalId: string): string {
  const account = serviceAccount()
  const objectId = googleObjectId(externalId)
  const now = Math.floor(Date.now() / 1000)
  const header = Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).toString('base64url')
  const payload = Buffer.from(JSON.stringify({
    iss: account.client_email,
    aud: 'google',
    typ: 'savetowallet',
    iat: now,
    origins: [walletSiteOrigin()],
    payload: {
      loyaltyObjects: [{ id: objectId, classId: walletIdentity().classId }],
    },
  })).toString('base64url')
  const unsigned = `${header}.${payload}`
  const signature = crypto.sign('RSA-SHA256', Buffer.from(unsigned), account.private_key).toString('base64url')
  return `https://pay.google.com/gp/v/save/${unsigned}.${signature}`
}
