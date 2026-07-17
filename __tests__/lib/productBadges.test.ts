import {
  isNewLaunchProduct,
  isNewCategoryFilterId,
  isNewCategoryDisplayName,
  NEW_LAUNCH_PRODUCT_IDS,
  NEW_CATEGORY_FILTER_IDS,
  NEW_CATEGORY_DISPLAY_NAMES,
} from '@/lib/productBadges'

describe('productBadges', () => {
  it('marks only configured launch products as new', () => {
    expect(isNewLaunchProduct('63')).toBe(true)
    expect(isNewLaunchProduct('cuid', '66')).toBe(true)
    expect(isNewLaunchProduct('10')).toBe(false)
    expect(isNewLaunchProduct(null)).toBe(false)
  })

  it('does not badge stale category filters (cream / cleanser / skin-concern)', () => {
    expect(isNewCategoryFilterId('cream')).toBe(false)
    expect(isNewCategoryFilterId('cleanser')).toBe(false)
    expect(isNewCategoryFilterId('skin-concern')).toBe(false)
    expect(isNewCategoryFilterId('beauty-boxes')).toBe(false)
    expect(isNewCategoryFilterId('bio-meso')).toBe(false)
  })

  it('keeps category badge lists empty by default', () => {
    expect(NEW_CATEGORY_FILTER_IDS).toEqual([])
    expect(NEW_CATEGORY_DISPLAY_NAMES).toEqual([])
    expect(NEW_LAUNCH_PRODUCT_IDS.length).toBeGreaterThan(0)
    expect(isNewCategoryDisplayName('Cream')).toBe(false)
  })
})
