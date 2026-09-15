import { renderAppleInstallLanding } from '@/lib/wallet/appleInstall'

describe('Apple Wallet install landing page', () => {
  it('launches the pass without replacing the branded confirmation page', () => {
    const html = renderAppleInstallLanding({
      locale: 'en',
      passUrl: '/api/wallet/install?token=signed&download=1',
      statusUrl: '/api/wallet/install?token=signed&status=1',
      nativeApp: true,
    })

    expect(html).toContain('Opening Apple Wallet')
    expect(html).toContain('Added to Apple Wallet')
    expect(html).toContain("document.createElement('iframe')")
    expect(html).toContain('genosys://wallet-complete?status=added')
    expect(html).toContain('genosys://wallet-complete?status=returned')
    expect(html).toContain('fetch(statusUrl')
  })

  it.each([
    ['ru', 'Добавлено в Apple Wallet', 'Вернуться в GENOSYS'],
    ['ar', 'تمت الإضافة إلى Apple Wallet', 'العودة إلى GENOSYS'],
  ] as const)('renders localized %s confirmation copy', (locale, title, returnLabel) => {
    const html = renderAppleInstallLanding({
      locale,
      passUrl: '/pass',
      statusUrl: '/status',
      nativeApp: true,
    })

    expect(html).toContain(title)
    expect(html).toContain(returnLabel)
  })

  it('returns website visitors to their account', () => {
    const html = renderAppleInstallLanding({
      locale: 'en',
      passUrl: '/pass',
      statusUrl: '/status',
      nativeApp: false,
    })

    expect(html).toContain('href="/profile"')
    expect(html).not.toContain('genosys://wallet-complete?status=returned')
  })
})
