import { render, screen, fireEvent } from '@testing-library/react'
import ProfileTabs from '@/components/profile/ProfileTabs'

describe('ProfileTabs', () => {
  const mockOnTabChange = jest.fn()

  beforeEach(() => {
    mockOnTabChange.mockClear()
  })

  it('renders all tabs correctly', () => {
    render(<ProfileTabs activeTab="profile" onTabChange={mockOnTabChange} />)
    
    expect(screen.getByText('Profile')).toBeInTheDocument()
    expect(screen.getByText('Orders')).toBeInTheDocument()
    expect(screen.getByText('Settings')).toBeInTheDocument()
    expect(screen.getByText('Downloads')).toBeInTheDocument()
  })

  it('calls onTabChange when a tab is clicked', () => {
    render(<ProfileTabs activeTab="profile" onTabChange={mockOnTabChange} />)
    
    fireEvent.click(screen.getByText('Orders'))
    expect(mockOnTabChange).toHaveBeenCalledWith('orders')
  })

  it('applies active styles to the current tab', () => {
    render(<ProfileTabs activeTab="orders" onTabChange={mockOnTabChange} />)
    
    const ordersTab = screen.getByText('Orders').closest('button')
    expect(ordersTab).toHaveClass('border-primary-600', 'text-primary-600', 'bg-primary-50')
  })

  it('applies inactive styles to non-active tabs', () => {
    render(<ProfileTabs activeTab="profile" onTabChange={mockOnTabChange} />)
    
    const ordersTab = screen.getByText('Orders').closest('button')
    expect(ordersTab).toHaveClass('border-transparent', 'text-gray-600')
  })

  it('handles tab switching correctly', () => {
    const { rerender } = render(<ProfileTabs activeTab="profile" onTabChange={mockOnTabChange} />)
    
    // Initially profile should be active
    expect(screen.getByText('Profile').closest('button')).toHaveClass('border-primary-600')
    
    // Switch to orders
    rerender(<ProfileTabs activeTab="orders" onTabChange={mockOnTabChange} />)
    expect(screen.getByText('Orders').closest('button')).toHaveClass('border-primary-600')
  })
})



