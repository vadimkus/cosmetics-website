import fs from 'fs'
import path from 'path'

import { cardVideoEntries, cardVideoFor } from '@/lib/productCardVideos'

const PUBLIC = path.join(process.cwd(), 'public')
const MAPPED = cardVideoEntries()

describe('product card hover videos', () => {
  it('maps the three pilot masks', () => {
    expect(cardVideoFor('/images/collagen_campaign/main-v2.jpg')).toBe('/videos/cards/53-v1.mp4')
    expect(cardVideoFor('/images/seaalgae_campaign/main.jpg')).toBe('/videos/cards/36-v1.mp4')
    expect(cardVideoFor('/images/peptide_campaign/main-v2.jpg')).toBe('/videos/cards/37-v1.mp4')
  })

  it.each(MAPPED)('%s maps to an existing, light clip', (image, video) => {
    expect(cardVideoFor(image)).toBe(video)
    expect(fs.existsSync(path.join(PUBLIC, image))).toBe(true)
    const file = path.join(PUBLIC, video)
    expect(fs.existsSync(file)).toBe(true)
    expect(fs.statSync(file).size).toBeLessThan(400 * 1024)
  })

  it('gives every clip its own file', () => {
    const videos = MAPPED.map(([, v]) => v)
    expect(new Set(videos).size).toBe(videos.length)
  })

  it('returns null for unmapped or missing images', () => {
    expect(cardVideoFor('/images/not-a-card/main.jpg')).toBeNull()
    expect(cardVideoFor(null)).toBeNull()
    expect(cardVideoFor(undefined)).toBeNull()
  })

  it('ships clips without CapCut, C2PA or encoder tags', () => {
    for (const [, video] of MAPPED) {
      const data = fs.readFileSync(path.join(PUBLIC, video))
      for (const tag of ['c2pa', 'jumb', 'CapCut', 'Lavf', 'x264', 'Lavc']) {
        expect(data.includes(Buffer.from(tag))).toBe(false)
      }
    }
  })
})
