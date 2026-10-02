import fs from 'fs'
import path from 'path'

import { cardVideoFor } from '@/lib/productCardVideos'

const PUBLIC = path.join(process.cwd(), 'public')
const MAPPED: Array<[string, string]> = [
  ['/images/collagen_campaign/main-v2.jpg', '/videos/cards/53-v1.mp4'],
  ['/images/seaalgae_campaign/main.jpg', '/videos/cards/36-v1.mp4'],
  ['/images/peptide_campaign/main-v2.jpg', '/videos/cards/37-v1.mp4'],
]

describe('product card hover videos', () => {
  it.each(MAPPED)('%s maps to an existing, light clip', (image, video) => {
    expect(cardVideoFor(image)).toBe(video)
    expect(fs.existsSync(path.join(PUBLIC, image))).toBe(true)
    const file = path.join(PUBLIC, video)
    expect(fs.existsSync(file)).toBe(true)
    expect(fs.statSync(file).size).toBeLessThan(400 * 1024)
  })

  it('returns null for unmapped or missing images', () => {
    expect(cardVideoFor('/images/eye_serum/main-v2.jpg')).toBeNull()
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
