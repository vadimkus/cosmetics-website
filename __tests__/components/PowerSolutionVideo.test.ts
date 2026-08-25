import fs from 'node:fs'
import path from 'node:path'

describe('Power Solution bespoke product video', () => {
  const source = fs.readFileSync(
    path.join(process.cwd(), 'components/product/powersolution/PowerSolutionProductPage.tsx'),
    'utf8'
  )

  it('renders the clip when the record carries one', () => {
    expect(source).toContain('{product.videoUrl ? (')
    expect(source).toContain('<video')
    expect(source).toContain('src={product.videoUrl}')
  })

  it('labels the clip as a product video, not a tutorial', () => {
    expect(source).toContain("t('product.watchVideo')")
    expect(source).not.toContain("t('product.watchHowToUse')")
  })

  it('ships the asset the SWS record points at', () => {
    expect(fs.existsSync(path.join(process.cwd(), 'public/videos/sws_v.mp4'))).toBe(true)
  })
})
