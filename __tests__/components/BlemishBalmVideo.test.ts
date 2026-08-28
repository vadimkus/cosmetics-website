import fs from 'node:fs'
import path from 'node:path'

import { BLEMISH_BALM_COPY } from '@/components/product/blemishbalm/blemishBalmCopy'

describe('Blemish Balm bespoke product video', () => {
  const source = fs.readFileSync(
    path.join(process.cwd(), 'components/product/blemishbalm/BlemishBalmProductPage.tsx'),
    'utf8'
  )

  it('renders the clip only when the record carries one', () => {
    expect(source).toContain('{product.videoUrl ? (')
    expect(source).toContain('<video')
    expect(source).toContain('src={product.videoUrl}')
  })

  it('holds the frame portrait, because the export is 1080x1920', () => {
    expect(source).toContain('aspect-[9/16]')
  })

  it('ships the asset the record points at', () => {
    expect(fs.existsSync(path.join(process.cwd(), 'public/videos/blemish_story.mp4'))).toBe(true)
  })

  it('carries video copy in all three languages', () => {
    for (const locale of ['en', 'ru', 'ar'] as const) {
      const { video } = BLEMISH_BALM_COPY[locale]
      expect(video.eyebrow.trim().length).toBeGreaterThan(0)
      expect(video.title.trim().length).toBeGreaterThan(0)
      expect(video.body.trim().length).toBeGreaterThan(0)
      expect(video.unsupported.trim().length).toBeGreaterThan(0)
    }
  })

  it('keeps the three languages distinct, so none silently falls back to English', () => {
    const titles = (['en', 'ru', 'ar'] as const).map((l) => BLEMISH_BALM_COPY[l].video.title)
    expect(new Set(titles).size).toBe(3)
  })
})
