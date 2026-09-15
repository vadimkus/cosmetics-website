import crypto from 'crypto'
import type { WalletProvider } from '@/lib/wallet/config'

const INSTALL_TTL_SECONDS = 5 * 60

export type WalletLocale = 'en' | 'ru' | 'ar'

type InstallTokenPayload = {
  v: 1
  pass: string
  provider: WalletProvider
  locale: WalletLocale
  iat: number
  exp: number
}

function secret(name: 'WALLET_INSTALL_SECRET' | 'WALLET_QR_SECRET'): string {
  const value = process.env[name]
  if (!value || value.length < 32) throw new Error(`${name} must contain at least 32 characters`)
  return value
}

function sign(encodedPayload: string, key: string): string {
  return crypto.createHmac('sha256', key).update(encodedPayload).digest('base64url')
}

function safeEqual(left: string, right: string): boolean {
  const a = Buffer.from(left)
  const b = Buffer.from(right)
  return a.length === b.length && crypto.timingSafeEqual(a, b)
}

export function normalizeWalletLocale(value: unknown): WalletLocale {
  return value === 'ru' || value === 'ar' ? value : 'en'
}

export function createInstallToken(input: {
  externalId: string
  provider: WalletProvider
  locale: WalletLocale
  now?: number
}): { token: string; expiresAt: Date } {
  const now = input.now ?? Math.floor(Date.now() / 1000)
  const payload: InstallTokenPayload = {
    v: 1,
    pass: input.externalId,
    provider: input.provider,
    locale: input.locale,
    iat: now,
    exp: now + INSTALL_TTL_SECONDS,
  }
  const encoded = Buffer.from(JSON.stringify(payload)).toString('base64url')
  return {
    token: `${encoded}.${sign(encoded, secret('WALLET_INSTALL_SECRET'))}`,
    expiresAt: new Date(payload.exp * 1000),
  }
}

export function verifyInstallToken(token: string, now = Math.floor(Date.now() / 1000)): InstallTokenPayload | null {
  try {
    const [encoded, signature, extra] = token.split('.')
    if (!encoded || !signature || extra) return null
    const expected = sign(encoded, secret('WALLET_INSTALL_SECRET'))
    if (!safeEqual(signature, expected)) return null
    const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8')) as Partial<InstallTokenPayload>
    if (
      payload.v !== 1 ||
      typeof payload.pass !== 'string' ||
      (payload.provider !== 'APPLE' && payload.provider !== 'GOOGLE') ||
      (payload.locale !== 'en' && payload.locale !== 'ru' && payload.locale !== 'ar') ||
      typeof payload.iat !== 'number' ||
      typeof payload.exp !== 'number' ||
      payload.iat > now + 30 ||
      payload.exp <= now ||
      payload.exp - payload.iat !== INSTALL_TTL_SECONDS
    ) {
      return null
    }
    return payload as InstallTokenPayload
  } catch {
    return null
  }
}

export function createWalletQrValue(externalId: string): string {
  const identifier = crypto
    .createHmac('sha256', secret('WALLET_QR_SECRET'))
    .update(`member:${externalId}`)
    .digest('base64url')
    .slice(0, 32)
  const signature = crypto
    .createHmac('sha256', secret('WALLET_QR_SECRET'))
    .update(identifier)
    .digest('base64url')
    .slice(0, 16)
  return `gwr.${identifier}.${signature}`
}
