import {
  filterProductsBySearch,
  getProductSearchRelevance,
} from '@/lib/productSearch'
import type { Product } from '@/types'

const product = (
  id: string,
  name: string,
  category: string,
  description = ''
): Product =>
  ({
    id,
    name,
    category,
    description,
    image: '/images/test.jpg',
    price: 100,
    inStock: true,
  }) as Product

describe('product search relevance', () => {
  const hyaluronCream = product(
    '29',
    'MOISTURE REPLENISHING HYALURON CREAM',
    'Cream'
  )
  const hyaluronSerum = product(
    '18',
    'MOISTURE REPLENISHING HYALURON SERUM',
    'Serum'
  )
  const beautyBox = product(
    '59',
    'DEEP MOISTURIZING BEAUTY BOX',
    'Beauty Boxes',
    'Includes Hyaluron Cream and other products.'
  )
  const soothingCream = product(
    '28',
    'INTENSIVE HYDRO SOOTHING CREAM',
    'Cream',
    'A moisturizer with hyaluron complex.'
  )

  it('ranks direct name matches above description-only matches', () => {
    const results = filterProductsBySearch(
      [beautyBox, soothingCream, hyaluronCream, hyaluronSerum],
      'hyaluron'
    )

    expect(results.map(item => item.id)).toEqual(['29', '18', '59', '28'])
  })

  it('puts the exact multi-token product intent first', () => {
    const results = filterProductsBySearch(
      [beautyBox, hyaluronSerum, soothingCream, hyaluronCream],
      'hyaluron cream'
    )

    expect(results[0]?.id).toBe('29')
  })

  it('scores name matches higher than bundle descriptions', () => {
    expect(getProductSearchRelevance(hyaluronCream, 'hyaluron')).toBeGreaterThan(
      getProductSearchRelevance(beautyBox, 'hyaluron')
    )
  })
})
