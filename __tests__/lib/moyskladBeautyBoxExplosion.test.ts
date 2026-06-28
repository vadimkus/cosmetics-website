import {
  explodeBeautyBoxItem,
  isBeautyBoxProductName,
  sumExplodedLinesAed,
} from '@/lib/moyskladBeautyBoxExplosion'

describe('moyskladBeautyBoxExplosion', () => {
  it('detects beauty box product names', () => {
    expect(isBeautyBoxProductName('DEEP MOISTURIZING BEAUTY BOX')).toBe(true)
    expect(isBeautyBoxProductName('Multi Vita Radiance Serum')).toBe(false)
  })

  it('explodes Deep Moisturizing box to 1120.30 AED after 15% discount', () => {
    const lines = explodeBeautyBoxItem({
      productName: 'DEEP MOISTURIZING BEAUTY BOX',
      quantity: 1,
    })
    expect(lines).toHaveLength(5)
    expect(sumExplodedLinesAed(lines)).toBeCloseTo(1120.3, 1)
  })

  it('matches Liudmila Stepanova GENCardM2606211312 cart total', () => {
    const boxLines = explodeBeautyBoxItem({
      productName: 'DEEP MOISTURIZING BEAUTY BOX',
      quantity: 1,
    })
    const otherTotal =
      300 + // BB Cushion Beige
      160 // Microbiome Mist
    const total = sumExplodedLinesAed(boxLines) + otherTotal
    expect(total).toBeCloseTo(1580.3, 1)
  })
})
