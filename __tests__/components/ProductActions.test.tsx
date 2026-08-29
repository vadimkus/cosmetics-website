import { fireEvent, render, screen } from '@testing-library/react'
import type { ComponentProps } from 'react'
import ProductActions from '@/components/ProductCard/ProductActions'
import type { Product } from '@/types'
import type { User } from '@/types/user'

const user = { id: 'user', email: 'user@example.com' } as User
const baseProduct: Product = {
  id: 'simple',
  name: 'Simple Product',
  description: 'Test',
  image: '/images/test.jpg',
  category: 'Cream',
  price: 100,
  inStock: true,
  variants: [],
}

const t = (key: string) => {
  const labels: Record<string, string> = {
    'product.inBag': 'In Bag',
    'product.inCart': 'In Cart',
    'product.addToBag': 'Add to Bag',
    'product.addToCart': 'Add to Cart',
    'product.chooseOptions': 'Choose options',
    'product.adding': 'Adding...',
    'product.addedToBag': 'Added to Bag!',
    'product.viewBag': 'View Bag',
  }
  return labels[key] || key
}

function renderActions(
  product: Product,
  overrides: Partial<ComponentProps<typeof ProductActions>> = {},
) {
  const props: ComponentProps<typeof ProductActions> = {
    product,
    user,
    isAdding: false,
    inCartQty: 0,
    canAdjustInline: false,
    onAddToCart: jest.fn(),
    onIncrementCart: jest.fn(),
    onDecrementFromCart: jest.fn(),
    onOpenCart: jest.fn(),
    onChooseOptions: jest.fn(),
    onLoginClick: jest.fn(),
    t,
    ...overrides,
  }
  render(<ProductActions {...props} />)
  return props
}

describe('ProductActions option trigger', () => {
  it('opens the selector for a required size product', () => {
    const product = {
      ...baseProduct,
      id: 'cmr6dajor031ygfnm6rsjkicf',
      productNumber: '66',
      variants: [
        { id: '200', size: '200ml', color: null, price: 380, available: true, isDefault: true },
        { id: '600', size: '600ml', color: null, price: 620, available: true, isDefault: false },
      ],
    }
    const props = renderActions(product)

    fireEvent.click(screen.getByRole('button', { name: /Choose options/ }))
    expect(props.onChooseOptions).toHaveBeenCalledTimes(1)
    expect(props.onAddToCart).not.toHaveBeenCalled()
  })

  it('keeps a no-option product on one-tap add', () => {
    const props = renderActions(baseProduct)

    fireEvent.click(screen.getByRole('button', { name: /Add to Bag/ }))
    expect(props.onAddToCart).toHaveBeenCalledTimes(1)
    expect(props.onChooseOptions).not.toHaveBeenCalled()
  })
})
