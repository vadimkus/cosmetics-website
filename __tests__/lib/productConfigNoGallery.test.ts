import { PRODUCT_CONFIG } from '@/data/productConfig'

// A config gallery overrides the DB `images` field in the mobile API, so a
// product whose DB gallery was replaced kept showing the old slides in the app
// (product 40, Sep 2026). Galleries live in the DB only.
describe('productConfig', () => {
  it('defines no image galleries', () => {
    const withGallery = Object.entries(PRODUCT_CONFIG)
      .filter(([, config]) => 'images' in config)
      .map(([id]) => id)
    expect(withGallery).toEqual([])
  })
})
