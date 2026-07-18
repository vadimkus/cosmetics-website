import { fireEvent, render, screen } from '@testing-library/react'
import ProductInfoAccordion from '@/components/product/ProductInfoAccordion'

jest.mock('@/hooks/useTranslation', () => ({
  useTranslation: () => ({ dir: 'ltr' }),
}))

describe('ProductInfoAccordion', () => {
  it('keeps closed content out of keyboard navigation and exposes open state', () => {
    const { container } = render(
      <ProductInfoAccordion title="Ingredients">
        <a href="/ingredients">Ingredient details</a>
      </ProductInfoAccordion>
    )

    const toggle = screen.getByRole('button', { name: 'Ingredients' })
    const panel = container.querySelector('.accordion-panel')

    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    expect(toggle).toHaveAttribute('aria-controls', panel?.id)
    expect(panel).toHaveAttribute('aria-labelledby', toggle.id)
    expect(panel).toHaveAttribute('aria-hidden', 'true')
    expect(panel).toHaveAttribute('inert')

    fireEvent.click(toggle)

    expect(toggle).toHaveAttribute('aria-expanded', 'true')
    expect(panel).toHaveAttribute('aria-hidden', 'false')
    expect(panel).not.toHaveAttribute('inert')
  })
})
