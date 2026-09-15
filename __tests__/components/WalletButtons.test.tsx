import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import WalletButtons from '@/components/profile/WalletButtons'
import { fetchCsrfToken } from '@/lib/csrfClient'

jest.mock('@/hooks/useTranslation', () => ({
  useTranslation: () => ({
    locale: 'en',
    dir: 'ltr',
    t: (key: string) => ({
      'rewards.walletPasses': 'Wallet passes',
      'rewards.keepCardInWallet': 'Keep your card in Wallet',
      'rewards.addToAppleWallet': 'Add to Apple Wallet',
      'rewards.addToGoogleWallet': 'Add to Google Wallet',
      'rewards.walletOpening': 'Opening wallet',
      'rewards.walletError': 'Could not open wallet',
    } as Record<string, string>)[key] || key,
  }),
}))
jest.mock('@/lib/csrfClient', () => ({
  fetchCsrfToken: jest.fn(),
  getCsrfHeaders: () => ({ 'Content-Type': 'application/json' }),
}))

const mockedCsrf = jest.mocked(fetchCsrfToken)

describe('WalletButtons', () => {
  beforeEach(() => mockedCsrf.mockReset())

  it('shows both ready providers on desktop for a rewards member', () => {
    render(<WalletButtons track="REWARDS" wallet={{ apple: true, google: true }} />)
    expect(screen.getByRole('button', { name: 'Add to Apple Wallet' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Add to Google Wallet' })).toBeInTheDocument()
  })

  it('defensively hides wallet controls for partner accounts', () => {
    render(<WalletButtons track="PARTNER" wallet={{ apple: true, google: true }} />)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('shows an actionable error when secure link issuance cannot start', async () => {
    mockedCsrf.mockResolvedValue(null)
    render(<WalletButtons track="REWARDS" wallet={{ apple: true, google: false }} />)
    fireEvent.click(screen.getByRole('button', { name: 'Add to Apple Wallet' }))
    await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent('Could not open wallet'))
  })
})
