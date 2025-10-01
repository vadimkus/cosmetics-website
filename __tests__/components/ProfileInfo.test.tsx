import { render, screen } from '@testing-library/react'
import ProfileInfo from '@/components/profile/ProfileInfo'

const mockUser = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  phone: '1234567890',
  address: '123 Main St',
  birthday: '1990-01-01',
  isAdmin: false,
  canSeePrices: true,
  discountType: 'VIP',
  discountPercentage: 10,
  createdAt: '2023-01-01T00:00:00Z'
}

describe('ProfileInfo', () => {
  it('renders user information correctly', () => {
    render(<ProfileInfo user={mockUser} />)
    
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('john@example.com')).toBeInTheDocument()
    expect(screen.getByText('1234567890')).toBeInTheDocument()
    expect(screen.getByText('123 Main St')).toBeInTheDocument()
  })

  it('displays membership level correctly for VIP user', () => {
    render(<ProfileInfo user={mockUser} />)
    
    expect(screen.getByText('VIP')).toBeInTheDocument()
    expect(screen.getByText('10% VIP')).toBeInTheDocument()
  })

  it('displays membership level correctly for admin user', () => {
    const adminUser = { ...mockUser, isAdmin: true, discountPercentage: 0 }
    render(<ProfileInfo user={adminUser} />)
    
    expect(screen.getByText('Admin')).toBeInTheDocument()
  })

  it('displays membership level correctly for standard user', () => {
    const standardUser = { ...mockUser, isAdmin: false, discountPercentage: 0 }
    render(<ProfileInfo user={standardUser} />)
    
    expect(screen.getByText('Standard')).toBeInTheDocument()
  })

  it('shows price visibility status', () => {
    render(<ProfileInfo user={mockUser} />)
    
    expect(screen.getByText('Enabled')).toBeInTheDocument()
  })

  it('shows disabled price visibility status', () => {
    const userWithoutPrices = { ...mockUser, canSeePrices: false }
    render(<ProfileInfo user={userWithoutPrices} />)
    
    expect(screen.getByText('Disabled')).toBeInTheDocument()
  })

  it('displays account features section', () => {
    render(<ProfileInfo user={mockUser} />)
    
    expect(screen.getByText('Account Features')).toBeInTheDocument()
    expect(screen.getByText('Secure Account')).toBeInTheDocument()
    expect(screen.getByText('Premium Access')).toBeInTheDocument()
    expect(screen.getByText('Loyalty Program')).toBeInTheDocument()
    expect(screen.getByText('Favorites')).toBeInTheDocument()
  })

  it('handles missing optional fields gracefully', () => {
    const userWithMissingFields = {
      ...mockUser,
      phone: undefined,
      address: undefined,
      birthday: undefined
    }
    
    render(<ProfileInfo user={userWithMissingFields} />)
    
    expect(screen.getByText('Not provided')).toBeInTheDocument()
  })

  it('formats birthday correctly', () => {
    render(<ProfileInfo user={mockUser} />)
    
    // The birthday should be formatted according to the locale
    expect(screen.getByText(/Jan.*1990/)).toBeInTheDocument()
  })

  it('displays member since date correctly', () => {
    render(<ProfileInfo user={mockUser} />)
    
    expect(screen.getByText(/Jan.*2023/)).toBeInTheDocument()
  })
})



