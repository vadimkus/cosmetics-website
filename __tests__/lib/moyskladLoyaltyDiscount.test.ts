import { applyLoyaltyDiscountToPositions } from '@/lib/moysklad'

describe('applyLoyaltyDiscountToPositions', () => {
  it('distributes loyalty AED across paid lines so merchandise + shipping matches website total', () => {
    const positions = [
      { quantity: 1, price: 40000 }, // PDRN mask pack
      { quantity: 1, price: 16000 }, // mist
      { quantity: 1, price: 8000, discount: 100 }, // free promo collagen
    ]

    applyLoyaltyDiscountToPositions(positions, 70)

    const merch = positions.reduce((sum, p) => {
      const d = p.discount ?? 0
      return sum + (p.quantity * p.price * (100 - d)) / 10000
    }, 0)

    expect(merch).toBeCloseTo(490, 2) // 560 − 70
    expect(positions[2].discount).toBe(100)
    expect(merch + 45).toBeCloseTo(535, 2)
  })
})
