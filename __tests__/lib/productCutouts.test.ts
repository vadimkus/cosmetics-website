import { existsSync } from 'fs'
import { join } from 'path'

import { cutoutImage, hasCutout, getCutoutManifest } from '@/lib/productCutouts'

describe('product cut-outs', () => {
  it('leaves an image with no cut-out alone', () => {
    // Infographic slides must never be swapped: they are pictures of text, and
    // a foreground mask would cut the headline off the card.
    expect(cutoutImage('/images/bio_ferment2/s3.jpeg')).toBe('/images/bio_ferment2/s3.jpeg')
    expect(hasCutout('/images/bio_ferment2/s3.jpeg')).toBe(false)
  })

  it('survives an empty path', () => {
    expect(cutoutImage('')).toBe('')
    expect(hasCutout('')).toBe(false)
  })

  it('maps a packshot to its cut-out', () => {
    const first = Object.entries(getCutoutManifest())[0]
    expect(first).toBeDefined()
    const [source, cutout] = first!
    expect(cutoutImage(source)).toBe(cutout)
    expect(hasCutout(source)).toBe(true)
  })

  // A registered file that is not on disk would 404 in the hero of a product
  // page, which is the single most visible image on the site.
  it('every registered cut-out exists', () => {
    const missing = Object.values(getCutoutManifest()).filter(
      path => !existsSync(join(process.cwd(), 'public', path))
    )
    expect(missing).toEqual([])
  })

  it('every cut-out points into the generated folder', () => {
    const stray = Object.values(getCutoutManifest()).filter(
      path => !path.startsWith('/images/cutout/')
    )
    expect(stray).toEqual([])
  })
})
