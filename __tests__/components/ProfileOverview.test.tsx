import { fireEvent, render, screen } from '@testing-library/react'
import ProfileOverview from '@/components/profile/desktop/ProfileOverview'
import { useFavorites } from '@/components/FavoritesProvider'
import { useTranslation } from '@/hooks/useTranslation'

jest.mock('next/image', () => ({
  __esModule: true,
  // eslint-disable-next-line @next/next/no-img-element
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => <img {...props} alt={props.alt || ''} />,
}))
jest.mock('@/components/profile/MembershipCard', () => () => <div data-testid="membership-card">Rewards</div>)
jest.mock('@/components/FavoritesProvider', () => ({ useFavorites: jest.fn() }))
jest.mock('@/hooks/useTranslation', () => ({ useTranslation: jest.fn() }))

const mockedFavorites = jest.mocked(useFavorites)
const mockedTranslation = jest.mocked(useTranslation)

const copy: Record<string, string> = {
  'profile.welcomeBack': 'Welcome back',
  'profile.welcomeDescription': 'Account summary',
  'profile.recentOrder': 'Recent order',
  'profile.orderActivity': 'Latest activity',
  'profile.viewAllOrders': 'View all',
  'profile.order': 'Order',
  'profile.trackOrder': 'Track order',
  'profile.items': 'items',
  'profile.noOrdersYet': 'No orders yet',
  'profile.noOrdersDescription': 'Your first order will appear here.',
  'profile.browseProducts': 'Browse products',
  'profile.savedFavorites': 'Favorites',
  'profile.favoritesDescription': 'Saved products',
  'profile.shipping': 'Shipping',
  'profile.manageAddresses': 'Manage delivery details',
  'profile.billing': 'Billing',
  'profile.manageBilling': 'Manage billing',
  'profile.beautyProfile': 'Beauty profile',
  'profile.skinAnalysis': 'AI skin analysis',
  'profile.skinAnalysisDescription': 'Personalized routine',
  'profile.startSkinAnalysis': 'Start analysis',
  'profile.needHelp': 'Need help?',
  'profile.supportDescription': 'WhatsApp support',
  'profile.documents': 'Documents',
  'profile.documentsDescription': 'Product resources',
}

const user = {
  id: 'user-1',
  name: 'Test Customer',
  email: 'customer@example.com',
  createdAt: '2026-01-01T00:00:00.000Z',
}

describe('ProfileOverview', () => {
  beforeEach(() => {
    mockedTranslation.mockReturnValue({
      t: (key: string) => copy[key] || key,
      locale: 'en',
      dir: 'ltr',
    } as ReturnType<typeof useTranslation>)
    mockedFavorites.mockReturnValue({
      favorites: [{ id: '1' }, { id: '2' }],
    } as ReturnType<typeof useFavorites>)
  })

  it('renders empty order and favorites states with working destinations', () => {
    render(
      <ProfileOverview user={user} orders={[]} loadingOrders={false} onStartSkinAnalysis={jest.fn()} />
    )

    expect(screen.getByText('No orders yet')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Browse products' })).toHaveAttribute('href', '/products')
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /favorites/i })).toHaveAttribute('href', '/favorites')
    expect(screen.getByTestId('membership-card')).toBeInTheDocument()
  })

  it('uses the newest order and exposes its tracking link', () => {
    const order = {
      id: 'order-id',
      orderNumber: 'ORD-100',
      createdAt: new Date('2026-07-18T12:00:00.000Z'),
      status: 'shipped',
      total: 420,
      items: [
        {
          id: 'item-1',
          productName: 'GENOSYS Serum',
          image: null,
          quantity: 2,
        },
      ],
    }

    render(
      <ProfileOverview
        user={user}
        orders={[order] as unknown as React.ComponentProps<typeof ProfileOverview>['orders']}
        loadingOrders={false}
        onStartSkinAnalysis={jest.fn()}
      />
    )

    expect(screen.getByText(/ORD-100/)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /track order/i })).toHaveAttribute('href', '/track/ORD-100')
    expect(screen.getByAltText('GENOSYS Serum')).toHaveAttribute('src', '/images/genosys-logo-transparent.png')
  })

  it('starts the real skin-analysis flow', () => {
    const onStart = jest.fn()
    render(
      <ProfileOverview user={user} orders={[]} loadingOrders={false} onStartSkinAnalysis={onStart} />
    )

    fireEvent.click(screen.getByRole('button', { name: 'Start analysis' }))
    expect(onStart).toHaveBeenCalledTimes(1)
  })
})
