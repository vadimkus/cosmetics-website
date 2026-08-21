import fs from 'node:fs'
import path from 'node:path'

describe('Cart empty state', () => {
  it('uses the same transparent unicorn treatment as favorites', () => {
    const cart = fs.readFileSync(
      path.join(process.cwd(), 'app/cart/CartClient.tsx'),
      'utf8'
    )
    const favorites = fs.readFileSync(
      path.join(process.cwd(), 'app/favorites/FavoritesClient.tsx'),
      'utf8'
    )

    expect(cart).toContain('src="/images/avatar/uni-transparent.png"')
    expect(favorites).toContain('src="/images/avatar/uni-transparent.png"')
  })
})
