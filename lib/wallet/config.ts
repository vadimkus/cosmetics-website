export type WalletProvider = 'APPLE' | 'GOOGLE'

const enabled = (value: string | undefined) => value === 'true'
const present = (value: string | undefined) => Boolean(value?.trim())

export type WalletCapabilities = {
  enabled: boolean
  apple: boolean
  google: boolean
}

export function getWalletCapabilities(): WalletCapabilities {
  const master = enabled(process.env.WALLET_PASSES_ENABLED)
  const apple =
    master &&
    enabled(process.env.APPLE_WALLET_ENABLED) &&
    [
      process.env.APPLE_PASS_TYPE_ID,
      process.env.APPLE_TEAM_ID,
      process.env.APPLE_PASS_CERT_PEM_B64,
      process.env.APPLE_PASS_KEY_PEM_B64,
      process.env.APPLE_WWDR_PEM_B64,
      process.env.APPLE_WALLET_AUTH_SECRET,
      process.env.WALLET_INSTALL_SECRET,
      process.env.WALLET_QR_SECRET,
    ].every(present)
  const google =
    master &&
    enabled(process.env.GOOGLE_WALLET_ENABLED) &&
    [
      process.env.GOOGLE_WALLET_ISSUER_ID,
      process.env.GOOGLE_WALLET_CLASS_ID,
      process.env.GOOGLE_WALLET_SERVICE_ACCOUNT_JSON_B64,
      process.env.WALLET_INSTALL_SECRET,
      process.env.WALLET_QR_SECRET,
    ].every(present)

  return { enabled: master, apple, google }
}

export function isWalletProviderReady(provider: WalletProvider): boolean {
  const capabilities = getWalletCapabilities()
  return provider === 'APPLE' ? capabilities.apple : capabilities.google
}

export function requireWalletProvider(provider: WalletProvider): void {
  if (!isWalletProviderReady(provider)) {
    const error = new Error(`${provider} wallet provider is not configured`)
    error.name = 'WalletProviderNotConfiguredError'
    throw error
  }
}

export function decodeBase64Secret(name: string): Buffer {
  const value = process.env[name]
  if (!value) throw new Error(`Missing ${name}`)
  return Buffer.from(value, 'base64')
}

export function walletSiteOrigin(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL || 'https://genosys.ae'
  return raw.replace(/\/+$/, '')
}
