import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'

import { getBioMesoCopy } from '@/components/product/biomeso/biomesoCopy'
import { getHowFilmCopy, HOW_FILM_CARD_FOR_STEP, HOW_FILM_MEDIA } from '@/components/product/biomeso/biomesoHowFilmCopy'

const locales = ['en', 'ru', 'ar'] as const

/**
 * The 21 Aug 2026 audit removed these claims from product 65 (data/product65LocalizedCopy.ts, product65LocalizedCopy.test.ts),
 * and the 27 Oct claim file keeps the boundary: a film is a claim too. The film shows the documented method only, so none
 * of this may appear in its words in any language (the English list mirrors the RU/AR one).
 */
const forbidden = [
  /прям\w+ проникнов|اختراق\w* مباشر|direct penetration|penetrat/i,
  /созда\w+ микроканал|открыва\w+ микроканал|تُنشئ قنوات دقيقة|قنوات دقيقة|micro-?channel/i,
  /эквивалент\w* игл|يعادل.{0,12}إبر|needle equivalen/i,
  /био-?пилинг|تقشير حيوي|bio-?peel/i,
  /регенерац\w+|تجديد البشرة|regenerat|turnover/i,
  /обновля|يتجدد|التجدد|renew/i,
  /коллаген|эластин|الكولاجين|الإيلاستين|collagen|elastin/i,
  /укрепля\w+ барьер|تقوية الحاجز|barrier/i,
  /цитокин|السيتوكينات|cytokine/i,
  /глубок\w+|ترطيب عميق|\bdeep(ly)?\b/i,
  /шесть дней|шестому дню|шестой день|ستة أيام|اليوم السادس|six[- ]day|day (three|five|six)|by day/i,
  /все типы кожи|جميع أنواع البشرة|all skin types/i,
]

const everyWord = (locale: string) => {
  const copy = getHowFilmCopy(locale)
  return JSON.stringify([copy.steps, { ...copy.ui, stepOf: copy.ui.stepOf(2, 3) }])
}

describe('BIO-MESO 65 "How to use it" film copy', () => {
  it('has the same three steps, in the same order, in English, Russian and Arabic', () => {
    for (const locale of locales) {
      const copy = getHowFilmCopy(locale)
      expect(copy.steps.map(s => s.id)).toEqual(['spread', 'press', 'mask'])
      for (const step of copy.steps) {
        for (const field of [step.eyebrow, step.title, step.body, step.alt]) {
          expect(typeof field).toBe('string')
          expect(field.trim().length).toBeGreaterThan(3)
        }
      }
      for (const field of [copy.ui.region, copy.ui.play, copy.ui.pause, copy.ui.replay, copy.ui.previous, copy.ui.next, copy.ui.stage, copy.ui.hintTouch]) {
        expect(field.trim().length).toBeGreaterThan(1)
      }
      expect(copy.ui.stepOf(2, 3)).toMatch(/2/)
      expect(copy.ui.stepOf(2, 3)).toMatch(/3/)
      expect(copy.ui.hintKeys).toHaveLength(2)
    }
    expect(getHowFilmCopy('fr').steps[0].title).toBe(getHowFilmCopy('en').steps[0].title)
  })

  it('states only the documented method: 3 ml, press with palms or fingers, rolling for 30 seconds, the mask for 10 to 15 minutes', () => {
    const en = everyWord('en')
    for (const value of ['3 ml', 'palms or fingers', '30 seconds', 'Skin Reboot PDRN Mask', '10 to 15 minutes']) expect(en).toContain(value)
    const ru = everyWord('ru')
    for (const value of ['3 ml', 'ладонями или пальцами', 'роллинг', '30 секунд', 'Skin Reboot PDRN Mask', '10-15 минут']) expect(ru).toContain(value)
    const ar = everyWord('ar')
    for (const value of ['3 ml', 'بالراحتين أو الأصابع', 'تمرير', '30 ثانية', 'Skin Reboot PDRN Mask', '10-15 دقيقة']) expect(ar).toContain(value)
  })

  it('keeps the audited-out mechanism, renewal and benefit claims out of every language', () => {
    for (const locale of locales) {
      const words = everyWord(locale)
      for (const pattern of forbidden) expect(words).not.toMatch(pattern)
    }
  })

  it('lights up cards that exist on the page in every language', () => {
    expect(HOW_FILM_CARD_FOR_STEP).toHaveLength(3)
    for (const locale of locales) {
      const cards = getBioMesoCopy(locale).howTo.steps.length
      HOW_FILM_CARD_FOR_STEP.forEach((card, i) => {
        expect(card).toBeLessThan(cards)
        if (i > 0) expect(card).toBeGreaterThan(HOW_FILM_CARD_FOR_STEP[i - 1] ?? Number.POSITIVE_INFINITY)
      })
    }
  })

  it('points at three different, versioned, reasonably small files that are really in /public', () => {
    const hashes = new Set<string>()
    for (const media of HOW_FILM_MEDIA) {
      for (const [file, ext, maxKb] of [
        [media.poster, '.jpg', 250],
        [media.video, '.mp4', 3500],
      ] as const) {
        expect(file).toMatch(/-v\d+\.(jpg|mp4)$/)
        expect(file.endsWith(ext)).toBe(true)
        const onDisk = path.join(process.cwd(), 'public', file)
        expect(fs.existsSync(onDisk)).toBe(true)
        expect(fs.statSync(onDisk).size).toBeLessThan(maxKb * 1024)
      }
      hashes.add(crypto.createHash('sha256').update(fs.readFileSync(path.join(process.cwd(), 'public', media.video))).digest('hex'))
    }
    // three different films: a stand-in copied over another step would fail here
    expect(hashes.size).toBe(3)
  })
})
