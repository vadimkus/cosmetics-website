'use client'
/* eslint-disable @next/next/no-img-element -- official wallet SVGs must be served unmodified */

import { useEffect, useMemo, useState } from 'react'
import { fetchCsrfToken, getCsrfHeaders } from '@/lib/csrfClient'
import { useTranslation } from '@/hooks/useTranslation'

type Provider = 'APPLE' | 'GOOGLE'
type Device = 'desktop' | 'ios' | 'android'

function detectDevice(): Device {
  const ua = navigator.userAgent
  const isIPadOS = navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1
  if (/iPhone|iPad|iPod/i.test(ua) || isIPadOS) return 'ios'
  if (/Android/i.test(ua)) return 'android'
  return 'desktop'
}

export default function WalletButtons({
  wallet,
  track,
}: {
  wallet: { apple: boolean; google: boolean } | undefined
  track: 'REWARDS' | 'PARTNER'
}) {
  const { t, locale, dir } = useTranslation()
  const [device, setDevice] = useState<Device>('desktop')
  const [loading, setLoading] = useState<Provider | null>(null)
  const [error, setError] = useState('')

  useEffect(() => setDevice(detectDevice()), [])

  const providers = useMemo(() => {
    if (track !== 'REWARDS') return []
    const choices: Provider[] = []
    if (wallet?.apple && device !== 'android') choices.push('APPLE')
    if (wallet?.google && device !== 'ios') choices.push('GOOGLE')
    return choices
  }, [device, track, wallet?.apple, wallet?.google])

  if (providers.length === 0) return null

  const openWallet = async (provider: Provider) => {
    if (loading) return
    setLoading(provider)
    setError('')
    try {
      const csrf = await fetchCsrfToken()
      if (!csrf) throw new Error('csrf')
      const response = await fetch('/api/user/wallet', {
        method: 'POST',
        credentials: 'include',
        headers: getCsrfHeaders(),
        body: JSON.stringify({ provider, locale }),
      })
      const body = await response.json().catch(() => null)
      if (!response.ok || !body?.installUrl) throw new Error(body?.error || 'wallet')
      window.location.assign(body.installUrl)
    } catch {
      setError(t('rewards.walletError'))
      setLoading(null)
    }
  }

  const googleAsset =
    locale === 'ar'
      ? '/images/wallet-badges/google-ar.svg'
      : locale === 'ru'
        ? '/images/wallet-badges/google-ru.svg'
        : '/images/wallet-badges/google-en.svg'

  return (
    <div
      className={`border-t border-[var(--cera-line)] px-4 py-4 md:px-6 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}
      aria-label={t('rewards.walletPasses')}
    >
      <p className="mb-2 text-xs font-semibold text-[var(--cera-ink)]">{t('rewards.keepCardInWallet')}</p>
      <div className={`flex flex-wrap items-center gap-2 ${dir === 'rtl' ? 'justify-end' : ''}`}>
        {providers.includes('APPLE') && (
          <button
            type="button"
            onClick={() => openWallet('APPLE')}
            disabled={Boolean(loading)}
            className="inline-flex min-h-12 items-center justify-center p-1 disabled:opacity-55"
            aria-label={t('rewards.addToAppleWallet')}
            aria-busy={loading === 'APPLE'}
          >
            {loading === 'APPLE' ? (
              <span className="px-4 text-xs font-semibold text-[var(--cera-muted)]">{t('rewards.walletOpening')}</span>
            ) : (
              <img src="/images/wallet-badges/apple-en.svg" alt="" className="h-[48px] w-auto" />
            )}
          </button>
        )}
        {providers.includes('GOOGLE') && (
          <button
            type="button"
            onClick={() => openWallet('GOOGLE')}
            disabled={Boolean(loading)}
            className="inline-flex min-h-12 items-center justify-center p-1 disabled:opacity-55"
            aria-label={t('rewards.addToGoogleWallet')}
            aria-busy={loading === 'GOOGLE'}
          >
            {loading === 'GOOGLE' ? (
              <span className="px-4 text-xs font-semibold text-[var(--cera-muted)]">{t('rewards.walletOpening')}</span>
            ) : (
              <img src={googleAsset} alt="" className="h-[48px] w-auto" />
            )}
          </button>
        )}
      </div>
      {error && <p role="alert" className="mt-2 text-xs text-red-700">{error}</p>}
    </div>
  )
}
