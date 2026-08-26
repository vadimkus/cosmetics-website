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

  // Rebuilding a subset used to overwrite the build report with only the
  // products named on the command line, and the manifest is written from that
  // report. It shipped once holding a single product, which silently returns
  // every other packshot uncut. A gap in the numbering is the tell.
  it('covers every product with no gaps', () => {
    const numbers = Object.values(getCutoutManifest())
      .map(path => Number(path.replace(/^.*\/(\d+)(?:-v\d+)?\.webp$/, '$1')))
      .sort((a, b) => a - b)

    expect(numbers.length).toBeGreaterThan(0)
    expect(new Set(numbers).size).toBe(numbers.length)
    expect(numbers[0]).toBe(1)
    expect(numbers[numbers.length - 1]).toBe(numbers.length)
  })

  it('every cut-out points into the generated folder', () => {
    const stray = Object.values(getCutoutManifest()).filter(
      path => !path.startsWith('/images/cutout/')
    )
    expect(stray).toEqual([])
  })
})
