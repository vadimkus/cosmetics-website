import { render, screen } from '@testing-library/react'
import CheckoutProgress from '@/components/checkout/CheckoutProgress'

describe('CheckoutProgress', () => {
  it('marks the active checkout step and exposes all three labels', () => {
    render(<CheckoutProgress currentStep="checkout" locale="en" />)

    expect(screen.getByRole('navigation', { name: 'Checkout progress' })).toBeInTheDocument()
    expect(screen.getByText('Step 2 of 3')).toBeInTheDocument()
    expect(screen.getByText('Cart')).toBeInTheDocument()
    expect(screen.getByText('Details & payment').closest('li')).toHaveAttribute(
      'aria-current',
      'step'
    )
    expect(screen.getByText('Confirmation')).toBeInTheDocument()
  })

  it('allows returning to the cart only from checkout', () => {
    const { rerender } = render(
      <CheckoutProgress currentStep="checkout" locale="en" />
    )
    expect(screen.getByRole('link', { name: /Cart/ })).toHaveAttribute('href', '/cart')

    rerender(<CheckoutProgress currentStep="confirmed" locale="en" />)
    expect(screen.queryByRole('link', { name: /Cart/ })).not.toBeInTheDocument()
  })

  it('localizes Arabic labels and direction', () => {
    render(<CheckoutProgress currentStep="cart" locale="ar" />)

    const progress = screen.getByRole('navigation', { name: 'مراحل إتمام الطلب' })
    expect(progress).toHaveAttribute('dir', 'rtl')
    expect(screen.getByText('السلة')).toBeInTheDocument()
    expect(screen.getByText('البيانات والدفع')).toBeInTheDocument()
  })
})
