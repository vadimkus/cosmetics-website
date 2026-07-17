import {
  explodePeptideGelMaskItem,
  isPeptideGelMaskPackProductName,
  PEPTIDE_GEL_MASK_SINGLE_PRODUCT_NAME,
  sumExplodedPeptideGelMaskLinesAed,
} from '@/lib/moyskladPeptideGelMaskExplosion'

describe('moyskladPeptideGelMaskExplosion', () => {
  it('detects pack product names only', () => {
    expect(isPeptideGelMaskPackProductName('PEPTIDE GEL MASK')).toBe(true)
    expect(isPeptideGelMaskPackProductName('Peptide Gel Mask')).toBe(true)
    expect(isPeptideGelMaskPackProductName('EyeCell EYE PEPTIDE GEL PATCH')).toBe(false)
    expect(isPeptideGelMaskPackProductName(PEPTIDE_GEL_MASK_SINGLE_PRODUCT_NAME)).toBe(false)
  })

  it('explodes clinic pack 190 AED → 5 × 38 AED', () => {
    const lines = explodePeptideGelMaskItem({
      productName: 'PEPTIDE GEL MASK',
      quantity: 1,
      price: 190,
      retailPrice: 190,
    })
    expect(lines).toHaveLength(1)
    expect(lines[0]?.productName).toBe(PEPTIDE_GEL_MASK_SINGLE_PRODUCT_NAME)
    expect(lines[0]?.quantity).toBe(5)
    expect(lines[0]?.retailPrice).toBe(38)
    expect(sumExplodedPeptideGelMaskLinesAed(lines)).toBe(190)
  })

  it('explodes retail pack 380 AED → 5 × 76 AED', () => {
    const lines = explodePeptideGelMaskItem({
      productName: 'PEPTIDE GEL MASK',
      quantity: 2,
      price: 380,
      retailPrice: 380,
    })
    expect(lines[0]?.quantity).toBe(10)
    expect(lines[0]?.retailPrice).toBe(76)
    expect(sumExplodedPeptideGelMaskLinesAed(lines)).toBe(760)
  })
})
