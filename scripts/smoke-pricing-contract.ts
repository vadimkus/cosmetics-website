import { Product } from '../types'
import { ApiUser } from '../types/user'
import { generateEnhancedProductData } from '../lib/pricingEngine'
import { buildPricingContract } from '../lib/pricingContract'

const createProduct = (overrides: Partial<Product> = {}): Product => ({
  id: 'smoke-product-1',
  productNumber: '1',
  name: 'Smoke Product',
  image: '/smoke.jpg',
  price: 100,
  category: 'Serums',
  description: 'Smoke test product',
  inStock: true,
  rating: 5,
  ...overrides,
})

const discountedUser: ApiUser = {
  id: 'smoke-user-1',
  email: 'smoke@example.com',
  name: 'Smoke User',
  canSeePrices: true,
  discountType: 'percentage',
  discountPercentage: 10,
}

const scenarios: Array<{
  name: string
  product: Product
  user: ApiUser | null
}> = [
  {
    name: 'guest retail',
    product: createProduct({ price: 125 }),
    user: null,
  },
  {
    name: 'logged-in user discount',
    product: createProduct({ price: 200 }),
    user: discountedUser,
  },
  {
    name: 'beauty box bundle discount',
    product: createProduct({
      productNumber: '55',
      category: 'Beauty Boxes',
      price: 1120,
    }),
    user: discountedUser,
  },
  {
    name: 'default database variant',
    product: createProduct({
      price: 100,
      variants: [
        {
          id: 'variant-50',
          size: '50ml',
          color: null,
          price: 150,
          available: true,
          isDefault: true,
          stockQuantity: 8,
        },
        {
          id: 'variant-100',
          size: '100ml',
          color: null,
          price: 250,
          available: true,
          isDefault: false,
          stockQuantity: 4,
        },
      ],
    }),
    user: null,
  },
]

function assertEqual(scenario: string, field: string, actual: unknown, expected: unknown) {
  if (actual !== expected) {
    throw new Error(`${scenario}: ${field} mismatch. Expected ${expected}, received ${actual}`)
  }
}

for (const scenario of scenarios) {
  const enhanced = generateEnhancedProductData(scenario.product, scenario.user)
  const pricing = buildPricingContract(scenario.product, scenario.user)

  assertEqual(scenario.name, 'basePrice', pricing.basePrice, enhanced.price)
  assertEqual(scenario.name, 'displayPrice', pricing.displayPrice, enhanced.displayPrice)
  assertEqual(scenario.name, 'unitPrice', pricing.unitPrice, enhanced.displayPrice)
  assertEqual(scenario.name, 'originalPrice', pricing.originalPrice, enhanced.originalPrice ?? null)

  console.log(
    `[pricing-contract] ${scenario.name}: AED ${pricing.displayPrice} (${pricing.discountType}, canSeePrice=${pricing.canSeePrice})`
  )
}

console.log(`[pricing-contract] ${scenarios.length} parity scenarios passed`)
