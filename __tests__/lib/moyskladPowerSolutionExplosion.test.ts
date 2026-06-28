import {
  explodePowerSolutionBoxItem,
  isPowerSolutionBoxProductName,
  sumExplodedPowerSolutionLinesAed,
} from '@/lib/moyskladPowerSolutionExplosion'

describe('moyskladPowerSolutionExplosion', () => {
  it('detects Power Solution box product names', () => {
    expect(isPowerSolutionBoxProductName('POWER SOLUTION SWS')).toBe(true)
    expect(isPowerSolutionBoxProductName('POWER SOLUTION HES')).toBe(true)
    expect(isPowerSolutionBoxProductName('Multi Vita Radiance Serum')).toBe(false)
  })

  it('explodes 1 SWS box to 10 vials at 58 AED each (580 box retail)', () => {
    const lines = explodePowerSolutionBoxItem({
      productName: 'POWER SOLUTION SWS',
      quantity: 1,
      price: 580,
      retailPrice: 580,
    })
    expect(lines).toHaveLength(1)
    expect(lines[0]?.productName).toBe('POWER SOLUTION SWS 1 VIAL 2ML')
    expect(lines[0]?.quantity).toBe(10)
    expect(lines[0]?.retailPrice).toBe(58)
    expect(sumExplodedPowerSolutionLinesAed(lines)).toBe(580)
  })

  it('matches Hamza Ahmed order Power Solution lines (2 boxes = 1160 AED)', () => {
    const sws = explodePowerSolutionBoxItem({
      productName: 'POWER SOLUTION SWS',
      quantity: 1,
      price: 580,
    })
    const hes = explodePowerSolutionBoxItem({
      productName: 'POWER SOLUTION HES',
      quantity: 1,
      price: 580,
    })
    const total = sumExplodedPowerSolutionLinesAed(sws) + sumExplodedPowerSolutionLinesAed(hes)
    expect(total).toBe(1160)
  })
})
