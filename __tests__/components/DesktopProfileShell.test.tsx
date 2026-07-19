import { render, screen } from '@testing-library/react'
import DesktopProfileShell from '@/components/profile/desktop/DesktopProfileShell'
import { useTranslation } from '@/hooks/useTranslation'
import { useMembershipData } from '@/hooks/useMembershipData'

jest.mock('next/image', () => ({
  __esModule: true,
  // eslint-disable-next-line @next/next/no-img-element
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => <img {...props} alt={props.alt || ''} />,
}))

jest.mock('@/hooks/useTranslation', () => ({ useTranslation: jest.fn() }))
jest.mock('@/hooks/useMembershipData', () => ({ useMembershipData: jest.fn() }))

const mockedTranslation = jest.mocked(useTranslation)
const mockedMembership = jest.mocked(useMembershipData)

const labels: Record<string, string> = {
  'profile.accountNavigation': 'Account navigation',
  'profile.myAccount': 'My account',
  'profile.overview': 'Overview',
  'profile.orders': 'Orders',
  'profile.personalDetails': 'Personal details',
  'profile.savedFavorites': 'Favorites',
  'profile.shippingAddresses': 'Shipping addresses',
  'profile.billing': 'Billing',
  'profile.securityAndPrivacy': 'Security & privacy',
  'profile.documents': 'Documents',
  'profile.partnerPortal': 'Partner Portal',
  'profile.signOut': 'Sign out',
  'profile.overviewDescription': 'Account essentials.',
}

const user = {
  id: 'user-1',
  name: 'Test Customer',
  email: 'customer@example.com',
  createdAt: '2026-01-01T00:00:00.000Z',
}

function setLocale(dir: 'ltr' | 'rtl' = 'ltr') {
  mockedTranslation.mockReturnValue({
    t: (key: string) => labels[key] || key,
    locale: dir === 'rtl' ? 'ar' : 'en',
    dir,
  } as ReturnType<typeof useTranslation>)
}

describe('DesktopProfileShell', () => {
  beforeEach(() => {
    setLocale()
    mockedMembership.mockReturnValue({
      data: {
        success: true,
        track: 'REWARDS',
        memberNumber: 'GNS-00123-AE',
      },
      loading: false,
    })
  })

  it('renders URL-backed navigation and marks the active view', () => {
    render(
      <DesktopProfileShell
        user={user}
        activeTab="orders"
        orderCount={3}
        favoritesCount={2}
        onLogout={jest.fn()}
      >
        <p>Order content</p>
      </DesktopProfileShell>
    )

    expect(screen.getByRole('link', { name: /orders/i })).toHaveAttribute('href', '/profile?tab=orders')
    expect(screen.getByRole('link', { name: /orders/i })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('link', { name: /favorites/i })).toHaveAttribute('href', '/profile?tab=favorites')
    expect(screen.getByRole('link', { name: /shipping addresses/i })).toHaveAttribute('href', '/profile?tab=addresses')
    expect(screen.getByRole('link', { name: /^billing$/i })).toHaveAttribute('href', '/profile?tab=billing')
    expect(screen.getByText('Order content')).toBeInTheDocument()
  })

  it('shows the real membership number and no device-local counter', () => {
    render(
      <DesktopProfileShell user={user} activeTab="overview" orderCount={0} favoritesCount={0} onLogout={jest.fn()}>
        <span />
      </DesktopProfileShell>
    )

    expect(screen.getByText('GNS-00123-AE')).toBeInTheDocument()
    expect(screen.queryByText(/^#\d+$/)).not.toBeInTheDocument()
  })

  it('only exposes Partner Portal to eligible accounts', () => {
    const { rerender } = render(
      <DesktopProfileShell user={user} activeTab="overview" orderCount={0} favoritesCount={0} onLogout={jest.fn()}>
        <span />
      </DesktopProfileShell>
    )
    expect(screen.queryByRole('link', { name: 'Partner Portal' })).not.toBeInTheDocument()

    rerender(
      <DesktopProfileShell
        user={{ ...user, partnerPortalAccess: true }}
        activeTab="overview"
        orderCount={0}
        favoritesCount={0}
        onLogout={jest.fn()}
      >
        <span />
      </DesktopProfileShell>
    )
    expect(screen.getByRole('link', { name: 'Partner Portal' })).toHaveAttribute('href', '/partner-portal')
  })

  it('applies RTL direction for Arabic', () => {
    setLocale('rtl')
    const { container } = render(
      <DesktopProfileShell user={user} activeTab="overview" orderCount={0} favoritesCount={0} onLogout={jest.fn()}>
        <span />
      </DesktopProfileShell>
    )

    expect(container.firstChild).toHaveAttribute('dir', 'rtl')
    expect(screen.getByRole('link', { name: /overview/i })).toHaveAttribute('href', '/ar/profile?tab=overview')
  })
})
