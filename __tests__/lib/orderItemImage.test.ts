import { canonicalOrderItemImage } from '@/lib/orderItemImage'

describe('canonicalOrderItemImage', () => {
  it('uses the current server catalog image', () => {
    expect(canonicalOrderItemImage({ image: '/images/current/main.jpeg' })).toBe(
      '/images/current/main.jpeg',
    )
  })

  it('never needs a client/cart image fallback', () => {
    expect(canonicalOrderItemImage({ image: '  /images/current/main.jpeg  ' })).toBe(
      '/images/current/main.jpeg',
    )
  })

  it('uses a stable fallback when the catalog image is empty', () => {
    expect(canonicalOrderItemImage({ image: '' })).toBe('/images/genosys-logo-transparent.png')
    expect(canonicalOrderItemImage(undefined)).toBe('/images/genosys-logo-transparent.png')
  })
})
