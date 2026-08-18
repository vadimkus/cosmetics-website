import { render, screen, fireEvent } from '@testing-library/react'
import ProfileTabs from '@/components/profile/ProfileTabs'

describe('ProfileTabs', () => {
  const mockSetActiveTab = jest.fn()

  beforeEach(() => {
    mockSetActiveTab.mockClear()
  })

  it('renders all tabs correctly', () => {
    render(<ProfileTabs activeTab="profile" setActiveTab={mockSetActiveTab} />)
    
    expect(screen.getByText('Profile')).toBeInTheDocument()
    expect(screen.getByText('Orders')).toBeInTheDocument()
    expect(screen.getByText('Settings')).toBeInTheDocument()
    expect(screen.getByText('Downloads')).toBeInTheDocument()
  })

  it('calls setActiveTab when a tab is clicked', () => {
    render(<ProfileTabs activeTab="profile" setActiveTab={mockSetActiveTab} />)
    
    fireEvent.click(screen.getByText('Orders'))
    expect(mockSetActiveTab).toHaveBeenCalledWith('orders')
  })

  it('applies active styles to the current tab', () => {
    render(<ProfileTabs activeTab="orders" setActiveTab={mockSetActiveTab} />)
    
    const ordersTab = screen.getByText('Orders').closest('button')
    expect(ordersTab).toHaveClass('border-[var(--cera-rose)]', 'text-[var(--cera-rose-ink)]')
  })

  it('applies inactive styles to non-active tabs', () => {
    render(<ProfileTabs activeTab="profile" setActiveTab={mockSetActiveTab} />)
    
    const ordersTab = screen.getByText('Orders').closest('button')
    expect(ordersTab).toHaveClass('border-transparent', 'text-[var(--cera-muted)]')
  })

  it('handles tab switching correctly', () => {
    const { rerender } = render(<ProfileTabs activeTab="profile" setActiveTab={mockSetActiveTab} />)
    
    // Initially profile should be active
    expect(screen.getByText('Profile').closest('button')).toHaveClass('border-[var(--cera-rose)]')
    
    // Switch to orders
    rerender(<ProfileTabs activeTab="orders" setActiveTab={mockSetActiveTab} />)
    expect(screen.getByText('Orders').closest('button')).toHaveClass('border-[var(--cera-rose)]')
  })
})











