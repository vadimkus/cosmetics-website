import crypto from 'crypto'
import { readFile } from 'fs/promises'
import path from 'path'
import { PKPass } from 'passkit-generator'
import type { CanonicalWalletData } from '@/lib/wallet/domain'
import { decodeBase64Secret, walletSiteOrigin } from '@/lib/wallet/config'

const APPLE_ASSET_NAMES = [
  'icon.png',
  'icon@2x.png',
  'icon@3x.png',
  'logo.png',
  'logo@2x.png',
  'logo@3x.png',
] as const

const COPY = {
  en: {
    points: 'POINTS',
    rewardsValue: 'REWARDS VALUE',
    tier: 'TIER',
    memberNumber: 'MEMBER NUMBER',
    earnRate: 'EARN RATE',
    memberSince: 'MEMBER SINCE',
    program: 'HOW IT WORKS',
    programBody: 'Earn points on products and redeem them at checkout. 100 points = AED 5 off.',
    terms: 'REDEMPTION',
    termsBody: 'Rewards are redeemed through your authenticated GENOSYS checkout and cannot be transferred.',
    website: 'YOUR GENOSYS ACCOUNT',
    balanceChanged: 'Your GENOSYS Rewards balance is now %@ points.',
  },
  ru: {
    points: 'БАЛЛЫ',
    rewardsValue: 'ЦЕННОСТЬ БОНУСОВ',
    tier: 'УРОВЕНЬ',
    memberNumber: 'НОМЕР УЧАСТНИКА',
    earnRate: 'СКОРОСТЬ НАЧИСЛЕНИЯ',
    memberSince: 'УЧАСТНИК С',
    program: 'КАК ЭТО РАБОТАЕТ',
    programBody: 'Получайте баллы за товары и используйте их при оформлении заказа. 100 баллов = скидка 5 AED.',
    terms: 'ИСПОЛЬЗОВАНИЕ БАЛЛОВ',
    termsBody: 'Баллы используются только при авторизованном оформлении заказа GENOSYS и не передаются другим лицам.',
    website: 'ВАШ АККАУНТ GENOSYS',
    balanceChanged: 'Ваш баланс GENOSYS Rewards: %@ баллов.',
  },
  ar: {
    points: 'النقاط',
    rewardsValue: 'قيمة المكافآت',
    tier: 'المستوى',
    memberNumber: 'رقم العضوية',
    earnRate: 'معدل الكسب',
    memberSince: 'عضو منذ',
    program: 'آلية البرنامج',
    programBody: 'اكسب نقاطاً على المنتجات واستخدمها عند إتمام الطلب. كل 100 نقطة تساوي خصماً قدره 5 دراهم.',
    terms: 'استخدام النقاط',
    termsBody: 'تُستخدم المكافآت عبر إتمام طلب GENOSYS بعد تسجيل الدخول ولا يمكن تحويلها.',
    website: 'حسابك لدى GENOSYS',
    balanceChanged: 'أصبح رصيد مكافآت GENOSYS الآن %@ نقطة.',
  },
} as const

export function applePassAuthenticationToken(externalId: string): string {
  const secret = process.env.APPLE_WALLET_AUTH_SECRET
  if (!secret || secret.length < 32) {
    throw new Error('APPLE_WALLET_AUTH_SECRET must contain at least 32 characters')
  }
  return crypto.createHmac('sha256', secret).update(`apple-pass:${externalId}`).digest('base64url')
}

export function verifyApplePassAuthenticationToken(externalId: string, candidate: string): boolean {
  const expected = Buffer.from(applePassAuthenticationToken(externalId))
  const actual = Buffer.from(candidate)
  return expected.length === actual.length && crypto.timingSafeEqual(expected, actual)
}

