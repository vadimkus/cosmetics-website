import fs from 'node:fs'
import path from 'node:path'

describe('Collagen mask bespoke product video', () => {
  it('renders the database videoUrl instead of only loading it into page data', () => {
    const source = fs.readFileSync(
      path.join(process.cwd(), 'components/product/collagenmask/CollagenMaskProductPage.tsx'),
      'utf8'
    )

    expect(source).toContain('{product.videoUrl ? (')
    expect(source).toContain('<video')
    expect(source).toContain('src={product.videoUrl}')
  })
})
