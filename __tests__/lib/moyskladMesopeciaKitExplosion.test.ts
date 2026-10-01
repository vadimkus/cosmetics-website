import {
  explodeMesopeciaKitItem,
  isMesopeciaKitProductName,
  sumExplodedMesopeciaKitLinesAed,
} from '@/lib/moyskladMesopeciaKitExplosion'

describe('moyskladMesopeciaKitExplosion', () => {
  it('matches the new kit only, not the retired HR³ MATRIX kit', () => {
    expect(isMesopeciaKitProductName('MESOPECIA KIT')).toBe(true)
    expect(isMesopeciaKitProductName('Mesopecia Kit (GIFT)')).toBe(true)
    expect(isMesopeciaKitProductName('HR³ MATRIX MESOPECIA KIT')).toBe(false)
  })

  it('splits 1,100 AED into stamp, solution and peeling that add up exactly', () => {
    const lines = explodeMesopeciaKitItem({ productName: 'MESOPECIA KIT', quantity: 2, price: 1100 })
    expect(lines.map(l => [l.productName, l.size ?? null, l.quantity])).toEqual([
      ['Microneedle Stamp', '0.25mm', 2],
      ['HR³ MATRIX HAIR SOLUTION α', null, 2],
      ['HR³ MATRIX SCALP PEELING α', null, 2],
    ])
    expect(lines.reduce((sum, l) => sum + l.retailPrice, 0)).toBeCloseTo(1100, 2)
    expect(sumExplodedMesopeciaKitLinesAed(lines)).toBeCloseTo(2200, 2)
  })

  it('carries the kit line discount to every component', () => {
    const lines = explodeMesopeciaKitItem({
      productName: 'MESOPECIA KIT',
      quantity: 1,
      price: 990,
      retailPrice: 1100,
      discountPercent: 10,
    })
    expect(lines.every(l => l.discountPercent === 10)).toBe(true)
    expect(sumExplodedMesopeciaKitLinesAed(lines)).toBeCloseTo(990, 2)
  })
})