export function applePassFieldModel(data: CanonicalWalletData) {
  const value = `AED ${data.valueAed.toLocaleString('en-AE', { maximumFractionDigits: 2 })}`
  return {
    primary: { key: 'points', label: 'POINTS', value: data.points, changeMessage: COPY.en.balanceChanged },
    secondary: [
      { key: 'value', label: 'REWARDS VALUE', value },
      { key: 'tier', label: 'TIER', value: data.tier },
    ],
    auxiliary: [
      { key: 'member', label: 'MEMBER NUMBER', value: data.memberNumber },
      { key: 'rate', label: 'EARN RATE', value: `${data.multiplier}x` },
    ],
    back: [
      { key: 'since', label: 'MEMBER SINCE', value: data.memberSince.toISOString().slice(0, 10) },
      { key: 'program', label: 'HOW IT WORKS', value: COPY.en.programBody },
      { key: 'terms', label: 'REDEMPTION', value: COPY.en.termsBody },
      { key: 'website', label: 'YOUR GENOSYS ACCOUNT', value: `${walletSiteOrigin()}/profile` },
    ],
  }
}

async function appleAssets(): Promise<Record<string, Buffer>> {
  const root = path.join(process.cwd(), 'assets', 'wallet', 'apple')
  const entries = await Promise.all(
    APPLE_ASSET_NAMES.map(async name => [name, await readFile(path.join(root, name))] as const),
  )
  return Object.fromEntries(entries)
}

export async function renderApplePass(data: CanonicalWalletData): Promise<Buffer> {
  const passTypeIdentifier = process.env.APPLE_PASS_TYPE_ID
  const teamIdentifier = process.env.APPLE_TEAM_ID
  if (!passTypeIdentifier || !teamIdentifier) throw new Error('Apple Wallet identity is incomplete')

  const pass = new PKPass(
    await appleAssets(),
    {
      wwdr: decodeBase64Secret('APPLE_WWDR_PEM_B64'),
      signerCert: decodeBase64Secret('APPLE_PASS_CERT_PEM_B64'),
      signerKey: decodeBase64Secret('APPLE_PASS_KEY_PEM_B64'),
      ...(process.env.APPLE_PASS_KEY_PASSPHRASE
        ? { signerKeyPassphrase: process.env.APPLE_PASS_KEY_PASSPHRASE }
        : {}),
    },
    {
      formatVersion: 1,
      passTypeIdentifier,
      serialNumber: data.externalId,
      teamIdentifier,
      organizationName: 'GENOSYS Middle East FZ-LLC',
      description: 'GENOSYS Rewards membership card',
      logoText: 'REWARDS',
      foregroundColor: 'rgb(23, 20, 15)',
      backgroundColor: 'rgb(248, 245, 241)',
      labelColor: 'rgb(139, 54, 63)',
      webServiceURL: `${walletSiteOrigin()}/api/wallet/apple/v1`,
      authenticationToken: applePassAuthenticationToken(data.externalId),
      sharingProhibited: true,
      voided: data.status !== 'ACTIVE',
    },
  )
  pass.type = 'storeCard'
  const fields = applePassFieldModel(data)
  pass.primaryFields.push(fields.primary)
  pass.secondaryFields.push(...fields.secondary)
  pass.auxiliaryFields.push(...fields.auxiliary)
  pass.backFields.push(...fields.back)
  pass.setBarcodes({
    format: 'PKBarcodeFormatQR',
    message: data.qrValue,
    messageEncoding: 'iso-8859-1',
    altText: data.memberNumber,
  })

  for (const [locale, translations] of Object.entries(COPY)) {
    pass.localize(locale, {
      POINTS: translations.points,
      'REWARDS VALUE': translations.rewardsValue,
      TIER: translations.tier,
      'MEMBER NUMBER': translations.memberNumber,
      'EARN RATE': translations.earnRate,
      'MEMBER SINCE': translations.memberSince,
      'HOW IT WORKS': translations.program,
      [COPY.en.programBody]: translations.programBody,
      REDEMPTION: translations.terms,
      [COPY.en.termsBody]: translations.termsBody,
      'YOUR GENOSYS ACCOUNT': translations.website,
      [COPY.en.balanceChanged]: translations.balanceChanged,
    })
  }

  return pass.getAsBuffer()
}
